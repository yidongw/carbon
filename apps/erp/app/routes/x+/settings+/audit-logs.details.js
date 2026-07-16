"use strict";
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
exports.loader = loader;
exports.default = AuditLogDetailsRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var audit_1 = require("@carbon/database/audit");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, search, _d, limit, offset, filters, entityTypeFilter, actorIdFilter, operationFilter, result;
        var _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings"
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, filters = _d.filters;
                    entityTypeFilter = (_e = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "entityType"; })) === null || _e === void 0 ? void 0 : _e.value;
                    actorIdFilter = (_f = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "actorId"; })) === null || _f === void 0 ? void 0 : _f.value;
                    operationFilter = (_g = filters === null || filters === void 0 ? void 0 : filters.find(function (f) { return f.column === "operation"; })) === null || _g === void 0 ? void 0 : _g.value;
                    return [4 /*yield*/, (0, audit_1.getGlobalAuditLog)(client, companyId, {
                            limit: limit,
                            offset: offset,
                            search: search !== null && search !== void 0 ? search : undefined,
                            entityType: entityTypeFilter,
                            actorId: actorIdFilter,
                            operation: operationFilter
                        })];
                case 2:
                    result = _h.sent();
                    return [2 /*return*/, {
                            entries: result.data,
                            count: result.count
                        }];
            }
        });
    });
}
function AuditLogDetailsRoute() {
    var _a = (0, react_router_1.useLoaderData)(), entries = _a.entries, count = _a.count;
    var navigate = (0, react_router_1.useNavigate)();
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open) {
                navigate(path_1.path.to.auditLog);
            }
        }}>
      <react_1.DrawerContent size="full">
        <react_1.DrawerHeader>
          <react_1.DrawerTitle>
            <macro_1.Trans>All Audit Logs</macro_1.Trans>
          </react_1.DrawerTitle>
        </react_1.DrawerHeader>
        <react_1.DrawerBody className="p-0">
          <settings_1.AuditLogTable entries={entries} count={count}/>
        </react_1.DrawerBody>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
