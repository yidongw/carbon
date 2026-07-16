"use strict";
// ERP-side Storage Rules module. Re-exports cross-app queries from the
// `@carbon/ee/storage-rules` package alongside ERP-only admin CRUD + form
// validators.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unassignStorageRule = exports.getStorageRulesList = exports.getRuleAssignmentsForTarget = exports.getActiveRulesForTargets = exports.assignStorageRule = void 0;
var storage_rules_1 = require("@carbon/ee/storage-rules");
Object.defineProperty(exports, "assignStorageRule", { enumerable: true, get: function () { return storage_rules_1.assignStorageRule; } });
Object.defineProperty(exports, "getActiveRulesForTargets", { enumerable: true, get: function () { return storage_rules_1.getActiveRulesForTargets; } });
Object.defineProperty(exports, "getRuleAssignmentsForTarget", { enumerable: true, get: function () { return storage_rules_1.getRuleAssignmentsForTarget; } });
Object.defineProperty(exports, "getStorageRulesList", { enumerable: true, get: function () { return storage_rules_1.getStorageRulesList; } });
Object.defineProperty(exports, "unassignStorageRule", { enumerable: true, get: function () { return storage_rules_1.unassignStorageRule; } });
__exportStar(require("./storageRules.models"), exports);
__exportStar(require("./storageRules.service"), exports);
