"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = require("execa");
var client_1 = require("./client");
function deploy() {
    return __awaiter(this, void 0, void 0, function () {
        var imageTag, _a, workspaces, error, hasErrors, _b, _c, _d, workspace, anon_key, auth_providers, aws_account_id, aws_region, aws, carbon_edition, cert_arn_erp, cert_arn_mes, cloudflare_turnstile_secret_key, cloudflare_turnstile_site_key, controlled_environment, database_connection_pooler_url, database_password, database_url, domain_name, exchange_rates_api_key, google_places_api_key, inngest_base_url, inngest_event_key, inngest_signing_key, jira_client_id, jira_client_secret, jira_oauth_redirect_url, jira_state_secret, jwt_secret, openai_api_key, posthog_api_host, posthog_project_public_key, quickbooks_client_id, quickbooks_client_secret, quickbooks_webhook_secret, redis_url, resend_api_key, resend_domain, service_role_key, session_secret, slack_bot_token, slack_client_id, slack_client_secret, slack_oauth_redirect_url, slack_signing_secret, slack_state_secret, slug, stripe_bypass_company_ids, stripe_secret_key, stripe_webhook_secret, url_erp, url_mes, xero_client_id, xero_client_secret, xero_webhook_secret, $$, error_1, e_1_1;
        var _e, e_1, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    console.log("✅ 🌱 Starting deployment");
                    imageTag = process.env.IMAGE_TAG;
                    if (!imageTag) {
                        console.error("🔴 🍳 Missing IMAGE_TAG environment variable");
                        process.exit(1);
                    }
                    console.log("\u2705 \uD83C\uDFF7\uFE0F Using image tag: ".concat(imageTag));
                    return [4 /*yield*/, client_1.client
                            .from("workspaces")
                            .select("*")];
                case 1:
                    _a = _h.sent(), workspaces = _a.data, error = _a.error;
                    if (error) {
                        console.error("🔴 🍳 Failed to fetch workspaces", error);
                        process.exit(1);
                    }
                    hasErrors = false;
                    console.log("✅ 🛩️ Successfully retreived workspaces");
                    _h.label = 2;
                case 2:
                    _h.trys.push([2, 10, 11, 16]);
                    _b = true, _c = __asyncValues(workspaces);
                    _h.label = 3;
                case 3: return [4 /*yield*/, _c.next()];
                case 4:
                    if (!(_d = _h.sent(), _e = _d.done, !_e)) return [3 /*break*/, 9];
                    _g = _d.value;
                    _b = false;
                    workspace = _g;
                    _h.label = 5;
                case 5:
                    _h.trys.push([5, 7, , 8]);
                    console.log("\u2705 \uD83E\uDD5A Migrating ".concat(workspace.id));
                    anon_key = workspace.anon_key, auth_providers = workspace.auth_providers, aws_account_id = workspace.aws_account_id, aws_region = workspace.aws_region, aws = workspace.aws, carbon_edition = workspace.carbon_edition, cert_arn_erp = workspace.cert_arn_erp, cert_arn_mes = workspace.cert_arn_mes, cloudflare_turnstile_secret_key = workspace.cloudflare_turnstile_secret_key, cloudflare_turnstile_site_key = workspace.cloudflare_turnstile_site_key, controlled_environment = workspace.controlled_environment, database_connection_pooler_url = workspace.database_connection_pooler_url, database_password = workspace.database_password, database_url = workspace.database_url, domain_name = workspace.domain_name, exchange_rates_api_key = workspace.exchange_rates_api_key, google_places_api_key = workspace.google_places_api_key, inngest_base_url = workspace.inngest_base_url, inngest_event_key = workspace.inngest_event_key, inngest_signing_key = workspace.inngest_signing_key, jira_client_id = workspace.jira_client_id, jira_client_secret = workspace.jira_client_secret, jira_oauth_redirect_url = workspace.jira_oauth_redirect_url, jira_state_secret = workspace.jira_state_secret, jwt_secret = workspace.jwt_secret, openai_api_key = workspace.openai_api_key, posthog_api_host = workspace.posthog_api_host, posthog_project_public_key = workspace.posthog_project_public_key, quickbooks_client_id = workspace.quickbooks_client_id, quickbooks_client_secret = workspace.quickbooks_client_secret, quickbooks_webhook_secret = workspace.quickbooks_webhook_secret, redis_url = workspace.redis_url, resend_api_key = workspace.resend_api_key, resend_domain = workspace.resend_domain, service_role_key = workspace.service_role_key, session_secret = workspace.session_secret, slack_bot_token = workspace.slack_bot_token, slack_client_id = workspace.slack_client_id, slack_client_secret = workspace.slack_client_secret, slack_oauth_redirect_url = workspace.slack_oauth_redirect_url, slack_signing_secret = workspace.slack_signing_secret, slack_state_secret = workspace.slack_state_secret, slug = workspace.slug, stripe_bypass_company_ids = workspace.stripe_bypass_company_ids, stripe_secret_key = workspace.stripe_secret_key, stripe_webhook_secret = workspace.stripe_webhook_secret, url_erp = workspace.url_erp, url_mes = workspace.url_mes, xero_client_id = workspace.xero_client_id, xero_client_secret = workspace.xero_client_secret, xero_webhook_secret = workspace.xero_webhook_secret;
                    if (!aws) {
                        return [3 /*break*/, 8];
                    }
                    if (!aws_account_id) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing AWS account id for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!aws_region) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing AWS region for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!domain_name) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing domain name for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!cert_arn_erp) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing ERP domain cert ARN for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!cert_arn_mes) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing MES domain cert ARN for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!database_url) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing database url for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!database_connection_pooler_url) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing database connection pooler url for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!database_password) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing database password for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!anon_key) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing anon key for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!service_role_key) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing service role key for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!resend_api_key) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing Resend API key for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!session_secret) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing session secret for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!inngest_signing_key) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing Inngest signing key for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!inngest_event_key) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing Inngest event key for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!redis_url) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing Redis URL for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!url_erp) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing ERP url for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    if (!url_mes) {
                        console.log("\uD83D\uDD34\uD83C\uDF73 Missing MES url for ".concat(workspace.id));
                        return [3 /*break*/, 8];
                    }
                    console.log("\u2705 \uD83D\uDD11 Setting up environment for ".concat(workspace.id));
                    $$ = (0, execa_1.$)({
                        // @ts-ignore
                        env: {
                            AWS_ACCOUNT_ID: aws_account_id,
                            AWS_REGION: aws_region,
                            IMAGE_TAG: imageTag,
                            AUTH_PROVIDERS: auth_providers !== null && auth_providers !== void 0 ? auth_providers : undefined,
                            CARBON_EDITION: carbon_edition !== null && carbon_edition !== void 0 ? carbon_edition : "enterprise",
                            CERT_ARN_ERP: cert_arn_erp,
                            CERT_ARN_MES: cert_arn_mes,
                            CLOUDFLARE_TURNSTILE_SECRET_KEY: cloudflare_turnstile_secret_key !== null && cloudflare_turnstile_secret_key !== void 0 ? cloudflare_turnstile_secret_key : undefined,
                            CLOUDFLARE_TURNSTILE_SITE_KEY: cloudflare_turnstile_site_key !== null && cloudflare_turnstile_site_key !== void 0 ? cloudflare_turnstile_site_key : undefined,
                            CONTROLLED_ENVIRONMENT: controlled_environment !== null && controlled_environment !== void 0 ? controlled_environment : undefined,
                            DOMAIN: domain_name,
                            EXCHANGE_RATES_API_KEY: exchange_rates_api_key !== null && exchange_rates_api_key !== void 0 ? exchange_rates_api_key : undefined,
                            GOOGLE_PLACES_API_KEY: google_places_api_key !== null && google_places_api_key !== void 0 ? google_places_api_key : undefined,
                            INNGEST_BASE_URL: inngest_base_url !== null && inngest_base_url !== void 0 ? inngest_base_url : undefined,
                            INNGEST_EVENT_KEY: inngest_event_key,
                            INNGEST_SIGNING_KEY: inngest_signing_key,
                            JIRA_CLIENT_ID: jira_client_id !== null && jira_client_id !== void 0 ? jira_client_id : undefined,
                            JIRA_CLIENT_SECRET: jira_client_secret !== null && jira_client_secret !== void 0 ? jira_client_secret : undefined,
                            JIRA_OAUTH_REDIRECT_URL: jira_oauth_redirect_url !== null && jira_oauth_redirect_url !== void 0 ? jira_oauth_redirect_url : undefined,
                            JIRA_STATE_SECRET: jira_state_secret !== null && jira_state_secret !== void 0 ? jira_state_secret : undefined,
                            OPENAI_API_KEY: openai_api_key,
                            POSTHOG_API_HOST: posthog_api_host !== null && posthog_api_host !== void 0 ? posthog_api_host : undefined,
                            POSTHOG_PROJECT_PUBLIC_KEY: posthog_project_public_key !== null && posthog_project_public_key !== void 0 ? posthog_project_public_key : undefined,
                            QUICKBOOKS_CLIENT_ID: quickbooks_client_id !== null && quickbooks_client_id !== void 0 ? quickbooks_client_id : undefined,
                            QUICKBOOKS_CLIENT_SECRET: quickbooks_client_secret !== null && quickbooks_client_secret !== void 0 ? quickbooks_client_secret : undefined,
                            QUICKBOOKS_WEBHOOK_SECRET: quickbooks_webhook_secret !== null && quickbooks_webhook_secret !== void 0 ? quickbooks_webhook_secret : undefined,
                            REDIS_URL: redis_url !== null && redis_url !== void 0 ? redis_url : undefined,
                            RESEND_API_KEY: resend_api_key,
                            RESEND_DOMAIN: resend_domain !== null && resend_domain !== void 0 ? resend_domain : "carbon.ms",
                            SESSION_SECRET: session_secret,
                            SLACK_BOT_TOKEN: slack_bot_token !== null && slack_bot_token !== void 0 ? slack_bot_token : undefined,
                            SLACK_CLIENT_ID: slack_client_id !== null && slack_client_id !== void 0 ? slack_client_id : undefined,
                            SLACK_CLIENT_SECRET: slack_client_secret !== null && slack_client_secret !== void 0 ? slack_client_secret : undefined,
                            SLACK_OAUTH_REDIRECT_URL: slack_oauth_redirect_url !== null && slack_oauth_redirect_url !== void 0 ? slack_oauth_redirect_url : undefined,
                            SLACK_SIGNING_SECRET: slack_signing_secret !== null && slack_signing_secret !== void 0 ? slack_signing_secret : undefined,
                            SLACK_STATE_SECRET: slack_state_secret !== null && slack_state_secret !== void 0 ? slack_state_secret : undefined,
                            STRIPE_BYPASS_COMPANY_IDS: stripe_bypass_company_ids !== null && stripe_bypass_company_ids !== void 0 ? stripe_bypass_company_ids : undefined,
                            STRIPE_SECRET_KEY: stripe_secret_key !== null && stripe_secret_key !== void 0 ? stripe_secret_key : undefined,
                            STRIPE_WEBHOOK_SECRET: stripe_webhook_secret !== null && stripe_webhook_secret !== void 0 ? stripe_webhook_secret : undefined,
                            SUPABASE_ANON_KEY: anon_key,
                            SUPABASE_DB_URL: database_connection_pooler_url,
                            SUPABASE_JWT_SECRET: jwt_secret !== null && jwt_secret !== void 0 ? jwt_secret : undefined,
                            SUPABASE_SERVICE_ROLE_KEY: service_role_key,
                            SUPABASE_URL: database_url,
                            URL_ERP: url_erp,
                            URL_MES: url_mes,
                            VERCEL_ENV: "production",
                            XERO_CLIENT_ID: xero_client_id !== null && xero_client_id !== void 0 ? xero_client_id : undefined,
                            XERO_CLIENT_SECRET: xero_client_secret !== null && xero_client_secret !== void 0 ? xero_client_secret : undefined,
                            XERO_WEBHOOK_SECRET: xero_webhook_secret !== null && xero_webhook_secret !== void 0 ? xero_webhook_secret : undefined,
                        },
                        // Run SST from the repository root where sst.config.ts is located
                        cwd: "..",
                        stdio: "inherit",
                    });
                    console.log("\uD83D\uDE80 \uD83D\uDC13 Deploying apps for ".concat(workspace.id, " with SST"));
                    return [4 /*yield*/, $$(templateObject_1 || (templateObject_1 = __makeTemplateObject(["npx --yes sst@3.17.24 deploy --stage prod"], ["npx --yes sst@3.17.24 deploy --stage prod"])))];
                case 6:
                    _h.sent();
                    console.log("\u2705 \uD83C\uDF57 Successfully deployed ".concat(workspace.id));
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _h.sent();
                    console.error("\uD83D\uDD34 \uD83C\uDF73 Failed to deploy ".concat(workspace.id), error_1);
                    hasErrors = true;
                    return [3 /*break*/, 8];
                case 8:
                    _b = true;
                    return [3 /*break*/, 3];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _h.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _h.trys.push([11, , 14, 15]);
                    if (!(!_b && !_e && (_f = _c.return))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _f.call(_c)];
                case 12:
                    _h.sent();
                    _h.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    if (hasErrors) {
                        console.error("🔴 Deployment completed with errors");
                        process.exit(1);
                    }
                    console.log("✅ All deployments completed successfully");
                    return [2 /*return*/];
            }
        });
    });
}
deploy().catch(function (error) {
    console.error("🔴 Unexpected error during deployment", error);
    process.exit(1);
});
var templateObject_1;
