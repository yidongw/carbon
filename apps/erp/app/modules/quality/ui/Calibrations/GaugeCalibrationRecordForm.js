"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var Gauge_1 = require("~/components/Form/Gauge");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var quality_models_1 = require("../../quality.models");
var GaugeStatus_1 = require("../Gauge/GaugeStatus");
var GaugeCalibrationRecordForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var initialValues = _a.initialValues, _p = _a.open, open = _p === void 0 ? true : _p, files = _a.files, _q = _a.type, type = _q === void 0 ? "drawer" : _q, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var companyId = (0, hooks_1.useUser)().company.id;
    var fetcher = (0, react_router_1.useFetcher)();
    var location = (0, react_router_1.useLocation)();
    var isEditing = !location.pathname.includes("new");
    var isDisabled = isEditing
        ? !permissions.can("update", "quality")
        : !permissions.can("create", "quality");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.authenticatedRoot);
    var isMetric = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.companySettings) === null || _b === void 0 ? void 0 : _b.useMetric) !== null && _c !== void 0 ? _c : false;
    var _r = (0, react_2.useState)(null), selectedGauge = _r[0], setSelectedGauge = _r[1];
    var gaugeSelectionModal = (0, react_1.useDisclosure)({
        defaultIsOpen: !initialValues.gaugeId
    });
    var _s = (0, react_2.useState)(false), loading = _s[0], setLoading = _s[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _t = (0, Gauge_1.useGauges)(), gaugeOptions = _t.options, gaugeTypes = _t.gaugeTypes;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (initialValues.gaugeId) {
            onGaugeSelected(initialValues.gaugeId);
        }
    }, [initialValues.gaugeId]);
    var onGaugeSelected = function (gaugeId) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, react_dom_1.flushSync)(function () {
                        setLoading(true);
                    });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("gauges").select("*").eq("id", gaugeId).single())];
                case 1:
                    result = _a.sent();
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Gauge not found"], ["Gauge not found"]))));
                        setSelectedGauge(null);
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    setSelectedGauge(result.data);
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var _u = (0, react_2.useState)((_e = JSON.parse((_d = initialValues === null || initialValues === void 0 ? void 0 : initialValues.notes) !== null && _d !== void 0 ? _d : {})) !== null && _e !== void 0 ? _e : {}), notes = _u[0], setNotes = _u[1];
    var _v = (0, react_2.useState)(((_f = initialValues === null || initialValues === void 0 ? void 0 : initialValues.calibrationAttempts) === null || _f === void 0 ? void 0 : _f.length) || 0), numAttempts = _v[0], setNumAttempts = _v[1];
    var addAttempt = function () {
        return setNumAttempts(function (old) {
            return old + 1;
        });
    };
    var removeAttempt = function () {
        return setNumAttempts(function (old) {
            return Math.max(0, old - 1);
        });
    };
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/parts/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open && onClose)
                onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm method="post" validator={quality_models_1.gaugeCalibrationRecordValidator} defaultValues={initialValues} fetcher={fetcher} action={isEditing
            ? path_1.path.to.gaugeCalibrationRecord(initialValues.id)
            : path_1.path.to.newGaugeCalibrationRecord} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing
            ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Edit Gauge Calibration Record"], ["Edit Gauge Calibration Record"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["New Gauge Calibration Record"], ["New Gauge Calibration Record"])))}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="type" value={type}/>
              <Form_1.Hidden name="notes" value={JSON.stringify(notes)}/>

              <react_1.VStack spacing={4}>
                <react_1.Card>
                  <react_1.Loading isLoading={loading}>
                    <react_1.HStack className="w-full justify-between">
                      <react_1.CardHeader>
                        <react_1.CardTitle>
                          {(_g = selectedGauge === null || selectedGauge === void 0 ? void 0 : selectedGauge.gaugeId) !== null && _g !== void 0 ? _g : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No Gauge Selected"], ["No Gauge Selected"])))}
                        </react_1.CardTitle>
                        {(selectedGauge === null || selectedGauge === void 0 ? void 0 : selectedGauge.description) && (<react_1.CardDescription>
                            {selectedGauge.description}
                          </react_1.CardDescription>)}
                        <Form_1.Hidden name="gaugeId" value={(_j = (_h = selectedGauge === null || selectedGauge === void 0 ? void 0 : selectedGauge.id) !== null && _h !== void 0 ? _h : initialValues.gaugeId) !== null && _j !== void 0 ? _j : ""}/>
                      </react_1.CardHeader>
                      <react_1.CardAction>
                        <react_1.Button leftIcon={<lu_1.LuDraftingCompass />} variant="secondary" onClick={gaugeSelectionModal.onOpen}>
                          <macro_1.Trans>Select Gauge</macro_1.Trans>
                        </react_1.Button>
                      </react_1.CardAction>
                    </react_1.HStack>
                    <react_1.CardContent>
                      <react_1.VStack>
                        {selectedGauge && (<div className="w-full space-y-2 text-xs">
                            <div className="flex flex-col gap-4 py-2">
                              {selectedGauge.modelNumber && (<div className="flex items-center gap-2">
                                  <lu_1.LuHash className="text-muted-foreground"/>
                                  <span className="font-medium">
                                    <macro_1.Trans>Model Number:</macro_1.Trans>
                                  </span>
                                  <span>
                                    {selectedGauge.modelNumber || "N/A"}
                                  </span>
                                </div>)}
                              {selectedGauge.serialNumber && (<div className="flex items-center gap-2">
                                  <lu_1.LuHash className="text-muted-foreground"/>
                                  <span className="font-medium">
                                    <macro_1.Trans>Serial Number:</macro_1.Trans>
                                  </span>
                                  <span>
                                    {selectedGauge.serialNumber || "N/A"}
                                  </span>
                                </div>)}
                            </div>
                            <div className="flex flex-col gap-4">
                              <div className="flex items-center gap-2">
                                <lu_1.LuShield className="text-muted-foreground"/>
                                <span className="font-medium">
                                  <macro_1.Trans>Role:</macro_1.Trans>
                                </span>
                                <GaugeStatus_1.GaugeRole role={selectedGauge.gaugeRole}/>
                              </div>
                              <div className="flex items-center gap-2">
                                <lu_1.LuShapes className="text-muted-foreground"/>
                                <span className="font-medium">
                                  <macro_1.Trans>Type:</macro_1.Trans>
                                </span>
                                <Enumerable_1.Enumerable value={(_l = (_k = gaugeTypes.find(function (type) {
                return type.id === selectedGauge.gaugeTypeId;
            })) === null || _k === void 0 ? void 0 : _k.name) !== null && _l !== void 0 ? _l : null}/>
                              </div>
                            </div>
                          </div>)}
                      </react_1.VStack>
                    </react_1.CardContent>
                  </react_1.Loading>
                </react_1.Card>
                <form_1.DatePicker name="dateCalibrated" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Date Calibrated"], ["Date Calibrated"])))}/>
                <Form_1.Supplier name="supplierId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Calibration Supplier"], ["Calibration Supplier"])))} isOptional/>
                <form_1.Boolean name="requiresAction" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Requires Action"], ["Requires Action"])))}/>
                <form_1.Boolean name="requiresAdjustment" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Requires Adjustment"], ["Requires Adjustment"])))}/>
                <form_1.Boolean name="requiresRepair" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Requires Repair"], ["Requires Repair"])))}/>
                <form_1.Number name="temperature" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Temperature"], ["Temperature"])))} formatOptions={{
            maximumFractionDigits: 2,
            style: "unit",
            unit: isMetric ? "celsius" : "fahrenheit"
        }}/>
                <form_1.Number name="humidity" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Humidity"], ["Humidity"])))} formatOptions={{
            maximumFractionDigits: 2,
            style: "percent",
            minimumFractionDigits: 0
        }}/>
                <form_1.Input name="measurementStandard" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Measurement Standard"], ["Measurement Standard"])))}/>
                <span className="text-xs font-medium text-muted-foreground">
                  Calibration Attempts
                </span>
                <react_1.Card className="flex-grow px-0">
                  <react_1.Table>
                    <react_1.Tbody>
                      {Array.from({ length: numAttempts }).map(function (_, index) { return (<react_1.Tr key={index}>
                          <react_1.Td>
                            <form_1.Number name={"calibrationAttempts[".concat(index, "].reference")} label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Reference"], ["Reference"])))}/>
                          </react_1.Td>
                          <react_1.Td>
                            <form_1.Number name={"calibrationAttempts[".concat(index, "].actual")} label={t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Actual"], ["Actual"])))}/>
                          </react_1.Td>
                        </react_1.Tr>); })}
                      <react_1.Tr>
                        <react_1.Td colSpan={2} className="text-right">
                          <react_1.Button onClick={addAttempt} className="mr-2">
                            <macro_1.Trans>Add</macro_1.Trans>
                          </react_1.Button>
                          {numAttempts > 0 ? (<react_1.Button onClick={removeAttempt} variant="destructive">
                              <macro_1.Trans>Remove</macro_1.Trans>
                            </react_1.Button>) : null}
                        </react_1.Td>
                      </react_1.Tr>
                    </react_1.Tbody>
                  </react_1.Table>
                </react_1.Card>
                <Form_1.Employee name="approvedBy" label={t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Approved By"], ["Approved By"])))}/>
                <div className="flex flex-col gap-2 w-full">
                  <react_1.Label>
                    <macro_1.Trans>Notes</macro_1.Trans>
                  </react_1.Label>
                  <Editor_1.Editor initialValue={notes} onUpload={onUploadImage} onChange={function (value) {
            setNotes(value);
        }} className="[&_.is-empty]:text-muted-foreground min-h-[120px] py-3 px-4 border rounded-md w-full"/>
                </div>
                <Form_1.CustomFormFields table="gaugeCalibrationRecord"/>
                <components_1.Documents files={files} sourceDocument="Gauge Calibration Record" sourceDocumentId={initialValues.id} writeBucket="quality" writeBucketPermission="quality"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                {onClose && (<react_1.Button size="md" variant="solid" onClick={onClose}>
                    <macro_1.Trans>Cancel</macro_1.Trans>
                  </react_1.Button>)}
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
      {gaugeSelectionModal.isOpen && (<react_1.Modal open={gaugeSelectionModal.isOpen} onOpenChange={function (open) {
                if (!open)
                    gaugeSelectionModal.onClose();
            }}>
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Select Gauge</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <react_1.VStack className="w-full">
                <div className="w-full">
                  <react_1.Combobox options={gaugeOptions} onChange={function (value) {
                onGaugeSelected(value);
                gaugeSelectionModal.onClose();
            }} value={(_o = (_m = selectedGauge === null || selectedGauge === void 0 ? void 0 : selectedGauge.id) !== null && _m !== void 0 ? _m : initialValues.gaugeId) !== null && _o !== void 0 ? _o : undefined} size="lg"/>
                </div>
              </react_1.VStack>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={function () {
                if (selectedGauge &&
                    selectedGauge.id !== initialValues.gaugeId) {
                    onGaugeSelected(initialValues.gaugeId);
                }
                else {
                    setSelectedGauge(null);
                }
                gaugeSelectionModal.onClose();
            }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <react_1.Button onClick={gaugeSelectionModal.onClose}>
                  <macro_1.Trans>Confirm</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </react_1.ModalBody>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </react_1.ModalDrawerProvider>);
};
exports.default = GaugeCalibrationRecordForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16;
