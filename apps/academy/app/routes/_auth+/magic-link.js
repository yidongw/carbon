"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ConfirmMagicLink;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
function ConfirmMagicLink() {
    var params = (0, react_router_1.useSearchParams)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var token = params.get("token");
    if (!token) {
        navigate("/");
        return null;
    }
    var getConfirmationURL = function (token) {
        return "".concat(auth_1.SUPABASE_URL, "/auth/v1/verify?token=").concat(encodeURIComponent(token), "&type=magiclink&redirect_to=").concat(encodeURIComponent("".concat(window === null || window === void 0 ? void 0 : window.location.origin, "/callback")));
    };
    return (<>
      <div className="flex justify-center mb-4">
        <img src="/carbon-logo-mark.svg" alt="Carbon Logo" className="w-36"/>
      </div>
      <div className="rounded-lg md:bg-card md:border md:border-border md:shadow-lg p-8 w-[380px]">
        <react_1.VStack spacing={4} className="items-center justify-center">
          <react_1.Heading size="h3">Let&apos;s build something</react_1.Heading>
          <react_1.Button size="lg" className="w-full" onClick={function () {
            window.location.href = getConfirmationURL(token);
        }}>
            Log In
          </react_1.Button>
        </react_1.VStack>
      </div>
    </>);
}
