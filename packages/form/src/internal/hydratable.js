"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydratable = void 0;
var serverData = function (data) { return ({
    hydrateTo: function () { return data; },
    map: function (fn) { return serverData(fn(data)); }
}); };
var hydratedData = function () { return ({
    hydrateTo: function (hydratedData) { return hydratedData; },
    map: function () { return hydratedData(); }
}); };
var from = function (data, hydrated) {
    return hydrated ? hydratedData() : serverData(data);
};
exports.hydratable = {
    serverData: serverData,
    hydratedData: hydratedData,
    from: from
};
