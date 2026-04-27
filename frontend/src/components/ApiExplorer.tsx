/* ============================================
   ApiExplorer — calls real FastAPI endpoints
   ============================================ */
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import type { Lang } from "../hooks/useLang";
import { formatJson } from "../lib/formatJson";

type Method = "GET" | "POST";

interface Endpoint {
  id: string;
  method: Method;
  path: string;
  desc: Record<Lang, string>;
  call: () => Promise<unknown>;
  fallback: unknown;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: "me",
    method: "GET",
    path: "/api/v1/me",
    desc: { ru: "Карточка разработчика", en: "Developer card" },
    call: () => api.me(),
    fallback: { error: "backend unreachable", hint: "start uvicorn at :8000" },
  },
  {
    id: "skills",
    method: "GET",
    path: "/api/v1/skills",
    desc: { ru: "Стек технологий", en: "Tech stack" },
    call: () => api.skills(),
    fallback: { error: "backend unreachable" },
  },
  {
    id: "github",
    method: "GET",
    path: "/api/v1/github",
    desc: { ru: "GitHub профиль", en: "GitHub profile" },
    call: () => api.github(),
    fallback: { error: "backend unreachable" },
  },
  {
    id: "contact",
    method: "POST",
    path: "/api/v1/contact",
    desc: { ru: "Отправить сообщение (демо)", en: "Send a message (demo)" },
    call: () =>
      api.contact({
        name: "Demo User",
        email: "demo@example.dev",
        message: "Hello from the API explorer!",
      }),
    fallback: {
      message_id: "msg_demo",
      delivered: false,
      channel: "demo",
      will_reply_within: "4h",
      timestamp: new Date().toISOString(),
    },
  },
];

interface Response {
  status: number;
  ms: number;
  body: unknown;
}

export function ApiExplorer({ lang }: { lang: Lang }) {
  const [activeId, setActiveId] = useState(ENDPOINTS[0].id);
  const [tab, setTab] = useState<"response" | "headers" | "desc">("response");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);
  const [copied, setCopied] = useState(false);

  const ep = useMemo(() => ENDPOINTS.find((e) => e.id === activeId)!, [activeId]);

  // auto-fetch on switch
  useEffect(() => {
    void send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  async function send() {
    setLoading(true);
    setResponse(null);
    const t0 = performance.now();
    try {
      const body = await ep.call();
      setResponse({
        status: ep.method === "POST" ? 201 : 200,
        ms: Math.round(performance.now() - t0) as number,
        body,
      });
    } catch (err) {
      setResponse({
        status: 0,
        ms: Math.round(performance.now() - t0) as number,
        body: ep.fallback,
      });
      console.error("API call failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const copy = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response.body, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="api-explorer">
      <aside className="api-sidebar">
        <div className="api-sidebar-title">{lang === "ru" ? "Эндпоинты" : "Endpoints"}</div>
        {ENDPOINTS.map((e) => (
          <div
            key={e.id}
            className={`endpoint-item ${e.id === activeId ? "active" : ""}`}
            onClick={() => setActiveId(e.id)}
          >
            <span className={`method method-${e.method.toLowerCase()}`}>{e.method}</span>
            <span className="endpoint-path">{e.path.replace("/api/v1", "")}</span>
          </div>
        ))}
      </aside>

      <div className="api-main">
        <div className="api-url-bar">
          <div className="api-url">
            <span className={`method method-${ep.method.toLowerCase()} method-badge`}>{ep.method}</span>
            <span className="api-url-text">
              <span className="host">https://api.denis.dev</span>
              {ep.path}
            </span>
          </div>
          <button className="api-send" onClick={send} disabled={loading}>
            {loading ? (lang === "ru" ? "Отправка…" : "Sending…") : "Send →"}
          </button>
        </div>

        <div className="api-tabs">
          <button className={`api-tab ${tab === "response" ? "active" : ""}`} onClick={() => setTab("response")}>
            Response
          </button>
          <button className={`api-tab ${tab === "headers" ? "active" : ""}`} onClick={() => setTab("headers")}>
            Headers
          </button>
          <button className={`api-tab ${tab === "desc" ? "active" : ""}`} onClick={() => setTab("desc")}>
            {lang === "ru" ? "Описание" : "Description"}
          </button>
        </div>

        <div className="api-content">
          {tab === "response" && (
            <>
              <div className="api-section-label">
                <span>response body</span>
                <div className="api-status">
                  {response && !loading && (
                    <>
                      <span className={`status-pill ${response.status >= 200 && response.status < 300 ? "status-200" : ""}`}>
                        {response.status || "ERR"} {response.status >= 200 && response.status < 300 ? "OK" : "FAILED"}
                      </span>
                      <span style={{ color: "var(--fg-3)" }}>{response.ms}ms</span>
                      <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
                        {copied ? `✓ ${lang === "ru" ? "скопировано" : "copied"}` : lang === "ru" ? "копировать" : "copy"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {loading || !response ? (
                <div className="api-loading">
                  <div className="spinner" />
                  <span>{lang === "ru" ? "выполняем запрос…" : "sending request…"}</span>
                </div>
              ) : (
                <pre className="json-view" dangerouslySetInnerHTML={{ __html: formatJson(response.body) }} />
              )}
            </>
          )}
          {tab === "headers" && (
            <pre
              className="json-view"
              dangerouslySetInnerHTML={{
                __html: formatJson({
                  "content-type": "application/json; charset=utf-8",
                  "x-request-id": `req_${ep.id}_a1b2c3`,
                  "x-response-time": `${response?.ms ?? 0}ms`,
                  "cache-control": "no-cache",
                  server: "uvicorn",
                }),
              }}
            />
          )}
          {tab === "desc" && (
            <div className="json-view" style={{ whiteSpace: "pre-wrap", color: "var(--fg-1)" }}>
              <div style={{ color: "var(--accent)", marginBottom: 8 }}>
                {ep.method} {ep.path}
              </div>
              <div style={{ color: "var(--fg-2)" }}>{ep.desc[lang]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
