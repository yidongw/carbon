/**
 * Build a real `@supabase/supabase-js` client pointed at the harness's local
 * PostgREST, so service functions run against it unmodified.
 *
 * supabase-js issues requests to `${url}/rest/v1/...` (in production a Kong
 * gateway strips `/rest/v1` and forwards to PostgREST). There is no Kong here,
 * so a custom fetch rewrites that prefix to bare PostgREST at the root.
 */
import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "../types";

export function createTestClient(
  postgrestUrl: string,
  token: string
): SupabaseClient<Database> {
  const rewriteFetch: typeof fetch = (input, init) => {
    const original =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const rewritten = original
      .replace("/rest/v1/", "/")
      .replace(/\/rest\/v1$/, "");
    return fetch(rewritten, init);
  };

  return createClient<Database>(postgrestUrl, token, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: rewriteFetch },
  });
}
