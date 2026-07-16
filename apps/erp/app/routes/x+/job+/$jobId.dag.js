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
exports.default = JobDagRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var production_1 = require("~/modules/production");
var Jobs_1 = require("~/modules/production/ui/Jobs");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, jobId, job, _c, _d, _e, operations, dependencies, _f, _g;
        var _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee"
                    })];
                case 1:
                    client = (_k.sent()).client;
                    jobId = params.jobId;
                    if (!jobId)
                        throw new Error("Could not find jobId");
                    return [4 /*yield*/, (0, production_1.getJob)(client, jobId)];
                case 2:
                    job = _k.sent();
                    if (!job.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(job.error, "Failed to fetch job"))];
                case 3: throw _c.apply(void 0, _d.concat([_k.sent()]));
                case 4: return [4 /*yield*/, Promise.all([
                        (0, production_1.getJobOperations)(client, jobId),
                        (0, production_1.getJobOperationDependencies)(client, jobId)
                    ])];
                case 5:
                    _e = _k.sent(), operations = _e[0], dependencies = _e[1];
                    if (!operations.error) return [3 /*break*/, 7];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.jobs];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(operations.error, "Failed to fetch job operations"))];
                case 6: throw _f.apply(void 0, _g.concat([_k.sent()]));
                case 7: return [2 /*return*/, {
                        operations: (_h = operations.data) !== null && _h !== void 0 ? _h : [],
                        dependencies: (_j = dependencies.data) !== null && _j !== void 0 ? _j : []
                    }];
            }
        });
    });
}
function JobDagRoute() {
    var _a = (0, react_router_1.useLoaderData)(), operations = _a.operations, dependencies = _a.dependencies;
    var setIsExplorerCollapsed = (0, Layout_1.usePanels)().setIsExplorerCollapsed;
    (0, react_1.useMount)(function () {
        setIsExplorerCollapsed(true);
    });
    return (<react_1.VStack spacing={0} className="h-[calc(100dvh-99px)]">
      <Jobs_1.JobDag operations={operations} dependencies={dependencies}/>
    </react_1.VStack>);
}
