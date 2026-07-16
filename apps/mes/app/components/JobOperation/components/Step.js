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
exports.StepsListItem = StepsListItem;
exports.PreviewStepRecord = PreviewStepRecord;
exports.RecordModal = RecordModal;
exports.DeleteStepRecordModal = DeleteStepRecordModal;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Icons_1 = require("~/components/Icons");
var ItemThumbnail_1 = require("~/components/ItemThumbnail");
var hooks_1 = require("~/hooks");
var models_1 = require("~/services/models");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var FileDropzone_1 = require("../../FileDropzone");
function StepsListItem(_a) {
    var activeStep = _a.activeStep, step = _a.step, _b = _a.compact, compact = _b === void 0 ? false : _b, operationId = _a.operationId, className = _a.className, onRecord = _a.onRecord, onDelete = _a.onDelete;
    var fetcher = (0, react_router_1.useFetcher)();
    var user = (0, hooks_1.useUser)();
    var t = (0, macro_1.useLingui)().t;
    var name = step.name, description = step.description, type = step.type, unitOfMeasureCode = step.unitOfMeasureCode, minValue = step.minValue, maxValue = step.maxValue;
    var hasDescription = description && Object.keys(description).length > 0;
    var mentionIds = hasDescription
        ? (0, utils_1.parseMentionsFromDocument)(description)
        : [];
    var disclosure = (0, react_1.useDisclosure)({
        defaultIsOpen: !!hasDescription
    });
    if (!operationId)
        return null;
    var record = step.jobOperationStepRecord.find(function (r) { return r.index === activeStep; });
    return (<div className={(0, react_1.cn)("border-b hover:bg-muted/30 p-6", className)}>
      <div className="flex flex-1 justify-between items-center w-full gap-2">
        <react_1.HStack spacing={4} className="w-2/3">
          <react_1.HStack spacing={4} className="flex-1">
            <div className="bg-muted border rounded-full flex items-center justify-center p-2">
              <Icons_1.ProcedureStepTypeIcon type={type}/>
            </div>
            <react_1.VStack spacing={0}>
              <react_1.HStack>
                <span className="text-foreground text-sm font-medium">
                  {name}
                </span>
              </react_1.HStack>
              {type === "Measurement" && (<span className="text-xs text-muted-foreground">
                  {minValue !== null && maxValue !== null
                ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Must be between ", " and ", " ", ""], ["Must be between ", " and ", " ", ""])), minValue, maxValue, unitOfMeasureCode) : minValue !== null
                ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Must be > ", " ", ""], ["Must be > ", " ", ""])), minValue, unitOfMeasureCode) : maxValue !== null
                ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Must be < ", " ", ""], ["Must be < ", " ", ""])), maxValue, unitOfMeasureCode) : null}
                </span>)}
            </react_1.VStack>
            {!compact && (<PreviewStepRecord step={step} activeStep={activeStep}/>)}
          </react_1.HStack>
        </react_1.HStack>
        <div className="flex items-center justify-end gap-2">
          {record ? (<div className="flex items-center gap-2">
              {type !== "Task" &&
                (compact ? (<react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Update step"], ["Update step"])))} variant="secondary" size="lg" icon={<lu_1.LuCircleCheck />} isDisabled={(record === null || record === void 0 ? void 0 : record.createdBy) !== (user === null || user === void 0 ? void 0 : user.id)} onClick={function () { return onRecord(step); }} className={(0, react_1.cn)("text-emerald-500", step.minValue !== null &&
                        (record === null || record === void 0 ? void 0 : record.numericValue) != null &&
                        (record === null || record === void 0 ? void 0 : record.numericValue) < step.minValue &&
                        "text-red-500", step.maxValue !== null &&
                        (record === null || record === void 0 ? void 0 : record.numericValue) != null &&
                        (record === null || record === void 0 ? void 0 : record.numericValue) > step.maxValue &&
                        "text-red-500")}/>) : (<react_1.Button variant="secondary" size="lg" rightIcon={<lu_1.LuCircleCheck />} onClick={function () { return onRecord(step); }}>
                    <macro_1.Trans>Update</macro_1.Trans>
                  </react_1.Button>))}
              <react_1.IconButton aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Delete step"], ["Delete step"])))} variant="secondary" size="lg" icon={<lu_1.LuTrash />} isDisabled={(record === null || record === void 0 ? void 0 : record.createdBy) !== (user === null || user === void 0 ? void 0 : user.id)} onClick={function () { return onDelete(step); }}/>
            </div>) : type === "Task" ? (<fetcher.Form method="post" action={path_1.path.to.record}>
              <input type="hidden" name="index" value={activeStep}/>
              <input type="hidden" name="jobOperationStepId" value={step.id}/>

              <input type="hidden" name="booleanValue" value="true"/>
              {compact ? (<react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Record step"], ["Record step"])))} variant="secondary" size="lg" icon={<lu_1.LuCircleCheck />} type="submit" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"}/>) : (<react_1.Button type="submit" variant="secondary" size="lg" rightIcon={<lu_1.LuCircleCheck />} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"}>
                  <macro_1.Trans>Complete</macro_1.Trans>
                </react_1.Button>)}
            </fetcher.Form>) : compact ? (<react_1.IconButton aria-label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Record step"], ["Record step"])))} variant="secondary" size="lg" icon={<lu_1.LuCircleCheck />} onClick={function () { return onRecord(step); }}/>) : (<react_1.Button variant="secondary" size="lg" rightIcon={<lu_1.LuCircleCheck />} onClick={function () { return onRecord(step); }}>
              <macro_1.Trans>Record</macro_1.Trans>
            </react_1.Button>)}
          {hasDescription && (<react_1.IconButton aria-label={disclosure.isOpen ? "Hide description" : "Show description"} variant="ghost" size="lg" isDisabled={!hasDescription} icon={disclosure.isOpen ? <lu_1.LuChevronDown /> : <lu_1.LuChevronRight />} onClick={disclosure.onToggle}/>)}
        </div>
      </div>
      {disclosure.isOpen && hasDescription && (<div className="my-4 text-sm prose prose-sm dark:prose-invert" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(description)
            }}/>)}
      {mentionIds.length > 0 && <ItemsSummaryTable itemsIds={mentionIds}/>}
    </div>);
}
function ItemsSummaryTable(_a) {
    var itemsIds = _a.itemsIds;
    var allItems = (0, stores_1.useItems)()[0];
    var items = (0, react_2.useMemo)(function () {
        return itemsIds.map(function (id) { return allItems.find(function (item) { return item.id === id; }); });
    }, [itemsIds, allItems]);
    return (<react_1.Table className="border rounded-md">
      <react_1.Tbody>
        {items.map(function (item) {
            var _a, _b;
            return item && (<react_1.Tr className="bg-muted/50 hover:bg-muted/80" key={item.id}>
                <react_1.Td className="flex-shrink-0 py-3 w-[60px]">
                  <ItemThumbnail_1.default size="lg" thumbnailPath={(_a = item === null || item === void 0 ? void 0 : item.thumbnailPath) !== null && _a !== void 0 ? _a : undefined} onClick={function () {
                    if (item === null || item === void 0 ? void 0 : item.thumbnailPath) {
                        window.open((0, path_1.getPrivateUrl)(item.thumbnailPath), "_blank");
                    }
                }}/>
                </react_1.Td>
                <react_1.Td className="flex-grow">
                  <div className="flex flex-col gap-1">
                    <span className="text-base font-medium">{item.name}</span>
                    <span className="text-sm font-mono text-muted-foreground">
                      {(_b = item.readableIdWithRevision) !== null && _b !== void 0 ? _b : item.id}
                    </span>
                  </div>
                </react_1.Td>
              </react_1.Tr>);
        })}
      </react_1.Tbody>
    </react_1.Table>);
}
function PreviewStepRecord(_a) {
    var _b, _c, _d, _e, _f;
    var activeStep = _a.activeStep, step = _a.step;
    var employees = (0, stores_1.usePeople)()[0];
    var numberFormatter = (0, i18n_1.useNumberFormatter)();
    var formatDateTime = (0, hooks_1.useDateFormatter)().formatDateTime;
    if (!step.jobOperationStepRecord)
        return null;
    var record = step.jobOperationStepRecord.find(function (r) { return r.index === activeStep; });
    return (<div className="min-w-[200px] truncate text-right font-medium">
      {step.type === "Task" && (<react_1.Checkbox checked={(_b = record === null || record === void 0 ? void 0 : record.booleanValue) !== null && _b !== void 0 ? _b : false}/>)}
      {step.type === "Checkbox" && (<react_1.Checkbox checked={(_c = record === null || record === void 0 ? void 0 : record.booleanValue) !== null && _c !== void 0 ? _c : false}/>)}
      {step.type === "Value" && <p className="text-sm">{record === null || record === void 0 ? void 0 : record.value}</p>}
      {step.type === "Measurement" &&
            typeof (record === null || record === void 0 ? void 0 : record.numericValue) === "number" && (<p className={(0, react_1.cn)("text-sm", step.minValue !== null &&
                (record === null || record === void 0 ? void 0 : record.numericValue) < step.minValue &&
                "text-red-500", step.maxValue !== null &&
                (record === null || record === void 0 ? void 0 : record.numericValue) > step.maxValue &&
                "text-red-500")}>
            {numberFormatter.format(record === null || record === void 0 ? void 0 : record.numericValue)}{" "}
            {step.unitOfMeasureCode}
          </p>)}
      {step.type === "Timestamp" && (<p className="text-sm">{formatDateTime((_d = record === null || record === void 0 ? void 0 : record.value) !== null && _d !== void 0 ? _d : "")}</p>)}
      {step.type === "List" && <p className="text-sm">{record === null || record === void 0 ? void 0 : record.value}</p>}
      {step.type === "Person" && (<p className="text-sm">
          {(_e = employees.find(function (e) { return e.id === (record === null || record === void 0 ? void 0 : record.userValue); })) === null || _e === void 0 ? void 0 : _e.name}
        </p>)}
      {step.type === "File" && (record === null || record === void 0 ? void 0 : record.value) && (<div className="flex justify-end gap-2 text-sm">
          <lu_1.LuPaperclip className="size-4 text-muted-foreground"/>
        </div>)}
      {step.type === "Inspection" && (<div className="flex justify-end gap-2 items-center text-sm">
          {(record === null || record === void 0 ? void 0 : record.value) && (<lu_1.LuPaperclip className="size-4 text-muted-foreground"/>)}
          <react_1.Checkbox checked={(_f = record === null || record === void 0 ? void 0 : record.booleanValue) !== null && _f !== void 0 ? _f : false}/>
        </div>)}
    </div>);
}
function RecordModal(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g;
    var attribute = _a.attribute, activeStep = _a.activeStep, onClose = _a.onClose;
    var employees = (0, stores_1.usePeople)()[0];
    var employeeOptions = (0, react_2.useMemo)(function () {
        return employees.map(function (employee) { return ({
            label: employee.name,
            value: employee.id
        }); });
    }, [employees]);
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var _h = (0, react_2.useState)(null), file = _h[0], setFile = _h[1];
    var _j = (0, react_2.useState)(null), filePath = _j[0], setFilePath = _j[1];
    var fetcher = (0, react_router_1.useFetcher)();
    var onDrop = function (acceptedFiles) { return __awaiter(_this, void 0, void 0, function () {
        var fileUpload, fileName, upload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!acceptedFiles[0] || !carbon)
                        return [2 /*return*/];
                    fileUpload = acceptedFiles[0];
                    setFile(fileUpload);
                    react_1.toast.info(t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), fileUpload.name));
                    fileName = "".concat(company.id, "/job/").concat(attribute.operationId, "/").concat(attribute.id, "/").concat((0, nanoid_1.nanoid)(), "/").concat(fileUpload.name);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, fileUpload, {
                            cacheControl: "".concat(12 * 60 * 60),
                            upsert: true
                        }))];
                case 1:
                    upload = _b.sent();
                    if (upload.error) {
                        react_1.toast.error(t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Failed to upload file: ", ""], ["Failed to upload file: ", ""])), fileUpload.name));
                    }
                    else if ((_a = upload.data) === null || _a === void 0 ? void 0 : _a.path) {
                        react_1.toast.success(t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Uploaded: ", ""], ["Uploaded: ", ""])), fileUpload.name));
                        setFilePath(upload.data.path);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, onClose]);
    var record = attribute === null || attribute === void 0 ? void 0 : attribute.jobOperationStepRecord.find(function (r) { return r.index === activeStep; });
    var _k = (0, react_2.useState)((_c = record === null || record === void 0 ? void 0 : record.booleanValue) !== null && _c !== void 0 ? _c : false), booleanControlled = _k[0], setBooleanControlled = _k[1];
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={models_1.stepRecordValidator} action={path_1.path.to.record} onSuccess={onClose} defaultValues={{
            index: activeStep,
            jobOperationStepId: attribute.id,
            value: (_d = record === null || record === void 0 ? void 0 : record.value) !== null && _d !== void 0 ? _d : (attribute.type === "Timestamp" ? new Date().toISOString() : ""),
            numericValue: (_e = record === null || record === void 0 ? void 0 : record.numericValue) !== null && _e !== void 0 ? _e : 0,
            userValue: (_f = record === null || record === void 0 ? void 0 : record.userValue) !== null && _f !== void 0 ? _f : ""
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>
                {attribute.name} - Set {activeStep + 1}
              </macro_1.Trans>
            </react_1.ModalTitle>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="id"/>
            <form_1.Hidden name="jobOperationStepId"/>
            <form_1.Hidden name="index"/>
            {attribute.type === "Checkbox" && (<form_1.Hidden name="booleanValue" value={booleanControlled ? "true" : "false"}/>)}
            {attribute.type === "File" && (<form_1.Hidden name="value" value={filePath !== null && filePath !== void 0 ? filePath : ""}/>)}
            {attribute.type === "Inspection" && (<>
                <form_1.Hidden name="value" value={filePath !== null && filePath !== void 0 ? filePath : ""}/>
                <form_1.Hidden name="booleanValue" value={booleanControlled ? "true" : "false"}/>
              </>)}
            <react_1.VStack spacing={4}>
              {attribute.description && (<div className="flex flex-col gap-2" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(attribute.description)
            }}/>)}
              {attribute.type === "Value" && (<form_1.Input name="value" label="" size="lg"/>)}
              {attribute.type === "Measurement" && (<form_1.Number name="numericValue" label="" size="lg"/>)}
              {attribute.type === "Timestamp" && (<form_1.DateTimePicker name="value" label="" size="lg"/>)}
              {attribute.type === "Checkbox" && (<react_1.Switch checked={booleanControlled} onCheckedChange={function (checked) { return setBooleanControlled(!!checked); }}/>)}
              {attribute.type === "Person" && (<form_1.Combobox name="userValue" label="" options={employeeOptions} size="lg"/>)}
              {attribute.type === "List" && (<form_1.Select name="value" label="" size="lg" options={((_g = attribute.listValues) !== null && _g !== void 0 ? _g : []).map(function (value) { return ({
                label: value,
                value: value
            }); })}/>)}
              {attribute.type === "File" &&
            (file ? (<div className="flex flex-col gap-2 items-center justify-center py-6 w-full">
                    <lu_1.LuFile className="size-10 text-muted-foreground"/>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                    <react_1.Button variant="secondary" size="sm" onClick={function () {
                    setFile(null);
                    setFilePath(null);
                }}>
                      <macro_1.Trans>Remove</macro_1.Trans>
                    </react_1.Button>
                  </div>) : (<FileDropzone_1.default onDrop={onDrop}/>))}
              {attribute.type === "Inspection" && (<>
                  {file ? (<div className="flex flex-col gap-2 items-center justify-center py-6 w-full">
                      <lu_1.LuFile className="size-10 text-muted-foreground"/>
                      <p className="text-sm text-muted-foreground">
                        {file.name}
                      </p>
                      <react_1.Button variant="secondary" size="sm" onClick={function () {
                    setFile(null);
                    setFilePath(null);
                }}>
                        Remove
                      </react_1.Button>
                    </div>) : (<FileDropzone_1.default onDrop={onDrop}/>)}
                  <div className="flex items-center justify-between py-4 w-full">
                    <span className="text-sm font-medium">
                      <macro_1.Trans>Passed Inspection</macro_1.Trans>
                    </span>
                    <react_1.Switch checked={booleanControlled} onCheckedChange={function (checked) {
                return setBooleanControlled(!!checked);
            }}/>
                  </div>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" size="lg" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <form_1.Submit size="lg" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" ||
            (attribute.type === "File" && !filePath)} rightIcon={<lu_1.LuCircleCheck />} type="submit">
              <macro_1.Trans>Record</macro_1.Trans>
            </form_1.Submit>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
function DeleteStepRecordModal(_a) {
    var _b;
    var onClose = _a.onClose, id = _a.id, title = _a.title, description = _a.description;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, onClose]);
    return (<react_1.Modal open={true} onOpenChange={onClose}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>{title}</react_1.ModalTitle>
          <react_1.ModalDescription>{description}</react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" size="lg" onClick={onClose}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.recordDelete(id)}>
            <react_1.Button size="lg" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit" variant="destructive">
              <macro_1.Trans>Delete</macro_1.Trans>
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
