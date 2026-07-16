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
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var TagForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.lockTable, lockTable = _b === void 0 ? false : _b, onDismiss = _a.onDismiss, fetcher = _a.fetcher, action = _a.action;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var isDisabled = !permissions.is("employee");
    var tableOptions = (0, react_2.useMemo)(function () { return shared_1.tagTables.map(function (t) { return ({ value: t.table, label: t.label }); }); }, []);
    return (<form_1.ValidatedForm validator={shared_1.tagValidator} method="post" action={action} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
      <react_1.DrawerHeader>
        <react_1.DrawerTitle>
          <macro_1.Trans>New Tag</macro_1.Trans>
        </react_1.DrawerTitle>
      </react_1.DrawerHeader>
      <react_1.DrawerBody>
        <react_1.VStack spacing={4}>
          <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>
          {lockTable ? (
        // Opened from a record's Tags field — the table is fixed by that
        // field, so submit it silently rather than showing a picker.
        <Form_1.Hidden name="table" value={initialValues.table}/>) : (<Form_1.Select name="table" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Applies to"], ["Applies to"])))} options={tableOptions}/>)}
        </react_1.VStack>
      </react_1.DrawerBody>
      <react_1.DrawerFooter>
        <react_1.HStack>
          <Form_1.Submit isDisabled={isDisabled}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
          <react_1.Button variant="solid" type="button" onClick={onDismiss}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
        </react_1.HStack>
      </react_1.DrawerFooter>
    </form_1.ValidatedForm>);
};
exports.default = TagForm;
var templateObject_1, templateObject_2;
