"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var useCurrencyFormatter_1 = require("~/hooks/useCurrencyFormatter");
var accounting_models_1 = require("../../accounting.models");
var FixedAssetDisposalForm = function (_a) {
    var currentNBV = _a.currentNBV, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var company = (0, hooks_1.useUser)().company;
    var currencyFormatter = (0, useCurrencyFormatter_1.useCurrencyFormatter)({
        currency: company.baseCurrencyCode
    });
    return (<react_1.ModalDrawerProvider type="modal">
      <react_1.ModalDrawer open onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.fixedAssetDisposalValidator} method="post" fetcher={fetcher} className="flex flex-col h-full" defaultValues={{
            disposalDate: ""
        }}>
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>Dispose Asset</react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <react_1.VStack spacing={4}>
                <div className="text-sm text-muted-foreground">
                  Current Net Book Value:{" "}
                  <span className="font-medium text-foreground">
                    {currencyFormatter.format(currentNBV)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  This will write off the remaining book value of the asset.
                </p>
                <Form_1.DatePicker name="disposalDate" label="Disposal Date"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={!permissions.can("update", "accounting")}>
                  Dispose
                </Form_1.Submit>
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
exports.default = FixedAssetDisposalForm;
