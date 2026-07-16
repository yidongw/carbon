"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ItemRiskRegister;
var RiskRegisterCard_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterCard");
function ItemRiskRegister(_a) {
    var itemId = _a.itemId;
    return <RiskRegisterCard_1.default sourceId={itemId} source="Item" itemId={itemId}/>;
}
