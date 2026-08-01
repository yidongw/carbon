import { type I18n, setupI18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { type ReactNode, useMemo } from "react";
import { resolveLanguage } from "./config";

// The Lingui instance for the active locale, mirrored here so non-React code
// (e.g. the flash-toast middleware) can localize strings without `useLingui()`.
let activeI18n: I18n | null = null;

/** The active Lingui instance, or null before a `LocaleProvider` has mounted. */
export function getActiveI18n(): I18n | null {
  return activeI18n;
}

type LocaleProviderProps = {
  locale?: string | null;
  catalog?: Record<string, string>;
  children: ReactNode;
};

export function LocaleProvider({
  locale,
  catalog,
  children
}: LocaleProviderProps) {
  const language = resolveLanguage(locale);

  const i18n = useMemo(() => {
    const runtime = setupI18n();
    runtime.load(language, catalog ?? {});
    runtime.activate(language);
    return runtime;
  }, [catalog, language]);

  // Mirror the active instance for non-React consumers (idempotent per render).
  activeI18n = i18n;

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
}
