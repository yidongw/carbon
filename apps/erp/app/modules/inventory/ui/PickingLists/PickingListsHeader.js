"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickingListsHeader = PickingListsHeader;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Location_1 = require("~/components/Form/Location");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var cardSettings = [
    { key: "showStatus", label: "Status" },
    { key: "showDueDate", label: "Due Date" },
    { key: "showDuration", label: "Duration" },
    { key: "showProgress", label: "Progress" },
    { key: "showCustomer", label: "Customer" },
    { key: "showSalesOrder", label: "Sales Order" },
    { key: "showDescription", label: "Description" },
    { key: "showQuantity", label: "Quantity" },
    { key: "showThumbnail", label: "Thumbnail" }
];
function PickingListsHeader(_a) {
    var locationId = _a.locationId, displaySettings = _a.displaySettings, onDisplaySettingChange = _a.onDisplaySettingChange, _b = _a.selectedJobOperationIds, selectedJobOperationIds = _b === void 0 ? [] : _b;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var locations = (0, Location_1.useLocations)();
    return (<react_1.HStack className="px-4 py-2 justify-between bg-card border-b border-border w-full">
      <react_1.HStack>
        <react_1.Button variant="secondary" leftIcon={<lu_1.LuClipboardList />} asChild>
          <react_router_1.Link to={path_1.path.to.pickingListsTable}>
            <macro_1.Trans>View Lists</macro_1.Trans>
          </react_router_1.Link>
        </react_1.Button>
        <components_1.SearchFilter param="search" size="sm" placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Search"], ["Search"])))}/>
      </react_1.HStack>

      <react_1.HStack>
        {selectedJobOperationIds.length > 0 && (<react_router_1.Form method="post" action={path_1.path.to.newPickingList}>
            <input type="hidden" name="locationId" value={locationId}/>
            {selectedJobOperationIds.map(function (id) { return (<input key={id} type="hidden" name="jobOperationIds[]" value={id}/>); })}
            <react_1.Button type="submit" leftIcon={<lu_1.LuPackagePlus />} isDisabled={!permissions.can("create", "inventory")}>
              <macro_1.Trans>Generate Picking List</macro_1.Trans>{" "}
              {selectedJobOperationIds.length}
            </react_1.Button>
          </react_router_1.Form>)}

        <react_1.Popover>
          <react_1.PopoverTrigger asChild>
            <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Settings"], ["Settings"])))} icon={<lu_1.LuSettings2 />} variant="secondary" className="border-dashed border-border"/>
          </react_1.PopoverTrigger>
          <react_1.PopoverContent className="w-64" align="end">
            <react_1.VStack spacing={3}>
              <span className="text-xs font-medium text-muted-foreground">
                <macro_1.Trans>Location</macro_1.Trans>
              </span>
              <div className="w-full">
                <react_1.Combobox asButton size="sm" value={locationId} options={locations} onChange={function (selected) {
            // hard refresh because initialValues update has no effect otherwise
            window.location.href = "".concat(path_1.path.to.pickingSchedule, "?location=").concat(selected);
        }}/>
              </div>

              {displaySettings && onDisplaySettingChange && (<>
                  <react_1.Separator />
                  <span className="text-xs font-medium text-muted-foreground">
                    <macro_1.Trans>Cards</macro_1.Trans>
                  </span>
                  <react_1.VStack>
                    {cardSettings.map(function (_a) {
                var key = _a.key, label = _a.label;
                return (<react_1.Switch key={key} variant="small" label={label} checked={displaySettings[key]} onCheckedChange={function (checked) {
                        return onDisplaySettingChange(key, checked);
                    }}/>);
            })}
                  </react_1.VStack>
                </>)}
            </react_1.VStack>
          </react_1.PopoverContent>
        </react_1.Popover>
      </react_1.HStack>
    </react_1.HStack>);
}
var templateObject_1, templateObject_2;
