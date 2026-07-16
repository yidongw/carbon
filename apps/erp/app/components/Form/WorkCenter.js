"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkCenters = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Enumerable_1 = require("~/components/Enumerable");
var hooks_1 = require("~/hooks");
var WorkCenterForm_1 = require("~/modules/resources/ui/WorkCenters/WorkCenterForm");
var path_1 = require("~/utils/path");
var WorkCenterPreview = function (value, options) {
    var _a;
    var workCenter = options.find(function (o) { return o.value === value; });
    return (_a = workCenter === null || workCenter === void 0 ? void 0 : workCenter.label) !== null && _a !== void 0 ? _a : null;
};
var WorkCenter = function (props) {
    var _a, _b, _c;
    var newWorkCenterModal = (0, react_1.useDisclosure)();
    var defaults = (0, hooks_1.useUser)().defaults;
    var _d = (0, react_2.useState)(""), created = _d[0], setCreated = _d[1];
    var triggerRef = (0, react_2.useRef)(null);
    var _e = (0, exports.useWorkCenters)({
        processId: props === null || props === void 0 ? void 0 : props.processId,
        locationId: props === null || props === void 0 ? void 0 : props.locationId
    }), options = _e.options, workCenterFetcher = _e.workCenterFetcher;
    return (<>
      <form_1.CreatableCombobox autoSelectSingleOption={(props === null || props === void 0 ? void 0 : props.autoSelectSingleOption) &&
            Boolean(props === null || props === void 0 ? void 0 : props.processId) &&
            options.length === 1 &&
            workCenterFetcher.state === "idle"} ref={triggerRef} options={options.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })} {...props} inline={props.inline ? WorkCenterPreview : undefined} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Work Center"} onCreateOption={function (option) {
            newWorkCenterModal.onOpen();
            setCreated(option);
        }}/>
      {newWorkCenterModal.isOpen && (<WorkCenterForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newWorkCenterModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                description: "",
                overheadRate: 0,
                laborRate: 0,
                locationId: (_c = (_b = props === null || props === void 0 ? void 0 : props.locationId) !== null && _b !== void 0 ? _b : defaults === null || defaults === void 0 ? void 0 : defaults.locationId) !== null && _c !== void 0 ? _c : "",
                machineRate: 0,
                processes: (props === null || props === void 0 ? void 0 : props.processId) ? [props.processId] : [],
                defaultStandardFactor: "Minutes/Piece"
            }}/>)}
    </>);
};
WorkCenter.displayName = "WorkCenter";
exports.default = WorkCenter;
var useWorkCenters = function (args) {
    var processId = args.processId, locationId = args.locationId;
    var workCenterFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        workCenterFetcher.load(path_1.path.to.api.workCenters);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = workCenterFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = workCenterFetcher.data) === null || _b === void 0 ? void 0 : _b.data.filter(function (f) {
                var _a, _b;
                if (processId && locationId) {
                    return (((_a = f.processes) !== null && _a !== void 0 ? _a : []).includes(processId) &&
                        f.locationId === locationId);
                }
                if (processId) {
                    return ((_b = f.processes) !== null && _b !== void 0 ? _b : []).includes(processId);
                }
                if (locationId) {
                    return f.locationId === locationId;
                }
                return true;
            }).map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [workCenterFetcher.data, processId, locationId]);
    return { options: options, workCenterFetcher: workCenterFetcher };
};
exports.useWorkCenters = useWorkCenters;
