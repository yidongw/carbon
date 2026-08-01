import { getActiveI18n } from "@carbon/locale";
import { serverFlashMessages, toast } from "@carbon/react";
import type { MiddlewareFunction } from "react-router";
import type { Result } from "../types";

/**
 * Localize a server-generated flash message. Server code (which can't reach the
 * app's Lingui catalog) sends the English source string; we look it up in
 * `serverFlashMessages` and render the matched `msg` descriptor via the active
 * catalog. The descriptor is required because Carbon's compiled catalog is
 * hash-keyed — a raw source string is never a catalog key. Unknown messages
 * (and the pre-hydration window before a catalog is active) pass through as-is.
 */
function localize(message: string | undefined): string | undefined {
  if (!message) return message;
  const descriptor = serverFlashMessages[message];
  const i18n = getActiveI18n();
  return descriptor && i18n ? i18n._(descriptor) : message;
}

type ClientMiddlewareResult = Record<
  string,
  { type: "data" | "error"; result: unknown }
>;

export const flashClientMiddleware: MiddlewareFunction<
  ClientMiddlewareResult
> = async (_args, next) => {
  const data = await next();

  const rootData = data?.root;
  if (rootData?.type === "data" && rootData.result) {
    const result = (rootData.result as Record<string, unknown>)
      .result as Result | null;
    if (result?.success === true) {
      toast.success(localize(result.message));
    } else if (result?.message) {
      toast.error(localize(result.message));
    }
  }

  return data;
};
