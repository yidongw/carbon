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
var path_1 = require("~/utils/path");
var account_models_1 = require("../../account.models");
var PasswordForm = function () {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_2.useState)(false), passwordsMatch = _a[0], setPasswordsMatch = _a[1];
    var passwordRef = (0, react_2.useRef)(null);
    var confirmPasswordRef = (0, react_2.useRef)(null);
    var onPasswordChange = function () {
        if (passwordRef.current && confirmPasswordRef.current) {
            setPasswordsMatch(passwordRef.current.value.length >= 6 &&
                confirmPasswordRef.current.value.length >= 6 &&
                passwordRef.current.value === confirmPasswordRef.current.value);
        }
    };
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" action={path_1.path.to.accountPassword} validator={account_models_1.accountPasswordValidator}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Update Password</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <react_1.VStack spacing={4} className="my-4 max-w-[440px]">
            <Form_1.Password name="currentPassword" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Current Password"], ["Current Password"])))}/>
            <Form_1.Password ref={passwordRef} onChange={onPasswordChange} name="password" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Password"], ["New Password"])))}/>
            <Form_1.Password ref={confirmPasswordRef} onChange={onPasswordChange} name="confirmPassword" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Confirm Password"], ["Confirm Password"])))}/>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={!passwordsMatch} withBlocker={false}>
            Update Password
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = PasswordForm;
var templateObject_1, templateObject_2, templateObject_3;
