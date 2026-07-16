"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XERO_CLIENT_SECRET = exports.XERO_CLIENT_ID = exports.VERCEL_URL = exports.DEV_BYPASS_EMAIL = exports.REFRESH_ACCESS_TOKEN_THRESHOLD = exports.BYPASS_SESSION_MAX_AGE = exports.SESSION_MAX_AGE = exports.REDIS_URL = exports.GTM_EVENTS_API_SECRET_KEY = exports.GTM_URL = exports.STRIPE_BYPASS_USER_IDS = exports.STRIPE_BYPASS_COMPANY_IDS = exports.STRIPE_WEBHOOK_SECRET = exports.STRIPE_SECRET_KEY = exports.SESSION_ERROR_KEY = exports.SESSION_KEY = exports.SESSION_SECRET = exports.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID = exports.SUPABASE_AUTH_EXTERNAL_AZURE_CLIENT_ID = exports.SUPABASE_DB_URL = exports.SUPABASE_JWT_SECRET = exports.SUPABASE_SERVICE_ROLE_KEY = exports.SLACK_STATE_SECRET = exports.SLACK_SIGNING_SECRET = exports.SLACK_OAUTH_REDIRECT_URL = exports.SLACK_CLIENT_SECRET = exports.SLACK_CLIENT_ID = exports.SLACK_BOT_TOKEN = exports.RESEND_DOMAIN = exports.QUICKBOOKS_WEBHOOK_SECRET = exports.QUICKBOOKS_CLIENT_SECRET = exports.QUICKBOOKS_CLIENT_ID = exports.ONSHAPE_OAUTH_REDIRECT_URL = exports.ONSHAPE_CLIENT_SECRET = exports.ONSHAPE_CLIENT_ID = exports.CONTROLLED_ENVIRONMENT = exports.GOOGLE_PLACES_API_KEY = exports.MES_URL = exports.ERP_URL = exports.INNGEST_EVENT_KEY = exports.INNGEST_SIGNING_KEY = exports.EXCHANGE_RATES_API_KEY = exports.DOMAIN = exports.CLOUDFLARE_TURNSTILE_SECRET_KEY = exports.CLOUDFLARE_TURNSTILE_SITE_KEY = exports.CARBON_API_URL = exports.CarbonEdition = exports.LOGIN_METHOD = exports.BINDERY_PRESS_API_KEY = exports.AUTH_PROVIDERS = void 0;
exports.RATE_LIMIT = exports.DEFAULT_LANGUAGE = exports.SUPABASE_URL_PUBLIC = exports.SUPABASE_ANON_KEY = exports.SUPABASE_URL = exports.POSTHOG_PROJECT_PUBLIC_KEY = exports.POSTHOG_API_HOST = exports.VERCEL_ENV = exports.NODE_ENV = exports.JIRA_STATE_SECRET = exports.JIRA_OAUTH_REDIRECT_URL = exports.JIRA_CLIENT_SECRET = exports.JIRA_CLIENT_ID = exports.ALIBABA_CLOUD_SMS_TEMPLATE_CODE = exports.ALIBABA_CLOUD_SMS_SIGN_NAME = exports.ALIBABA_CLOUD_ACCESS_KEY_SECRET = exports.ALIBABA_CLOUD_ACCESS_KEY_ID = exports.WECHAT_WEBHOOK_TOKEN = exports.WECHAT_MP_APP_SECRET = exports.WECHAT_MP_APP_ID = exports.XERO_WEBHOOK_SECRET = void 0;
exports.getEnv = getEnv;
exports.isAuthProviderEnabled = isAuthProviderEnabled;
exports.getAppUrl = getAppUrl;
exports.getMESUrl = getMESUrl;
exports.getBrowserEnv = getBrowserEnv;
exports.isVercel = isVercel;
/// <reference types="node" />
var utils_1 = require("@carbon/utils");
function getEnv(name, _a) {
    var _b;
    var _c = _a === void 0 ? { isRequired: true, isSecret: true } : _a, isRequired = _c.isRequired, isSecret = _c.isSecret;
    if (utils_1.isBrowser && isSecret)
        return "";
    var source = (_b = (utils_1.isBrowser ? window.env : process.env)) !== null && _b !== void 0 ? _b : {};
    var value = source[name];
    if (!value && isRequired) {
        throw new Error("".concat(name, " is not set"));
    }
    return value;
}
exports.AUTH_PROVIDERS = (_a = getEnv("AUTH_PROVIDERS", {
    isRequired: false,
    isSecret: false
})) !== null && _a !== void 0 ? _a : "email,google,azure";
function isAuthProviderEnabled(provider) {
    var AUTH_PROVIDERS_LIST = exports.AUTH_PROVIDERS.split(",").map(function (p) { return p.trim(); });
    return AUTH_PROVIDERS_LIST.includes(provider);
}
exports.BINDERY_PRESS_API_KEY = getEnv("BINDERY_PRESS_API_KEY", {
    isRequired: false,
    isSecret: true
});
/**
 * How existing users sign in with their email:
 *   "code"       (default) – a 6-digit verification code is emailed
 *   "magic-link"           – a magic link is emailed (legacy behavior)
 * Set LOGIN_METHOD=magic-link to switch back to magic links.
 */
