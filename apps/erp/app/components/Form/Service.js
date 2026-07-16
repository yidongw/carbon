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
var react_1 = require("react");
var stores_1 = require("~/stores");
var Service = function (_a) {
    var _b;
    var serviceType = _a.serviceType, props = __rest(_a, ["serviceType"]);
    var services = (0, stores_1.useServices)();
    var options = (0, react_1.useMemo)(function () {
        var _a;
        return (_a = services.map(function (service) { return ({
            value: service.id,
            label: service.id,
            helper: service.name
        }); })) !== null && _a !== void 0 ? _a : [];
    }, [services]);
    return (<form_1.Combobox options={options} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Service"}/>);
};
Service.displayName = "Service";
exports.default = Service;
