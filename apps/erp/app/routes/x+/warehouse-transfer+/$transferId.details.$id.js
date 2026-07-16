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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = WarehouseTransferLineDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var inventory_1 = require("~/modules/inventory");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
var warehouseTransferLineActionValidator = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        type: zod_1.z.literal("create"),
        transferId: zod_1.z.string().min(1),
        itemId: zod_1.z.string().min(1),
        quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001)),
        fromStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        toStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    }),
    zod_1.z.object({
        type: zod_1.z.literal("update"),
        id: zod_1.z.string().min(1),
        quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001)),
        fromStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        toStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    }),
    zod_1.z.object({
        type: zod_1.z.literal("delete"),
        id: zod_1.z.string().min(1)
    })
]);
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, transferId, id, warehouseTransferLine, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    transferId = params.transferId, id = params.id;
                    if (!transferId)
                        throw new Error("transferId not found");
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, inventory_1.getWarehouseTransferLine)(client, transferId, id)];
                case 2:
                    warehouseTransferLine = _e.sent();
                    if (!warehouseTransferLine.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.warehouseTransferDetails(transferId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(warehouseTransferLine.error, "Failed to load warehouse transfer line"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, { warehouseTransferLine: warehouseTransferLine.data }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, transferId, id, viewClient, transfer, formData, validation, _d, type, d, _e, result, _f, _g, _h, _j, result, _k, _l, _m, _o, _p, _q;
        var _r;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "inventory"
                        })];
                case 1:
                    _c = _s.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    transferId = params.transferId, id = params.id;
                    if (!transferId)
                        throw new Error("transferId not found");
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "inventory"
                        })];
                case 2:
                    viewClient = (_s.sent()).client;
                    return [4 /*yield*/, (0, inventory_1.getWarehouseTransfer)(viewClient, transferId)];
                case 3:
                    transfer = _s.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, inventory_1.isWarehouseTransferLocked)((_r = transfer.data) === null || _r === void 0 ? void 0 : _r.status),
                            redirectTo: path_1.path.to.warehouseTransfer(transferId),
                            message: "Cannot modify a locked warehouse transfer. Reopen it first."
                        })];
                case 4:
                    _s.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _s.sent();
                    return [4 /*yield*/, (0, form_1.validator)(warehouseTransferLineActionValidator).validate(formData)];
                case 6:
                    validation = _s.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, type = _d.type, d = __rest(_d, ["type"]);
                    _e = type;
                    switch (_e) {
                        case "update": return [3 /*break*/, 7];
                        case "delete": return [3 /*break*/, 12];
                    }
                    return [3 /*break*/, 17];
                case 7: return [4 /*yield*/, (0, inventory_1.upsertWarehouseTransferLine)(client, __assign(__assign({ id: id }, d), { transferId: transferId, companyId: companyId, updatedBy: userId }))];
                case 8:
                    result = _s.sent();
                    if (!result.error) return [3 /*break*/, 10];
                    _f = react_router_1.data;
                    _g = [{ error: result.error }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update warehouse transfer line"))];
                case 9: return [2 /*return*/, _f.apply(void 0, _g.concat([_s.sent()]))];
                case 10:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.warehouseTransferDetails(transferId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated warehouse transfer line"))];
                case 11: throw _h.apply(void 0, _j.concat([_s.sent()]));
                case 12: return [4 /*yield*/, (0, inventory_1.deleteWarehouseTransferLine)(client, id)];
                case 13:
                    result = _s.sent();
                    if (!result.error) return [3 /*break*/, 15];
                    _k = react_router_1.data;
                    _l = [{ error: result.error }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to delete warehouse transfer line"))];
                case 14: return [2 /*return*/, _k.apply(void 0, _l.concat([_s.sent()]))];
                case 15:
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.warehouseTransferDetails(transferId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Deleted warehouse transfer line"))];
                case 16: throw _m.apply(void 0, _o.concat([_s.sent()]));
                case 17:
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.warehouseTransferDetails(transferId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Invalid action type", "Invalid action type"))];
                case 18: throw _p.apply(void 0, _q.concat([_s.sent()]));
            }
        });
    });
}
function WarehouseTransferLineDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    var params = (0, react_router_1.useParams)();
    var transferId = params.transferId, id = params.id;
    if (!transferId)
        throw new Error("transferId not found");
    if (!id)
        throw new Error("id not found");
    var warehouseTransferLine = (0, react_router_1.useLoaderData)().warehouseTransferLine;
    var initialValues = {
        type: "update",
        id: id,
        transferId: transferId,
        itemId: (_a = warehouseTransferLine.itemId) !== null && _a !== void 0 ? _a : "",
        fromLocationId: (_c = (_b = warehouseTransferLine.warehouseTransfer) === null || _b === void 0 ? void 0 : _b.fromLocationId) !== null && _c !== void 0 ? _c : "",
        toLocationId: (_e = (_d = warehouseTransferLine.warehouseTransfer) === null || _d === void 0 ? void 0 : _d.toLocationId) !== null && _e !== void 0 ? _e : "",
        quantity: (_f = warehouseTransferLine.quantity) !== null && _f !== void 0 ? _f : 1,
        fromStorageUnitId: (_g = warehouseTransferLine.fromStorageUnitId) !== null && _g !== void 0 ? _g : "",
        toStorageUnitId: (_h = warehouseTransferLine.toStorageUnitId) !== null && _h !== void 0 ? _h : "",
        notes: (_j = warehouseTransferLine.notes) !== null && _j !== void 0 ? _j : ""
    };
    var navigate = (0, react_router_1.useNavigate)();
    return (<div className="flex flex-col gap-2 pb-16 w-full">
      <inventory_1.WarehouseTransferLineForm key={initialValues.id} initialValues={initialValues} warehouseTransfer={warehouseTransferLine.warehouseTransfer} onClose={function () { return navigate(-1); }}/>
    </div>);
}
