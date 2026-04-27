import { useState } from "react";
import {SNIPPETS} from "../data/snippets";
import type {Lang} from "../hooks/useLang";
import {highlightPython} from "../lib/highlight";
import {Icon} from "./icons";

export function CodePlayground({lang}: {lang: Lang}) {
    const [activeId, setActiveId] = useState(SNIPPETS[0].id);
    const [copied, setCopied] = useState(false);

    const snip = SNIPPETS.find((s) => s.id === activeId)!;
    const lineCount = snip.code.split("\n").length;
    const html = highlightPython(snip.code);

    const copy = () => {
        navigator.clipboard.writeText(snip.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="code-grid">
            <aside className="code-files">
                <div className="code-files-title">
                    <Icon.Folder /> <span>app/</span>
                </div>
                {SNIPPETS.map((s) => (
                    <div
                        key={s.id}
                        className={'code-file ${s.id === activeId ? "active" : ""}'}
                        onClick={() => setActiveId(s.id)}
                        title={s.title}
                    >
                        <span className="code-file-icon"><Icon.File/></span>
                        <span style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                            {s.file.split("/").pop()}
                        </span>
                    </div>
                ))}
            </aside>

            <div className="code-area">
                <div className="code-tab-bar">
                    <div className="code-active-tab">
                        <Icon.File />
                        <span>{snip.file}</span>
                    </div>
                    <div className="code-actions">
                        <button className={'copy-btn ${copied ? "copied" : ""}'} onClick={copy}>
                            {copied ? (
                                <>
                                    <Icon.Check /> copied
                                </>
                            ) : (
                                <>
                                    <Icon.Copy /> copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="code-block">
                    <div className="code-gutter">
                        {Array.from({length: lineCount}, (_, i) => (
                            <div key={i}>{i + 1}</div>
                        ))}
                    </div>
                    <pre className="code-content" dangerouslySetInnerHTML={{__html: html}} />
                </div>

                <div className="code-info">
                    <div style={{flex: "1 1 280px", minWidth: 0}}>
                        <div style={{color:"var(--fg-0)", fontWeight: 500, marginBottom: 4}}>{snip.title}</div>
                        <div>{snip.desc[lang]}</div>
                    </div>
                    <div className="code-info-tags">
                        {snip.tags.map((t) => (
                            <span className="code-info-tag" key={t}>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}