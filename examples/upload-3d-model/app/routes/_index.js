"use strict";
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
exports.action = action;
exports.default = Route;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var ModelUpload_1 = require("~/components/ModelUpload");
var carbon_server_1 = require("~/lib/carbon.server");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var formData, file, upload;
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, request.formData()];
                case 1:
                    formData = _c.sent();
                    file = formData.get("file");
                    if (!file || !(file instanceof File)) {
                        console.warn("No valid file provided in request");
                        return [2 /*return*/, (0, react_router_1.data)({ error: "No file provided", data: null }, { status: 400 })];
                    }
                    return [4 /*yield*/, carbon_server_1.carbon.uploadModel(file)];
                case 2:
                    upload = _c.sent();
                    if (upload.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: upload.error.message, data: null }, { status: 500 })];
                    }
                    return [2 /*return*/, upload];
            }
        });
    });
}
function Route() {
    var _this = this;
    var _a = (0, react_2.useState)(null), file = _a[0], setFile = _a[1];
    var _b = (0, react_2.useState)(null), url = _b[0], setUrl = _b[1];
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error);
            setFile(null);
            setUrl(null);
        }
        if ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.data) {
            setFile(null);
            setUrl(fetcher.data.data.url);
            react_1.toast.success("Model uploaded successfully");
        }
    }, [fetcher.data]);
    var onFileChange = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var formData;
        return __generator(this, function (_a) {
            setFile(file);
            if (!file)
                return [2 /*return*/];
            formData = new FormData();
            formData.append("file", file);
            fetcher.submit(formData, {
                method: "post",
                encType: "multipart/form-data"
            });
            return [2 /*return*/];
        });
    }); };
    return (<react_1.TooltipProvider>
      <div className="flex h-screen w-screen flex-col items-center justify-center p-4">
        <div className="max-w-xl text-center flex flex-col gap-8">
          <react_1.Heading size="h1">Upload a Public 3D Model</react_1.Heading>
          {url && (<react_1.InputGroup>
              <react_1.Input value={url}/>
              <react_1.InputLeftAddon className="border-none">
                <react_1.Copy text={url}/>
              </react_1.InputLeftAddon>
            </react_1.InputGroup>)}
          <ModelUpload_1.ModelUpload file={file} onFileChange={onFileChange}/>
        </div>
      </div>
    </react_1.TooltipProvider>);
}
