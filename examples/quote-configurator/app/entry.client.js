"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var dom_1 = require("react-router/dom");
(0, react_1.startTransition)(function () {
    (0, client_1.hydrateRoot)(document, <dom_1.HydratedRouter />);
});
