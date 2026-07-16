"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProcesses = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var ProcessForm_1 = require("~/modules/resources/ui/Processes/ProcessForm");
var path_1 = require("~/utils/path");
var Processes = function (props) {
    var _a;
    var newProcessModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useProcesses)();
    return (<>
      <form_1.CreatableMultiSelect ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Work Center"} onCreateOption={function (option) {
            newProcessModal.onOpen();
            setCreated(option);
        }}/>
      {newProcessModal.isOpen && (<ProcessForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newProcessModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                defaultStandardFactor: "Minutes/Piece",
                processType: "Inside",
                workCenters: [],
                completeAllOnScan: false
            }}/>)}
    </>);
};
Processes.displayName = "Process";
exports.default = Processes;
var useProcesses = function () {
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        fetcher.load(path_1.path.to.api.processes);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [fetcher.data]);
    return options;
};
exports.useProcesses = useProcesses;
