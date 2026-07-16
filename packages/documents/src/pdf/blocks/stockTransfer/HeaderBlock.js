"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderBlock = HeaderBlock;
var components_1 = require("../../components");
function HeaderBlock(_a) {
    var _b, _c;
    var data = _a.data;
    return (<components_1.Header company={data.company} title="Stock Transfer" documentId={(_b = data.stockTransfer) === null || _b === void 0 ? void 0 : _b.stockTransferId} date={(_c = data.stockTransfer) === null || _c === void 0 ? void 0 : _c.createdAt} locale={data.locale} options={data.headerOptions}/>);
}
