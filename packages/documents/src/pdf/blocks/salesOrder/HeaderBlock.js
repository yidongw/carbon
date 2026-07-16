"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBlock = HeaderBlock;
var components_1 = require("../../components");
function HeaderBlock(_a) {
    var _b, _c;
    var data = _a.data;
    return (<components_1.Header company={data.company} title="Sales Order" documentId={(_b = data.salesOrder) === null || _b === void 0 ? void 0 : _b.salesOrderId} currencyCode={(_c = data.salesOrder) === null || _c === void 0 ? void 0 : _c.currencyCode} locale={data.locale} options={data.headerOptions}/>);
}
