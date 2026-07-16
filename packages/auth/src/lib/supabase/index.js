"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCarbon = exports.getCarbon = exports.CarbonProvider = exports.carbonClient = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "carbonClient", { enumerable: true, get: function () { return client_1.carbonClient; } });
Object.defineProperty(exports, "getCarbon", { enumerable: true, get: function () { return client_1.getCarbon; } });
var provider_1 = require("./provider");
Object.defineProperty(exports, "CarbonProvider", { enumerable: true, get: function () { return provider_1.CarbonProvider; } });
Object.defineProperty(exports, "useCarbon", { enumerable: true, get: function () { return provider_1.useCarbon; } });
