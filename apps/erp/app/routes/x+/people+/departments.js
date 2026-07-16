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
exports.default = Route;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var people_1 = require("~/modules/people");
var Departments_1 = require("~/modules/people/ui/Departments");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Departments"], ["Departments"]))),
    to: path_1.path.to.departments
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, departments, _d, _e;
        var _f;
        var request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, people_1.getDepartmentsTree)(client, companyId)];
                case 2:
                    departments = _g.sent();
                    if (!departments.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.people];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(departments.error, "Failed to load departments"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        departments: (_f = departments.data) !== null && _f !== void 0 ? _f : []
                    }];
            }
        });
    });
}
function Route() {
    var t = (0, macro_2.useLingui)().t;
    var departments = (0, react_router_1.useLoaderData)().departments;
    var navigate = (0, react_router_1.useNavigate)();
    var handleEdit = (0, react_2.useCallback)(function (id) {
        navigate(path_1.path.to.department(id));
    }, [navigate]);
    var handleDelete = (0, react_2.useCallback)(function (id) {
        navigate(path_1.path.to.deleteDepartment(id));
    }, [navigate]);
    var handleAddChild = (0, react_2.useCallback)(function (parentId) {
        navigate("".concat(path_1.path.to.newDepartment, "?parentDepartmentId=").concat(parentId));
    }, [navigate]);
    return (<react_1.Tabs defaultValue="tree" className="w-full">
      <div className="flex px-4 py-3 items-center space-x-4 justify-between bg-card border-b border-border w-full">
        <react_1.Heading size="h3">
          <macro_2.Trans>Departments</macro_2.Trans>
        </react_1.Heading>
        <react_1.HStack>
          <react_1.TabsList>
            <react_1.TabsTrigger value="tree">
              <macro_2.Trans>Tree View</macro_2.Trans>
            </react_1.TabsTrigger>
            <react_1.TabsTrigger value="list">
              <macro_2.Trans>List View</macro_2.Trans>
            </react_1.TabsTrigger>
          </react_1.TabsList>
          <components_1.New label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Department"], ["Department"])))} to={path_1.path.to.newDepartment} variant="primary"/>
        </react_1.HStack>
      </div>

      <react_1.TabsContent value="tree">
        <Departments_1.DepartmentsTreeView departments={departments} onEdit={handleEdit} onDelete={handleDelete} onAddChild={handleAddChild}/>
      </react_1.TabsContent>

      <react_1.TabsContent value="list">
        <Departments_1.DepartmentsListView departments={departments} onEdit={handleEdit} onDelete={handleDelete} onAddChild={handleAddChild}/>
      </react_1.TabsContent>

      <react_router_1.Outlet />
    </react_1.Tabs>);
}
var templateObject_1, templateObject_2;
