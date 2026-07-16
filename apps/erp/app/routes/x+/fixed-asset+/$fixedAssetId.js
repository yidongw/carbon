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
exports.handle = void 0;
exports.loader = loader;
exports.default = FixedAssetDetailRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var AuditLog_1 = require("~/components/AuditLog");
var Enumerable_1 = require("~/components/Enumerable");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var accounting_1 = require("~/modules/accounting");
var FixedAssets_1 = require("~/modules/accounting/ui/FixedAssets");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: "Fixed Assets",
    to: path_1.path.to.fixedAssets
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, fixedAssetId, _c, asset, depreciationHistory, disposal, _d, _e;
        var _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "accounting"
                    })];
                case 1:
                    client = (_g.sent()).client;
                    fixedAssetId = params.fixedAssetId;
                    if (!fixedAssetId)
                        throw new Error("Could not find fixedAssetId");
                    return [4 /*yield*/, Promise.all([
                            (0, accounting_1.getFixedAsset)(client, fixedAssetId),
                            (0, accounting_1.getAssetDepreciationHistory)(client, fixedAssetId),
                            (0, accounting_1.getFixedAssetDisposal)(client, fixedAssetId)
                        ])];
                case 2:
                    _c = _g.sent(), asset = _c[0], depreciationHistory = _c[1], disposal = _c[2];
                    if (!asset.error) return [3 /*break*/, 4];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.fixedAssets];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(asset.error, "Failed to load fixed asset"))];
                case 3: throw _d.apply(void 0, _e.concat([_g.sent()]));
                case 4: return [2 /*return*/, {
                        asset: asset.data,
                        depreciationHistory: (_f = depreciationHistory.data) !== null && _f !== void 0 ? _f : [],
                        disposal: disposal.data
                    }];
            }
        });
    });
}
function FixedAssetDetailRoute() {
    var _a, _b, _c, _d, _e, _f, _g;
    var fixedAssetId = (0, react_router_1.useParams)().fixedAssetId;
    var _h = (0, react_router_1.useLoaderData)(), asset = _h.asset, depreciationHistory = _h.depreciationHistory, disposal = _h.disposal;
    var settings = (0, hooks_1.useSettings)();
    var taxDepreciationEnabled = (_a = settings.assetTaxDepreciationEnabled) !== null && _a !== void 0 ? _a : false;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var company = (0, hooks_1.useUser)().company;
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode
    });
    var deleteModal = (0, react_1.useDisclosure)();
    var auditDrawer = (0, react_1.useDisclosure)();
    if (!fixedAssetId)
        throw new Error("Could not find fixedAssetId");
    var acquisitionCost = Number(asset.acquisitionCost);
    var accumulatedDepreciation = Number(asset.accumulatedDepreciation);
    var nbv = acquisitionCost - accumulatedDepreciation;
    var depreciationPercent = acquisitionCost > 0
        ? Math.min(100, (accumulatedDepreciation / acquisitionCost) * 100)
        : 0;
    var accumulatedTaxDepreciation = Number((_b = asset.accumulatedTaxDepreciation) !== null && _b !== void 0 ? _b : 0);
    var taxNbv = acquisitionCost - accumulatedTaxDepreciation;
    var taxDepreciationPercent = acquisitionCost > 0
        ? Math.min(100, (accumulatedTaxDepreciation / acquisitionCost) * 100)
        : 0;
    var isDraft = asset.status === "Draft";
    var isActive = asset.status === "Active" || asset.status === "Fully Depreciated";
    var canUpdate = permissions.can("update", "accounting");
    return (<div className="flex h-[calc(100dvh-49px)] overflow-y-auto scrollbar-hide w-full">
      <div className="h-full p-4 pb-16 w-full max-w-5xl mx-auto space-y-4">
        {/* Main Details */}
        <react_1.Card>
          <components_1.DocumentHeader title={(_c = asset.fixedAssetId) !== null && _c !== void 0 ? _c : ""} status={<FixedAssets_1.FixedAssetStatus status={asset.status}/>} menuItems={<>
                <react_1.DropdownMenuItem onClick={auditDrawer.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuHistory />}/>
                  History
                </react_1.DropdownMenuItem>
                {isDraft && (<>
                    <react_1.DropdownMenuSeparator />
                    <react_1.DropdownMenuItem disabled={!permissions.can("delete", "accounting")} destructive onClick={deleteModal.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                      Delete
                    </react_1.DropdownMenuItem>
                  </>)}
              </>} actions={<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button variant="primary" size="md" rightIcon={<lu_1.LuChevronDown />}>
                    Actions
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuItem disabled={!canUpdate} asChild>
                    <react_router_1.Link to={path_1.path.to.fixedAssetDetails(fixedAssetId)}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                      Edit
                    </react_router_1.Link>
                  </react_1.DropdownMenuItem>
                  {isDraft && (<>
                      <react_1.DropdownMenuItem disabled={!canUpdate} asChild>
                        <react_router_1.Link to={path_1.path.to.fixedAssetRegister(fixedAssetId)}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuClipboardCheck />}/>
                          Register
                        </react_router_1.Link>
                      </react_1.DropdownMenuItem>
                      <react_1.DropdownMenuItem asChild>
                        <react_router_1.Link to={path_1.path.to.fixedAssetPurchase(fixedAssetId)}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuShoppingCart />}/>
                          Purchase
                        </react_router_1.Link>
                      </react_1.DropdownMenuItem>
                    </>)}
                  {isActive && (<>
                      <react_1.DropdownMenuItem asChild>
                        <react_router_1.Link to={path_1.path.to.fixedAssetSell(fixedAssetId)}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuStore />}/>
                          Sell
                        </react_router_1.Link>
                      </react_1.DropdownMenuItem>
                      <react_1.DropdownMenuSeparator />
                      <react_1.DropdownMenuItem disabled={!canUpdate} asChild>
                        <react_router_1.Link to={path_1.path.to.fixedAssetDispose(fixedAssetId)}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuCircleX />}/>
                          Dispose
                        </react_router_1.Link>
                      </react_1.DropdownMenuItem>
                    </>)}
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>}/>
          <react_1.CardContent className="space-y-0">
            <div className={"grid grid-cols-1 gap-3 sm:gap-0 pb-4 ".concat(taxDepreciationEnabled ? "sm:grid-cols-5" : "sm:grid-cols-3")}>
              <div className="sm:pr-6">
                <p className="text-base text-muted-foreground truncate sm:text-sm">
                  Acquisition Cost
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                  {currencyFormatter.format(acquisitionCost)}
                </p>
              </div>
              <div className="sm:border-l sm:border-border sm:px-6">
                <p className="text-base text-muted-foreground truncate sm:text-sm">
                  Accum. Depreciation
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                  {currencyFormatter.format(accumulatedDepreciation)}
                </p>
              </div>
              <div className={"sm:border-l sm:border-border ".concat(taxDepreciationEnabled ? "sm:px-6" : "sm:pl-6")}>
                <p className="text-base text-muted-foreground truncate sm:text-sm">
                  Net Book Value
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                  {currencyFormatter.format(nbv)}
                </p>
              </div>
              {taxDepreciationEnabled && (<>
                  <div className="sm:border-l sm:border-border sm:px-6">
                    <p className="text-base text-muted-foreground truncate sm:text-sm">
                      Accum. Tax Depr.
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                      {currencyFormatter.format(accumulatedTaxDepreciation)}
                    </p>
                  </div>
                  <div className="sm:border-l sm:border-border sm:pl-6">
                    <p className="text-base text-muted-foreground truncate sm:text-sm">
                      Tax Book Value
                    </p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">
                      {currencyFormatter.format(taxNbv)}
                    </p>
                  </div>
                </>)}
            </div>
            <div className="divide-y divide-border border-t border-border">
              <DetailRow label="Name">{asset.name}</DetailRow>
              <DetailRow label="Asset Class">
                <Enumerable_1.Enumerable value={(_e = (_d = asset.fixedAssetClass) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : null}/>
              </DetailRow>
              <DetailRow label="Serial Number">
                {asset.serialNumber || "—"}
              </DetailRow>
              <DetailRow label="Location">
                <Enumerable_1.Enumerable value={(_g = (_f = asset.location) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : null}/>
              </DetailRow>
              <DetailRow label="Depreciation Method">
                {asset.depreciationMethod}
              </DetailRow>
              <DetailRow label="Useful Life">
                {asset.usefulLifeMonths} months
              </DetailRow>
              <DetailRow label="Residual Value">
                {Number(asset.residualValuePercent)}%
              </DetailRow>
              {taxDepreciationEnabled && (<>
                  <DetailRow label="Tax Depreciation Method">
                    {asset.taxDepreciationMethod || "—"}
                  </DetailRow>
                  {asset.taxDepreciationMethod === "MACRS" ? (<>
                      <DetailRow label="MACRS Property Class">
                        {asset.macrsPropertyClass
                    ? "".concat(asset.macrsPropertyClass, "-Year")
                    : "—"}
                      </DetailRow>
                      <DetailRow label="MACRS Convention">
                        {asset.macrsConvention || "—"}
                      </DetailRow>
                      <DetailRow label="Bonus Depreciation">
                        {asset.bonusDepreciationPercent != null
                    ? "".concat(Number(asset.bonusDepreciationPercent), "%")
                    : "—"}
                      </DetailRow>
                    </>) : (<>
                      <DetailRow label="Tax Useful Life">
                        {asset.taxUsefulLifeMonths
                    ? "".concat(asset.taxUsefulLifeMonths, " months")
                    : "—"}
                      </DetailRow>
                      <DetailRow label="Tax Residual Value">
                        {asset.taxResidualValuePercent != null
                    ? "".concat(Number(asset.taxResidualValuePercent), "%")
                    : "—"}
                      </DetailRow>
                    </>)}
                </>)}
              <DetailRow label="Acquisition Date">
                {asset.acquisitionDate
            ? (0, utils_1.formatDate)(asset.acquisitionDate)
            : "—"}
              </DetailRow>
              <DetailRow label="Depreciation Start">
                {asset.depreciationStartDate
            ? (0, utils_1.formatDate)(asset.depreciationStartDate)
            : "—"}
              </DetailRow>
            </div>
          </react_1.CardContent>
        </react_1.Card>

        {/* Depreciation History */}
        {(depreciationHistory.length > 0 || acquisitionCost > 0) && (<react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>Depreciation</react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent className="space-y-6">
              {acquisitionCost > 0 && (<div className="space-y-4">
                  <react_1.BarProgress progress={depreciationPercent} label="Book Depreciation" value={"".concat(depreciationPercent.toFixed(1), "%")} gradient/>
                  {taxDepreciationEnabled && (<react_1.BarProgress progress={taxDepreciationPercent} label="Tax Depreciation" value={"".concat(taxDepreciationPercent.toFixed(1), "%")} gradient/>)}
                </div>)}
              {depreciationHistory.length > 0 && (<div className="overflow-x-auto -mx-6 px-6">
                  <table className="w-full text-base sm:text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2.5 sm:py-2 font-medium text-muted-foreground">
                          Run
                        </th>
                        <th className="text-left py-2.5 sm:py-2 font-medium text-muted-foreground">
                          Period End
                        </th>
                        <th className="text-left py-2.5 sm:py-2 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-right py-2.5 sm:py-2 font-medium text-muted-foreground">
                          Amount
                        </th>
                        {taxDepreciationEnabled && (<th className="text-right py-2.5 sm:py-2 font-medium text-muted-foreground">
                            Tax Amount
                          </th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {depreciationHistory.map(function (item) {
                    var _a, _b, _c, _d;
                    var run = item.depreciationRun;
                    return (<tr key={item.id} className="border-b border-border last:border-0">
                            <td className="py-3 sm:py-2.5 tabular-nums">
                              <react_router_1.Link to={path_1.path.to.depreciationRun((_a = run === null || run === void 0 ? void 0 : run.id) !== null && _a !== void 0 ? _a : item.id)} className="text-foreground hover:underline">
                                {(_b = run === null || run === void 0 ? void 0 : run.depreciationRunId) !== null && _b !== void 0 ? _b : "—"}
                              </react_router_1.Link>
                            </td>
                            <td className="py-3 sm:py-2.5">
                              {(run === null || run === void 0 ? void 0 : run.periodEnd) ? (0, utils_1.formatDate)(run.periodEnd) : "—"}
                            </td>
                            <td className="py-3 sm:py-2.5">
                              <FixedAssets_1.DepreciationRunStatus status={(_c = run === null || run === void 0 ? void 0 : run.status) !== null && _c !== void 0 ? _c : null}/>
                            </td>
                            <td className="py-3 sm:py-2.5 text-right tabular-nums">
                              {currencyFormatter.format(Number(item.amount))}
                            </td>
                            {taxDepreciationEnabled && (<td className="py-3 sm:py-2.5 text-right tabular-nums">
                                {currencyFormatter.format(Number((_d = item.taxAmount) !== null && _d !== void 0 ? _d : 0))}
                              </td>)}
                          </tr>);
                })}
                    </tbody>
                  </table>
                </div>)}
            </react_1.CardContent>
          </react_1.Card>)}

        {/* Notes */}
        <FixedAssets_1.FixedAssetNotes key={"notes-".concat(fixedAssetId)} id={fixedAssetId} notes={asset.notes}/>

        {/* Disposal */}
        {disposal && (<react_1.Card>
            <react_1.CardContent className="pt-6">
              <div className="divide-y divide-border">
                <DetailRow label="Disposal Method">
                  {disposal.disposalMethod}
                </DetailRow>
                <DetailRow label="Disposal Date">
                  {(0, utils_1.formatDate)(disposal.disposalDate)}
                </DetailRow>
                <DetailRow label="NBV at Disposal">
                  <span className="tabular-nums">
                    {currencyFormatter.format(Number(disposal.netBookValueAtDisposal))}
                  </span>
                </DetailRow>
                <DetailRow label="Sale Proceeds">
                  <span className="tabular-nums">
                    {currencyFormatter.format(Number(disposal.saleProceeds))}
                  </span>
                </DetailRow>
                <DetailRow label="Gain/Loss">
                  <react_1.Badge variant={Number(disposal.gainLoss) >= 0 ? "green" : "red"}>
                    {currencyFormatter.format(Number(disposal.gainLoss))}
                  </react_1.Badge>
                </DetailRow>
              </div>
            </react_1.CardContent>
          </react_1.Card>)}

        <react_router_1.Outlet />

        <Modals_1.ConfirmDelete action={path_1.path.to.deleteFixedAsset(fixedAssetId)} isOpen={deleteModal.isOpen} name={asset.fixedAssetId} text={"Are you sure you want to delete ".concat(asset.fixedAssetId, "? This cannot be undone.")} onCancel={deleteModal.onClose} onSubmit={function () {
            deleteModal.onClose();
            navigate(path_1.path.to.fixedAssets);
        }}/>
      </div>
      <AuditLog_1.AuditLogDrawer isOpen={auditDrawer.isOpen} onClose={auditDrawer.onClose} entityType="fixedAsset" entityId={fixedAssetId} companyId={company.id}/>
    </div>);
}
function DetailRow(_a) {
    var label = _a.label, children = _a.children;
    return (<div className="flex items-center justify-between py-3 text-base sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{children}</span>
    </div>);
}
