/* ============================================
   Skills metadata — used in SkillsGrid
   ============================================ */
import type { Lang } from "../hooks/useLang";

export interface SkillCard {
  cat: Record<Lang, string>;
  icon: string;
  name: string;
  tags: string[];
}

export const SKILLS: SkillCard[] = [
  {
    cat: { ru: "Веб-фреймворки", en: "Web frameworks" },
    icon: "⚡",
    name: "FastAPI",
    tags: ["async", "pydantic v2", "OpenAPI", "JWT", "WebSockets"],
  },
  {
    cat: { ru: "Веб-фреймворки", en: "Web frameworks" },
    icon: "🐍",
    name: "Flask",
    tags: ["blueprints", "Flask-RESTful", "Marshmallow", "gunicorn"],
  },
  {
    cat: { ru: "Базы данных", en: "Databases" },
    icon: "🗄",
    name: "PostgreSQL",
    tags: ["индексы", "EXPLAIN", "миграции", "JSONB", "partitioning"],
  },
  {
    cat: { ru: "ORM", en: "ORM" },
    icon: "🔗",
    name: "SQLAlchemy",
    tags: ["2.0 async", "Core + ORM", "relationship loading", "Alembic"],
  },
  {
    cat: { ru: "Кэш / очереди", en: "Cache / queues" },
    icon: "⚡",
    name: "Redis",
    tags: ["кэш", "pub/sub", "streams", "rate limiting", "sessions"],
  },
  {
    cat: { ru: "Брокеры сообщений", en: "Message brokers" },
    icon: "📨",
    name: "Apache Kafka",
    tags: ["producers/consumers", "partitioning", "aiokafka"],
  },
  {
    cat: { ru: "Валидация", en: "Validation" },
    icon: "✓",
    name: "Pydantic",
    tags: ["v1 → v2", "validators", "settings", "serialization"],
  },
  {
    cat: { ru: "Frontend", en: "Frontend" },
    icon: "⚛",
    name: "React",
    tags: ["hooks", "TypeScript", "функциональные компоненты"],
  },
  {
    cat: { ru: "DevOps", en: "DevOps" },
    icon: "🐳",
    name: "Docker",
    tags: ["multi-stage", "docker-compose", "оптимизация образов"],
  },
];
