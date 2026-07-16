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
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, id, update, _d, _e, linkedQuotes, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "purchasing"
                        })];
                case 1:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    id = params.rfqId;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, purchasing_1.updatePurchasingRFQStatus)(client, {
                            id: id,
                            status: "Closed",
                            assignee: null,
                            updatedBy: userId
                        })];
                case 2:
                    update = _h.sent();
                    if (!update.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.purchasingRfqDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to cancel RFQ"))];
                case 3: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 4: return [4 /*yield*/, (0, purchasing_1.getLinkedSupplierQuotes)(client, id)];
                case 5:
                    linkedQuotes = _h.sent();
                    if (!(!linkedQuotes.error && linkedQuotes.data)) return [3 /*break*/, 7];
                    return [4 /*yield*/, Promise.all(linkedQuotes.data.map(function (link) {
                            return (0, purchasing_1.updateSupplierQuoteStatus)(client, {
                                id: link.supplierQuoteId,
                                status: "Cancelled",
                                assignee: undefined,
                                updatedBy: userId
                            });
                        }))];
                case 6:
                    _h.sent();
                    _h.label = 7;
                case 7:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.purchasingRfqDetails(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("RFQ cancelled"))];
                case 8: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
