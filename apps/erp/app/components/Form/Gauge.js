"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGauges = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var GaugeForm_1 = require("~/modules/quality/ui/Gauge/GaugeForm");
var path_1 = require("~/utils/path");
var Gauge = function (props) {
    var _a, _b;
    var newGaugeModal = (0, react_1.useDisclosure)();
    var _c = (0, react_2.useState)(""), created = _c[0], setCreated = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var _d = (0, exports.useGauges)(), options = _d.options, gaugeTypes = _d.gaugeTypes;
    var defaults = (0, hooks_1.useUser)().defaults;
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Gauge"} onCreateOption={function (option) {
            newGaugeModal.onOpen();
            setCreated(option);
        }}/>
      {newGaugeModal.isOpen && (<GaugeForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newGaugeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} gaugeTypes={gaugeTypes} initialValues={{
                id: undefined,
                gaugeId: undefined,
                supplierId: "",
                modelNumber: "",
                serialNumber: "",
                description: created,
                dateAcquired: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                gaugeTypeId: "",
                lastCalibrationDate: "",
                nextCalibrationDate: "",
                locationId: (_b = defaults.locationId) !== null && _b !== void 0 ? _b : "",
                storageUnitId: "",
                calibrationIntervalInMonths: 6,
                gaugeRole: "Standard"
            }}/>)}
    </>);
};
Gauge.displayName = "Gauge";
exports.default = Gauge;
var useGauges = function () {
    var _a, _b;
    var gaugeFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        gaugeFetcher.load(path_1.path.to.api.gauges);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = gaugeFetcher.data) === null || _a === void 0 ? void 0 : _a.gauges)
            ? (_b = gaugeFetcher.data) === null || _b === void 0 ? void 0 : _b.gauges.map(function (c) {
                var _a;
                return ({
                    value: c.id,
                    label: c.name,
                    helper: (_a = c.description) !== null && _a !== void 0 ? _a : undefined
                });
            })
            : [];
    }, [gaugeFetcher.data]);
    return { options: options, gaugeTypes: (_b = (_a = gaugeFetcher.data) === null || _a === void 0 ? void 0 : _a.gaugeTypes) !== null && _b !== void 0 ? _b : [] };
};
exports.useGauges = useGauges;
