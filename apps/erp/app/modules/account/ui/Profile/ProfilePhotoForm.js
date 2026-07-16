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
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
var maxSizeMB = 10;
var ProfilePhotoForm = function (_a) {
    var _b;
    var user = _a.user;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var submit = (0, react_router_1.useSubmit)();
    var uploadImage = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var avatarFile, fileName_1, uploadToast, fileExtension, _a, status_1, blob, contentType, errorMessage, errorData, _b, _c, _d, resolvedType, outputExtension, error_1, errorMessage, imageUpload, errorMessage;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!(e.target.files && carbon)) return [3 /*break*/, 11];
                    avatarFile = e.target.files[0];
                    // Fail fast before hitting the resizer, which rejects files over 10MB.
                    if (avatarFile.size > maxSizeMB * 1024 * 1024) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["File size exceeds ", "MB limit. Current size: ", "MB"], ["File size exceeds ", "MB limit. Current size: ", "MB"])), maxSizeMB, (avatarFile.size / 1024 / 1024).toFixed(2)));
                        return [2 /*return*/];
                    }
                    fileName_1 = avatarFile.name;
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "avatar-upload-".concat(user.id),
                        label: function (pct) { return "".concat(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), fileName_1), " (").concat(pct, "%)"); }
                    });
                    fileExtension = avatarFile.name.substring(avatarFile.name.lastIndexOf(".") + 1);
                    _f.label = 1;
                case 1:
                    _f.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, (0, upload_1.resizeImageWithProgress)(avatarFile, {}, uploadToast.onProgress)];
                case 2:
                    _a = _f.sent(), status_1 = _a.status, blob = _a.blob, contentType = _a.contentType;
                    if (!(status_1 < 200 || status_1 >= 300)) return [3 /*break*/, 7];
                    errorMessage = "Failed to resize image";
                    if (!(contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json"))) return [3 /*break*/, 6];
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    _c = (_b = JSON).parse;
                    return [4 /*yield*/, blob.text()];
                case 4:
                    errorData = _c.apply(_b, [_f.sent()]);
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                    return [3 /*break*/, 6];
                case 5:
                    _d = _f.sent();
                    return [3 /*break*/, 6];
                case 6: throw new Error(errorMessage);
                case 7:
                    resolvedType = contentType || "image/png";
                    outputExtension = resolvedType.includes("image/jpeg")
                        ? "jpg"
                        : "png";
                    avatarFile = new File([blob], "".concat(user.id, ".").concat(outputExtension), {
                        type: resolvedType
                    });
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _f.sent();
                    console.error(error_1);
                    errorMessage = error_1 instanceof Error ? error_1.message : "Failed to resize image";
                    uploadToast.error(errorMessage);
                    return [2 /*return*/];
                case 9: return [4 /*yield*/, carbon.storage
                        .from("avatars")
                        .upload("".concat(user.id, ".").concat(fileExtension), avatarFile, {
                        cacheControl: "0",
                        upsert: true
                    })];
                case 10:
                    imageUpload = _f.sent();
                    if (imageUpload.error) {
                        console.error(imageUpload.error);
                        errorMessage = imageUpload.error.message || "Failed to upload image to storage";
                        uploadToast.error(errorMessage);
                        return [2 /*return*/];
                    }
                    if ((_e = imageUpload.data) === null || _e === void 0 ? void 0 : _e.path) {
                        uploadToast.dismiss();
                        submitAvatarUrl(imageUpload.data.path);
                    }
                    else {
                        uploadToast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Upload completed but no file path returned"], ["Upload completed but no file path returned"]))));
                    }
                    _f.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    }); };
    var deleteImage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var imageDelete, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(carbon && (user === null || user === void 0 ? void 0 : user.avatarUrl))) return [3 /*break*/, 2];
                    return [4 /*yield*/, carbon.storage
                            .from("avatars")
                            .remove([user.avatarUrl])];
                case 1:
                    imageDelete = _a.sent();
                    if (imageDelete.error) {
                        errorMessage = imageDelete.error.message || "Failed to remove image";
                        react_1.toast.error(errorMessage);
                        return [2 /*return*/];
                    }
                    react_1.toast.success(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Photo removed successfully"], ["Photo removed successfully"]))));
                    submitAvatarUrl(null);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var submitAvatarUrl = function (avatarPath) {
        var formData = new FormData();
        formData.append("intent", "photo");
        if (avatarPath)
            formData.append("path", avatarPath);
        submit(formData, {
            method: "post",
            action: path_1.path.to.profile,
            replace: true
        });
    };
    return (<react_1.VStack className="px-8 items-center">
      <components_1.Avatar size="2xl" path={user === null || user === void 0 ? void 0 : user.avatarUrl} name={(_b = user === null || user === void 0 ? void 0 : user.fullName) !== null && _b !== void 0 ? _b : undefined}/>
      <react_1.File accept="image/*" onChange={uploadImage}>
        {user.avatarUrl ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Change"], ["Change"]))) : t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Upload"], ["Upload"])))}
      </react_1.File>

      {user.avatarUrl && (<react_1.Button variant="secondary" onClick={deleteImage}>
          <macro_1.Trans>Remove</macro_1.Trans>
        </react_1.Button>)}
      <react_1.Badge variant="outline">{t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["", "MB limit"], ["", "MB limit"])), maxSizeMB)}</react_1.Badge>
    </react_1.VStack>);
};
exports.default = ProfilePhotoForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
