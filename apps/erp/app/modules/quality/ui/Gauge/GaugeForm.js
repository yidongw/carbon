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
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var GaugeStatus_1 = require("./GaugeStatus");
var GaugeForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, gaugeTypes = _a.gaugeTypes, records = _a.records, _c = _a.open, open = _c === void 0 ? true : _c, _d = _a.type, type = _d === void 0 ? "drawer" : _d, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var formatRelativeTime = (0, hooks_1.useDateFormatter)().formatRelativeTime;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var navigate = (0, react_router_1.useNavigate)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "quality")
        : !permissions.can("create", "quality");
    var _e = (0, react_2.useState)({
        lastCalibrationDate: initialValues.lastCalibrationDate,
        nextCalibrationDate: initialValues.nextCalibrationDate,
        calibrationIntervalInMonths: (_b = initialValues.calibrationIntervalInMonths) !== null && _b !== void 0 ? _b : 6
    }), calibrationInterval = _e[0], setCalibrationInterval = _e[1];
    var _f = (0, react_2.useState)("gauge"), activeTab = _f[0], setActiveTab = _f[1];
    return (<>
      <react_1.ModalDrawerProvider type={type}>
        <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open && onClose)
                onClose();
        }}>
          <react_1.ModalDrawerContent size="lg">
            <react_1.Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
              <form_1.ValidatedForm method="post" validator={quality_models_1.gaugeValidator} defaultValues={initialValues} fetcher={fetcher} action={isEditing
            ? path_1.path.to.gauge(initialValues.id)
            : path_1.path.to.newGauge} className="flex flex-col h-full">
                <react_1.ModalDrawerHeader className="flex flex-col gap-4">
                  <react_1.HStack className="w-full justify-between pr-8">
                    <react_1.VStack>
                      <react_1.ModalDrawerTitle>
                        {isEditing ? "".concat(initialValues.gaugeId) : "New Gauge"}
                      </react_1.ModalDrawerTitle>
                      <react_1.ModalDrawerDescription>
                        {isEditing ? initialValues.description : undefined}
                      </react_1.ModalDrawerDescription>
                    </react_1.VStack>

                    {isEditing && (<div>
                        <react_1.TabsList>
                          <react_1.TabsTrigger value="gauge">
                            <macro_1.Trans>Details</macro_1.Trans>
                          </react_1.TabsTrigger>
                          <react_1.TabsTrigger value="records">
                            <macro_1.Trans>Calibration Records</macro_1.Trans>
                          </react_1.TabsTrigger>
                        </react_1.TabsList>
                      </div>)}
                  </react_1.HStack>
                </react_1.ModalDrawerHeader>
                <react_1.ModalDrawerBody className="w-full">
                  <Form_1.Hidden name="id"/>
                  <Form_1.Hidden name="type" value={type}/>

                  {isEditing ? (<>
                      <react_1.TabsContent value="gauge" className="w-full">
                        <GaugeFormContent isEditing={isEditing} gaugeTypes={gaugeTypes} initialValues={initialValues} calibrationInterval={calibrationInterval} setCalibrationInterval={setCalibrationInterval}/>
                      </react_1.TabsContent>
                      <react_1.TabsContent value="records" className="w-full flex flex-col gap-4">
                        <div className="flex justify-end">
                          <react_1.Button leftIcon={<lu_1.LuCirclePlus />} onClick={function () {
                return navigate("".concat(path_1.path.to.newGaugeCalibrationRecord, "?gaugeId=").concat(initialValues.id));
            }}>
                            <macro_1.Trans>Add Calibration Record</macro_1.Trans>
                          </react_1.Button>
                        </div>
                        {records && (<react_2.Suspense fallback={null}>
                            <react_router_1.Await resolve={records}>
                              {function (resolvedRecords) { return (<react_1.VStack spacing={4} className="w-full">
                                  {Array.isArray(resolvedRecords.data) &&
                        resolvedRecords.data.length > 0 ? (<div className="border rounded-lg w-full">
                                      {resolvedRecords.data.map(function (record, index) {
                            var _a, _b;
                            var isUpdated = record.updatedBy !== null;
                            var person = isUpdated
                                ? record.updatedBy
                                : record.createdBy;
                            var date = isUpdated
                                ? record.updatedAt
                                : record.createdAt;
                            return (<div key={record.id} className={(0, react_1.cn)("border-b p-6", index ===
                                    ((_b = (_a = resolvedRecords.data) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) -
                                        1 && "border-none")}>
                                              <div className="flex flex-1 justify-between items-center w-full">
                                                <react_1.HStack spacing={4} className="w-1/2">
                                                  <react_1.HStack spacing={4} className="flex-1">
                                                    <div className={(0, react_1.cn)("rounded-full flex items-center justify-center p-2", record.inspectionStatus ===
                                    "Pass"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400")}>
                                                      <lu_1.LuCircleGauge className="size-4"/>
                                                    </div>
                                                    <react_1.VStack spacing={0}>
                                                      <p className="text-foreground text-sm font-medium">
                                                        {record.inspectionStatus}
                                                      </p>
                                                      <span className="text-xs text-muted-foreground">
                                                        Calibration Record
                                                      </span>
                                                    </react_1.VStack>
                                                  </react_1.HStack>
                                                </react_1.HStack>
                                                <div className="flex items-center justify-end gap-2">
                                                  <react_1.HStack spacing={2}>
                                                    <span className="text-xs text-muted-foreground">
                                                      {date
                                    ? isUpdated
                                        ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Updated"], ["Updated"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Created"], ["Created"])))
                                    : null}{" "}
                                                      {date
                                    ? formatRelativeTime(date)
                                    : null}
                                                    </span>
                                                    <components_1.EmployeeAvatar employeeId={person} withName={false}/>
                                                  </react_1.HStack>
                                                  <react_1.DropdownMenu>
                                                    <react_1.DropdownMenuTrigger asChild>
                                                      <react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Open menu"], ["Open menu"])))} icon={<lu_1.LuEllipsisVertical />} variant="ghost"/>
                                                    </react_1.DropdownMenuTrigger>
                                                    <react_1.DropdownMenuContent align="end">
                                                      <react_1.DropdownMenuItem asChild>
                                                        <react_router_1.Link to={path_1.path.to.gaugeCalibrationRecord(record.id)}>
                                                          View
                                                        </react_router_1.Link>
                                                      </react_1.DropdownMenuItem>
                                                    </react_1.DropdownMenuContent>
                                                  </react_1.DropdownMenu>
                                                </div>
                                              </div>
                                            </div>);
                        })}
                                    </div>) : (<div className="py-16 w-full">
                                      <components_1.Empty title={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["No calibration records found"], ["No calibration records found"])))}/>
                                    </div>)}
                                </react_1.VStack>); }}
                            </react_router_1.Await>
                          </react_2.Suspense>)}
                      </react_1.TabsContent>
                    </>) : (<GaugeFormContent isEditing={isEditing} gaugeTypes={gaugeTypes} initialValues={initialValues} calibrationInterval={calibrationInterval} setCalibrationInterval={setCalibrationInterval}/>)}
                </react_1.ModalDrawerBody>
                <react_1.ModalDrawerFooter>
                  <react_1.HStack>
                    <Form_1.Submit isDisabled={isDisabled}>
                      <macro_1.Trans>Save</macro_1.Trans>
                    </Form_1.Submit>
                    {onClose && (<react_1.Button size="md" variant="solid" onClick={onClose}>
                        <macro_1.Trans>Cancel</macro_1.Trans>
                      </react_1.Button>)}
                  </react_1.HStack>
                </react_1.ModalDrawerFooter>
              </form_1.ValidatedForm>
            </react_1.Tabs>
          </react_1.ModalDrawerContent>
        </react_1.ModalDrawer>
      </react_1.ModalDrawerProvider>
    </>);
};
function GaugeFormContent(_a) {
    var isEditing = _a.isEditing, gaugeTypes = _a.gaugeTypes, initialValues = _a.initialValues, calibrationInterval = _a.calibrationInterval, setCalibrationInterval = _a.setCalibrationInterval;
    var t = (0, macro_1.useLingui)().t;
    return (<react_1.VStack spacing={4}>
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2">
        {isEditing ? (<Form_1.Input name="gaugeId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Gauge ID"], ["Gauge ID"])))} isReadOnly/>) : (<Form_1.SequenceOrCustomId name="gaugeId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Gauge ID"], ["Gauge ID"])))} table="gauge"/>)}
        <Form_1.Input name="description" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Description"], ["Description"])))}/>
        <form_1.Select name="gaugeTypeId" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Gauge Type"], ["Gauge Type"])))} options={gaugeTypes.map(function (type) { return ({
            label: <Enumerable_1.Enumerable value={type.name}/>,
            value: type.id
        }); })}/>
        <Form_1.Supplier name="supplierId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Manufacturer"], ["Manufacturer"])))}/>
        <Form_1.Input name="modelNumber" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Model Number"], ["Model Number"])))}/>
        <Form_1.Input name="serialNumber" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Serial Number"], ["Serial Number"])))}/>
        {/* <Select
          name="gaugeCalibrationStatus"
          label={t`Calibration Status`}
          options={gaugeCalibrationStatus.map((status) => ({
            label: <GaugeCalibrationStatus status={status} />,
            value: status,
          }))}
        /> */}
        <form_1.Select name="gaugeRole" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Role"], ["Role"])))} options={quality_models_1.gaugeRole.map(function (role) { return ({
            label: <GaugeStatus_1.GaugeRole role={role}/>,
            value: role
        }); })}/>
        <form_1.DatePicker name="dateAcquired" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Date Acquired"], ["Date Acquired"])))}/>
        {/* <Select
          name="gaugeStatus"
          label={t`Status`}
          options={gaugeStatus.map((status) => ({
            label: <GaugeStatus status={status} />,
            value: status,
          }))}
        /> */}
        <form_1.DatePicker name="lastCalibrationDate" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Last Calibration Date"], ["Last Calibration Date"])))} value={calibrationInterval.lastCalibrationDate} onChange={function (value) {
            setCalibrationInterval(__assign(__assign({}, calibrationInterval), { lastCalibrationDate: value === null || value === void 0 ? void 0 : value.toString(), nextCalibrationDate: value
                    ? (0, date_1.parseDate)(value === null || value === void 0 ? void 0 : value.toString())
                        .add({
                        months: calibrationInterval.calibrationIntervalInMonths
                    })
                        .toString()
                    : undefined }));
        }}/>
        <form_1.DatePicker name="nextCalibrationDate" label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Next Calibration Date"], ["Next Calibration Date"])))} value={calibrationInterval.nextCalibrationDate} onChange={function (value) {
            setCalibrationInterval(__assign(__assign({}, calibrationInterval), { nextCalibrationDate: value === null || value === void 0 ? void 0 : value.toString() }));
        }}/>
        <Form_1.Location name="locationId" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Location"], ["Location"])))}/>
        <Form_1.StorageUnit name="storageUnitId" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Storage Unit"], ["Storage Unit"])))} locationId={initialValues.locationId}/>
        <Form_1.CustomFormFields table="gauge"/>
      </div>
      <div className="border bg-muted/30 rounded-lg p-4 relative w-full">
        <lu_1.LuCalendar className="absolute top-2 right-4 text-muted-foreground"/>
        <Form_1.NumberControlled name="calibrationIntervalInMonths" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Calibration Interval (Months)"], ["Calibration Interval (Months)"])))} value={calibrationInterval.calibrationIntervalInMonths} onChange={function (value) {
            setCalibrationInterval(__assign(__assign({}, calibrationInterval), { calibrationIntervalInMonths: value, nextCalibrationDate: calibrationInterval.lastCalibrationDate
                    ? (0, date_1.parseDate)(calibrationInterval.lastCalibrationDate)
                        .add({
                        months: value
                    })
                        .toString()
                    : undefined }));
        }}/>
      </div>
    </react_1.VStack>);
}
exports.default = GaugeForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18;
