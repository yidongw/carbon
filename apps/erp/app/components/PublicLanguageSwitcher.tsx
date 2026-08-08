import {
  getSortedLanguageSelectOptions,
  resolveLanguage
} from "@carbon/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { useCallback, useMemo, useState } from "react";
import { LuLanguages } from "react-icons/lu";

/**
 * Language picker for unauthenticated pages (login, invite, verify, …).
 * The avatar-menu switcher is only available after sign-in; `/api/locale`
 * was already public, but the login UI that called it was removed when
 * language moved into the avatar menu.
 */
export function PublicLanguageSwitcher() {
  const { t } = useLingui();
  const { locale } = useLocale();
  const resolvedLocale = resolveLanguage(locale);
  const options = useMemo(
    () => getSortedLanguageSelectOptions(locale),
    [locale]
  );
  const [switchingLocale, setSwitchingLocale] = useState<string | null>(null);

  const switchLanguage = useCallback(
    (nextLocale: string) => {
      if (nextLocale === resolvedLocale) return;
      const body = new FormData();
      body.set("locale", nextLocale);
      setSwitchingLocale(nextLocale);
      // Hard reload so the root loader re-reads the cookie and serves the new
      // catalog (same pattern as AvatarMenu).
      fetch("/api/locale", {
        method: "post",
        body,
        credentials: "same-origin"
      }).finally(() => window.location.reload());
    },
    [resolvedLocale]
  );

  return (
    <Select
      value={resolvedLocale}
      onValueChange={switchLanguage}
      disabled={switchingLocale !== null}
    >
      <SelectTrigger
        size="sm"
        className="w-auto min-w-[9rem] gap-2"
        aria-label={t`Language`}
      >
        <LuLanguages className="h-4 w-4 shrink-0 opacity-70" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
