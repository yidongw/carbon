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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var quality_models_1 = require("~/modules/quality/quality.models");
var path_1 = require("~/utils/path");
var RiskRating_1 = require("./RiskRating");
var RiskStatus_1 = require("./RiskStatus");
var RiskRegisterForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, _d = _a.open, open = _d === void 0 ? true : _d, _e = _a.type, type = _e === void 0 ? "drawer" : _e, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var companyId = (0, hooks_1.useUser)().company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var fetcher = (0, react_router_1.useFetcher)();
    var _f = (0, react_2.useState)(initialValues.type || "Risk"), selectedType = _f[0], setSelectedType = _f[1];
    var _g = (0, react_2.useState)(function () {
        if (!(initialValues === null || initialValues === void 0 ? void 0 : initialValues.notes))
            return {};
        if (typeof initialValues.notes === "object")
            return initialValues.notes;
        try {
            return JSON.parse(initialValues.notes);
        }
        catch (_a) {
            return {};
        }
    }), notes = _g[0], setNotes = _g[1];
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/quality/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    var isEditing = !!initialValues.id;
    var isDisabled = isEditing
        ? !permissions.can("update", "quality")
        : !permissions.can("create", "quality");
    // Set default values for severity and likelihood
    var formInitialValues = __assign(__assign({}, initialValues), { severity: (_b = initialValues.severity) !== null && _b !== void 0 ? _b : 1, likelihood: (_c = initialValues.likelihood) !== null && _c !== void 0 ? _c : 1 });
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (isOpen) {
            // Prevent closing while submitting to avoid cancelling the request
            if (!isOpen && fetcher.state === "idle") {
                onClose === null || onClose === void 0 ? void 0 : onClose();
            }
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={quality_models_1.riskRegisterValidator} method="post" action={isEditing ? path_1.path.to.risk(initialValues.id) : path_1.path.to.newRisk} defaultValues={formInitialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit"], ["Edit"]))) : t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["New"], ["New"])))} {selectedType}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="source"/>
              <Form_1.Hidden name="sourceId"/>
              <Form_1.Hidden name="itemId"/>
              <Form_1.Hidden name="notes" value={JSON.stringify(notes)}/>

              <react_1.VStack spacing={4}>
                <Form_1.Input name="title" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Title"], ["Title"])))}/>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                  <Form_1.SelectControlled name="type" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Type"], ["Type"])))} value={selectedType} onChange={function (value) { var _a; 
        // @ts-expect-error TS2345 - TODO: fix type
        return setSelectedType((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : "Risk"); }} options={quality_models_1.riskRegisterType.map(function (t) { return ({
            value: t,
            label: t
        }); })}/>

                  <Form_1.Select name="status" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Status"], ["Status"])))} options={quality_models_1.riskStatus.map(function (s) { return ({
            value: s,
            label: <RiskStatus_1.default status={s}/>
        }); })}/>
                </div>
                <Form_1.TextArea name="description" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Description"], ["Description"])))}/>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
                  <Form_1.Select name="severity" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Severity"], ["Severity"])))} options={Array.from({ length: 5 }, function (_, index) { return ({
            value: (index + 1).toString(),
            label: <RiskRating_1.RiskRating rating={index + 1}/>
        }); })}/>
                  <Form_1.Select name="likelihood" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Likelihood"], ["Likelihood"])))} options={Array.from({ length: 5 }, function (_, index) { return ({
            value: (index + 1).toString(),
            label: <RiskRating_1.RiskRating rating={index + 1}/>
        }); })}/>
                </div>

                <Form_1.Employee name="assignee" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Assignee"], ["Assignee"])))}/>

                <div className="flex flex-col gap-2 w-full">
                  <react_1.Label>
                    <macro_1.Trans>Notes</macro_1.Trans>
                  </react_1.Label>
                  <Editor_1.Editor initialValue={notes} onUpload={onUploadImage} onChange={function (value) {
            setNotes(value);
        }} className="[&_.is-empty]:text-muted-foreground min-h-[120px] py-3 px-4 border rounded-md w-full"/>
                </div>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={function () { return onClose === null || onClose === void 0 ? void 0 : onClose(); }} isDisabled={fetcher.state !== "idle"}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = RiskRegisterForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10;
