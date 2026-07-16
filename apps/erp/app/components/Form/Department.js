"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDepartments = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var DepartmentForm_1 = require("~/modules/people/ui/Departments/DepartmentForm");
var path_1 = require("~/utils/path");
var Department = function (props) {
    var _a;
    var newDepartmentModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useDepartments)();
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options} {...props} label={(_a = props === null || props === void 0 ? void 0 : props.label) !== null && _a !== void 0 ? _a : "Department"} onCreateOption={function (option) {
            newDepartmentModal.onOpen();
            setCreated(option);
        }}/>
      {newDepartmentModal.isOpen && (<DepartmentForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newDepartmentModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created
            }}/>)}
    </>);
};
Department.displayName = "Department";
exports.default = Department;
var useDepartments = function () {
    var departmentFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        departmentFetcher.load(path_1.path.to.api.departments);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = departmentFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = departmentFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: c.name
            }); })
            : [];
    }, [departmentFetcher.data]);
    return options;
};
exports.useDepartments = useDepartments;
