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
var renderer_1 = require("@react-pdf/renderer");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, company, action, url, idsParam, baseUrl, kanbanIds, kanbanPromises, kanbanResults, thumbnailPaths, validKanbans, _i, kanbanResults_1, result, thumbnails, thumbnailPromises, thumbnailResults, _d, thumbnailResults_1, thumbnail, labels, _e, validKanbans_1, result, kanban, labelData, stream, body, headers;
        var _this = this;
        var _f;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    _c = _g.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, settings_1.getCompany)(client, companyId)];
                case 2:
                    company = _g.sent();
                    if (company.error) {
                        console.error(company.error);
                        throw new Error("Failed to load company");
                    }
                    action = params.action;
                    if (!action)
                        throw new Error("Could not find kanban action");
                    if (!["order", "start", "complete"].includes(action)) {
                        throw new Error("Invalid kanban action");
                    }
                    url = new URL(request.url);
                    idsParam = url.searchParams.get("ids");
                    baseUrl = url.origin;
                    if (!idsParam) {
                        return [2 /*return*/, new Response("No kanban IDs provided", { status: 400 })];
                    }
                    kanbanIds = idsParam.split(",").map(function (id) { return id.trim(); });
                    if (kanbanIds.length === 0) {
                        return [2 /*return*/, new Response("No valid kanban IDs provided", { status: 400 })];
                    }
                    kanbanPromises = kanbanIds.map(function (id) {
                        return client.from("kanbans").select("*").eq("id", id).single();
                    });
                    return [4 /*yield*/, Promise.all(kanbanPromises)];
                case 3:
                    kanbanResults = _g.sent();
                    thumbnailPaths = {};
                    validKanbans = [];
                    for (_i = 0, kanbanResults_1 = kanbanResults; _i < kanbanResults_1.length; _i++) {
                        result = kanbanResults_1[_i];
                        if (!result.error && result.data) {
                            validKanbans.push(result);
                            if (result.data.thumbnailPath && result.data.id) {
                                thumbnailPaths[result.data.id] = result.data.thumbnailPath;
                            }
                        }
                    }
                    thumbnails = {};
                    if (!(Object.keys(thumbnailPaths).length > 0)) return [3 /*break*/, 5];
                    thumbnailPromises = Object.entries(thumbnailPaths).map(function (_a) { return __awaiter(_this, [_a], void 0, function (_b) {
                        var base64;
                        var id = _b[0], path = _b[1];
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0: return [4 /*yield*/, (0, shared_1.getBase64ImageFromSupabase)(client, path)];
                                case 1:
                                    base64 = _c.sent();
                                    return [2 /*return*/, { id: id, data: base64 }];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(thumbnailPromises)];
                case 4:
                    thumbnailResults = _g.sent();
                    for (_d = 0, thumbnailResults_1 = thumbnailResults; _d < thumbnailResults_1.length; _d++) {
                        thumbnail = thumbnailResults_1[_d];
                        if (thumbnail.data) {
                            thumbnails[thumbnail.id] = thumbnail.data;
                        }
                    }
                    _g.label = 5;
                case 5:
                    labels = [];
                    for (_e = 0, validKanbans_1 = validKanbans; _e < validKanbans_1.length; _e++) {
                        result = validKanbans_1[_e];
                        if (!result.error && result.data) {
                            kanban = result.data;
                            labelData = {
                                id: kanban.id,
                                itemId: kanban.itemId,
                                itemName: kanban.name || "",
                                itemReadableId: kanban.readableIdWithRevision || kanban.itemId,
                                locationName: kanban.locationName || "",
                                storageUnitId: kanban.storageUnitId,
                                storageUnitName: kanban.storageUnitName,
                                supplierName: kanban.supplierName,
                                quantity: (_f = kanban.quantity) !== null && _f !== void 0 ? _f : 0,
                                unitOfMeasureCode: kanban.purchaseUnitOfMeasureCode,
                                thumbnail: thumbnails[kanban.id] || null
                            };
                            labels.push(labelData);
                        }
                    }
                    if (labels.length === 0) {
                        return [2 /*return*/, new Response("No valid kanbans found", { status: 404 })];
                    }
                    return [4 /*yield*/, (0, renderer_1.renderToStream)(<pdf_1.KanbanLabelPDF baseUrl={baseUrl} labels={labels} action={action}/>)];
                case 6:
                    stream = _g.sent();
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
                case 7:
                    body = _g.sent();
                    headers = new Headers({
                        "Content-Type": "application/pdf",
                        "Content-Disposition": "inline; filename=\"".concat(company.data.name, " - Kanban Labels.pdf\"")
                    });
                    return [2 /*return*/, new Response(new Uint8Array(body), { status: 200, headers: headers })];
            }
        });
    });
}
