import { apiBaseUrl } from "./env.ts";

export interface SessionProfile {
  uid: string;
  email: string;
  role: string;
  fullName: string | null;
}

export interface SyncOptions {
  role?: string;
  fullName?: string | null;
}

export const syncSession = async (
  token: string,
  opts: SyncOptions = {},
): Promise<SessionProfile> => {
  const res = await fetch(`${apiBaseUrl()}/v1/me/sync`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(opts),
  });
  if (!res.ok) {
    throw new Error(`session sync failed (${res.status})`);
  }
  const data = (await res.json()) as { user: SessionProfile };
  return data.user;
};
