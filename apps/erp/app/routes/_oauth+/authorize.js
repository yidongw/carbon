"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = AuthorizeRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, userCompanies, companies, url, clientId, redirectUri, scope, clientName, redirectDomain, serviceRole, oauthClient;
        var _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, client
                            .from("userToCompany")
                            .select("companyId, company:companyId(name)")
                            .eq("userId", userId)];
                case 2:
                    userCompanies = _e.sent();
                    companies = ((_d = userCompanies.data) !== null && _d !== void 0 ? _d : []).map(function (uc) {
                        var _a, _b;
                        return ({
                            id: uc.companyId,
                            name: (_b = (_a = uc.company) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : uc.companyId
                        });
                    });
                    url = new URL(request.url);
                    clientId = url.searchParams.get("client_id");
                    redirectUri = url.searchParams.get("redirect_uri");
                    scope = url.searchParams.get("scope");
                    clientName = "Unknown Application";
                    redirectDomain = null;
                    if (!clientId) return [3 /*break*/, 4];
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("oauthClient")
                            .select("name")
                            .eq("clientId", clientId)
                            .single()];
                case 3:
                    oauthClient = _e.sent();
                    if (oauthClient.data) {
                        clientName = oauthClient.data.name;
                    }
                    _e.label = 4;
                case 4:
                    if (redirectUri) {
                        try {
                            redirectDomain = new URL(redirectUri).hostname;
                        }
                        catch (_f) {
                            // invalid URL — will be caught by the action validator
                        }
                    }
                    return [2 /*return*/, {
                            companyId: companyId,
                            companies: companies,
                            clientName: clientName,
                            redirectDomain: redirectDomain,
                            scope: scope
                        }];
            }
        });
    });
}
var formValidator = zod_1.z.object({
    company_id: zod_1.z.string()
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, validation, _d, _e, company_id, url, param, response_type, client_id, redirect_uri, state, scope, code_challenge, code_challenge_method, membership, serviceRole, oauthClientResult, oauthClient, code, codeResult, redirectUrl;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(formValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_f.sent()])];
                case 3:
                    validation = _f.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid request" }, { status: 400 })];
                    }
                    company_id = validation.data.company_id;
                    url = new URL(request.url);
                    param = function (key) { var _a, _b; return (_b = (_a = url.searchParams.get(key)) === null || _a === void 0 ? void 0 : _a.replace(/\s/g, "")) !== null && _b !== void 0 ? _b : null; };
                    response_type = url.searchParams.get("response_type");
                    client_id = param("client_id");
                    redirect_uri = url.searchParams.get("redirect_uri");
                    state = url.searchParams.get("state");
                    scope = url.searchParams.get("scope");
                    code_challenge = param("code_challenge");
                    code_challenge_method = param("code_challenge_method");
                    if (response_type !== "code") {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Unsupported response_type. Must be 'code'." }, { status: 400 })];
                    }
                    if (!client_id || !redirect_uri) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Missing client_id or redirect_uri" }, { status: 400 })];
                    }
                    return [4 /*yield*/, client
                            .from("userToCompany")
                            .select("companyId")
                            .eq("userId", userId)
                            .eq("companyId", company_id)
                            .single()];
                case 4:
                    membership = _f.sent();
                    if (!membership.data) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid company" }, { status: 403 })];
                    }
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, serviceRole
                            .from("oauthClient")
                            .select("*")
                            .eq("clientId", client_id)
                            .single()];
                case 5:
                    oauthClientResult = _f.sent();
                    if (!oauthClientResult.data) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid client" }, { status: 400 })];
                    }
                    oauthClient = oauthClientResult.data;
                    if (!oauthClient.redirectUris.includes(redirect_uri)) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Invalid redirect URI" }, { status: 400 })];
                    }
                    if (oauthClient.tokenEndpointAuthMethod === "none" && !code_challenge) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "PKCE required for public clients" }, { status: 400 })];
                    }
                    code = crypto.randomUUID();
                    return [4 /*yield*/, serviceRole.from("oauthCode").insert([
                            {
                                code: code,
                                clientId: client_id,
                                userId: userId,
                                companyId: company_id,
                                redirectUri: redirect_uri,
                                scope: scope || null,
                                codeChallenge: code_challenge || null,
                                codeChallengeMethod: code_challenge_method || null,
                                createdAt: new Date().toISOString(),
                                expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
                            }
                        ])];
                case 6:
                    codeResult = _f.sent();
                    if (codeResult.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Failed to create authorization code" }, { status: 500 })];
                    }
                    redirectUrl = new URL(redirect_uri);
                    redirectUrl.searchParams.append("code", code);
                    if (state) {
                        redirectUrl.searchParams.append("state", state);
                    }
                    return [2 /*return*/, (0, react_router_1.redirect)(redirectUrl.toString())];
            }
        });
    });
}
function AuthorizeRoute() {
    var _a = (0, react_router_1.useLoaderData)(), clientName = _a.clientName, companyId = _a.companyId, companies = _a.companies, redirectDomain = _a.redirectDomain, scope = _a.scope;
    return (<div className="flex min-h-dvh items-center justify-center p-4">
      <div className="flex w-[380px] flex-col items-center space-y-6">
        <div className="flex justify-center">
          <img src="/carbon-mark-light.svg" alt="Carbon Logo" className="w-24 dark:hidden"/>
          <img src="/carbon-mark-dark.svg" alt="Carbon Logo" className="hidden w-24 dark:block"/>
        </div>
        <div className="w-full rounded-lg p-8 md:border md:border-border md:bg-card md:shadow-lg">
          <react_router_1.Form method="post">
            <react_1.VStack spacing={4} className="items-center">
              <react_1.Heading size="h3" className="text-balance text-center">
                Authorize Application
              </react_1.Heading>
              <p className="text-center text-sm text-pretty text-muted-foreground">
                <strong className="text-foreground">{clientName}</strong>
                {redirectDomain && (<span className="text-xs"> ({redirectDomain})</span>)}{" "}
                is requesting access to your Carbon account.
              </p>
              <div className="flex w-full flex-col gap-1.5">
                <label htmlFor="company_id" className="text-sm font-medium text-foreground">
                  Company
                </label>
                {companies.length === 1 ? (<>
                    <input type="hidden" name="company_id" value={companies[0].id}/>
                    <p className="text-sm text-muted-foreground">
                      {companies[0].name}
                    </p>
                  </>) : (<select id="company_id" name="company_id" defaultValue={companyId} className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                    {companies.map(function (c) { return (<option key={c.id} value={c.id}>
                        {c.name}
                      </option>); })}
                  </select>)}
              </div>
              {scope && (<div className="w-full rounded-md border border-border bg-muted/50 px-3 py-2 text-center text-sm text-muted-foreground">
                  Scope: {scope}
                </div>)}
              <react_1.Button type="submit" size="lg" className="w-full">
                Authorize
              </react_1.Button>
            </react_1.VStack>
          </react_router_1.Form>
        </div>
      </div>
    </div>);
}
