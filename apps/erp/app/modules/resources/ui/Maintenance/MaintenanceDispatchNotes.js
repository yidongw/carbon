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
exports.MaintenanceDispatchNotes = MaintenanceDispatchNotes;
exports.MaintenanceDispatchFilesSkeleton = MaintenanceDispatchFilesSkeleton;
exports.MaintenanceDispatchFiles = MaintenanceDispatchFiles;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var DocumentIcon_1 = require("~/components/DocumentIcon");
var FilesViewModeToggle_1 = require("~/components/FilesViewModeToggle");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var upload_1 = require("~/utils/upload");
function MaintenanceDispatchNotes(_a) {
    var _this = this;
    var id = _a.id, initialContent = _a.content, isDisabled = _a.isDisabled;
    var _b = (0, hooks_1.useUser)(), userId = _b.id, companyId = _b.company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var permissions = (0, hooks_1.usePermissions)();
    var _c = (0, react_2.useState)(initialContent !== null && initialContent !== void 0 ? initialContent : {}), content = _c[0], setContent = _c[1];
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/maintenance/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error("Failed to upload image");
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var onUpdateContent = (0, react_1.useDebounce)(function (content) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("maintenanceDispatch").update({
                        content: content,
                        updatedBy: userId
                    }).eq("id", id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 2500, true);
    if (!id)
        return null;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Notes</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <macro_1.Trans>
            Add notes and documentation for this maintenance dispatch
          </macro_1.Trans>
        </react_1.CardDescription>
      </react_1.CardHeader>

      <react_1.CardContent>
        {permissions.can("update", "resources") && !isDisabled ? (<Editor_1.Editor initialValue={(content !== null && content !== void 0 ? content : {})} onUpload={onUploadImage} onChange={function (value) {
                setContent(value);
                onUpdateContent(value);
            }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(content)
            }}/>)}
      </react_1.CardContent>
    </react_1.Card>);
}
function MaintenanceDispatchFilesSkeleton() {
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Files</macro_1.Trans>
        </react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        <div className="flex flex-col gap-2">
          <react_1.Skeleton className="h-10 w-full"/>
          <react_1.Skeleton className="h-10 w-full"/>
          <react_1.Skeleton className="h-10 w-3/4"/>
        </div>
      </react_1.CardContent>
    </react_1.Card>);
}
function MaintenanceDispatchFiles(_a) {
    var dispatchId = _a.dispatchId, files = _a.files, isDisabled = _a.isDisabled;
    var permissions = (0, hooks_1.usePermissions)();
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Files</macro_1.Trans>
        </react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_2.Suspense fallback={<MaintenanceDispatchFilesSkeleton />}>
          <react_router_1.Await resolve={files}>
            {function (resolvedFiles) { return (<MaintenanceFilesContent dispatchId={dispatchId} files={resolvedFiles !== null && resolvedFiles !== void 0 ? resolvedFiles : []} isReadOnly={!permissions.can("update", "resources") || isDisabled}/>); }}
          </react_router_1.Await>
        </react_2.Suspense>
      </react_1.CardContent>
    </react_1.Card>);
}
function MaintenanceFilesContent(_a) {
    var _this = this;
    var dispatchId = _a.dispatchId, files = _a.files, isReadOnly = _a.isReadOnly;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var revalidator = (0, react_router_1.useRevalidator)();
    var getFilePath = (0, react_2.useCallback)(function (fileName) {
        return "".concat(company.id, "/maintenance/").concat(dispatchId, "/").concat((0, string_1.stripSpecialCharacters)(fileName));
    }, [company.id, dispatchId]);
    var upload = (0, react_2.useCallback)(function (filesToUpload) { return __awaiter(_this, void 0, void 0, function () {
        var _loop_1, _i, _a, _b, index, file;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    _loop_1 = function (index, file) {
                        var uploadToast, filePath, result;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    uploadToast = (0, upload_1.createUploadToast)({
                                        id: "maintenance-doc-".concat(dispatchId, "-").concat(index, "-").concat(file.name),
                                        label: function (pct) { return "".concat(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                                    });
                                    filePath = getFilePath(file.name);
                                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                                            bucket: "private",
                                            path: filePath,
                                            file: file,
                                            cacheControl: "".concat(12 * 60 * 60),
                                            upsert: true,
                                            onProgress: uploadToast.onProgress
                                        })];
                                case 1:
                                    result = _d.sent();
                                    if (result.error) {
                                        uploadToast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to upload file: ", ""], ["Failed to upload file: ", ""])), file.name));
                                    }
                                    else {
                                        uploadToast.dismiss();
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _a = filesToUpload.entries();
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], index = _b[0], file = _b[1];
                    return [5 /*yield**/, _loop_1(index, file)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, dispatchId, getFilePath, revalidator, t]);
    var download = (0, react_2.useCallback)(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var filePath, url, response, blob, blobUrl, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = getFilePath(file.name);
                    url = path_1.path.to.file.previewFile("private/".concat(filePath));
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
                    a.download = file.name;
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [getFilePath, t]);
    var deleteFile = (0, react_2.useCallback)(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var filePath, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    filePath = getFilePath(file.name);
                    return [4 /*yield*/, carbon.storage.from("private").remove([filePath])];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        react_1.toast.error(result.error.message || "Error deleting file");
                        return [2 /*return*/];
                    }
                    react_1.toast.success(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["", " deleted successfully"], ["", " deleted successfully"])), file.name));
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, getFilePath, revalidator, t]);
    var onDrop = (0, react_2.useCallback)(function (acceptedFiles) {
        upload(acceptedFiles);
    }, [upload]);
    var uploadFiles = function (e) {
        if (e.target.files) {
            upload(Array.from(e.target.files));
        }
    };
    var _b = (0, FilesViewModeToggle_1.useFilesViewMode)(), viewMode = _b[0], setViewMode = _b[1];
    var iconItems = (0, react_2.useMemo)(function () {
        return files.map(function (file) {
            var _a;
            var type = (0, shared_1.getDocumentType)(file.name);
            return {
                id: file.id,
                name: file.name,
                documentType: type,
                pathToFile: getFilePath(file.name),
                sizeBytes: (_a = file.metadata) === null || _a === void 0 ? void 0 : _a.size,
                previewType: ["PDF", "Image"].includes(type)
                    ? type
                    : undefined,
                raw: file
            };
        });
    }, [files, getFilePath]);
    return (<>
      <div className="mb-4 flex justify-end gap-2">
        <components_1.FilesViewModeToggle value={viewMode} onChange={setViewMode}/>
        {!isReadOnly && (<>
            {/* @ts-expect-error TS2322 */}
            <react_1.File leftIcon={<lu_1.LuUpload />} onChange={uploadFiles} multiple>
              <macro_1.Trans>Upload</macro_1.Trans>
            </react_1.File>
          </>)}
      </div>
      {viewMode === "icons" ? (<components_1.FilesIconView items={iconItems} canDelete={!isReadOnly} emptyMessage={<macro_1.Trans>No files uploaded</macro_1.Trans>} onDownload={function (item) { return item.raw && download(item.raw); }} onDelete={function (item) { return item.raw && deleteFile(item.raw); }}/>) : (<react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th>
                <macro_1.Trans>Name</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Size</macro_1.Trans>
              </react_1.Th>
              <react_1.Th />
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {files.map(function (file) {
                var _a, _b;
                var type = (0, shared_1.getDocumentType)(file.name);
                return (<react_1.Tr key={file.id}>
                  <react_1.Td>
                    <react_1.HStack>
                      <DocumentIcon_1.default type={type}/>
                      <span className="font-medium cursor-pointer" onClick={function () {
                        if (["PDF", "Image"].includes(type)) {
                            window.open(path_1.path.to.file.previewFile("private/".concat(getFilePath(file.name))), "_blank");
                        }
                        else {
                            download(file);
                        }
                    }}>
                        {["PDF", "Image"].includes(type) ? (<components_1.DocumentPreview bucket="private" pathToFile={getFilePath(file.name)} 
                    // @ts-expect-error
                    type={type}>
                            {file.name}
                          </components_1.DocumentPreview>) : (file.name)}
                      </span>
                    </react_1.HStack>
                  </react_1.Td>
                  <react_1.Td>
                    {(0, utils_1.convertKbToString)(Math.floor(((_b = (_a = file.metadata) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0) / 1024))}
                  </react_1.Td>
                  <react_1.Td>
                    <div className="flex justify-end w-full">
                      <react_1.DropdownMenu>
                        <react_1.DropdownMenuTrigger asChild>
                          <react_1.IconButton aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                        </react_1.DropdownMenuTrigger>
                        <react_1.DropdownMenuContent>
                          <react_1.DropdownMenuItem onClick={function () { return download(file); }}>
                            <macro_1.Trans>Download</macro_1.Trans>
                          </react_1.DropdownMenuItem>
                          {!isReadOnly && (<react_1.DropdownMenuItem destructive onClick={function () { return deleteFile(file); }}>
                              <macro_1.Trans>Delete</macro_1.Trans>
                            </react_1.DropdownMenuItem>)}
                        </react_1.DropdownMenuContent>
                      </react_1.DropdownMenu>
                    </div>
                  </react_1.Td>
                </react_1.Tr>);
            })}
            {files.length === 0 && (<react_1.Tr>
                <react_1.Td colSpan={3} className="py-8 text-muted-foreground text-center">
                  <macro_1.Trans>No files uploaded</macro_1.Trans>
                </react_1.Td>
              </react_1.Tr>)}
          </react_1.Tbody>
        </react_1.Table>)}
      {!isReadOnly && <components_1.FileDropzone onDrop={onDrop}/>}
    </>);
}
exports.default = MaintenanceDispatchNotes;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
