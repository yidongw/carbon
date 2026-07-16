"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerRiskRegister;
var RiskRegisterCard_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterCard");
function CustomerRiskRegister(_a) {
    var customerId = _a.customerId;
    return <RiskRegisterCard_1.default sourceId={customerId} source="Customer"/>;
}
