"use strict";
/// <reference path="./.sst/platform/config.d.ts" />
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
exports.default = $config({
    app: function (input) {
        return {
            name: "carbon",
            home: "aws",
            region: process.env.AWS_REGION,
            removal: (input === null || input === void 0 ? void 0 : input.stage) === "prod" ? "retain" : "remove",
        };
    },
    run: function () {
        return __awaiter(this, void 0, void 0, function () {
            var vpc, cluster, erp, mes, rateLimitRule, awsManagedRules;
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                vpc = new sst.aws.Vpc("CarbonVpc2");
                cluster = new sst.aws.Cluster("CarbonCluster", {
                    vpc: vpc,
                    forceUpgrade: "v2",
                });
                erp = cluster.addService("CarbonERPService", {
                    cpu: "2 vCPU",
                    memory: "4 GB",
                    image: "".concat(process.env.AWS_ACCOUNT_ID, ".dkr.ecr.").concat(process.env.AWS_REGION, ".amazonaws.com/carbon/erp:").concat(process.env.IMAGE_TAG),
                    loadBalancer: {
                        domain: {
                            name: (_a = process.env.URL_ERP) !== null && _a !== void 0 ? _a : "itar.carbon.ms",
                            dns: false,
                            cert: process.env.CERT_ARN_ERP,
                        },
                        health: {
                            "3000/http": {
                                path: "/health",
                            },
                        },
                        ports: [
                            { listen: "80/http", forward: "3000/http" },
                            { listen: "443/https", forward: "3000/http" },
                        ],
                    },
                    port: 3000,
                    scaling: {
                        min: 1,
                        max: 10,
                        cpuUtilization: 70,
                        memoryUtilization: 80,
                    },
                    environment: {
                        AUTH_PROVIDERS: process.env.AUTH_PROVIDERS,
                        CARBON_EDITION: process.env.CARBON_EDITION,
                        CLOUDFLARE_TURNSTILE_SECRET_KEY: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
                        CLOUDFLARE_TURNSTILE_SITE_KEY: process.env.CLOUDFLARE_TURNSTILE_SITE_KEY,
                        CONTROLLED_ENVIRONMENT: process.env.CONTROLLED_ENVIRONMENT,
                        DOMAIN: (_b = process.env.DOMAIN) !== null && _b !== void 0 ? _b : "carbon.ms",
                        ERP_URL: process.env.URL_ERP ? "https://".concat(process.env.URL_ERP) : "https://itar.carbon.ms",
                        EXCHANGE_RATES_API_KEY: process.env.EXCHANGE_RATES_API_KEY,
                        GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
                        INNGEST_BASE_URL: process.env.INNGEST_BASE_URL,
                        INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
                        INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
                        JIRA_CLIENT_ID: process.env.JIRA_CLIENT_ID,
                        JIRA_CLIENT_SECRET: process.env.JIRA_CLIENT_SECRET,
                        JIRA_OAUTH_REDIRECT_URL: process.env.JIRA_OAUTH_REDIRECT_URL,
                        JIRA_STATE_SECRET: process.env.JIRA_STATE_SECRET,
                        MES_URL: process.env.URL_MES ? "https://".concat(process.env.URL_MES) : "https://mes.itar.carbon.ms",
                        NODE_ENV: "production",
                        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                        ONSHAPE_CLIENT_ID: process.env.ONSHAPE_CLIENT_ID,
                        ONSHAPE_CLIENT_SECRET: process.env.ONSHAPE_CLIENT_SECRET,
                        ONSHAPE_OAUTH_REDIRECT_URL: process.env.ONSHAPE_OAUTH_REDIRECT_URL,
                        POSTHOG_API_HOST: process.env.POSTHOG_API_HOST,
                        POSTHOG_PROJECT_PUBLIC_KEY: process.env.POSTHOG_PROJECT_PUBLIC_KEY,
                        QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
                        QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
                        QUICKBOOKS_WEBHOOK_SECRET: process.env.QUICKBOOKS_WEBHOOK_SECRET,
                        RESEND_API_KEY: process.env.RESEND_API_KEY,
                        REDIS_URL: process.env.REDIS_URL,
                        RESEND_DOMAIN: (_c = process.env.RESEND_DOMAIN) !== null && _c !== void 0 ? _c : "carbon.ms",
                        SESSION_SECRET: process.env.SESSION_SECRET,
                        SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
                        SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
                        SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
                        SLACK_OAUTH_REDIRECT_URL: process.env.SLACK_OAUTH_REDIRECT_URL,
                        SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
                        SLACK_STATE_SECRET: process.env.SLACK_STATE_SECRET,
                        STRIPE_BYPASS_COMPANY_IDS: process.env.STRIPE_BYPASS_COMPANY_IDS,
                        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
                        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
                        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
                        SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
                        SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
                        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
                        SUPABASE_URL: process.env.SUPABASE_URL,
                        VERCEL_ENV: "production",
                        VERCEL_URL: (_d = process.env.URL_ERP) !== null && _d !== void 0 ? _d : "itar.carbon.ms",
                        XERO_CLIENT_ID: process.env.XERO_CLIENT_ID,
                        XERO_CLIENT_SECRET: process.env.XERO_CLIENT_SECRET,
                        XERO_WEBHOOK_SECRET: process.env.XERO_WEBHOOK_SECRET,
                    },
                    transform: {
                        loadBalancer: {
                            idleTimeout: 600,
                        },
                        // Add this to fix the health check path
                        target: function (args) {
                            args.healthCheck = {
                                enabled: true,
                                path: "/health",
                                protocol: "HTTP",
                            };
                        },
                    },
                });
                mes = cluster.addService("CarbonMESService", {
                    cpu: "2 vCPU",
                    memory: "4 GB",
                    image: "".concat(process.env.AWS_ACCOUNT_ID, ".dkr.ecr.").concat(process.env.AWS_REGION, ".amazonaws.com/carbon/mes:").concat(process.env.IMAGE_TAG),
                    loadBalancer: {
                        domain: {
                            name: (_e = process.env.URL_MES) !== null && _e !== void 0 ? _e : "mes.itar.carbon.ms",
                            dns: false,
                            cert: process.env.CERT_ARN_MES,
                        },
                        health: {
                            "3000/http": {
                                path: "/health",
                            },
                        },
                        ports: [
                            { listen: "80/http", forward: "3000/http" },
                            { listen: "443/https", forward: "3000/http" },
                        ],
                    },
                    port: 3000,
                    scaling: {
                        min: 1,
                        max: 10,
                        cpuUtilization: 70,
                        memoryUtilization: 80,
                    },
                    environment: {
                        AUTH_PROVIDERS: process.env.AUTH_PROVIDERS,
                        CARBON_EDITION: process.env.CARBON_EDITION,
                        CLOUDFLARE_TURNSTILE_SECRET_KEY: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
                        CLOUDFLARE_TURNSTILE_SITE_KEY: process.env.CLOUDFLARE_TURNSTILE_SITE_KEY,
                        CONTROLLED_ENVIRONMENT: process.env.CONTROLLED_ENVIRONMENT,
                        DOMAIN: (_f = process.env.DOMAIN) !== null && _f !== void 0 ? _f : "carbon.ms",
                        ERP_URL: process.env.URL_ERP ? "https://".concat(process.env.URL_ERP) : "https://itar.carbon.ms",
                        EXCHANGE_RATES_API_KEY: process.env.EXCHANGE_RATES_API_KEY,
                        INNGEST_BASE_URL: process.env.INNGEST_BASE_URL,
                        INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
                        INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
                        MES_URL: process.env.URL_MES ? "https://".concat(process.env.URL_MES) : "https://mes.itar.carbon.ms",
                        NODE_ENV: "production",
                        ONSHAPE_CLIENT_ID: process.env.ONSHAPE_CLIENT_ID,
                        ONSHAPE_CLIENT_SECRET: process.env.ONSHAPE_CLIENT_SECRET,
                        ONSHAPE_OAUTH_REDIRECT_URL: process.env.ONSHAPE_OAUTH_REDIRECT_URL,
                        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
                        POSTHOG_API_HOST: process.env.POSTHOG_API_HOST,
                        POSTHOG_PROJECT_PUBLIC_KEY: process.env.POSTHOG_PROJECT_PUBLIC_KEY,
                        REDIS_URL: process.env.REDIS_URL,
                        RESEND_API_KEY: process.env.RESEND_API_KEY,
                        RESEND_DOMAIN: (_g = process.env.RESEND_DOMAIN) !== null && _g !== void 0 ? _g : "carbon.ms",
                        SESSION_SECRET: process.env.SESSION_SECRET,
                        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
                        SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
                        SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,
                        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
                        SUPABASE_URL: process.env.SUPABASE_URL,
                        VERCEL_ENV: "production",
                        VERCEL_URL: (_h = process.env.URL_MES) !== null && _h !== void 0 ? _h : "mes.itar.carbon.ms",
                    },
                    transform: {
                        loadBalancer: {
                            idleTimeout: 600,
                        },
                        // Add this to fix the health check path
                        target: function (args) {
                            args.healthCheck = {
                                enabled: true,
                                path: "/health",
                                protocol: "HTTP",
                            };
                        },
                    },
                });
                rateLimitRule = {
                    name: "RateLimitRule",
                    statement: {
                        rateBasedStatement: {
                            limit: 1000,
                            aggregateKeyType: "IP",
                        },
                    },
                    priority: 1,
                    action: { block: {} },
                    visibilityConfig: {
                        cloudwatchMetricsEnabled: true,
                        sampledRequestsEnabled: true,
                        metricName: "CarbonRateLimitRule",
                    },
                };
                awsManagedRules = {
                    name: "AWSManagedRules",
                    statement: {
                        managedRuleGroupStatement: {
                            name: "AWSManagedRulesCommonRuleSet",
                            vendorName: "AWS",
                        },
                    },
                    priority: 2,
                    overrideAction: {
                        none: {},
                    },
                    visibilityConfig: {
                        cloudwatchMetricsEnabled: true,
                        sampledRequestsEnabled: true,
                        metricName: "MyAppAWSManagedRules",
                    },
                };
                // WAF configuration kept for manual association with load balancer
                // To use: Associate this WAF ACL with your manually created load balancer in AWS Console
                new aws.wafv2.WebAcl("AppAlbWebAcl", {
                    defaultAction: { allow: {} },
                    scope: "REGIONAL",
                    visibilityConfig: {
                        cloudwatchMetricsEnabled: true,
                        sampledRequestsEnabled: true,
                        metricName: "AppAlbWebAcl",
                    },
                    rules: [rateLimitRule, awsManagedRules],
                });
                return [2 /*return*/, {}];
            });
        });
    },
});
