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
var bs_1 = require("react-icons/bs");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var productionLabels_1 = require("~/modules/production/productionLabels");
var path_1 = require("~/utils/path");
var resources_models_1 = require("../../resources.models");
var MaintenanceOeeImpact_1 = require("./MaintenanceOeeImpact");
var MaintenanceSeverity_1 = require("./MaintenanceSeverity");
var MaintenanceSource_1 = require("./MaintenanceSource");
function getPriorityIcon(priority) {
    switch (priority) {
        case "Critical":
            return <bs_1.BsExclamationSquareFill className="text-red-500"/>;
        case "High":
            return <HighPriorityIcon_1.HighPriorityIcon />;
        case "Medium":
            return <MediumPriorityIcon_1.MediumPriorityIcon />;
        case "Low":
            return <LowPriorityIcon_1.LowPriorityIcon />;
    }
}
var MaintenanceDispatchForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, _d = _a.failureModes, failureModes = _d === void 0 ? [] : _d;
    var t = (0, macro_1.useLingui)().t;
    var getMaintenanceDispatchPriorityLabel = (0, productionLabels_1.useMaintenanceDispatchPriorityLabel)();
    var permissions = (0, hooks_1.usePermissions)();
    var companyId = (0, hooks_1.useUser)().company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var isEditing = initialValues.id !== undefined;
    var routeData = (0, hooks_1.useRouteData)(initialValues.id ? path_1.path.to.maintenanceDispatch(initialValues.id) : "");
    var isLocked = (0, resources_models_1.isMaintenanceDispatchLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.dispatch) === null || _b === void 0 ? void 0 : _b.status);
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    var _e = (0, react_2.useState)((initialValues === null || initialValues === void 0 ? void 0 : initialValues.content)
        ? JSON.parse(initialValues.content)
        : {}), content = _e[0], setContent = _e[1];
    var _f = (0, react_2.useState)((_c = initialValues === null || initialValues === void 0 ? void 0 : initialValues.oeeImpact) !== null && _c !== void 0 ? _c : "No Impact"), oeeImpactValue = _f[0], setOeeImpactValue = _f[1];
    var showFailureModes = oeeImpactValue === "Down" || oeeImpactValue === "Impact";
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/maintenance/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error("Failed to upload image");
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    return (<react_1.Card>
      <form_1.ValidatedForm validator={resources_models_1.maintenanceDispatchValidator} method="post" action={path_1.path.to.newMaintenanceDispatch} defaultValues={initialValues} isDisabled={isEditing && isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            {isEditing ? (<macro_1.Trans>Edit Maintenance Dispatch</macro_1.Trans>) : (<macro_1.Trans>New Maintenance Dispatch</macro_1.Trans>)}
          </react_1.CardTitle>
          {!isEditing && (<react_1.CardDescription>
              <macro_1.Trans>
                Create a new maintenance dispatch to track equipment repairs and
                maintenance activities
              </macro_1.Trans>
            </react_1.CardDescription>)}
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="id"/>
          <Form_1.Hidden name="status" value="Open"/>
          <Form_1.Hidden name="content" value={JSON.stringify(content)}/>
          <react_1.VStack>
            <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 md:grid-cols-2">
              <div className="md:col-span-2 flex flex-col gap-2 w-full">
                <react_1.Label>
                  <macro_1.Trans>Description</macro_1.Trans>
                </react_1.Label>
                <Editor_1.Editor initialValue={content} onUpload={onUploadImage} onChange={function (value) {
            setContent(value);
        }} className="[&_.is-empty]:text-muted-foreground min-h-[120px] py-3 px-4 border rounded-md w-full"/>
              </div>
              <form_1.Select name="priority" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Priority"], ["Priority"])))} options={resources_models_1.maintenanceDispatchPriority.map(function (priority) { return ({
            value: priority,
            label: (<div className="flex gap-1 items-center">
                      {getPriorityIcon(priority)}
                      <span>
                        {getMaintenanceDispatchPriorityLabel(priority)}
                      </span>
                    </div>)
        }); })}/>
              <form_1.Select name="source" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Source"], ["Source"])))} options={resources_models_1.maintenanceSource.map(function (source) { return ({
            value: source,
            label: <MaintenanceSource_1.default source={source}/>
        }); })}/>
              <form_1.Select name="severity" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Severity"], ["Severity"])))} options={resources_models_1.maintenanceSeverity.map(function (severity) { return ({
            value: severity,
            label: <MaintenanceSeverity_1.default severity={severity}/>
        }); })}/>
              <Form_1.WorkCenter name="workCenterId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Work Center"], ["Work Center"])))}/>
              <Form_1.Location name="locationId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Location"], ["Location"])))}/>
              <form_1.Select name="oeeImpact" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["OEE Impact"], ["OEE Impact"])))} options={resources_models_1.oeeImpact.map(function (impact) { return ({
            value: impact,
            label: <MaintenanceOeeImpact_1.default oeeImpact={impact}/>
        }); })} onChange={function (option) {
            if (option === null || option === void 0 ? void 0 : option.value) {
                setOeeImpactValue(option.value);
            }
        }}/>
              <form_1.DateTimePicker name="plannedStartTime" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Planned Start Time"], ["Planned Start Time"])))}/>
              <form_1.DateTimePicker name="plannedEndTime" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Planned End Time"], ["Planned End Time"])))}/>
              {showFailureModes ? (<form_1.Select name="suspectedFailureModeId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Suspected Failure Mode"], ["Suspected Failure Mode"])))} options={failureModes.map(function (mode) { return ({
                value: mode.id,
                label: mode.name
            }); })} isClearable/>) : (<div />)}
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={isDisabled}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = MaintenanceDispatchForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
