"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyle = getStyle;
exports.getStyleColorContext = getStyleColorContext;
exports.ensureStyleMethodScaffoldWithDb = ensureStyleMethodScaffoldWithDb;
exports.upsertStyle = upsertStyle;
var date_1 = require("@internationalized/date");
var kysely_1 = require("kysely");
var database_server_1 = require("~/services/database.server");
var supabase_1 = require("~/utils/supabase");
var items_service_1 = require("./items.service");
var styleMethod_service_1 = require("./styleMethod.service");
function toError(error, fallback) {
    if (error instanceof Error)
        return error;
    if (error && typeof error === "object") {
        var maybeMessage = "message" in error ? error.message : undefined;
        var maybeDetail = "detail" in error ? error.detail : undefined;
        var parts = [maybeMessage, maybeDetail].filter(function (value) { return typeof value === "string" && value.length > 0; });
        if (parts.length > 0)
            return new Error(parts.join(" | "));
    }
    return new Error(fallback);
}
function getStyle(itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    db = (0, database_server_1.getDatabaseClient)();
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      select *\n      from \"styles\"\n      where \"id\" = ", "\n        and \"companyId\" = ", "\n      limit 1\n    "], ["\n      select *\n      from \"styles\"\n      where \"id\" = ", "\n        and \"companyId\" = ", "\n      limit 1\n    "])), itemId, companyId).execute(db)];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, {
                            data: (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null,
                            error: result.rows[0] ? null : new Error("Style not found")
                        }];
                case 2:
                    error_1 = _b.sent();
                    return [2 /*return*/, {
                            data: null,
                            error: toError(error_1, "Failed to load style")
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getStyleColorContext(itemId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var db, result, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    db = (0, database_server_1.getDatabaseClient)();
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      select s.\"id\" as \"itemId\", sc.\"colorCode\"\n      from \"style\" s\n      join \"styleColorAssignment\" sca on sca.\"styleId\" = s.\"id\" and sca.\"companyId\" = s.\"companyId\"\n      join \"styleColor\" sc on sc.\"id\" = sca.\"styleColorId\"\n      where s.\"itemId\" = ", "\n        and s.\"companyId\" = ", "\n      order by sc.\"colorCode\"\n      limit 1\n    "], ["\n      select s.\"id\" as \"itemId\", sc.\"colorCode\"\n      from \"style\" s\n      join \"styleColorAssignment\" sca on sca.\"styleId\" = s.\"id\" and sca.\"companyId\" = s.\"companyId\"\n      join \"styleColor\" sc on sc.\"id\" = sca.\"styleColorId\"\n      where s.\"itemId\" = ", "\n        and s.\"companyId\" = ", "\n      order by sc.\"colorCode\"\n      limit 1\n    "])), itemId, companyId).execute(db)];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, {
                            data: (_a = result.rows[0]) !== null && _a !== void 0 ? _a : null,
                            error: null
                        }];
                case 2:
                    error_2 = _b.sent();
                    return [2 /*return*/, {
                            data: null,
                            error: toError(error_2, "Failed to load style color context")
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function ensureStyleMethodScaffoldWithDb(args) {
    return __awaiter(this, void 0, void 0, function () {
        var db, existingMakeMethod, makeMethodId, makeMethodResult, existingCuttingProcess, cuttingProcessId, namedCuttingProcess, namedCuttingProcessId, insertedCuttingProcess, existingCuttingOperation, firstOperation, first, seededCuttingOperation, insertedOperation, cuttingOperationId, error_3;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    db = (0, database_server_1.getDatabaseClient)();
                    _p.label = 1;
                case 1:
                    _p.trys.push([1, 16, , 17]);
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      select \"id\"\n      from \"makeMethod\"\n      where \"itemId\" = ", "\n        and \"companyId\" = ", "\n      order by \"createdAt\" asc\n      limit 1\n    "], ["\n      select \"id\"\n      from \"makeMethod\"\n      where \"itemId\" = ", "\n        and \"companyId\" = ", "\n      order by \"createdAt\" asc\n      limit 1\n    "])), args.itemId, args.companyId).execute(db)];
                case 2:
                    existingMakeMethod = _p.sent();
                    makeMethodId = (_b = (_a = existingMakeMethod.rows[0]) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
                    if (!!makeMethodId) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n        insert into \"makeMethod\" (\"itemId\", \"companyId\", \"createdBy\")\n        values (", ", ", ", ", ")\n        returning \"id\"\n      "], ["\n        insert into \"makeMethod\" (\"itemId\", \"companyId\", \"createdBy\")\n        values (", ", ", ", ", ")\n        returning \"id\"\n      "])), args.itemId, args.companyId, args.userId).execute(db)];
                case 3:
                    makeMethodResult = _p.sent();
                    makeMethodId = (_d = (_c = makeMethodResult.rows[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null;
                    _p.label = 4;
                case 4:
                    if (!makeMethodId) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Failed to create style make method")
                            }];
                    }
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      select \"id\", \"name\"\n      from \"process\"\n      where \"companyId\" = ", "\n        and ", " = any(coalesce(\"tags\", '{}'::text[]))\n      order by \"createdAt\" asc\n      limit 1\n    "], ["\n      select \"id\", \"name\"\n      from \"process\"\n      where \"companyId\" = ", "\n        and ", " = any(coalesce(\"tags\", '{}'::text[]))\n      order by \"createdAt\" asc\n      limit 1\n    "])), args.companyId, styleMethod_service_1.STYLE_CUTTING_PROCESS_TAG).execute(db)];
                case 5:
                    existingCuttingProcess = _p.sent();
                    cuttingProcessId = (_f = (_e = existingCuttingProcess.rows[0]) === null || _e === void 0 ? void 0 : _e.id) !== null && _f !== void 0 ? _f : null;
                    if (!!cuttingProcessId) return [3 /*break*/, 10];
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n        select \"id\", \"name\"\n        from \"process\"\n        where \"companyId\" = ", "\n          and \"name\" in ('Cutting', '\u88C1\u526A')\n        order by \"createdAt\" asc\n        limit 1\n      "], ["\n        select \"id\", \"name\"\n        from \"process\"\n        where \"companyId\" = ", "\n          and \"name\" in ('Cutting', '\u88C1\u526A')\n        order by \"createdAt\" asc\n        limit 1\n      "])), args.companyId).execute(db)];
                case 6:
                    namedCuttingProcess = _p.sent();
                    namedCuttingProcessId = (_h = (_g = namedCuttingProcess.rows[0]) === null || _g === void 0 ? void 0 : _g.id) !== null && _h !== void 0 ? _h : null;
                    if (!namedCuttingProcessId) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n          update \"process\"\n          set\n            \"tags\" = array(\n              select distinct tag\n              from unnest(array_append(coalesce(\"tags\", '{}'::text[]), ", ")) as tag\n            ),\n            \"updatedBy\" = ", "\n          where \"id\" = ", "\n        "], ["\n          update \"process\"\n          set\n            \"tags\" = array(\n              select distinct tag\n              from unnest(array_append(coalesce(\"tags\", '{}'::text[]), ", ")) as tag\n            ),\n            \"updatedBy\" = ", "\n          where \"id\" = ", "\n        "])), styleMethod_service_1.STYLE_CUTTING_PROCESS_TAG, args.userId, namedCuttingProcessId).execute(db)];
                case 7:
                    _p.sent();
                    cuttingProcessId = namedCuttingProcessId;
                    return [3 /*break*/, 10];
                case 8: return [4 /*yield*/, (0, kysely_1.sql)(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n          insert into \"process\" (\n            \"name\",\n            \"processType\",\n            \"defaultStandardFactor\",\n            \"completeAllOnScan\",\n            \"tags\",\n            \"companyId\",\n            \"createdBy\"\n          ) values (\n            'Cutting',\n            'Inside',\n            'Minutes/Piece',\n            false,\n            array[", "]::text[],\n            ", ",\n            ", "\n          )\n          returning \"id\"\n        "], ["\n          insert into \"process\" (\n            \"name\",\n            \"processType\",\n            \"defaultStandardFactor\",\n            \"completeAllOnScan\",\n            \"tags\",\n            \"companyId\",\n            \"createdBy\"\n          ) values (\n            'Cutting',\n            'Inside',\n            'Minutes/Piece',\n            false,\n            array[", "]::text[],\n            ", ",\n            ", "\n          )\n          returning \"id\"\n        "])), styleMethod_service_1.STYLE_CUTTING_PROCESS_TAG, args.companyId, args.userId).execute(db)];
                case 9:
                    insertedCuttingProcess = _p.sent();
                    cuttingProcessId = (_k = (_j = insertedCuttingProcess.rows[0]) === null || _j === void 0 ? void 0 : _j.id) !== null && _k !== void 0 ? _k : null;
                    _p.label = 10;
                case 10:
                    if (!cuttingProcessId) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Failed to resolve style cutting process")
                            }];
                    }
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n      select \"id\"\n      from \"methodOperation\"\n      where \"makeMethodId\" = ", "\n        and (\n          ", " = any(coalesce(\"tags\", '{}'::text[]))\n          or \"customFields\" ->> 'styleStage' = 'cutting'\n        )\n      order by \"order\" asc\n      limit 1\n    "], ["\n      select \"id\"\n      from \"methodOperation\"\n      where \"makeMethodId\" = ", "\n        and (\n          ", " = any(coalesce(\"tags\", '{}'::text[]))\n          or \"customFields\" ->> 'styleStage' = 'cutting'\n        )\n      order by \"order\" asc\n      limit 1\n    "])), makeMethodId, styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG).execute(db)];
                case 11:
                    existingCuttingOperation = _p.sent();
                    if ((_l = existingCuttingOperation.rows[0]) === null || _l === void 0 ? void 0 : _l.id) {
                        return [2 /*return*/, {
                                data: {
                                    makeMethodId: makeMethodId,
                                    cuttingOperationId: existingCuttingOperation.rows[0].id
                                },
                                error: null
                            }];
                    }
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n      select \"id\", \"processId\", \"order\"\n      from \"methodOperation\"\n      where \"makeMethodId\" = ", "\n      order by \"order\" asc\n      limit 1\n    "], ["\n      select \"id\", \"processId\", \"order\"\n      from \"methodOperation\"\n      where \"makeMethodId\" = ", "\n      order by \"order\" asc\n      limit 1\n    "])), makeMethodId).execute(db)];
                case 12:
                    firstOperation = _p.sent();
                    first = firstOperation.rows[0];
                    if (!((first === null || first === void 0 ? void 0 : first.id) && first.processId === cuttingProcessId)) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n        update \"methodOperation\"\n        set\n          \"tags\" = array(\n            select distinct tag\n            from unnest(\n              array_append(\n                array_append(coalesce(\"tags\", '{}'::text[]), ", "),\n                ", "\n              )\n            ) as tag\n          ),\n          \"customFields\" = coalesce(\"customFields\", '{}'::jsonb) || ", "::jsonb,\n          \"updatedBy\" = ", "\n        where \"id\" = ", "\n      "], ["\n        update \"methodOperation\"\n        set\n          \"tags\" = array(\n            select distinct tag\n            from unnest(\n              array_append(\n                array_append(coalesce(\"tags\", '{}'::text[]), ", "),\n                ", "\n              )\n            ) as tag\n          ),\n          \"customFields\" = coalesce(\"customFields\", '{}'::jsonb) || ", "::jsonb,\n          \"updatedBy\" = ", "\n        where \"id\" = ", "\n      "])), styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG, styleMethod_service_1.STYLE_SYSTEM_OPERATION_TAG, JSON.stringify({
                            styleStage: "cutting",
                            styleSystemOwned: true
                        }), args.userId, first.id).execute(db)];
                case 13:
                    _p.sent();
                    return [2 /*return*/, {
                            data: {
                                makeMethodId: makeMethodId,
                                cuttingOperationId: first.id
                            },
                            error: null
                        }];
                case 14:
                    seededCuttingOperation = (0, styleMethod_service_1.buildStyleCuttingMethodOperation)({
                        makeMethodId: makeMethodId,
                        processId: cuttingProcessId,
                        companyId: args.companyId,
                        createdBy: args.userId,
                        order: first && typeof first.order === "number" ? first.order - 1 : 0
                    });
                    return [4 /*yield*/, (0, kysely_1.sql)(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n      insert into \"methodOperation\" (\n        \"makeMethodId\",\n        \"processId\",\n        \"companyId\",\n        \"createdBy\",\n        \"order\",\n        \"operationOrder\",\n        \"operationType\",\n        \"description\",\n        \"setupUnit\",\n        \"setupTime\",\n        \"laborUnit\",\n        \"laborTime\",\n        \"machineUnit\",\n        \"machineTime\",\n        \"insideUnitCost\",\n        \"tags\",\n        \"customFields\"\n      ) values (\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        array[", ", ", "]::text[],\n        ", "::jsonb\n      )\n      returning \"id\"\n    "], ["\n      insert into \"methodOperation\" (\n        \"makeMethodId\",\n        \"processId\",\n        \"companyId\",\n        \"createdBy\",\n        \"order\",\n        \"operationOrder\",\n        \"operationType\",\n        \"description\",\n        \"setupUnit\",\n        \"setupTime\",\n        \"laborUnit\",\n        \"laborTime\",\n        \"machineUnit\",\n        \"machineTime\",\n        \"insideUnitCost\",\n        \"tags\",\n        \"customFields\"\n      ) values (\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        ", ",\n        array[", ", ", "]::text[],\n        ", "::jsonb\n      )\n      returning \"id\"\n    "])), seededCuttingOperation.makeMethodId, seededCuttingOperation.processId, seededCuttingOperation.companyId, seededCuttingOperation.createdBy, seededCuttingOperation.order, seededCuttingOperation.operationOrder, seededCuttingOperation.operationType, seededCuttingOperation.description, seededCuttingOperation.setupUnit, seededCuttingOperation.setupTime, seededCuttingOperation.laborUnit, seededCuttingOperation.laborTime, seededCuttingOperation.machineUnit, seededCuttingOperation.machineTime, seededCuttingOperation.insideUnitCost, styleMethod_service_1.STYLE_CUTTING_OPERATION_TAG, styleMethod_service_1.STYLE_SYSTEM_OPERATION_TAG, JSON.stringify(seededCuttingOperation.customFields)).execute(db)];
                case 15:
                    insertedOperation = _p.sent();
                    cuttingOperationId = (_o = (_m = insertedOperation.rows[0]) === null || _m === void 0 ? void 0 : _m.id) !== null && _o !== void 0 ? _o : null;
                    if (!cuttingOperationId) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Failed to create style cutting operation")
                            }];
                    }
                    return [2 /*return*/, {
                            data: {
                                makeMethodId: makeMethodId,
                                cuttingOperationId: cuttingOperationId
                            },
                            error: null
                        }];
                case 16:
                    error_3 = _p.sent();
                    return [2 /*return*/, {
                            data: null,
                            error: toError(error_3, "Failed to scaffold style make method")
                        }];
                case 17: return [2 /*return*/];
            }
        });
    });
}
function insertStyleRecord(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    styleClient = client;
                    return [4 /*yield*/, styleClient.from("style").insert({
                            id: args.readableId,
                            itemId: args.itemId,
                            companyId: args.companyId,
                            createdBy: args.userId,
                            customFields: (_a = args.customFields) !== null && _a !== void 0 ? _a : null
                        })];
                case 1:
                    result = _b.sent();
                    if (result.error)
                        throw result.error;
                    return [2 /*return*/];
            }
        });
    });
}
function insertStyleColorAssignments(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, rows, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    styleClient = client;
                    if (args.styleColorIds.length === 0)
                        return [2 /*return*/];
                    rows = args.styleColorIds.map(function (styleColorId) { return ({
                        styleId: args.styleId,
                        styleColorId: styleColorId,
                        companyId: args.companyId,
                        createdBy: args.userId
                    }); });
                    return [4 /*yield*/, styleClient.from("styleColorAssignment").insert(rows)];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        throw result.error;
                    return [2 /*return*/];
            }
        });
    });
}
function insertStyleSizeAssignments(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var styleClient, rows, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    styleClient = client;
                    if (args.styleSizeIds.length === 0)
                        return [2 /*return*/];
                    rows = args.styleSizeIds.map(function (styleSizeId) { return ({
                        styleId: args.styleId,
                        styleSizeId: styleSizeId,
                        companyId: args.companyId,
                        createdBy: args.userId
                    }); });
                    return [4 /*yield*/, styleClient.from("styleSizeAssignment").insert(rows)];
                case 1:
                    result = _a.sent();
                    if (result.error)
                        throw result.error;
                    return [2 /*return*/];
            }
        });
    });
}
function updateStyleRecord(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var updatedAt, styleClient, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    updatedAt = (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString();
                    styleClient = client;
                    return [4 /*yield*/, styleClient
                            .from("style")
                            .update({
                            customFields: (_a = args.customFields) !== null && _a !== void 0 ? _a : null,
                            updatedBy: args.userId,
                            updatedAt: updatedAt
                        })
                            .eq("itemId", args.itemId)
                            .eq("companyId", args.companyId)];
                case 1:
                    result = _b.sent();
                    if (result.error)
                        throw result.error;
                    return [2 /*return*/];
            }
        });
    });
}
function upsertStyle(client, style) {
    return __awaiter(this, void 0, void 0, function () {
        var itemInsert, itemId, error_4, itemCostUpdate, itemReplenishmentInsert, pickMethod_1, shelfLife_1, styleMethod_1, itemUpdate, updateItem, styleCompany, companyId, styleClient, error_5, _a, pickMethod, shelfLife, styleMethod, itemReplenishmentUpdate, costUpdate, itemCostUpdate;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!("createdBy" in style)) return [3 /*break*/, 16];
                    return [4 /*yield*/, client
                            .from("item")
                            .insert({
                            readableId: style.id,
                            revision: (_b = style.revision) !== null && _b !== void 0 ? _b : "0",
                            name: style.name,
                            description: style.description,
                            type: "Style",
                            replenishmentSystem: style.replenishmentSystem,
                            defaultMethodType: style.defaultMethodType,
                            itemTrackingType: style.itemTrackingType,
                            unitOfMeasureCode: style.unitOfMeasureCode,
                            active: true,
                            modelUploadId: style.modelUploadId,
                            thumbnailPath: style.thumbnailPath,
                            companyId: style.companyId,
                            createdBy: style.createdBy
                        })
                            .select("id")
                            .single()];
                case 1:
                    itemInsert = _d.sent();
                    if (itemInsert.error || !((_c = itemInsert.data) === null || _c === void 0 ? void 0 : _c.id))
                        return [2 /*return*/, itemInsert];
                    itemId = itemInsert.data.id;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, , 9]);
                    return [4 /*yield*/, insertStyleRecord(client, {
                            readableId: style.id,
                            itemId: itemId,
                            companyId: style.companyId,
                            userId: style.createdBy,
                            customFields: style.customFields
                        })];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, insertStyleColorAssignments(client, {
                            styleId: style.id,
                            companyId: style.companyId,
                            userId: style.createdBy,
                            styleColorIds: style.styleColorIds
                        })];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, insertStyleSizeAssignments(client, {
                            styleId: style.id,
                            companyId: style.companyId,
                            userId: style.createdBy,
                            styleSizeIds: style.styleSizeIds
                        })];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, (0, items_service_1.syncStyleConfigurationParameters)(client, {
                            itemId: itemId,
                            companyId: style.companyId,
                            userId: style.createdBy,
                            styleColorIds: style.styleColorIds,
                            styleSizeIds: style.styleSizeIds
                        })];
                case 6:
                    _d.sent();
                    return [3 /*break*/, 9];
                case 7:
                    error_4 = _d.sent();
                    // Roll back the orphaned item so retries don't hit duplicate-key errors
                    return [4 /*yield*/, client.from("item").delete().eq("id", itemId)];
                case 8:
                    // Roll back the orphaned item so retries don't hit duplicate-key errors
                    _d.sent();
                    return [2 /*return*/, {
                            data: null,
                            error: toError(error_4, "Failed to insert style")
                        }];
                case 9: return [4 /*yield*/, client
                        .from("itemCost")
                        .update((0, supabase_1.sanitize)({
                        itemPostingGroupId: style.postingGroupId,
                        unitCost: style.replenishmentSystem !== "Make" ? style.unitCost : undefined
                    }))
                        .eq("itemId", itemId)];
                case 10:
                    itemCostUpdate = _d.sent();
                    if (itemCostUpdate.error) {
                        console.error(itemCostUpdate.error);
                    }
                    if (!(style.replenishmentSystem !== "Buy")) return [3 /*break*/, 12];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ lotSize: style.lotSize })
                            .eq("itemId", itemId)];
                case 11:
                    itemReplenishmentInsert = _d.sent();
                    if (itemReplenishmentInsert.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style replenishment update failed: ".concat(itemReplenishmentInsert.error.message))
                            }];
                    }
                    _d.label = 12;
                case 12: return [4 /*yield*/, (0, items_service_1.upsertItemDefaultPickMethod)(client, {
                        itemId: itemId,
                        userId: style.createdBy,
                        storageUnitId: style.defaultStorageUnitId
                    })];
                case 13:
                    pickMethod_1 = _d.sent();
                    if (pickMethod_1.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style pick method failed: ".concat(pickMethod_1.error.message))
                            }];
                    }
                    return [4 /*yield*/, (0, items_service_1.upsertItemShelfLife)(client, {
                            itemId: itemId,
                            userId: style.createdBy,
                            companyId: style.companyId,
                            mode: style.shelfLifeMode,
                            days: style.shelfLifeDays,
                            triggerProcessId: style.shelfLifeTriggerProcessId,
                            triggerTiming: style.shelfLifeTriggerTiming,
                            calculateFromBom: style.shelfLifeCalculateFromBom
                        })];
                case 14:
                    shelfLife_1 = _d.sent();
                    if (shelfLife_1.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style shelf life failed: ".concat(shelfLife_1.error.message))
                            }];
                    }
                    return [4 /*yield*/, ensureStyleMethodScaffoldWithDb({
                            itemId: itemId,
                            companyId: style.companyId,
                            userId: style.createdBy
                        })];
                case 15:
                    styleMethod_1 = _d.sent();
                    if (styleMethod_1.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style method scaffold failed: ".concat(styleMethod_1.error.message))
                            }];
                    }
                    return [2 /*return*/, { data: { id: itemId }, error: null }];
                case 16:
                    itemUpdate = {
                        id: style.id,
                        name: style.name,
                        description: style.description,
                        replenishmentSystem: style.replenishmentSystem,
                        defaultMethodType: style.defaultMethodType,
                        itemTrackingType: style.itemTrackingType,
                        unitOfMeasureCode: style.unitOfMeasureCode,
                        active: true,
                        modelUploadId: style.modelUploadId,
                        thumbnailPath: style.thumbnailPath
                    };
                    return [4 /*yield*/, client
                            .from("item")
                            .update(__assign(__assign({}, (0, supabase_1.sanitize)(itemUpdate)), { updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString() }))
                            .eq("id", style.id)];
                case 17:
                    updateItem = _d.sent();
                    if (updateItem.error)
                        return [2 /*return*/, updateItem];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("companyId")
                            .eq("id", style.id)
                            .single()];
                case 18:
                    styleCompany = _d.sent();
                    if (styleCompany.error)
                        return [2 /*return*/, styleCompany];
                    companyId = styleCompany.data.companyId;
                    if (!companyId) {
                        return [2 /*return*/, { data: null, error: new Error("Style company not found") }];
                    }
                    _d.label = 19;
                case 19:
                    _d.trys.push([19, 28, , 29]);
                    return [4 /*yield*/, updateStyleRecord(client, {
                            itemId: style.id,
                            companyId: companyId,
                            userId: style.updatedBy,
                            customFields: style.customFields
                        })];
                case 20:
                    _d.sent();
                    styleClient = client;
                    return [4 /*yield*/, styleClient
                            .from("styleColorAssignment")
                            .delete()
                            .eq("styleId", style.id)
                            .eq("companyId", companyId)];
                case 21:
                    _d.sent();
                    if (!(style.styleColorIds.length > 0)) return [3 /*break*/, 23];
                    return [4 /*yield*/, insertStyleColorAssignments(client, {
                            styleId: style.id,
                            companyId: companyId,
                            userId: style.updatedBy,
                            styleColorIds: style.styleColorIds
                        })];
                case 22:
                    _d.sent();
                    _d.label = 23;
                case 23: 
                // Replace size assignments
                return [4 /*yield*/, styleClient
                        .from("styleSizeAssignment")
                        .delete()
                        .eq("styleId", style.id)
                        .eq("companyId", companyId)];
                case 24:
                    // Replace size assignments
                    _d.sent();
                    if (!(style.styleSizeIds.length > 0)) return [3 /*break*/, 26];
                    return [4 /*yield*/, insertStyleSizeAssignments(client, {
                            styleId: style.id,
                            companyId: companyId,
                            userId: style.updatedBy,
                            styleSizeIds: style.styleSizeIds
                        })];
                case 25:
                    _d.sent();
                    _d.label = 26;
                case 26: return [4 /*yield*/, (0, items_service_1.syncStyleConfigurationParameters)(client, {
                        itemId: style.id,
                        companyId: companyId,
                        userId: style.updatedBy,
                        styleColorIds: style.styleColorIds,
                        styleSizeIds: style.styleSizeIds
                    })];
                case 27:
                    _d.sent();
                    return [3 /*break*/, 29];
                case 28:
                    error_5 = _d.sent();
                    return [2 /*return*/, {
                            data: null,
                            error: toError(error_5, "Failed to update style")
                        }];
                case 29: return [4 /*yield*/, Promise.all([
                        (0, items_service_1.upsertItemDefaultPickMethod)(client, {
                            itemId: style.id,
                            userId: style.updatedBy,
                            storageUnitId: style.defaultStorageUnitId
                        }),
                        (0, items_service_1.upsertItemShelfLife)(client, {
                            itemId: style.id,
                            userId: style.updatedBy,
                            mode: style.shelfLifeMode,
                            days: style.shelfLifeDays,
                            triggerProcessId: style.shelfLifeTriggerProcessId,
                            triggerTiming: style.shelfLifeTriggerTiming,
                            calculateFromBom: style.shelfLifeCalculateFromBom
                        })
                    ])];
                case 30:
                    _a = _d.sent(), pickMethod = _a[0], shelfLife = _a[1];
                    if (pickMethod.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style pick method failed: ".concat(pickMethod.error.message))
                            }];
                    }
                    if (shelfLife.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style shelf life failed: ".concat(shelfLife.error.message))
                            }];
                    }
                    return [4 /*yield*/, ensureStyleMethodScaffoldWithDb({
                            itemId: style.id,
                            companyId: companyId,
                            userId: style.updatedBy
                        })];
                case 31:
                    styleMethod = _d.sent();
                    if (styleMethod.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style method scaffold failed: ".concat(styleMethod.error.message))
                            }];
                    }
                    if (!(style.replenishmentSystem !== "Buy")) return [3 /*break*/, 33];
                    return [4 /*yield*/, client
                            .from("itemReplenishment")
                            .update({ lotSize: style.lotSize })
                            .eq("itemId", style.id)];
                case 32:
                    itemReplenishmentUpdate = _d.sent();
                    if (itemReplenishmentUpdate.error) {
                        return [2 /*return*/, {
                                data: null,
                                error: new Error("Style replenishment update failed: ".concat(itemReplenishmentUpdate.error.message))
                            }];
                    }
                    _d.label = 33;
                case 33:
                    costUpdate = {};
                    if (style.postingGroupId !== undefined) {
                        costUpdate.itemPostingGroupId = style.postingGroupId;
                    }
                    if (style.replenishmentSystem !== "Make" && style.unitCost !== undefined) {
                        costUpdate.unitCost = style.unitCost;
                    }
                    if (!(Object.keys(costUpdate).length > 0)) return [3 /*break*/, 35];
                    return [4 /*yield*/, client
                            .from("itemCost")
                            .update(costUpdate)
                            .eq("itemId", style.id)];
                case 34:
                    itemCostUpdate = _d.sent();
                    if (itemCostUpdate.error) {
                        console.error(itemCostUpdate.error);
                    }
                    _d.label = 35;
                case 35: return [2 /*return*/, { data: { id: style.id }, error: null }];
            }
        });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
