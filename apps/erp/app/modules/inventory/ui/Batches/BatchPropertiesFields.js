"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchPropertiesFields = BatchPropertiesFields;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
function PropertyField(_a) {
    var _b;
    var property = _a.property, value = _a.value, isReadOnly = _a.isReadOnly, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    var _c = (0, react_2.useState)(value || ""), localTextValue = _c[0], setLocalTextValue = _c[1];
    (0, react_2.useEffect)(function () {
        setLocalTextValue(value);
    }, [value]);
    switch (property.dataType) {
        case "numeric":
            return (<div className="space-y-2">
          <react_1.Label className="flex items-center gap-2 font-normal text-xs text-muted-foreground" htmlFor={property.id}>
            <lu_1.LuHash />
            {property.label}
          </react_1.Label>
          <react_1.NumberField isDisabled={isReadOnly} onChange={function (val) { return onChange(Number(val)); }} value={value}>
            <react_1.NumberInputGroup className="relative">
              <react_1.NumberInput id={property.id}/>
              <react_1.NumberInputStepper>
                <react_1.NumberIncrementStepper>
                  <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
                </react_1.NumberIncrementStepper>
                <react_1.NumberDecrementStepper>
                  <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
                </react_1.NumberDecrementStepper>
              </react_1.NumberInputStepper>
            </react_1.NumberInputGroup>
          </react_1.NumberField>
        </div>);
        case "text":
            return (<div className="space-y-2">
          <react_1.Label className="flex items-center gap-2 font-normal text-xs text-muted-foreground" htmlFor={property.id}>
            <lu_1.LuText />
            {property.label}
          </react_1.Label>
          <react_1.Input id={property.id} type="text" isDisabled={isReadOnly} value={localTextValue} onChange={function (e) { return setLocalTextValue(e.target.value); }} onBlur={function () { return onChange(localTextValue); }} className="w-full"/>
        </div>);
        case "list":
            return (<div className="space-y-2">
          <react_1.Label className="flex items-center gap-2 font-normal text-xs text-muted-foreground" htmlFor={property.id}>
            <lu_1.LuList />
            {property.label}
          </react_1.Label>
          <react_1.Select disabled={isReadOnly} value={value} onValueChange={function (val) { return onChange(val); }}>
            <react_1.SelectTrigger id={property.id}>
              <react_1.SelectValue placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select an option"], ["Select an option"])))}/>
            </react_1.SelectTrigger>
            <react_1.SelectContent>
              {(_b = property.listOptions) === null || _b === void 0 ? void 0 : _b.map(function (option) { return (<react_1.SelectItem key={option} value={option}>
                  {option}
                </react_1.SelectItem>); })}
            </react_1.SelectContent>
          </react_1.Select>
        </div>);
        case "boolean":
            return (<div className="flex flex-col items-start gap-2">
          <react_1.Label className="flex items-center gap-2 font-normal text-xs text-muted-foreground" htmlFor={property.id}>
            <lu_1.LuToggleRight />
            {property.label}
          </react_1.Label>
          <react_1.Switch id={property.id} disabled={isReadOnly} checked={value || false} onCheckedChange={function (val) { return onChange(val); }} className="mt-1"/>
        </div>);
        case "date":
            return (<div className="space-y-2">
          <react_1.Label className="flex items-center gap-2 font-normal text-xs text-muted-foreground" htmlFor={property.id}>
            <lu_1.LuCalendar />
            {property.label}
          </react_1.Label>
          <react_1.DatePicker isDisabled={isReadOnly} value={value ? (0, date_1.parseDate)(value) : undefined} onChange={function (val) { var _a; return onChange((_a = val === null || val === void 0 ? void 0 : val.toString()) !== null && _a !== void 0 ? _a : ""); }}/>
        </div>);
        default:
            return null;
    }
}
function BatchPropertiesFields(_a) {
    var properties = _a.properties, values = _a.values, _b = _a.isReadOnly, isReadOnly = _b === void 0 ? false : _b, onChange = _a.onChange;
    return properties.map(function (property) {
        var _a;
        return (<PropertyField key={property.id} property={property} value={(_a = values[property.id]) !== null && _a !== void 0 ? _a : getDefaultValue(property.dataType)} isReadOnly={isReadOnly} onChange={function (value) {
                var _a;
                onChange(__assign(__assign({}, values), (_a = {}, _a[property.id] = value, _a)));
            }}/>);
    });
}
function getDefaultValue(dataType) {
    switch (dataType) {
        case "boolean":
            return false;
        case "numeric":
            return 0;
        default:
            return "";
    }
}
var templateObject_1;
