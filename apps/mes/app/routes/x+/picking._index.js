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
exports.default = PickingIndexRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var PickingListStatus_1 = require("~/components/PickingListStatus");
var context_1 = require("~/context");
var picking_service_1 = require("~/services/picking.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, effectiveUserId, pickingLists;
        var _d, _e, _f;
        var context = _b.context, request = _b.request;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _g.sent(), client = _c.client, userId = _c.userId;
                    effectiveUserId = (_e = (_d = context.get(context_1.userContext)) === null || _d === void 0 ? void 0 : _d.effectiveUserId) !== null && _e !== void 0 ? _e : userId;
                    return [4 /*yield*/, (0, picking_service_1.getAssignedPickingLists)(client, effectiveUserId)];
                case 2:
                    pickingLists = _g.sent();
                    return [2 /*return*/, {
                            pickingLists: (_f = pickingLists.data) !== null && _f !== void 0 ? _f : []
                        }];
            }
        });
    });
}
function PickingIndexRoute() {
    var pickingLists = (0, react_router_1.useLoaderData)().pickingLists;
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">
            <macro_1.Trans>Picking</macro_1.Trans>
          </react_1.Heading>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent">
        {pickingLists.length > 0 ? (<div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,330px),1fr))] p-4 gap-4">
            {pickingLists.map(function (pl) {
                var _a, _b;
                var lineCount = Number((_a = pl.lineCount) !== null && _a !== void 0 ? _a : 0);
                var completedLineCount = Number((_b = pl.completedLineCount) !== null && _b !== void 0 ? _b : 0);
                var progress = lineCount > 0
                    ? Math.round((completedLineCount / lineCount) * 100)
                    : 0;
                return (<react_router_1.Link key={pl.id} to={path_1.path.to.pickingDetail(pl.id)} className="no-underline">
                  <react_1.Card className="hover:border-primary transition-colors cursor-pointer">
                    <react_1.CardHeader className="pb-2">
                      <react_1.HStack className="justify-between">
                        <react_1.CardTitle className="text-base">
                          {pl.pickingListId}
                        </react_1.CardTitle>
                        <PickingListStatus_1.PickingListStatus status={pl.status}/>
                      </react_1.HStack>
                    </react_1.CardHeader>
                    <react_1.CardContent>
                      <react_1.VStack className="gap-1">
                        <react_1.HStack className="justify-between text-sm">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Location</macro_1.Trans>
                          </span>
                          <span>{pl.locationName}</span>
                        </react_1.HStack>
                        {pl.dueDate && (<react_1.HStack className="justify-between text-sm">
                            <span className="text-muted-foreground">
                              <macro_1.Trans>Due Date</macro_1.Trans>
                            </span>
                            <span>
                              {new Date(pl.dueDate).toLocaleDateString()}
                            </span>
                          </react_1.HStack>)}
                        <react_1.HStack className="justify-between text-sm">
                          <span className="text-muted-foreground">
                            <macro_1.Trans>Progress</macro_1.Trans>
                          </span>
                          <span>
                            {completedLineCount}/{lineCount} · {progress}%
                          </span>
                        </react_1.HStack>
                      </react_1.VStack>
                    </react_1.CardContent>
                  </react_1.Card>
                </react_router_1.Link>);
            })}
          </div>) : (<div className="flex flex-col flex-1 w-full h-[calc(100%-var(--header-height))] items-center justify-center gap-4">
            <div className="flex justify-center items-center h-12 w-12 rounded-full bg-foreground text-background">
              <lu_1.LuTriangleAlert className="h-6 w-6"/>
            </div>
            <span className="text-xs font-mono font-light text-foreground uppercase">
              <macro_1.Trans>No picking lists assigned</macro_1.Trans>
            </span>
          </div>)}
      </main>
    </div>);
}
