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
var openai_1 = require("@ai-sdk/openai");
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var utils_1 = require("@carbon/utils");
var ai_1 = require("ai");
var nanoid_1 = require("nanoid");
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var items_1 = require("~/modules/items");
var sales_1 = require("~/modules/sales");
var path_1 = require("~/utils/path");
var quoteDragValidator = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    size: zod_1.z.number(),
    path: zod_1.z.string(),
    lineId: zod_1.z.string().optional()
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, quoteId, formData, payload, validation, _d, fileName, documentPath, size, lineId, serviceRole, quote, _e, _f, targetLineId, partId, partName, readableId, revision, parsedFilename, error_1, suffix, existingItem, partData, part, _g, _h, quoteLineData, createQuotationLine, _j, _k, upsertMethod, _l, _m, existingLine, _o, _p, extension, is3DModel, newPath, modelId, fileExtension, modelRecord, updates, lineUpdate, move, _q, _r, move, _s, _t;
        var _u, _v;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 1:
                    _c = _w.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    quoteId = params.quoteId;
                    if (!quoteId)
                        throw new Error("Could not find quoteId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _w.sent();
                    payload = formData.get("payload");
                    if (!payload || typeof payload !== "string") {
                        throw new Error("Invalid payload");
                    }
                    validation = quoteDragValidator.safeParse(JSON.parse(payload));
                    if (!validation.success) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: validation.error.flatten() }, { status: 400 })];
                    }
                    _d = validation.data, fileName = _d.name, documentPath = _d.path, size = _d.size, lineId = _d.lineId;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, sales_1.getQuote)(serviceRole, quoteId)];
                case 3:
                    quote = _w.sent();
                    if (!(quote.error || !quote.data)) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(quote.error, "Failed to get quote details"))];
                case 4: throw _e.apply(void 0, _f.concat([_w.sent()]));
                case 5:
                    targetLineId = lineId;
                    partName = fileName.replace(/\.[^/.]+$/, "");
                    if (!!targetLineId) return [3 /*break*/, 22];
                    readableId = partName;
                    revision = "0";
                    _w.label = 6;
                case 6:
                    _w.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, (0, ai_1.generateObject)({
                            // @ts-ignore
                            model: (0, openai_1.openai)("gpt-4o-mini"),
                            schema: zod_1.z.object({
                                partId: zod_1.z
                                    .string()
                                    .describe("The part identifier extracted from the filename"),
                                revision: zod_1.z
                                    .string()
                                    .nullable()
                                    .describe("The revision number if present, null if not found")
                            }),
                            prompt: "Extract the part ID and revision from this filename: \"".concat(partName, "\". The part ID should be the main identifier, and revision should be any version/revision indicator if present.")
                        })];
                case 7:
                    parsedFilename = (_w.sent()).object;
                    readableId = parsedFilename.partId;
                    revision = parsedFilename.revision || "0";
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _w.sent();
                    console.error(error_1);
                    return [3 /*break*/, 9];
                case 9:
                    suffix = 1;
                    _w.label = 10;
                case 10:
                    if (!true) return [3 /*break*/, 12];
                    return [4 /*yield*/, serviceRole
                            .from("item")
                            .select("id")
                            .eq("readableId", readableId)
                            .eq("revision", revision)
                            .eq("companyId", companyId)
                            .single()];
                case 11:
                    existingItem = _w.sent();
                    if (existingItem.error || !existingItem.data) {
                        // readableId is unique, we can use it
                        return [3 /*break*/, 12];
                    }
                    // If not unique, append or increment suffix
                    revision = "".concat(revision, " (").concat(suffix, ")");
                    suffix++;
                    return [3 /*break*/, 10];
                case 12:
                    partData = {
                        id: readableId,
                        name: readableId,
                        defaultMethodType: "Make to Order",
                        itemTrackingType: "Inventory",
                        replenishmentSystem: "Make",
                        revision: revision,
                        unitOfMeasureCode: "EA",
                        shelfLifeCalculateFromBom: false,
                        companyId: companyId,
                        createdBy: userId
                    };
                    return [4 /*yield*/, (0, items_1.upsertPart)(serviceRole, partData)];
                case 13:
                    part = _w.sent();
                    if (!(part.error || !((_u = part.data) === null || _u === void 0 ? void 0 : _u.id))) return [3 /*break*/, 15];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(part.error, "Failed to create part"))];
                case 14: throw _g.apply(void 0, _h.concat([_w.sent()]));
                case 15:
                    partId = (_v = part.data) === null || _v === void 0 ? void 0 : _v.id;
                    quoteLineData = {
                        quoteId: quoteId,
                        itemId: partId !== null && partId !== void 0 ? partId : "",
                        status: "Not Started",
                        estimatorId: userId,
                        description: partName,
                        methodType: "Make to Order",
                        customerPartId: partName,
                        customerPartRevision: "",
                        unitOfMeasureCode: "EA",
                        taxPercent: 0,
                        quantity: [1],
                        companyId: companyId,
                        createdBy: userId
                    };
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLine)(serviceRole, quoteLineData)];
                case 16:
                    createQuotationLine = _w.sent();
                    if (!(createQuotationLine.error || !createQuotationLine.data)) return [3 /*break*/, 18];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createQuotationLine.error, "Failed to create quote line."))];
                case 17: throw _j.apply(void 0, _k.concat([_w.sent()]));
                case 18:
                    targetLineId = createQuotationLine.data.id;
                    return [4 /*yield*/, (0, sales_1.upsertQuoteLineMethod)(serviceRole, {
                            quoteId: quoteId,
                            quoteLineId: targetLineId,
                            itemId: partId !== null && partId !== void 0 ? partId : "",
                            configuration: undefined,
                            companyId: companyId,
                            userId: userId
                        })];
                case 19:
                    upsertMethod = _w.sent();
                    if (!upsertMethod.error) return [3 /*break*/, 21];
                    _l = react_router_1.redirect;
                    _m = [path_1.path.to.quoteLine(quoteId, targetLineId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(upsertMethod.error, "Failed to create quote line method."))];
                case 20: throw _l.apply(void 0, _m.concat([_w.sent()]));
                case 21: return [3 /*break*/, 26];
                case 22: return [4 /*yield*/, serviceRole
                        .from("quoteLine")
                        .select("itemId")
                        .eq("id", targetLineId)
                        .eq("companyId", companyId)
                        .single()];
                case 23:
                    existingLine = _w.sent();
                    if (!(existingLine.error || !existingLine.data)) return [3 /*break*/, 25];
                    _o = react_router_1.redirect;
                    _p = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(existingLine.error, "Failed to find quote line"))];
                case 24: throw _o.apply(void 0, _p.concat([_w.sent()]));
                case 25:
                    partId = existingLine.data.itemId;
                    _w.label = 26;
                case 26:
                    extension = fileName.split(".").pop();
                    is3DModel = extension && utils_1.supportedModelTypes.includes(extension);
                    newPath = "";
                    if (!is3DModel) return [3 /*break*/, 33];
                    modelId = (0, nanoid_1.nanoid)();
                    fileExtension = fileName.split(".").pop();
                    newPath = "".concat(companyId, "/models/").concat(modelId, ".").concat(fileExtension);
                    return [4 /*yield*/, client.from("modelUpload").insert({
                            id: modelId,
                            modelPath: newPath,
                            name: fileName,
                            size: size !== null && size !== void 0 ? size : 0,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 27:
                    modelRecord = _w.sent();
                    if (modelRecord.error) {
                        console.error("Failed to create model record for ".concat(fileName, ":"), modelRecord.error);
                        return [2 /*return*/, false];
                    }
                    updates = [
                        client
                            .from("quoteLine")
                            .update({ modelUploadId: modelId })
                            .eq("id", targetLineId)
                    ];
                    if (partId && modelId) {
                        updates.push(
                        // @ts-ignore
                        client
                            .from("item")
                            .update({ modelUploadId: modelId })
                            .eq("id", partId));
                    }
                    return [4 /*yield*/, Promise.all(updates)];
                case 28:
                    lineUpdate = (_w.sent())[0];
                    if (lineUpdate.error) {
                        console.error("Failed to link model to sales order line:", lineUpdate.error);
                    }
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .move(documentPath, newPath)];
                case 29:
                    move = _w.sent();
                    if (!move.error) return [3 /*break*/, 31];
                    _q = react_router_1.redirect;
                    _r = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(move.error, "Failed to move file"))];
                case 30: throw _q.apply(void 0, _r.concat([_w.sent()]));
                case 31: return [4 /*yield*/, (0, jobs_1.trigger)("model-thumbnail", {
                        companyId: companyId,
                        modelId: modelId
                    })];
                case 32:
                    _w.sent();
                    return [3 /*break*/, 36];
                case 33:
                    newPath = "".concat(companyId, "/opportunity-line/").concat(targetLineId, "/").concat(fileName);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .move(documentPath, newPath)];
                case 34:
                    move = _w.sent();
                    if (!move.error) return [3 /*break*/, 36];
                    _s = react_router_1.redirect;
                    _t = [path_1.path.to.quote(quoteId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(move.error, "Failed to move file"))];
                case 35: throw _s.apply(void 0, _t.concat([_w.sent()]));
                case 36: return [2 /*return*/, { success: true, quoteLineId: targetLineId }];
            }
        });
    });
}
