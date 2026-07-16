"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var AvatarMenu_1 = require("../../AvatarMenu");
var Breadcrumbs_1 = require("./Breadcrumbs");
var CreateMenu_1 = require("./CreateMenu");
var Notifications_1 = require("./Notifications");
var Search_1 = require("./Search");
var Suggestion_1 = require("./Suggestion");
var TopbarContext_1 = require("./TopbarContext");
var Topbar = function () {
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var location = (0, react_router_1.useLocation)();
    var permissions = (0, hooks_1.usePermissions)();
    var user = (0, hooks_1.useUser)();
    var notificationsKey = "".concat(user.id, ":").concat(user.company.id);
    var onDashboard = location.pathname === path_1.path.to.authenticatedRoot;
    var isMobile = (0, react_1.useIsMobile)();
    var _a = (0, TopbarContext_1.useTopbarLeft)(), setLeftSlotEl = _a.setLeftSlotEl, hasDetailTopbar = _a.hasDetailTopbar;
    var hideBreadcrumbsOnMobile = isMobile && hasDetailTopbar;
    return (<div className="h-[49px] flex items-center bg-background text-foreground px-4 top-0 sticky z-10 gap-2">
      <div className="flex items-center flex-1 min-w-0 gap-1">
        <div className="md:hidden flex-shrink-0">
          {!onDashboard ? (<react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Back"], ["Back"])))} icon={<lu_1.LuArrowLeft />} variant="ghost" onClick={function () { return navigate(-1); }}/>) : null}
        </div>
        <div data-breadcrumbs className={(0, react_1.cn)("flex items-center min-w-0 flex-shrink", hideBreadcrumbsOnMobile && "hidden")}>
          <Breadcrumbs_1.default />
        </div>
        {/* Portal target — detail identity renders after breadcrumbs */}
        <div data-topbar-slot ref={setLeftSlotEl} className="flex flex-1 items-center min-w-0 overflow-visible"/>
      </div>
      <react_1.HStack spacing={1} className="flex-shrink-0 py-2">
        {permissions.is("employee") ? <Search_1.default /> : null}
        <div className="hidden md:block">
          <Suggestion_1.default />
        </div>
        <CreateMenu_1.default trigger={<react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Create"], ["Create"])))} icon={<lu_1.LuSquarePen />} variant="ghost"/>}/>
        <Notifications_1.default key={notificationsKey}/>
        <AvatarMenu_1.default />
      </react_1.HStack>
    </div>);
};
exports.default = Topbar;
var templateObject_1, templateObject_2;
