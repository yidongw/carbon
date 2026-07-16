"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCookieDomain = getCookieDomain;
function getCookieDomain(domain) {
    var _a;
    if (!domain)
        return undefined;
    var withoutProtocol = domain
        .trim()
        .toLowerCase()
        .replace(/^https?:\/\//, "");
    var host = (_a = withoutProtocol.split("/")[0]) === null || _a === void 0 ? void 0 : _a.split(":")[0];
    if (!host)
        return undefined;
    if (host === "localhost" || host.endsWith(".localhost"))
        return undefined;
    if (host.startsWith("[") || /^[\d.]+$/.test(host))
        return undefined;
    return host;
}
