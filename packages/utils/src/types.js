"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = exports.modeValidator = exports.Edition = void 0;
exports.normalizePlanId = normalizePlanId;
var zod_1 = require("zod");
var Edition;
(function (Edition) {
    Edition["Cloud"] = "cloud";
    Edition["Enterprise"] = "enterprise";
    Edition["Community"] = "community";
    Edition["Test"] = "test";
})(Edition || (exports.Edition = Edition = {}));
exports.modeValidator = zod_1.z.object({
    mode: zod_1.z.enum(["light", "dark", "system"])
});
var Plan;
(function (Plan) {
    Plan["Starter"] = "STARTER";
    Plan["Business"] = "BUSINESS";
    Plan["Partner"] = "PARTNER";
    Plan["Unknown"] = "UNKNOWN";
})(Plan || (exports.Plan = Plan = {}));
// DB stores partner tiers as `PARTNER-300/400/500` etc. Collapse them onto
// `Plan.Partner` so plan-gate checks (`requirement.includes(plan)`) match.
function normalizePlanId(planId) {
    if (!planId)
        return Plan.Unknown;
    if (planId.startsWith("PARTNER"))
        return Plan.Partner;
    return planId;
}
