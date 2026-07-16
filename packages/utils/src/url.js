"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUrl = void 0;
exports.getFaviconUrl = getFaviconUrl;
var isUrl = function (str) {
    var url;
    try {
        url = new URL(str);
    }
    catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
};
exports.isUrl = isUrl;
/**
 * Get favicon URL for a given website URL
 */
function getFaviconUrl(url) {
    try {
        var domain = new URL(url).hostname;
        return "https://www.google.com/s2/favicons?domain=".concat(domain, "&sz=32");
    }
    catch (_a) {
        return "";
    }
}
