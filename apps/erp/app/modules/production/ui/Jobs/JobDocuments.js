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
var Enumerable_1 = require("~/components/Enumerable");
var FilesViewModeToggle_1 = require("~/components/FilesViewModeToggle");
var hooks_1 = require("~/hooks");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var upload_1 = require("~/utils/upload");
var useJobDocuments = function (_a) {
    var jobId = _a.jobId, itemId = _a.itemId;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var revalidator = (0, react_router_1.useRevalidator)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var submit = (0, react_router_1.useSubmit)();
    var canDelete = permissions.can("delete", "production");
    var canUpdate = permissions.can("update", "production");
    var getPath = (0, react_2.useCallback)(function (file, bucket) {
        if (bucket === void 0) { bucket = "job"; }
        if (bucket === "parts" && itemId) {
            return "".concat(company.id, "/parts/").concat(itemId, "/").concat((0, string_1.stripSpecialCharacters)(file.name));
        }
        return "".concat(company.id, "/job/").concat(jobId, "/").concat((0, string_1.stripSpecialCharacters)(file.name));
    }, [company.id, jobId, itemId]);
    var deleteFile = (0, react_2.useCallback)(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket, fileDelete;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    bucket = file.bucket === "parts" ? "parts" : "job";
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").remove([getPath(file, bucket)]))];
                case 1:
                    fileDelete = _b.sent();
                    if (!fileDelete || fileDelete.error) {
                        react_1.toast.error(((_a = fileDelete === null || fileDelete === void 0 ? void 0 : fileDelete.error) === null || _a === void 0 ? void 0 : _a.message) || "Error deleting file");
                        return [2 /*return*/];
                    }
                    react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["", " deleted successfully"], ["", " deleted successfully"])), file.name));
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [getPath, carbon === null || carbon === void 0 ? void 0 : carbon.storage, revalidator, t]);
    var deleteModel = (0, react_2.useCallback)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("job")
                            .update({ modelUploadId: null })
                            .eq("id", jobId)];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Error removing model from job"], ["Error removing model from job"]))));
                        return [2 /*return*/];
                    }
                    react_1.toast.success(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Model removed from job"], ["Model removed from job"]))));
                    revalidator.revalidate();
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, jobId, revalidator, t]);
    var downloadModel = (0, react_2.useCallback)(function (model) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!model.modelPath || !model.modelName) {
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Model data is missing"], ["Model data is missing"]))));
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
                    react_1.toast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, [t]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var download = (0, react_2.useCallback)(function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var bucket, url, response, blob, blobUrl, a, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bucket = file.bucket === "parts" ? "parts" : "job";
                    url = path_1.path.to.file.previewFile("private/".concat(getPath(file, bucket)));
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
                    react_1.toast.error(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Error downloading file"], ["Error downloading file"]))));
                    console.error(error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); }, []);
    var getModelPath = (0, react_2.useCallback)(function (model) {
        if (!(model === null || model === void 0 ? void 0 : model.modelId)) {
            return "";
        }
        return path_1.path.to.file.cadModel(model.modelId);
    }, []);
    var createDocumentRecord = (0, react_2.useCallback)(function (_a) {
        var filePath = _a.path, name = _a.name, size = _a.size, _b = _a.bucket, bucket = _b === void 0 ? "job" : _b;
        var formData = new FormData();
        formData.append("path", filePath);
        formData.append("name", name);
        formData.append("size", Math.round(size / 1024).toString());
        formData.append("sourceDocument", "Job");
        formData.append("sourceDocumentId", jobId);
        submit(formData, {
            method: "post",
            action: path_1.path.to.newDocument,
            navigate: false,
            fetcherKey: "job:".concat(name)
        });
    }, [jobId, submit]);
    var upload = (0, react_2.useCallback)(function (files_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([files_1], args_1, true), void 0, function (files, bucket) {
            var _loop_1, _a, _b, _c, index, file;
            var _d;
            if (bucket === void 0) { bucket = "job"; }
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!carbon) {
                            react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                            return [2 /*return*/];
                        }
                        if (bucket === "parts" && !itemId) {
                            react_1.toast.error(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Cannot upload to parts bucket without item ID"], ["Cannot upload to parts bucket without item ID"]))));
                            return [2 /*return*/];
                        }
                        _loop_1 = function (index, file) {
                            var uploadToast, fileName, fileUpload;
                            return __generator(this, function (_f) {
                                switch (_f.label) {
                                    case 0:
                                        uploadToast = (0, upload_1.createUploadToast)({
                                            id: "job-doc-".concat(jobId, "-").concat(index, "-").concat(file.name),
                                            label: function (pct) { return "".concat(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                                        });
                                        fileName = getPath(file, bucket);
                                        return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                                                bucket: "private",
                                                path: fileName,
                                                file: file,
                                                cacheControl: "".concat(12 * 60 * 60),
                                                upsert: true,
                                                onProgress: uploadToast.onProgress
                                            })];
                                    case 1:
                                        fileUpload = _f.sent();
                                        if (fileUpload.error) {
                                            uploadToast.error(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Failed to upload file: ", ""], ["Failed to upload file: ", ""])), file.name));
                                        }
                                        else if ((_d = fileUpload.data) === null || _d === void 0 ? void 0 : _d.path) {
                                            uploadToast.dismiss();
                                            createDocumentRecord({
                                                path: fileUpload.data.path,
                                                name: file.name,
                                                size: file.size,
                                                bucket: bucket
                                            });
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        _a = 0, _b = files.entries();
                        _e.label = 1;
                    case 1:
                        if (!(_a < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_a], index = _c[0], file = _c[1];
                        return [5 /*yield**/, _loop_1(index, file)];
                    case 2:
                        _e.sent();
                        _e.label = 3;
                    case 3:
                        _a++;
                        return [3 /*break*/, 1];
                    case 4:
                        revalidator.revalidate();
                        return [2 /*return*/];
                }
            });
        });
    }, [getPath, createDocumentRecord, carbon, revalidator, itemId, jobId, t]);
    var moveFile = (0, react_2.useCallback)(function (file, targetBucket) { return __awaiter(void 0, void 0, void 0, function () {
        var currentBucket, sourcePath, downloadData, targetPath, uploadError, deleteError, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    if (targetBucket === "parts" && !itemId) {
                        react_1.toast.error(t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Cannot move to parts bucket without item ID"], ["Cannot move to parts bucket without item ID"]))));
                        return [2 /*return*/];
                    }
                    currentBucket = file.bucket === "parts" ? "parts" : "job";
                    if (currentBucket === targetBucket) {
                        react_1.toast.error(t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["File is already in the selected bucket"], ["File is already in the selected bucket"]))));
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    sourcePath = getPath(file, currentBucket);
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .download(sourcePath)];
                case 2:
                    downloadData = (_a.sent()).data;
                    if (!downloadData) {
                        react_1.toast.error(t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Failed to download file for moving"], ["Failed to download file for moving"]))));
                        return [2 /*return*/];
                    }
                    targetPath = getPath(file, targetBucket);
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(targetPath, downloadData, {
                            cacheControl: "".concat(12 * 60 * 60),
                            upsert: true
                        })];
                case 3:
                    uploadError = (_a.sent()).error;
                    if (uploadError) {
                        react_1.toast.error(t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Failed to upload file to new location"], ["Failed to upload file to new location"]))));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .remove([sourcePath])];
                case 4:
                    deleteError = (_a.sent()).error;
                    if (deleteError) {
                        react_1.toast.error(t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Failed to delete file from old location"], ["Failed to delete file from old location"]))));
                        return [2 /*return*/];
                    }
                    react_1.toast.success("Moved ".concat(file.name, " to ").concat(targetBucket === "parts" ? "Item Master" : "Job", " bucket"));
                    revalidator.revalidate();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    react_1.toast.error(t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Error moving file"], ["Error moving file"]))));
                    console.error(error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [carbon, itemId, getPath, revalidator, t]);
    return {
        canDelete: canDelete,
        canUpdate: canUpdate,
        deleteFile: deleteFile,
        deleteModel: deleteModel,
        download: download,
        downloadModel: downloadModel,
        getPath: getPath,
        getModelPath: getModelPath,
        moveFile: moveFile,
        upload: upload
    };
};
var JobDocuments = function (_a) {
    var _b;
    var files = _a.files, jobId = _a.jobId, itemId = _a.itemId, modelUpload = _a.modelUpload, _c = _a.bucket, bucket = _c === void 0 ? "job" : _c, isReadOnly = _a.isReadOnly;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _d = useJobDocuments({
        jobId: jobId,
        itemId: itemId
    }), canDelete = _d.canDelete, canUpdate = _d.canUpdate, download = _d.download, downloadModel = _d.downloadModel, deleteFile = _d.deleteFile, deleteModel = _d.deleteModel, getPath = _d.getPath, getModelPath = _d.getModelPath, moveFile = _d.moveFile, upload = _d.upload;
    var onDrop = (0, react_2.useCallback)(function (acceptedFiles) {
        upload(acceptedFiles);
    }, [upload]);
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
    var _e = (0, FilesViewModeToggle_1.useFilesViewMode)(), viewMode = _e[0], setViewMode = _e[1];
    var getFileBucket = (0, react_2.useCallback)(function (file) {
        return file.bucket === "parts"
            ? "parts"
            : "job";
    }, []);
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
                modelViewUrl: getModelPath(modelUpload)
            });
        }
        for (var _i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
            var file = allFiles_1[_i];
            var type = (0, shared_1.getDocumentType)(file.name);
            items.push({
                id: file.id,
                name: file.name,
                documentType: type,
                pathToFile: getPath(file, getFileBucket(file)),
                createdAt: file.created_at,
                sizeBytes: (_b = file.metadata) === null || _b === void 0 ? void 0 : _b.size,
                previewType: ["PDF", "Image"].includes(type)
                    ? type
                    : undefined,
                raw: file
            });
        }
        return items;
    }, [allFiles, getFileBucket, getModelPath, getPath, modelUpload]);
    return (<>
      <react_1.Card className="flex-grow">
        <react_1.HStack className="justify-between items-start">
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Files</macro_1.Trans>
            </react_1.CardTitle>
          </react_1.CardHeader>
          <react_1.CardAction>
            <react_1.HStack>
              <components_1.FilesViewModeToggle value={viewMode} onChange={setViewMode}/>
              {!isReadOnly && (<JobDocumentForm jobId={jobId} itemId={itemId} bucket={bucket}/>)}
            </react_1.HStack>
          </react_1.CardAction>
        </react_1.HStack>
        <react_1.CardContent>
          {viewMode === "icons" ? (<components_1.FilesIconView items={iconItems} canDelete={canDelete && !isReadOnly} onDownload={function (item) {
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
                    <macro_1.Trans>Bucket</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th>
                    <macro_1.Trans>Created</macro_1.Trans>
                  </react_1.Th>
                  <react_1.Th />
                </react_1.Tr>
              </react_1.Thead>
              <react_1.Tbody>
                {(modelUpload === null || modelUpload === void 0 ? void 0 : modelUpload.modelName) && (<react_1.Tr>
                    <react_1.Td>
                      <react_1.HStack>
                        <DocumentIcon_1.default type="Model"/>
                        <react_1.VStack>
                          <components_1.Hyperlink target="_blank" to={getModelPath(modelUpload)}>
                            {modelUpload.modelName}
                          </components_1.Hyperlink>
                        </react_1.VStack>
                      </react_1.HStack>
                    </react_1.Td>
                    <react_1.Td>
                      {modelUpload.modelSize
                    ? (0, utils_1.convertKbToString)(Math.floor(((_b = modelUpload.modelSize) !== null && _b !== void 0 ? _b : 0) / 1024))
                    : "--"}
                    </react_1.Td>
                    <react_1.Td>
                      <Enumerable_1.Enumerable value="Job"/>
                    </react_1.Td>
                    <react_1.Td className="text-xs font-mono">--</react_1.Td>
                    <react_1.Td>
                      <div className="flex justify-end w-full">
                        <react_1.DropdownMenu>
                          <react_1.DropdownMenuTrigger asChild>
                            <react_1.IconButton aria-label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                          </react_1.DropdownMenuTrigger>
                          <react_1.DropdownMenuContent>
                            <react_1.DropdownMenuItem asChild>
                              <react_router_1.Link to={getModelPath(modelUpload)}>
                                <macro_1.Trans>View</macro_1.Trans>
                              </react_router_1.Link>
                            </react_1.DropdownMenuItem>
                            <react_1.DropdownMenuItem onClick={function () { return downloadModel(modelUpload); }}>
                              Download
                            </react_1.DropdownMenuItem>
                            <react_1.DropdownMenuItem destructive disabled={!canDelete || isReadOnly} onClick={function () { return deleteModel(); }}>
                              Delete
                            </react_1.DropdownMenuItem>
                          </react_1.DropdownMenuContent>
                        </react_1.DropdownMenu>
                      </div>
                    </react_1.Td>
                  </react_1.Tr>)}
                {allFiles.map(function (file) {
                var _a, _b;
                var type = (0, shared_1.getDocumentType)(file.name);
                return (<react_1.Tr key={file.id}>
                      <react_1.Td>
                        <react_1.HStack>
                          <DocumentIcon_1.default type={type}/>
                          <span className="font-medium cursor-pointer" onClick={function () {
                        if (["PDF", "Image"].includes(type)) {
                            var bucket_1 = file.bucket === "parts"
                                ? "parts"
                                : "job";
                            window.open(path_1.path.to.file.previewFile("".concat("private", "/").concat(getPath(file, bucket_1))), "_blank");
                        }
                        else {
                            download(file);
                        }
                    }}>
                            {["PDF", "Image"].includes(type) ? (<components_1.DocumentPreview bucket="private" pathToFile={getPath(file, file.bucket === "parts"
                            ? "parts"
                            : "job")} 
                    // @ts-ignore
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
                        <Enumerable_1.Enumerable value={file.bucket === "parts"
                        ? "Item"
                        : file.bucket === "opportunity-line"
                            ? "Opportunity"
                            : "Job"}/>
                      </react_1.Td>
                      <react_1.Td className="text-xs font-mono">
                        {file.created_at ? formatDate(file.created_at) : "--"}
                      </react_1.Td>
                      <react_1.Td>
                        <div className="flex justify-end w-full">
                          <react_1.DropdownMenu>
                            <react_1.DropdownMenuTrigger asChild>
                              <react_1.IconButton aria-label={t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["More"], ["More"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary"/>
                            </react_1.DropdownMenuTrigger>
                            <react_1.DropdownMenuContent>
                              <react_1.DropdownMenuItem onClick={function () { return download(file); }}>
                                Download
                              </react_1.DropdownMenuItem>
                              {itemId &&
                        file.bucket !== "opportunity-line" && (<react_1.DropdownMenuSub>
                                    <react_1.DropdownMenuSubTrigger disabled={!canUpdate || isReadOnly}>
                                      Move to
                                    </react_1.DropdownMenuSubTrigger>
                                    <react_1.DropdownMenuSubContent>
                                      <react_1.DropdownMenuRadioGroup value={file.bucket === "parts"
                            ? "parts"
                            : "job"} onValueChange={function (value) {
                            return moveFile(file, value);
                        }}>
                                        <react_1.DropdownMenuRadioItem value="job">
                                          Job
                                        </react_1.DropdownMenuRadioItem>
                                        <react_1.DropdownMenuRadioItem value="parts">
                                          Item
                                        </react_1.DropdownMenuRadioItem>
                                      </react_1.DropdownMenuRadioGroup>
                                    </react_1.DropdownMenuSubContent>
                                  </react_1.DropdownMenuSub>)}
                              <react_1.DropdownMenuItem destructive disabled={!canDelete || isReadOnly} onClick={function () { return deleteFile(file); }}>
                                Delete
                              </react_1.DropdownMenuItem>
                            </react_1.DropdownMenuContent>
                          </react_1.DropdownMenu>
                        </div>
                      </react_1.Td>
                    </react_1.Tr>);
            })}
                {allFiles.length === 0 && !modelUpload && (<react_1.Tr>
                    <react_1.Td colSpan={5} className="py-8 text-muted-foreground text-center">
                      <macro_1.Trans>No files</macro_1.Trans>
                    </react_1.Td>
                  </react_1.Tr>)}
              </react_1.Tbody>
            </react_1.Table>)}
          {!isReadOnly && <components_1.FileDropzone onDrop={onDrop}/>}
        </react_1.CardContent>
      </react_1.Card>
    </>);
};
exports.default = JobDocuments;
var JobDocumentForm = function (_a) {
    var jobId = _a.jobId, itemId = _a.itemId, _b = _a.bucket, bucket = _b === void 0 ? "job" : _b;
    var permissions = (0, hooks_1.usePermissions)();
    var upload = useJobDocuments({ jobId: jobId, itemId: itemId }).upload;
    var uploadFiles = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (e.target.files) {
                upload(Array.from(e.target.files), bucket);
            }
            return [2 /*return*/];
        });
    }); };
    return (<react_1.File isDisabled={!permissions.can("update", "production")} leftIcon={<lu_1.LuUpload />} onChange={function (e) { return uploadFiles(e); }} multiple>
      <macro_1.Trans>New</macro_1.Trans>
    </react_1.File>);
};
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
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19;
