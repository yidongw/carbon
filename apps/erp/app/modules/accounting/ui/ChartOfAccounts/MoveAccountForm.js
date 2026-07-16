"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var MoveAccountForm = function (_a) {
    var accountId = _a.accountId, accountName = _a.accountName, groupAccounts = _a.groupAccounts, currentParentId = _a.currentParentId, _b = _a.open, open = _b === void 0 ? true : _b, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success("Moved account");
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error("Failed to move account: ".concat(fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose]);
    var isDisabled = !permissions.can("update", "accounting");
    return (<react_1.ModalDrawerProvider type="modal">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.moveAccountValidator} method="post" action={path_1.path.to.moveChartOfAccount(accountId)} defaultValues={{
            id: accountId,
            parentId: currentParentId !== null && currentParentId !== void 0 ? currentParentId : undefined
        }} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>Move {accountName}</react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <react_1.VStack spacing={4}>
                <p className="text-sm text-muted-foreground">
                  Select a new parent group for this account.
                </p>
                <Form_1.Combobox name="parentId" label="Move to Group" options={groupAccounts.map(function (a) { return ({
            label: a.name,
            value: a.id
        }); })}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>Move</Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }}>
                  Cancel
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = MoveAccountForm;
