"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var AuditLogDrawer_1 = require("~/components/AuditLog/AuditLogDrawer");
var Editable_1 = require("~/components/Editable");
var Form_1 = require("~/components/Form");
var Grid_1 = require("~/components/Grid");
var hooks_1 = require("~/hooks");
var sales_models_1 = require("../../sales.models");
var PriceOverrideForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, initialBreaks = _a.initialBreaks, initialScope = _a.initialScope, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var auditDisclosure = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(function () {
        if (initialValues.customerId)
            return "customer";
        if (initialValues.customerTypeId)
            return "customerType";
        return initialScope !== null && initialScope !== void 0 ? initialScope : "customer";
    }), scope = _c[0], setScope = _c[1];
    var _d = (0, react_2.useState)(function () {
        var seed = Array.isArray(initialBreaks) && initialBreaks.length > 0
            ? initialBreaks.map(function (b) { return ({
                id: b.id,
                quantity: Number(b.quantity) || 0,
                overridePrice: Number(b.overridePrice) || 0,
                active: b.active !== false
            }); })
            : [{ quantity: 1, overridePrice: 0, active: true }];
        return seed.sort(function (a, b) { return a.quantity - b.quantity; });
    }), breaks = _d[0], setBreaks = _d[1];
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "sales")
        : !permissions.can("create", "sales");
    // Early-termination controls — only sales:delete can edit once live.
    var canTerminate = permissions.can("delete", "sales");
    var lifecycleLocked = isEditing && !canTerminate;
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={sales_models_1.priceOverrideValidator} method="post" defaultValues={initialValues} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <div className="flex items-center justify-between gap-2">
                <react_1.ModalDrawerTitle>
                  {isEditing ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Price Override"], ["Edit Price Override"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Price Override"], ["New Price Override"])))}
                </react_1.ModalDrawerTitle>
                {isEditing && initialValues.id && (<react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuHistory />} onClick={auditDisclosure.onOpen}>
                    {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["History"], ["History"])))}
                  </react_1.Button>)}
              </div>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="breaks" value={JSON.stringify(breaks)}/>
              <react_1.VStack spacing={4}>
                <Form_1.Item name="itemId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Item"], ["Item"])))} type="Part"/>

                <react_1.ChoiceCardGroup label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Apply To"], ["Apply To"])))} value={scope} onChange={setScope} options={[
            {
                value: "customer",
                title: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Specific Customer"], ["Specific Customer"]))),
                description: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Override price for a single customer"], ["Override price for a single customer"]))),
                icon: <lu_1.LuSquareUser />
            },
            {
                value: "customerType",
                title: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Customer Type"], ["Customer Type"]))),
                description: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Override price for all customers of a type"], ["Override price for all customers of a type"]))),
                icon: <lu_1.LuUsers />
            }
        ]}/>

                {scope === "customer" && (<>
                    <Form_1.Customer name="customerId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer"], ["Customer"])))}/>
                    <Form_1.Hidden name="customerTypeId" value=""/>
                  </>)}

                {scope === "customerType" && (<>
                    <Form_1.CustomerType name="customerTypeId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Customer Type"], ["Customer Type"])))}/>
                    <Form_1.Hidden name="customerId" value=""/>
                  </>)}

                <PriceBreaks breaks={breaks} onChange={setBreaks} baseCurrency={baseCurrency} isDisabled={isDisabled} overrideId={initialValues.id} companyId={company === null || company === void 0 ? void 0 : company.id}/>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Form_1.Boolean name="active" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Active"], ["Active"])))} isDisabled={lifecycleLocked}/>
                  <Form_1.Boolean name="applyRulesOnTop" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Apply pricing rules"], ["Apply pricing rules"])))}/>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Form_1.DatePicker name="validFrom" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Valid From"], ["Valid From"])))}/>
                  <Form_1.DatePicker name="validTo" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Valid To"], ["Valid To"])))} isDisabled={lifecycleLocked}/>
                </div>

                <Form_1.TextArea name="notes" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={onClose}>
                  Cancel
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
      {isEditing && initialValues.id && (company === null || company === void 0 ? void 0 : company.id) && (<AuditLogDrawer_1.default isOpen={auditDisclosure.isOpen} onClose={auditDisclosure.onClose} entityType="priceOverride" entityId={initialValues.id} companyId={company.id} planRestricted={false}/>)}
    </react_1.ModalDrawerProvider>);
};
function PriceBreaks(_a) {
    var _this = this;
    var _b, _c;
    var breaks = _a.breaks, onChange = _a.onChange, baseCurrency = _a.baseCurrency, isDisabled = _a.isDisabled, overrideId = _a.overrideId, companyId = _a.companyId;
    var t = (0, macro_1.useLingui)().t;
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var _d = (0, react_2.useState)(null), historyBreakId = _d[0], setHistoryBreakId = _d[1];
    var fetcher = (0, react_router_1.useFetcher)();
    var lastFetchedRef = (0, react_2.useRef)(null);
    // Per-break history: the server filters by recordId so the drawer shows
    // just this rung's timeline (add → price changes → toggle → delete).
    (0, react_2.useEffect)(function () {
        if (!historyBreakId) {
            lastFetchedRef.current = null;
            return;
        }
        if (!companyId)
            return;
        var key = historyBreakId;
        if (lastFetchedRef.current === key)
            return;
        lastFetchedRef.current = key;
        var params = new URLSearchParams({
            entityType: "priceOverrideBreak",
            entityId: historyBreakId,
            companyId: companyId
        });
        fetcher.load("/api/audit-log?".concat(params.toString()));
    }, [historyBreakId, companyId, fetcher]);
    var breakHistoryEntries = (_c = (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.entries) !== null && _c !== void 0 ? _c : [];
    var isHistoryLoading = fetcher.state === "loading";
    var canShowHistory = Boolean(overrideId && companyId);
    var activeCount = breaks.filter(function (b) { return b.active !== false; }).length;
    var removeRow = (0, react_2.useCallback)(function (index) {
        onChange(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    }, [onChange]);
    var addRow = (0, react_2.useCallback)(function () {
        onChange(function (prev) {
            var maxQty = prev.reduce(function (m, b) { return Math.max(m, b.quantity); }, 0);
            return __spreadArray(__spreadArray([], prev, true), [
                { quantity: maxQty + 1, overridePrice: 0, active: true }
            ], false);
        });
    }, [onChange]);
    var toggleActive = (0, react_2.useCallback)(function (index, next) {
        onChange(function (prev) {
            return prev.map(function (b, i) { return (i === index ? __assign(__assign({}, b), { active: next }) : b); });
        });
    }, [onChange]);
    // Grid mutation is a no-op — edits land via local state + form submit.
    var noOpMutation = (0, react_2.useCallback)(function (_accessorKey, _newValue, _row) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    data: null,
                    error: null,
                    count: null,
                    status: 200,
                    statusText: "OK"
                })];
        });
    }); }, []);
    var editableComponents = (0, react_2.useMemo)(function () { return ({
        quantity: (0, Editable_1.EditableNumber)(noOpMutation),
        overridePrice: (0, Editable_1.EditableNumber)(noOpMutation, {
            formatOptions: { style: "currency", currency: baseCurrency }
        })
    }); }, [noOpMutation, baseCurrency]);
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "quantity",
            header: t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack className="justify-between min-w-[80px]">
            <span>{row.original.quantity}</span>
            {!isDisabled && (<div className="relative w-6 h-5">
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Price break actions"], ["Price break actions"])))} icon={<lu_1.LuEllipsisVertical />} size="md" className="absolute right-[-1px] top-[-6px]" variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    {canShowHistory && row.original.id ? (<react_1.DropdownMenuItem onClick={function () { var _a; return setHistoryBreakId((_a = row.original.id) !== null && _a !== void 0 ? _a : null); }}>
                        <react_1.DropdownMenuIcon icon={<lu_1.LuHistory />}/>
                        {t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["View History"], ["View History"])))}
                      </react_1.DropdownMenuItem>) : null}
                    <react_1.DropdownMenuItem onClick={function () { return removeRow(row.index); }} destructive>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                      {t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Delete Price Break"], ["Delete Price Break"])))}
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </div>)}
          </react_1.HStack>);
            }
        },
        {
            accessorKey: "overridePrice",
            header: t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Override Price"], ["Override Price"]))),
            cell: function (_a) {
                var row = _a.row;
                return formatter.format(row.original.overridePrice);
            }
        },
        {
            accessorKey: "active",
            header: t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Active"], ["Active"]))),
            cell: function (_a) {
                var row = _a.row;
                // Guard against disabling the last active break — it would leave
                // the override with zero applicable rungs and silently fall through
                // to the base price, which is never what the user wants. Suggest
                // the parent-level Active toggle instead.
                var isLastActive = row.original.active !== false && activeCount <= 1;
                var switchEl = (<react_1.Switch variant="small" checked={row.original.active !== false} disabled={isDisabled || isLastActive} onCheckedChange={function (next) { return toggleActive(row.index, next === true); }} aria-label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Toggle break active"], ["Toggle break active"])))}/>);
                if (!isLastActive)
                    return switchEl;
                return (<react_1.Tooltip>
              <react_1.TooltipTrigger asChild>
                <span className="inline-flex">{switchEl}</span>
              </react_1.TooltipTrigger>
              <react_1.TooltipContent>
                {t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Can't disable the only active break. Add another break or toggle the override's Active instead."], ["Can't disable the only active break. Add another break or toggle the override's Active instead."])))}
              </react_1.TooltipContent>
            </react_1.Tooltip>);
            }
        }
    ]; }, [
        isDisabled,
        removeRow,
        formatter,
        t,
        toggleActive,
        activeCount,
        canShowHistory
    ]);
    return (<div className="space-y-3 w-full">
      <span className="font-medium text-sm">{t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Price Breaks"], ["Price Breaks"])))}</span>
      <Grid_1.default data={breaks} columns={columns} canEdit={!isDisabled} editableComponents={editableComponents} onDataChange={onChange} onNewRow={!isDisabled ? addRow : undefined} contained={false}/>
      {canShowHistory && (<react_1.Drawer open={historyBreakId !== null} onOpenChange={function (open) {
                if (!open)
                    setHistoryBreakId(null);
            }}>
          <react_1.DrawerContent size="lg" position="left">
            <react_1.DrawerHeader>
              <react_1.DrawerTitle className="flex items-center gap-2">
                <lu_1.LuHistory className="size-5"/>
                <macro_1.Trans>Price Break History</macro_1.Trans>
              </react_1.DrawerTitle>
            </react_1.DrawerHeader>
            <react_1.DrawerBody>
              {isHistoryLoading ? (<react_1.VStack spacing={3}>
                  <react_1.Skeleton className="w-full h-[151px]"/>
                  <react_1.Skeleton className="w-full h-[151px]"/>
                </react_1.VStack>) : breakHistoryEntries.length === 0 ? (<components_1.Empty />) : (<react_1.VStack spacing={3}>
                  {breakHistoryEntries.map(function (entry) { return (<AuditLogDrawer_1.AuditLogEntryCard key={entry.id} entry={entry}/>); })}
                </react_1.VStack>)}
            </react_1.DrawerBody>
          </react_1.DrawerContent>
        </react_1.Drawer>)}
    </div>);
}
exports.default = PriceOverrideForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25;
