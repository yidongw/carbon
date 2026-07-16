"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllContent = exports.getPrevText = void 0;
exports.isValidUrl = isValidUrl;
exports.getUrlFromString = getUrlFromString;
var model_1 = require("@tiptap/pm/model");
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch (_e) {
        return false;
    }
}
function getUrlFromString(str) {
    if (isValidUrl(str))
        return str;
    try {
        if (str.includes(".") && !str.includes(" ")) {
            return new URL("https://".concat(str)).toString();
        }
    }
    catch (_e) {
        return null;
    }
}
// Get the text before a given position in markdown format
var getPrevText = function (editor, position) {
    var nodes = [];
    // biome-ignore lint/suspicious/useIterableCallbackReturn: suppressed due to migration
    editor.state.doc.forEach(function (node, pos) {
        if (pos >= position)
            return false;
        nodes.push(node);
        return true;
    });
    var fragment = model_1.Fragment.fromArray(nodes);
    var doc = editor.state.doc.copy(fragment);
    return editor.storage.markdown.serializer.serialize(doc);
};
exports.getPrevText = getPrevText;
// Get all content from the editor in markdown format
var getAllContent = function (editor) {
    var fragment = editor.state.doc.content;
    var doc = editor.state.doc.copy(fragment);
    return editor.storage.markdown.serializer.serialize(doc);
};
exports.getAllContent = getAllContent;
