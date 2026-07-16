"use strict";
// ─── Types ───────────────────────────────────────────────────────────────────
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var utils_1 = require("@carbon/utils");
var isProxied = (0, auth_1.getBrowserEnv)().CARBON_EDITION === utils_1.Edition.Cloud;
var PUBLIC_KEY = (0, auth_1.getBrowserEnv)().SUPABASE_ANON_KEY;
// ─── Curl Builder ────────────────────────────────────────────────────────────
var CONTENT_TYPE_HEADER = "\"Content-Type: application/json\"";
function authHeader(apiKey) {
    return apiKey
        ? "\"Authorization: Bearer ".concat(apiKey, "\"")
        : "\"Authorization: Bearer $CARBON_API_KEY\"";
}
function buildCurl(config) {
    var method = config.method, url = config.url, body = config.body, _a = config.headers, extraHeaders = _a === void 0 ? [] : _a, range = config.range, _b = config.includeAuth, includeAuth = _b === void 0 ? true : _b, _c = config.includeContentType, includeContentType = _c === void 0 ? false : _c, prefer = config.prefer, apiKey = config.apiKey;
    var parts = [];
    if (method && method !== "GET") {
        parts.push("curl -X ".concat(method, " '").concat(url, "'"));
    }
    else {
        parts.push("curl '".concat(url, "'"));
    }
    if (includeAuth) {
        parts.push("-H ".concat(authHeader(isProxied ? apiKey : "$CARBON_PUBLIC_KEY")));
        if (!isProxied) {
            parts.push("-H \"carbon-key: ".concat(apiKey !== null && apiKey !== void 0 ? apiKey : "$CARBON_API_KEY", "\""));
        }
    }
    if (includeContentType) {
        parts.push("-H ".concat(CONTENT_TYPE_HEADER));
    }
    if (prefer) {
        parts.push("-H \"Prefer: ".concat(prefer, "\""));
    }
    for (var _i = 0, extraHeaders_1 = extraHeaders; _i < extraHeaders_1.length; _i++) {
        var header = extraHeaders_1[_i];
        parts.push("-H ".concat(header));
    }
    if (range) {
        parts.push("-H \"Range: ".concat(range, "\""));
    }
    if (body) {
        parts.push("-d '".concat(body, "'"));
    }
    return "\n" + parts.join(" \\\n");
}
// ─── Snippet Helpers ─────────────────────────────────────────────────────────
function defineSnippet(title, languages) {
    return __assign({ title: title }, languages);
}
function createBashSnippet(code) {
    return { language: "bash", code: code };
}
function createJsSnippet(code) {
    return { language: "js", code: code };
}
// ─── Subscription Config + Builder ───────────────────────────────────────────
var SUBSCRIPTION_CONFIGS = {
    subscribeAll: {
        event: "*",
        channel: "custom-all-channel",
        title: "Subscribe to all events"
    },
    subscribeInserts: {
        event: "INSERT",
        channel: "custom-insert-channel",
        title: "Subscribe to inserts"
    },
    subscribeUpdates: {
        event: "UPDATE",
        channel: "custom-update-channel",
        title: "Subscribe to updates"
    },
    subscribeDeletes: {
        event: "DELETE",
        channel: "custom-delete-channel",
        title: "Subscribe to deletes"
    }
};
var REALTIME_BASH_MESSAGE = "# Realtime streams are only supported by our client libraries";
function createSubscriptionSnippet(config, listenerName, resourceId, filter) {
    var filterLine = filter ? ", filter: '".concat(filter, "'") : "";
    return defineSnippet(config.title, {
        bash: createBashSnippet(REALTIME_BASH_MESSAGE),
        js: createJsSnippet("\nconst ".concat(listenerName, " = carbon.channel('").concat(config.channel, "')\n  .on(\n    'postgres_changes',\n    { event: '").concat(config.event, "', schema: 'public', table: '").concat(resourceId, "'").concat(filterLine, " },\n    (payload) => {\n      console.log('Change received!', payload)\n    }\n  )\n  .subscribe()"))
    });
}
var AUTH_CONFIGS = {
    authSignup: {
        method: "POST",
        path: "/auth/v1/signup",
        title: "User signup",
        bashBody: function (_ep, _ak, pw) {
            return "{\n  \"email\": \"someone@email.com\",\n  \"password\": \"".concat(pw, "\"\n}");
        },
        jsCode: function (_ep, _ak, pw) { return "\nlet { data, error } = await carbon.auth.signUp({\n  email: 'someone@email.com',\n  password: '".concat(pw, "'\n})"); }
    },
    authLogin: {
        method: "POST",
        path: "/auth/v1/token?grant_type=password",
        title: "User login",
        bashBody: function (_ep, _ak, pw) {
            return "{\n  \"email\": \"someone@email.com\",\n  \"password\": \"".concat(pw, "\"\n}");
        },
        jsCode: function (_ep, _ak, pw) { return "\nlet { data, error } = await carbon.auth.signInWithPassword({\n  email: 'someone@email.com',\n  password: '".concat(pw, "'\n})"); }
    },
    authMagicLink: {
        method: "POST",
        path: "/auth/v1/magiclink",
        title: "User login",
        bashBody: function () { return "{\n  \"email\": \"someone@email.com\"\n}"; },
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.signInWithOtp({\n  email: 'someone@email.com'\n})"; }
    },
    authPhoneSignUp: {
        method: "POST",
        path: "/auth/v1/signup",
        title: "Phone Signup",
        bashBody: function () {
            return "{\n  \"phone\": \"+13334445555\",\n  \"password\": \"some-password\"\n}";
        },
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.signUp({\n  phone: '+13334445555',\n  password: 'some-password'\n})"; }
    },
    authMobileOTPLogin: {
        method: "POST",
        path: "/auth/v1/otp",
        title: "Phone Login",
        bashBody: function () { return "{\n  \"phone\": \"+13334445555\"\n}"; },
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.signInWithOtp({\n  phone: '+13334445555'\n})"; }
    },
    authMobileOTPVerify: {
        method: "POST",
        path: "/auth/v1/verify",
        title: "Verify Pin",
        bashHeaders: [authHeader()],
        bashBody: function () {
            return "{\n  \"type\": \"sms\",\n  \"phone\": \"+13334445555\",\n  \"token\": \"123456\"\n}";
        },
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.verifyOtp({\n  phone: '+13334445555',\n  token: '123456',\n  type: 'sms'\n})"; }
    },
    authInvite: {
        method: "POST",
        path: "/auth/v1/invite",
        title: "Invite User",
        bashHeaders: ["\"Authorization: Bearer USER_TOKEN\""],
        bashBody: function () { return "{\n  \"email\": \"someone@email.com\"\n}"; },
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.admin.inviteUserByEmail('someone@email.com')"; }
    },
    authThirdPartyLogin: {
        method: "GET",
        path: "/auth/v1/authorize?provider=github",
        title: "Third Party Login",
        bashHeaders: ["\"Authorization: Bearer USER_TOKEN\""],
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.signInWithOAuth({\n  provider: 'github'\n})"; }
    },
    authUser: {
        method: "GET",
        path: "/auth/v1/user",
        title: "Get User",
        jsCode: function () { return "\nconst { data: { user } } = await carbon.auth.getUser()"; }
    },
    authRecover: {
        method: "POST",
        path: "/auth/v1/recover",
        title: "Password Recovery",
        bashBody: function () { return "{\n  \"email\": \"someone@email.com\"\n}"; },
        jsCode: function () { return "\nlet { data, error } = await carbon.auth.resetPasswordForEmail(email)"; }
    },
    authUpdate: {
        method: "PUT",
        path: "/auth/v1/user",
        title: "Update User",
        bashBody: function () {
            return "{\n  \"email\": \"someone@email.com\",\n  \"password\": \"new-password\",\n  \"data\": {\n    \"key\": \"value\"\n  }\n}";
        },
        jsCode: function () { return "\nconst { data, error } = await carbon.auth.updateUser({\n  email: \"new@email.com\",\n  password: \"new-password\",\n  data: { hello: 'world' }\n})"; }
    },
    authLogout: {
        method: "POST",
        path: "/auth/v1/logout",
        title: "User logout",
        bashHeaders: [CONTENT_TYPE_HEADER, "\"Authorization: Bearer USER_TOKEN\""],
        jsCode: function () { return "\nlet { error } = await carbon.auth.signOut()"; }
    }
};
function createAuthSnippet(configKey, endpoint) {
    var _a;
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var config = AUTH_CONFIGS[configKey];
    var useCustomHeaders = !!config.bashHeaders;
    var body = (_a = config.bashBody) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([config], args, false));
    var bashCode = useCustomHeaders
        ? buildCurl({
            method: config.method,
            url: "".concat(endpoint).concat(config.path),
            includeAuth: false,
            includeContentType: !!body,
            headers: config.bashHeaders,
            body: body
        })
        : buildCurl({
            method: config.method,
            url: "".concat(endpoint).concat(config.path),
            includeContentType: !!body,
            body: body
        });
    return defineSnippet(config.title, {
        bash: createBashSnippet(bashCode),
        js: createJsSnippet(config.jsCode.apply(config, args))
    });
}
// ─── CRUD Config + Builders ──────────────────────────────────────────────────
function createRestUrl(endpoint, resourceId, query) {
    var base = "".concat(endpoint, "/rest/v1/").concat(resourceId);
    return query ? "".concat(base, "?").concat(query) : base;
}
function createReadSnippet(config) {
    var title = config.title, resourceId = config.resourceId, endpoint = config.endpoint, select = config.select, range = config.range, filter = config.filter, jsChain = config.jsChain, apiKey = config.apiKey;
    var queryParts = [];
    if (filter)
        queryParts.push(filter);
    queryParts.push("select=".concat(select));
    var query = queryParts.join("&");
    return defineSnippet(title, {
        bash: createBashSnippet(buildCurl({
            url: createRestUrl(endpoint, resourceId, query),
            range: range,
            apiKey: apiKey
        })),
        js: createJsSnippet(jsChain)
    });
}
function createWriteSnippet(config) {
    var title = config.title, method = config.method, resourceId = config.resourceId, endpoint = config.endpoint, body = config.body, prefer = config.prefer, query = config.query, jsChain = config.jsChain, apiKey = config.apiKey;
    return defineSnippet(title, {
        bash: createBashSnippet(buildCurl({
            method: method,
            url: createRestUrl(endpoint, resourceId, query),
            includeContentType: true,
            body: body,
            prefer: prefer,
            apiKey: apiKey
        })),
        js: createJsSnippet(jsChain)
    });
}
var snippets = {
    // ── Setup ────────────────────────────────────────────────────────────────
    endpoint: function (endpoint) { return ({
        title: "API URL",
        bash: createBashSnippet(endpoint),
        js: { language: "bash", code: endpoint }
    }); },
    install: function () { return ({
        title: "Install",
        bash: null,
        js: createBashSnippet("npm install --save @supabase/supabase-js")
    }); },
    env: function (_a) {
        var apiUrl = _a.apiUrl, apiKey = _a.apiKey;
        return defineSnippet(undefined, {
            bash: createBashSnippet([
                "export CARBON_API_URL=\"".concat(apiUrl, "\""),
                "export CARBON_API_KEY=\"".concat(apiKey, "\""),
                !isProxied ? "export CARBON_PUBLIC_KEY=\"".concat(PUBLIC_KEY, "\"") : ""
            ].join("\n")),
            js: createJsSnippet([
                "// .env",
                "CARBON_API_URL = \"".concat(apiUrl, "\""),
                "CARBON_API_KEY = \"".concat(apiKey, "\""),
                !isProxied ? "CARBON_PUBLIC_KEY = \"".concat(PUBLIC_KEY, "\"") : ""
            ].join("\n"))
        });
    },
    init: function (endpoint) {
        return defineSnippet(undefined, {
            bash: createBashSnippet("# No client library required for Bash."),
            js: createJsSnippet("\nimport { createClient } from '@supabase/supabase-js'\n\nconst apiUrl = process.env.CARBON_API_URL\nconst apiKey = process.env.CARBON_API_KEY\n".concat(!isProxied ? "const publicKey = process.env.CARBON_PUBLIC_KEY" : "", "\n\nconst carbon = createClient(apiUrl, ").concat(!isProxied
                ? "publicKey, {\n  global: {\n    headers: {\n      \"carbon-key\": apiKey,\n    },\n  },\n}"
                : "apiKey", ");"))
        });
    },
    // ── Read (CRUD) ──────────────────────────────────────────────────────────
    readAll: function (resourceId, endpoint, apiKey) {
        return createReadSnippet({
            title: "Read all rows",
            resourceId: resourceId,
            endpoint: endpoint,
            select: "*",
            apiKey: apiKey,
            jsChain: "\nlet { data: ".concat(resourceId, ", error } = await carbon\n  .from('").concat(resourceId, "')\n  .select('*')\n")
        });
    },
    readColumns: function (_a) {
        var _b = _a.title, title = _b === void 0 ? "Read specific columns" : _b, resourceId = _a.resourceId, endpoint = _a.endpoint, _c = _a.columnName, columnName = _c === void 0 ? "some_column,other_column" : _c, apiKey = _a.apiKey;
        return createReadSnippet({
            title: title,
            resourceId: resourceId,
            endpoint: endpoint,
            select: columnName,
            apiKey: apiKey,
            jsChain: "\nlet { data: ".concat(resourceId, ", error } = await carbon\n  .from('").concat(resourceId, "')\n  .select('").concat(columnName, "')\n")
        });
    },
    readForeignTables: function (resourceId, endpoint, apiKey) {
        return createReadSnippet({
            title: "Read referenced tables",
            resourceId: resourceId,
            endpoint: endpoint,
            select: "some_column,other_table(foreign_key)",
            apiKey: apiKey,
            jsChain: "\nlet { data: ".concat(resourceId, ", error } = await carbon\n  .from('").concat(resourceId, "')\n  .select(`\n    some_column,\n    other_table (\n      foreign_key\n    )\n  `)\n")
        });
    },
    readRange: function (resourceId, endpoint, apiKey) {
        return createReadSnippet({
            title: "With pagination",
            resourceId: resourceId,
            endpoint: endpoint,
            select: "*",
            range: "0-9",
            apiKey: apiKey,
            jsChain: "\nlet { data: ".concat(resourceId, ", error } = await carbon\n  .from('").concat(resourceId, "')\n  .select('*')\n  .range(0, 9)\n")
        });
    },
    readFilters: function (resourceId, endpoint, apiKey) {
        return createReadSnippet({
            title: "With filtering",
            resourceId: resourceId,
            endpoint: endpoint,
            select: "*",
            filter: "id=eq.1",
            range: "0-9",
            apiKey: apiKey,
            jsChain: "\nlet { data: ".concat(resourceId, ", error } = await carbon\n  .from('").concat(resourceId, "')\n  .select(\"*\")\n  // Filters\n  .eq('column', 'Equal to')\n  .gt('column', 'Greater than')\n  .lt('column', 'Less than')\n  .gte('column', 'Greater than or equal to')\n  .lte('column', 'Less than or equal to')\n  .like('column', '%CaseSensitive%')\n  .ilike('column', '%CaseInsensitive%')\n  .is('column', null)\n  .in('column', ['Array', 'Values'])\n  .neq('column', 'Not equal to')\n  // Arrays\n  .contains('array_column', ['array', 'contains'])\n  .containedBy('array_column', ['contained', 'by'])\n")
        });
    },
    // ── Write (CRUD) ─────────────────────────────────────────────────────────
    insertSingle: function (resourceId, endpoint, apiKey) {
        return createWriteSnippet({
            title: "Insert a row",
            method: "POST",
            resourceId: resourceId,
            endpoint: endpoint,
            prefer: "return=minimal",
            body: "{ \"some_column\": \"someValue\", \"other_column\": \"otherValue\" }",
            apiKey: apiKey,
            jsChain: "\nconst { data, error } = await carbon\n  .from('".concat(resourceId, "')\n  .insert([\n    { some_column: 'someValue', other_column: 'otherValue' },\n  ])\n  .select()\n")
        });
    },
    insertMany: function (resourceId, endpoint, apiKey) {
        return createWriteSnippet({
            title: "Insert many rows",
            method: "POST",
            resourceId: resourceId,
            endpoint: endpoint,
            body: "[{ \"some_column\": \"someValue\" }, { \"other_column\": \"otherValue\" }]",
            apiKey: apiKey,
            jsChain: "\nconst { data, error } = await carbon\n  .from('".concat(resourceId, "')\n  .insert([\n    { some_column: 'someValue' },\n    { some_column: 'otherValue' },\n  ])\n  .select()\n")
        });
    },
    upsert: function (resourceId, endpoint, apiKey) {
        return createWriteSnippet({
            title: "Upsert matching rows",
            method: "POST",
            resourceId: resourceId,
            endpoint: endpoint,
            prefer: "resolution=merge-duplicates",
            body: "{ \"some_column\": \"someValue\", \"other_column\": \"otherValue\" }",
            apiKey: apiKey,
            jsChain: "\nconst { data, error } = await carbon\n  .from('".concat(resourceId, "')\n  .upsert({ some_column: 'someValue' })\n  .select()\n")
        });
    },
    update: function (resourceId, endpoint, apiKey) {
        return createWriteSnippet({
            title: "Update matching rows",
            method: "PATCH",
            resourceId: resourceId,
            endpoint: endpoint,
            prefer: "return=minimal",
            query: "some_column=eq.someValue",
            body: "{ \"other_column\": \"otherValue\" }",
            apiKey: apiKey,
            jsChain: "\nconst { data, error } = await carbon\n  .from('".concat(resourceId, "')\n  .update({ other_column: 'otherValue' })\n  .eq('some_column', 'someValue')\n  .select()\n")
        });
    },
    delete: function (resourceId, endpoint, apiKey) {
        return defineSnippet("Delete matching rows", {
            bash: createBashSnippet(buildCurl({
                method: "DELETE",
                url: createRestUrl(endpoint, resourceId, "some_column=eq.someValue"),
                apiKey: apiKey
            })),
            js: createJsSnippet("\nconst { error } = await carbon\n  .from('".concat(resourceId, "')\n  .delete()\n  .eq('some_column', 'someValue')\n"))
        });
    },
    // ── Subscriptions ────────────────────────────────────────────────────────
    subscribeAll: function (listenerName, resourceId) {
        return createSubscriptionSnippet(SUBSCRIPTION_CONFIGS.subscribeAll, listenerName, resourceId);
    },
    subscribeInserts: function (listenerName, resourceId) {
        return createSubscriptionSnippet(SUBSCRIPTION_CONFIGS.subscribeInserts, listenerName, resourceId);
    },
    subscribeUpdates: function (listenerName, resourceId) {
        return createSubscriptionSnippet(SUBSCRIPTION_CONFIGS.subscribeUpdates, listenerName, resourceId);
    },
    subscribeDeletes: function (listenerName, resourceId) {
        return createSubscriptionSnippet(SUBSCRIPTION_CONFIGS.subscribeDeletes, listenerName, resourceId);
    },
    subscribeEq: function (listenerName, resourceId, columnName, value) {
        return createSubscriptionSnippet({
            event: "*",
            channel: "custom-filter-channel",
            title: "Subscribe to specific rows"
        }, listenerName, resourceId, "".concat(columnName, "=eq.").concat(value));
    },
    // ── Auth ─────────────────────────────────────────────────────────────────
    authSignup: function (endpoint, apiKey, randomPassword) {
        return createAuthSnippet("authSignup", endpoint, apiKey, randomPassword);
    },
    authLogin: function (endpoint, apiKey, randomPassword) {
        return createAuthSnippet("authLogin", endpoint, apiKey, randomPassword);
    },
    authMagicLink: function (endpoint) {
        return createAuthSnippet("authMagicLink", endpoint);
    },
    authPhoneSignUp: function (endpoint) {
        return createAuthSnippet("authPhoneSignUp", endpoint);
    },
    authMobileOTPLogin: function (endpoint) {
        return createAuthSnippet("authMobileOTPLogin", endpoint);
    },
    authMobileOTPVerify: function (endpoint) {
        return createAuthSnippet("authMobileOTPVerify", endpoint);
    },
    authInvite: function (endpoint) { return createAuthSnippet("authInvite", endpoint); },
    authThirdPartyLogin: function (endpoint) {
        return createAuthSnippet("authThirdPartyLogin", endpoint);
    },
    authUser: function (endpoint) { return createAuthSnippet("authUser", endpoint); },
    authRecover: function (endpoint) { return createAuthSnippet("authRecover", endpoint); },
    authUpdate: function (endpoint) { return createAuthSnippet("authUpdate", endpoint); },
    authLogout: function (endpoint) { return createAuthSnippet("authLogout", endpoint); }
};
exports.default = snippets;
