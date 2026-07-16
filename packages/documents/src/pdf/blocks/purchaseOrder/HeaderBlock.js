"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBlock = HeaderBlock;
var components_1 = require("../../components");
function HeaderBlock(_a) {
    var _b;
    var data = _a.data;
    return (<components_1.Header company={data.company} title="Purchase Order" documentId={(_b = data.purchaseOrder) === null || _b === void 0 ? void 0 : _b.purchaseOrderId} locale={data.locale} options={data.headerOptions} fixed/>);
}
