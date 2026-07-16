"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUploadToast = createUploadToast;
exports.uploadToStorageWithProgress = uploadToStorageWithProgress;
exports.resizeImageWithProgress = resizeImageWithProgress;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
/**
 * A single toast that shows live 0-100% upload progress and disappears when the
 * upload finishes. Shared by every upload site so the experience is consistent.
 *
 * The percentage is appended outside the translated `label` so callers can reuse
 * the existing "Uploading {0}" catalog entry:
 *   const t = createUploadToast({ id, label: (p) => `${t`Uploading ${name}`} (${p}%)` })
 */
function createUploadToast(opts) {
    var pct = 0;
    react_1.toast.loading(opts.label(0), { id: opts.id });
    return {
        /** Feed XHR upload progress (a 0..1 fraction) straight in. */
        onProgress: function (fraction) {
            var next = Math.min(100, Math.max(0, Math.round(fraction * 100)));
            // Never let the bar visually go backwards across phases.
            if (next < pct)
                return;
            pct = next;
            react_1.toast.loading(opts.label(pct), { id: opts.id });
        },
        /** Dismiss the toast (the upload finished — nothing left to show). */
        dismiss: function () { return react_1.toast.dismiss(opts.id); },
        /** Replace the progress toast in place with an error. */
        error: function (message) { return react_1.toast.error(message, { id: opts.id }); }
    };
}
/**
 * Upload a file directly to Supabase Storage with real upload progress.
 *
 * Supabase JS `.upload()` exposes no progress events, so we mint a signed upload
 * URL with the authenticated client and PUT the file to it via XMLHttpRequest,
 * which does report `upload.onprogress`. The multipart body mirrors what
 * `uploadToSignedUrl` sends internally.
 */
function uploadToStorageWithProgress(carbon, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var bucket, path, file, _a, upsert, _b, cacheControl, onProgress, _c, signed, signError;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    bucket = opts.bucket, path = opts.path, file = opts.file, _a = opts.upsert, upsert = _a === void 0 ? false : _a, _b = opts.cacheControl, cacheControl = _b === void 0 ? "3600" : _b, onProgress = opts.onProgress;
                    return [4 /*yield*/, carbon.storage
                            .from(bucket)
                            .createSignedUploadUrl(path, { upsert: upsert })];
                case 1:
                    _c = _d.sent(), signed = _c.data, signError = _c.error;
                    if (signError || !signed) {
                        return [2 /*return*/, {
                                data: null,
                                error: signError !== null && signError !== void 0 ? signError : new Error("Failed to create upload URL")
                            }];
                    }
                    return [2 /*return*/, new Promise(function (resolve) {
                            var xhr = new XMLHttpRequest();
                            xhr.open("PUT", signed.signedUrl);
                            xhr.setRequestHeader("x-upsert", String(upsert));
                            xhr.setRequestHeader("cache-control", "max-age=".concat(cacheControl));
                            // Mirror uploadToSignedUrl's Blob handling: multipart with the file under
                            // the empty field name. Do NOT set Content-Type — the browser adds the
                            // multipart boundary.
                            var body = new FormData();
                            body.append("cacheControl", cacheControl);
                            body.append("", file);
                            xhr.upload.onprogress = function (event) {
                                if (event.lengthComputable && onProgress) {
                                    onProgress(event.loaded / event.total);
                                }
                            };
                            xhr.onload = function () {
                                var _a;
                                if (xhr.status >= 200 && xhr.status < 300) {
                                    resolve({ data: { path: (_a = signed.path) !== null && _a !== void 0 ? _a : path }, error: null });
                                    return;
                                }
                                var message = "Upload failed (".concat(xhr.status, ")");
                                try {
                                    var parsed = JSON.parse(xhr.responseText);
                                    if (parsed === null || parsed === void 0 ? void 0 : parsed.message)
                                        message = parsed.message;
                                }
                                catch (_b) {
                                    // keep the generic message
                                }
                                resolve({ data: null, error: new Error(message) });
                            };
                            xhr.onerror = function () {
                                return resolve({ data: null, error: new Error("Network error during upload") });
                            };
                            xhr.send(body);
                        })];
            }
        });
    });
}
/**
 * Resize an image through the image-resizer edge function, reporting progress on
 * the (largest) original-file upload. Returns the resized blob.
 */
function resizeImageWithProgress(file_1) {
    return __awaiter(this, arguments, void 0, function (file, options, onProgress) {
        var formData;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            formData = new FormData();
            formData.append("file", file);
            if (options.height != null)
                formData.append("height", String(options.height));
            if (options.contained)
                formData.append("contained", "true");
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "".concat(auth_1.SUPABASE_URL, "/functions/v1/image-resizer"));
                    xhr.responseType = "blob";
                    xhr.upload.onprogress = function (event) {
                        if (event.lengthComputable && onProgress) {
                            onProgress(event.loaded / event.total);
                        }
                    };
                    xhr.onload = function () {
                        return resolve({
                            status: xhr.status,
                            blob: xhr.response,
                            contentType: xhr.getResponseHeader("Content-Type")
                        });
                    };
                    xhr.onerror = function () { return reject(new Error("Network error during upload")); };
                    xhr.send(formData);
                })];
        });
    });
}
