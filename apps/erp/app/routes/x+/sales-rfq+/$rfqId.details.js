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
exports.default = SalesRFQDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var sales_1 = require("~/modules/sales");
var Opportunity_1 = require("~/modules/sales/ui/Opportunity");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, rfqId, rfq, _c, _d;
        var _e, _f, _g, _h;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "sales"
                    })];
                case 1:
                    client = (_j.sent()).client;
                    rfqId = params.rfqId;
                    if (!rfqId)
                        throw new Error("Could not find rfqId");
                    return [4 /*yield*/, (0, sales_1.getSalesRFQ)(client, rfqId)];
                case 2:
                    rfq = _j.sent();
                    if (!rfq.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.salesRfqs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(rfq.error, "Failed to load RFQ"))];
                case 3: throw _c.apply(void 0, _d.concat([_j.sent()]));
                case 4: return [2 /*return*/, {
                        internalNotes: ((_f = (_e = rfq.data) === null || _e === void 0 ? void 0 : _e.internalNotes) !== null && _f !== void 0 ? _f : {}),
                        externalNotes: ((_h = (_g = rfq.data) === null || _g === void 0 ? void 0 : _g.externalNotes) !== null && _h !== void 0 ? _h : {})
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var id, viewClient, rfq, _c, client, userId, formData, validation, _d, rfqId, d, update, _e, _f, _g, _h;
        var _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    id = params.rfqId;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 1:
                    viewClient = (_k.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getSalesRFQ)(viewClient, id)];
                case 2:
                    rfq = _k.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isSalesRfqLocked)((_j = rfq.data) === null || _j === void 0 ? void 0 : _j.status),
                            redirectTo: path_1.path.to.salesRfq(id),
                            message: "Cannot modify a locked RFQ. Reopen it first."
                        })];
                case 3:
                    _k.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "sales"
                        })];
                case 4:
                    _c = _k.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.salesRfqValidator).validate(formData)];
                case 6:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, rfqId = _d.rfqId, d = __rest(_d, ["rfqId"]);
                    if (!rfqId)
                        throw new Error("Could not find rfqId");
                    return [4 /*yield*/, (0, sales_1.upsertSalesRFQ)(client, __assign(__assign({ id: id, rfqId: rfqId }, d), { customFields: (0, form_2.setCustomFields)(formData), updatedBy: userId }))];
                case 7:
                    update = _k.sent();
                    if (!update.error) return [3 /*break*/, 9];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesRfq(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update RFQ"))];
                case 8: throw _e.apply(void 0, _f.concat([_k.sent()]));
                case 9:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.salesRfq(id)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated RFQ"))];
                case 10: throw _g.apply(void 0, _h.concat([_k.sent()]));
            }
        });
    });
}
function SalesRFQDetailsRoute() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), internalNotes = _a.internalNotes, externalNotes = _a.externalNotes;
    var rfqId = (0, react_router_1.useParams)().rfqId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    var rfqData = (0, hooks_1.useRouteData)(path_1.path.to.salesRfq(rfqId));
    if (!rfqData)
        throw new Error("Could not find rfq data");
    return (<react_1.VStack spacing={2}>
      <Opportunity_1.OpportunityState key={"state-".concat(rfqId)} opportunity={rfqData === null || rfqData === void 0 ? void 0 : rfqData.opportunity}/>
      <Opportunity_1.OpportunityNotes key={"notes-".concat(rfqId)} id={rfqData.rfqSummary.id} table="salesRfq" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} internalNotes={internalNotes} externalNotes={externalNotes}/>
      <components_1.DeferredFiles key={"documents-".concat(rfqId)} resolve={rfqData.files}>
        {function (resolvedFiles) { return (<Opportunity_1.OpportunityDocuments opportunity={rfqData.opportunity} attachments={resolvedFiles} id={rfqId} type="Request for Quote"/>); }}
      </components_1.DeferredFiles>
    </react_1.VStack>);
}
var templateObject_1;
