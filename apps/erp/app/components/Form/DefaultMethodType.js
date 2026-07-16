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
var macro_1 = require("@lingui/macro");
var shared_models_1 = require("~/modules/shared/shared.models");
var Icons_1 = require("../Icons");
var DefaultMethodType = function (_a) {
    var replenishmentSystem = _a.replenishmentSystem, props = __rest(_a, ["replenishmentSystem"]);
    var options = (0, shared_models_1.getValidMethodTypes)(replenishmentSystem).map(function (t) { return ({
        value: t,
        label: (<span className="flex items-center gap-2">
        <Icons_1.MethodIcon type={t}/>
        {t === "Purchase to Order" ? (<macro_1.Trans>Purchase to Order</macro_1.Trans>) : t === "Pull from Inventory" ? (<macro_1.Trans>Pull from Inventory</macro_1.Trans>) : t === "Make to Order" ? (<macro_1.Trans>Make to Order</macro_1.Trans>) : (t)}
      </span>)
    }); });
    return <form_1.SelectControlled {...props} options={options}/>;
};
exports.default = DefaultMethodType;
