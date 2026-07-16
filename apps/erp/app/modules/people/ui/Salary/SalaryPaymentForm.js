"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SalaryPaymentForm;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var people_models_1 = require("~/modules/people/people.models");
var salaryDetail_utils_1 = require("./salaryDetail.utils");
function ReadOnlyField(_a) {
    var label = _a.label, value = _a.value;
    return (<react_1.FormControl isReadOnly className="w-full">
      <react_1.FormLabel>{label}</react_1.FormLabel>
      <react_1.Input value={value} isReadOnly tabIndex={-1} className="w-full tabular-nums"/>
    </react_1.FormControl>);
}
function SalaryPaymentForm(_a) {
    var salaryRecordId = _a.salaryRecordId, year = _a.year, month = _a.month, amountOwed = _a.amountOwed, returnTo = _a.returnTo;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var formAction = (0, react_router_1.useFormAction)();
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)({ minimumFractionDigits: 2 });
    var onClose = function () { return navigate(returnTo); };
    var now = new Date();
    var today = "".concat(now.getFullYear(), "-").concat(String(now.getMonth() + 1).padStart(2, "0"), "-").concat(String(now.getDate()).padStart(2, "0"));
    var periodLabel = "".concat(salaryDetail_utils_1.MONTH_NAMES[month - 1], " ").concat(year);
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) { return !open && onClose(); }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={people_models_1.salaryPaymentValidator} method="post" action={formAction} defaultValues={{
            paidAt: today,
            amount: amountOwed > 0 ? amountOwed : undefined
        }} className="flex flex-col h-full w-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                <macro_1.Trans>Record payment</macro_1.Trans>
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody className="w-full">
              <react_1.VStack spacing={4} className="w-full">
                <Form_1.Hidden name="salaryRecordId" value={salaryRecordId}/>
                <Form_1.Hidden name="returnTo" value={returnTo}/>

                <ReadOnlyField label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Pay period"], ["Pay period"])))} value={periodLabel}/>
                <ReadOnlyField label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Outstanding balance"], ["Outstanding balance"])))} value={currencyFormatter.format(amountOwed)}/>

                <div className="w-full space-y-4 border-t border-border pt-4">
                  <div className="w-full">
                    <Form_1.Number name="amount" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Amount"], ["Amount"])))} minValue={0.01} step={0.01} helperText={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Defaults to the full outstanding amount"], ["Defaults to the full outstanding amount"])))}/>
                  </div>
                  <div className="w-full">
                    <Form_1.DatePicker name="paidAt" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Payment date"], ["Payment date"])))}/>
                  </div>
                  <div className="w-full">
                    <Form_1.TextArea name="notes" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Notes"], ["Notes"])))} placeholder={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Optional payment notes"], ["Optional payment notes"])))}/>
                  </div>
                </div>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack className="w-full justify-end">
                <react_1.Button size="md" variant="secondary" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <Form_1.Submit>
                  <macro_1.Trans>Record payment</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
