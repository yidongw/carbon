"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
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
var Documents = function (_a) {
    var _b;
    var files = _a.files, modelUpload = _a.modelUpload, sourceDocument = _a.sourceDocument, sourceDocumentId = _a.sourceDocumentId, sourceDocumentLineId = _a.sourceDocumentLineId, writeBucket = _a.writeBucket, writeBucketPermission = _a.writeBucketPermission;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var permissions = (0, hooks_1.usePermissions)();
    var revalidator = (0, react_router_1.useRevalidator)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var submit = (0, react_router_1.useSubmit)();
    var canDelete = permissions.can("delete", writeBucketPermission);
    var canUpdate = permissions.can("update", writeBucketPermission);
    var attachmentsByName = new Map(files.map(function (file) { return [file.name, file]; }));
    var pendingItems = usePendingItems();
    for (var _i = 0, pendingItems_1 = pendingItems; _i < pendingItems_1.length; _i++) {
        var pendingItem = pendingItems_1[_i];
        var item = attachmentsByName.get(pendingItem.name);
        var merged = item ? __assign(__assign({}, item), pendingItem) : pendingItem;
        attachmentsByName.set(pendingItem.name, merged);
    }
    var allFiles = Array.from(attachmentsByName.values()).sort(function (a, b) {
        return a.name.localeCompare(b.name);
    });
    var getReadPath = (0, react_2.useCallback)(function (file) {
        var _a;
        var id = sourceDocumentLineId || sourceDocumentId;
        return "".concat(company.id, "/").concat((_a = file.bucket) !== null && _a !== void 0 ? _a : writeBucket, "/").concat(id, "/").concat(file.name);
    }, [company.id, sourceDocumentId, sourceDocumentLineId, writeBucket]);
    var getWritePath = (0, react_2.useCallback)(function (file) {
        var id = sourceDocumentLineId || sourceDocumentId;
        return "".concat(company.id, "/").concat(writeBucket, "/").concat(id, "/").concat((0, string_1.stripSpecialCharacters)(file.name));
    }, [company.id, sourceDocumentId, sourceDocumentLineId, writeBucket]);
    var deleteFile = (0, react_2.useCallback)(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileDelete;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").remove([getReadPath(file)]))];
                case 1:
                    fileDelete = _b.sent();
                    if (!fileDelete || fileDelete.error) {
                        react_1.toast.error(((_a = fileDelete === null || fileDelete === void 0 ? void 0 : fileDelete.error) === null || _a === void 0 ? void 0 : _a.message) || t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Error deleting file"], ["Error deleting file"]))));
                        return [2 /*return*/];
                    }
                    react_1.toast.success(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["", " deleted successfully"], ["", " deleted successfully"])), file.name));
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon === null || carbon === void 0 ? void 0 : carbon.storage, getReadPath, revalidator, t]);
    var downloadModel = (0, react_2.useCallback)(function (model) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!model.modelPath || !model.modelName) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Model data is missing"], ["Model data is missing"]))));
                        return [2 /*return*/];
                    }
                    url = path_1.path.to.file.previewFile("private/".concat(model.modelPath));
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
                    a.download = model.modelName;
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
    }); }, [t]);
    var deleteModel = (0, react_2.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon || !sourceDocumentId)
                        return [2 /*return*/];
                    if (!(sourceDocument === "Job")) return [3 /*break*/, 2];
                    return [4 /*yield*/, carbon
                            .from("job")
                            .update({ modelUploadId: null })
                            .eq("id", sourceDocumentId)];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        react_1.toast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Error removing model from ", ""], ["Error removing model from ", ""])), sourceDocument));
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    if (sourceDocument === "Issue") {
                        // no action required
                    }
                    else {
                        react_1.toast.error(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Unsupported source document type: ", ""], ["Unsupported source document type: ", ""])), sourceDocument));
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3:
                    react_1.toast.success(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Model removed from ", ""], ["Model removed from ", ""])), sourceDocument));
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, sourceDocument, sourceDocumentId, revalidator, t]);
    var download = (0, react_2.useCallback)(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = path_1.path.to.file.previewFile("private/".concat(getReadPath(file)));
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
                    error_2 = _a.sent();
                    react_1.toast.error(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [getReadPath, t]);
    var upload = (0, react_2.useCallback)(function (files) { return __awaiter(void 0, void 0, void 0, function () {
        var _i, files_1, file, fileName, fileUpload, formData;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    _i = 0, files_1 = files;
                    _b.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 4];
                    file = files_1[_i];
                    fileName = getWritePath({ name: file.name });
                    react_1.toast.info(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name));
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(fileName, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            upsert: true
                        })];
                case 2:
                    fileUpload = _b.sent();
                    if (fileUpload.error) {
                        react_1.toast.error(t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Failed to upload file: ", ""], ["Failed to upload file: ", ""])), file.name));
                    }
                    else if (((_a = fileUpload.data) === null || _a === void 0 ? void 0 : _a.path) &&
                        sourceDocument &&
                        sourceDocumentId) {
                        react_1.toast.success(t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Uploaded: ", ""], ["Uploaded: ", ""])), file.name));
                        formData = new FormData();
                        formData.append("path", fileUpload.data.path);
                        formData.append("name", file.name);
                        formData.append("size", Math.round(file.size / 1024).toString());
                        formData.append("sourceDocument", sourceDocument);
                        formData.append("sourceDocumentId", sourceDocumentId);
                        submit(formData, {
                            method: "post",
                            action: path_1.path.to.newDocument,
                            navigate: false,
                            fetcherKey: "".concat(sourceDocument, ":").concat(file.name)
                        });
                    }
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [
        getWritePath,
        carbon,
        revalidator,
        submit,
        sourceDocument,
        sourceDocumentId,
        t
    ]);
    var onDrop = (0, react_2.useCallback)(function (acceptedFiles) {
        upload(acceptedFiles);
    }, [upload]);
    var _c = (0, FilesViewModeToggle_1.useFilesViewMode)(), viewMode = _c[0], setViewMode = _c[1];
    var iconItems = (0, react_2.useMemo)(function () {
        var _a, _b;
        var items = [];
        if (modelUpload === null || modelUpload === void 0 ? void 0 : modelUpload.modelName) {
            items.push({
                id: (_a = modelUpload.modelId) !== null && _a !== void 0 ? _a : "model",
                name: modelUpload.modelName,
                documentType: "Model",
                sizeBytes: modelUpload.modelSize,
                isModel: true,
                modelViewUrl: modelUpload.modelId
                    ? path_1.path.to.file.cadModel(modelUpload.modelId)
                    : undefined
            });
        }
        for (var _i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
            var file = allFiles_1[_i];
            var type = (0, shared_1.getDocumentType)(file.name);
            items.push({
                id: file.id,
                name: file.name,
                documentType: type,
                pathToFile: getReadPath(file),
                createdAt: file.created_at,
                sizeBytes: (_b = file.metadata) === null || _b === void 0 ? void 0 : _b.size,
                previewType: ["PDF", "Image"].includes(type)
                    ? type
                    : undefined,
                raw: file
            });
        }
        return items;
    }, [allFiles, getReadPath, modelUpload]);
    return (<react_1.Card className="flex-grow">
      <react_1.HStack className="justify-between items-start">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Files</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardAction>
          <react_1.HStack>
            <components_1.FilesViewModeToggle value={viewMode} onChange={setViewMode}/>
            <react_1.File isDisabled={!canUpdate} leftIcon={<lu_1.LuUpload />} onChange={function (e) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (e.target.files && carbon && company) {
                    upload(Array.from(e.target.files));
                }
                return [2 /*return*/];
            });
        }); }} multiple>
              <macro_1.Trans>New</macro_1.Trans>
            </react_1.File>
          </react_1.HStack>
        </react_1.CardAction>
      </react_1.HStack>
      <react_1.CardContent>
        {viewMode === "icons" ? (<components_1.FilesIconView items={iconItems} canDelete={canDelete} onDownload={function (item) {
                if (item.isModel && modelUpload) {
                    downloadModel(modelUpload);
                }
                else if (item.raw) {
                    download(item.raw);
                }
            }} onDelete={function (item) {
                if (item.isModel) {
                    deleteModel();
                }
                else if (item.raw) {
                    deleteFile(item.raw);
                }
            }}/>) : (<react_1.Table>
            <react_1.Thead>
              <react_1.Tr>
                <react_1.Th>
                  <macro_1.Trans>Name</macro_1.Trans>
                </react_1.Th>
                <react_1.Th>
                  <macro_1.Trans>Size</macro_1.Trans>
                </react_1.Th>
                <react_1.Th>
                  <macro_1.Trans>Created</macro_1.Trans>
                </react_1.Th>
                <react_1.Th></react_1.Th>
              </react_1.Tr>
            </react_1.Thead>
            <react_1.Tbody>
              {(modelUpload === null || modelUpload === void 0 ? void 0 : modelUpload.modelName) && (<react_1.Tr>
                  <react_1.Td>
                    <react_1.HStack>
                      <lu_1.LuAxis3D className="text-emerald-500 w-6 h-6"/>
                      <components_1.Hyperlink target="_blank" to={modelUpload.modelId
                    ? path_1.path.to.file.cadModel(modelUpload.modelId)
                    : ""}>
                        {modelUpload.modelName}
                      </components_1.Hyperlink>
                    </react_1.HStack>
                  </react_1.Td>
                  <react_1.Td className="text-xs font-mono">
                    {modelUpload.modelSize
                    ? (0, utils_1.convertKbToString)(Math.floor(((_b = modelUpload.modelSize) !== null && _b !== void 0 ? _b : 0) / 1024))
                    : "--"}
                  </react_1.Td>
                  <react_1.Td className="text-xs font-mono">--</react_1.Td>
                  <react_1.Td>
                    <div className="flex justify-end w-full">
                      <react_1.DropdownMenu>
                        <react_1.DropdownMenuTrigger asChild>
                          <react_1.IconButton aria-label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                        </react_1.DropdownMenuTrigger>
                        <react_1.DropdownMenuContent>
                          <react_1.DropdownMenuItem onClick={function () { return downloadModel(modelUpload); }}>
                            <macro_1.Trans>Download</macro_1.Trans>
                          </react_1.DropdownMenuItem>
                          <react_1.DropdownMenuItem asChild>
                            <react_router_1.Link to={modelUpload.modelId
                    ? path_1.path.to.file.cadModel(modelUpload.modelId)
                    : ""}>
                              <macro_1.Trans>View</macro_1.Trans>
                            </react_router_1.Link>
                          </react_1.DropdownMenuItem>
                          <react_1.DropdownMenuItem disabled={!canDelete} destructive onClick={function () { return deleteModel(); }}>
                            <macro_1.Trans>Delete</macro_1.Trans>
                          </react_1.DropdownMenuItem>
                        </react_1.DropdownMenuContent>
                      </react_1.DropdownMenu>
                    </div>
                  </react_1.Td>
                </react_1.Tr>)}
              {allFiles.map(function (file) {
                var _a, _b;
                var type = (0, shared_1.getDocumentType)(file.name);
                var isPreviewable = ["PDF", "Image"].includes(type);
                return (<react_1.Tr key={file.id}>
                    <react_1.Td>
                      <react_1.HStack>
                        <DocumentIcon_1.default type={type}/>
                        <span className="font-medium" onClick={function () {
                        if (["PDF", "Image"].includes(type)) {
                            window.open(path_1.path.to.file.previewFile("".concat("private", "/").concat(getReadPath(file))), "_blank");
                        }
                        else {
                            download(file);
                        }
                    }}>
                          {isPreviewable ? (<components_1.DocumentPreview bucket="private" pathToFile={getReadPath(file)} 
                    // @ts-ignore
                    type={(0, shared_1.getDocumentType)(file.name)}>
                              {file.name}
                            </components_1.DocumentPreview>) : (file.name)}
                        </span>
                      </react_1.HStack>
                    </react_1.Td>
                    <react_1.Td className="text-xs font-mono">
                      {(0, utils_1.convertKbToString)(Math.floor(((_b = (_a = file.metadata) === null || _a === void 0 ? void 0 : _a.size) !== null && _b !== void 0 ? _b : 0) / 1024))}
                    </react_1.Td>
                    <react_1.Td className="text-xs font-mono">
                      {file.created_at ? formatDate(file.created_at) : "--"}
                    </react_1.Td>
                    <react_1.Td>
                      <div className="flex justify-end w-full">
                        <react_1.DropdownMenu>
                          <react_1.DropdownMenuTrigger asChild>
                            <react_1.IconButton aria-label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                          </react_1.DropdownMenuTrigger>
                          <react_1.DropdownMenuContent>
                            <react_1.DropdownMenuItem onClick={function () { return download(file); }}>
                              <macro_1.Trans>Download</macro_1.Trans>
                            </react_1.DropdownMenuItem>
                            <react_1.DropdownMenuItem disabled={!canDelete} onClick={function () { return deleteFile(file); }} destructive>
                              <macro_1.Trans>Delete</macro_1.Trans>
                            </react_1.DropdownMenuItem>
                          </react_1.DropdownMenuContent>
                        </react_1.DropdownMenu>
                      </div>
                    </react_1.Td>
                  </react_1.Tr>);
            })}
              {allFiles.length === 0 && !modelUpload && (<react_1.Tr>
                  <react_1.Td colSpan={24} className="py-8 text-muted-foreground text-center">
                    <macro_1.Trans>No files</macro_1.Trans>
                  </react_1.Td>
                </react_1.Tr>)}
            </react_1.Tbody>
          </react_1.Table>)}
        <components_1.FileDropzone onDrop={onDrop}/>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = Documents;
var usePendingItems = function () {
    return (0, react_router_1.useFetchers)()
        .filter(function (fetcher) {
        return fetcher.formAction === path_1.path.to.newDocument;
    })
        .reduce(function (acc, fetcher) {
        var path = fetcher.formData.get("path");
        var name = fetcher.formData.get("name");
        var size = parseInt(fetcher.formData.get("size"), 10) * 1024;
        if (path && name && size) {
            var newItem = {
                id: path,
                name: name,
                bucket_id: "private",
                bucket: "private",
                metadata: {
                    size: size,
                    mimetype: (0, shared_1.getDocumentType)(name)
                }
            };
            return __spreadArray(__spreadArray([], acc, true), [newItem], false);
        }
        return acc;
    }, []);
};
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
