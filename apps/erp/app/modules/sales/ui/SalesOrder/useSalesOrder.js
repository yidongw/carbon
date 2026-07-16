"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSalesOrder = void 0;
var react_1 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var useSalesOrder = function () {
    var navigate = (0, react_router_1.useNavigate)();
    var submit = (0, react_router_1.useSubmit)();
    var edit = (0, react_1.useCallback)(function (salesOrder) { return navigate(path_1.path.to.salesOrder(salesOrder.id)); }, [navigate]);
    var invoice = (0, react_1.useCallback)(function (salesOrder) {
        return navigate("".concat(path_1.path.to.newSalesInvoice, "?sourceDocument=Sales Order&sourceDocumentId=").concat(salesOrder.id));
    }, [navigate]);
    var ship = (0, react_1.useCallback)(function (salesOrder) {
        var formData = new FormData();
        formData.set("sourceDocument", "Sales Order");
        formData.set("sourceDocumentId", salesOrder.id);
        submit(formData, { method: "post", action: path_1.path.to.newShipment });
    }, [submit]);
    return {
        edit: edit,
        invoice: invoice,
        ship: ship
    };
};
exports.useSalesOrder = useSalesOrder;
