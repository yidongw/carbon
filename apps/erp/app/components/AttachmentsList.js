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
exports.default = AttachmentsList;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var string_1 = require("~/utils/string");
var sourceLabel = {
    company: "From Company",
    supplier: "From Supplier",
    item: "From Item",
    po: "Ad-hoc"
};
var WARN_KB = utils_1.PO_EMAIL_ATTACHMENT_WARN_MB * 1024;
var LIMIT_KB = utils_1.PO_EMAIL_ATTACHMENT_LIMIT_MB * 1024;
var sourceBadgeVariant = {
    po: "blue",
    item: "green",
    supplier: "orange",
    company: "purple"
};
function AttachmentsList(_a) {
    var _this = this;
    var supplierInteractionId = _a.supplierInteractionId, _b = _a.pinned, pinned = _b === void 0 ? [] : _b, attachments = _a.attachments;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var revalidator = (0, react_router_1.useRevalidator)();
    var _c = (0, react_2.useState)(false), uploading = _c[0], setUploading = _c[1];
    var totalKb = (0, react_2.useMemo)(function () {
        var pinnedKb = pinned.reduce(function (sum, p) { var _a; return sum + ((_a = p.sizeKb) !== null && _a !== void 0 ? _a : 0); }, 0);
        var attKb = attachments.reduce(function (sum, a) { var _a; return sum + ((_a = a.size) !== null && _a !== void 0 ? _a : 0); }, 0);
        return pinnedKb + attKb;
    }, [attachments, pinned]);
    var overLimit = totalKb > LIMIT_KB;
    var warning = totalKb > WARN_KB && !overLimit;
    var onDrop = (0, react_2.useCallback)(function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
        var _i, acceptedFiles_1, file, safeName, storagePath, upload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Storage client not available"], ["Storage client not available"]))));
                        return [2 /*return*/];
                    }
                    if (!supplierInteractionId) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Cannot upload \u2014 supplier interaction not yet created"], ["Cannot upload \u2014 supplier interaction not yet created"]))));
                        return [2 /*return*/];
                    }
                    setUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 6, 7]);
                    _i = 0, acceptedFiles_1 = acceptedFiles;
                    _a.label = 2;
                case 2:
                    if (!(_i < acceptedFiles_1.length)) return [3 /*break*/, 5];
                    file = acceptedFiles_1[_i];
                    safeName = (0, string_1.stripSpecialCharacters)(file.name);
                    storagePath = "".concat(company.id, "/supplier-interaction/").concat(supplierInteractionId, "/").concat(safeName);
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(storagePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            upsert: true
                        })];
                case 3:
                    upload = _a.sent();
                    if (upload.error) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to upload ", ""], ["Failed to upload ", ""])), file.name));
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    revalidator.revalidate();
                    return [3 /*break*/, 7];
                case 6:
                    setUploading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); }, [carbon, company.id, supplierInteractionId, revalidator, t]);
    var _d = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        multiple: true
    }), getRootProps = _d.getRootProps, getInputProps = _d.getInputProps, isDragActive = _d.isDragActive;
    var onRemovePoFile = (0, react_2.useCallback)(function (a) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon.storage.from("private").remove([a.path])];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        react_1.toast.error(result.error.message || t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Error removing file"], ["Error removing file"]))));
                    }
                    else {
                        revalidator.revalidate();
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, revalidator, t]);
    return (<react_1.VStack spacing={2} className="w-full">
      <div className="text-[11px] font-semibold uppercase text-muted-foreground">
        <macro_1.Trans>Attachments</macro_1.Trans>
      </div>

      <react_1.VStack spacing={1} className="w-full">
        {pinned.map(function (p) {
            var _a;
            return (<react_1.HStack key={"pinned-".concat(p.name)} className="w-full justify-between border rounded-md px-3 py-2 bg-muted/30">
            <react_1.HStack className="gap-2">
              <lu_1.LuFileText className="flex-shrink-0 text-muted-foreground"/>
              <span className="text-sm font-medium truncate max-w-[200px]">
                {p.name}
              </span>
              <react_1.Badge variant="gray" className="flex-shrink-0">
                {(_a = p.label) !== null && _a !== void 0 ? _a : t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["PO PDF"], ["PO PDF"])))}
              </react_1.Badge>
            </react_1.HStack>
            <span className="text-xs font-mono text-muted-foreground flex-shrink-0 ml-2 whitespace-nowrap">
              {p.sizeKb ? (0, utils_1.convertKbToString)(p.sizeKb) : "--"}
            </span>
          </react_1.HStack>);
        })}

        {attachments.length === 0 && pinned.length === 0 && (<div className="text-sm text-muted-foreground italic px-3 py-2">
            <macro_1.Trans>No attachments.</macro_1.Trans>
          </div>)}

        {attachments.map(function (a) { return (<react_1.HStack key={a.path} className="w-full justify-between border rounded-md px-3 py-2">
            <react_1.HStack className="gap-2">
              <lu_1.LuFileText className="flex-shrink-0 text-muted-foreground"/>
              <span className="text-sm truncate max-w-[200px]">{a.name}</span>
              <react_1.Badge variant={sourceBadgeVariant[a.source]} className="flex-shrink-0">
                {sourceLabel[a.source]}
              </react_1.Badge>
            </react_1.HStack>
            <react_1.HStack className="gap-2 flex-shrink-0 ml-2">
              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                {a.size != null ? (0, utils_1.convertKbToString)(a.size) : "--"}
              </span>
              {a.source === "po" && (<react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Remove"], ["Remove"])))} icon={<lu_1.LuX />} size="sm" variant="ghost" onClick={function () { return onRemovePoFile(a); }}/>)}
            </react_1.HStack>
          </react_1.HStack>); })}
      </react_1.VStack>

      <div {...getRootProps()} className={"mt-2 w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ".concat(isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted hover:border-primary/50")}>
        <input {...getInputProps()}/>
        {uploading ? (<div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <react_1.Spinner /> <macro_1.Trans>Uploading…</macro_1.Trans>
          </div>) : (<div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
            <lu_1.LuCloudUpload className="h-6 w-6"/>
            <macro_1.Trans>Drag &amp; drop files, or click to browse</macro_1.Trans>
          </div>)}
      </div>

      <div className={"w-full text-xs font-mono ".concat(overLimit
            ? "text-destructive"
            : warning
                ? "text-amber-700"
                : "text-muted-foreground")}>
        {(0, utils_1.convertKbToString)(totalKb)} / {(0, utils_1.convertKbToString)(LIMIT_KB)}
        {overLimit && (<span className="ml-2">
            <macro_1.Trans>
              Exceeds {utils_1.PO_EMAIL_ATTACHMENT_LIMIT_MB} MB total — remove some
              attachments to send.
            </macro_1.Trans>
          </span>)}
        {warning && (<span className="ml-2">
            <macro_1.Trans>Approaching {utils_1.PO_EMAIL_ATTACHMENT_LIMIT_MB} MB cap.</macro_1.Trans>
          </span>)}
      </div>
    </react_1.VStack>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
