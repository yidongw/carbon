"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileSizeLimit = exports.PO_EMAIL_ATTACHMENT_WARN_MB = exports.PO_EMAIL_ATTACHMENT_LIMIT_MB = exports.FILE_SIZE_LIMIT_MB = exports.SUPPORT_EMAIL = void 0;
exports.SUPPORT_EMAIL = "support@carbon.ms";
exports.FILE_SIZE_LIMIT_MB = {
    CAD_MODEL_UPLOAD: 120,
    DOCUMENT_UPLOAD: 50
};
exports.PO_EMAIL_ATTACHMENT_LIMIT_MB = 25;
exports.PO_EMAIL_ATTACHMENT_WARN_MB = 20;
var getFileSizeLimit = function (type) {
    var valueMegaBytes = exports.FILE_SIZE_LIMIT_MB[type];
    var valueBytes = valueMegaBytes * 1024 * 1024;
    return {
        get megabytes() {
            return valueMegaBytes;
        },
        format: function () {
            return "".concat(valueMegaBytes, " ").concat(valueMegaBytes > 1 ? "MBs" : "MB");
        },
        get bytes() {
            return valueBytes;
        }
    };
};
exports.getFileSizeLimit = getFileSizeLimit;
