const BASE = (import.meta.env.VITE_API_URL ?? "/api/v1").replace(/\/$/, "");

export class ApiError extends Error {
    constructor(public status: number, public body: unknown, message: string) {
        super(message);
    }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: { "content-type": "application/json", accept: "application/json" },
        ...init,
    });

    const text = await res.text();
    const body = text ? JSON.parse(text) : null;

    if (!res.ok) {
        throw new ApiError(res.status, body, 'HTTP ${res.status}');
    }
    return body as T;
}

export interface Me {
    id: string;
    name: string;
    role: string;
    location: string;
    timezone: string;
    years_of_experience: number;
    primary_language: string;
    available_for_hire: boolean;
    remote_friendly: boolean;
    languages_spoken: string[];
}

export interface Skills {
    backend: {frameworks: string[]; orm: string[]; validation: string[]};
    databases: string[];
    message_brokers: string[];
    frontend: string[];
    devops: string[];
    total_skills: number;
}

export interface ContactIn {
    name: string;
    email: string;
    message: string;
}

export interface ContactOut {
    message_id: string;
    delivered: boolean;
    channel: string;
    will_reply_within: string;
    timestamp: string;
}

export interface GithubProfile {
    username: string;
    url: string;
    public_repos: number;
    primary_languages: string[];
    contribution_last_year: number;
}

export const api = {
    me: () => request<Me>("/me"),
    skills: () => request<Skills>("/skills"),
    github: () => request<GithubProfile>("/github"),
    contact: (body: ContactIn) =>
        request<ContactOut>("/contact", {
            method: "POST",
            body: JSON.stringify(body),
        })
}