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
exports.action = action;
exports.default = NewWarehouseTransferLineRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var WarehouseTransfers_1 = require("~/modules/inventory/ui/WarehouseTransfers");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, transferId, viewClient, transfer, formData, validation, _d, id, d, createWarehouseTransferLine;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    transferId = params.transferId;
                    if (!transferId) {
                        throw new Error("transferId not found");
                    }
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "inventory"
                        })];
                case 2:
                    viewClient = (_f.sent()).client;
                    return [4 /*yield*/, (0, inventory_1.getWarehouseTransfer)(viewClient, transferId)];
                case 3:
                    transfer = _f.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, inventory_1.isWarehouseTransferLocked)((_e = transfer.data) === null || _e === void 0 ? void 0 : _e.status),
                            redirectTo: path_1.path.to.warehouseTransfer(transferId),
                            message: "Cannot modify a locked warehouse transfer. Reopen it first."
                        })];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _f.sent();
                    validation = inventory_1.warehouseTransferLineValidator.safeParse(Object.fromEntries(formData));
                    if (!validation.success) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Invalid form data"
                            }];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, inventory_1.upsertWarehouseTransferLine)(client, __assign(__assign({}, d), { companyId: companyId, createdBy: userId }))];
                case 6:
                    createWarehouseTransferLine = _f.sent();
                    if (createWarehouseTransferLine.error) {
                        return [2 /*return*/, {
                                success: false,
                                message: "Failed to create warehouse transfer line"
                            }];
                    }
                    return [2 /*return*/, (0, react_router_1.redirect)(path_1.path.to.warehouseTransfer(transferId))];
            }
        });
    });
}
function NewWarehouseTransferLineRoute() {
    var navigate = (0, react_router_1.useNavigate)();
    var transferId = (0, react_router_1.useParams)().transferId;
    if (!transferId)
        throw new Error("Could not find transferId");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.warehouseTransfer(transferId));
    if (!(routeData === null || routeData === void 0 ? void 0 : routeData.warehouseTransfer)) {
        throw new Error("Could not find warehouse transfer in routeData");
    }
    var initialValues = {
        type: "create",
        transferId: transferId,
        fromLocationId: routeData.warehouseTransfer.fromLocationId,
        toLocationId: routeData.warehouseTransfer.toLocationId,
        itemId: "",
        quantity: 1,
        fromStorageUnitId: "",
        toStorageUnitId: "",
        unitOfMeasureCode: "",
        notes: ""
    };
    return (<WarehouseTransfers_1.WarehouseTransferLineForm initialValues={initialValues} warehouseTransfer={routeData.warehouseTransfer} onClose={function () { return navigate(path_1.path.to.warehouseTransfer(transferId)); }}/>);
}
