"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = error;
exports.success = success;
function error(error, message) {
    if (message === void 0) { message = "Request failed"; }
    if (error)
        console.error({ error: error, message: message });
    return {
        success: false,
        message: message
    };
}
function success(message, data) {
    if (message === void 0) { message = "Request succeeded"; }
    return {
        success: true,
        message: message
    };
}
