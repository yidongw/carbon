"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWebhookTables = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var settings_models_1 = require("../../settings.models");
var WebhookForm = function (_a) {
    var initialValues = _a.initialValues, _b = _a.open, open = _b === void 0 ? true : _b, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var tables = (0, exports.useWebhookTables)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created webhook"], ["Created webhook"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create webhook: ", ""], ["Failed to create webhook: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, t]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "parts")
        : !permissions.can("create", "parts");
    return (<react_1.Drawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
      <react_1.DrawerContent size="sm">
        <form_1.ValidatedForm validator={settings_models_1.webhookValidator} method="post" action={isEditing ? path_1.path.to.webhook(initialValues.id) : path_1.path.to.newWebhook} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Webhook</macro_1.Trans>) : (<macro_1.Trans>New Webhook</macro_1.Trans>)}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>

            <react_1.VStack spacing={4}>
              <form_1.Select name="table" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Table"], ["Table"])))} options={tables}/>
              <react_1.FormControl>
                <react_1.FormLabel>
                  <macro_1.Trans>Notifications</macro_1.Trans>
                </react_1.FormLabel>
                <react_1.VStack>
                  <form_1.Boolean name="onInsert" description={<react_1.Badge variant="green">Insert</react_1.Badge>}/>
                  <form_1.Boolean name="onUpdate" description={<react_1.Badge variant="blue">Update</react_1.Badge>}/>
                  <form_1.Boolean name="onDelete" description={<react_1.Badge variant="red">Delete</react_1.Badge>}/>
                </react_1.VStack>
              </react_1.FormControl>

              <react_1.Separator />

              <form_1.Input name="name" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Name"], ["Name"])))} helperText={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["This is a unique identifier for the webhook"], ["This is a unique identifier for the webhook"])))}/>

              <form_1.Input name="url" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Webhook URL"], ["Webhook URL"])))} helperText={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["The endpoint that receives a POST request with the updated data when the table is updated"], ["The endpoint that receives a POST request with the updated data when the table is updated"])))}/>

              <react_1.Separator />

              <form_1.Boolean name="active" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Active"], ["Active"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={function () { return onClose(); }}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = WebhookForm;
var useWebhookTables = function () {
    var _a, _b;
    var tablesFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        tablesFetcher.load(path_1.path.to.api.webhookTables);
    });
    var tables = (_b = (_a = tablesFetcher.data) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : [];
    var options = tables.map(function (t) { return ({
        value: t.table,
        label: t.name
    }); });
    return options;
};
exports.useWebhookTables = useWebhookTables;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
