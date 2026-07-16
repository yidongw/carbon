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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var classToIncomeBalance = {
    Asset: "Balance Sheet",
    Liability: "Balance Sheet",
    Equity: "Balance Sheet",
    Revenue: "Income Statement",
    Expense: "Income Statement"
};
var incomeBalanceToClasses = {
    "Balance Sheet": ["Asset", "Liability", "Equity"],
    "Income Statement": ["Revenue", "Expense"]
};
var GroupAccountForm = function (_a) {
    var _b, _c, _d;
    var initialValues = _a.initialValues, _e = _a.groupAccounts, groupAccounts = _e === void 0 ? [] : _e, _f = _a.open, open = _f === void 0 ? true : _f, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var parentGroup = groupAccounts.find(function (a) { return a.id === initialValues.parentId; });
    var _g = (0, react_2.useState)((_b = parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.incomeBalance) !== null && _b !== void 0 ? _b : initialValues.incomeBalance), incomeBalance = _g[0], setIncomeBalance = _g[1];
    var _h = (0, react_2.useState)((_c = parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.class) !== null && _c !== void 0 ? _c : initialValues.class), accountClass = _h[0], setAccountClass = _h[1];
    var hasParent = !!initialValues.parentId || !!parentGroup;
    var isRootGroup = !hasParent;
    var parentIsSystem = hasParent && !(parentGroup === null || parentGroup === void 0 ? void 0 : parentGroup.class);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(initialValues.id ? "Updated group" : "Created group");
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error("Failed to save group: ".concat(fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, initialValues.id]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var onParentChange = function (newValue) {
        if (newValue) {
            var group = groupAccounts.find(function (a) { return a.id === newValue.value; });
            if (group) {
                setIncomeBalance(group.incomeBalance);
                if (group.class) {
                    setAccountClass(group.class);
                }
            }
        }
    };
    return (<react_1.ModalDrawerProvider type="modal">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.groupAccountValidator} method="post" action={isEditing
            ? path_1.path.to.chartOfAccount(initialValues.id)
            : path_1.path.to.newChartOfAccountGroup} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? "Edit" : "New"} Group
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="intent" value="group"/>
              <Form_1.Hidden name="incomeBalance" value={incomeBalance}/>
              <Form_1.Hidden name="class" value={accountClass}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>
                <Form_1.Combobox name="parentId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Parent Group"], ["Parent Group"])))} options={groupAccounts
            .filter(function (a) { return a.id !== initialValues.id; })
            .filter(function (a) {
            return isEditing && accountClass
                ? a.class === accountClass
                : true;
        })
            .map(function (a) { return ({
            label: a.name,
            value: a.id
        }); })} onChange={onParentChange}/>
                <Form_1.Combobox name="accountType" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Account Type"], ["Account Type"])))} options={accounting_models_1.accountTypes.map(function (t) { return ({
            label: t,
            value: t
        }); })}/>
                {isRootGroup || parentIsSystem ? (<Form_1.Combobox name="_class" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Class"], ["Class"])))} options={(parentIsSystem
                ? ((_d = incomeBalanceToClasses[incomeBalance]) !== null && _d !== void 0 ? _d : accounting_models_1.accountClassTypes)
                : __spreadArray([], accounting_models_1.accountClassTypes, true)).map(function (c) { return ({
                label: c,
                value: c
            }); })} value={accountClass} onChange={function (newValue) {
                if (newValue) {
                    var cls = newValue.value;
                    setAccountClass(cls);
                    setIncomeBalance(classToIncomeBalance[cls]);
                }
            }}/>) : (<>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        <macro_1.Trans>Income/Balance</macro_1.Trans>
                      </label>
                      <p className="text-sm">{incomeBalance}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-muted-foreground">
                        <macro_1.Trans>Class</macro_1.Trans>
                      </label>
                      <p className="text-sm">{accountClass}</p>
                    </div>
                  </>)}
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = GroupAccountForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
