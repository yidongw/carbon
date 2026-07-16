"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.default = PeopleEmployeesRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var people_1 = require("~/modules/people");
var People_1 = require("~/modules/people/ui/People");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employees"], ["Employees"]))),
    to: "".concat(path_1.path.to.people, "?filter=").concat(encodeURIComponent("status:eq:Active"))
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, pathname, isEmployeesIndex, searchParams, search, _d, limit, offset, sorts, filters, _e, attributeCategories, people, departments, _f, _g, _h, _j, departmentByEmployeeId;
        var _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    pathname = url.pathname;
                    isEmployeesIndex = /\/employees\/?$/.test(pathname);
                    if (!isEmployeesIndex) {
                        return [2 /*return*/, { isEmployeesIndex: false }];
                    }
                    searchParams = new URLSearchParams(url.search);
                    // Default to active on first visit only. Once filters are cleared or removed,
                    // keep showing all employees instead of re-applying the default.
                    if (isEmployeesIndex && searchParams.toString() === "") {
                        throw (0, react_router_1.redirect)("".concat(path_1.path.to.people, "?filter=").concat(encodeURIComponent("status:eq:Active")));
                    }
                    search = searchParams.get("name");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.getAttributeCategories)(client, companyId),
                            (0, people_1.getPeople)(client, companyId, { search: search, limit: limit, offset: offset, sorts: sorts, filters: filters }),
                            client
                                .from("employeeSummary")
                                .select("id, departmentName")
                                .eq("companyId", companyId)
                        ])];
                case 2:
                    _e = _o.sent(), attributeCategories = _e[0], people = _e[1], departments = _e[2];
                    if (!attributeCategories.error) return [3 /*break*/, 4];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(attributeCategories.error, "Error loading attribute categories"))];
                case 3: throw _f.apply(void 0, _g.concat([_o.sent()]));
                case 4:
                    if (!people.error) return [3 /*break*/, 6];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(people.error, "Error loading people"))];
                case 5: throw _h.apply(void 0, _j.concat([_o.sent()]));
                case 6:
                    departmentByEmployeeId = Object.fromEntries(((_k = departments.data) !== null && _k !== void 0 ? _k : []).map(function (d) { return [d.id, d.departmentName]; }));
                    return [2 /*return*/, {
                            isEmployeesIndex: true,
                            attributeCategories: attributeCategories.data,
                            people: (_l = people.data) !== null && _l !== void 0 ? _l : [],
                            count: (_m = people.count) !== null && _m !== void 0 ? _m : 0,
                            departmentByEmployeeId: departmentByEmployeeId
                        }];
            }
        });
    });
}
function PeopleEmployeesRoute() {
    var _a, _b;
    var data = (0, react_router_1.useLoaderData)();
    var location = (0, react_router_1.useLocation)();
    var isEmployeesIndex = /\/employees\/?$/.test(location.pathname);
    return (<react_1.VStack spacing={0} className="h-full">
      {isEmployeesIndex && data.isEmployeesIndex && (<People_1.EmployeesTable attributeCategories={data.attributeCategories} data={(_a = data.people) !== null && _a !== void 0 ? _a : []} count={(_b = data.count) !== null && _b !== void 0 ? _b : 0} departmentByEmployeeId={data.departmentByEmployeeId}/>)}
      <react_router_1.Outlet />
    </react_1.VStack>);
}
var templateObject_1;
