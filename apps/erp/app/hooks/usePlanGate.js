"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePlanGate = usePlanGate;
var plan_1 = require("@carbon/ee/plan");
var react_1 = require("@carbon/react");
var useFlags_1 = require("~/hooks/useFlags");
function usePlanGate(spec) {
    var currentPlan = (0, react_1.usePlan)();
    var isCloud = (0, useFlags_1.useFlags)().isCloud;
    var requirement = (0, plan_1.resolveRequirement)(spec);
    var isGated = isCloud && !(0, plan_1.planMeetsRequirement)(currentPlan, requirement);
    return { isGated: isGated, plan: currentPlan, allowedPlans: requirement };
}
