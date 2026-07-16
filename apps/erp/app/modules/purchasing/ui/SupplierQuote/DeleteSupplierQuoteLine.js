"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DeleteSupplierQuoteLine;
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function DeleteSupplierQuoteLine(_a) {
    var line = _a.line, onCancel = _a.onCancel;
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    if (!line.id)
        return null;
    var itemReadableId = (0, utils_1.getItemReadableId)(items, line.itemId);
    return (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSupplierQuoteLine(id, line.id)} name={itemReadableId !== null && itemReadableId !== void 0 ? itemReadableId : "this line"} text={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Are you sure you want to delete the line: ", "? This cannot be undone."], ["Are you sure you want to delete the line: ", "? This cannot be undone."])), itemReadableId)} onCancel={onCancel} onSubmit={onCancel}/>);
}
var templateObject_1;
