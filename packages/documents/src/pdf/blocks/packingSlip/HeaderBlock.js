"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBlock = HeaderBlock;
var components_1 = require("../../components");
function HeaderBlock(_a) {
    var _b, _c;
    var data = _a.data;
    return (<components_1.Header company={data.company} title="Packing Slip" documentId={(_b = data.shipment) === null || _b === void 0 ? void 0 : _b.shipmentId} date={(_c = data.shipment) === null || _c === void 0 ? void 0 : _c.postingDate} locale={data.locale} options={data.headerOptions}/>);
}