exports.LOGIN_METHOD = getEnv("LOGIN_METHOD", {
    isRequired: false,
    isSecret: false
}) === "magic-link"
    ? "magic-link"
    : "code";
var CARBON_EDITION = getEnv("CARBON_EDITION", {
    isRequired: false,
    isSecret: false
});
var getEdition = function () {
    if (CARBON_EDITION === "cloud") {
        return utils_1.Edition.Cloud;
    }
    if (CARBON_EDITION === "enterprise") {
        return utils_1.Edition.Enterprise;
    }
    if (CARBON_EDITION === "test") {
        return utils_1.Edition.Test;
    }
    return utils_1.Edition.Community;
};
exports.CarbonEdition = getEdition();
exports.CARBON_API_URL = (_b = getEnv("CARBON_API_URL", {
    isRequired: false,
    isSecret: false
})) !== null && _b !== void 0 ? _b : getEnv("SUPABASE_URL", { isSecret: false });
exports.CLOUDFLARE_TURNSTILE_SITE_KEY = getEnv("CLOUDFLARE_TURNSTILE_SITE_KEY", { isRequired: false, isSecret: false });
exports.CLOUDFLARE_TURNSTILE_SECRET_KEY = getEnv("CLOUDFLARE_TURNSTILE_SECRET_KEY", { isRequired: false });
exports.DOMAIN = getEnv("DOMAIN", { isRequired: false }); // preview environments need no domain
exports.EXCHANGE_RATES_API_KEY = getEnv("EXCHANGE_RATES_API_KEY", {
    isRequired: false,
    isSecret: true
});
var INNGEST_DEV = getEnv("INNGEST_DEV", { isRequired: false });
exports.INNGEST_SIGNING_KEY = getEnv("INNGEST_SIGNING_KEY", {
    isRequired: !INNGEST_DEV,
    isSecret: true
});
exports.INNGEST_EVENT_KEY = getEnv("INNGEST_EVENT_KEY", {
    isRequired: !INNGEST_DEV,
    isSecret: true
});
exports.ERP_URL = (_c = getEnv("ERP_URL", { isRequired: false, isSecret: false })) !== null && _c !== void 0 ? _c : "https://app.carbon.ms";
exports.MES_URL = (_d = getEnv("MES_URL", { isRequired: false, isSecret: false })) !== null && _d !== void 0 ? _d : "https://mes.carbon.ms";
exports.GOOGLE_PLACES_API_KEY = getEnv("GOOGLE_PLACES_API_KEY", {
    isRequired: false
});
var itarEnvironment = getEnv("CONTROLLED_ENVIRONMENT", {
    isRequired: false,
    isSecret: false
});
exports.CONTROLLED_ENVIRONMENT = (0, utils_1.parseBoolean)(itarEnvironment, false);
exports.ONSHAPE_CLIENT_ID = getEnv("ONSHAPE_CLIENT_ID", {
    isRequired: false
});
exports.ONSHAPE_CLIENT_SECRET = getEnv("ONSHAPE_CLIENT_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.ONSHAPE_OAUTH_REDIRECT_URL = getEnv("ONSHAPE_OAUTH_REDIRECT_URL", {
    isRequired: false
});
exports.QUICKBOOKS_CLIENT_ID = getEnv("QUICKBOOKS_CLIENT_ID", {
    isRequired: false
});
exports.QUICKBOOKS_CLIENT_SECRET = getEnv("QUICKBOOKS_CLIENT_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.QUICKBOOKS_WEBHOOK_SECRET = getEnv("QUICKBOOKS_WEBHOOK_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.RESEND_DOMAIN = (_e = getEnv("RESEND_DOMAIN", {
    isRequired: false
})) !== null && _e !== void 0 ? _e : "carbon.ms";
exports.SLACK_BOT_TOKEN = getEnv("SLACK_BOT_TOKEN", {
    isRequired: false
});
exports.SLACK_CLIENT_ID = getEnv("SLACK_CLIENT_ID", {
    isRequired: false
});
exports.SLACK_CLIENT_SECRET = getEnv("SLACK_CLIENT_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.SLACK_OAUTH_REDIRECT_URL = getEnv("SLACK_OAUTH_REDIRECT_URL", {
    isRequired: false
});
exports.SLACK_SIGNING_SECRET = getEnv("SLACK_SIGNING_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.SLACK_STATE_SECRET = getEnv("SLACK_STATE_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.SUPABASE_SERVICE_ROLE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");
exports.SUPABASE_JWT_SECRET = getEnv("SUPABASE_JWT_SECRET", {
    isSecret: true,
    isRequired: false
});
exports.SUPABASE_DB_URL = getEnv("SUPABASE_DB_URL", {
    isRequired: true,
    isSecret: true
});
exports.SUPABASE_AUTH_EXTERNAL_AZURE_CLIENT_ID = getEnv("SUPABASE_AUTH_EXTERNAL_AZURE_CLIENT_ID", {
    isRequired: false,
    isSecret: true
});
exports.SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID = getEnv("SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID", {
    isRequired: false,
    isSecret: true
});
exports.SESSION_SECRET = getEnv("SESSION_SECRET");
exports.SESSION_KEY = "auth";
exports.SESSION_ERROR_KEY = "error";
exports.STRIPE_SECRET_KEY = getEnv("STRIPE_SECRET_KEY", {
    isRequired: false
});
exports.STRIPE_WEBHOOK_SECRET = getEnv("STRIPE_WEBHOOK_SECRET", {
    isRequired: false
});
exports.STRIPE_BYPASS_COMPANY_IDS = getEnv("STRIPE_BYPASS_COMPANY_IDS", {
    isRequired: false
});
exports.STRIPE_BYPASS_USER_IDS = getEnv("STRIPE_BYPASS_USER_IDS", {
    isRequired: false
});
exports.GTM_URL = getEnv("GTM_URL", {
    isRequired: false,
    isSecret: false
});
exports.GTM_EVENTS_API_SECRET_KEY = getEnv("GTM_EVENTS_API_SECRET_KEY", {
    isRequired: false,
    isSecret: true
});
exports.REDIS_URL = getEnv("REDIS_URL", {
    isRequired: true,
    isSecret: true
});
exports.SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days;
exports.BYPASS_SESSION_MAX_AGE = 60 * 60 * 24 * 365; // 1 year for dev bypass logins
exports.REFRESH_ACCESS_TOKEN_THRESHOLD = 60 * 10; // 10 minutes left before token expires
exports.DEV_BYPASS_EMAIL = getEnv("DEV_BYPASS_EMAIL", {
    isRequired: false,
    isSecret: false
});
exports.VERCEL_URL = getEnv("VERCEL_URL", { isSecret: false });
exports.XERO_CLIENT_ID = getEnv("XERO_CLIENT_ID", {
    isRequired: false
});
exports.XERO_CLIENT_SECRET = getEnv("XERO_CLIENT_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.XERO_WEBHOOK_SECRET = getEnv("XERO_WEBHOOK_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.WECHAT_MP_APP_ID = getEnv("WECHAT_MP_APP_ID", {
    isRequired: false,
    isSecret: false
});
exports.WECHAT_MP_APP_SECRET = getEnv("WECHAT_MP_APP_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.WECHAT_WEBHOOK_TOKEN = getEnv("WECHAT_WEBHOOK_TOKEN", {
    isRequired: false,
    isSecret: true
});
// Aliyun 号码认证服务 (Dypnsapi) — SMS verification-code login. Add "phone" to
// AUTH_PROVIDERS to surface the phone sign-in tab.
exports.ALIBABA_CLOUD_ACCESS_KEY_ID = getEnv("ALIBABA_CLOUD_ACCESS_KEY_ID", {
    isRequired: false,
    isSecret: false
});
exports.ALIBABA_CLOUD_ACCESS_KEY_SECRET = getEnv("ALIBABA_CLOUD_ACCESS_KEY_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.ALIBABA_CLOUD_SMS_SIGN_NAME = getEnv("ALIBABA_CLOUD_SMS_SIGN_NAME", {
    isRequired: false,
    isSecret: false
});
exports.ALIBABA_CLOUD_SMS_TEMPLATE_CODE = getEnv("ALIBABA_CLOUD_SMS_TEMPLATE_CODE", {
    isRequired: false,
    isSecret: false
});
exports.JIRA_CLIENT_ID = getEnv("JIRA_CLIENT_ID", {
    isRequired: false
});
exports.JIRA_CLIENT_SECRET = getEnv("JIRA_CLIENT_SECRET", {
    isRequired: false,
    isSecret: true
});
exports.JIRA_OAUTH_REDIRECT_URL = getEnv("JIRA_OAUTH_REDIRECT_URL", {
    isRequired: false
});
exports.JIRA_STATE_SECRET = getEnv("JIRA_STATE_SECRET", {
    isRequired: false,
    isSecret: true
});
/**
 * Shared envs
 */
