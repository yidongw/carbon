"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STYLE_SYSTEM_OPERATION_TAG = exports.STYLE_CUTTING_OPERATION_TAG = exports.STYLE_CUTTING_PROCESS_TAG = void 0;
exports.isStyleCuttingOperation = isStyleCuttingOperation;
exports.isStyleSystemOwnedOperation = isStyleSystemOwnedOperation;
exports.isStyleCuttingOperationFirst = isStyleCuttingOperationFirst;
exports.buildStyleCuttingMethodOperation = buildStyleCuttingMethodOperation;
exports.getBundleJobCuttingOperationIdsToDelete = getBundleJobCuttingOperationIdsToDelete;
exports.getParentJobNonCuttingOperationIdsToDelete = getParentJobNonCuttingOperationIdsToDelete;
exports.ensureStyleRootMakeMethod = ensureStyleRootMakeMethod;
exports.ensureStyleCuttingProcess = ensureStyleCuttingProcess;
exports.ensureStyleCuttingOperation = ensureStyleCuttingOperation;
exports.ensureStyleMethodScaffold = ensureStyleMethodScaffold;
exports.STYLE_CUTTING_PROCESS_TAG = "style:cutting-process";
exports.STYLE_CUTTING_OPERATION_TAG = "style:cutting-operation";
exports.STYLE_SYSTEM_OPERATION_TAG = "style:system-operation";
function getStyleStage(customFields) {
    if (!customFields || typeof customFields !== "object")
        return null;
    var styleStage = customFields.styleStage;
    return typeof styleStage === "string" ? styleStage : null;
}
function isStyleCuttingOperation(operation) {
    var _a;
    var tags = (_a = operation.tags) !== null && _a !== void 0 ? _a : [];
    return (tags.includes(exports.STYLE_CUTTING_OPERATION_TAG) ||
        getStyleStage(operation.customFields) === "cutting");
}
function isStyleSystemOwnedOperation(operation) {
    var _a;
    var tags = (_a = operation.tags) !== null && _a !== void 0 ? _a : [];
    if (tags.includes(exports.STYLE_SYSTEM_OPERATION_TAG))
        return true;
    if (!operation.customFields || typeof operation.customFields !== "object") {
        return false;
    }
    return (operation.customFields.styleSystemOwned ===
        true);
}
function isStyleCuttingOperationFirst(operations) {
    var _a;
    if (operations.length === 0)
        return true;
    var cuttingOperation = operations.find(function (operation) {
        return isStyleCuttingOperation(operation);
    });
    if (!cuttingOperation)
        return true;
    var cuttingOrder = (_a = cuttingOperation.order) !== null && _a !== void 0 ? _a : 0;
    var firstOrder = operations.reduce(function (lowest, operation) { var _a; return Math.min(lowest, (_a = operation.order) !== null && _a !== void 0 ? _a : 0); }, Number.POSITIVE_INFINITY);
    return cuttingOrder <= firstOrder;
}
function buildStyleCuttingMethodOperation(args) {
    var _a;
    return {
        makeMethodId: args.makeMethodId,
        processId: args.processId,
        companyId: args.companyId,
        createdBy: args.createdBy,
        order: (_a = args.order) !== null && _a !== void 0 ? _a : 0,
        operationOrder: "After Previous",
        operationType: "Inside",
        description: "Cutting",
        setupUnit: "Minutes/Piece",
        setupTime: 0,
        laborUnit: "Minutes/Piece",
        laborTime: 0,
        machineUnit: "Minutes/Piece",
        machineTime: 0,
        insideUnitCost: 0,
        tags: [exports.STYLE_CUTTING_OPERATION_TAG, exports.STYLE_SYSTEM_OPERATION_TAG],
        customFields: {
            styleStage: "cutting",
            styleSystemOwned: true
        }
    };
}
function getBundleJobCuttingOperationIdsToDelete(args) {
    var tagged = args.operations
        .filter(function (operation) { return isStyleCuttingOperation(operation); })
        .map(function (operation) { return operation.id; });
    if (tagged.length > 0)
        return tagged;
    if (args.cuttingProcessId) {
        var byProcess = args.operations
            .filter(function (operation) { return operation.processId === args.cuttingProcessId; })
            .map(function (operation) { return operation.id; });
        if (byProcess.length > 0)
            return byProcess;
    }
    var firstOperation = __spreadArray([], args.operations, true).sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); })
        .find(Boolean);
    return firstOperation ? [firstOperation.id] : [];
}
function getParentJobNonCuttingOperationIdsToDelete(args) {
    var cuttingIds = args.operations
        .filter(function (operation) { return isStyleCuttingOperation(operation); })
        .map(function (operation) { return operation.id; });
    if (cuttingIds.length > 0) {
        return args.operations
            .map(function (operation) { return operation.id; })
            .filter(function (id) { return !cuttingIds.includes(id); });
    }
    var firstOperation = __spreadArray([], args.operations, true).sort(function (a, b) { var _a, _b; return ((_a = a.order) !== null && _a !== void 0 ? _a : 0) - ((_b = b.order) !== null && _b !== void 0 ? _b : 0); })
        .find(Boolean);
    if (!firstOperation)
        return [];
    return args.operations
        .map(function (operation) { return operation.id; })
        .filter(function (id) { return id !== firstOperation.id; });
}
function ensureStyleRootMakeMethod(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var makeMethod;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, client
                        .from("makeMethod")
                        .select("id")
                        .eq("itemId", args.itemId)
                        .eq("companyId", args.companyId)
                        .order("createdAt", { ascending: true })
                        .limit(1)
                        .maybeSingle()];
                case 1:
                    makeMethod = _b.sent();
                    if (makeMethod.error)
                        return [2 /*return*/, { data: null, error: makeMethod.error }];
                    if ((_a = makeMethod.data) === null || _a === void 0 ? void 0 : _a.id) {
                        return [2 /*return*/, { data: { id: makeMethod.data.id }, error: null }];
                    }
                    return [2 /*return*/, client
                            .from("makeMethod")
                            .insert({
                            itemId: args.itemId,
                            companyId: args.companyId,
                            createdBy: args.userId
                        })
                            .select("id")
                            .single()];
            }
        });
    });
}
function ensureStyleCuttingProcess(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var processClient, existing, byName, tags, updated;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    processClient = client;
                    return [4 /*yield*/, processClient
                            .from("process")
                            .select("id, name, tags")
                            .eq("companyId", args.companyId)
                            .contains("tags", [exports.STYLE_CUTTING_PROCESS_TAG])
                            .limit(1)
                            .maybeSingle()];
                case 1:
                    existing = _d.sent();
                    if (existing.error)
                        return [2 /*return*/, { data: null, error: existing.error }];
                    if ((_a = existing.data) === null || _a === void 0 ? void 0 : _a.id) {
                        return [2 /*return*/, {
                                data: { id: existing.data.id, name: existing.data.name },
                                error: null
                            }];
                    }
                    return [4 /*yield*/, processClient
                            .from("process")
                            .select("id, name, tags")
                            .eq("companyId", args.companyId)
                            .in("name", ["Cutting", "裁剪"])
                            .order("createdAt", { ascending: true })
                            .limit(1)
                            .maybeSingle()];
                case 2:
                    byName = _d.sent();
                    if (byName.error)
                        return [2 /*return*/, { data: null, error: byName.error }];
                    if (!((_b = byName.data) === null || _b === void 0 ? void 0 : _b.id)) return [3 /*break*/, 4];
                    tags = Array.from(new Set(__spreadArray(__spreadArray([], ((_c = byName.data.tags) !== null && _c !== void 0 ? _c : []), true), [exports.STYLE_CUTTING_PROCESS_TAG], false)));
                    return [4 /*yield*/, processClient
                            .from("process")
                            .update({ tags: tags, updatedBy: args.userId })
                            .eq("id", byName.data.id)];
                case 3:
                    updated = _d.sent();
                    if (updated.error)
                        return [2 /*return*/, { data: null, error: updated.error }];
                    return [2 /*return*/, {
                            data: { id: byName.data.id, name: byName.data.name },
                            error: null
                        }];
                case 4: return [2 /*return*/, processClient
                        .from("process")
                        .insert({
                        name: "Cutting",
                        processType: "Inside",
                        defaultStandardFactor: "Minutes/Piece",
                        completeAllOnScan: false,
                        tags: [exports.STYLE_CUTTING_PROCESS_TAG],
                        companyId: args.companyId,
                        createdBy: args.userId
                    })
                        .select("id, name")
                        .single()];
            }
        });
    });
}
function ensureStyleCuttingOperation(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var process, operationClient, operations, existingCutting, firstOperation, tags, customFields, updated, insert;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, ensureStyleCuttingProcess(client, args)];
                case 1:
                    process = _e.sent();
                    if (process.error || !((_a = process.data) === null || _a === void 0 ? void 0 : _a.id)) {
                        return [2 /*return*/, { data: null, error: process.error }];
                    }
                    operationClient = client;
                    return [4 /*yield*/, operationClient
                            .from("methodOperation")
                            .select("id, processId, order, tags, customFields")
                            .eq("makeMethodId", args.makeMethodId)
                            .order("order", { ascending: true })];
                case 2:
                    operations = _e.sent();
                    if (operations.error)
                        return [2 /*return*/, { data: null, error: operations.error }];
                    existingCutting = ((_b = operations.data) !== null && _b !== void 0 ? _b : []).find(function (operation) {
                        return isStyleCuttingOperation(operation);
                    });
                    if (existingCutting === null || existingCutting === void 0 ? void 0 : existingCutting.id) {
                        return [2 /*return*/, { data: { id: existingCutting.id }, error: null }];
                    }
                    firstOperation = ((_c = operations.data) !== null && _c !== void 0 ? _c : [])[0];
                    if (!((firstOperation === null || firstOperation === void 0 ? void 0 : firstOperation.processId) === process.data.id)) return [3 /*break*/, 4];
                    tags = Array.from(new Set(__spreadArray(__spreadArray([], ((_d = firstOperation.tags) !== null && _d !== void 0 ? _d : []), true), [
                        exports.STYLE_CUTTING_OPERATION_TAG,
                        exports.STYLE_SYSTEM_OPERATION_TAG
                    ], false)));
                    customFields = __assign(__assign({}, (typeof firstOperation.customFields === "object" &&
                        firstOperation.customFields
                        ? firstOperation.customFields
                        : {})), { styleStage: "cutting", styleSystemOwned: true });
                    return [4 /*yield*/, operationClient
                            .from("methodOperation")
                            .update({
                            tags: tags,
                            customFields: customFields,
                            updatedBy: args.userId
                        })
                            .eq("id", firstOperation.id)
                            .select("id")
                            .single()];
                case 3:
                    updated = _e.sent();
                    if (updated.error)
                        return [2 /*return*/, { data: null, error: updated.error }];
                    return [2 /*return*/, updated];
                case 4: return [4 /*yield*/, operationClient
                        .from("methodOperation")
                        .insert(buildStyleCuttingMethodOperation({
                        makeMethodId: args.makeMethodId,
                        processId: process.data.id,
                        companyId: args.companyId,
                        createdBy: args.userId,
                        order: firstOperation && typeof firstOperation.order === "number"
                            ? firstOperation.order - 1
                            : 0
                    }))
                        .select("id")
                        .single()];
                case 5:
                    insert = _e.sent();
                    if (insert.error)
                        return [2 /*return*/, { data: null, error: insert.error }];
                    return [2 /*return*/, insert];
            }
        });
    });
}
function ensureStyleMethodScaffold(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var makeMethod, cutting;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, ensureStyleRootMakeMethod(client, args)];
                case 1:
                    makeMethod = _d.sent();
                    if (makeMethod.error || !((_a = makeMethod.data) === null || _a === void 0 ? void 0 : _a.id))
                        return [2 /*return*/, makeMethod];
                    return [4 /*yield*/, ensureStyleCuttingOperation(client, {
                            makeMethodId: makeMethod.data.id,
                            companyId: args.companyId,
                            userId: args.userId
                        })];
                case 2:
                    cutting = _d.sent();
                    if (cutting.error)
                        return [2 /*return*/, { data: null, error: cutting.error }];
                    return [2 /*return*/, {
                            data: {
                                makeMethodId: makeMethod.data.id,
                                cuttingOperationId: (_c = (_b = cutting.data) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null
                            },
                            error: null
                        }];
            }
        });
    });
}
