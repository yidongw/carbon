"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyId = getCompanyId;
exports.setCompanyId = setCompanyId;
var auth_1 = require("@carbon/auth");
var utils_1 = require("@carbon/utils");
var cookie = require("cookie");
var cookie_1 = require("../utils/cookie");
var cookieName = "companyId";
var isTestEdition = auth_1.CarbonEdition === utils_1.Edition.Test;
var cookieDomain = isTestEdition ? undefined : (0, cookie_1.getCookieDomain)(auth_1.DOMAIN);
function getCompanyId(request) {
    var cookieHeader = request.headers.get("Cookie");
    if (!cookieHeader)
        return null;
    return cookie.parse(cookieHeader)[cookieName] || null;
}
function setCompanyId(companyId) {
    if (!companyId) {
        return cookie.serialize(cookieName, "", {
            path: "/",
            expires: new Date(0),
            domain: cookieDomain
        });
    }
    return cookie.serialize(cookieName, companyId, {
        path: "/",
        maxAge: 31536000, // 1 year
        domain: cookieDomain
    });
}
