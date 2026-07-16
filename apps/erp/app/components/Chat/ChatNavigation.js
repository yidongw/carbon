"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatNavigation = ChatNavigation;
var store_1 = require("@ai-sdk-tools/store");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var useChatInterface_1 = require("./hooks/useChatInterface");
function ChatNavigation() {
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var reset = (0, store_1.useChatActions)().reset;
    var isChatPage = (0, useChatInterface_1.useChatInterface)().isChatPage;
    var handleBack = function () {
        reset();
        navigate(path_1.path.to.authenticatedRoot);
    };
    if (!isChatPage)
        return null;
    return (<div className="absolute left-0">
      <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Back to home"], ["Back to home"])))} variant="ghost" onClick={handleBack} icon={<lu_1.LuArrowLeft />}/>
    </div>);
}
var templateObject_1;
