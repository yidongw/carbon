"use strict";
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
exports.INTEGRATION_WHITELIST = exports.FEATURE_PLANS = void 0;
exports.isIntegrationWhitelisted = isIntegrationWhitelisted;
exports.resolveRequirement = resolveRequirement;
exports.planMeetsRequirement = planMeetsRequirement;
exports.defaultUpgradeMessage = defaultUpgradeMessage;
var utils_1 = require("@carbon/utils");
/**
 * Source of truth: which plans grant which feature. Both client
 * (`usePlanGate`) and server (`plan.server.ts`) read from here.
 */
exports.FEATURE_PLANS = {
    API_KEYS: [utils_1.Plan.Business, utils_1.Plan.Partner],
    WEBHOOKS: [utils_1.Plan.Business, utils_1.Plan.Partner],
    INTEGRATIONS: [utils_1.Plan.Business, utils_1.Plan.Partner],
    ITEM_RULES: [utils_1.Plan.Business, utils_1.Plan.Partner],
    AUDIT_LOG: [utils_1.Plan.Business, utils_1.Plan.Partner],
    EMAIL_NOTIFICATIONS: [utils_1.Plan.Business, utils_1.Plan.Partner],
    STORAGE_RULES: [utils_1.Plan.Business, utils_1.Plan.Partner],
    CUSTOMER_PORTALS: [utils_1.Plan.Business, utils_1.Plan.Partner]
};
/**
 * Integration ids that bypass the `INTEGRATIONS` plan gate. Add ids here for
 * integrations that should remain available on every plan.
 */
exports.INTEGRATION_WHITELIST = new Set([
    "email",
    "exchange-rates-v1"
]);
function isIntegrationWhitelisted(id) {
    return exports.INTEGRATION_WHITELIST.has(id);
}
function resolveRequirement(spec) {
    if (spec.feature)
        return __spreadArray([], exports.FEATURE_PLANS[spec.feature], true);
    return Array.isArray(spec.plan) ? spec.plan : [spec.plan];
}
function planMeetsRequirement(current, requirement) {
    if (requirement.length === 0)
        return true;
    return requirement.includes(current);
}
function defaultUpgradeMessage(requirement) {
    if (requirement.length === 1 && requirement[0] === utils_1.Plan.Business) {
        return "Upgrade to the Business plan to enable this feature.";
    }
    return "Upgrade your plan to enable this feature.";
}
