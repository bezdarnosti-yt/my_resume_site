/* ============================================
   SkillsGrid — animated skill cards
   ============================================ */
import { useEffect, useRef, useState } from "react";
import { SKILLS } from "../data/skills";
import type { Lang } from "../hooks/useLang";

interface Props {
  lang: Lang;
}

export function SkillsGrid({ lang }: Props) {
  const [isVisible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="skills-grid" ref={ref}>
      {SKILLS.map((s) => (
        <div className="skill-card" key={s.name}>
          <div className="skill-card-head">
            <span className="skill-cat">{s.cat[lang]}</span>
            <span className="skill-cat-icon">{s.icon}</span>
          </div>
          <div className="skill-name">{s.name}</div>
          <div className="skill-meta">
          </div>
          <div className="skill-tags">
            {s.tags.map((t) => (
              <span className="skill-tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
