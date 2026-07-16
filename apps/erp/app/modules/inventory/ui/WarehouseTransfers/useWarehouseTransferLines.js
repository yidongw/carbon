"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useWarehouseTransferLines;
var react_1 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useWarehouseTransferLines(warehouseTransfer) {
    var fetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var isEditable = ["Draft"].includes(warehouseTransfer.status);
    var canEdit = isEditable && permissions.can("update", "inventory");
    var onCellEdit = (0, react_1.useCallback)(function (id, value, field) {
        var _a;
        if (!canEdit)
            return;
        var formData = new FormData();
        formData.append("type", "update");
        formData.append("id", id);
        formData.append(field, (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : "");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.warehouseTransferLine(warehouseTransfer.id, id)
        });
    }, [canEdit, fetcher, warehouseTransfer.id]);
    return {
        canEdit: canEdit,
        onCellEdit: onCellEdit
    };
}
