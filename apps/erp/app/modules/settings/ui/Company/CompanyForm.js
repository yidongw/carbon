"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var Form_1 = require("~/components/Form");
var AddressAutocomplete_1 = require("~/components/Form/AddressAutocomplete");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var CompanyForm = function (_a) {
    var company = _a.company;
    var t = (0, macro_1.useLingui)().t;
    return (<>
      <form_1.ValidatedForm method="post" action={path_1.path.to.company} validator={settings_1.companyValidator} defaultValues={company}>
        <Form_1.Hidden name="intent" value="about"/>

        <react_1.VStack spacing={4}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Company Name"], ["Company Name"])))}/>
            <Form_1.Input name="taxId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Tax ID"], ["Tax ID"])))}/>
            <Form_1.Input name="vatNumber" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["VAT Number"], ["VAT Number"])))}/>
            {(0, utils_1.isEoriCountry)(company.countryCode) && (<Form_1.Input name="eori" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["EORI"], ["EORI"])))}/>)}
            <AddressAutocomplete_1.default variant="grid"/>
            <Form_1.Currency name="baseCurrencyCode" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Base Currency"], ["Base Currency"])))} disabled={true}/>
            <Form_1.PhoneInput name="phone" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Phone Number"], ["Phone Number"])))}/>
            <Form_1.PhoneInput name="fax" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Fax Number"], ["Fax Number"])))}/>
            <Form_1.Input name="email" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Email"], ["Email"])))}/>
            <Form_1.Input name="website" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Website"], ["Website"])))}/>
          </div>
          <Form_1.Submit>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.VStack>
      </form_1.ValidatedForm>
    </>);
};
exports.default = CompanyForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
