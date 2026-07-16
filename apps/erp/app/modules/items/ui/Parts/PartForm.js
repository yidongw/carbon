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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var react_dropzone_1 = require("react-dropzone");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
var items_models_1 = require("../../items.models");
var ItemStorageFields_1 = require("../Item/ItemStorageFields");
var ItemThumbnailField_1 = require("../Item/ItemThumbnailField");
var SIZE_LIMIT = (0, utils_1.getFileSizeLimit)("CAD_MODEL_UPLOAD");
function startsWithLetter(value) {
    return /^[A-Za-z]/.test(value);
}
var PartForm = function (_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues, _f = _a.type, type = _f === void 0 ? "card" : _f, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var fetcher = (0, react_router_1.useFetcher)();
    var _g = (0, react_2.useState)(null), modelUploadId = _g[0], setModelUploadId = _g[1];
    var _h = (0, react_2.useState)(false), modelIsUploading = _h[0], setModelIsUploading = _h[1];
    var _j = (0, react_2.useState)(null), modelFile = _j[0], setModelFile = _j[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var companyId = (0, hooks_1.useUser)().company.id;
    var modelUpload = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var modelId, fileExtension, fileName, uploadToast, _a, fileUpload, recordInsert;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    (0, react_dom_1.flushSync)(function () {
                        setModelIsUploading(true);
                    });
                    modelId = (0, nanoid_1.nanoid)();
                    fileExtension = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/models/").concat(modelId, ".").concat(fileExtension);
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "model-".concat(modelId, "-").concat(file.name),
                        label: function (pct) { return "".concat(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file.name), " (").concat(pct, "%)"); }
                    });
                    return [4 /*yield*/, Promise.all([
                            (0, upload_1.uploadToStorageWithProgress)(carbon, {
                                bucket: "private",
                                path: fileName,
                                file: file,
                                onProgress: uploadToast.onProgress
                            }),
                            carbon.from("modelUpload").insert({
                                id: modelId,
                                modelPath: fileName,
                                size: file.size,
                                name: file.name,
                                companyId: companyId,
                                createdBy: "system"
                            })
                        ])];
                case 1:
                    _a = _b.sent(), fileUpload = _a[0], recordInsert = _a[1];
                    if (fileUpload.error || recordInsert.error) {
                        uploadToast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to upload model"], ["Failed to upload model"]))));
                    }
                    else {
                        uploadToast.dismiss();
                        setModelUploadId(modelId);
                        setModelFile(file);
                        react_1.toast.success(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Uploaded model"], ["Uploaded model"]))));
                    }
                    setModelIsUploading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var removeModel = function () {
        setModelUploadId(null);
        setModelFile(null);
    };
    var _k = (0, react_dropzone_1.useDropzone)({
        multiple: false,
        maxSize: SIZE_LIMIT.bytes,
        onDropAccepted: function (acceptedFiles) { return __awaiter(void 0, void 0, void 0, function () {
            var file, fileExtension;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        file = acceptedFiles[0];
                        fileExtension = (_a = file.name.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
                        if (!fileExtension || !utils_1.supportedModelTypes.includes(fileExtension)) {
                            react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["File type not supported"], ["File type not supported"]))));
                            return [2 /*return*/];
                        }
                        if (file.size > SIZE_LIMIT.bytes) {
                            react_1.toast.error(t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["File size too big (max. ", ")"], ["File size too big (max. ", ")"])), SIZE_LIMIT.format()));
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, modelUpload(file)];
                    case 1:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); },
        onDropRejected: function (fileRejections) {
            var errors = fileRejections[0].errors;
            var message;
            if (errors[0].code === "file-too-large") {
                message = t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["File size too big (max. ", ")"], ["File size too big (max. ", ")"])), SIZE_LIMIT.format());
            }
            else if (errors[0].code === "file-invalid-type") {
                message = t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["File type not supported"], ["File type not supported"])));
            }
            else {
                message = errors[0].message;
            }
            react_1.toast.error(message);
        }
    }), getRootProps = _k.getRootProps, getInputProps = _k.getInputProps, isDragActive = _k.isDragActive;
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Created part"], ["Created part"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Failed to create part: ", ""], ["Failed to create part: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var _l = (0, hooks_1.useNextItemId)("Part"), id = _l.id, onIdChange = _l.onIdChange, loading = _l.loading;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!initialValues.id;
    // Keep the latest id readable inside async callbacks without re-creating them.
    var idRef = (0, react_2.useRef)(id);
    idRef.current = id;
    // The uploaded image name becomes the default Part ID when one isn't set yet.
    var applyIdFromThumbnail = function (fileName) {
        if (idRef.current)
            return;
        var baseName = fileName.replace(/\.[^/.]+$/, "").trim();
        if (baseName)
            onIdChange(baseName.toUpperCase());
    };
    var translateItemTrackingType = function (v) {
        return v === "Inventory"
            ? t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Inventory"], ["Inventory"]))) : v === "Non-Inventory"
            ? t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Non-Inventory"], ["Non-Inventory"]))) : v === "Serial"
            ? t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Serial"], ["Serial"]))) : t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Batch"], ["Batch"])));
    };
    var itemTrackingTypeOptions = items_models_1.itemTrackingTypes.map(function (itemTrackingType) { return ({
        label: (<span className="flex items-center gap-2">
        <components_1.TrackingTypeIcon type={itemTrackingType}/>
        {translateItemTrackingType(itemTrackingType)}
      </span>),
        value: itemTrackingType
    }); });
    var _m = (0, react_2.useState)((_c = initialValues.replenishmentSystem) !== null && _c !== void 0 ? _c : "Buy"), replenishmentSystem = _m[0], setReplenishmentSystem = _m[1];
    var _o = (0, react_2.useState)((_d = initialValues.defaultMethodType) !== null && _d !== void 0 ? _d : "Pull from Inventory"), defaultMethodType = _o[0], setDefaultMethodType = _o[1];
    var itemReplenishmentSystemOptions = (_e = items_models_1.itemReplenishmentSystems.map(function (itemReplenishmentSystem) { return ({
        label: (<span className="flex items-center gap-2">
          <Icons_1.ReplenishmentSystemIcon type={itemReplenishmentSystem}/>
          {itemReplenishmentSystem === "Buy"
                ? t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Buy"], ["Buy"]))) : itemReplenishmentSystem === "Make"
                ? t(templateObject_15 || (templateObject_15 = __makeTemplateObject(["Make"], ["Make"]))) : t(templateObject_16 || (templateObject_16 = __makeTemplateObject(["Buy and Make"], ["Buy and Make"])))}
        </span>),
        value: itemReplenishmentSystem
    }); })) !== null && _e !== void 0 ? _e : [];
    return (<react_1.ModalCardProvider type={type}>
      <react_1.ModalCard onClose={onClose}>
        <react_1.ModalCardContent>
          <form_1.ValidatedForm action={isEditing ? undefined : path_1.path.to.newPart} method="post" validator={items_models_1.partValidator} defaultValues={initialValues} fetcher={fetcher}>
            <react_1.ModalCardHeader>
              <react_1.ModalCardTitle>
                {isEditing ? (<macro_1.Trans>Part Details</macro_1.Trans>) : (<macro_1.Trans>New Part</macro_1.Trans>)}
              </react_1.ModalCardTitle>
              {!isEditing && (<react_1.ModalCardDescription>
                  <macro_1.Trans>
                    A part contains the information about a specific item that
                    can be purchased or manufactured.
                  </macro_1.Trans>
                </react_1.ModalCardDescription>)}
            </react_1.ModalCardHeader>
            <react_1.ModalCardBody>
              <Form_1.Hidden name="type" value={type}/>
              <Form_1.Hidden name="modelUploadId" value={modelUploadId !== null && modelUploadId !== void 0 ? modelUploadId : ""}/>
              {!isEditing && (<ItemThumbnailField_1.default onUpload={applyIdFromThumbnail}/>)}
              {!isEditing && replenishmentSystem === "Make" && (<Form_1.Hidden name="unitCost" value={initialValues.unitCost}/>)}
              {!isEditing && replenishmentSystem === "Buy" && (<Form_1.Hidden name="lotSize" value={initialValues.lotSize}/>)}
              <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
                {isEditing ? (<Form_1.Input name="id" label={t(templateObject_17 || (templateObject_17 = __makeTemplateObject(["Part ID"], ["Part ID"])))} isReadOnly/>) : (<Form_1.InputControlled name="id" label={t(templateObject_18 || (templateObject_18 = __makeTemplateObject(["Part ID"], ["Part ID"])))} helperText={startsWithLetter(id)
                ? t(templateObject_19 || (templateObject_19 = __makeTemplateObject(["Use ... to get the next part ID"], ["Use ... to get the next part ID"]))) : undefined} value={id} onChange={onIdChange} isDisabled={loading} isUppercase/>)}
                <Form_1.Input name="revision" label={t(templateObject_20 || (templateObject_20 = __makeTemplateObject(["Revision"], ["Revision"])))} isReadOnly={isEditing}/>

                <Form_1.Input name="name" label={t(templateObject_21 || (templateObject_21 = __makeTemplateObject(["Short Description"], ["Short Description"])))} characterLimit={40}/>

                <Form_1.Select name="replenishmentSystem" label={t(templateObject_22 || (templateObject_22 = __makeTemplateObject(["Replenishment System"], ["Replenishment System"])))} options={itemReplenishmentSystemOptions} onChange={function (newValue) {
            var _a;
            setReplenishmentSystem((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Buy");
            if ((newValue === null || newValue === void 0 ? void 0 : newValue.value) === "Buy") {
                setDefaultMethodType("Pull from Inventory");
            }
            else {
                setDefaultMethodType("Make to Order");
            }
        }}/>
                <Form_1.Select name="itemTrackingType" label={t(templateObject_23 || (templateObject_23 = __makeTemplateObject(["Tracking Type"], ["Tracking Type"])))} options={itemTrackingTypeOptions}/>
                <Form_1.DefaultMethodType name="defaultMethodType" label={t(templateObject_24 || (templateObject_24 = __makeTemplateObject(["Default Method Type"], ["Default Method Type"])))} replenishmentSystem={replenishmentSystem} value={defaultMethodType} onChange={function (newValue) {
            var _a;
            return setDefaultMethodType((_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "Pull from Inventory");
        }}/>
                <Form_1.UnitOfMeasure name="unitOfMeasureCode" label={t(templateObject_25 || (templateObject_25 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))}/>
                {!isEditing && (<Form_1.ItemPostingGroup name="postingGroupId" label={t(templateObject_26 || (templateObject_26 = __makeTemplateObject(["Item Group"], ["Item Group"])))} isClearable/>)}
                {!isEditing && (<Form_1.Template name="templateId" label={t(templateObject_27 || (templateObject_27 = __makeTemplateObject(["Template"], ["Template"])))}/>)}
                {!isEditing && replenishmentSystem !== "Make" && (<Form_1.Number name="unitCost" label={t(templateObject_28 || (templateObject_28 = __makeTemplateObject(["Unit Cost"], ["Unit Cost"])))} formatOptions={{
                style: "currency",
                currency: baseCurrency
            }} minValue={0}/>)}
                {!isEditing && replenishmentSystem !== "Buy" && (<Form_1.Number name="lotSize" label={t(templateObject_29 || (templateObject_29 = __makeTemplateObject(["Batch Size"], ["Batch Size"])))} minValue={0}/>)}

                <ItemStorageFields_1.default />

                <Form_1.CustomFormFields table="part" tags={initialValues.tags}/>
              </div>
              <div className="mt-4 w-full">
                <Form_1.TextArea name="description" label={t(templateObject_30 || (templateObject_30 = __makeTemplateObject(["Long Description"], ["Long Description"])))}/>
              </div>
              <react_1.VStack spacing={2} className="mt-4 w-full">
                <label htmlFor="model-upload" className="text-xs font-medium text-muted-foreground">
                  <macro_1.Trans>CAD Model</macro_1.Trans>
                </label>
                <div {...getRootProps()} className={"w-full border-2 border-dashed rounded-md p-6 text-center hover:border-primary hover:bg-primary/10 cursor-pointer ".concat(isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted")}>
                  <input id="model-upload" {...getInputProps()}/>
                  {modelFile ? (<>
                      <p className="text-sm font-semibold text-card-foreground">
                        {modelFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground">
                        {(0, utils_1.convertKbToString)(Math.ceil(modelFile.size / 1024))}
                      </p>
                      <react_1.Button size="sm" variant="secondary" className="mt-2" onClick={removeModel}>
                        <macro_1.Trans>Remove</macro_1.Trans>
                      </react_1.Button>
                    </>) : (<react_1.Loading isLoading={modelIsUploading}>
                      <lu_1.LuCloudUpload className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary-foreground"/>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground">
                        {t(templateObject_31 || (templateObject_31 = __makeTemplateObject(["Supports ", " files"], ["Supports ", " files"])), utils_1.supportedModelTypes.join(", "))}
                      </p>
                    </react_1.Loading>)}
                </div>
              </react_1.VStack>
            </react_1.ModalCardBody>
            <react_1.ModalCardFooter>
              <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={isEditing
            ? !permissions.can("update", "parts")
            : !permissions.can("create", "parts")}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
            </react_1.ModalCardFooter>
          </form_1.ValidatedForm>
        </react_1.ModalCardContent>
      </react_1.ModalCard>
    </react_1.ModalCardProvider>);
};
exports.default = PartForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26, templateObject_27, templateObject_28, templateObject_29, templateObject_30, templateObject_31;
