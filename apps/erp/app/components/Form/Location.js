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
exports.useLocations = void 0;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var LocationForm_1 = require("~/modules/resources/ui/Locations/LocationForm");
var path_1 = require("~/utils/path");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
var Enumerable_1 = require("../Enumerable");
var LocationPreview = function (value, options) {
    var _a;
    var location = options.find(function (o) { return o.value === value; });
    if (!location)
        return null;
    return (_a = location === null || location === void 0 ? void 0 : location.label) !== null && _a !== void 0 ? _a : null;
};
var Location = function (_a) {
    var _b, _c;
    var _d = _a.inline, inline = _d === void 0 ? false : _d, props = __rest(_a, ["inline"]);
    var newLocationModal = (0, react_1.useDisclosure)();
    var _e = (0, react_2.useState)(""), created = _e[0], setCreated = _e[1];
    var triggerRef = (0, react_2.useRef)(null);
    var options = (0, exports.useLocations)();
    var company = (0, hooks_1.useUser)().company;
    return (<>
      <form_1.CreatableCombobox ref={triggerRef} options={options.map(function (o) { return ({
            value: o.value,
            label: <Enumerable_1.Enumerable value={o.label}/>
        }); })} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Location"} inline={inline ? LocationPreview : undefined} onCreateOption={function (option) {
            newLocationModal.onOpen();
            setCreated(option);
        }}/>
      {newLocationModal.isOpen && (<LocationForm_1.default type="modal" onClose={function () {
                var _a;
                setCreated("");
                newLocationModal.onClose();
                (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
            }} initialValues={{
                name: created,
                timezone: (0, date_1.getLocalTimeZone)(),
                addressLine1: "",
                addressLine2: "",
                city: "",
                stateProvince: "",
                postalCode: "",
                countryCode: (_c = company === null || company === void 0 ? void 0 : company.countryCode) !== null && _c !== void 0 ? _c : ""
            }}/>)}
    </>);
};
Location.displayName = "Location";
exports.default = Location;
var useLocations = function () {
    var i18n = (0, macro_1.useLingui)().i18n;
    var locationFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        locationFetcher.load(path_1.path.to.api.locations);
    });
    var options = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_a = locationFetcher.data) === null || _a === void 0 ? void 0 : _a.data)
            ? (_b = locationFetcher.data) === null || _b === void 0 ? void 0 : _b.data.map(function (c) { return ({
                value: c.id,
                label: (0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)
            }); })
            : [];
    }, [locationFetcher.data, i18n]);
    return options;
};
exports.useLocations = useLocations;
