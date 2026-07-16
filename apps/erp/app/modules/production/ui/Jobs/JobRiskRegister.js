"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JobRiskRegister;
var RiskRegisterCard_1 = require("~/modules/quality/ui/RiskRegister/RiskRegisterCard");
function JobRiskRegister(_a) {
    var jobId = _a.jobId, itemId = _a.itemId;
    return <RiskRegisterCard_1.default sourceId={jobId} source="Job" itemId={itemId}/>;
}
