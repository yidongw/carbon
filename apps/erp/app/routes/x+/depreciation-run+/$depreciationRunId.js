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
exports.default = DepreciationRunDetailRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var accounting_1 = require("~/modules/accounting");
var FixedAssets_1 = require("~/modules/accounting/ui/FixedAssets");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: "Depreciation",
    to: path_1.path.to.depreciationRuns
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, depreciationRunId, _c, run, lines, _d, _e;
        var _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    depreciationRunId = params.depreciationRunId;
                    if (!depreciationRunId)
                        throw new Error("Could not find depreciationRunId");
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.getDepreciationRun)(client, depreciationRunId),
                            (0, accounting_1.getDepreciationRunLines)(client, depreciationRunId)
                        ])];
                case 2:
                    _c = _g.sent(), run = _c[0], lines = _c[1];
                    if (!run.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.depreciationRuns];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(run.error, "Failed to load depreciation run"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        run: run.data,
                        lines: (_f = lines.data) !== null && _f !== void 0 ? _f : []
                    }];
            }
        });
    });
}
function DepreciationRunDetailRoute() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var depreciationRunId = (0, react_router_1.useParams)().depreciationRunId;
    var _b = (0, react_router_1.useLoaderData)(), run = _b.run, lines = _b.lines;
    var settings = (0, hooks_1.useSettings)();
    var taxDepreciationEnabled = (_a = settings.assetTaxDepreciationEnabled) !== null && _a !== void 0 ? _a : false;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var fetcher = (0, react_router_1.useFetcher)();
    var company = (0, hooks_1.useUser)().company;
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode
    });
    var deleteModal = (0, react_1.useDisclosure)();
    var repeatModal = (0, react_1.useDisclosure)();
    if (!depreciationRunId)
        throw new Error("Could not find depreciationRunId");
    var isDraft = run.status === "Draft";
    var isPosted = run.status === "Posted";
    var totalAmount = lines.reduce(function (sum, line) { return sum + Number(line.amount); }, 0);
    var totalTaxAmount = taxDepreciationEnabled
        ? lines.reduce(function (sum, line) { var _a; return sum + Number((_a = line.taxAmount) !== null && _a !== void 0 ? _a : 0); }, 0)
        : 0;
    var gridCols = taxDepreciationEnabled
        ? "grid-cols-[auto_1fr_1fr_120px_120px_120px_120px_120px]"
        : "grid-cols-[auto_1fr_1fr_120px_120px_120px_120px]";
    return (<div className="flex h-[calc(100dvh-49px)] overflow-y-auto scrollbar-hide w-full">
      <div className="h-full p-4 pb-16 w-full max-w-5xl mx-auto">
        <react_1.Card>
          <react_1.CardHeader className="flex-row items-center justify-between">
            <react_1.HStack>
              <react_1.Heading as="h1" size="h3">
                {run.depreciationRunId}
              </react_1.Heading>
              <react_1.Copy text={run.depreciationRunId}/>
              {(isDraft || isPosted) && (<react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    {isPosted && (<react_1.DropdownMenuItem disabled={!permissions.can("create", "accounting")} onClick={repeatModal.onOpen}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuRepeat />}/>
                        Repeat Run
                      </react_1.DropdownMenuItem>)}
                    {isDraft && (<react_1.DropdownMenuItem disabled={!permissions.can("delete", "accounting")} destructive onClick={deleteModal.onOpen}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                        Delete
                      </react_1.DropdownMenuItem>)}
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>)}
              <FixedAssets_1.DepreciationRunStatus status={run.status}/>
            </react_1.HStack>
            <react_1.HStack>
              {isDraft && permissions.can("update", "accounting") && (<fetcher.Form method="post" action="post">
                  <react_1.Button variant="primary" type="submit" isLoading={fetcher.state !== "idle"}>
                    Post Run
                  </react_1.Button>
                </fetcher.Form>)}
            </react_1.HStack>
          </react_1.CardHeader>

          <react_1.CardContent>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 w-full mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Period End</p>
                <p className="text-sm">{(0, utils_1.formatDate)(run.periodEnd)}</p>
              </div>
              {run.postedAt && (<div>
                  <p className="text-sm text-muted-foreground">Posted At</p>
                  <p className="text-sm">{(0, utils_1.formatDate)(run.postedAt)}</p>
                </div>)}
            </div>

            {/* Depreciation Lines */}
            <div className="rounded-lg border border-border overflow-hidden w-full">
              {/* Column Headers */}
              <div className={"grid ".concat(gridCols, " items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground font-medium bg-muted/50 border-b border-border")}>
                <div className="w-6"/>
                <div>Asset</div>
                <div>Name</div>
                <div className="text-right">Cost</div>
                <div className="text-right">Accum. Depr.</div>
                <div className="text-right">Amount</div>
                {taxDepreciationEnabled && (<div className="text-right">Tax Amount</div>)}
                <div className="text-right">NBV After</div>
              </div>

              {/* Lines */}
              <div className="divide-y divide-border">
                {lines.length === 0 ? (<div className="px-4 py-6 text-sm text-muted-foreground text-center">
                    No assets to depreciate for this period.
                  </div>) : (lines.map(function (line, index) {
            var _a, _b, _c, _d, _e;
            var asset = line.fixedAsset;
            var cost = Number((_a = asset === null || asset === void 0 ? void 0 : asset.acquisitionCost) !== null && _a !== void 0 ? _a : 0);
            var accDepr = Number((_b = asset === null || asset === void 0 ? void 0 : asset.accumulatedDepreciation) !== null && _b !== void 0 ? _b : 0);
            var nbvAfter = cost - accDepr - Number(line.amount);
            return (<div key={line.id} className={"grid ".concat(gridCols, " items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted/30 transition-colors")}>
                        <div className="w-6 text-muted-foreground tabular-nums">
                          {index + 1}
                        </div>
                        <div>
                          {(asset === null || asset === void 0 ? void 0 : asset.id) ? (<react_router_1.Link to={path_1.path.to.fixedAsset(asset.id)} className="text-foreground hover:underline">
                              {(_c = asset.fixedAssetId) !== null && _c !== void 0 ? _c : "—"}
                            </react_router_1.Link>) : ("—")}
                        </div>
                        <div className="text-muted-foreground">
                          {(_d = asset === null || asset === void 0 ? void 0 : asset.name) !== null && _d !== void 0 ? _d : "—"}
                        </div>
                        <div className="text-right tabular-nums">
                          {currencyFormatter.format(cost)}
                        </div>
                        <div className="text-right tabular-nums">
                          {currencyFormatter.format(accDepr)}
                        </div>
                        <div className="text-right tabular-nums font-medium">
                          {currencyFormatter.format(Number(line.amount))}
                        </div>
                        {taxDepreciationEnabled && (<div className="text-right tabular-nums font-medium">
                            {currencyFormatter.format(Number((_e = line.taxAmount) !== null && _e !== void 0 ? _e : 0))}
                          </div>)}
                        <div className="text-right tabular-nums">
                          {currencyFormatter.format(nbvAfter)}
                        </div>
                      </div>);
        }))}
              </div>

              {/* Totals */}
              {lines.length > 0 && (<div className={"grid ".concat(gridCols, " items-center gap-3 px-4 py-3 bg-muted/50 border-t border-border")}>
                  <div className="w-6"/>
                  <div className="text-sm font-medium">
                    {lines.length} {lines.length === 1 ? "Asset" : "Assets"}
                  </div>
                  <div />
                  <div />
                  <div />
                  <div className="text-right font-mono text-sm tabular-nums font-medium">
                    {currencyFormatter.format(totalAmount)}
                  </div>
                  {taxDepreciationEnabled && (<div className="text-right font-mono text-sm tabular-nums font-medium">
                      {currencyFormatter.format(totalTaxAmount)}
                    </div>)}
                  <div />
                </div>)}
            </div>
          </react_1.CardContent>
        </react_1.Card>

        <react_router_1.Outlet />

        <Modals_1.ConfirmDelete action={path_1.path.to.deleteDepreciationRun(depreciationRunId)} isOpen={deleteModal.isOpen} name={run.depreciationRunId} text={"Are you sure you want to delete ".concat(run.depreciationRunId, "? This cannot be undone.")} onCancel={deleteModal.onClose} onSubmit={function () {
            deleteModal.onClose();
            navigate(path_1.path.to.depreciationRuns);
        }}/>

        <Modals_1.Confirm action={path_1.path.to.repeatDepreciationRun(depreciationRunId)} isOpen={repeatModal.isOpen} title="Repeat Run" text={"This will create a new draft depreciation run for the same period (".concat((0, utils_1.formatDate)(run.periodEnd), "), including only active assets not already covered by an existing run.")} confirmText="Create Repeat Run" onCancel={repeatModal.onClose} onSubmit={repeatModal.onClose}/>
      </div>
    </div>);
}
var templateObject_1;
