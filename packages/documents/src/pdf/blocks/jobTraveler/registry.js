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
exports.jobTravelerBlockRegistry = void 0;
var CustomFieldBlock_1 = require("../CustomFieldBlock");
var extensionRegistry_1 = require("../extensionRegistry");
var HeaderBlock_1 = require("./HeaderBlock");
var JobDetailsBlock_1 = require("./JobDetailsBlock");
var NotesBlock_1 = require("./NotesBlock");
var OperationsBlock_1 = require("./OperationsBlock");
/** Block-type → renderer for the Job Traveler. Extension blocks are shared. */
exports.jobTravelerBlockRegistry = __assign(__assign({}, extensionRegistry_1.extensionBlocks), { header: function (_a) {
        var data = _a.data;
        return <HeaderBlock_1.HeaderBlock data={data}/>;
    }, jobDetails: function (_a) {
        var data = _a.data;
        return <JobDetailsBlock_1.JobDetailsBlock data={data}/>;
    }, operations: function (_a) {
        var block = _a.block, data = _a.data;
        return block.type === "operations" ? (<OperationsBlock_1.OperationsBlock block={block} data={data}/>) : null;
    }, notes: function (_a) {
        var data = _a.data;
        return <NotesBlock_1.NotesBlock data={data}/>;
    }, customField: function (_a) {
        var _b, _c;
        var block = _a.block, data = _a.data;
        return block.type === "customField" ? (<CustomFieldBlock_1.CustomFieldBlock block={block} customFields={((_c = (_b = data.job) === null || _b === void 0 ? void 0 : _b.customFields) !== null && _c !== void 0 ? _c : {})}/>) : null;
    } });
