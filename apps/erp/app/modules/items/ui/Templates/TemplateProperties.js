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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var zod_1 = require("zod");
var hooks_1 = require("~/hooks");
var TemplateProperties = function (_a) {
    var _b, _c;
    var template = _a.template;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _d = (0, hooks_1.useUser)(), userId = _d.id, company = _d.company;
    var _e = (0, react_2.useState)(template.name), name = _e[0], setName = _e[1];
    var _f = (0, react_2.useState)((_b = template.description) !== null && _b !== void 0 ? _b : ""), description = _f[0], setDescription = _f[1];
    var _g = (0, react_2.useState)(false), isEditingName = _g[0], setIsEditingName = _g[1];
    var _h = (0, react_2.useState)(false), isEditingDescription = _h[0], setIsEditingDescription = _h[1];
    (0, react_2.useEffect)(function () {
        var _a;
        setName(template.name);
        setDescription((_a = template.description) !== null && _a !== void 0 ? _a : "");
        setIsEditingName(false);
        setIsEditingDescription(false);
    }, [template.name, template.description]);
    var onSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, maybeError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("template")
                            .update({
                            name: name,
                            description: description.trim() ? description : null,
                            updatedBy: userId,
                            updatedAt: new Date().toISOString()
                        })
                            .eq("id", template.id)
                            .eq("companyId", company.id)];
                case 1:
                    result = _a.sent();
                    maybeError = result === null || result === void 0 ? void 0 : result.error;
                    if (maybeError) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to update template"], ["Failed to update template"]))));
                        return [2 /*return*/];
                    }
                    setIsEditingName(false);
                    setIsEditingDescription(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var onSubmit = function (_data, event) {
        event.preventDefault();
        void onSave();
    };
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Properties</macro_1.Trans>
        </react_1.CardTitle>
      </react_1.CardHeader>
      <react_1.CardContent>
        <form_1.ValidatedForm validator={zod_1.z.object({
            name: zod_1.z.string().min(1),
            description: zod_1.z.string().optional()
        })} defaultValues={{
            name: template.name,
            description: (_c = template.description) !== null && _c !== void 0 ? _c : ""
        }} className="w-full" onSubmit={onSubmit}>
          <react_1.VStack spacing={3} className="pt-2">
            <react_1.VStack spacing={1} className="w-full items-stretch">
              <react_1.HStack className="w-full justify-between items-center">
                <h4 className="text-sm font-medium">{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Name"], ["Name"])))}</h4>
                <react_1.Button type="button" size="sm" variant="secondary" onClick={function () { return setIsEditingName(function (prev) { return !prev; }); }}>
                  {isEditingName ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Done"], ["Done"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Edit"], ["Edit"])))}
                </react_1.Button>
              </react_1.HStack>
              {isEditingName ? (<form_1.InputControlled label="" name="name" size="sm" value={name} onChange={function (value) { return setName(value); }}/>) : (<div className="min-h-[40px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground">
                  {name}
                </div>)}
            </react_1.VStack>
            <react_1.VStack spacing={1} className="w-full items-stretch">
              <react_1.HStack className="w-full justify-between items-center">
                <h4 className="text-sm font-medium">{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Description"], ["Description"])))}</h4>
                <react_1.Button type="button" size="sm" variant="secondary" onClick={function () { return setIsEditingDescription(function (prev) { return !prev; }); }}>
                  {isEditingDescription ? t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Done"], ["Done"]))) : t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Edit"], ["Edit"])))}
                </react_1.Button>
              </react_1.HStack>
              {isEditingDescription ? (<form_1.TextAreaControlled label="" name="description" value={description} onChange={function (value) { return setDescription(value); }} className="text-muted-foreground"/>) : (<div className="min-h-[72px] rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap">
                  {description.trim() ? description : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["No description"], ["No description"])))}
                </div>)}
            </react_1.VStack>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = TemplateProperties;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
