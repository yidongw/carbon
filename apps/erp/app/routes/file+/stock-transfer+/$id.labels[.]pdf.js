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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var pdf_1 = require("@carbon/documents/pdf");
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var settings_1 = require("~/modules/settings");
var labelLogo_server_1 = require("~/modules/settings/labelLogo.server");
var settings_service_1 = require("~/modules/settings/settings.service");
var labels_server_1 = require("./labels.server");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, url, labelParam, lineIdParam, companySettings, labelSizeId, labelSize, items, template, company, logo, stream, body;
        var _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    url = new URL(request.url);
                    labelParam = url.searchParams.get("labelSize");
                    lineIdParam = url.searchParams.get("lineId");
                    return [4 /*yield*/, (0, settings_service_1.getCompanySettings)(client, companyId)];
                case 2:
                    companySettings = _e.sent();
                    labelSizeId = labelParam || ((_d = companySettings.data) === null || _d === void 0 ? void 0 : _d.productLabelSize) || "avery5163";
                    labelSize = utils_1.labelSizes.find(function (size) { return size.id === labelSizeId; });
                    if (!labelSize) {
                        throw new Error("Invalid label size");
                    }
                    return [4 /*yield*/, (0, labels_server_1.getStockTransferLabelItems)(client, companyId, id, lineIdParam !== null && lineIdParam !== void 0 ? lineIdParam : undefined)];
                case 3:
                    items = _e.sent();
                    if (items.length === 0) {
                        return [2 /*return*/, new Response("No tracked items found for stock transfer ".concat(id).concat(lineIdParam ? " and line ".concat(lineIdParam) : ""), { status: 404 })];
                    }
                    return [4 /*yield*/, (0, settings_1.getDocumentTemplateConfig)(client, companyId, "trackingLabel")];
                case 4:
                    template = _e.sent();
                    return [4 /*yield*/, (0, settings_1.getCompany)(client, companyId)];
                case 5:
                    company = _e.sent();
                    return [4 /*yield*/, (0, labelLogo_server_1.resolveLabelLogo)(company.data, template, labelSize)];
                case 6:
                    logo = _e.sent();
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.ProductLabelPDF items={items} labelSize={labelSize} template={template} company={company.data} logo={logo}/>)];
                case 7:
                    stream = _e.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var buffers = [];
                            stream.on("data", function (data) {
                                buffers.push(data);
                            });
                            stream.on("end", function () {
                                resolve(Buffer.concat(buffers));
                            });
                            stream.on("error", reject);
                        })];
                case 8:
                    body = _e.sent();
                    return [2 /*return*/, new Response(new Uint8Array(body), {
                            status: 200,
                            headers: {
                                "Content-Type": "application/pdf",
                                "Content-Disposition": "inline; filename=\"Stock Transfer Labels.pdf\""
                            }
                        })];
            }
        });
    });
}
