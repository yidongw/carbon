"use strict";
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
var vitest_1 = require("vitest");
var style_models_1 = require("./style.models");
var validStyle = {
    id: "ST-001",
    readableId: "ST-001",
    revision: "A",
    name: "Runner Upper",
    replenishmentSystem: "Make",
    defaultMethodType: "Make to Order",
    itemTrackingType: "Inventory",
    unitOfMeasureCode: "EA"
};
(0, vitest_1.describe)("styleValidator", function () {
    (0, vitest_1.it)("accepts a valid style", function () {
        var result = style_models_1.styleValidator.safeParse(validStyle);
        (0, vitest_1.expect)(result.success).toBe(true);
    });
    (0, vitest_1.it)("requires an id", function () {
        var result = style_models_1.styleValidator.safeParse(__assign(__assign({}, validStyle), { id: "" }));
        (0, vitest_1.expect)(result.success).toBe(false);
    });
    (0, vitest_1.it)("requires a revision", function () {
        var result = style_models_1.styleValidator.safeParse(__assign(__assign({}, validStyle), { revision: "" }));
        (0, vitest_1.expect)(result.success).toBe(false);
    });
});
