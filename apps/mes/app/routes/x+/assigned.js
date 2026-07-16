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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.default = AssignedRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var context_1 = require("~/context");
var operations_service_1 = require("~/services/operations.service");
var durations_1 = require("~/utils/durations");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, companyId, userId, serviceRole, locationId, _d, operations, workCenters;
        var _e, _f, _g, _h;
        var context = _b.context, request = _b.request;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _j.sent(), companyId = _c.companyId, userId = _c.userId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    locationId = (_e = context.get(context_1.userContext)) === null || _e === void 0 ? void 0 : _e.locationId;
                    return [4 /*yield*/, Promise.all([
                            (0, operations_service_1.getJobOperationsAssignedToEmployee)(serviceRole, userId, companyId),
                            (0, operations_service_1.getWorkCentersByLocation)(serviceRole, locationId)
                        ])];
                case 2:
                    _d = _j.sent(), operations = _d[0], workCenters = _d[1];
                    return [2 /*return*/, {
                            operations: (_g = (_f = operations === null || operations === void 0 ? void 0 : operations.data) === null || _f === void 0 ? void 0 : _f.map(durations_1.makeDurations)) !== null && _g !== void 0 ? _g : [],
                            workCenters: (_h = workCenters === null || workCenters === void 0 ? void 0 : workCenters.data) !== null && _h !== void 0 ? _h : []
                        }];
            }
        });
    });
}
function AssignedRoute() {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_router_1.useLoaderData)(), operations = _a.operations, workCenters = _a.workCenters;
    var _b = (0, react_2.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var panelRef = (0, react_2.useRef)(null);
    var isMobile = (0, react_1.useIsMobile)();
    var operationId = (0, react_router_1.useParams)().operationId;
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (isMobile && !!operationId) {
            (_a = panelRef.current) === null || _a === void 0 ? void 0 : _a.collapse();
        }
        else {
            (_b = panelRef.current) === null || _b === void 0 ? void 0 : _b.expand();
        }
    }, [isMobile, operationId]);
    var filteredOperations = (0, react_2.useMemo)(function () {
        if (!searchTerm)
            return operations;
        var lowercasedTerm = searchTerm.toLowerCase();
        return operations.filter(function (operation) {
            var _a, _b, _c, _d;
            return ((_a = operation.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(lowercasedTerm)) ||
                ((_b = operation.jobReadableId) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(lowercasedTerm)) ||
                ((_c = operation.itemReadableId) === null || _c === void 0 ? void 0 : _c.toLowerCase().includes(lowercasedTerm)) ||
                ((_d = operation.itemDescription) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes(lowercasedTerm));
        });
    }, [operations, searchTerm]);
    var filteredOperationsByWorkCenter = (0, react_2.useMemo)(function () {
        return filteredOperations.reduce(function (acc, operation) {
            var workCenter = operation.workCenterId;
            if (!workCenter)
                return acc;
            acc[workCenter] = __spreadArray(__spreadArray([], (acc[workCenter] || []), true), [operation], false);
            return acc;
        }, {});
    }, [filteredOperations]);
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] overflow-y-scroll scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">
            <macro_1.Trans>Assigned to Me</macro_1.Trans>
          </react_1.Heading>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        <div className="w-full p-4 h-[var(--header-height)]">
          <div className="relative">
            <div className="flex justify-between gap-4">
              <div className="flex flex-grow">
                <lu_1.LuSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                <react_1.Input value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search"], ["Search"])))} className="pl-8"/>
              </div>
            </div>
          </div>
        </div>

        {Object.keys(filteredOperationsByWorkCenter).length > 0 ? (<div className="flex flex-col flex-1 mt-4">
            {Object.entries(filteredOperationsByWorkCenter).map(function (_a) {
                var _b;
                var workCenterId = _a[0], operations = _a[1];
                return (<div key={workCenterId} className="flex flex-col">
                  <div className="bg-muted px-4 py-2 border-y">
                    <h3 className="font-medium">
                      {(_b = workCenters.find(function (wc) { return wc.id === workCenterId; })) === null || _b === void 0 ? void 0 : _b.name}
                    </h3>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))] p-4 gap-4">
                    <components_1.OperationsList operations={operations}/>
                  </div>
                </div>);
            })}
          </div>) : searchTerm ? (<div className="flex flex-col flex-1 w-full h-[calc(100%-var(--header-height)*2)] items-center justify-center gap-4">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <lu_1.LuTriangleAlert className="h-6 w-6"/>
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              <macro_1.Trans>No results exist</macro_1.Trans>
            </span>
            <react_1.Button onClick={function () { return setSearchTerm(""); }}>
              <macro_1.Trans>Clear Search</macro_1.Trans>
            </react_1.Button>
          </div>) : (<div className="flex flex-col flex-1 w-full h-[calc(100%-var(--header-height)*2)] items-center justify-center gap-4">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <lu_1.LuTriangleAlert className="h-6 w-6"/>
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              <macro_1.Trans>No assigned operations</macro_1.Trans>
            </span>
          </div>)}
      </main>
    </div>);
}
var templateObject_1;
