"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var accounting_models_1 = require("../../accounting.models");
var IntercompanyTransactionForm = function (_a) {
    var initialValues = _a.initialValues, companies = _a.companies, _b = _a.open, open = _b === void 0 ? true : _b, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var isDisabled = !permissions.can("create", "accounting");
    var companyOptions = companies.map(function (c) { return ({
        label: c.name,
        value: c.id
    }); });
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.intercompanyTransactionValidator} method="post" defaultValues={initialValues} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>New IC Transaction</react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="type" value="drawer"/>
              <react_1.VStack spacing={4}>
                <Form_1.Select name="sourceCompanyId" label="Source Company" options={companyOptions}/>
                <Form_1.Select name="targetCompanyId" label="Target Company" options={companyOptions}/>
                <Form_1.Number name="amount" label="Amount" minValue={0}/>
                <SourceCurrencySync companies={companies}/>
                <Form_1.Input name="description" label="Description"/>
                <Form_1.Account name="debitAccountId" label="Debit Account"/>
                <Form_1.Account name="creditAccountId" label="Credit Account"/>
                <Form_1.Input name="postingDate" label="Posting Date" type="date"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
function SourceCurrencySync(_a) {
    var _b, _c;
    var companies = _a.companies;
    var sourceCompanyId = (0, form_1.useControlField)("sourceCompanyId")[0];
    var _d = (0, form_1.useControlField)("currencyCode"), setCurrencyCode = _d[1];
    var currencyCode = (_c = (_b = companies.find(function (c) { return c.id === sourceCompanyId; })) === null || _b === void 0 ? void 0 : _b.baseCurrencyCode) !== null && _c !== void 0 ? _c : "";
    (0, react_2.useEffect)(function () {
        setCurrencyCode(currencyCode);
    }, [currencyCode, setCurrencyCode]);
    return <Form_1.Hidden name="currencyCode" value={currencyCode}/>;
}
exports.default = IntercompanyTransactionForm;
