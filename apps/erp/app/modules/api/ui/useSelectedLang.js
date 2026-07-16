"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSelectedLang = useSelectedLang;
var react_router_1 = require("react-router");
function useSelectedLang() {
    var lang = (0, react_router_1.useParams)().lang;
    if (isValidLang(lang)) {
        return lang;
    }
    else {
        return "js";
    }
}
// write a typescript is function that verifies the lang is valid
function isValidLang(lang) {
    return lang === "js" || lang === "bash";
}
