"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vitest_1 = require("vitest");
var shared_models_1 = require("./shared.models");
(0, vitest_1.describe)("methodItemType", function () {
    (0, vitest_1.it)("includes Style as a first-class production item type", function () {
        (0, vitest_1.expect)(shared_models_1.methodItemType).toContain("Style");
    });
});
