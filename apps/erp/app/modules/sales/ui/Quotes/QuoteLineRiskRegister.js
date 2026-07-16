"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QuoteLineRiskRegister;
var RiskRegisterCard_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterCard");
function QuoteLineRiskRegister(_a) {
    var quoteLineId = _a.quoteLineId, itemId = _a.itemId;
    return (<RiskRegisterCard_1.default sourceId={quoteLineId} source="Quote Line" itemId={itemId}/>);
}
