"use strict";
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
exports.MaintenanceDispatch = MaintenanceDispatch;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var react_router_1 = require("react-router");
var HighPriorityIcon_1 = require("~/assets/icons/HighPriorityIcon");
var LowPriorityIcon_1 = require("~/assets/icons/LowPriorityIcon");
var MediumPriorityIcon_1 = require("~/assets/icons/MediumPriorityIcon");
var hooks_1 = require("~/hooks");
var models_1 = require("~/services/models");
var path_1 = require("~/utils/path");
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
function getSeverityLabel(severity) {
    switch (severity) {
        case "Preventive":
            return "Preventive";
        case "Operator Performed":
            return "Operator Performed";
        case "Support Required":
            return "Support Required";
        case "OEM Required":
            return "OEM Required";
    }
}
function MaintenanceDispatch(_a) {
    var _this = this;
    var _b, _c;
    var workCenter = _a.workCenter, isOpen = _a.isOpen, onClose = _a.onClose;
    var fetcher = (0, react_router_1.useFetcher)();
    var failureModeFetcher = (0, react_router_1.useFetcher)();
    var companyId = (0, hooks_1.useUser)().company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _d = (0, react_2.useState)({}), content = _d[0], setContent = _d[1];
    var _e = (0, react_2.useState)("Operator Performed"), severity = _e[0], setSeverity = _e[1];
    var _f = (0, react_2.useState)("No Impact"), oeeImpactValue = _f[0], setOeeImpactValue = _f[1];
    var failureModes = (_c = (_b = failureModeFetcher.data) === null || _b === void 0 ? void 0 : _b.data) !== null && _c !== void 0 ? _c : [];
    (0, react_2.useEffect)(function () {
        if (isOpen) {
            failureModeFetcher.load(path_1.path.to.api.failureModes);
        }
    }, [isOpen, failureModeFetcher.load]);
    var handleClose = function () {
        setContent({});
        setSeverity("Operator Performed");
        setOeeImpactValue("No Impact");
        onClose();
    };
    (0, react_2.useEffect)(function () {
        var _a;
        if (fetcher.state === "idle" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.id)) {
            react_1.toast.success("Maintenance dispatch created");
            handleClose();
        }
        // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    }, [fetcher.state, fetcher.data, handleClose]);
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
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
    if (!isOpen)
        return null;
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                handleClose();
        }}>
      <react_1.ModalContent size="xlarge">
        <form_1.ValidatedForm method="post" action={path_1.path.to.newMaintenanceDispatch} validator={models_1.maintenanceDispatchValidator} defaultValues={{
            workCenterId: workCenter.id,
            priority: "Medium",
            severity: "Operator Performed",
            oeeImpact: "No Impact",
            suspectedFailureModeId: undefined,
            actualStartTime: new Date().toISOString(),
            actualEndTime: undefined
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>Maintenance for {workCenter.name}</react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="workCenterId" value={workCenter.id}/>
            <form_1.Hidden name="content" value={JSON.stringify(content)}/>
            <react_1.VStack spacing={4}>
              <div className="flex flex-col gap-2 w-full">
                <react_1.Label>Description</react_1.Label>
                <Editor_1.Editor initialValue={content} onUpload={onUploadImage} onChange={function (value) {
            setContent(value);
        }} className="[&_.is-empty]:text-muted-foreground min-h-[120px] py-3 px-4 border rounded-md w-full"/>
              </div>
              <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 md:grid-cols-2">
                <form_1.Select name="priority" label="Priority" size="lg" options={models_1.maintenanceDispatchPriority.map(function (priority) { return ({
            value: priority,
            label: (<div className="flex gap-1 items-center">
                        {getPriorityIcon(priority)}
                        <span>{priority}</span>
                      </div>)
        }); })}/>
                <form_1.Select name="severity" label="Severity" size="lg" options={models_1.maintenanceSeverity.map(function (s) { return ({
            value: s,
            label: getSeverityLabel(s)
        }); })} onChange={function (option) {
            if (option === null || option === void 0 ? void 0 : option.value) {
                setSeverity(option.value);
            }
        }}/>
                {severity === "Operator Performed" && (<>
                    <form_1.DateTimePicker name="actualStartTime" label="Start Time" size="lg"/>
                    <form_1.DateTimePicker name="actualEndTime" label="End Time" size="lg"/>
                  </>)}
                <form_1.Select name="oeeImpact" label="OEE Impact" size="lg" options={models_1.oeeImpact.map(function (impact) { return ({
            value: impact,
            label: impact
        }); })} onChange={function (option) {
            if (option === null || option === void 0 ? void 0 : option.value) {
                setOeeImpactValue(option.value);
            }
        }}/>
                {(oeeImpactValue === "Down" || oeeImpactValue === "Impact") &&
            failureModes.length > 0 &&
            (severity === "Operator Performed" ? (<form_1.Select name="actualFailureModeId" label="Actual Failure Mode" size="lg" options={failureModes.map(function (mode) { return ({
                    value: mode.id,
                    label: mode.name
                }); })} isClearable/>) : (<form_1.Select name="suspectedFailureModeId" label="Suspected Failure Mode" size="lg" options={failureModes.map(function (mode) { return ({
                    value: mode.id,
                    label: mode.name
                }); })} isClearable/>))}
              </div>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <react_1.Button variant="secondary" size="lg" onClick={handleClose}>
                Cancel
              </react_1.Button>
              <form_1.Submit size="lg">Create Dispatch</form_1.Submit>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
