"use client";
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.usePickOrderOptions = usePickOrderOptions;
exports.TrackedEntityPicker = TrackedEntityPicker;
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var Badge_1 = require("./Badge");
var Button_1 = require("./Button");
var Combobox_1 = require("./Combobox");
var HStack_1 = require("./HStack");
var Input_1 = require("./Input");
var Modal_1 = require("./Modal");
var ScrollArea_1 = require("./ScrollArea");
var Tabs_1 = require("./Tabs");
var Tooltip_1 = require("./Tooltip");
var cn_1 = require("./utils/cn");
var VStack_1 = require("./VStack");
/**
 * Pick-order options (value + translated label), shared by the picker's order
 * dropdown and the item's pick-method form so the two can never drift.
 */
function usePickOrderOptions() {
    var t = (0, macro_1.useLingui)().t;
    return (0, react_1.useMemo)(function () { return [
        { value: "Default", label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Default"], ["Default"]))) },
        { value: "FEFO", label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Expiring first"], ["Expiring first"]))) },
        { value: "FIFO", label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Oldest first"], ["Oldest first"]))) },
        { value: "LIFO", label: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Newest first"], ["Newest first"]))) }
    ]; }, [t]);
}
function startOfToday() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}
function expiryState(expirationDate, nearExpiryWarningDays) {
    if (!expirationDate)
        return "none";
    var exp = new Date(expirationDate).getTime();
    var today = startOfToday();
    if (exp < today)
        return "expired";
    var near = today + nearExpiryWarningDays * 24 * 60 * 60 * 1000;
    if (exp <= near)
        return "near";
    return "ok";
}
function sortEntities(entities, order) {
    var byExpiry = function (a, b) {
        // nulls last
        if (!a.expirationDate && !b.expirationDate)
            return 0;
        if (!a.expirationDate)
            return 1;
        if (!b.expirationDate)
            return -1;
        return a.expirationDate.localeCompare(b.expirationDate);
    };
    var byCreated = function (dir) { return function (a, b) { var _a, _b; return dir * ((_a = a.createdAt) !== null && _a !== void 0 ? _a : "").localeCompare((_b = b.createdAt) !== null && _b !== void 0 ? _b : ""); }; };
    var copy = __spreadArray([], entities, true);
    switch (order) {
        case "FEFO":
            return copy.sort(function (a, b) { return byExpiry(a, b) || byCreated(1)(a, b); });
        case "FIFO":
            return copy.sort(byCreated(1));
        case "LIFO":
            return copy.sort(byCreated(-1));
        default:
            // Default: expiring soonest first, then oldest first
            return copy.sort(function (a, b) { return byExpiry(a, b) || byCreated(1)(a, b); });
    }
}
function TrackedEntityPicker(_a) {
    var trackingType = _a.trackingType, entities = _a.entities, quantityRequired = _a.quantityRequired, title = _a.title, description = _a.description, _b = _a.size, size = _b === void 0 ? "md" : _b, _c = _a.nearExpiryWarningDays, nearExpiryWarningDays = _c === void 0 ? 0 : _c, _d = _a.expiredEntityPolicy, expiredEntityPolicy = _d === void 0 ? "Warn" : _d, _e = _a.defaultOrder, defaultOrder = _e === void 0 ? "Default" : _e, onSelect = _a.onSelect, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var _f = (0, react_1.useState)("scan"), activeTab = _f[0], setActiveTab = _f[1];
    var _g = (0, react_1.useState)(defaultOrder), order = _g[0], setOrder = _g[1];
    var _h = (0, react_1.useState)(""), scan = _h[0], setScan = _h[1];
    // Hosts open the picker and fetch its data in parallel, so `defaultOrder`
    // arrives a render after mount (undefined -> the item's configured order).
    // Re-sync the selection when it changes so the stored pick order wins over
    // the "Default" fallback. A subsequent user override sticks because
    // `defaultOrder` is then stable.
    var _j = (0, react_1.useState)(defaultOrder), appliedDefaultOrder = _j[0], setAppliedDefaultOrder = _j[1];
    if (defaultOrder !== appliedDefaultOrder) {
        setAppliedDefaultOrder(defaultOrder);
        setOrder(defaultOrder);
    }
    var orderOptions = usePickOrderOptions();
    var ordered = (0, react_1.useMemo)(function () { return sortEntities(entities, order); }, [entities, order]);
    var matchScan = function (value) {
        return entities.find(function (e) { return e.trackedEntityId === value || e.readableId === value; });
    };
    var isBlocked = function (e) {
        return expiredEntityPolicy === "Block" &&
            expiryState(e.expirationDate, nearExpiryWarningDays) === "expired";
    };
    var pickQuantity = function (e) {
        return trackingType === "Serial"
            ? 1
            : Math.max(0, Math.min(quantityRequired !== null && quantityRequired !== void 0 ? quantityRequired : e.availableQuantity, e.availableQuantity));
    };
    var confirm = function (e) {
        var _a;
        if (isBlocked(e))
            return;
        onSelect({
            trackedEntityId: e.trackedEntityId,
            quantity: pickQuantity(e),
            storageUnitId: (_a = e.storageUnitId) !== null && _a !== void 0 ? _a : null
        });
    };
    var scanMatch = scan ? matchScan(scan) : undefined;
    return (<Modal_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <Modal_1.ModalContent>
        <Modal_1.ModalHeader>
          <Modal_1.ModalTitle>{title !== null && title !== void 0 ? title : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Pick tracked item"], ["Pick tracked item"])))}</Modal_1.ModalTitle>
          {description && <Modal_1.ModalDescription>{description}</Modal_1.ModalDescription>}
        </Modal_1.ModalHeader>
        <Modal_1.ModalBody>
          <Tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
            <Tabs_1.TabsList className="grid w-full grid-cols-2 mb-4">
              <Tabs_1.TabsTrigger value="scan" className="leading-none">
                <lu_1.LuQrCode className="mr-2 shrink-0"/>
                {t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Scan"], ["Scan"])))}
              </Tabs_1.TabsTrigger>
              <Tabs_1.TabsTrigger value="select" className="leading-none">
                <lu_1.LuList className="mr-2 shrink-0"/>
                {t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Select"], ["Select"])))}
              </Tabs_1.TabsTrigger>
            </Tabs_1.TabsList>

            <Tabs_1.TabsContent value="scan" className="mt-2">
              <VStack_1.VStack spacing={4}>
                <Input_1.InputGroup>
                  <Input_1.Input autoFocus size={size} placeholder={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Scan or enter tracking number"], ["Scan or enter tracking number"])))} value={scan} onChange={function (e) { return setScan(e.target.value); }} onKeyDown={function (e) {
            if (e.key === "Enter") {
                var match = matchScan(e.currentTarget.value);
                if (match) {
                    confirm(match);
                    setScan("");
                }
            }
        }}/>
                  <Input_1.InputRightElement>
                    {scan &&
            (scanMatch ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuX className="text-red-500"/>))}
                  </Input_1.InputRightElement>
                </Input_1.InputGroup>
                {scanMatch && isBlocked(scanMatch) && (<p className="text-sm text-red-600">
                    {t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["This lot is expired and can't be picked."], ["This lot is expired and can't be picked."])))}
                  </p>)}
              </VStack_1.VStack>
            </Tabs_1.TabsContent>

            <Tabs_1.TabsContent value="select" className="mt-2">
              <VStack_1.VStack spacing={3} className="w-full">
                <div className="w-full">
                  <Combobox_1.Combobox asButton size={size} value={order} options={orderOptions} onChange={function (value) { var _a; return setOrder((_a = value) !== null && _a !== void 0 ? _a : "Default"); }}/>
                </div>
                <ScrollArea_1.ScrollArea className="max-h-[44dvh] w-full">
                  <VStack_1.VStack spacing={2} className="w-full">
                    {ordered.length === 0 ? (<p className="w-full text-center text-muted-foreground text-xs py-6">
                        {t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["No available tracked entities found"], ["No available tracked entities found"])))}
                      </p>) : (ordered.map(function (e) {
            var _a;
            var exp = expiryState(e.expirationDate, nearExpiryWarningDays);
            var blocked = isBlocked(e);
            return (<HStack_1.HStack key={e.trackedEntityId} className={(0, cn_1.cn)("w-full justify-between p-3 border rounded-lg", blocked && "opacity-50")}>
                            <VStack_1.VStack spacing={0} className="min-w-0 items-start">
                              <p className="text-base font-medium truncate">
                                {(_a = e.readableId) !== null && _a !== void 0 ? _a : e.trackedEntityId}
                              </p>
                              <HStack_1.HStack spacing={2} className="text-xs text-muted-foreground">
                                <span className="tabular-nums">
                                  {e.availableQuantity} {t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["available"], ["available"])))}
                                </span>
                                {e.storageUnitName && (<span>· {e.storageUnitName}</span>)}
                                {e.expirationDate && (<ExpiryBadge state={exp} date={e.expirationDate}/>)}
                              </HStack_1.HStack>
                            </VStack_1.VStack>
                            <Button_1.Button size={size} variant="secondary" isDisabled={blocked} onClick={function () { return confirm(e); }}>
                              {t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Pick"], ["Pick"])))}
                            </Button_1.Button>
                          </HStack_1.HStack>);
        }))}
                  </VStack_1.VStack>
                </ScrollArea_1.ScrollArea>
              </VStack_1.VStack>
            </Tabs_1.TabsContent>
          </Tabs_1.Tabs>
        </Modal_1.ModalBody>
        <Modal_1.ModalFooter>
          <Button_1.Button variant="secondary" size={size} onClick={onClose}>
            {t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Cancel"], ["Cancel"])))}
          </Button_1.Button>
        </Modal_1.ModalFooter>
      </Modal_1.ModalContent>
    </Modal_1.Modal>);
}
function ExpiryBadge(_a) {
    var state = _a.state, date = _a.date;
    var t = (0, macro_1.useLingui)().t;
    if (state === "expired") {
        return (<Tooltip_1.Tooltip>
        <Tooltip_1.TooltipTrigger asChild>
          <Badge_1.Badge variant="red" className="gap-1">
            <lu_1.LuTriangleAlert />
            {t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Expired"], ["Expired"])))}
          </Badge_1.Badge>
        </Tooltip_1.TooltipTrigger>
        <Tooltip_1.TooltipContent>{t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Expired ", ""], ["Expired ", ""])), date)}</Tooltip_1.TooltipContent>
      </Tooltip_1.Tooltip>);
    }
    if (state === "near") {
        return (<Badge_1.Badge variant="yellow" className="gap-1">
        {t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Expires ", ""], ["Expires ", ""])), date)}
      </Badge_1.Badge>);
    }
    return <span>{t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Expires ", ""], ["Expires ", ""])), date)}</span>;
}
exports.default = TrackedEntityPicker;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17;
