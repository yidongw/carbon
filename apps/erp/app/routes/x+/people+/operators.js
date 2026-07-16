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
exports.default = ConsoleOperatorsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var users_service_1 = require("~/modules/users/users.service");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Operators"], ["Operators"]))),
    to: path_1.path.to.operators
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, sorts, filters, _e, operators, employeeTypes, _f, _g;
        var _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "users",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, users_service_1.getConsoleOperators)(client, companyId, {
                                search: search,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            }),
                            (0, users_service_1.getEmployeeTypes)(client, companyId)
                        ])];
                case 2:
                    _e = _l.sent(), operators = _e[0], employeeTypes = _e[1];
                    if (!operators.error) return [3 /*break*/, 4];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.users];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operators.error, "Error loading console operators"))];
                case 3: throw _f.apply(void 0, _g.concat([_l.sent()]));
                case 4: return [2 /*return*/, {
                        count: (_h = operators.count) !== null && _h !== void 0 ? _h : 0,
                        operators: (_j = operators.data) !== null && _j !== void 0 ? _j : [],
                        employeeTypes: (_k = employeeTypes.data) !== null && _k !== void 0 ? _k : []
                    }];
            }
        });
    });
}
var OperatorsTable = (0, react_2.memo)(function (_a) {
    var data = _a.data, count = _a.count, employeeTypes = _a.employeeTypes;
    var t = (0, macro_2.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var params = (0, hooks_1.useUrlParams)()[0];
    var employeeTypesById = (0, react_2.useMemo)(function () {
        return employeeTypes.reduce(function (acc, type) {
            acc[type.id] = type;
            return acc;
        }, {});
    }, [employeeTypes]);
    var columns = (0, react_2.useMemo)(function () { return [
        {
            header: "Operator",
            cell: function (_a) {
                var row = _a.row;
                return (<components_1.EmployeeAvatar size="sm" employeeId={row.original.id} fallback={{
                        firstName: row.original.firstName,
                        lastName: row.original.lastName,
                        fullName: row.original.name,
                        avatarUrl: row.original.avatarUrl
                    }}/>);
            },
            meta: {
                icon: <lu_1.LuUser />
            }
        },
        {
            accessorKey: "firstName",
            header: "First Name",
            cell: function (item) { return item.getValue(); },
            meta: {
                icon: <lu_1.LuUserCheck />
            }
        },
        {
            accessorKey: "lastName",
            header: "Last Name",
            cell: function (item) { return item.getValue(); },
            meta: {
                icon: <lu_1.LuUserCheck />
            }
        },
        {
            id: "employeeTypeId",
            header: "Employee Type",
            cell: function (_a) {
                var _b, _c;
                var row = _a.row;
                return (<Enumerable_1.Enumerable value={(_c = (_b = employeeTypesById[row.original.employeeTypeId]) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : ""}/>);
            },
            meta: {
                icon: <lu_1.LuBriefcase />
            }
        },
        {
            accessorKey: "active",
            header: "Active",
            cell: function (item) { return <react_1.Checkbox isChecked={item.getValue()}/>; },
            meta: {
                filter: {
                    type: "static",
                    options: [
                        { value: "true", label: "Active" },
                        { value: "false", label: "Inactive" }
                    ]
                },
                icon: <lu_1.LuToggleRight />
            }
        }
    ]; }, [employeeTypesById]);
    var renderContextMenu = (0, react_2.useCallback)(function (row) { return (<>
          <react_1.MenuItem onClick={function () {
            return navigate("".concat(path_1.path.to.operatorResetPin(row.id), "?").concat(params.toString()));
        }} disabled={!permissions.can("update", "users")}>
            <react_1.MenuIcon icon={<lu_1.LuKey />}/>
            Reset PIN
          </react_1.MenuItem>
          <react_1.MenuItem onClick={function () {
            return navigate("".concat(path_1.path.to.operator(row.id), "?").concat(params.toString()));
        }} disabled={!permissions.can("update", "users")}>
            <react_1.MenuIcon icon={<lu_1.LuUser />}/>
            Convert to Full User
          </react_1.MenuItem>
        </>); }, [navigate, params, permissions]);
    return (<components_1.Table count={count} columns={columns} data={data} primaryAction={permissions.can("create", "users") && (<components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Operator"], ["Operator"])))} to={"new?".concat(params.toString())}/>)} renderContextMenu={renderContextMenu} title="Operators"/>);
});
OperatorsTable.displayName = "OperatorsTable";
function ConsoleOperatorsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, operators = _a.operators, employeeTypes = _a.employeeTypes;
    return (<>
      <OperatorsTable data={operators} count={count} employeeTypes={employeeTypes}/>
      <react_router_1.Outlet />
    </>);
}
var templateObject_1, templateObject_2;
