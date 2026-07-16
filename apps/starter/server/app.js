"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_1 = require("react-router");
// @ts-expect-error
var build = require("virtual:react-router/server-build");
var handler = (0, react_router_1.createRequestHandler)(build);
// @ts-expect-error
exports.default = (function (req) { return handler(req, new react_router_1.RouterContextProvider()); });
