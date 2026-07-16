"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProcesses = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var ProcessForm_1 = require("~/modules/resources/ui/Processes/ProcessForm");
var path_1 = require("~/utils/path");
var Enumerable_1 = require("../Enumerable");
var ProcessPreview = function (value, options) {
    var _a;
    var process = options.find(function (o) { return o.value === value; });
    return (_a = process === null || process === void 0 ? void 0 : process.label) !== null && _a !== void 0 ? _a : null;
};
var Process = function (_a) {
    var _b;
    var optionsOverride = _a.options, props = __rest(_a, ["options"]);
    var newProcessModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var fetched = (0, exports.useProcesses)();
    var sourceOptions = optionsOverride !== null && optionsOverride !== void 0 ? optionsOverride : fetched;
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={sourceOptions.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })} {...props} inline={props.inline ? ProcessPreview : undefined} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Work Center"} onCreateOption={function (option) {
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
                processType: "Inside",
                defaultStandardFactor: "Minutes/Piece",
                completeAllOnScan: false,
                workCenters: []
            }}/>)}
    </>);
};
Process.displayName = "Process";
exports.default = Process;
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
