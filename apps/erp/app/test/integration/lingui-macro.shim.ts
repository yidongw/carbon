/**
 * Runtime shims for Lingui's compile-time macros, aliased in
 * vitest.integration.config.ts.
 *
 * Service modules transitively import `@carbon/react` (e.g. the generated
 * serverToastMessages catalog), which uses the `msg` / `Trans` / `useLingui`
 * macros. Those are normally compiled away by the Lingui Vite plugin; vitest
 * doesn't run that transform, so at runtime the macro exports aren't real
 * functions ("msg is not a function"). The integration tests never render UI or
 * assert on translations, so these lightweight stand-ins are enough to let the
 * modules import.
 */

// --- @lingui/core/macro ---

interface MessageDescriptor {
  id: string;
  message: string;
}

/** `msg\`...\`` → a MessageDescriptor (interpolations become {0}, {1}, …). */
export const msg = (
  strings: TemplateStringsArray,
  ...values: unknown[]
): MessageDescriptor => {
  const message = strings.reduce(
    (acc, part, i) => acc + part + (i < values.length ? `{${i}}` : ""),
    ""
  );
  return { id: message, message };
};

// --- @lingui/react/macro ---

/** `<Trans>` — returns its children; never actually rendered in these tests. */
export const Trans = (props: { children?: unknown }) => props?.children ?? null;

export const useLingui = () => ({
  i18n: {
    _: (m: unknown) =>
      typeof m === "string"
        ? m
        : ((m as MessageDescriptor)?.message ??
          (m as MessageDescriptor)?.id ??
          ""),
  },
  t: (s: unknown) => s,
});
