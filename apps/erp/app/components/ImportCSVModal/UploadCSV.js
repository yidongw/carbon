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
exports.UploadCSV = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var papaparse_1 = require("papaparse");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var useUser_1 = require("~/hooks/useUser");
var shared_1 = require("~/modules/shared");
var upload_1 = require("~/utils/upload");
var useCsvContext_1 = require("./useCsvContext");
var UploadCSV = function (_a) {
    var table = _a.table;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, useUser_1.useUser)().company;
    var _b = (0, useCsvContext_1.useCsvContext)(), setFile = _b.setFile, setFileColumns = _b.setFileColumns, setFirstRows = _b.setFirstRows, setFilePath = _b.setFilePath;
    var _c = (0, react_2.useState)(false), uploading = _c[0], setUploading = _c[1];
    var _d = (0, react_2.useState)(false), loading = _d[0], setLoading = _d[1];
    var _e = (0, react_2.useState)(null), error = _e[0], setError = _e[1];
    var downloadTemplate = (0, react_2.useCallback)(function () {
        var mapping = shared_1.fieldMappings[table];
        var fields = Object.values(mapping);
        var headers = fields.map(function (f) { return f.label; });
        // Hint row: helps users see required-ness + valid values at a glance.
        // It's a CSV data row (CSV has no comment syntax) — users overwrite it
        // before re-uploading.
        var hints = fields.map(function (f) {
            var _a, _b, _c;
            var prefix = f.required ? "REQUIRED" : "optional";
            if (f.type === "enum" && ((_a = f.enumData) === null || _a === void 0 ? void 0 : _a.options)) {
                return "".concat(prefix, " \u2014 one of: ").concat(f.enumData.options.join(" | "));
            }
            if (f.type === "enum" && ((_b = f.enumData) === null || _b === void 0 ? void 0 : _b.fetcher)) {
                return "".concat(prefix, " \u2014 ").concat((_c = f.enumData.description) !== null && _c !== void 0 ? _c : "see your configured options");
            }
            if (f.type === "boolean")
                return "".concat(prefix, " \u2014 true | false");
            if (f.type === "numeric")
                return "".concat(prefix, " \u2014 number");
            return prefix;
        });
        var csv = papaparse_1.default.unparse({ fields: headers, data: [hints] });
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var url = URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = url;
        link.download = "".concat(table, "-template.csv");
        link.click();
        URL.revokeObjectURL(url);
    }, [table]);
    var processFile = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!file) {
                setFileColumns(null);
                return [2 /*return*/];
            }
            (0, react_dom_1.flushSync)(function () {
                setLoading(true);
            });
            papaparse_1.default.parse(file, {
                header: true,
                skipEmptyLines: true,
                error: function (error) {
                    setError(error.message);
                    setFileColumns(null);
                    setFirstRows(null);
                    setLoading(false);
                },
                complete: function (results) {
                    var data = results.data, meta = results.meta;
                    if (!data || data.length < 2) {
                        setError(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CSV file must have at least 2 rows."], ["CSV file must have at least 2 rows."]))));
                        setFileColumns(null);
                        setFirstRows(null);
                        setLoading(false);
                        return;
                    }
                    if (!meta || !meta.fields || meta.fields.length <= 1) {
                        setError(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to retrieve CSV column data."], ["Failed to retrieve CSV column data."]))));
                        setFileColumns(null);
                        setFirstRows(null);
                        setLoading(false);
                        return;
                    }
                    setFileColumns(meta.fields);
                    setFirstRows(data);
                    setLoading(false);
                }
            });
            return [2 /*return*/];
        });
    }); };
    var uploadFile = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileName, uploadToast, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fileName = "".concat(company.id, "/imports/").concat((0, nanoid_1.nanoid)(), ".csv");
                    if (!carbon) {
                        setError(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        setFileColumns(null);
                        setFirstRows(null);
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "csv-".concat(fileName, "-").concat(file.name),
                        label: function (pct) { return "".concat(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                    });
                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                            bucket: "private",
                            path: fileName,
                            file: file,
                            onProgress: uploadToast.onProgress
                        })];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error || !data) {
                        uploadToast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Failed to upload CSV file."], ["Failed to upload CSV file."]))));
                        setError(t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Failed to upload CSV file."], ["Failed to upload CSV file."]))));
                        setFileColumns(null);
                        setFirstRows(null);
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    uploadToast.dismiss();
                    setFilePath(data.path);
                    return [2 /*return*/];
            }
        });
    }); };
    var onDrop = function (acceptedFiles) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon) {
                        react_1.toast.error(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Carbon client not available"], ["Carbon client not available"]))));
                        return [2 /*return*/];
                    }
                    if (!(acceptedFiles.length > 0)) return [3 /*break*/, 3];
                    (0, react_dom_1.flushSync)(function () {
                        setUploading(true);
                    });
                    if (!acceptedFiles[0]) return [3 /*break*/, 2];
                    setFile(acceptedFiles[0]);
                    return [4 /*yield*/, Promise.all([
                            processFile(acceptedFiles[0]),
                            uploadFile(acceptedFiles[0])
                        ])];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    setUploading(false);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var _f = (0, react_dropzone_1.useDropzone)({
        onDrop: onDrop,
        accept: { "text/csv": [".csv"] },
        maxFiles: 1,
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: uploading
    }), getRootProps = _f.getRootProps, getInputProps = _f.getInputProps, isDragActive = _f.isDragActive, isDragReject = _f.isDragReject;
    return (<>
      <react_1.ModalHeader>
        <react_1.ModalTitle>
          <macro_1.Trans>Upload CSV</macro_1.Trans>
        </react_1.ModalTitle>

        <react_1.ModalDescription>
          <macro_1.Trans>Please upload a CSV file of your data</macro_1.Trans>
        </react_1.ModalDescription>
      </react_1.ModalHeader>
      <react_1.ModalBody>
        <div className="mt-1 mb-4 flex items-center justify-between gap-4 rounded-md border bg-muted/40 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border bg-background">
              <lu_1.LuFileSpreadsheet className="h-4 w-4 text-muted-foreground"/>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">
                <macro_1.Trans>Need the right columns?</macro_1.Trans>
              </span>
              <span className="text-xs text-muted-foreground">
                <macro_1.Trans>Hints in the first row</macro_1.Trans>
              </span>
            </div>
          </div>
          <react_1.Button variant="secondary" size="md" leftIcon={<lu_1.LuDownload />} onClick={downloadTemplate}>
            <macro_1.Trans>Download template</macro_1.Trans>
          </react_1.Button>
        </div>
        <div {...getRootProps()} className={(0, react_1.cn)("w-full border-2 border-dashed h-[200px] rounded-md mb-8 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-foreground cursor-pointer focus-visible:border-primary focus-visible:text-foreground hover:bg-primary/5 focus-visible:outline-none", isDragActive
            ? "border-primary text-foreground bg-primary/5"
            : "border-muted", isDragReject && "border-destructive")}>
          <div className="text-center flex items-center justify-center flex-col text-xs">
            <input {...getInputProps()}/>

            {loading ? (<div className="flex space-x-1 items-center">
                <react_1.Spinner />
                <span>
                  <macro_1.Trans>Loading...</macro_1.Trans>
                </span>
              </div>) : (<div>
                <p>
                  <macro_1.Trans>Drop your file here, or click to browse.</macro_1.Trans>
                </p>
                <span>
                  <macro_1.Trans>5MB file limit</macro_1.Trans>
                </span>
              </div>)}

            {error && (<p className="text-center text-sm text-red-600 mt-4">{error}</p>)}
          </div>
        </div>
      </react_1.ModalBody>
    </>);
};
exports.UploadCSV = UploadCSV;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
