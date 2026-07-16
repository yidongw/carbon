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
var react_router_1 = require("react-router");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var upload_1 = require("~/utils/upload");
var MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
var Feedback = function () {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var location = (0, react_router_1.useLocation)();
    var popoverTriggerRef = (0, react_2.useRef)(null);
    var _b = (0, react_2.useState)(""), feedback = _b[0], setFeedback = _b[1];
    var _c = (0, react_2.useState)(null), attachment = _c[0], setAttachment = _c[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            react_1.toast.success(fetcher.data.message);
            (_b = popoverTriggerRef.current) === null || _b === void 0 ? void 0 : _b.click();
        }
        else if ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.message) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [fetcher.data]);
    var uploadImage = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var file_1, fileExtension, feedbackPath, uploadToast, imageUpload;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(e.target.files && carbon)) return [3 /*break*/, 2];
                    file_1 = e.target.files[0];
                    fileExtension = file_1.name.substring(file_1.name.lastIndexOf(".") + 1);
                    if (file_1.size > MAX_FILE_SIZE) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["File size exceeds 10MB limit"], ["File size exceeds 10MB limit"]))));
                        return [2 /*return*/];
                    }
                    feedbackPath = "".concat((0, nanoid_1.nanoid)(), ".").concat(fileExtension);
                    uploadToast = (0, upload_1.createUploadToast)({
                        id: "feedback-".concat(feedbackPath, "-").concat(file_1.name),
                        label: function (pct) { return "".concat(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Uploading ", ""], ["Uploading ", ""])), file_1.name), " (").concat(pct, "%)"); }
                    });
                    return [4 /*yield*/, (0, upload_1.uploadToStorageWithProgress)(carbon, {
                            bucket: "feedback",
                            path: feedbackPath,
                            file: file_1,
                            upsert: true,
                            cacheControl: "".concat(12 * 60 * 60),
                            onProgress: uploadToast.onProgress
                        })];
                case 1:
                    imageUpload = _b.sent();
                    if (imageUpload.error) {
                        console.error(imageUpload.error);
                        uploadToast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to upload image"], ["Failed to upload image"]))));
                        return [2 /*return*/];
                    }
                    uploadToast.dismiss();
                    if ((_a = imageUpload.data) === null || _a === void 0 ? void 0 : _a.path) {
                        setAttachment({
                            name: file_1.name,
                            path: imageUpload.data.path
                        });
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return (<react_1.Popover>
      <react_1.PopoverTrigger ref={popoverTriggerRef} asChild>
        <react_1.Button variant="secondary">
          <macro_1.Trans>Feedback</macro_1.Trans>
        </react_1.Button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="end" className="w-[380px] ">
        <form_1.ValidatedForm method="post" action={path_1.path.to.feedback} validator={shared_1.feedbackValidator} fetcher={fetcher} onSubmit={function () {
            setFeedback("");
            setAttachment(null);
        }}>
          <form_1.Hidden name="location" value={location.pathname}/>
          <form_1.Hidden name="attachmentPath" value={(_a = attachment === null || attachment === void 0 ? void 0 : attachment.path) !== null && _a !== void 0 ? _a : ""}/>
          <react_1.VStack spacing={4}>
            <react_1.VStack spacing={2}>
              <form_1.TextAreaControlled name="feedback" label="" value={feedback} onChange={function (value) { return setFeedback(value); }} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Ideas, suggestions or problems with this page?"], ["Ideas, suggestions or problems with this page?"])))}/>
              {attachment && (<react_1.Badge className="-mt-2 truncate" variant="secondary">
                  {attachment.name}
                  <react_1.BadgeCloseButton type="button" onClick={function (e) {
                setAttachment(null);
            }}/>
                </react_1.Badge>)}
            </react_1.VStack>
            <react_1.HStack className="w-full justify-between">
              <react_1.Button variant="secondary" onClick={function () {
            var _a;
            setFeedback("");
            setAttachment(null);
            (_a = popoverTriggerRef.current) === null || _a === void 0 ? void 0 : _a.click();
        }}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.HStack spacing={1}>
                <react_1.Button isDisabled={feedback.length === 0} variant="secondary" onClick={function () { return setFeedback(""); }}>
                  <macro_1.Trans>Clear</macro_1.Trans>
                </react_1.Button>
                <react_1.File accept="image/*" aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Attach File"], ["Attach File"])))} className="px-2" isDisabled={!!attachment} variant="secondary" onChange={uploadImage}>
                  <lu_1.LuImage />
                </react_1.File>
                <form_1.Submit isDisabled={feedback.length < 3}>Send</form_1.Submit>
              </react_1.HStack>
            </react_1.HStack>
            <p className="text-sm">
              Have a technical issue? Contact{" "}
              <a className="text-primary" href={"mailto:".concat(utils_1.SUPPORT_EMAIL)}>
                Carbon Support.
              </a>
            </p>
          </react_1.VStack>
        </form_1.ValidatedForm>
      </react_1.PopoverContent>
    </react_1.Popover>);
};
exports.default = Feedback;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
