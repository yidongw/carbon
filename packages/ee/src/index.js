"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntegrationConfigById = exports.Xero = exports.Slack = exports.QuickBooks = exports.PaperlessPartsClient = exports.Onshape = exports.OnshapeLogo = exports.Jira = exports.integrations = exports.defineIntegration = exports.Email = void 0;
var config_1 = require("./email/config");
var config_2 = require("./exchange-rates/config");
var config_3 = require("./jira/config");
var config_4 = require("./linear/config");
var config_5 = require("./onshape/config");
var config_6 = require("./paperless-parts/config");
var config_7 = require("./quickbooks/config");
// import { Radan } from "./radan/config";
var config_8 = require("./sage/config");
var config_9 = require("./slack/config");
var config_10 = require("./xero/config");
var config_11 = require("./zapier/config");
var config_12 = require("./email/config");
Object.defineProperty(exports, "Email", { enumerable: true, get: function () { return config_12.Email; } });
var fns_1 = require("./fns");
Object.defineProperty(exports, "defineIntegration", { enumerable: true, get: function () { return fns_1.defineIntegration; } });
exports.integrations = [
    // Radan,
    config_1.Email,
    config_2.ExchangeRates,
    config_3.Jira,
    config_4.Linear,
    config_5.Onshape,
    config_6.PaperlessParts,
    config_7.QuickBooks,
    config_8.Sage,
    config_9.Slack,
    config_10.Xero,
    config_11.Zapier
];
var config_13 = require("./jira/config");
Object.defineProperty(exports, "Jira", { enumerable: true, get: function () { return config_13.Jira; } });
var config_14 = require("./onshape/config");
Object.defineProperty(exports, "OnshapeLogo", { enumerable: true, get: function () { return config_14.Logo; } });
Object.defineProperty(exports, "Onshape", { enumerable: true, get: function () { return config_14.Onshape; } });
// TODO: export as @carbon/ee/paperless
var client_1 = require("./paperless-parts/lib/client");
Object.defineProperty(exports, "PaperlessPartsClient", { enumerable: true, get: function () { return client_1.PaperlessPartsClient; } });
var config_15 = require("./quickbooks/config");
Object.defineProperty(exports, "QuickBooks", { enumerable: true, get: function () { return config_15.QuickBooks; } });
var config_16 = require("./slack/config");
Object.defineProperty(exports, "Slack", { enumerable: true, get: function () { return config_16.Slack; } });
__exportStar(require("./slack/lib/messages"), exports);
var config_17 = require("./xero/config");
Object.defineProperty(exports, "Xero", { enumerable: true, get: function () { return config_17.Xero; } });
/**
 * Retrieves an integration configuration by its unique ID.
 * @param id - The unique identifier of the integration
 * @returns The integration configuration if found, undefined otherwise
 */
var getIntegrationConfigById = function (id) {
    return exports.integrations.find(function (integration) { return integration.id === id; });
};
exports.getIntegrationConfigById = getIntegrationConfigById;
