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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var ToolForm_1 = require("~/modules/items/ui/Tools/ToolForm");
var stores_1 = require("~/stores");
var ToolPreview = function (value, options) {
    var item = options.find(function (o) { return o.value === value; });
    if (!item)
        return null;
    return (<react_1.VStack spacing={0}>
      <span className="font-medium text-sm">{item.label}</span>
      {item.helper && (<span className="text-xs text-muted-foreground">{item.helper}</span>)}
    </react_1.VStack>);
};
var Tool = function (_a) {
    var name = _a.name, label = _a.label, helperText = _a.helperText, props = __rest(_a, ["name", "label", "helperText"]);
    var tools = (0, stores_1.useTools)();
    var options = (0, react_2.useMemo)(function () {
        var _a;
        return (_a = tools.map(function (item) { return ({
            value: item.id,
            label: item.readableIdWithRevision,
            helper: item.name
        }); })) !== null && _a !== void 0 ? _a : [];
    }, [tools]);
    var newToolsModal = (0, react_1.useDisclosure)();
    var _b = (0, react_2.useState)(""), created = _b[0], setCreated = _b[1];
    var triggerRef = (0, react_2.useRef)(null);
    var _c = (0, form_1.useField)(name), getInputProps = _c.getInputProps, error = _c.error, fieldIsOptional = _c.isOptional;
    var _d = (0, form_1.useControlField)(name), value = _d[0], setValue = _d[1];
    (0, react_2.useEffect)(function () {
        if (props.value !== null && props.value !== undefined)
            setValue(props.value);
    }, [props.value, setValue]);
    var onChange = function (value) {
        var _a, _b, _c;
        if (value) {
            (_a = props === null || props === void 0 ? void 0 : props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, (_b = options.find(function (o) { return o.value === value; })) !== null && _b !== void 0 ? _b : null);
        }
        else {
            (_c = props === null || props === void 0 ? void 0 : props.onChange) === null || _c === void 0 ? void 0 : _c.call(props, null);
        }
    };
    return (<>
      <react_1.FormControl isInvalid={!!error} className="w-full">
        {label && <react_1.FormLabel isOptional={fieldIsOptional}>{label}</react_1.FormLabel>}
        <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={value}/>

        <div className="flex flex-grow tools-start min-w-0">
          <react_1.CreatableCombobox className={(0, react_1.cn)("flex-grow min-w-0")} ref={triggerRef} options={options} {...props} inline={props.inline ? ToolPreview : undefined} inlineAddLabel="Add Tool" value={value === null || value === void 0 ? void 0 : value.replace(/"/g, '\\"')} onChange={function (newValue) {
            var _a, _b;
            setValue((_a = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _a !== void 0 ? _a : "");
            onChange((_b = newValue === null || newValue === void 0 ? void 0 : newValue.replace(/"/g, '\\"')) !== null && _b !== void 0 ? _b : "");
        }} label={label} itemHeight={44} onCreateOption={function (option) {
            newToolsModal.onOpen();
            setCreated(option);
        }}/>
        </div>
        {error ? (<react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>) : (helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>)}
      </react_1.FormControl>
      {newToolsModal.isOpen && (<ToolForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newToolsModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                id: "",
                revision: "0",
                name: created,
                description: "",
                itemTrackingType: "Inventory",
                unitOfMeasureCode: "EA",
                replenishmentSystem: "Buy",
                defaultMethodType: "Pull from Inventory",
                unitCost: 0,
                shelfLifeCalculateFromBom: false,
                tags: []
            }}/>)}
    </>);
};
Tool.displayName = "Tool";
exports.default = Tool;
