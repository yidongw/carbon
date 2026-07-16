"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SupplierRiskRegister;
var RiskRegisterCard_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterCard");
function SupplierRiskRegister(_a) {
    var supplierId = _a.supplierId;
    return <RiskRegisterCard_1.default sourceId={supplierId} source="Supplier"/>;
}
