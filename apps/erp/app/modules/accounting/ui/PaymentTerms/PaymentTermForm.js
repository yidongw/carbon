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
var PaymentTermForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, _c = _a.type, type = _c === void 0 ? "drawer" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var _d = (0, react_2.useState)(initialValues.calculationMethod), selectedCalculationMethod = _d[0], setSelectedCalculationMethod = _d[1];
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created payment term"], ["Created payment term"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create payment term: ", ""], ["Failed to create payment term: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var calculationMethodOptions = accounting_models_1.paymentTermsCalculationMethod.map(function (v) { return ({
        label: v,
        value: v
    }); });
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={accounting_models_1.paymentTermValidator} method="post" action={isEditing
            ? path_1.path.to.paymentTerm(initialValues.id)
            : path_1.path.to.newPaymentTerm} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Payment Term</macro_1.Trans>) : (<macro_1.Trans>New Payment Term</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Name"], ["Name"])))}/>
                <Form_1.Select name="calculationMethod" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["After"], ["After"])))} options={calculationMethodOptions} onChange={function (value) {
            setSelectedCalculationMethod(value === null || value === void 0 ? void 0 : value.value);
        }}/>
                <Form_1.Number name="daysDue" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Due Days after ", ""], ["Due Days after ", ""])), selectedCalculationMethod)} minValue={0} helperText={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["The amount of days after the calculation method that the payment is due"], ["The amount of days after the calculation method that the payment is due"])))}/>
                <Form_1.Number name="daysDiscount" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Discount Days after ", ""], ["Discount Days after ", ""])), selectedCalculationMethod)} minValue={0} helperText={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["The amount of days after the calculation method that the cash discount is available"], ["The amount of days after the calculation method that the cash discount is available"])))}/>
                <Form_1.Number name="discountPercentage" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Discount Percent"], ["Discount Percent"])))} minValue={0} maxValue={100} helperText={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["The percentage of the cash discount. Use 0 for no discount."], ["The percentage of the cash discount. Use 0 for no discount."])))}/>
                <Form_1.CustomFormFields table="paymentTerm"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = PaymentTermForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
