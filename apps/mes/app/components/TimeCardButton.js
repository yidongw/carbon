"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeCardButton = TimeCardButton;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function formatElapsed(since) {
    var ms = Date.now() - new Date(since).getTime();
    var hours = Math.floor(ms / 3600000);
    var minutes = Math.floor((ms % 3600000) / 60000);
    return "".concat(hours, "h ").concat(minutes, "m");
}
function TimeCardButton(_a) {
    var _b;
    var openClockEntry = _a.openClockEntry;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _c = (0, react_1.useSidebar)(), isMobile = _c.isMobile, setOpenMobile = _c.setOpenMobile;
    var pathname = (0, react_router_1.useLocation)().pathname;
    var _d = (0, react_2.useState)(0), setTick = _d[1];
    var isClockedIn = openClockEntry !== null ||
        (((_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("intent")) === "clockIn" && fetcher.state !== "idle");
    (0, react_2.useEffect)(function () {
        if (!openClockEntry)
            return;
        var interval = setInterval(function () { return setTick(function (t) { return t + 1; }); }, 60000);
        return function () { return clearInterval(interval); };
    }, [openClockEntry]);
    var handleClockOut = function () {
        if (isMobile)
            setOpenMobile(false);
        var formData = new FormData();
        formData.append("intent", "clockOut");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.timecard
        });
    };
    var handleClockIn = function () {
        if (isMobile)
            setOpenMobile(false);
        var formData = new FormData();
        formData.append("intent", "clockIn");
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.timecard
        });
    };
    var isOnTimeCardPage = pathname.includes("/timecard");
    return (<>
      {isClockedIn ? (<react_1.SidebarMenuItem>
          <react_1.SidebarMenuButton tooltip={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Clock Out"], ["Clock Out"])))} onClick={handleClockOut} disabled={fetcher.state !== "idle"} className="font-medium">
            <lu_1.LuSquare className="size-4"/>
            <span>
              <macro_1.Trans>Clock Out</macro_1.Trans>
            </span>
            {openClockEntry && (<react_1.Badge variant="red" className="ml-auto">
                {formatElapsed(openClockEntry.clockIn)}
              </react_1.Badge>)}
          </react_1.SidebarMenuButton>
        </react_1.SidebarMenuItem>) : (<react_1.SidebarMenuItem>
          <react_1.SidebarMenuButton tooltip={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Clock In"], ["Clock In"])))} onClick={handleClockIn} disabled={fetcher.state !== "idle"} className="font-medium">
            <lu_1.LuPlay className="size-4"/>
            <span>
              <macro_1.Trans>Clock In</macro_1.Trans>
            </span>
          </react_1.SidebarMenuButton>
        </react_1.SidebarMenuItem>)}

      <react_1.SidebarMenuItem>
        <react_1.SidebarMenuButton tooltip={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["My Hours"], ["My Hours"])))} isActive={isOnTimeCardPage} asChild>
          <react_router_1.Link to={path_1.path.to.timeCardPage} onClick={function () { return isMobile && setOpenMobile(false); }}>
            <lu_1.LuClock />
            <span>
              <macro_1.Trans>My Hours</macro_1.Trans>
            </span>
          </react_router_1.Link>
        </react_1.SidebarMenuButton>
      </react_1.SidebarMenuItem>
    </>);
}
var templateObject_1, templateObject_2, templateObject_3;
