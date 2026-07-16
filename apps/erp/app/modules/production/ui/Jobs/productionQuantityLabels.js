"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCTION_QUANTITY_TYPES = void 0;
exports.useProductionQuantityTypeLabel = useProductionQuantityTypeLabel;
exports.useProductionQuantityActivityMessage = useProductionQuantityActivityMessage;
exports.useOperationTypeLabel = useOperationTypeLabel;
exports.useOperationOrderLabel = useOperationOrderLabel;
exports.useRelativeCreatedUpdatedText = useRelativeCreatedUpdatedText;
exports.useProductionEventActivityMessage = useProductionEventActivityMessage;
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
exports.PRODUCTION_QUANTITY_TYPES = [
    "Production",
    "Rework",
    "Scrap"
];
function useProductionQuantityTypeLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (type) {
        switch (type) {
            case "Production":
                return t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Production"], ["Production"])));
            case "Rework":
                return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Rework"], ["Rework"])));
            case "Scrap":
                return t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Scrap"], ["Scrap"])));
            default:
                return type;
        }
    };
}
function useProductionQuantityActivityMessage() {
    var t = (0, macro_1.useLingui)().t;
    return function (item) {
        var _a;
        var qty = item.quantity;
        switch (item.type) {
            case "Scrap": {
                var reason = (_a = item.scrapReason) === null || _a === void 0 ? void 0 : _a.name;
                return reason
                    ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["recorded ", " units (", ")"], ["recorded ", " units (", ")"])), qty, reason) : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["recorded ", " units"], ["recorded ", " units"])), qty);
            }
            default:
                return t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["recorded ", " units"], ["recorded ", " units"])), qty);
        }
    };
}
function useOperationTypeLabel() {
    var t = (0, macro_1.useLingui)().t;
    // Memoized for a stable identity — this feeds table column-builder useMemo
    // deps, so an unstable function rebuilds columns every render (remounting
    // cells and closing open dropdowns). See useJobOperationStatusLabel.
    return (0, react_1.useCallback)(function (type) {
        switch (type) {
            case "Inside":
                return t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Inside"], ["Inside"])));
            case "Outside":
                return t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Outside"], ["Outside"])));
            default:
                return type;
        }
    }, [t]);
}
function useOperationOrderLabel() {
    var t = (0, macro_1.useLingui)().t;
    return function (order) {
        switch (order) {
            case "After Previous":
                return t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["After Previous"], ["After Previous"])));
            case "With Previous":
                return t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["With Previous"], ["With Previous"])));
            default:
                return order;
        }
    };
}
function useRelativeCreatedUpdatedText() {
    var t = (0, macro_1.useLingui)().t;
    return function (isUpdated, relativeTime) {
        return isUpdated ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Updated ", ""], ["Updated ", ""])), relativeTime) : t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Created ", ""], ["Created ", ""])), relativeTime);
    };
}
function useProductionEventActivityMessage() {
    var t = (0, macro_1.useLingui)().t;
    return function (item) {
        var _a;
        switch ((_a = item.type) !== null && _a !== void 0 ? _a : "") {
            case "Setup":
                return item.duration
                    ? t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["did ", " of setup"], ["did ", " of setup"])), (0, utils_1.formatDurationMilliseconds)(item.duration * 1000)) : t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["started setup"], ["started setup"])));
            case "Labor":
                return item.duration
                    ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["did ", " of labor"], ["did ", " of labor"])), (0, utils_1.formatDurationMilliseconds)(item.duration * 1000)) : t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["started labor"], ["started labor"])));
            case "Machine":
                return item.duration
                    ? t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["did ", " of machine"], ["did ", " of machine"])), (0, utils_1.formatDurationMilliseconds)(item.duration * 1000)) : t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["started machine"], ["started machine"])));
            default:
                return "";
        }
    };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
