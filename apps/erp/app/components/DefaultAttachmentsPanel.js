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
exports.default = DefaultAttachmentsPanel;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var DocumentPreview_1 = require("~/components/DocumentPreview");
var FileDropzone_1 = require("~/components/FileDropzone");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var PREVIEWABLE = new Set(["PDF", "Image"]);
function DefaultAttachmentsPanel(_a) {
    var _this = this;
    var files = _a.files, storagePathPrefix = _a.storagePathPrefix, title = _a.title, description = _a.description;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var revalidator = (0, react_router_1.useRevalidator)();
    var _b = (0, react_2.useState)(null), deletingPath = _b[0], setDeletingPath = _b[1];
    var fullPath = (0, react_2.useCallback)(function (name) { return "".concat(company.id, "/").concat(storagePathPrefix, "/").concat(name); }, [company.id, storagePathPrefix]);
    var onDrop = (0, react_2.useCallback)(function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
        var _i, acceptedFiles_1, file, safeName, upload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Storage client not available"], ["Storage client not available"]))));
                        return [2 /*return*/];
                    }
                    _i = 0, acceptedFiles_1 = acceptedFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < acceptedFiles_1.length)) return [3 /*break*/, 4];
                    file = acceptedFiles_1[_i];
                    safeName = (0, string_1.stripSpecialCharacters)(file.name);
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(fullPath(safeName), file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            upsert: true
                        })];
                case 2:
                    upload = _a.sent();
                    if (upload.error)
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to upload ", ""], ["Failed to upload ", ""])), file.name));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, fullPath, revalidator, t]);
    var onDownload = (0, react_2.useCallback)(function (name) { return __awaiter(_this, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = path_1.path.to.file.previewFile("private/".concat(fullPath(name)));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _a.sent();
                    blobUrl = window.URL.createObjectURL(blob);
                    a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = blobUrl;
                    a.download = name;
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [fullPath, t]);
    var onDelete = (0, react_2.useCallback)(function (name) { return __awaiter(_this, void 0, void 0, function () {
        var storagePath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Storage client not available"], ["Storage client not available"]))));
                        return [2 /*return*/];
                    }
                    storagePath = fullPath(name);
                    setDeletingPath(storagePath);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .remove([storagePath])];
                case 2:
                    result = _a.sent();
                    if (result.error) {
                        react_1.toast.error(result.error.message || t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Error deleting file"], ["Error deleting file"]))));
                    }
                    else {
                        react_1.toast.success(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["", " deleted"], ["", " deleted"])), name));
                        revalidator.revalidate();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    setDeletingPath(null);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [carbon, fullPath, revalidator, t]);
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>{title}</react_1.CardTitle>
        <react_1.CardDescription>{description}</react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.Table className="w-full table-fixed">
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th className="w-auto">
                <macro_1.Trans>Name</macro_1.Trans>
              </react_1.Th>
              <react_1.Th className="w-24">
                <macro_1.Trans>Size</macro_1.Trans>
              </react_1.Th>
              <react_1.Th className="w-32">
                <macro_1.Trans>Created</macro_1.Trans>
              </react_1.Th>
              <react_1.Th className="w-12"></react_1.Th>
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {files
            .slice()
            .sort(function (a, b) { return a.name.localeCompare(b.name); })
            .map(function (f) {
            var _a;
            var type = (0, shared_1.getDocumentType)(f.name);
            var isPreviewable = PREVIEWABLE.has(type);
            var filePath = fullPath(f.name);
            var sizeKb = ((_a = f.metadata) === null || _a === void 0 ? void 0 : _a.size) != null
                ? Math.round(f.metadata.size / 1024)
                : null;
            return (<react_1.Tr key={f.name}>
                    <react_1.Td className="max-w-0">
                      <react_1.HStack className="gap-2 min-w-0 w-full">
                        <DocumentIcon_1.default type={type}/>
                        <span className="font-medium truncate cursor-pointer min-w-0 flex-1" onClick={function () {
                    if (isPreviewable) {
                        window.open(path_1.path.to.file.previewFile("private/".concat(filePath)), "_blank");
                    }
                    else {
                        onDownload(f.name);
                    }
                }}>
                          {isPreviewable ? (<DocumentPreview_1.default bucket="private" pathToFile={filePath} 
                // @ts-ignore — type is a string union the preview accepts
                type={type}>
                              {f.name}
                            </DocumentPreview_1.default>) : (f.name)}
                        </span>
                      </react_1.HStack>
                    </react_1.Td>
                    <react_1.Td className="text-xs font-mono whitespace-nowrap">
                      {sizeKb != null ? (0, utils_1.convertKbToString)(sizeKb) : "--"}
                    </react_1.Td>
                    <react_1.Td className="text-xs font-mono whitespace-nowrap">
                      {f.created_at ? formatDate(f.created_at) : "--"}
                    </react_1.Td>
                    <react_1.Td>
                      <div className="flex justify-end w-full">
                        <react_1.DropdownMenu>
                          <react_1.DropdownMenuTrigger asChild>
                            <react_1.IconButton aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                          </react_1.DropdownMenuTrigger>
                          <react_1.DropdownMenuContent>
                            <react_1.DropdownMenuItem onClick={function () { return onDownload(f.name); }}>
                              <react_1.DropdownMenuIcon icon={<lu_1.LuDownload />}/>
                              <macro_1.Trans>Download</macro_1.Trans>
                            </react_1.DropdownMenuItem>
                            <react_1.DropdownMenuItem destructive disabled={deletingPath === filePath} onClick={function () { return onDelete(f.name); }}>
                              <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                              <macro_1.Trans>Delete</macro_1.Trans>
                            </react_1.DropdownMenuItem>
                          </react_1.DropdownMenuContent>
                        </react_1.DropdownMenu>
                      </div>
                    </react_1.Td>
                  </react_1.Tr>);
        })}
            {files.length === 0 && (<react_1.Tr>
                <react_1.Td colSpan={4} className="py-8 text-muted-foreground text-center">
                  <macro_1.Trans>No default attachments yet.</macro_1.Trans>
                </react_1.Td>
              </react_1.Tr>)}
          </react_1.Tbody>
        </react_1.Table>

        <FileDropzone_1.default onDrop={onDrop}/>
      </react_1.CardContent>
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
