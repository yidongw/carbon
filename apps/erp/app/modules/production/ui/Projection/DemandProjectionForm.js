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
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var production_models_1 = require("../../production.models");
var DemandProjectionsForm = function (_a) {
    var _b, _c, _d;
    var propInitialValues = _a.initialValues, _e = _a.isEditing, isEditing = _e === void 0 ? false : _e, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var loaderData = (0, react_router_1.useLoaderData)();
    var periods = (_b = loaderData === null || loaderData === void 0 ? void 0 : loaderData.periods) !== null && _b !== void 0 ? _b : [];
    var initialValues = (_d = (_c = loaderData === null || loaderData === void 0 ? void 0 : loaderData.initialValues) !== null && _c !== void 0 ? _c : propInitialValues) !== null && _d !== void 0 ? _d : __assign({ itemId: "", locationId: "" }, Object.fromEntries(Array.from({ length: 52 }, function (_, i) { return ["week".concat(i), 0]; })));
    var isDisabled = isEditing
        ? !permissions.can("update", "production")
        : !permissions.can("create", "production");
    // Generate week labels based on periods
    var startDate = (0, date_1.startOfWeek)((0, date_1.today)((0, date_1.getLocalTimeZone)()), "en-US");
    var weekLabels = Array.from({ length: 52 }, function (_, i) {
        var weekDate = startDate.add({ weeks: i });
        return "Week ".concat(i + 1, " (").concat(weekDate.month, "/").concat(weekDate.day, ")");
    });
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={production_models_1.demandProjectionValidator} method="post" action={isEditing
            ? path_1.path.to.demandProjection(initialValues.itemId, initialValues.locationId)
            : path_1.path.to.newDemandProjection} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.CardTitle>
              {isEditing ? "Edit" : "New"} Production Projection
            </react_1.CardTitle>
            <react_1.CardDescription>
              Set demand projection values for each week
            </react_1.CardDescription>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <div>
              {/* Hidden fields for periods */}
              {periods === null || periods === void 0 ? void 0 : periods.map(function (period, index) { return (<Form_1.Hidden key={period.id} name={"periods[".concat(index, "]")} value={period.id}/>); })}
            </div>
            <react_1.VStack spacing={4}>
              <Form_1.Item name="itemId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Item"], ["Item"])))} type="Part" replenishmentSystem="Make" isReadOnly={isEditing} locationId={initialValues.locationId || undefined}/>
              <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"])))} isReadOnly={isEditing}/>

              {weekLabels.map(function (label, index) { return (<Form_1.Number key={index} name={"week".concat(index)} label={label} minValue={0}/>); })}
            </react_1.VStack>
          </react_1.DrawerBody>

          <react_1.DrawerFooter>
            <react_1.HStack className="justify-end">
              <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || isDisabled}>
                {isEditing ? "Update" : "Create"} Projection
              </Form_1.Submit>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = DemandProjectionsForm;
var templateObject_1, templateObject_2;
