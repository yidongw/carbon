"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConfirmMagicLink;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
function ConfirmMagicLink() {
    var t = (0, macro_1.useLingui)().t;
    var params = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var token = params.get("token");
    if (!token) {
        navigate("/");
        return null;
    }
    var getConfirmationURL = function (token) {
        return "".concat(auth_1.SUPABASE_URL, "/auth/v1/verify?token=").concat(token, "&type=magiclink&redirect_to=").concat(window === null || window === void 0 ? void 0 : window.location.origin, "/callback");
    };
    return (<>
      <div className="flex justify-center mb-4">
        <img src={auth_1.CONTROLLED_ENVIRONMENT ? "/flag.png" : "/carbon-logo-mark.svg"} alt={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon Logo"], ["Carbon Logo"])))} className="w-36"/>
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        <react_1.VStack spacing={4} className="items-center justify-center">
          <react_1.Heading size="h3">
            <macro_1.Trans>Let's build something</macro_1.Trans> 🚀
          </react_1.Heading>
          <react_1.Button size="lg" onClick={function () {
            window.location.href = getConfirmationURL(token);
        }}>
            <macro_1.Trans>Log In</macro_1.Trans>
          </react_1.Button>
        </react_1.VStack>
      </div>
    </>);
}
var templateObject_1;
