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
exports.default = InboundInspectionRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_router_1 = require("react-router");
var tiny_invariant_1 = require("tiny-invariant");
var quality_1 = require("~/modules/quality");
var InboundInspectionLotView_1 = require("~/modules/quality/ui/InboundInspections/InboundInspectionLotView");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, id, _d, inspection, settings, issueTypes, _e, _f, insp, lotEntities;
        var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_x) {
            switch (_x.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "quality",
                        role: "employee"
                    })];
                case 1:
                    _c = _x.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    id = params.id;
                    (0, tiny_invariant_1.default)(id, "id is required");
                    return [4 /*yield*/, Promise.all([
                            (0, quality_1.getInboundInspection)(client, id),
                            (0, settings_1.getCompanySettings)(client, companyId),
                            (0, quality_1.getIssueTypesList)(client, companyId)
                        ])];
                case 2:
                    _d = _x.sent(), inspection = _d[0], settings = _d[1], issueTypes = _d[2];
                    if (!(inspection.error || !inspection.data)) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.inboundInspections];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(inspection.error, "Failed to load inspection"))];
                case 3: throw _e.apply(void 0, _f.concat([_x.sent()]));
                case 4:
                    insp = inspection.data;
                    if (insp.companyId !== companyId) {
                        throw (0, react_router_1.redirect)(path_1.path.to.inboundInspections);
                    }
                    return [4 /*yield*/, (0, quality_1.getInboundInspectionLotTrackedEntities)(client, insp.receiptLineId, companyId)];
                case 5:
                    lotEntities = _x.sent();
                    return [2 /*return*/, (0, react_router_1.data)({
                            inspection: insp,
                            receiptReadableId: (_h = (_g = insp.receipt) === null || _g === void 0 ? void 0 : _g.receiptId) !== null && _h !== void 0 ? _h : null,
                            receiverId: (_k = (_j = insp.receipt) === null || _j === void 0 ? void 0 : _j.createdBy) !== null && _k !== void 0 ? _k : null,
                            itemName: (_m = (_l = insp.item) === null || _l === void 0 ? void 0 : _l.name) !== null && _m !== void 0 ? _m : "",
                            itemTrackingType: (_p = (_o = insp.item) === null || _o === void 0 ? void 0 : _o.itemTrackingType) !== null && _p !== void 0 ? _p : null,
                            supplierName: (_r = (_q = insp.supplier) === null || _q === void 0 ? void 0 : _q.name) !== null && _r !== void 0 ? _r : null,
                            samples: (_s = insp.inboundInspectionSample) !== null && _s !== void 0 ? _s : [],
                            lotEntities: ((_t = lotEntities.data) !== null && _t !== void 0 ? _t : []),
                            issueTypes: ((_u = issueTypes.data) !== null && _u !== void 0 ? _u : []),
                            enforceFourEyes: (_w = (_v = settings.data) === null || _v === void 0 ? void 0 : _v.enforceInspectionFourEyes) !== null && _w !== void 0 ? _w : false,
                            currentUserId: userId
                        })];
            }
        });
    });
}
function InboundInspectionRoute() {
    var _a = (0, react_router_1.useLoaderData)(), inspection = _a.inspection, receiptReadableId = _a.receiptReadableId, receiverId = _a.receiverId, itemName = _a.itemName, itemTrackingType = _a.itemTrackingType, supplierName = _a.supplierName, samples = _a.samples, lotEntities = _a.lotEntities, issueTypes = _a.issueTypes, enforceFourEyes = _a.enforceFourEyes, currentUserId = _a.currentUserId;
    return (<InboundInspectionLotView_1.default inspection={inspection} receiptReadableId={receiptReadableId} receiverId={receiverId} itemName={itemName} itemTrackingType={itemTrackingType} supplierName={supplierName} samples={samples} lotEntities={lotEntities} issueTypes={issueTypes} currentUserId={currentUserId} enforceFourEyes={enforceFourEyes}/>);
}
