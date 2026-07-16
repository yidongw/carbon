"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectionFromInitialValues = selectionFromInitialValues;
exports.ProductionActorFields = ProductionActorFields;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Avatar_1 = require("~/components/Avatar");
var Form_1 = require("~/components/Form");
var SupplierProcess_1 = require("~/components/Form/SupplierProcess");
var operationType_1 = require("~/modules/production/operationType");
var Supplier_1 = require("~/modules/purchasing/ui/Supplier");
var Employees_1 = require("~/modules/users/ui/Employees");
var stores_1 = require("~/stores");
var EMPLOYEE_PREFIX = "employee:";
var SUPPLIER_PREFIX = "supplier:";
function encodeActorSelection(kind, id) {
    return kind === "employee"
        ? "".concat(EMPLOYEE_PREFIX).concat(id)
        : "".concat(SUPPLIER_PREFIX).concat(id);
}
function decodeActorSelection(value) {
    if (!value)
        return null;
    if (value.startsWith(EMPLOYEE_PREFIX)) {
        return { kind: "employee", id: value.slice(EMPLOYEE_PREFIX.length) };
    }
    if (value.startsWith(SUPPLIER_PREFIX)) {
        return { kind: "supplier", id: value.slice(SUPPLIER_PREFIX.length) };
    }
    return null;
}
function selectionFromInitialValues(_a) {
    var employeeId = _a.employeeId, supplierProcessId = _a.supplierProcessId;
    if (employeeId === null || employeeId === void 0 ? void 0 : employeeId.trim()) {
        return encodeActorSelection("employee", employeeId.trim());
    }
    if (supplierProcessId === null || supplierProcessId === void 0 ? void 0 : supplierProcessId.trim()) {
        return encodeActorSelection("supplier", supplierProcessId.trim());
    }
    return "";
}
function ProductionActorFields(_a) {
    var processId = _a.processId, operationType = _a.operationType, defaultActorKind = _a.defaultActorKind, lockActorSelection = _a.lockActorSelection, _b = _a.isDisabled, isDisabledProp = _b === void 0 ? false : _b, employeeIdValue = _a.employeeIdValue, supplierProcessIdValue = _a.supplierProcessIdValue, supplierIdValue = _a.supplierIdValue, onActorKindChange = _a.onActorKindChange, onSupplierProcessChange = _a.onSupplierProcessChange, onEmployeeChange = _a.onEmployeeChange, onSelectionChange = _a.onSelectionChange;
    var t = (0, macro_1.useLingui)().t;
    var newSupplierProcessModal = (0, react_1.useDisclosure)();
    var newEmployeeModal = (0, react_1.useDisclosure)();
    var triggerRef = (0, react_2.useRef)(null);
    var resolvedDefault = defaultActorKind !== null && defaultActorKind !== void 0 ? defaultActorKind : (operationType
        ? (0, operationType_1.defaultActorKindFromOperationType)(operationType)
        : "employee");
    var showSupplierActors = (0, operationType_1.allowsSupplierQuantityActor)(operationType);
    var initialSelection = (0, react_2.useMemo)(function () {
        return selectionFromInitialValues({
            employeeId: employeeIdValue,
            supplierProcessId: supplierProcessIdValue
        });
    }, [employeeIdValue, supplierProcessIdValue]);
    var _c = (0, react_2.useState)(initialSelection), selection = _c[0], setSelection = _c[1];
    var _d = (0, react_2.useState)(function () {
        var _a;
        var decoded = decodeActorSelection(initialSelection);
        return (_a = decoded === null || decoded === void 0 ? void 0 : decoded.kind) !== null && _a !== void 0 ? _a : resolvedDefault;
    }), actorKind = _d[0], setActorKind = _d[1];
    var _e = (0, react_2.useState)(employeeIdValue !== null && employeeIdValue !== void 0 ? employeeIdValue : ""), employeeId = _e[0], setEmployeeId = _e[1];
    var _f = (0, react_2.useState)(supplierProcessIdValue !== null && supplierProcessIdValue !== void 0 ? supplierProcessIdValue : ""), supplierProcessId = _f[0], setSupplierProcessId = _f[1];
    var _g = (0, stores_1.usePeople)(), people = _g[0], setPeople = _g[1];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    var supplierProcesses = (0, SupplierProcess_1.useSupplierProcesses)({
        processId: processId !== null && processId !== void 0 ? processId : undefined
    });
    var openCreateSupplierProcess = (0, react_2.useCallback)(function () {
        newSupplierProcessModal.onOpen();
    }, [newSupplierProcessModal.onOpen]);
    var openCreateEmployee = (0, react_2.useCallback)(function () {
        newEmployeeModal.onOpen();
    }, [newEmployeeModal.onOpen]);
    (0, react_2.useEffect)(function () {
        setSelection(initialSelection);
        onSelectionChange === null || onSelectionChange === void 0 ? void 0 : onSelectionChange(initialSelection);
        var decoded = decodeActorSelection(initialSelection);
        if (decoded) {
            setActorKind(decoded.kind);
            if (decoded.kind === "employee") {
                setEmployeeId(decoded.id);
                setSupplierProcessId("");
                onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange("");
                onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange(decoded.id);
            }
            else {
                setSupplierProcessId(decoded.id);
                setEmployeeId("");
                onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange(decoded.id);
                onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange("");
            }
            onActorKindChange === null || onActorKindChange === void 0 ? void 0 : onActorKindChange(decoded.kind);
            return;
        }
        setActorKind(resolvedDefault);
        setEmployeeId("");
        setSupplierProcessId("");
        onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange("");
        onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange("");
        onActorKindChange === null || onActorKindChange === void 0 ? void 0 : onActorKindChange(resolvedDefault);
    }, [
        initialSelection,
        resolvedDefault,
        onActorKindChange,
        onSupplierProcessChange,
        onEmployeeChange,
        onSelectionChange
    ]);
    (0, react_2.useEffect)(function () {
        if (lockActorSelection ||
            defaultActorKind !== undefined ||
            !operationType) {
            return;
        }
        var next = (0, operationType_1.defaultActorKindFromOperationType)(operationType);
        if (selection) {
            var decoded = decodeActorSelection(selection);
            if ((decoded === null || decoded === void 0 ? void 0 : decoded.kind) === next)
                return;
            setSelection("");
            setEmployeeId("");
            setSupplierProcessId("");
            onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange("");
            onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange("");
        }
        setActorKind(next);
        onActorKindChange === null || onActorKindChange === void 0 ? void 0 : onActorKindChange(next);
    }, [
        operationType,
        lockActorSelection,
        defaultActorKind,
        selection,
        onActorKindChange,
        onSupplierProcessChange,
        onEmployeeChange
    ]);
    (0, react_2.useEffect)(function () {
        if (lockActorSelection || showSupplierActors || !selection) {
            return;
        }
        var decoded = decodeActorSelection(selection);
        if ((decoded === null || decoded === void 0 ? void 0 : decoded.kind) !== "supplier") {
            return;
        }
        setSelection("");
        setEmployeeId("");
        setSupplierProcessId("");
        setActorKind("employee");
        onActorKindChange === null || onActorKindChange === void 0 ? void 0 : onActorKindChange("employee");
    }, [lockActorSelection, onActorKindChange, selection, showSupplierActors]);
    var groups = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f, _g;
        var employeeOptions = (_a = people.map(function (person) { return ({
            value: encodeActorSelection("employee", person.id),
            label: (<div className="flex flex-row items-center gap-2 flex-grow">
            <Avatar_1.default name={person.name} path={person.avatarUrl} size="xs"/>
            <span>
              {person.name}
              {person.number ? " (".concat(person.number, ")") : ""}
            </span>
          </div>)
        }); })) !== null && _a !== void 0 ? _a : [];
        var pinnedEmployeeId = employeeId === null || employeeId === void 0 ? void 0 : employeeId.trim();
        if (pinnedEmployeeId) {
            var pinnedValue_1 = encodeActorSelection("employee", pinnedEmployeeId);
            if (!employeeOptions.some(function (option) { return option.value === pinnedValue_1; })) {
                var person = people.find(function (p) { return p.id === pinnedEmployeeId; });
                employeeOptions.unshift({
                    value: pinnedValue_1,
                    label: (<div className="flex flex-row items-center gap-2 flex-grow">
              <Avatar_1.default name={(_b = person === null || person === void 0 ? void 0 : person.name) !== null && _b !== void 0 ? _b : ""} path={(_c = person === null || person === void 0 ? void 0 : person.avatarUrl) !== null && _c !== void 0 ? _c : null} size="xs"/>
              <span>
                {(_d = person === null || person === void 0 ? void 0 : person.name) !== null && _d !== void 0 ? _d : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Employee"], ["Employee"])))}
                {(person === null || person === void 0 ? void 0 : person.number) ? " (".concat(person.number, ")") : ""}
              </span>
            </div>)
                });
            }
        }
        var supplierOptions = supplierProcesses.map(function (supplierProcess) {
            var _a, _b;
            var supplier = suppliers.find(function (s) { return s.id === supplierProcess.supplierId; });
            var imageUrl = (supplier === null || supplier === void 0 ? void 0 : supplier.website)
                ? (0, utils_1.getFaviconUrl)(supplier.website)
                : undefined;
            return {
                label: (<div className="flex flex-row items-center gap-2 flex-grow">
            <Avatar_1.default name={(_a = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _a !== void 0 ? _a : ""} imageUrl={imageUrl} size="xs"/>
            <span>{(_b = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _b !== void 0 ? _b : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Unknown Supplier"], ["Unknown Supplier"])))}</span>
          </div>),
                value: encodeActorSelection("supplier", supplierProcess.id)
            };
        });
        var pinnedSupplierProcessId = supplierProcessIdValue === null || supplierProcessIdValue === void 0 ? void 0 : supplierProcessIdValue.trim();
        if (pinnedSupplierProcessId) {
            var pinnedValue_2 = encodeActorSelection("supplier", pinnedSupplierProcessId);
            if (!supplierOptions.some(function (option) { return option.value === pinnedValue_2; })) {
                var fromProcess = supplierProcesses.find(function (sp) { return sp.id === pinnedSupplierProcessId; });
                var resolvedSupplierId_1 = (_e = fromProcess === null || fromProcess === void 0 ? void 0 : fromProcess.supplierId) !== null && _e !== void 0 ? _e : supplierIdValue;
                var supplier = resolvedSupplierId_1
                    ? suppliers.find(function (s) { return s.id === resolvedSupplierId_1; })
                    : undefined;
                var imageUrl = (supplier === null || supplier === void 0 ? void 0 : supplier.website)
                    ? (0, utils_1.getFaviconUrl)(supplier.website)
                    : undefined;
                supplierOptions.unshift({
                    label: (<div className="flex flex-row items-center gap-2 flex-grow">
              <Avatar_1.default name={(_f = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _f !== void 0 ? _f : ""} imageUrl={imageUrl} size="xs"/>
              <span>{(_g = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _g !== void 0 ? _g : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Unknown Supplier"], ["Unknown Supplier"])))}</span>
            </div>),
                    value: pinnedValue_2
                });
            }
        }
        return __spreadArray([
            {
                id: "employee",
                heading: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Employees"], ["Employees"]))),
                options: employeeOptions,
                createLabel: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Create employee"], ["Create employee"]))),
                onCreateOption: lockActorSelection ? undefined : openCreateEmployee
            }
        ], (showSupplierActors
            ? [
                {
                    id: "supplier",
                    heading: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Suppliers"], ["Suppliers"]))),
                    options: supplierOptions,
                    createLabel: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Create supplier"], ["Create supplier"]))),
                    onCreateOption: lockActorSelection || !processId
                        ? undefined
                        : openCreateSupplierProcess
                }
            ]
            : []), true).filter(function (group) {
            if (!lockActorSelection)
                return true;
            return group.id === actorKind;
        });
    }, [
        people,
        employeeId,
        supplierProcesses,
        suppliers,
        supplierProcessIdValue,
        supplierIdValue,
        lockActorSelection,
        actorKind,
        processId,
        openCreateEmployee,
        openCreateSupplierProcess,
        showSupplierActors,
        t
    ]);
    var applySelection = function (value) {
        setSelection(value);
        onSelectionChange === null || onSelectionChange === void 0 ? void 0 : onSelectionChange(value);
        var decoded = decodeActorSelection(value);
        if (!decoded) {
            setEmployeeId("");
            setSupplierProcessId("");
            onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange("");
            onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange("");
            setActorKind(resolvedDefault);
            onActorKindChange === null || onActorKindChange === void 0 ? void 0 : onActorKindChange(resolvedDefault);
            return;
        }
        setActorKind(decoded.kind);
        onActorKindChange === null || onActorKindChange === void 0 ? void 0 : onActorKindChange(decoded.kind);
        if (decoded.kind === "employee") {
            setEmployeeId(decoded.id);
            setSupplierProcessId("");
            onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange("");
            onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange(decoded.id);
        }
        else {
            setSupplierProcessId(decoded.id);
            setEmployeeId("");
            onSupplierProcessChange === null || onSupplierProcessChange === void 0 ? void 0 : onSupplierProcessChange(decoded.id);
            onEmployeeChange === null || onEmployeeChange === void 0 ? void 0 : onEmployeeChange("");
        }
    };
    var handleChange = function (option) {
        var _a;
        applySelection((_a = option === null || option === void 0 ? void 0 : option.value) !== null && _a !== void 0 ? _a : "");
    };
    return (<div className="w-full">
      <form_1.GroupedCreatableCombobox ref={triggerRef} name="productionActorSelection" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Name"], ["Name"])))} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Select name"], ["Select name"])))} groups={groups} value={selection} onChange={handleChange} isReadOnly={lockActorSelection || isDisabledProp}/>
      <Form_1.Hidden name="actorKind" value={actorKind}/>
      <Form_1.Hidden name="employeeId" value={employeeId}/>
      <Form_1.Hidden name="supplierProcessId" value={supplierProcessId}/>
      {newSupplierProcessModal.isOpen && processId && (<Supplier_1.SupplierProcessForm type="modal" onClose={function () {
                var _a;
                newSupplierProcessModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                processId: processId,
                supplierId: "",
                minimumCost: 0,
                unitCost: 0,
                leadTime: 0
            }}/>)}
      {newEmployeeModal.isOpen && (<Employees_1.CreateEmployeeModal type="modal" onClose={function () {
                var _a;
                newEmployeeModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} onSuccess={function (_a) {
                var userId = _a.userId, firstName = _a.firstName, lastName = _a.lastName;
                var name = "".concat(firstName, " ").concat(lastName).trim();
                setPeople(function (current) {
                    if (current.some(function (person) { return person.id === userId; })) {
                        return current;
                    }
                    return __spreadArray(__spreadArray([], current, true), [{ id: userId, name: name, avatarUrl: null }], false).sort(function (a, b) { return a.name.localeCompare(b.name); });
                });
                applySelection(encodeActorSelection("employee", userId));
            }}/>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
