"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeletePurchasingRFQLine;
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var path_1 = require("~/utils/path");
function DeletePurchasingRFQLine(_a) {
    var _b;
    var line = _a.line, onCancel = _a.onCancel;
    var t = (0, macro_1.useLingui)().t;
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("id not found");
    if (!line.id)
        return null;
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deletePurchasingRfqLine(rfqId, line.id)} name={(_b = line.description) !== null && _b !== void 0 ? _b : "this line"} text={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Are you sure you want to delete the line: ", "? This cannot be undone."], ["Are you sure you want to delete the line: ", "? This cannot be undone."])), line.description)} onCancel={onCancel} onSubmit={onCancel}/>);
}
var templateObject_1;
