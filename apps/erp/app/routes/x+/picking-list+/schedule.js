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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.loader = loader;
exports.default = PickingScheduleRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var inventory_1 = require("~/modules/inventory");
var PickingLists_1 = require("~/modules/inventory/ui/PickingLists");
var resources_1 = require("~/modules/resources");
var users_server_1 = require("~/modules/users/users.server");
var duration_1 = require("~/utils/duration");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Picking Lists"], ["Picking Lists"]))),
    to: path_1.path.to.pickingLists
};
var DISPLAY_SETTINGS_KEY = "picking-schedule-display-settings";
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, locationId, userDefaults, _d, _e, locations, _f, _g, pickingSchedule;
        var _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    locationId = searchParams.get("location");
                    if (!!locationId) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, users_server_1.getUserDefaults)(client, userId, companyId)];
                case 2:
                    userDefaults = _m.sent();
                    if (!userDefaults.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.pickingSchedule];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(userDefaults.error, "Failed to load default location"))];
                case 3: throw _d.apply(void 0, _e.concat([_m.sent()]));
                case 4:
                    locationId = (_j = (_h = userDefaults.data) === null || _h === void 0 ? void 0 : _h.locationId) !== null && _j !== void 0 ? _j : null;
                    _m.label = 5;
                case 5:
                    if (!!locationId) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, resources_1.getLocationsList)(client, companyId)];
                case 6:
                    locations = _m.sent();
                    if (!(locations.error || !((_k = locations.data) === null || _k === void 0 ? void 0 : _k.length))) return [3 /*break*/, 8];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(locations.error, "Failed to load any locations"))];
                case 7: throw _f.apply(void 0, _g.concat([_m.sent()]));
                case 8:
                    locationId = locations.data[0].id;
                    _m.label = 9;
                case 9: return [4 /*yield*/, (0, inventory_1.getPickingSchedule)(client, {
                        locationId: locationId,
                        companyId: companyId,
                        search: search
                    })];
                case 10:
                    pickingSchedule = _m.sent();
                    return [2 /*return*/, {
                            pickingSchedule: (_l = pickingSchedule.data) !== null && _l !== void 0 ? _l : [],
                            locationId: locationId
                        }];
            }
        });
    });
}
function PickingScheduleRoute() {
    var _a = (0, react_router_1.useLoaderData)(), pickingSchedule = _a.pickingSchedule, locationId = _a.locationId;
    var _b = (0, react_1.useLocalStorage)(DISPLAY_SETTINGS_KEY, PickingLists_1.defaultPickingDisplaySettings), displaySettings = _b[0], setDisplaySettings = _b[1];
    var mergedDisplaySettings = (0, react_2.useMemo)(function () { return (__assign(__assign({}, PickingLists_1.defaultPickingDisplaySettings), displaySettings)); }, [displaySettings]);
    var data = (0, react_2.useMemo)(function () {
        return pickingSchedule.map(function (op) {
            var _a, _b, _c, _d, _e, _f, _g;
            return (__assign(__assign({}, op), { duration: (0, duration_1.makeDurations)({
                    setupTime: (_a = op.setupTime) !== null && _a !== void 0 ? _a : 0,
                    setupUnit: (_b = op.setupUnit) !== null && _b !== void 0 ? _b : undefined,
                    laborTime: (_c = op.laborTime) !== null && _c !== void 0 ? _c : 0,
                    laborUnit: (_d = op.laborUnit) !== null && _d !== void 0 ? _d : undefined,
                    machineTime: (_e = op.machineTime) !== null && _e !== void 0 ? _e : 0,
                    machineUnit: (_f = op.machineUnit) !== null && _f !== void 0 ? _f : undefined,
                    operationQuantity: (_g = op.operationQuantity) !== null && _g !== void 0 ? _g : 0
                }).duration }));
        });
    }, [pickingSchedule]);
    var _c = (0, react_2.useState)(new Set()), selectedIds = _c[0], setSelectedIds = _c[1];
    var toggleSelection = (0, react_2.useCallback)(function (id) {
        setSelectedIds(function (prev) {
            var next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            }
            else {
                next.add(id);
            }
            return next;
        });
    }, []);
    return (<react_1.VStack spacing={0} className="h-full">
      <PickingLists_1.PickingListsHeader locationId={locationId} displaySettings={mergedDisplaySettings} onDisplaySettingChange={function (key, value) {
            return setDisplaySettings(function (prev) {
                var _a;
                return (__assign(__assign(__assign({}, PickingLists_1.defaultPickingDisplaySettings), prev), (_a = {}, _a[key] = value, _a)));
            });
        }} selectedJobOperationIds={Array.from(selectedIds)}/>
      <PickingLists_1.PickingKanban data={data} displaySettings={mergedDisplaySettings} selectedIds={selectedIds} onToggle={toggleSelection}/>
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
