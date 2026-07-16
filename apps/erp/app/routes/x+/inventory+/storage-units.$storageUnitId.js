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
exports.default = EditStorageUnitRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var resources_1 = require("~/modules/resources");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, storageUnitId, _d, storageUnit, effectiveWorkCenter, workCenters, ownWorkCenterId, effectiveWorkCenterId, isInherited, inheritedWorkCenterName, wc;
        var _e, _f, _g, _h, _j, _k;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory",
                        role: "employee"
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId;
                    storageUnitId = params.storageUnitId;
                    if (!storageUnitId)
                        throw (0, auth_1.notFound)("storageUnitId not found");
                    return [4 /*yield*/, Promise.all([
                            (0, inventory_1.getStorageUnit)(client, storageUnitId),
                            (0, inventory_1.getEffectiveWorkCenterId)(client, storageUnitId),
                            (0, resources_1.getWorkCentersList)(client, companyId)
                        ])];
                case 2:
                    _d = _l.sent(), storageUnit = _d[0], effectiveWorkCenter = _d[1], workCenters = _d[2];
                    ownWorkCenterId = (_f = (_e = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.data) === null || _e === void 0 ? void 0 : _e.workCenterId) !== null && _f !== void 0 ? _f : null;
                    effectiveWorkCenterId = (_g = effectiveWorkCenter === null || effectiveWorkCenter === void 0 ? void 0 : effectiveWorkCenter.data) !== null && _g !== void 0 ? _g : null;
                    isInherited = !ownWorkCenterId && !!effectiveWorkCenterId;
                    inheritedWorkCenterName = null;
                    if (isInherited && effectiveWorkCenterId) {
                        wc = (_h = workCenters === null || workCenters === void 0 ? void 0 : workCenters.data) === null || _h === void 0 ? void 0 : _h.find(function (w) { return w.id === effectiveWorkCenterId; });
                        inheritedWorkCenterName = (_j = wc === null || wc === void 0 ? void 0 : wc.name) !== null && _j !== void 0 ? _j : null;
                    }
                    return [2 /*return*/, {
                            storageUnit: (_k = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.data) !== null && _k !== void 0 ? _k : null,
                            inheritedWorkCenter: isInherited
                                ? {
                                    workCenterId: effectiveWorkCenterId,
                                    workCenterName: inheritedWorkCenterName
                                }
                                : null
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, formData, validation, _d, id, d, updateStorageUnit, _e, _f, _g, _h;
        var request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "inventory"
                        })];
                case 1:
                    _c = _j.sent(), client = _c.client, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _j.sent();
                    return [4 /*yield*/, (0, form_1.validator)(inventory_1.storageUnitValidator).validate(formData)];
                case 3:
                    validation = _j.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, id = _d.id, d = __rest(_d, ["id"]);
                    if (!id)
                        throw new Error("id not found");
                    return [4 /*yield*/, (0, inventory_1.upsertStorageUnit)(client, __assign(__assign({ id: id }, d), { updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    updateStorageUnit = _j.sent();
                    if (!updateStorageUnit.error) return [3 /*break*/, 6];
                    _e = react_router_1.data;
                    _f = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateStorageUnit.error, "Failed to update storageUnit"))];
                case 5: return [2 /*return*/, _e.apply(void 0, _f.concat([_j.sent()]))];
                case 6:
                    _g = react_router_1.redirect;
                    _h = ["".concat(path_1.path.to.storageUnits, "?").concat((0, path_1.getParams)(request))];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated storageUnit"))];
                case 7: throw _g.apply(void 0, _h.concat([_j.sent()]));
            }
        });
    });
}
function clientAction(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var companyId, formData, validation;
        var _c;
        var request = _b.request, serverAction = _b.serverAction;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    companyId = (0, react_query_1.getCompanyId)();
                    return [4 /*yield*/, request.clone().formData()];
                case 1:
                    formData = _d.sent();
                    return [4 /*yield*/, (0, form_1.validator)(inventory_1.storageUnitValidator).validate(formData)];
                case 2:
                    validation = _d.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    if (companyId && validation.data.locationId) {
                        (_c = window.clientCache) === null || _c === void 0 ? void 0 : _c.setQueryData((0, react_query_1.storageUnitsQuery)(companyId, validation.data.locationId).queryKey, null);
                    }
                    return [4 /*yield*/, serverAction()];
                case 3: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function EditStorageUnitRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var _h = (0, react_router_1.useLoaderData)(), storageUnit = _h.storageUnit, inheritedWorkCenter = _h.inheritedWorkCenter;
    var navigate = (0, react_router_1.useNavigate)();
    var initialValues = __assign({ id: (_a = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.id) !== null && _a !== void 0 ? _a : undefined, name: (_b = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.name) !== null && _b !== void 0 ? _b : "", locationId: (_c = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.locationId) !== null && _c !== void 0 ? _c : "", warehouseId: (_d = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.warehouseId) !== null && _d !== void 0 ? _d : undefined, parentId: (_e = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.parentId) !== null && _e !== void 0 ? _e : undefined, workCenterId: (_f = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.workCenterId) !== null && _f !== void 0 ? _f : undefined, storageTypeIds: (_g = storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.storageTypeIds) !== null && _g !== void 0 ? _g : [] }, (0, form_2.getCustomFields)(storageUnit === null || storageUnit === void 0 ? void 0 : storageUnit.customFields));
    return (<>
      <inventory_1.StorageUnitForm key={initialValues.id} initialValues={initialValues} locationId={initialValues.locationId} inheritedWorkCenter={inheritedWorkCenter} onClose={function () { return navigate(-1); }}/>
      <react_router_1.Outlet />
    </>);
}
