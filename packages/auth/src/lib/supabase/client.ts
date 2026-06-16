import type { Database } from "@carbon/database";
import { wrapSoftDeleteClient } from "@carbon/database/soft-delete";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import type { MutableRefObject } from "react";
import type { StoreApi } from "zustand";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../../config/env";

const PER_ATTEMPT_TIMEOUT_MS = 25_000;
const MAX_RETRIES = 2;
const BACKOFF_MS = [500, 1000];
const RETRYABLE_STATUS = new Set([500, 502, 503, 504, 512, 408, 524]);

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const fetchWithRetry: typeof fetch = async (input, init) => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const timeoutSignal = AbortSignal.timeout(PER_ATTEMPT_TIMEOUT_MS);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, timeoutSignal])
      : timeoutSignal;

    try {
      const response = await fetch(input, { ...init, signal });
      if (RETRYABLE_STATUS.has(response.status) && attempt < MAX_RETRIES) {
        await sleep(BACKOFF_MS[attempt] ?? 1000);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error;
      if (init?.signal?.aborted) throw error;
      if (attempt >= MAX_RETRIES) throw error;
      await sleep(BACKOFF_MS[attempt] ?? 1000);
    }
  }
  throw lastError;
};

export const getCarbonClient = (
  supabaseKey: string,
  accessToken?: string,
  options?: { deletedBy?: string | null }
): SupabaseClient<Database, "public"> => {
  const headers = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : undefined;

  const client = createClient<Database, "public">(SUPABASE_URL!, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: fetchWithRetry,
      ...(headers ? { headers } : {})
    }
  });

  return wrapSoftDeleteClient(client, options);
};

export const getCarbonAPIKeyClient = (apiKey: string) => {
  const client = createClient<Database, "public">(
    SUPABASE_URL!,
    SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: fetchWithRetry,
        headers: {
          "carbon-key": apiKey
        }
      }
    }
  );

  return wrapSoftDeleteClient(client);
};

export const createCarbonWithAuthGetter = (
  store: MutableRefObject<StoreApi<{ accessToken: string }>>
) => {
  const client = wrapSoftDeleteClient(
    createClient<Database, "public">(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        fetch: fetchWithRetry
      },
      async accessToken() {
        if (!store.current) return null;
        const state = store.current.getState();
        return state.accessToken;
      }
    })
  );

  return client;
};

export const getCarbon = (
  accessToken?: string,
  deletedBy?: string | null
) => {
  return getCarbonClient(SUPABASE_ANON_KEY!, accessToken, { deletedBy });
};

export const carbonClient = getCarbon();
