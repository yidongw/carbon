"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var ChartOfAccountForm = function (_a) {
    var _b, _c, _d;
    var initialValues = _a.initialValues, _e = _a.groupAccounts, groupAccounts = _e === void 0 ? [] : _e, _f = _a.open, open = _f === void 0 ? true : _f, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var initialParent = groupAccounts.find(function (a) { return a.id === initialValues.parentId; });
    var _g = (0, react_2.useState)(initialParent), selectedGroup = _g[0], setSelectedGroup = _g[1];
    var incomeBalance = (_b = selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.incomeBalance) !== null && _b !== void 0 ? _b : initialValues.incomeBalance;
    var accountClass = (_c = selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.class) !== null && _c !== void 0 ? _c : initialValues.class;
    var accountType = (_d = selectedGroup === null || selectedGroup === void 0 ? void 0 : selectedGroup.accountType) !== null && _d !== void 0 ? _d : initialValues.accountType;
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(initialValues.id ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Updated account"], ["Updated account"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Created account"], ["Created account"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error("Failed to save account: ".concat(fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, initialValues.id, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var onParentChange = function (newValue) {
        if (newValue) {
            var group = groupAccounts.find(function (a) { return a.id === newValue.value; });
            setSelectedGroup(group);
        }
        else {
            setSelectedGroup(undefined);
        }
    };
    return (<react_1.ModalDrawerProvider type="modal">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.accountValidator} method="post" action={isEditing
            ? path_1.path.to.chartOfAccount(initialValues.id)
            : path_1.path.to.newChartOfAccount} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Edit Account"], ["Edit Account"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["New Account"], ["New Account"])))}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="incomeBalance" value={incomeBalance}/>
              <Form_1.Hidden name="class" value={accountClass}/>
              <Form_1.Hidden name="accountType" value={accountType}/>
              <Form_1.Hidden name="consolidatedRate" value="Average"/>

              <react_1.VStack spacing={4}>
                <Form_1.Combobox name="parentId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Group"], ["Group"])))} options={groupAccounts
            .filter(function (a) { return a.class !== null; })
            .map(function (a) { return ({
            label: a.name,
            value: a.id
        }); })} onChange={onParentChange}/>
                <Form_1.Input name="number" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Account Number"], ["Account Number"])))}/>
                <Form_1.Input name="name" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Name"], ["Name"])))}/>
                {selectedGroup && (<>
                    {accountType && (<div className="space-y-1">
                        <label className="text-sm font-medium text-muted-foreground">
                          <macro_1.Trans>Account Type</macro_1.Trans>
                        </label>
                        <p className="text-sm">{accountType}</p>
                      </div>)}
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
exports.default = ChartOfAccountForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
