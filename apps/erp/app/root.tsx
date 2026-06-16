import {
  CONTROLLED_ENVIRONMENT,
  DISABLE_VERCEL_ANALYTICS,
  error,
  getBrowserEnv
} from "@carbon/auth";
import { flashClientMiddleware } from "@carbon/auth/middleware/flash.client";
import {
  flashHeadersContext,
  flashMiddleware,
  flashResultContext
} from "@carbon/auth/middleware/flash.server";
import { cookieDomainMigrationMiddleware } from "@carbon/auth/session.server";
import { validator } from "@carbon/form";
import { LocaleProvider, resolveLanguage } from "@carbon/locale";
import {
  Button,
  Heading,
  OperatingSystemContextProvider,
  Toaster,
  TooltipProvider,
  toast,
  useMode,
  useMount
} from "@carbon/react";
import type { TextSize, Theme } from "@carbon/utils";
import {
  DEFAULT_TEXT_SIZE,
  getPreferenceHeaders,
  modeValidator,
  themes
} from "@carbon/utils";
import { I18nProvider } from "@react-aria/i18n";
import { QueryClient } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import type React from "react";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction
} from "react-router";
import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from "react-router";
import SonnerStyle from "sonner/dist/styles.css?url";
import { NavigationProgress } from "~/components/NavigationProgress";
import { useTextSize } from "~/hooks/useTextSize";
import { loadLinguiCatalogForRequest } from "~/services/lingui.server";
import { getMode, setMode } from "~/services/mode.server";
import { getTextSize } from "~/services/textSize.server";
import Background from "~/styles/background.css?url";
import NProgress from "~/styles/nprogress.css?url";
import Tailwind from "~/styles/tailwind.css?url";
import type { Route } from "./+types/root";
import "./polyfill";
import { getTheme } from "./services/theme.server";

export const middleware = [flashMiddleware, cookieDomainMigrationMiddleware];
export const clientMiddleware = [flashClientMiddleware];

// Prevent stale-asset 404s after a redeploy by never caching the HTML document.
export const headers: Route.HeadersFunction = ({ loaderHeaders }) => {
  const merged = new Headers(loaderHeaders);
  merged.set("Cache-Control", "no-store");
  return merged;
};

export const links: LinksFunction = () => {
  return [
    { href: Tailwind, rel: "stylesheet" },
    { href: Background, rel: "stylesheet" },
    { href: NProgress, rel: "stylesheet" },
    { href: SonnerStyle, rel: "stylesheet" },
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/carbon-mark-light.svg",
      media: "(prefers-color-scheme: light)"
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/carbon-mark-dark.svg",
      media: "(prefers-color-scheme: dark)"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png"
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "/favicon-16x16.png"
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png"
    },
    { rel: "manifest", href: "/site.webmanifest" }
  ];
};

