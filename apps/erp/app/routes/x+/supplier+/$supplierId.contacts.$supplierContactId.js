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
exports.clientAction = clientAction;
exports.default = EditSupplierContactRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var purchasing_1 = require("~/modules/purchasing");
var SupplierContactForm_1 = require("~/modules/purchasing/ui/Supplier/SupplierContactForm");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, supplierId, supplierContactId, contact, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "purchasing"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    supplierId = params.supplierId, supplierContactId = params.supplierContactId;
                    if (!supplierId)
                        throw (0, auth_1.notFound)("supplierId not found");
                    if (!supplierContactId)
                        throw (0, auth_1.notFound)("supplierContactId not found");
                    return [4 /*yield*/, (0, purchasing_1.getSupplierContact)(client, supplierContactId)];
                case 2:
                    contact = _e.sent();
                    if (!contact.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.supplierContacts(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(contact.error, "Failed to get supplier contact"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        contact: contact.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, supplierId, supplierContactId, formData, validation, _c, id, contactId, supplierLocationId, contact, update, _d, _e, _f, _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "purchasing"
                        })];
                case 1:
                    client = (_h.sent()).client;
                    supplierId = params.supplierId, supplierContactId = params.supplierContactId;
                    if (!supplierId)
                        throw (0, auth_1.notFound)("supplierId not found");
                    if (!supplierContactId)
                        throw (0, auth_1.notFound)("supplierContactId not found");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    return [4 /*yield*/, (0, form_1.validator)(purchasing_1.supplierContactValidator).validate(formData)];
                case 3:
                    validation = _h.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _c = validation.data, id = _c.id, contactId = _c.contactId, supplierLocationId = _c.supplierLocationId, contact = __rest(_c, ["id", "contactId", "supplierLocationId"]);
                    if (id !== supplierContactId)
                        throw (0, auth_1.badRequest)("supplierContactId does not match id from form data");
                    if (contactId === undefined)
                        throw (0, auth_1.badRequest)("contactId is undefined from form data");
                    return [4 /*yield*/, (0, purchasing_1.updateSupplierContact)(client, {
                            contactId: contactId,
                            contact: contact,
                            supplierLocationId: supplierLocationId,
                            customFields: (0, form_2.setCustomFields)(formData)
                        })];
                case 4:
                    update = _h.sent();
                    if (!update.error) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.supplierContacts(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(update.error, "Failed to update supplier contact"))];
                case 5: throw _d.apply(void 0, _e.concat([_h.sent()]));
                case 6:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.supplierContacts(supplierId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Supplier contact updated"))];
                case 7: throw _f.apply(void 0, _g.concat([_h.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var supplierId;
        var _c;
        var serverAction = _b.serverAction, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    supplierId = params.supplierId;
                    if (supplierId) {
                        (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.setQueryData((0, react_query_1.supplierContactsQuery)(supplierId).queryKey, null);
                    }
                    return [4 /*yield*/, serverAction()];
                case 1: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function EditSupplierContactRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    var contact = (0, react_router_1.useLoaderData)().contact;
    var navigate = (0, react_router_1.useNavigate)();
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("supplierId not found");
    var initialValues = __assign({ id: (_a = contact === null || contact === void 0 ? void 0 : contact.id) !== null && _a !== void 0 ? _a : undefined, contactId: (_c = (_b = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : undefined, firstName: (_e = (_d = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _d === void 0 ? void 0 : _d.firstName) !== null && _e !== void 0 ? _e : "", lastName: (_g = (_f = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _f === void 0 ? void 0 : _f.lastName) !== null && _g !== void 0 ? _g : "", email: (_j = (_h = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _h === void 0 ? void 0 : _h.email) !== null && _j !== void 0 ? _j : "", title: (_l = (_k = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _k === void 0 ? void 0 : _k.title) !== null && _l !== void 0 ? _l : "", mobilePhone: (_o = (_m = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _m === void 0 ? void 0 : _m.mobilePhone) !== null && _o !== void 0 ? _o : "", homePhone: (_q = (_p = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _p === void 0 ? void 0 : _p.homePhone) !== null && _q !== void 0 ? _q : "", workPhone: (_s = (_r = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _r === void 0 ? void 0 : _r.workPhone) !== null && _s !== void 0 ? _s : "", fax: (_u = (_t = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _t === void 0 ? void 0 : _t.fax) !== null && _u !== void 0 ? _u : "", supplierLocationId: (_v = contact === null || contact === void 0 ? void 0 : contact.supplierLocationId) !== null && _v !== void 0 ? _v : "", notes: (_x = (_w = contact === null || contact === void 0 ? void 0 : contact.contact) === null || _w === void 0 ? void 0 : _w.notes) !== null && _x !== void 0 ? _x : "" }, (0, form_2.getCustomFields)(contact === null || contact === void 0 ? void 0 : contact.customFields));
    return (<SupplierContactForm_1.default key={initialValues.id} supplierId={supplierId} initialValues={initialValues} onClose={function () { return navigate(path_1.path.to.supplierContacts(supplierId)); }}/>);
}
