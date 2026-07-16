"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.handle = void 0;
exports.loader = loader;
exports.default = WarehouseTransferRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Warehouse Transfer"], ["Warehouse Transfer"]))),
    to: path_1.path.to.warehouseTransfers
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, transferId, _c, warehouseTransfer, warehouseTransferLines, _d, _e, _f, _g;
        var _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    client = (_j.sent()).client;
                    transferId = params.transferId;
                    if (!transferId)
                        throw new Response("Not found", { status: 404 });
                    return [4 /*yield*/, Promise.all([
                            (0, inventory_1.getWarehouseTransfer)(client, transferId),
                            (0, inventory_1.getWarehouseTransferLines)(client, transferId)
                        ])];
                case 2:
                    _c = _j.sent(), warehouseTransfer = _c[0], warehouseTransferLines = _c[1];
                    if (!warehouseTransfer.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.warehouseTransfers];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(warehouseTransfer.error, "Failed to load warehouse transfer"))];
                case 3: throw _d.apply(void 0, _e.concat([_j.sent()]));
                case 4:
                    if (!warehouseTransferLines.error) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.warehouseTransfers];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(warehouseTransferLines.error, "Failed to load warehouse transfer lines"))];
                case 5: throw _f.apply(void 0, _g.concat([_j.sent()]));
                case 6: return [2 /*return*/, {
                        warehouseTransfer: warehouseTransfer.data,
                        warehouseTransferLines: (_h = warehouseTransferLines.data) !== null && _h !== void 0 ? _h : []
                    }];
            }
        });
    });
}
function WarehouseTransferRoute() {
    var params = (0, react_router_1.useParams)();
    var transferId = params.transferId;
    if (!transferId)
        throw new Error("Could not find transferId");
    return (<div className="flex h-[calc(100dvh-49px)] overflow-y-auto overscroll-contain scrollbar-hide w-full">
      <div className="h-full p-4 w-full max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 pb-16 w-full">
          <react_router_1.Outlet />
        </div>
      </div>
    </div>);
}
var templateObject_1;
