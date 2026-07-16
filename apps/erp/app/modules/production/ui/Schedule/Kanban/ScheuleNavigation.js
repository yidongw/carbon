"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleNavigation = ScheduleNavigation;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function ScheduleNavigation() {
    var location = (0, react_router_1.useLocation)();
    var navigate = (0, react_router_1.useNavigate)();
    var getCurrentView = function () {
        if (location.pathname.includes(path_1.path.to.scheduleOperation))
            return "operations";
        if (location.pathname.includes(path_1.path.to.scheduleDates)) {
            if (location.search.includes("view=month")) {
                return "month";
            }
            // Default to week for scheduleDates path (whether view=week or no view param)
            return "week";
        }
        return "operations";
    };
    var currentValue = getCurrentView();
    var getViewLabel = function (option) {
        switch (option) {
            case "operations":
                return "Work Centers";
            case "week":
                return "Week";
            case "month":
                return "Month";
            default:
                return "";
        }
    };
    var getViewIcon = function (option) {
        switch (option) {
            case "operations":
                return <lu_1.LuCog />;
            case "week":
                return <lu_1.LuCalendarDays />;
            case "month":
                return <lu_1.LuCalendar />;
            default:
                return <lu_1.LuList />;
        }
    };
    var navigateToView = function (view) {
        var searchParams = new URLSearchParams(location.search);
        switch (view) {
            case "operations":
                navigate(path_1.path.to.scheduleOperation + "?" + searchParams.toString());
                break;
            case "week":
                searchParams.set("view", "week");
                navigate(path_1.path.to.scheduleDates + "?" + searchParams.toString());
                break;
            case "month":
                searchParams.set("view", "month");
                navigate(path_1.path.to.scheduleDates + "?" + searchParams.toString());
                break;
        }
    };
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.Button leftIcon={getViewIcon(currentValue)} rightIcon={<lu_1.LuChevronDown />} variant="secondary">
          {getViewLabel(currentValue)}
        </react_1.Button>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent className="w-56">
        <react_1.DropdownMenuRadioGroup value={currentValue} onValueChange={navigateToView}>
          <react_1.DropdownMenuLabel>
            <macro_1.Trans>Operations</macro_1.Trans>
          </react_1.DropdownMenuLabel>
          <react_1.DropdownMenuRadioItem value="operations">
            <react_1.DropdownMenuIcon icon={getViewIcon("operations")}/>
            {getViewLabel("operations")}
          </react_1.DropdownMenuRadioItem>
          <react_1.DropdownMenuSeparator />
          <react_1.DropdownMenuGroup>
            <react_1.DropdownMenuLabel>
              <macro_1.Trans>Jobs</macro_1.Trans>
            </react_1.DropdownMenuLabel>
            <react_1.DropdownMenuRadioItem value="week">
              <react_1.DropdownMenuIcon icon={getViewIcon("week")}/>
              {getViewLabel("week")}
            </react_1.DropdownMenuRadioItem>
            <react_1.DropdownMenuRadioItem value="month">
              <react_1.DropdownMenuIcon icon={getViewIcon("month")}/>
              {getViewLabel("month")}
            </react_1.DropdownMenuRadioItem>
          </react_1.DropdownMenuGroup>
        </react_1.DropdownMenuRadioGroup>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
}
