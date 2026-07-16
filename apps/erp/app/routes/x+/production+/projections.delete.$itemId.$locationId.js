"use strict";
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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var date_1 = require("@internationalized/date");
var react_router_1 = require("react-router");
var production_service_1 = require("~/modules/production/production.service");
var shared_server_1 = require("~/modules/shared/shared.server");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, locationId, _d, _e, periods, futurePeriodIds, result, _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            delete: "production"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.itemId, locationId = params.locationId;
                    if (!(!itemId || !locationId)) return [3 /*break*/, 3];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Item ID and Location ID are required", "Missing parameters"))];
                case 2: return [2 /*return*/, _d.apply(void 0, _e.concat([_k.sent()]))];
                case 3: return [4 /*yield*/, (0, shared_server_1.getOrCreatePeriods)((0, date_1.today)((0, date_1.getLocalTimeZone)()), 52)];
                case 4:
                    periods = _k.sent();
                    futurePeriodIds = periods.map(function (p) { return p.id; });
                    return [4 /*yield*/, (0, production_service_1.deleteDemandProjections)(client, {
                            itemId: itemId,
                            locationId: locationId,
                            companyId: companyId,
                            futurePeriodIds: futurePeriodIds
                        })];
                case 5:
                    result = _k.sent();
                    if (!result.error) return [3 /*break*/, 7];
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Failed to delete demand projections", "Delete failed"))];
                case 6: return [2 /*return*/, _f.apply(void 0, _g.concat([_k.sent()]))];
                case 7:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.demandProjections + "?location=".concat(locationId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Demand projections deleted successfully"))];
                case 8: return [2 /*return*/, _h.apply(void 0, _j.concat([_k.sent()]))];
            }
        });
    });
}
