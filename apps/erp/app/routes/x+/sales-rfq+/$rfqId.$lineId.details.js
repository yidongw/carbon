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
exports.loader = void 0;
exports.action = action;
exports.default = SalesRFQLine;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var sales_1 = require("~/modules/sales");
var Opportunity_1 = require("~/modules/sales/ui/Opportunity");
var SalesRFQ_1 = require("~/modules/sales/ui/SalesRFQ");
var form_2 = require("~/utils/form");
var lockedGuard_server_1 = require("~/utils/lockedGuard.server");
var path_1 = require("~/utils/path");
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var companyId, rfqId, lineId, serviceRole, line, _c, _d, itemId;
    var request = _b.request, params = _b.params;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                    view: "sales"
                })];
            case 1:
                companyId = (_e.sent()).companyId;
                rfqId = params.rfqId, lineId = params.lineId;
                if (!rfqId)
                    throw new Error("Could not find rfqId");
                if (!lineId)
                    throw new Error("Could not find lineId");
                return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()];
            case 2:
                serviceRole = _e.sent();
                return [4 /*yield*/, (0, sales_1.getSalesRFQLine)(serviceRole, lineId)];
            case 3:
                line = _e.sent();
                if (!line.error) return [3 /*break*/, 5];
                _c = react_router_1.redirect;
                _d = [path_1.path.to.salesRfq(rfqId)];
                return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(line.error, "Failed to load line"))];
            case 4: throw _c.apply(void 0, _d.concat([_e.sent()]));
            case 5:
                itemId = line.data.itemId;
                return [2 /*return*/, {
                        line: line.data,
                        files: (0, sales_1.getOpportunityLineDocuments)(serviceRole, companyId, lineId, itemId)
                    }];
        }
    });
}); };
exports.loader = loader;
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var rfqId, lineId, viewClient, rfq, _c, client, userId, formData, validation, _d, id, d, updateLine, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    rfqId = params.rfqId, lineId = params.lineId;
                    if (!rfqId)
                        throw new Error("Could not find rfqId");
                    if (!lineId)
                        throw new Error("Could not find lineId");
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "sales"
                        })];
                case 1:
                    viewClient = (_h.sent()).client;
                    return [4 /*yield*/, (0, sales_1.getSalesRFQ)(viewClient, rfqId)];
                case 2:
                    rfq = _h.sent();
                    return [4 /*yield*/, (0, lockedGuard_server_1.requireUnlocked)({
                            request: request,
                            isLocked: (0, sales_1.isSalesRfqLocked)((_g = rfq.data) === null || _g === void 0 ? void 0 : _g.status),
                            redirectTo: path_1.path.to.salesRfqLine(rfqId, lineId),
                            message: "Cannot modify a locked RFQ. Reopen it first."
                        })];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 4:
                    _c = _h.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 5:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(sales_1.salesRfqLineValidator).validate(formData)];
                case 6:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, sales_1.upsertSalesRFQLine)(client, __assign(__assign({ id: lineId }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 7:
                    updateLine = _h.sent();
                    if (!updateLine.error) return [3 /*break*/, 9];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesRfqLine(rfqId, lineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateLine.error, "Failed to update quote line"))];
                case 8: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 9: throw (0, react_router_1.redirect)(path_1.path.to.salesRfqLine(rfqId, lineId));
            }
        });
    });
}
function SalesRFQLine() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var t = (0, macro_1.useLingui)().t;
    var _r = (0, react_router_1.useLoaderData)(), line = _r.line, files = _r.files;
    var permissions = (0, hooks_1.usePermissions)();
    var _s = (0, react_router_1.useParams)(), rfqId = _s.rfqId, lineId = _s.lineId;
    if (!rfqId)
        throw new Error("Could not find rfqId");
    if (!lineId)
        throw new Error("Could not find lineId");
    var rfqData = (0, hooks_1.useRouteData)(path_1.path.to.salesRfq(rfqId));
    var isReadOnly = (0, sales_1.isSalesRfqLocked)((_a = rfqData === null || rfqData === void 0 ? void 0 : rfqData.rfqSummary) === null || _a === void 0 ? void 0 : _a.status);
    var initialValues = __assign(__assign({}, line), { id: (_b = line.id) !== null && _b !== void 0 ? _b : undefined, salesRfqId: (_c = line.salesRfqId) !== null && _c !== void 0 ? _c : "", customerPartId: (_d = line.customerPartId) !== null && _d !== void 0 ? _d : "", customerPartRevision: (_e = line.customerPartRevision) !== null && _e !== void 0 ? _e : "", description: (_f = line.description) !== null && _f !== void 0 ? _f : "", itemId: (_g = line.itemId) !== null && _g !== void 0 ? _g : "", quantity: (_h = line.quantity) !== null && _h !== void 0 ? _h : [1], order: (_j = line.order) !== null && _j !== void 0 ? _j : 1, unitOfMeasureCode: (_k = line.unitOfMeasureCode) !== null && _k !== void 0 ? _k : "", modelUploadId: (_l = line.modelUploadId) !== null && _l !== void 0 ? _l : undefined });
    return (<react_1.Fragment key={lineId}>
      <SalesRFQ_1.SalesRFQLineForm key={lineId} initialValues={initialValues}/>
      <Opportunity_1.OpportunityLineNotes id={line.id} table="salesRfqLine" title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Notes"], ["Notes"])))} subTitle={(_m = line.customerPartId) !== null && _m !== void 0 ? _m : ""} internalNotes={line.internalNotes} externalNotes={line.externalNotes}/>

      <components_1.DeferredFiles resolve={files}>
        {function (resolvedFiles) { return (<Opportunity_1.OpportunityLineDocuments files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} id={rfqId} lineId={lineId} itemId={line === null || line === void 0 ? void 0 : line.itemId} modelUpload={line !== null && line !== void 0 ? line : undefined} type="Request for Quote"/>); }}
      </components_1.DeferredFiles>
      <components_1.CadModel isReadOnly={isReadOnly || !permissions.can("update", "sales")} metadata={{
            salesRfqLineId: (_o = line.id) !== null && _o !== void 0 ? _o : undefined,
            itemId: (_p = line.itemId) !== null && _p !== void 0 ? _p : undefined
        }} modelPath={(_q = line === null || line === void 0 ? void 0 : line.modelPath) !== null && _q !== void 0 ? _q : null} title={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>

      <react_router_1.Outlet />
    </react_1.Fragment>);
}
var templateObject_1, templateObject_2;
