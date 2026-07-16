"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkCenters = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var WorkCenterForm_1 = require("~/modules/resources/ui/WorkCenters/WorkCenterForm");
var path_1 = require("~/utils/path");
var WorkCenters = function (props) {
    var _a, _b;
    var newWorkCenterModal = (0, react_1.useDisclosure)();
    var defaults = (0, hooks_1.useUser)().defaults;
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useWorkCenters)();
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Work Center"} onCreateOption={function (option) {
            newWorkCenterModal.onOpen();
            setCreated(option);
        }}/>
      {newWorkCenterModal.isOpen && (<WorkCenterForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newWorkCenterModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} showProcesses={false} initialValues={{
                name: created,
                description: "",
                overheadRate: 0,
                laborRate: 0,
                locationId: (_b = defaults === null || defaults === void 0 ? void 0 : defaults.locationId) !== null && _b !== void 0 ? _b : "",
                machineRate: 0,
                processes: (props === null || props === void 0 ? void 0 : props.processId) ? [props.processId] : [],
                defaultStandardFactor: "Minutes/Piece"
            }}/>)}
    </>);
};
WorkCenters.displayName = "WorkCenter";
exports.default = WorkCenters;
var useWorkCenters = function () {
    var workCenterFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        workCenterFetcher.load(path_1.path.to.api.workCenters);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = workCenterFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = workCenterFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [workCenterFetcher.data]);
    return options;
};
exports.useWorkCenters = useWorkCenters;
