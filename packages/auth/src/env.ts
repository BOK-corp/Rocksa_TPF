const fromProcess = (key: string): string | undefined =>
  typeof process !== "undefined" ? process.env[key] : undefined;

const fromVite = (key: string): string | undefined => {
  try {
    return (import.meta as unknown as { env: Record<string, string | undefined> })
      .env[key];
  } catch {
    return undefined;
  }
};

export const readEnv = (key: string): string | undefined =>
  fromVite(key) ?? fromProcess(key);

export const apiBaseUrl = (): string =>
  readEnv("VITE_API_URL") ?? "http://localhost:8787";
