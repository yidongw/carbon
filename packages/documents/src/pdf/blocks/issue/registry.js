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
exports.issueBlockRegistry = void 0;
var CustomFieldBlock_1 = require("../CustomFieldBlock");
var extensionRegistry_1 = require("../extensionRegistry");
var ActionTasksBlock_1 = require("./ActionTasksBlock");
var AssociationsBlock_1 = require("./AssociationsBlock");
var HeaderBlock_1 = require("./HeaderBlock");
var IssueDetailsBlock_1 = require("./IssueDetailsBlock");
var NotesBlock_1 = require("./NotesBlock");
var ReviewersBlock_1 = require("./ReviewersBlock");
/** Block-type → renderer for the Issue report. Extension blocks are shared. */
exports.issueBlockRegistry = __assign(__assign({}, extensionRegistry_1.extensionBlocks), { header: function (_a) {
        var data = _a.data;
        return <HeaderBlock_1.HeaderBlock data={data}/>;
    }, issueDetails: function (_a) {
        var data = _a.data;
        return <IssueDetailsBlock_1.IssueDetailsBlock data={data}/>;
    }, associations: function (_a) {
        var data = _a.data;
        return <AssociationsBlock_1.AssociationsBlock data={data}/>;
    }, notes: function (_a) {
        var data = _a.data;
        return <NotesBlock_1.NotesBlock data={data}/>;
    }, actionTasks: function (_a) {
        var data = _a.data;
        return <ActionTasksBlock_1.ActionTasksBlock data={data}/>;
    }, reviewers: function (_a) {
        var data = _a.data;
        return <ReviewersBlock_1.ReviewersBlock data={data}/>;
    }, customField: function (_a) {
        var _b, _c;
        var block = _a.block, data = _a.data;
        return block.type === "customField" ? (<CustomFieldBlock_1.CustomFieldBlock block={block} customFields={((_c = (_b = data.nonConformance) === null || _b === void 0 ? void 0 : _b.customFields) !== null && _c !== void 0 ? _c : {})}/>) : null;
    } });
