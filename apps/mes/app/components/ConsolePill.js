"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolePill = ConsolePill;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var PinInOverlay_1 = require("./PinInOverlay");
function ConsolePill(_a) {
    var _b;
    var user = _a.user, companyId = _a.companyId, locationEmployeeIds = _a.locationEmployeeIds, sessionUserId = _a.sessionUserId;
    var _c = (0, react_2.useState)(false), open = _c[0], setOpen = _c[1];
    var revalidator = (0, react_router_1.useRevalidator)();
    var handleDismiss = function () {
        setOpen(false);
        // Revalidate the layout to pick up cookie changes (pin-in/pin-out)
        revalidator.revalidate();
    };
    return (<>
      <button type="button" onClick={function () { return setOpen(true); }} className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-full border bg-card/90 backdrop-blur-md px-3 py-1.5 shadow-lg transition-all duration-200 hover:shadow-xl active:scale-[0.98] select-none">
        <react_1.Avatar size="xs" name={user.name} src={(_b = user.avatarUrl) !== null && _b !== void 0 ? _b : undefined}/>
        <span className="text-xs font-medium max-w-[130px] truncate">
          {user.name}
        </span>
        <lu_1.LuChevronDown className="h-3 w-3 text-muted-foreground"/>
      </button>

      {open && (<PinInOverlay_1.PinInOverlay companyId={companyId} locationEmployeeIds={locationEmployeeIds} sessionUserId={sessionUserId} hasPinnedUser={!!user} dismissable onDismiss={handleDismiss}/>)}
    </>);
}
