"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var path_1 = require("~/utils/path");
var account_models_1 = require("../../account.models");
var ProfilePhotoForm_1 = require("./ProfilePhotoForm");
var ProfileForm = function (_a) {
    var _b, _c;
    var user = _a.user;
    var t = (0, macro_1.useLingui)().t;
    var personId = (0, react_router_1.useParams)().personId;
    var isSelf = !personId;
    var fetcher = (0, react_router_1.useFetcher)();
    return (<form_1.ValidatedForm method="post" action={isSelf ? path_1.path.to.profile : path_1.path.to.person(personId)} validator={account_models_1.accountProfileValidator} defaultValues={__assign(__assign({}, user), { phone: (_b = user.phone) !== null && _b !== void 0 ? _b : undefined, number: (_c = user.number) !== null && _c !== void 0 ? _c : undefined })} fetcher={fetcher} className="w-full">
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Profile</macro_1.Trans>
          </react_1.CardTitle>
          <react_1.CardDescription>
            <macro_1.Trans>
              This information will be visible to all users, so be careful what
              you share.
            </macro_1.Trans>
          </react_1.CardDescription>
        </react_1.CardHeader>
        <react_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 w-full">
            <react_1.VStack spacing={4}>
              <Form_1.Input name="email" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Email"], ["Email"])))} isDisabled/>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <Form_1.Input name="firstName" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["First Name"], ["First Name"])))}/>
                <Form_1.Input name="lastName" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Last Name"], ["Last Name"])))}/>
              </div>
              <Form_1.Input name="number" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["ID Number"], ["ID Number"])))}/>
              <Form_1.PhoneInput name="phone" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Phone"], ["Phone"])))}/>
              <Form_1.TextArea name="about" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["About"], ["About"])))} characterLimit={160} className="my-2"/>
              <Form_1.Hidden name="intent" value="about"/>
            </react_1.VStack>
            <ProfilePhotoForm_1.default user={user}/>
          </div>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </react_1.Card>
    </form_1.ValidatedForm>);
};
exports.default = ProfileForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
