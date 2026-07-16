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
exports.default = QualityDocumentEditor;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function QualityDocumentEditor() {
    var _this = this;
    var _a, _b, _c, _d, _e;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var loaderData = (0, react_router_1.useLoaderData)();
    var _f = (0, react_2.useState)((_b = (_a = loaderData === null || loaderData === void 0 ? void 0 : loaderData.document) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""), documentName = _f[0], setDocumentName = _f[1];
    var _g = (0, react_2.useState)(((_d = (_c = loaderData === null || loaderData === void 0 ? void 0 : loaderData.document) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : {})), content = _g[0], setContent = _g[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _h = (0, hooks_1.useUser)(), userId = _h.id, companyId = _h.company.id;
    var updateContent = (0, react_1.useDebounce)(function (next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("qualityDocument").update({
                        content: next !== null && next !== void 0 ? next : {},
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    }).eq("id", id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 500, true);
    var nameFetcher = (0, react_router_1.useFetcher)();
    var updateName = function (name) { return __awaiter(_this, void 0, void 0, function () {
        var versions, formData, _i, _a, v;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, Promise.resolve(loaderData === null || loaderData === void 0 ? void 0 : loaderData.versions)];
                case 1:
                    versions = _b.sent();
                    formData = new FormData();
                    formData.append("ids", id);
                    if (Array.isArray(versions === null || versions === void 0 ? void 0 : versions.data) && versions.data.length > 0) {
                        for (_i = 0, _a = versions.data; _i < _a.length; _i++) {
                            v = _a[_i];
                            formData.append("ids", v.id);
                        }
                    }
                    formData.append("field", "name");
                    formData.append("value", name);
                    nameFetcher.submit(formData, {
                        method: "post",
                        action: path_1.path.to.bulkUpdateQualityDocument
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var ext, storagePath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ext = file.name.split(".").pop();
                    storagePath = "".concat(companyId, "/parts/").concat((0, nanoid_1.nanoid)(), ".").concat(ext);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(storagePath, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data))
                        throw new Error("Failed to upload image");
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var isDraft = ((_e = loaderData === null || loaderData === void 0 ? void 0 : loaderData.document) === null || _e === void 0 ? void 0 : _e.status) === "Draft";
    var canEdit = permissions.can("update", "quality") && isDraft;
    return (<div className="flex flex-col gap-6 w-full h-full p-6">
      <react_1.Input className="md:text-3xl text-2xl font-semibold leading-none tracking-tight text-foreground" value={documentName} borderless onChange={canEdit ? function (e) { return setDocumentName(e.target.value); } : undefined} onBlur={canEdit ? function (e) { return updateName(e.target.value); } : undefined}/>
      {canEdit ? (<Editor_1.Editor initialValue={content} onUpload={onUploadImage} onChange={function (value) {
                setContent(value);
                updateContent(value);
            }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: (0, react_1.generateHTML)(content) }}/>)}
    </div>);
}
var templateObject_1;
