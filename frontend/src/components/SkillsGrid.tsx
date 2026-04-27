/* ============================================
   SkillsGrid — animated skill cards
   ============================================ */
import { useEffect, useRef } from "react";
import { SKILLS } from "../data/skills";
import type { Lang } from "../hooks/useLang";

interface Props {
  lang: Lang;
}

export function SkillsGrid({ lang }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
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
