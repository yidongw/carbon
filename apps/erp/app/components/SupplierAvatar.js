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
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var stores_1 = require("~/stores");
var Avatar_1 = require("./Avatar");
var SupplierAvatar = function (_a) {
    var _b, _c;
    var supplierId = _a.supplierId, size = _a.size, className = _a.className, props = __rest(_a, ["supplierId", "size", "className"]);
    var suppliers = (0, stores_1.useSuppliers)()[0];
    if (!supplierId)
        return null;
    var supplier = (_b = suppliers.find(function (s) { return s.id === supplierId; })) !== null && _b !== void 0 ? _b : {
        name: "",
        id: "",
        website: null
    };
    var imageUrl = supplier.website
        ? (0, utils_1.getFaviconUrl)(supplier.website)
        : undefined;
    return (<react_1.HStack className="truncate ">
      <Avatar_1.default size={size !== null && size !== void 0 ? size : "xs"} {...props} name={(_c = supplier === null || supplier === void 0 ? void 0 : supplier.name) !== null && _c !== void 0 ? _c : ""} imageUrl={imageUrl}/>
      <span className={className}>{supplier.name}</span>
    </react_1.HStack>);
};
exports.default = SupplierAvatar;
