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
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var FiscalYearSettingsForm = function (_a) {
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var isDisabled = !permissions.can("update", "accounting") || !permissions.is("employee");
    var fields = (0, react_2.useMemo)(function () { return [
        {
            name: "startMonth",
            label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Start of Fiscal Year"], ["Start of Fiscal Year"]))),
            description: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["This is the month your fiscal year starts."], ["This is the month your fiscal year starts."])))
        },
        {
            name: "taxStartMonth",
            label: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Start of Tax Year"], ["Start of Tax Year"]))),
            description: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["This is the month your tax year starts."], ["This is the month your tax year starts."])))
        }
    ]; }, [t]);
    return (<form_1.ValidatedForm method="post" action={path_1.path.to.fiscalYears} defaultValues={initialValues} validator={accounting_models_1.fiscalYearSettingsValidator} className="w-full">
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              <macro_1.Trans>Fiscal Year Settings</macro_1.Trans>
            </h1>
            <p className="text-sm text-muted-foreground">
              <macro_1.Trans>
                Configure the start months for your fiscal and tax years
              </macro_1.Trans>
            </p>
          </div>
          <react_1.HStack>
            <Form_1.Submit isDisabled={isDisabled}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
            <react_1.Button size="md" variant="solid" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </div>
        <div className="flex flex-col gap-3 p-6">
          {fields.map(function (field) { return (<div key={field.name} className="group rounded-lg border border-border p-4 transition-all hover:border-muted-foreground/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {field.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {field.description}
                  </p>
                </div>
                <div className="flex-shrink-0 w-64">
                  <Form_1.Select name={field.name} options={shared_1.months.map(function (month) { return ({
                label: month,
                value: month
            }); })} size="sm"/>
                </div>
              </div>
            </div>); })}
        </div>
      </div>
    </form_1.ValidatedForm>);
};
exports.default = FiscalYearSettingsForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
