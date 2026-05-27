import type { Result } from "./types.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (input: string): Result<string> =>
  EMAIL_RE.test(input)
    ? { ok: true, value: input.trim().toLowerCase() }
    : { ok: false, error: "Enter a valid email address." };

export const validatePassword = (input: string): Result<string> =>
  input.length >= 8
    ? { ok: true, value: input }
    : { ok: false, error: "Password must be at least 8 characters." };

export const validateRequired = (
  label: string,
  input: string,
): Result<string> =>
  input.trim().length > 0
    ? { ok: true, value: input.trim() }
    : { ok: false, error: `${label} is required.` };
