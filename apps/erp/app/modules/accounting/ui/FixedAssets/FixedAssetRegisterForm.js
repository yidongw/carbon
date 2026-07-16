"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var accounting_models_1 = require("../../accounting.models");
var FixedAssetRegisterForm = function (_a) {
    var _b, _c;
    var onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var fetcher = (0, react_router_1.useFetcher)();
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.fixedAssetRegisterValidator} method="post" fetcher={fetcher} className="flex flex-col h-full" defaultValues={{
            acquisitionCost: 0,
            acquisitionDate: "",
            accumulatedDepreciation: 0,
            depreciationStartDate: ""
        }}>
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>Register Existing Asset</react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <react_1.VStack spacing={4}>
                <Form_1.Number name="acquisitionCost" label="Acquisition Cost" minValue={0} formatOptions={{
            style: "currency",
            currency: (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD"
        }}/>
                <Form_1.DatePicker name="acquisitionDate" label="Acquisition Date"/>
                <Form_1.Number name="accumulatedDepreciation" label="Accumulated Depreciation" minValue={0} formatOptions={{
            style: "currency",
            currency: (_c = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _c !== void 0 ? _c : "USD"
        }}/>
                <Form_1.DatePicker name="depreciationStartDate" label="Depreciation Start Date"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={!permissions.can("update", "accounting")}>
                  Register
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
exports.default = FixedAssetRegisterForm;
