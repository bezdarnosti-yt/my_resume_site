/* ============================================
   formatJson — pretty-printer with HTML highlighting
   ============================================ */

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

export function formatJson(value: unknown, indent = 2): string {
  const pad = (n: number) => " ".repeat(n);

  function render(v: unknown, depth: number): string {
    if (v === null) return '<span class="json-null">null</span>';
    if (typeof v === "boolean") return `<span class="json-boolean">${v}</span>`;
    if (typeof v === "number") return `<span class="json-number">${v}</span>`;
    if (typeof v === "string") return `<span class="json-string">"${escapeHtml(v)}"</span>`;

    if (Array.isArray(v)) {
      if (v.length === 0) return '<span class="json-punc">[]</span>';
      const inner = v
        .map((item) => pad(indent * (depth + 1)) + render(item, depth + 1))
        .join('<span class="json-punc">,</span>\n');
      return `<span class="json-punc">[</span>\n${inner}\n${pad(indent * depth)}<span class="json-punc">]</span>`;
    }

    if (typeof v === "object") {
      const keys = Object.keys(v as object);
      if (keys.length === 0) return '<span class="json-punc">{}</span>';
      const inner = keys
        .map(
          (k) =>
            pad(indent * (depth + 1)) +
            `<span class="json-key">"${escapeHtml(k)}"</span><span class="json-punc">:</span> ` +
            render((v as Record<string, unknown>)[k], depth + 1)
        )
        .join('<span class="json-punc">,</span>\n');
      return `<span class="json-punc">{</span>\n${inner}\n${pad(indent * depth)}<span class="json-punc">}</span>`;
    }

    return escapeHtml(String(v));
  }

  return render(value, 0);
}
