"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var PermissionMatrix_1 = require("~/components/PermissionMatrix");
var hooks_1 = require("~/hooks");
var usePermissionMatrix_1 = require("~/hooks/usePermissionMatrix");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var ApiKeyForm = function (_a) {
    var initialValues = _a.initialValues, companyId = _a.companyId, existingScopes = _a.existingScopes, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = !permissions.can("update", "users");
    var _b = (0, react_2.useState)(null), key = _b[0], setKey = _b[1];
    var initialScopeState = (0, react_2.useMemo)(function () {
        return isEditing
            ? (0, usePermissionMatrix_1.fromApiKeyScopes)(existingScopes, settings_1.apiKeyPermissionModules)
            : (0, usePermissionMatrix_1.fromApiKeyScopes)(null, settings_1.apiKeyPermissionModules);
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [existingScopes, isEditing]);
    var matrix = (0, usePermissionMatrix_1.usePermissionMatrix)({
        modules: settings_1.apiKeyPermissionModules,
        initialState: initialScopeState
    });
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.key) {
            setKey(fetcher.data.key);
        }
    }, [fetcher.data]);
    // Serialize scopes to JSONB format for form submission
    var scopesJsonb = companyId
        ? JSON.stringify((0, usePermissionMatrix_1.toApiKeyScopes)(matrix.permissions, companyId))
        : "{}";
    return (<>
      <react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalContent size="xlarge">
          <form_1.ValidatedForm validator={settings_1.apiKeyValidator} method="post" action={isEditing ? path_1.path.to.apiKey(initialValues.id) : path_1.path.to.newApiKey} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                {isEditing ? (<macro_1.Trans>Edit API Key</macro_1.Trans>) : (<macro_1.Trans>New API Key</macro_1.Trans>)}
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody className="max-h-[70dvh] overflow-y-auto">
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="scopes" value={scopesJsonb}/>
              <react_1.VStack spacing={4}>
                <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>

                <form_1.DateTimePicker name="expiresAt" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Expires At (optional)"], ["Expires At (optional)"])))} minValue={(0, date_1.toCalendarDateTime)((0, date_1.today)((0, date_1.getLocalTimeZone)()))}/>

                <PermissionMatrix_1.default matrix={matrix}/>
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose(); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalFooter>
          </form_1.ValidatedForm>
        </react_1.ModalContent>
      </react_1.Modal>
      {key && <ApiKeyView apiKey={key} onClose={onClose}/>}
    </>);
};
exports.default = ApiKeyForm;
function ApiKeyView(_a) {
    var apiKey = _a.apiKey, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(null), copied = _b[0], setCopied = _b[1];
    (0, react_2.useEffect)(function () {
        if (!copied)
            return;
        var timer = setTimeout(function () { return setCopied(null); }, 2000);
        return function () { return clearTimeout(timer); };
    }, [copied]);
    var ERP_URL = (0, auth_1.getBrowserEnv)().ERP_URL;
    var mcpCommand = "claude mcp add --transport http \\\n  carbon ".concat(ERP_URL, "/api/mcp \\\n  --header \"Authorization: Bearer ").concat(apiKey, "\"");
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>API Key</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.VStack spacing={4}>
            <react_1.Alert variant="info">
              <lu_1.LuLock className="w-4 h-4"/>
              <react_1.AlertTitle>
                <macro_1.Trans>You can only see this key once. Store it safely.</macro_1.Trans>
              </react_1.AlertTitle>
            </react_1.Alert>
            <div className="flex flex-col gap-2 w-full">
              <react_1.Label htmlFor="api-key">
                <macro_1.Trans>API Key</macro_1.Trans>
              </react_1.Label>
              <react_1.InputGroup>
                <react_1.Input id="api-key" value={apiKey}/>
                <react_1.InputRightElement className="w-[2.75rem]">
                  <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy API Key"], ["Copy API Key"])))} icon={copied === "key" ? <lu_1.LuCheck /> : <lu_1.LuClipboard />} variant="ghost" onClick={function () {
            (0, string_1.copyToClipboard)(apiKey, function () {
                setCopied("key");
            });
        }}/>
                </react_1.InputRightElement>
              </react_1.InputGroup>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <react_1.Label htmlFor="mcp-command">
                <macro_1.Trans>MCP Command</macro_1.Trans>
              </react_1.Label>
              <react_1.InputGroup>
                <react_1.Input id="mcp-command" value={mcpCommand}/>
                <react_1.InputRightElement className="w-[2.75rem]">
                  <react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Copy MCP Command"], ["Copy MCP Command"])))} icon={copied === "mcp" ? <lu_1.LuCheck /> : <lu_1.LuClipboard />} variant="ghost" onClick={function () {
            (0, string_1.copyToClipboard)(mcpCommand, function () {
                setCopied("mcp");
            });
        }}/>
                </react_1.InputRightElement>
              </react_1.InputGroup>
            </div>
          </react_1.VStack>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.HStack>
            <react_1.Button size="md" variant="solid" onClick={function () {
            onClose();
        }}>
              <macro_1.Trans>Close</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
