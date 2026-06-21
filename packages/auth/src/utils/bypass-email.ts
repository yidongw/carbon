import { DEV_BYPASS_EMAIL } from "../config/env";

export function isBypassEmail(email: string | null | undefined): boolean {
  if (!email || !DEV_BYPASS_EMAIL) return false;

  return DEV_BYPASS_EMAIL.split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export function isBypassSession(session: {
  email?: string | null;
  bypass?: boolean;
}): boolean {
  return Boolean(session.bypass) || isBypassEmail(session.email);
}
