"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOverlayConfirm = completeOverlayConfirm;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
function completeOverlayConfirm(_a) {
    var _b, _c;
    var data = _a.data, instance = _a.instance, confirmMode = _a.confirmMode, onClose = _a.onClose, i18n = _a.i18n;
    if (typeof data !== "object" || data === null) {
        react_1.toast.error(i18n._((0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Update failed"], ["Update failed"])))));
        return;
    }
    if ("ok" in data && data.ok === false) {
        var message = "error" in data && typeof data.error === "string" && data.error
            ? data.error
            : i18n._((0, macro_1.msg)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Update failed"], ["Update failed"]))));
        react_1.toast.error(message);
        return;
    }
    if (!("ok" in data) || data.ok !== true) {
        react_1.toast.error(i18n._((0, macro_1.msg)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Update failed"], ["Update failed"])))));
        return;
    }
    (_b = instance.onSuccess) === null || _b === void 0 ? void 0 : _b.call(instance, data);
    (_c = instance.onCreated) === null || _c === void 0 ? void 0 : _c.call(instance);
    if (confirmMode === "server" && instance.overlayId === "jobConfigTable") {
        react_1.toast.success(i18n._((0, macro_1.msg)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Quantity updated"], ["Quantity updated"])))));
    }
    onClose(instance.id);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