export const meta: MetaFunction = () => {
  return [
    {
      title: "Jilio"
    }
  ];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const {
    AUTH_PROVIDERS,
    CARBON_EDITION,
    CARBON_API_URL,
    CLOUDFLARE_TURNSTILE_SITE_KEY,
    CONTROLLED_ENVIRONMENT,
    DISABLE_VERCEL_ANALYTICS,
    ERP_URL,
    GOOGLE_PLACES_API_KEY,
    JIRA_CLIENT_ID,
    MES_URL,
    ONSHAPE_CLIENT_ID,
    POSTHOG_API_HOST,
    POSTHOG_PROJECT_PUBLIC_KEY,
    QUICKBOOKS_CLIENT_ID,
    SUPABASE_ANON_KEY,
    SUPABASE_URL,
    DEFAULT_LANGUAGE,
    VERCEL_ENV,
    VERCEL_URL,
    XERO_CLIENT_ID
  } = getBrowserEnv();

  const preferences = getPreferenceHeaders(request);
  const appLanguage = resolveLanguage(preferences.locale);
  const linguiCatalog = await loadLinguiCatalogForRequest(request, appLanguage);

  return data(
    {
      env: {
        AUTH_PROVIDERS,
        CARBON_API_URL,
        CARBON_EDITION,
        CLOUDFLARE_TURNSTILE_SITE_KEY,
        CONTROLLED_ENVIRONMENT,
        DISABLE_VERCEL_ANALYTICS,
        DEFAULT_LANGUAGE,
        ERP_URL,
        GOOGLE_PLACES_API_KEY,
        JIRA_CLIENT_ID,
        MES_URL,
        ONSHAPE_CLIENT_ID,
        POSTHOG_API_HOST,
        POSTHOG_PROJECT_PUBLIC_KEY,
        QUICKBOOKS_CLIENT_ID,
        SUPABASE_ANON_KEY,
        SUPABASE_URL,
        VERCEL_ENV,
        VERCEL_URL,
        XERO_CLIENT_ID
      },
      linguiCatalog,
      mode: getMode(request),
      preferences: getPreferenceHeaders(request),
      result: context.get(flashResultContext),
      textSize: getTextSize(request),
      theme: getTheme(request)
    },
    {
      headers: context.get(flashHeadersContext) ?? undefined
    }
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const contentType = request.headers.get("content-type") ?? "";
  if (
    !contentType.includes("multipart/form-data") &&
    !contentType.includes("application/x-www-form-urlencoded")
  ) {
    return data({ error: "Invalid content type" }, { status: 400 });
  }

  const validation = await validator(modeValidator).validate(
    await request.formData()
  );

  if (validation.error) {
    return data(error(validation.error, "Invalid mode"), {
      status: 400
    });
  }

  return data(
    {},
    {
      headers: { "Set-Cookie": setMode(validation.data.mode) }
    }
  );
}

export function Document({
  children,
  title = "Jilio",
  lang = "en",
  mode = "light",
  theme = "zinc",
  textSize = DEFAULT_TEXT_SIZE
}: {
  children: React.ReactNode;
  title?: string;
  lang?: string;
  mode?: "light" | "dark";
  theme?: string;
  textSize?: TextSize;
}) {
  const selectedTheme = themes.find((t) => t.name === theme) as
    | Theme
    | undefined;

  // Create style objects for both light and dark modes
  const lightVars: Record<string, string> = {};
  const darkVars: Record<string, string> = {};

  if (selectedTheme) {
    // Set light mode variables
    Object.entries(selectedTheme.cssVars.light).forEach(([key, value]) => {
      const cssKey = `--${key}`;
      lightVars[cssKey] = `${value}`;
    });

    // Set dark mode variables
    Object.entries(selectedTheme.cssVars.dark).forEach(([key, value]) => {
      const cssKey = `--${key}`;
      darkVars[cssKey] = `${value}`;
    });
  }

  // Combine the styles with proper selectors. `fontSize` on <html> scales the
  // whole rem-based UI (text + spacing) to the user's chosen text size.
  const themeStyle = {
    ...(mode === "light" ? lightVars : darkVars),
    "--radius": "0.675rem",
    fontSize: `${textSize}%`
  } as React.CSSProperties;

  return (
    <html
      lang={lang}
      className={`${mode} h-full overflow-x-hidden`}
      style={themeStyle}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <Meta />
        <title>{title}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=6" />
        <link rel="shortcut icon" href="/favicon.ico?v=6" />
        <link rel="manifest" href="/site.webmanifest" />
        <Links />
      </head>
      <body className="h-full overflow-hidden bg-background antialiased selection:bg-primary/10 selection:text-primary">
        {children}
        <Toaster position="bottom-right" visibleToasts={5} />
        <ScrollRestoration />
        <Scripts />
        {!CONTROLLED_ENVIRONMENT && !DISABLE_VERCEL_ANALYTICS && <Analytics />}
      </body>
    </html>
  );
}

export default function App() {
  const loaderData = useLoaderData<typeof loader>();
  const env = loaderData?.env ?? {};
  const theme = loaderData?.theme ?? "zinc";
  const prefs = loaderData?.preferences;
  const linguiCatalog = loaderData?.linguiCatalog;
  const appLanguage = resolveLanguage(prefs.locale);
  const mode = useMode();
  const textSize = useTextSize();

  useMount(() => {
    // Flash toasts from full-page redirects (e.g. OAuth callbacks) don't fire
    // the clientMiddleware (which only runs on client-side navigations), so we
    // fire them here on initial mount instead.
    const result = loaderData?.result;
    if (result?.success === true) {
      toast.success(result.message);
    } else if (result?.success === false && result?.message) {
      toast.error(result.message);
    }

    if (!window.clientCache) {
      window.clientCache = new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: Infinity,
            refetchOnWindowFocus: false,
            staleTime: Infinity
          }
        }
      });
    }
  });

  return (
    <OperatingSystemContextProvider platform={prefs.platform}>
      <LocaleProvider locale={appLanguage} catalog={linguiCatalog}>
        <I18nProvider locale={prefs.locale}>
          <TooltipProvider delayDuration={200}>
            <Document
              mode={mode}
              theme={theme}
              textSize={textSize}
              lang={appLanguage}
            >
              <NavigationProgress />
              <Outlet />
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.env = ${JSON.stringify(env)};`
                }}
              />
            </Document>
          </TooltipProvider>
        </I18nProvider>
      </LocaleProvider>
    </OperatingSystemContextProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? (error.data.message ?? error.data)
    : error instanceof Error
      ? error.message
      : String(error);

  return (
    <Document title="Error!">
      <div className="light">
        <div className="flex flex-col w-full h-screen items-center justify-center space-y-4 ">
          <img
            src="/carbon-logo-mark.svg"
            alt="Jilio Logo"
            className="block max-w-[60px]"
          />
          <Heading size="h1">Something went wrong</Heading>
          <p className="text-muted-foreground max-w-2xl">{message}</p>
          <Button onClick={() => (window.location.href = "/")}>
            Back Home
          </Button>
        </div>
      </div>
    </Document>
  );
}
