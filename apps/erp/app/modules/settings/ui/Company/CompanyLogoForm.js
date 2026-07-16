"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.maxSizeMB = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
var STORAGE_URL_PREFIX = "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/public/");
var toStoragePath = function (urlOrPath) {
    if (!urlOrPath)
        return null;
    return urlOrPath.startsWith(STORAGE_URL_PREFIX)
        ? urlOrPath.slice(STORAGE_URL_PREFIX.length)
        : urlOrPath;
};
var ROLE_BY_TARGET = {
    logoLight: "light",
    logoDark: "dark",
    logoLightIcon: "light-icon",
    logoDarkIcon: "dark-icon",
    logoWatermark: "watermark"
};
exports.maxSizeMB = 10;
var CompanyLogoForm = function (_a) {
    var _b, _c;
    var company = _a.company, target = _a.target;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var submit = (0, react_router_1.useSubmit)();
    var isIcon = target === "logoLightIcon" || target === "logoDarkIcon";
    var isDark = target === "logoDark" || target === "logoDarkIcon";
    // The watermark is drawn at ~50% page width, so keep it large; everything
    // else is a small inline logo. Either way the resizer re-encodes to PNG,
    // which is the only raster format @react-pdf/renderer can decode (a raw
    // webp/gif upload renders blank in the PDF).
    var resizeHeight = target === "logoWatermark" ? 512 : 128;
    var shouldResize = true;
    var getLogoPath = function (file) {
        return "".concat(company.id, "/logos/").concat(ROLE_BY_TARGET[target], "/").concat((0, nanoid_1.nanoid)(), "/").concat(file.name);
    };
    var currentLogoPath = (_b = company[target]) !== null && _b !== void 0 ? _b : null;
    var uploadImage = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var logo_1, supportedTypes, maxSizeBytes, uploadToast, _a, status_1, blob, contentType, errorText, parsed, _b, _c, _d, resolvedType, error_1, errorMessage, previousStoragePath, logoPath, imageUpload, errorMessage;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!(e.target.files && carbon)) return [3 /*break*/, 16];
                    logo_1 = e.target.files[0];
                    supportedTypes = [
                        "image/jpeg",
                        "image/png",
                        "image/webp",
                        "image/gif"
                    ];
                    if (!supportedTypes.includes(logo_1.type)) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["File type not supported. Please use JPG, PNG, WebP, or GIF."], ["File type not supported. Please use JPG, PNG, WebP, or GIF."]))));
                        return [2 /*return*/];
                    }
                    maxSizeBytes = exports.maxSizeMB * 1024 * 1024;
                    if (logo_1.size > maxSizeBytes) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["File size exceeds ", "MB limit. Current size: ", "MB"], ["File size exceeds ", "MB limit. Current size: ", "MB"])), exports.maxSizeMB, (logo_1.size / 1024 / 1024).toFixed(2)));
                        return [2 /*return*/];
                    }
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "logo-".concat(target, "-").concat(logo_1.name),
                        label: function (pct) { return "".concat(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), logo_1.name), " (").concat(pct, "%)"); }
                    });
                    if (!shouldResize) return [3 /*break*/, 12];
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, (0, upload_1.resizeImageWithProgress)(logo_1, { height: String(resizeHeight), contained: true }, uploadToast.onProgress)];
                case 2:
                    _a = _f.sent(), status_1 = _a.status, blob = _a.blob, contentType = _a.contentType;
                    if (!(status_1 < 200 || status_1 >= 300)) return [3 /*break*/, 10];
                    errorText = "Unknown error";
                    if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json"))) return [3 /*break*/, 7];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, blob.text()];
                case 4:
                    parsed = _c.apply(_b, [_f.sent()]);
                    if (parsed === null || parsed === void 0 ? void 0 : parsed.error)
                        errorText = parsed.error;
                    return [3 /*break*/, 6];
                case 5:
                    _d = _f.sent();
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, blob.text().catch(function () { return ""; })];
                case 8:
                    errorText =
                        (_f.sent()) || "Unknown error";
                    _f.label = 9;
                case 9: throw new Error("Image resize failed: ".concat(status_1, " ").concat(errorText));
                case 10:
                    resolvedType = contentType || "image/png";
                    logo_1 = new File([blob], "logo.png", { type: resolvedType });
                    return [3 /*break*/, 12];
                case 11:
                    error_1 = _f.sent();
                    errorMessage = error_1 instanceof Error ? error_1.message : "Unknown error";
                    console.error("Image resize error:", error_1);
                    uploadToast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to resize image: ", ""], ["Failed to resize image: ", ""])), errorMessage));
                    return [2 /*return*/];
                case 12:
                    previousStoragePath = toStoragePath(currentLogoPath);
                    logoPath = getLogoPath(logo_1);
                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                            bucket: "public",
                            path: logoPath,
                            file: logo_1,
                            cacheControl: "0",
                            upsert: true,
                            onProgress: uploadToast.onProgress
                        })];
                case 13:
                    imageUpload = _f.sent();
                    if (imageUpload.error) {
                        errorMessage = imageUpload.error.message || "Unknown error";
                        console.error("Upload error:", imageUpload.error);
                        uploadToast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Failed to upload logo: ", ""], ["Failed to upload logo: ", ""])), errorMessage));
                        return [2 /*return*/];
                    }
                    if (!((_e = imageUpload.data) === null || _e === void 0 ? void 0 : _e.path)) return [3 /*break*/, 16];
                    if (!(previousStoragePath &&
                        previousStoragePath !== imageUpload.data.path)) return [3 /*break*/, 15];
                    return [4 /*yield*/, carbon.storage
                            .from("public")
                            .remove([previousStoragePath])
                            .catch(function (cleanupError) {
                            console.warn("Old logo cleanup failed:", cleanupError);
                        })];
                case 14:
                    _f.sent();
                    _f.label = 15;
                case 15:
                    uploadToast.dismiss();
                    react_1.toast.success(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Logo uploaded successfully"], ["Logo uploaded successfully"]))));
                    submitLogoUrl(imageUpload.data.path);
                    _f.label = 16;
                case 16: return [2 /*return*/];
            }
        });
    }); };
    var deleteImage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var storagePath, imageDelete, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(carbon && currentLogoPath)) return [3 /*break*/, 2];
                    storagePath = toStoragePath(currentLogoPath);
                    if (!storagePath)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon.storage
                            .from("public")
                            .remove([storagePath])];
                case 1:
                    imageDelete = _a.sent();
                    if (imageDelete.error) {
                        errorMessage = imageDelete.error.message || "Unknown error";
                        console.error("Delete error:", imageDelete.error);
                        react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Failed to remove image: ", ""], ["Failed to remove image: ", ""])), errorMessage));
                        return [2 /*return*/];
                    }
                    react_1.toast.success(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Logo removed successfully"], ["Logo removed successfully"]))));
                    submitLogoUrl(null);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var submitLogoUrl = function (logoUrl) {
        var formData = new FormData();
        formData.append("target", target);
        if (logoUrl)
            formData.append("path", logoUrl);
        submit(formData, {
            method: "post",
            action: path_1.path.to.logos
        });
    };
    var altText = "".concat(company.name, " Logo");
    return isIcon ? (<react_1.VStack className="items-center py-4" spacing={4}>
      <div className={(0, react_1.cn)("flex items-center justify-center h-[156px] w-[156px] rounded-lg overflow-hidden", isDark ? "bg-black text-white" : "bg-zinc-200/90 text-black")}>
        {currentLogoPath ? (<img alt={altText} src={currentLogoPath} className="max-h-full max-w-full object-contain rounded-lg"/>) : (<react_1.Avatar name={(_c = company === null || company === void 0 ? void 0 : company.name) !== null && _c !== void 0 ? _c : undefined} size="2xl"/>)}
      </div>

      <react_1.HStack spacing={2}>
        <react_1.File accept="image/*" onChange={uploadImage}>
          {currentLogoPath ? <macro_1.Trans>Change</macro_1.Trans> : <macro_1.Trans>Upload</macro_1.Trans>}
        </react_1.File>

        {currentLogoPath && (<react_1.Button variant="secondary" onClick={deleteImage}>
            <macro_1.Trans>Remove</macro_1.Trans>
          </react_1.Button>)}
      </react_1.HStack>
    </react_1.VStack>) : (<react_1.VStack className="items-center py-4" spacing={4}>
      <div className={(0, react_1.cn)("flex items-center justify-center w-full h-[156px] rounded-lg border border-input overflow-hidden", isDark ? "bg-black/90 text-white" : "bg-zinc-200/90 text-black")}>
        {currentLogoPath ? (<img alt={altText} src={currentLogoPath} className="max-h-full max-w-full object-contain rounded-lg"/>) : (<p className="font-mono uppercase text-sm">
            <macro_1.Trans>No logo uploaded</macro_1.Trans>
          </p>)}
      </div>
      <react_1.HStack spacing={2}>
        <react_1.File accept="image/*" onChange={uploadImage}>
          {currentLogoPath ? <macro_1.Trans>Change</macro_1.Trans> : <macro_1.Trans>Upload</macro_1.Trans>}
        </react_1.File>

        {currentLogoPath && (<react_1.Button variant="secondary" onClick={deleteImage}>
            <macro_1.Trans>Remove</macro_1.Trans>
          </react_1.Button>)}
      </react_1.HStack>
    </react_1.VStack>);
};
exports.default = CompanyLogoForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
