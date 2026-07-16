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
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var SupplierInteractionLineNotes = function (_a) {
    var id = _a.id, table = _a.table, title = _a.title, subTitle = _a.subTitle, isReadOnly = _a.isReadOnly, initialInternalNotes = _a.internalNotes, initialExternalNotes = _a.externalNotes;
    var _b = (0, hooks_1.useUser)(), userId = _b.id, companyId = _b.company.id;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isEmployee = permissions.is("employee");
    var _c = (0, react_2.useState)(isEmployee ? "internal" : "external"), tab = _c[0], setTab = _c[1];
    var _d = (0, react_2.useState)(initialInternalNotes !== null && initialInternalNotes !== void 0 ? initialInternalNotes : {}), internalNotes = _d[0], setInternalNotes = _d[1];
    var _e = (0, react_2.useState)(initialExternalNotes !== null && initialExternalNotes !== void 0 ? initialExternalNotes : {}), externalNotes = _e[0], setExternalNotes = _e[1];
    var onUploadImage = function (file) { return __awaiter(void 0, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/supplier-interaction/").concat(id, "/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
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
    var onUpdateExternalNotes = (0, react_1.useDebounce)(function (content) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from(table).update({
                        externalNotes: content,
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    }).eq("id", id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 2500, true);
    var onUpdateInternalNotes = (0, react_1.useDebounce)(function (content) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from(table).update({
                        internalNotes: content,
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
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
    return (<>
      <react_1.Card>
        <react_1.Tabs value={tab} onValueChange={setTab}>
          <react_1.HStack className="w-full justify-between">
            <react_1.CardHeader>
              <react_1.CardTitle>{title}</react_1.CardTitle>
              <react_1.CardDescription>
                {subTitle ? "".concat(subTitle, " - ") : ""}
                {tab === "internal" ? "Internal Notes" : "External Notes"}
              </react_1.CardDescription>
            </react_1.CardHeader>
            <react_1.CardAction>
              {[
            "purchasingRfqLine",
            "supplierQuoteLine",
            "purchaseOrderLine"
        ].includes(table) &&
            isEmployee && (<react_1.TabsList>
                    <react_1.TabsTrigger value="internal">
                      <macro_1.Trans>Internal</macro_1.Trans>
                    </react_1.TabsTrigger>
                    <react_1.TabsTrigger value="external">
                      <macro_1.Trans>External</macro_1.Trans>
                    </react_1.TabsTrigger>
                  </react_1.TabsList>)}
            </react_1.CardAction>
          </react_1.HStack>
          <react_1.CardContent>
            <react_1.TabsContent value="internal">
              {!isReadOnly && permissions.can("update", "purchasing") ? (<Editor_1.Editor initialValue={(internalNotes !== null && internalNotes !== void 0 ? internalNotes : {})} onUpload={onUploadImage} onChange={function (value) {
                setInternalNotes(value);
                onUpdateInternalNotes(value);
            }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(internalNotes)
            }}/>)}
            </react_1.TabsContent>
            {[
            "purchasingRfqLine",
            "supplierQuoteLine",
            "purchaseOrderLine"
        ].includes(table) && (<react_1.TabsContent value="external">
                {!isReadOnly && permissions.can("update", "purchasing") ? (<Editor_1.Editor initialValue={(externalNotes !== null && externalNotes !== void 0 ? externalNotes : {})} onUpload={onUploadImage} onChange={function (value) {
                    setExternalNotes(value);
                    onUpdateExternalNotes(value);
                }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                    __html: (0, react_1.generateHTML)(externalNotes)
                }}/>)}
              </react_1.TabsContent>)}
          </react_1.CardContent>
        </react_1.Tabs>
      </react_1.Card>
    </>);
};
exports.default = SupplierInteractionLineNotes;
var templateObject_1;
