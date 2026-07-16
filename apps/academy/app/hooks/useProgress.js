"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProgress = useProgress;
var react_1 = require("@carbon/react");
var path_1 = require("~/utils/path");
function isProgressData(value) {
    return (Array.isArray(value === null || value === void 0 ? void 0 : value.lessonCompletions) &&
        Array.isArray(value === null || value === void 0 ? void 0 : value.challengeAttempts));
}
function useProgress() {
    var data = (0, react_1.useRouteData)(path_1.path.to.root);
    if (data && isProgressData(data)) {
        return data;
    }
    // Return empty arrays if no data or user not authenticated
    return {
        lessonCompletions: [],
        challengeAttempts: []
    };
}
