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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var printing_1 = require("@carbon/printing");
var printing_server_1 = require("@carbon/printing/printing.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, result, _d, _e, existing, current, dirty, settings, assignments, _i, _f, _g, locId, location_1, loc, workCenters, _h, _j, _k, wcId, wc, _l, _m;
        var _o, _p;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "settings"
                    })];
                case 1:
                    _c = _q.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Printer route ID is required");
                    return [4 /*yield*/, (0, printing_1.deletePrinterRoute)(client, id, companyId)];
                case 2:
                    result = _q.sent();
                    if (!result.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.printingSettings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to delete printer route"))];
                case 3: throw _d.apply(void 0, _e.concat([_q.sent()]));
                case 4: return [4 /*yield*/, client
                        .from("companySettings")
                        .select("printing")
                        .eq("id", companyId)
                        .single()];
                case 5:
                    existing = (_q.sent()).data;
                    current = existing === null || existing === void 0 ? void 0 : existing.printing;
                    if (!current) return [3 /*break*/, 7];
                    dirty = false;
                    settings = __assign({}, current);
                    if (settings.assignments) {
                        assignments = __assign({}, settings.assignments);
                        for (_i = 0, _f = Object.entries(assignments); _i < _f.length; _i++) {
                            _g = _f[_i], locId = _g[0], location_1 = _g[1];
                            if (!location_1)
                                continue;
                            loc = __assign({}, location_1);
                            if (loc.defaultPrinterRouteId === id) {
                                loc.defaultPrinterRouteId = null;
                                dirty = true;
                            }
                            if (((_o = loc.shipping) === null || _o === void 0 ? void 0 : _o.printerRouteId) === id) {
                                loc.shipping = __assign(__assign({}, loc.shipping), { printerRouteId: null });
                                dirty = true;
                            }
                            if (((_p = loc.receiving) === null || _p === void 0 ? void 0 : _p.printerRouteId) === id) {
                                loc.receiving = __assign(__assign({}, loc.receiving), { printerRouteId: null });
                                dirty = true;
                            }
                            if (loc.workCenters) {
                                workCenters = __assign({}, loc.workCenters);
                                for (_h = 0, _j = Object.entries(workCenters); _h < _j.length; _h++) {
                                    _k = _j[_h], wcId = _k[0], wc = _k[1];
                                    if ((wc === null || wc === void 0 ? void 0 : wc.printerRouteId) === id) {
                                        workCenters[wcId] = __assign(__assign({}, wc), { printerRouteId: null });
                                        dirty = true;
                                    }
                                }
                                loc.workCenters = workCenters;
                            }
                            assignments[locId] = loc;
                        }
                        settings.assignments = assignments;
                    }
                    if (!dirty) return [3 /*break*/, 7];
                    return [4 /*yield*/, client
                            .from("companySettings")
                            .update({ printing: JSON.parse(JSON.stringify(settings)) })
                            .eq("id", companyId)];
                case 6:
                    _q.sent();
                    _q.label = 7;
                case 7: return [4 /*yield*/, (0, printing_server_1.invalidatePrinterCache)(companyId)];
                case 8:
                    _q.sent();
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.printingSettings];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Printer route deleted"))];
                case 9: throw _l.apply(void 0, _m.concat([_q.sent()]));
            }
        });
    });
}
