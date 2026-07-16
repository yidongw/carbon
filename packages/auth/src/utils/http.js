"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentPath = getCurrentPath;
exports.makeRedirectToFromHere = makeRedirectToFromHere;
exports.getRedirectTo = getRedirectTo;
exports.isGet = isGet;
exports.isPost = isPost;
exports.isDelete = isDelete;
exports.notAuthorized = notAuthorized;
exports.notFound = notFound;
exports.badRequest = badRequest;
exports.getRequiredParam = getRequiredParam;
exports.assertIsPost = assertIsPost;
exports.assertIsDelete = assertIsDelete;
exports.safeRedirect = safeRedirect;
exports.parseNumberFromUrlParam = parseNumberFromUrlParam;
exports.parseVercelId = parseVercelId;
var path_1 = require("./path");
function getCurrentPath(request) {
    return new URL(request.url).pathname;
}
function makeRedirectToFromHere(request) {
    var currentPath = getCurrentPath(request);
    return new URLSearchParams([["redirectTo", currentPath]]);
}
function getRedirectTo(request, defaultRedirectTo) {
    if (defaultRedirectTo === void 0) { defaultRedirectTo = path_1.path.to.authenticatedRoot; }
    var url = new URL(request.url);
    return safeRedirect(url.searchParams.get("redirectTo"), defaultRedirectTo);
}
function isGet(request) {
    return request.method.toLowerCase() === "get";
}
function isPost(request) {
    return request.method.toLowerCase() === "post";
}
function isDelete(request) {
    return request.method.toLowerCase() === "delete";
}
function notAuthorized(message) {
    return new Response(message, { status: 401 });
}
function notFound(message) {
    return new Response(message, { status: 404 });
}
function notAllowedMethod(message) {
    return new Response(message, { status: 405 });
}
function badRequest(message) {
    return new Response(message, { status: 400 });
}
function getRequiredParam(params, key) {
    var value = params[key];
    if (!value) {
        throw badRequest("Missing required request param \"".concat(key, "\""));
    }
    return value;
}
function assertIsPost(request, message) {
    if (message === void 0) { message = "Method not allowed"; }
    if (!isPost(request)) {
        throw notAllowedMethod(message);
    }
}
function assertIsDelete(request, message) {
    if (message === void 0) { message = "Method not allowed"; }
    if (!isDelete(request)) {
        throw notAllowedMethod(message);
    }
}
/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
function safeRedirect(to, defaultRedirect) {
    if (defaultRedirect === void 0) { defaultRedirect = path_1.path.to.authenticatedRoot; }
    if (!to ||
        typeof to !== "string" ||
        !to.startsWith("/") ||
        to.startsWith("//")) {
        return defaultRedirect;
    }
    return to;
}
function parseNumberFromUrlParam(params, key, defaultValue) {
    var value = params.get(key);
    if (!value) {
        return defaultValue;
    }
    var parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        return defaultValue;
    }
    return parsed;
}
function parseVercelId(id) {
    var parts = id === null || id === void 0 ? void 0 : id.split(":").filter(Boolean);
    if (!parts) {
        console.log('"x-vercel-id" header not present. Running on localhost?');
        return { proxyRegion: "localhost", computeRegion: "localhost" };
    }
    var proxyRegion = parts[0];
    var computeRegion = parts[parts.length - 2];
    return { proxyRegion: proxyRegion, computeRegion: computeRegion };
}
