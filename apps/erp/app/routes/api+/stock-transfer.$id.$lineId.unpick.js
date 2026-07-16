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
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, url, id, lineId, updateQuantityUrl, _c, stockTransferLine, stockTransfer, _d, _e, _f, _g, _h, _j, formData, result, data, _k, _l, _m, _o;
        var _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        update: "inventory"
                    })];
                case 1:
                    client = (_z.sent()).client;
                    url = new URL(request.url);
                    id = params.id, lineId = params.lineId;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    if (!lineId)
                        throw (0, auth_1.notFound)("lineId not found");
                    updateQuantityUrl = new URL("".concat(url.origin).concat(path_1.path.to.stockTransferLineQuantity(lineId)));
                    return [4 /*yield*/, Promise.all([
                            client.from("stockTransferLine").select("*").eq("id", lineId).single(),
                            client.from("stockTransfer").select("*").eq("id", id).single()
                        ])];
                case 2:
                    _c = _z.sent(), stockTransferLine = _c[0], stockTransfer = _c[1];
                    if (!(stockTransferLine.error || stockTransfer.error)) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.stockTransfer(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(stockTransferLine.error || stockTransfer.error, "Failed to load stock transfer line or stock transfer"))];
                case 3: throw _d.apply(void 0, _e.concat([_z.sent()]));
                case 4:
                    if (!!["In Progress", "Released"].includes((_q = (_p = stockTransfer.data) === null || _p === void 0 ? void 0 : _p.status) !== null && _q !== void 0 ? _q : "")) return [3 /*break*/, 6];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.stockTransfer(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Stock transfer is not in progress or released", "Stock transfer is not in progress or released"))];
                case 5: throw _f.apply(void 0, _g.concat([_z.sent()]));
                case 6:
                    if (!(((_r = stockTransferLine.data) === null || _r === void 0 ? void 0 : _r.pickedQuantity) > 0)) return [3 /*break*/, 8];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.stockTransfer(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)("Line already picked", "Line already picked"))];
                case 7: throw _h.apply(void 0, _j.concat([_z.sent()]));
                case 8:
                    formData = new FormData();
                    formData.append("id", lineId);
                    formData.append("quantity", "0");
                    formData.append("locationId", (_t = (_s = stockTransfer.data) === null || _s === void 0 ? void 0 : _s.locationId) !== null && _t !== void 0 ? _t : "");
                    if (((_u = stockTransferLine.data) === null || _u === void 0 ? void 0 : _u.requiresSerialTracking) ||
                        ((_v = stockTransferLine.data) === null || _v === void 0 ? void 0 : _v.requiresBatchTracking)) {
                        formData.append("trackedEntityId", (_x = (_w = stockTransferLine.data) === null || _w === void 0 ? void 0 : _w.trackedEntityId) !== null && _x !== void 0 ? _x : "");
                    }
                    return [4 /*yield*/, fetch(updateQuantityUrl.toString(), {
                            method: "POST",
                            headers: {
                                Authorization: request.headers.get("Authorization") || "",
                                Cookie: request.headers.get("Cookie") || ""
                            },
                            body: formData
                        })];
                case 9:
                    result = _z.sent();
                    return [4 /*yield*/, result.json()];
                case 10:
                    data = (_z.sent()).data;
                    if (!(data === null || data === void 0 ? void 0 : data.success)) return [3 /*break*/, 12];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.stockTransfer(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)(data === null || data === void 0 ? void 0 : data.message))];
                case 11: throw _k.apply(void 0, _l.concat([_z.sent()]));
                case 12:
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.stockTransfer(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(data === null || data === void 0 ? void 0 : data.message, (_y = data === null || data === void 0 ? void 0 : data.message) !== null && _y !== void 0 ? _y : "Failed to unpick line"))];
                case 13: throw _m.apply(void 0, _o.concat([_z.sent()]));
            }
        });
    });
}
