import { firebaseAuth } from "@rocksa/auth";

const BASE = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "http://localhost:8787";

const getToken = async (): Promise<string | null> => {
  const u = firebaseAuth.currentUser;
  return u ? u.getIdToken() : null;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

interface Options {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export const api = async <T>(path: string, opts: Options = {}): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (opts.auth !== false) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    throw new ApiError(res.status, `${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
};

export const apiOptional = async <T>(path: string, opts: Options = {}): Promise<T | null> => {
  try {
    return await api<T>(path, opts);
  } catch {
    return null;
  }
};

export const apiDownload = async (path: string, filename: string): Promise<void> => {
  const headers: Record<string, string> = {};
  const token = await getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { headers });
  if (!res.ok) throw new ApiError(res.status, `${res.status} ${res.statusText}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};
