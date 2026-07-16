"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCostCenters = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var useUser_1 = require("~/hooks/useUser");
var CostCenterForm_1 = require("~/modules/accounting/ui/CostCenters/CostCenterForm");
var path_1 = require("~/utils/path");
var CostCenter = function (props) {
    var _a;
    var userId = (0, useUser_1.useUser)().id;
    var newCostCenterModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useCostCenters)();
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Cost Center"} onCreateOption={function (option) {
            newCostCenterModal.onOpen();
            setCreated(option);
        }}/>
      {newCostCenterModal.isOpen && (<CostCenterForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newCostCenterModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                ownerId: userId
            }}/>)}
    </>);
};
CostCenter.displayName = "CostCenter";
exports.default = CostCenter;
var useCostCenters = function () {
    var costCenterFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        costCenterFetcher.load(path_1.path.to.api.costCenters);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = costCenterFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = costCenterFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [costCenterFetcher.data]);
    return options;
};
exports.useCostCenters = useCostCenters;
