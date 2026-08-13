/**
 * Provide dummy env for the integration suite.
 *
 * Importing a service module pulls in `@carbon/auth` → `@carbon/env`, which
 * validates required env vars at import time (throws if missing). The tests
 * don't use these services — they only need the module to import — so we supply
 * harmless placeholders for the required infra/secret vars.
 *
 * Runs as a vitest setupFile, i.e. before the test file's imports are
 * evaluated. Only fills vars that are unset, so a real local/CI env wins.
 */
const defaults: Record<string, string> = {
  // Makes INNGEST_SIGNING_KEY / INNGEST_EVENT_KEY not-required.
  INNGEST_DEV: "true",
  // Supabase (the harness drives PostgREST via its own client; these just
  // satisfy import-time validation / any module-scope client construction).
  SUPABASE_URL: "http://127.0.0.1:54321",
  SUPABASE_ANON_KEY: "test-anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
  SUPABASE_JWT_SECRET: "super-secret-jwt-token-with-at-least-32-characters-long",
  SUPABASE_DB_URL: "postgresql://postgres:postgres@127.0.0.1:5432/postgres",
  REDIS_URL: "redis://127.0.0.1:6379",
  SESSION_SECRET: "test-session-secret",
};

for (const [key, value] of Object.entries(defaults)) {
  if (!process.env[key]) process.env[key] = value;
}
