"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var ShortPickModal_1 = require("./ShortPickModal");
var PickingListLines = function (_a) {
    var pickingListLines = _a.pickingListLines, pickingListId = _a.pickingListId, pickingList = _a.pickingList, recommendations = _a.recommendations;
    var isLocked = (0, inventory_models_1.isPickingListLocked)(pickingList === null || pickingList === void 0 ? void 0 : pickingList.status);
    var kits = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var groups = new Map();
        for (var _i = 0, pickingListLines_1 = pickingListLines; _i < pickingListLines_1.length; _i++) {
            var line = pickingListLines_1[_i];
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
    }, [pickingListLines]);
    if (kits.length === 0) {
        return (<react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Picking Lines</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <div className="border rounded-lg">
            <components_1.Empty className="py-6"/>
          </div>
        </react_1.CardContent>
      </react_1.Card>);
    }
    return (<react_1.VStack spacing={4} className="w-full">
      {kits.map(function (kit) { return (<PickingKitCard key={kit.key} kit={kit} pickingListId={pickingListId} isLocked={isLocked} recommendations={recommendations}/>); })}
    </react_1.VStack>);
};
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
          {kit.lines.map(function (line, index) { return (<PickingListLineItem key={line.id} line={line} pickingListId={pickingListId} isLast={index === kit.lines.length - 1} isLocked={isLocked} recommendations={recommendations}/>); })}
        </div>
      </react_1.CardContent>
    </react_1.Card>);
}
function PickingListLineItem(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
    var line = _a.line, pickingListId = _a.pickingListId, isLast = _a.isLast, isLocked = _a.isLocked, recommendations = _a.recommendations;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var items = (0, stores_1.useItems)()[0];
    var fetcher = (0, react_router_1.useFetcher)();
    var isPending = fetcher.state !== "idle";
    var _w = (0, react_2.useState)(false), shortOpen = _w[0], setShortOpen = _w[1];
    var _x = (0, react_2.useState)(false), pickerOpen = _x[0], setPickerOpen = _x[1];
    var trackedFetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.data && fetcher.data.success === false) {
            react_1.toast.error((_a = fetcher.data.message) !== null && _a !== void 0 ? _a : "Failed to pick line");
        }
    }, [fetcher.data]);
    var openPicker = function () {
        setPickerOpen(true);
        trackedFetcher.load(path_1.path.to.pickingListTracked(pickingListId, line.id));
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
            action: path_1.path.to.pickingListTracked(pickingListId, line.id)
        });
        setPickerOpen(false);
    };
    var unpickTracked = function (trackedEntityId) {
        var formData = new FormData();
        formData.append("trackedEntityId", trackedEntityId);
        formData.append("unpick", "true");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.pickingListTracked(pickingListId, line.id)
        });
    };
    var item = items.find(function (i) { return i.id === line.itemId; });
    var itemName = (_d = (_b = item === null || item === void 0 ? void 0 : item.name) !== null && _b !== void 0 ? _b : (_c = line.item) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "";
    var quantityToPick = Number((_e = line.quantityToPick) !== null && _e !== void 0 ? _e : 0);
    var quantityPicked = Number((_f = line.quantityPicked) !== null && _f !== void 0 ? _f : 0);
    var isPicked = quantityToPick > 0 && quantityPicked >= quantityToPick;
    var isShort = line.status === "Short";
    var isResolved = isPicked || isShort;
    var isTracked = (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" || (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch";
    var source = (_g = line.storageUnit) === null || _g === void 0 ? void 0 : _g.name;
    // Warehouse on-hand available (incl. the unassigned/null bin). A null source
    // bin is NOT a shortage if there's on-hand sitting in the unassigned bin.
    var availableQuantity = Number((_h = line.availableQuantity) !== null && _h !== void 0 ? _h : 0);
    var isShortStock = availableQuantity <= 0;
    // Only lots that were actually PICKED (quantityPicked > 0) count as picked —
    // not mere allocations.
    var pickedLots = ((_j = line.trackedEntities) !== null && _j !== void 0 ? _j : []).filter(function (t) { var _a; return Number((_a = t.quantityPicked) !== null && _a !== void 0 ? _a : 0) > 0; });
    var canPick = permissions.can("update", "inventory");
    var pick = function (quantity) {
        var formData = new FormData();
        formData.append("pickingListLineId", line.id);
        formData.append("quantity", String(quantity));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.pickingListLineQuantity(pickingListId)
        });
    };
    return (<div className={(0, react_1.cn)("group flex items-center justify-between gap-6 p-4 border-b", isLast && "border-none")}>
      <react_1.HStack spacing={4} className={(0, react_1.cn)("min-w-0 flex-1 transition-opacity duration-150", isResolved && "opacity-50 group-hover:opacity-100")}>
        <components_1.ItemThumbnail size="xl" thumbnailPath={null} type={(_k = item === null || item === void 0 ? void 0 : item.type) !== null && _k !== void 0 ? _k : "Part"}/>
        <react_1.VStack spacing={0} className="min-w-0">
          <p className="truncate text-base font-medium sm:text-sm">
            {itemName}
          </p>
          <p className="truncate font-mono text-sm text-muted-foreground sm:text-xs">
            {(_l = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _l !== void 0 ? _l : (_m = line.item) === null || _m === void 0 ? void 0 : _m.readableId}
          </p>
          {isTracked && !isPicked && (<RecommendedLots resolve={recommendations} lineId={line.id}/>)}
        </react_1.VStack>
      </react_1.HStack>

      <react_1.HStack spacing={6} className="shrink-0">
        {source ? (<div className="text-base font-medium whitespace-nowrap">
            {source}
          </div>) : isShortStock && !isPicked ? (<react_1.Tooltip>
            <react_1.TooltipTrigger asChild>
              <react_1.Badge variant="yellow" className="gap-1 py-1.5 px-2.5 cursor-default">
                <lu_1.LuTriangleAlert />
                <macro_1.Trans>No stock</macro_1.Trans>
              </react_1.Badge>
            </react_1.TooltipTrigger>
            <react_1.TooltipContent className="max-w-[240px]">
              <macro_1.Trans>
                No warehouse stock is on record for this item. You can still
                pick it — on-hand will go negative until the count is
                reconciled.
              </macro_1.Trans>
            </react_1.TooltipContent>
          </react_1.Tooltip>) : null}
        {isTracked ? (<react_1.Badge variant={isPicked ? "green" : quantityPicked > 0 ? "orange" : "red"} className="text-base tabular-nums">
            {quantityPicked}/{quantityToPick}
          </react_1.Badge>) : (<react_1.Count count={isShort ? quantityPicked : quantityToPick} variant={isPicked ? "green" : isShort ? "orange" : "red"} className="text-base tabular-nums"/>)}
        {isLocked ? null : isTracked ? (<react_1.HStack spacing={1}>
            {pickedLots.length === 1 ? (<react_1.Button variant="secondary" leftIcon={<lu_1.LuUndo2 />} isDisabled={!canPick || isPending} onClick={function () { return unpickTracked(pickedLots[0].trackedEntityId); }}>
                {((_o = pickedLots[0].trackedEntity) === null || _o === void 0 ? void 0 : _o.readableId) ? (<macro_1.Trans>Unpick {pickedLots[0].trackedEntity.readableId}</macro_1.Trans>) : (<macro_1.Trans>Unpick</macro_1.Trans>)}
              </react_1.Button>) : pickedLots.length > 1 ? (<react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button variant="secondary" leftIcon={<lu_1.LuUndo2 />} rightIcon={<lu_1.LuChevronDown />} isDisabled={!canPick || isPending}>
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
            {!isPicked && (<react_1.Button variant="secondary" leftIcon={<lu_1.LuQrCode />} isDisabled={!canPick || isPending} onClick={openPicker}>
                <macro_1.Trans>Scan</macro_1.Trans>
              </react_1.Button>)}
          </react_1.HStack>) : isPicked ? (<react_1.Button variant="secondary" leftIcon={<lu_1.LuUndo2 />} isDisabled={!canPick || isPending} isLoading={isPending} onClick={function () { return pick(0); }}>
            <macro_1.Trans>Unpick</macro_1.Trans>
          </react_1.Button>) : (<react_1.HStack spacing={1}>
            <react_1.Button variant="secondary" isDisabled={!canPick || isPending} onClick={function () { return setShortOpen(true); }}>
              <macro_1.Trans>Short</macro_1.Trans>
            </react_1.Button>
            <react_1.Button leftIcon={<lu_1.LuCirclePlus />} isDisabled={!canPick || isPending} isLoading={isPending} onClick={function () { return pick(quantityToPick); }}>
              <macro_1.Trans>Pick</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>)}
      </react_1.HStack>

      {shortOpen && (<ShortPickModal_1.ShortPickModal pickingListId={pickingListId} lineId={line.id} itemName={itemName} quantityToPick={quantityToPick} quantityPicked={quantityPicked} onClose={function () { return setShortOpen(false); }}/>)}

      {pickerOpen && (<react_1.TrackedEntityPicker trackingType={(item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" ? "Serial" : "Batch"} entities={(_q = (_p = trackedFetcher.data) === null || _p === void 0 ? void 0 : _p.entities) !== null && _q !== void 0 ? _q : []} quantityRequired={Math.max(0, quantityToPick - quantityPicked)} title={"Pick ".concat(itemName)} description={(item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial"
                ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Choose a serial number"], ["Choose a serial number"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Choose a batch number"], ["Choose a batch number"])))} nearExpiryWarningDays={(_s = (_r = trackedFetcher.data) === null || _r === void 0 ? void 0 : _r.nearExpiryWarningDays) !== null && _s !== void 0 ? _s : 0} expiredEntityPolicy={(_u = (_t = trackedFetcher.data) === null || _t === void 0 ? void 0 : _t.expiredEntityPolicy) !== null && _u !== void 0 ? _u : "Warn"} defaultOrder={(_v = trackedFetcher.data) === null || _v === void 0 ? void 0 : _v.defaultOrder} onSelect={pickTracked} onClose={function () { return setPickerOpen(false); }}/>)}
    </div>);
}
/**
 * At-a-glance recommended serial/batch numbers for a tracked line, streamed in
 * from the deferred list-wide recommendations so the row paints immediately.
 * Rendered as readable monospace chips, no label — the chips speak for themselves.
 */
function RecommendedLots(_a) {
    var resolve = _a.resolve, lineId = _a.lineId;
    return (<react_2.Suspense fallback={<react_1.Skeleton className="mt-2 h-6 w-36 rounded-md sm:h-5"/>}>
      <react_router_1.Await resolve={resolve} errorElement={null}>
        {function (byLine) {
            var _a;
            var lots = (_a = byLine === null || byLine === void 0 ? void 0 : byLine[lineId]) !== null && _a !== void 0 ? _a : [];
            if (lots.length === 0)
                return null;
            return (<div className="mt-2 flex min-w-0 flex-wrap items-center gap-1.5 text-base sm:text-sm">
              {lots.map(function (lot) {
                    var _a;
                    return (<span key={lot.trackedEntityId} className="max-w-full truncate rounded-md border border-border bg-muted px-2 py-0.5 font-mono tabular-nums text-foreground">
                  {(_a = lot.readableId) !== null && _a !== void 0 ? _a : lot.trackedEntityId}
                </span>);
                })}
            </div>);
        }}
      </react_router_1.Await>
    </react_2.Suspense>);
}
exports.default = PickingListLines;
var templateObject_1, templateObject_2;
