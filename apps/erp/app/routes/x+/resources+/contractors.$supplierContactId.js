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
exports.default = ContractorRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var resources_1 = require("~/modules/resources");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, supplierContactId, contractor, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "resources"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    supplierContactId = params.supplierContactId;
                    if (!supplierContactId)
                        throw (0, auth_1.notFound)("supplierContactId not found");
                    return [4 /*yield*/, (0, resources_1.getContractor)(client, supplierContactId)];
                case 2:
                    contractor = _e.sent();
                    if (!contractor.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.contractors];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(contractor.error, "Failed to get contractor"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        contractor: contractor.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, validation, _d, id, supplierId, d, updateContractor, _e, _f, _g, _h;
        var _j;
        var request = _b.request;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "resources"
                        })];
                case 1:
                    _c = _k.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _k.sent();
                    return [4 /*yield*/, (0, form_1.validator)(resources_1.contractorValidator).validate(formData)];
                case 3:
                    validation = _k.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, supplierId = _d.supplierId, d = __rest(_d, ["id", "supplierId"]);
                    if (!id)
                        throw (0, auth_1.notFound)("Contractor ID was not found");
                    return [4 /*yield*/, (0, resources_1.upsertContractor)(client, __assign(__assign({ id: id }, d), { 
                            // @ts-expect-error TS2339 - TODO: fix type
                            abilities: (_j = d.abilities) !== null && _j !== void 0 ? _j : [], customFields: (0, form_2.setCustomFields)(formData), updatedBy: userId }))];
                case 4:
                    updateContractor = _k.sent();
                    if (!updateContractor.error) return [3 /*break*/, 6];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.contractors];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateContractor.error, "Failed to create contractor"))];
                case 5: throw _e.apply(void 0, _f.concat([_k.sent()]));
                case 6:
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.contractors];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Contractor updated"))];
                case 7: throw _g.apply(void 0, _h.concat([_k.sent()]));
            }
        });
    });
}
function ContractorRoute() {
    var _a, _b, _c, _d;
    var contractor = (0, react_router_1.useLoaderData)().contractor;
    var initialValues = __assign({ id: (_a = contractor.supplierContactId) !== null && _a !== void 0 ? _a : "", supplierId: (_b = contractor.supplierId) !== null && _b !== void 0 ? _b : "", hoursPerWeek: (_c = contractor.hoursPerWeek) !== null && _c !== void 0 ? _c : 0, abilities: (_d = contractor.abilityIds) !== null && _d !== void 0 ? _d : [] }, (0, form_2.getCustomFields)(contractor.customFields));
    return (<resources_1.ContractorForm key={initialValues.id} initialValues={initialValues}/>);
}
