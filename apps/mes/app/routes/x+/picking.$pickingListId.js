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
exports.default = PickingExecutionRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var ItemThumbnail_1 = require("~/components/ItemThumbnail");
var PickingListStatus_1 = require("~/components/PickingListStatus");
var ShortPickModal_1 = require("~/components/ShortPickModal");
var inventory_service_1 = require("~/services/inventory.service");
var models_1 = require("~/services/models");
var picking_service_1 = require("~/services/picking.service");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, pickingListId, result;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    client = (_c.sent()).client;
                    pickingListId = params.pickingListId;
                    return [4 /*yield*/, (0, picking_service_1.getPickingListForExecution)(client, pickingListId)];
                case 2:
                    result = _c.sent();
                    if (result.error || !result.data) {
                        throw new Response("Picking list not found", { status: 404 });
                    }
                    return [2 /*return*/, {
                            pickingList: result.data,
                            // Deferred (not awaited): recommended serial/batch lots per line, streamed in
                            // after the list paints so the at-a-glance subtext never blocks first render.
                            recommendations: (0, inventory_service_1.getPickingListRecommendations)(client, pickingListId)
                        }];
            }
        });
    });
}
function PickingExecutionRoute() {
    var _a;
    var _b = (0, react_router_1.useLoaderData)(), pickingList = _b.pickingList, recommendations = _b.recommendations;
    var lines = (_a = pickingList.lines) !== null && _a !== void 0 ? _a : [];
    var isLocked = (0, models_1.isPickingListLocked)(pickingList.status);
    var kits = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var groups = new Map();
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i];
            var key = (_a = line.jobOperationId) !== null && _a !== void 0 ? _a : "ungrouped";
            if (!groups.has(key)) {
                groups.set(key, {
                    key: key,
                    jobReadableId: (_c = (_b = line.job) === null || _b === void 0 ? void 0 : _b.jobId) !== null && _c !== void 0 ? _c : null,
                    operationName: (_f = (_e = (_d = line.jobOperation) === null || _d === void 0 ? void 0 : _d.process) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : null,
                    workCenterName: (_j = (_h = (_g = line.jobOperation) === null || _g === void 0 ? void 0 : _g.workCenter) === null || _h === void 0 ? void 0 : _h.name) !== null && _j !== void 0 ? _j : null,
                    lines: []
                });
            }
            groups.get(key).lines.push(line);
        }
        return Array.from(groups.values()).sort(function (a, b) {
            var _a, _b, _c, _d;
            var job = ((_a = a.jobReadableId) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.jobReadableId) !== null && _b !== void 0 ? _b : "");
            if (job !== 0)
                return job;
            return ((_c = a.operationName) !== null && _c !== void 0 ? _c : "").localeCompare((_d = b.operationName) !== null && _d !== void 0 ? _d : "");
        });
    }, [lines]);
    var completedCount = lines.filter(function (l) { return isLineResolved(l); }).length;
    return (<div className="flex flex-col flex-1">
      <header className="sticky top-0 z-10 flex h-[var(--header-height)] shrink-0 items-center justify-between gap-2 border-b bg-background">
        <div className="flex items-center gap-2 px-2">
          <react_1.SidebarTrigger className="md:hidden"/>
          <react_1.Heading size="h4">{pickingList.pickingListId}</react_1.Heading>
          <PickingListStatus_1.PickingListStatus status={pickingList.status}/>
        </div>
        <div className="flex items-center gap-3 px-3">
          <span className="text-sm text-muted-foreground tabular-nums">
            {completedCount}/{lines.length} <macro_1.Trans>lines</macro_1.Trans>
          </span>
          <PickingListControls pickingListId={pickingList.id} status={pickingList.status}/>
        </div>
      </header>

      <main className="h-[calc(100dvh-var(--header-height))] w-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent p-4">
        <div className="w-full max-w-5xl mx-auto pb-16">
          <react_1.VStack spacing={4} className="w-full">
            {kits.map(function (kit) { return (<PickingKitCard key={kit.key} kit={kit} pickingListId={pickingList.id} isLocked={isLocked} recommendations={recommendations}/>); })}
          </react_1.VStack>
        </div>
      </main>
    </div>);
}
function PickingListControls(_a) {
    var pickingListId = _a.pickingListId, status = _a.status;
    var fetcher = (0, react_router_1.useFetcher)();
    var isSubmitting = fetcher.state !== "idle";
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.data && fetcher.data.success === false) {
            react_1.toast.error((_a = fetcher.data.message) !== null && _a !== void 0 ? _a : "Failed to update status");
        }
    }, [fetcher.data]);
    var setStatus = function (next) {
        var formData = new FormData();
        formData.append("status", next);
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.pickingStatus(pickingListId)
        });
    };
    if (status === "Completed" || status === "Cancelled")
        return null;
    return (<react_1.HStack spacing={2}>
      {status === "Draft" && (<react_1.Button size="md" leftIcon={<lu_1.LuPlay />} isLoading={isSubmitting} isDisabled={isSubmitting} onClick={function () { return setStatus("In Progress"); }}>
          <macro_1.Trans>Start</macro_1.Trans>
        </react_1.Button>)}
      {status === "In Progress" && (<react_1.Button size="md" variant="secondary" leftIcon={<lu_1.LuCheck />} isLoading={isSubmitting} isDisabled={isSubmitting} onClick={function () { return setStatus("Completed"); }}>
          <macro_1.Trans>Finish</macro_1.Trans>
        </react_1.Button>)}
    </react_1.HStack>);
}
function isLineResolved(line) {
    var _a, _b, _c;
    if (line.status === "Short" || line.status === "Cancelled")
        return true;
    return (Number((_a = line.quantityToPick) !== null && _a !== void 0 ? _a : 0) > 0 &&
        Number((_b = line.quantityPicked) !== null && _b !== void 0 ? _b : 0) >= Number((_c = line.quantityToPick) !== null && _c !== void 0 ? _c : 0));
}
function PickingKitCard(_a) {
    var _b;
    var kit = _a.kit, pickingListId = _a.pickingListId, isLocked = _a.isLocked, recommendations = _a.recommendations;
    var totalToPick = kit.lines.reduce(function (sum, l) { var _a; return sum + Number((_a = l.quantityToPick) !== null && _a !== void 0 ? _a : 0); }, 0);
    var totalPicked = kit.lines.reduce(function (sum, l) {
        var _a, _b;
        return sum +
            Math.min(Number((_a = l.quantityPicked) !== null && _a !== void 0 ? _a : 0), Number((_b = l.quantityToPick) !== null && _b !== void 0 ? _b : 0));
    }, 0);
    var progress = totalToPick > 0 ? (totalPicked / totalToPick) * 100 : 0;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          {(_b = kit.jobReadableId) !== null && _b !== void 0 ? _b : "Unknown Job"}
          {kit.operationName ? " \u00B7 ".concat(kit.operationName) : ""}
        </react_1.CardTitle>
        {kit.workCenterName && (<react_1.CardDescription>
            <Enumerable_1.Enumerable value={kit.workCenterName}/>
          </react_1.CardDescription>)}
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.BarProgress progress={progress} className="mb-4"/>
        <div className="border rounded-lg">
          {kit.lines.map(function (line, index) { return (<PickLineItem key={line.id} line={line} pickingListId={pickingListId} isLast={index === kit.lines.length - 1} isLocked={isLocked} recommendations={recommendations}/>); })}
        </div>
      </react_1.CardContent>
    </react_1.Card>);
}
function PickLineItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var line = _a.line, pickingListId = _a.pickingListId, isLast = _a.isLast, isLocked = _a.isLocked, recommendations = _a.recommendations;
    var items = (0, stores_1.useItems)()[0];
    var fetcher = (0, react_router_1.useFetcher)();
    var isSubmitting = fetcher.state !== "idle";
    var _u = (0, react_2.useState)(false), shortOpen = _u[0], setShortOpen = _u[1];
    var _v = (0, react_2.useState)(false), pickerOpen = _v[0], setPickerOpen = _v[1];
    var trackedFetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.data && fetcher.data.success === false) {
            react_1.toast.error((_a = fetcher.data.message) !== null && _a !== void 0 ? _a : "Failed to update pick line");
        }
    }, [fetcher.data]);
    var lineItem = line.item;
    var item = items.find(function (i) { return i.id === line.itemId; });
    var itemName = (_c = (_b = item === null || item === void 0 ? void 0 : item.name) !== null && _b !== void 0 ? _b : lineItem === null || lineItem === void 0 ? void 0 : lineItem.name) !== null && _c !== void 0 ? _c : "";
    var source = (_d = line.storageUnit) === null || _d === void 0 ? void 0 : _d.name;
    var availableQuantity = Number((_e = line.availableQuantity) !== null && _e !== void 0 ? _e : 0);
    var isShortStock = availableQuantity <= 0;
    var quantityToPick = Number((_f = line.quantityToPick) !== null && _f !== void 0 ? _f : 0);
    var quantityPicked = Number((_g = line.quantityPicked) !== null && _g !== void 0 ? _g : 0);
    var isTracked = (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" || (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch";
    // Only lots actually PICKED (quantityPicked > 0) count as picked, not mere
    // allocations.
    var pickedLots = ((_h = line.trackedEntities) !== null && _h !== void 0 ? _h : []).filter(function (t) { var _a; return Number((_a = t.quantityPicked) !== null && _a !== void 0 ? _a : 0) > 0; });
    var isFullyPicked = quantityToPick > 0 && quantityPicked >= quantityToPick;
    var isShort = line.status === "Short";
    var isCancelled = line.status === "Cancelled";
    var isResolved = isFullyPicked || isShort || isCancelled;
    var pick = function (quantity) {
        var formData = new FormData();
        formData.append("pickingListLineId", line.id);
        formData.append("quantity", String(quantity));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.pickingLineQuantity(pickingListId)
        });
    };
    var openPicker = function () {
        setPickerOpen(true);
        trackedFetcher.load(path_1.path.to.pickingTracked(pickingListId, line.id));
    };
    var pickTracked = function (selection) {
        var formData = new FormData();
        formData.append("trackedEntityId", selection.trackedEntityId);
        formData.append("quantity", String(selection.quantity));
        if (selection.storageUnitId) {
            formData.append("fromStorageUnitId", selection.storageUnitId);
        }
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.pickingTracked(pickingListId, line.id)
        });
        setPickerOpen(false);
    };
    var unpickTracked = function (trackedEntityId) {
        var formData = new FormData();
        formData.append("trackedEntityId", trackedEntityId);
        formData.append("unpick", "true");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.pickingTracked(pickingListId, line.id)
        });
    };
    var quantityBadge = isTracked ? (<react_1.Badge className={(0, react_1.cn)("text-white text-base tabular-nums", isFullyPicked
            ? "bg-emerald-600"
            : quantityPicked > 0
                ? "bg-orange-500"
                : "bg-red-600")}>
      {quantityPicked}/{quantityToPick}
    </react_1.Badge>) : (<react_1.Count count={isShort ? quantityPicked : quantityToPick} className={(0, react_1.cn)("text-white text-base tabular-nums", isFullyPicked
            ? "bg-emerald-600"
            : isShort
                ? "bg-orange-500"
                : "bg-red-600")}/>);
    return (<div className={(0, react_1.cn)("flex flex-col gap-4 p-4 border-b transition-opacity duration-150", "sm:flex-row sm:items-center sm:justify-between sm:gap-6", isLast && "border-none", isResolved && "opacity-60 hover:opacity-100")}>
      {/* Identity — item, part number, suggested lots, and (mobile) the count */}
      <div className="flex items-start justify-between gap-4 min-w-0 sm:flex-1">
        <react_1.HStack spacing={4} className="min-w-0">
          <ItemThumbnail_1.default size="xl" thumbnailPath={null} type={(_j = item === null || item === void 0 ? void 0 : item.type) !== null && _j !== void 0 ? _j : "Part"}/>
          <react_1.VStack spacing={1} className="min-w-0">
            <p className="truncate text-base font-medium">{itemName}</p>
            <p className="truncate font-mono text-sm text-muted-foreground">
              {(_k = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _k !== void 0 ? _k : lineItem === null || lineItem === void 0 ? void 0 : lineItem.readableId}
            </p>
            {isTracked && !isFullyPicked && (<RecommendedLots resolve={recommendations} lineId={line.id}/>)}
          </react_1.VStack>
        </react_1.HStack>
        <div className="shrink-0 sm:hidden">{quantityBadge}</div>
      </div>

      {/* Controls — source, count (desktop), and pick actions */}
      <div className="flex items-center justify-end gap-3 sm:gap-6 sm:shrink-0">
        {source ? (<div className="text-base font-medium whitespace-nowrap">
            {source}
          </div>) : isShortStock && !isFullyPicked ? (<react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <react_1.Badge variant="yellow" className="gap-1 py-2 px-3 text-sm cursor-default">
                <lu_1.LuTriangleAlert />
                <macro_1.Trans>No stock</macro_1.Trans>
              </react_1.Badge>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent className="max-w-[260px]">
              <macro_1.Trans>
                No warehouse stock is on record for this item. You can still
                pick it — on-hand will go negative until the count is
                reconciled.
              </macro_1.Trans>
            </react_1.TooltipContent>
          </react_1.Tooltip>) : null}
        <div className="hidden sm:block">{quantityBadge}</div>
        {isLocked ? (isCancelled ? (<react_1.Badge variant="red">
              <macro_1.Trans>Cancelled</macro_1.Trans>
            </react_1.Badge>) : null) : isCancelled ? (<react_1.Badge variant="red">
            <macro_1.Trans>Cancelled</macro_1.Trans>
          </react_1.Badge>) : isTracked ? (<react_1.HStack spacing={1} className="flex-1 justify-end sm:flex-none">
            {pickedLots.length === 1 ? (<react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuUndo2 />} onClick={function () { return unpickTracked(pickedLots[0].trackedEntityId); }} isDisabled={isSubmitting} className="flex-1 sm:flex-none">
                {((_l = pickedLots[0].trackedEntity) === null || _l === void 0 ? void 0 : _l.readableId) ? (<macro_1.Trans>Unpick {pickedLots[0].trackedEntity.readableId}</macro_1.Trans>) : (<macro_1.Trans>Unpick</macro_1.Trans>)}
              </react_1.Button>) : pickedLots.length > 1 ? (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuUndo2 />} rightIcon={<lu_1.LuChevronDown />} isDisabled={isSubmitting} className="flex-1 sm:flex-none">
                    <macro_1.Trans>Unpick</macro_1.Trans>
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  {pickedLots.map(function (lot) {
                    var _a, _b;
                    return (<react_1.DropdownMenuItem key={lot.trackedEntityId} onClick={function () { return unpickTracked(lot.trackedEntityId); }}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuUndo2 />}/>
                      {(_b = (_a = lot.trackedEntity) === null || _a === void 0 ? void 0 : _a.readableId) !== null && _b !== void 0 ? _b : lot.trackedEntityId}
                    </react_1.DropdownMenuItem>);
                })}
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>) : null}
            {!isFullyPicked && (<react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuQrCode />} onClick={openPicker} isDisabled={isSubmitting} className="flex-1 sm:flex-none">
                <macro_1.Trans>Scan</macro_1.Trans>
              </react_1.Button>)}
          </react_1.HStack>) : isFullyPicked ? (<react_1.Button size="lg" variant="secondary" leftIcon={<lu_1.LuUndo2 />} onClick={function () { return pick(0); }} isLoading={isSubmitting} isDisabled={isSubmitting} className="flex-1 sm:flex-none">
            <macro_1.Trans>Unpick</macro_1.Trans>
          </react_1.Button>) : (<react_1.HStack spacing={1} className="flex-1 justify-end sm:flex-none">
            <react_1.Button size="lg" variant="secondary" onClick={function () { return setShortOpen(true); }} isDisabled={isSubmitting} className="flex-1 sm:flex-none">
              <macro_1.Trans>Short</macro_1.Trans>
            </react_1.Button>
            <react_1.Button size="lg" leftIcon={<lu_1.LuCirclePlus />} onClick={function () { return pick(quantityToPick); }} isLoading={isSubmitting} isDisabled={isSubmitting} className="flex-1 sm:flex-none">
              <macro_1.Trans>Pick</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>)}
      </div>

      {shortOpen && (<ShortPickModal_1.ShortPickModal pickingListId={pickingListId} lineId={line.id} itemName={itemName} quantityToPick={quantityToPick} quantityPicked={quantityPicked} onClose={function () { return setShortOpen(false); }}/>)}

      {pickerOpen && (<react_1.TrackedEntityPicker size="lg" trackingType={(item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" ? "Serial" : "Batch"} entities={(_o = (_m = trackedFetcher.data) === null || _m === void 0 ? void 0 : _m.entities) !== null && _o !== void 0 ? _o : []} quantityRequired={Math.max(0, quantityToPick - quantityPicked)} title={"Pick ".concat(itemName)} description="Choose a lot to pick — expiring/oldest first." nearExpiryWarningDays={(_q = (_p = trackedFetcher.data) === null || _p === void 0 ? void 0 : _p.nearExpiryWarningDays) !== null && _q !== void 0 ? _q : 0} expiredEntityPolicy={(_s = (_r = trackedFetcher.data) === null || _r === void 0 ? void 0 : _r.expiredEntityPolicy) !== null && _s !== void 0 ? _s : "Warn"} defaultOrder={(_t = trackedFetcher.data) === null || _t === void 0 ? void 0 : _t.defaultOrder} onSelect={pickTracked} onClose={function () { return setPickerOpen(false); }}/>)}
    </div>);
}
/**
 * At-a-glance recommended serial/batch numbers for a tracked line, streamed in
 * from the deferred list-wide recommendations so the row paints immediately.
 * Rendered as large, touch-readable monospace chips, no label — the chips
 * speak for themselves.
 */
function RecommendedLots(_a) {
    var resolve = _a.resolve, lineId = _a.lineId;
    return (<react_2.Suspense fallback={<react_1.Skeleton className="mt-2 h-8 w-44 rounded-md"/>}>
      <react_router_1.Await resolve={resolve} errorElement={null}>
        {function (byLine) {
            var _a;
            var lots = (_a = byLine === null || byLine === void 0 ? void 0 : byLine[lineId]) !== null && _a !== void 0 ? _a : [];
            if (lots.length === 0)
                return null;
            return (<div className="mt-2 flex min-w-0 flex-wrap items-center gap-2 text-base">
              {lots.map(function (lot) {
                    var _a;
                    return (<span key={lot.trackedEntityId} className="max-w-full truncate rounded-md border border-border bg-background px-3 py-1 font-mono tabular-nums text-foreground shadow-sm">
                  {(_a = lot.readableId) !== null && _a !== void 0 ? _a : lot.trackedEntityId}
                </span>);
                })}
            </div>);
        }}
      </react_router_1.Await>
    </react_2.Suspense>);
}
