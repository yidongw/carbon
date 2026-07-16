"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFlags = useFlags;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var useUser_1 = require("./useUser");
function useFlags() {
    var user = (0, useUser_1.useUser)();
    var edition = (0, react_1.useEdition)();
    var isInternal = ["@carbon.us.org", "@carbon.ms"].some(function (domain) { var _a; return ((_a = user.email) !== null && _a !== void 0 ? _a : "").toLowerCase().trim().endsWith(domain); });
    return {
        isInternal: isInternal,
        isCloud: edition === utils_1.Edition.Cloud,
        isCommunity: edition === utils_1.Edition.Community,
        isEnterprise: edition === utils_1.Edition.Enterprise,
        isControlledEnvironment: auth_1.CONTROLLED_ENVIRONMENT
    };
}
