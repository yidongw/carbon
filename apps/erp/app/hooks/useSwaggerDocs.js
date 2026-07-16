"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSwaggerDocs = void 0;
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var useSwaggerDocs = function () {
    var docsFetcher = (0, react_router_1.useFetcher)();
    (0, react_1.useMount)(function () {
        docsFetcher.load(path_1.path.to.api.docs);
    });
    return docsFetcher.data;
};
exports.useSwaggerDocs = useSwaggerDocs;
