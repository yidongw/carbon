"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var locale_1 = require("@carbon/locale");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var path_1 = require("~/utils/path");
var account_models_1 = require("../../account.models");
var ProfileLanguageForm = function (_a) {
    var locale = _a.locale;
    var t = (0, macro_1.useLingui)().t;
    var options = (0, react_2.useMemo)(function () { return (0, locale_1.getSortedLanguageSelectOptions)(locale); }, [locale]);
    return (<form_1.ValidatedForm method="post" action={path_1.path.to.profile} validator={account_models_1.accountLanguageValidator} defaultValues={{
            locale: (0, locale_1.resolveLanguage)(locale)
        }} className="w-full">
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Language</macro_1.Trans>
          </react_1.CardTitle>
          <react_1.CardDescription>
            <macro_1.Trans>Choose your preferred language for the interface.</macro_1.Trans>
          </react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Select name="locale" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Language"], ["Language"])))} options={options}/>
          <Form_1.Hidden name="intent" value="locale"/>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </react_1.Card>
    </form_1.ValidatedForm>);
};
exports.default = ProfileLanguageForm;
var templateObject_1;
