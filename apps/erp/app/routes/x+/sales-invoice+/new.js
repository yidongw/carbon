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
exports.handle = void 0;
exports.loader = loader;
exports.action = action;
exports.default = SalesInvoiceNewRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var invoicing_1 = require("~/modules/invoicing");
var SalesInvoiceForm_1 = require("~/modules/invoicing/ui/SalesInvoice/SalesInvoiceForm");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Sales"], ["Sales"]))),
    to: path_1.path.to.salesDashboard,
    module: "sales"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, url, sourceDocument, sourceDocumentId, result, _d, _e, _f, _g, _h;
        var _j, _k, _l, _m, _o, _p;
        var request = _b.request;
        return __generator(this, function (_q) {
            switch (_q.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        create: "invoicing"
                    })];
                case 1:
                    _c = _q.sent(), companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    sourceDocument = (_j = url.searchParams.get("sourceDocument")) !== null && _j !== void 0 ? _j : undefined;
                    sourceDocumentId = (_k = url.searchParams.get("sourceDocumentId")) !== null && _k !== void 0 ? _k : "";
                    _d = sourceDocument;
                    switch (_d) {
                        case "Sales Order": return [3 /*break*/, 2];
                        case "Shipment": return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 10];
                case 2:
                    if (!sourceDocumentId)
                        throw new Error("Missing sourceDocumentId");
                    return [4 /*yield*/, (0, invoicing_1.createSalesInvoiceFromSalesOrder)((0, client_server_1.getCarbonServiceRole)(), sourceDocumentId, companyId, userId)];
                case 3:
                    result = _q.sent();
                    if (!(result.error || !(result === null || result === void 0 ? void 0 : result.data))) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [(_l = request.headers.get("Referer")) !== null && _l !== void 0 ? _l : path_1.path.to.salesOrders];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to create sales invoice"))];
                case 4: throw _e.apply(void 0, _f.concat([_q.sent()]));
                case 5: throw (0, react_router_1.redirect)(path_1.path.to.salesInvoice((_m = result.data) === null || _m === void 0 ? void 0 : _m.id));
                case 6:
                    if (!sourceDocumentId)
                        throw new Error("Missing sourceDocumentId");
                    return [4 /*yield*/, (0, invoicing_1.createSalesInvoiceFromShipment)((0, client_server_1.getCarbonServiceRole)(), sourceDocumentId, companyId, userId)];
                case 7:
                    result = _q.sent();
                    if (!(result.error || !(result === null || result === void 0 ? void 0 : result.data))) return [3 /*break*/, 9];
                    _g = react_router_1.redirect;
                    _h = [(_o = request.headers.get("Referer")) !== null && _o !== void 0 ? _o : path_1.path.to.shipment(sourceDocumentId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to create sales invoice"))];
                case 8: throw _g.apply(void 0, _h.concat([_q.sent()]));
                case 9: throw (0, react_router_1.redirect)(path_1.path.to.salesInvoice((_p = result.data) === null || _p === void 0 ? void 0 : _p.id));
                case 10: return [2 /*return*/, null];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, formData, validation, _d, _id, d, result, _e, _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "invoicing"
                        })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _g.sent();
                    return [4 /*yield*/, (0, form_1.validator)(invoicing_1.salesInvoiceValidator).validate(formData)];
                case 3:
                    validation = _g.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, _id = _d.id, d = __rest(_d, ["id"]);
                    return [4 /*yield*/, (0, invoicing_1.insertSalesInvoice)(client, __assign(__assign({}, d), { invoiceId: d.invoiceId || undefined, companyId: companyId, companyGroupId: companyGroupId, createdBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    result = _g.sent();
                    if (!(result.error || !result.data)) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesInvoices];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to insert sales invoice"))];
                case 5: throw _e.apply(void 0, _f.concat([_g.sent()]));
                case 6: throw (0, react_router_1.redirect)(path_1.path.to.salesInvoice(result.data.id));
            }
        });
    });
}
function SalesInvoiceNewRoute() {
    var _a;
    var params = (0, hooks_1.useUrlParams)()[0];
    var customerId = params.get("customerId");
    var defaults = (0, hooks_1.useUser)().defaults;
    var initialValues = {
        id: undefined,
        invoiceId: undefined,
        customerId: customerId !== null && customerId !== void 0 ? customerId : "",
        locationId: (_a = defaults === null || defaults === void 0 ? void 0 : defaults.locationId) !== null && _a !== void 0 ? _a : "",
        dateIssued: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString()
    };
    return (<div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <SalesInvoiceForm_1.default initialValues={initialValues}/>
    </div>);
}
var templateObject_1;
