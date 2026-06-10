const fromVite = (key: string): string | undefined => {
  try {
    return (import.meta as unknown as { env: Record<string, string | undefined> })
      .env[key];
  } catch {
    return undefined;
  }
};

export const apiBaseUrl = (): string =>
  fromVite("VITE_API_URL") ?? "http://localhost:8787";
