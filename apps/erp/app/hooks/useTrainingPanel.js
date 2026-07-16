"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTrainingPanel = useTrainingPanel;
var react_1 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var training_1 = require("~/utils/training");
var useUser_1 = require("./useUser");
var FLAG_PREFIX = "training:";
var MAX_IMPRESSIONS = 3;
function safeLocalGet(key) {
    try {
        return localStorage.getItem(key);
    }
    catch (_a) {
        return null;
    }
}
function safeLocalSet(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch (_a) {
        // localStorage may be unavailable
    }
}
function useTrainingPanel() {
    var _a, _b;
    var _c = (0, react_router_1.useLocation)(), pathname = _c.pathname, locationKey = _c.key;
    var flags = (0, useUser_1.useUser)().flags;
    var fetcher = (0, react_router_1.useFetcher)({ key: "training-dismiss" });
    var lastCountedKey = (0, react_1.useRef)(null);
    var training = (0, training_1.getTrainingForPath)(pathname);
    var trainingKey = (0, training_1.getTrainingKey)(pathname);
    var flagKey = trainingKey ? "".concat(FLAG_PREFIX).concat(trainingKey) : null;
    var pendingDismissFlag = (_a = fetcher.formData) === null || _a === void 0 ? void 0 : _a.get("flag");
    var isPendingDismiss = pendingDismissFlag === flagKey;
    var isDbDismissed = flagKey ? flags[flagKey] === true : false;
    var isLocalDismissed = flagKey
        ? safeLocalGet("training_dismissed_".concat(flagKey)) === "true"
        : false;
    var impressionCount = flagKey
        ? parseInt((_b = safeLocalGet("training_impressions_".concat(flagKey))) !== null && _b !== void 0 ? _b : "0", 10)
        : 0;
    var tooManyImpressions = impressionCount >= MAX_IMPRESSIONS;
    var isDismissed = isPendingDismiss || isDbDismissed || isLocalDismissed;
    var isOpen = !!training && !!flagKey && !isDismissed && !tooManyImpressions;
    // Count impressions per navigation (locationKey deduplicates StrictMode remounts)
    (0, react_1.useEffect)(function () {
        var _a;
        if (isOpen && flagKey && lastCountedKey.current !== locationKey) {
            lastCountedKey.current = locationKey;
            var key = "training_impressions_".concat(flagKey);
            var count = parseInt((_a = safeLocalGet(key)) !== null && _a !== void 0 ? _a : "0", 10);
            safeLocalSet(key, String(count + 1));
        }
    }, [isOpen, flagKey, locationKey]);
    // Once the impression cap is hit, sync the dismiss to DB on the next visit
    (0, react_1.useEffect)(function () {
        if (tooManyImpressions && flagKey && !isDismissed) {
            safeLocalSet("training_dismissed_".concat(flagKey), "true");
            fetcher.submit({ intent: "flag", flag: flagKey, value: "true" }, { method: "POST", action: path_1.path.to.acknowledge });
        }
    }, [tooManyImpressions, flagKey, isDismissed, fetcher]);
    var dismiss = function () {
        if (!flagKey)
            return;
        safeLocalSet("training_dismissed_".concat(flagKey), "true");
        fetcher.submit({ intent: "flag", flag: flagKey, value: "true" }, { method: "POST", action: path_1.path.to.acknowledge });
    };
    return {
        isOpen: isOpen,
        training: training,
        hasTraining: training !== null,
        dismiss: dismiss
    };
}
