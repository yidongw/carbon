"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOnboarding = useOnboarding;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function useOnboarding() {
    var routeData = (0, react_1.useRouteData)(path_1.path.to.onboarding.root);
    if (!routeData) {
        throw new Error("useOnboarding must be used within an onboarding route");
    }
    return {
        currentIndex: routeData === null || routeData === void 0 ? void 0 : routeData.currentIndex,
        onboardingSteps: routeData === null || routeData === void 0 ? void 0 : routeData.onboardingSteps,
        next: routeData === null || routeData === void 0 ? void 0 : routeData.nextPath,
        previous: routeData === null || routeData === void 0 ? void 0 : routeData.previousPath
    };
}
