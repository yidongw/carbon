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
exports.loader = loader;
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var production_1 = require("~/modules/production");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, masterWorkOrderId;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId;
                    masterWorkOrderId = params.masterWorkOrderId;
                    if (!masterWorkOrderId)
                        return [2 /*return*/, null];
                    return [2 /*return*/, (0, production_1.getCuttingSplitProposal)(client, masterWorkOrderId, companyId)];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, masterWorkOrderId, _d, _e, formData, bundles, toSave, _f, _g, proposal, cellKey, cutByCell, reportedById, requestedByCell, _i, toSave_1, b, k, _h, requestedByCell_1, _j, k, requested, cut, _k, _l, _m, toSave_2, b, reported, _o, _p, result, _q, _r, _s, _t;
        var _u, _v, _w, _x, _y, _z;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_0) {
            switch (_0.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "production"
                        })];
                case 1:
                    _c = _0.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    masterWorkOrderId = params.masterWorkOrderId;
                    if (!!masterWorkOrderId) return [3 /*break*/, 3];
                    _d = react_router_1.data;
                    _e = [{ ok: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Missing master work order", "Split failed"))];
                case 2: return [2 /*return*/, _d.apply(void 0, _e.concat([_0.sent()]))];
                case 3: return [4 /*yield*/, request.formData()];
                case 4:
                    formData = _0.sent();
                    bundles = [];
                    try {
                        bundles = JSON.parse(String((_u = formData.get("bundles")) !== null && _u !== void 0 ? _u : "[]"));
                    }
                    catch (_1) {
                        bundles = [];
                    }
                    toSave = bundles.filter(function (b) { return b.id || (Number(b === null || b === void 0 ? void 0 : b.quantity) || 0) > 0; });
                    if (!(toSave.length === 0)) return [3 /*break*/, 6];
                    _f = react_router_1.data;
                    _g = [{ ok: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Nothing to save", "Split failed"))];
                case 5: return [2 /*return*/, _f.apply(void 0, _g.concat([_0.sent()]))];
                case 6: return [4 /*yield*/, (0, production_1.getCuttingSplitProposal)(client, masterWorkOrderId, companyId)];
                case 7:
                    proposal = _0.sent();
                    cellKey = function (colorCode, sizeCode) {
                        return "".concat(colorCode !== null && colorCode !== void 0 ? colorCode : "", "|").concat(sizeCode !== null && sizeCode !== void 0 ? sizeCode : "");
                    };
                    cutByCell = new Map(proposal.cells.map(function (c) { return [cellKey(c.colorCode, c.sizeCode), c.cut]; }));
                    reportedById = new Map(proposal.existingBundles.map(function (b) { return [b.id, b.reportedQuantity]; }));
                    requestedByCell = new Map();
                    for (_i = 0, toSave_1 = toSave; _i < toSave_1.length; _i++) {
                        b = toSave_1[_i];
                        k = cellKey((_v = b.colorCode) !== null && _v !== void 0 ? _v : null, (_w = b.sizeCode) !== null && _w !== void 0 ? _w : null);
                        requestedByCell.set(k, ((_x = requestedByCell.get(k)) !== null && _x !== void 0 ? _x : 0) + (Number(b.quantity) || 0));
                    }
                    _h = 0, requestedByCell_1 = requestedByCell;
                    _0.label = 8;
                case 8:
                    if (!(_h < requestedByCell_1.length)) return [3 /*break*/, 11];
                    _j = requestedByCell_1[_h], k = _j[0], requested = _j[1];
                    cut = (_y = cutByCell.get(k)) !== null && _y !== void 0 ? _y : 0;
                    if (!(requested > cut + 0.0001)) return [3 /*break*/, 10];
                    _k = react_router_1.data;
                    _l = [{ ok: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Split exceeds the cut quantity for a color/size", "A color/size can't exceed the cut quantity (max ".concat(cut, ")")))];
                case 9: return [2 /*return*/, _k.apply(void 0, _l.concat([_0.sent()]))];
                case 10:
                    _h++;
                    return [3 /*break*/, 8];
                case 11:
                    _m = 0, toSave_2 = toSave;
                    _0.label = 12;
                case 12:
                    if (!(_m < toSave_2.length)) return [3 /*break*/, 15];
                    b = toSave_2[_m];
                    if (!b.id)
                        return [3 /*break*/, 14];
                    reported = (_z = reportedById.get(b.id)) !== null && _z !== void 0 ? _z : 0;
                    if (!((Number(b.quantity) || 0) < reported)) return [3 /*break*/, 14];
                    _o = react_router_1.data;
                    _p = [{ ok: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Bundle quantity below reported", "A bundle can't be set below its reported quantity (".concat(reported, ")")))];
                case 13: return [2 /*return*/, _o.apply(void 0, _p.concat([_0.sent()]))];
                case 14:
                    _m++;
                    return [3 /*break*/, 12];
                case 15: return [4 /*yield*/, (0, production_1.saveBundleSplit)(client, {
                        masterWorkOrderId: masterWorkOrderId,
                        companyId: companyId,
                        createdBy: userId,
                        bundles: toSave
                    })];
                case 16:
                    result = _0.sent();
                    if (!result.error) return [3 /*break*/, 18];
                    _q = react_router_1.data;
                    _r = [{ ok: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to save bundles"))];
                case 17: return [2 /*return*/, _q.apply(void 0, _r.concat([_0.sent()]))];
                case 18:
                    _s = react_router_1.data;
                    _t = [{ ok: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Saved bundles (".concat(result.data.created, " created, ").concat(result.data.updated, " updated)")))];
                case 19: return [2 /*return*/, _s.apply(void 0, _t.concat([_0.sent()]))];
            }
        });
    });
}
