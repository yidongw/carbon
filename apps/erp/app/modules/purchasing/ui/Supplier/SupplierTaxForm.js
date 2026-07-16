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
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var sales_models_1 = require("~/modules/sales/sales.models");
var upload_1 = require("~/utils/upload");
var purchasing_models_1 = require("../../purchasing.models");
var SupplierTaxForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var taxExemptionReasonOptions = sales_models_1.taxExemptionReasons.map(function (reason) { return ({
        label: <Enumerable_1.Enumerable value={reason}/>,
        value: reason
    }); });
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var companyId = company.id;
    var _d = (0, react_2.useState)((_b = initialValues.taxExemptionCertificatePath) !== null && _b !== void 0 ? _b : ""), certificatePath = _d[0], setCertificatePath = _d[1];
    var _e = (0, react_2.useState)((_c = initialValues.taxExempt) !== null && _c !== void 0 ? _c : false), taxExempt = _e[0], setTaxExempt = _e[1];
    var isDisabled = !permissions.can("update", "purchasing");
    var onDrop = (0, react_2.useCallback)(function (acceptedFiles) { return __awaiter(void 0, void 0, void 0, function () {
        var file, fileExtension, fileName, uploadToast, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = acceptedFiles[0];
                    if (!file || !carbon)
                        return [2 /*return*/];
                    fileExtension = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/tax-certificates/").concat((0, nanoid_1.nanoid)(), ".").concat(fileExtension);
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "supplier-tax-".concat(fileName, "-").concat(file.name),
                        label: function (pct) { return "Uploading ".concat(file.name, " (").concat(pct, "%)"); }
                    });
                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                            bucket: "private",
                            path: fileName,
                            file: file,
                            onProgress: uploadToast.onProgress
                        })];
                case 1:
                    result = _a.sent();
                    if (result.error) {
                        uploadToast.error("Failed to upload certificate");
                    }
                    else {
                        uploadToast.dismiss();
                        setCertificatePath(result.data.path);
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, companyId]);
    return (<form_1.ValidatedForm method="post" validator={purchasing_models_1.supplierTaxValidator} defaultValues={initialValues}>
      <react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>Tax Information</react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <Form_1.Hidden name="supplierId"/>
          <input type="hidden" name="taxExemptionCertificatePath" value={certificatePath}/>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-4 w-full">
            <Form_1.Input name="taxId" label="Tax ID"/>
            <Form_1.Input name="vatNumber" label="VAT Number"/>
            {(0, utils_1.isEoriCountry)(company.countryCode) ? (<Form_1.Input name="eori" label="EORI"/>) : (<div />)}

            <div className="col-span-3">
              <Form_1.Boolean name="taxExempt" label="Tax Exempt" bordered onChange={setTaxExempt}/>
            </div>
            {taxExempt && (<>
                <Form_1.Select name="taxExemptionReason" label="Exemption Reason" options={taxExemptionReasonOptions} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select Reason"], ["Select Reason"])))}/>
                <Form_1.Input name="taxExemptionCertificateNumber" label="Certificate Number"/>
              </>)}
          </div>
          {taxExempt && (<div className="mt-4 flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Exemption Certificate
                </label>
                {certificatePath && (<react_1.Button variant="secondary" size="sm" leftIcon={<lu_1.LuPaperclip />} asChild>
                    <a href={"/file/preview/private/".concat(certificatePath)} target="_blank" rel="noopener noreferrer">
                      View Certificate
                    </a>
                  </react_1.Button>)}
              </div>
              <components_1.FileDropzone onDrop={onDrop} accept={{
                "application/pdf": [".pdf"],
                "image/*": [".png", ".jpg", ".jpeg"]
            }} multiple={false}/>
            </div>)}
        </react_1.CardContent>
        <react_1.CardFooter>
          <react_1.HStack>
            <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
          </react_1.HStack>
        </react_1.CardFooter>
      </react_1.Card>
    </form_1.ValidatedForm>);
};
exports.default = SupplierTaxForm;
var templateObject_1;