exports.NODE_ENV = getEnv("NODE_ENV", {
    isRequired: false,
    isSecret: false
});
exports.VERCEL_ENV = (_f = getEnv("VERCEL_ENV", {
    isRequired: false,
    isSecret: false
})) !== null && _f !== void 0 ? _f : exports.NODE_ENV;
exports.POSTHOG_API_HOST = getEnv("POSTHOG_API_HOST", {
    isSecret: false
});
exports.POSTHOG_PROJECT_PUBLIC_KEY = getEnv("POSTHOG_PROJECT_PUBLIC_KEY", {
    isSecret: false
});
exports.SUPABASE_URL = getEnv("SUPABASE_URL", { isSecret: false });
exports.SUPABASE_ANON_KEY = getEnv("SUPABASE_ANON_KEY", {
    isSecret: false
});
// Browser-facing Supabase URL. The server talks to Supabase on localhost, but a
// browser reaching the app through a tunnel (see tunnel.sh) cannot — set
// SUPABASE_URL_PUBLIC to the API's public tunnel URL so the client, including
// the realtime websocket, connects to a reachable origin. Falls back to
// SUPABASE_URL when unset, so normal local dev is unaffected.
exports.SUPABASE_URL_PUBLIC = getEnv("SUPABASE_URL_PUBLIC", {
    isSecret: false,
    isRequired: false
});
exports.DEFAULT_LANGUAGE = (_g = getEnv("DEFAULT_LANGUAGE", {
    isRequired: false,
    isSecret: false
})) !== null && _g !== void 0 ? _g : "en";
exports.RATE_LIMIT = parseInt(getEnv("RATE_LIMIT", { isRequired: false, isSecret: false }) || "5", 10);
function getAppUrl() {
    var _a;
    if (exports.VERCEL_ENV === "production" || exports.NODE_ENV === "production") {
        return exports.ERP_URL
            ? exports.ERP_URL
            : exports.CONTROLLED_ENVIRONMENT
                ? "https://itar.carbon.ms"
                : "https://app.carbon.ms";
    }
    if (exports.VERCEL_ENV === "preview") {
        // ERP_URL takes precedence when set (e.g. a staging deployment with a
        // custom domain). Without it the PKCE callback URL would be the
        // Vercel-generated branch URL, which differs from the custom domain the
        // user browsed, causing the sb-pkce-cv cookie to be missing on /callback.
        // VERCEL_BRANCH_URL is stable for a branch (doesn't change per deploy).
        // VERCEL_URL is unique per deployment.
        return (exports.ERP_URL !== null && exports.ERP_URL !== void 0 ? exports.ERP_URL : "https://".concat((_a = process.env.VERCEL_BRANCH_URL) !== null && _a !== void 0 ? _a : process.env.VERCEL_URL));
    }
    // Dev: `crbn up` writes ERP_URL=https://<prefix>.erp.dev into .env.local.
    // Honor it so cross-app sidebar links resolve to the portless hostname
    // instead of the hardcoded localhost:3000 fallback.
    return exports.ERP_URL !== null && exports.ERP_URL !== void 0 ? exports.ERP_URL : "http://localhost:3000";
}
function getMESUrl() {
    var _a;
    if (exports.VERCEL_ENV === "production" || exports.NODE_ENV === "production") {
        return exports.MES_URL
            ? exports.MES_URL
            : exports.CONTROLLED_ENVIRONMENT
                ? "https://mes.itar.carbon.ms"
                : "https://mes.carbon.ms";
    }
    if (exports.VERCEL_ENV === "preview") {
        return "https://".concat((_a = process.env.VERCEL_BRANCH_URL) !== null && _a !== void 0 ? _a : process.env.VERCEL_URL);
    }
    // Dev: `crbn up` writes MES_URL=https://<prefix>.mes.dev into .env.local.
    // Honor it so cross-app sidebar links resolve to the portless hostname
    // instead of the hardcoded localhost:3001 fallback.
    return exports.MES_URL !== null && exports.MES_URL !== void 0 ? exports.MES_URL : "http://localhost:3001";
}
function getBrowserEnv() {
    return {
        AUTH_PROVIDERS: exports.AUTH_PROVIDERS,
        CARBON_API_URL: exports.CARBON_API_URL,
        CARBON_EDITION: CARBON_EDITION,
        CLOUDFLARE_TURNSTILE_SITE_KEY: exports.CLOUDFLARE_TURNSTILE_SITE_KEY,
        CONTROLLED_ENVIRONMENT: exports.CONTROLLED_ENVIRONMENT,
        DEFAULT_LANGUAGE: exports.DEFAULT_LANGUAGE,
        ERP_URL: exports.ERP_URL,
        GOOGLE_PLACES_API_KEY: exports.GOOGLE_PLACES_API_KEY,
        JIRA_CLIENT_ID: exports.JIRA_CLIENT_ID,
        MES_URL: exports.MES_URL,
        NODE_ENV: exports.NODE_ENV,
        ONSHAPE_CLIENT_ID: exports.ONSHAPE_CLIENT_ID,
        POSTHOG_API_HOST: exports.POSTHOG_API_HOST,
        POSTHOG_PROJECT_PUBLIC_KEY: exports.POSTHOG_PROJECT_PUBLIC_KEY,
        QUICKBOOKS_CLIENT_ID: exports.QUICKBOOKS_CLIENT_ID,
        SUPABASE_ANON_KEY: exports.SUPABASE_ANON_KEY,
        SUPABASE_URL: exports.SUPABASE_URL_PUBLIC || exports.SUPABASE_URL,
        VERCEL_ENV: exports.VERCEL_ENV,
        VERCEL_URL: exports.VERCEL_URL,
        XERO_CLIENT_ID: exports.XERO_CLIENT_ID
    };
}
function isVercel() {
    var _a;
    return (_a = exports.VERCEL_URL === null || exports.VERCEL_URL === void 0 ? void 0 : exports.VERCEL_URL.includes("vercel.app")) !== null && _a !== void 0 ? _a : false;
}
