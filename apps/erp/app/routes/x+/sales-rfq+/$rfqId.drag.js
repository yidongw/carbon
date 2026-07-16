"use strict";
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
exports.action = action;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var jobs_1 = require("@carbon/jobs");
var nanoid_1 = require("nanoid");
var react_router_1 = require("react-router");
var sales_1 = require("~/modules/sales");
var form_1 = require("~/utils/form");
var path_1 = require("~/utils/path");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, rfqId, formData, payload, validation, _d, customerPartId, is3DModel, lineId, documentPath, size, salesRfqId, targetLineId, data, insertLine, _e, _f, _g, _h, fileName, newPath, modelId, fileExtension, _j, recordUpdate, recordCreate, _k, _l, _m, _o, move, _p, _q, move, _r, _s;
        var _t, _u;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "sales"
                        })];
                case 1:
                    _c = _v.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    rfqId = params.rfqId;
                    if (!rfqId) {
                        throw new Error("rfqId not found");
                    }
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _v.sent();
                    payload = (_t = formData.get("payload")) !== null && _t !== void 0 ? _t : "{}";
                    validation = sales_1.salesRfqDragValidator.safeParse(JSON.parse(payload));
                    if (!validation.success) {
                        return [2 /*return*/, {
                                error: validation.error.message
                            }];
                    }
                    _d = validation.data, customerPartId = _d.customerPartId, is3DModel = _d.is3DModel, lineId = _d.lineId, documentPath = _d.path, size = _d.size, salesRfqId = _d.salesRfqId;
                    targetLineId = lineId;
                    if (!!targetLineId) return [3 /*break*/, 7];
                    data = {
                        salesRfqId: salesRfqId,
                        customerPartId: customerPartId,
                        quantity: [1],
                        unitOfMeasureCode: "EA",
                        order: 1
                    };
                    return [4 /*yield*/, (0, sales_1.upsertSalesRFQLine)(client, __assign(__assign({}, data), { description: "", companyId: companyId, createdBy: userId, customFields: (0, form_1.setCustomFields)(formData) }))];
                case 3:
                    insertLine = _v.sent();
                    if (!insertLine.error) return [3 /*break*/, 5];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.salesRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertLine.error, "Failed to insert RFQ line"))];
                case 4: throw _e.apply(void 0, _f.concat([_v.sent()]));
                case 5:
                    targetLineId = (_u = insertLine.data) === null || _u === void 0 ? void 0 : _u.id;
                    if (!!targetLineId) return [3 /*break*/, 7];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.salesRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(insertLine, "Failed to insert RFQ line"))];
                case 6: throw _g.apply(void 0, _h.concat([_v.sent()]));
                case 7:
                    fileName = documentPath.split("/").pop();
                    newPath = "";
                    if (!is3DModel) return [3 /*break*/, 17];
                    modelId = (0, nanoid_1.nanoid)();
                    fileExtension = fileName === null || fileName === void 0 ? void 0 : fileName.split(".").pop();
                    newPath = "".concat(companyId, "/models/").concat(modelId, ".").concat(fileExtension);
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("salesRfqLine")
                                .update({ modelUploadId: modelId })
                                .eq("id", targetLineId),
                            client.from("modelUpload").insert({
                                id: modelId,
                                modelPath: newPath,
                                name: fileName,
                                size: size !== null && size !== void 0 ? size : 0,
                                companyId: companyId,
                                createdBy: userId
                            })
                        ])];
                case 8:
                    _j = _v.sent(), recordUpdate = _j[0], recordCreate = _j[1];
                    if (!recordUpdate.error) return [3 /*break*/, 10];
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.salesRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(recordUpdate.error, "Failed to update RFQ line with model"))];
                case 9: throw _k.apply(void 0, _l.concat([_v.sent()]));
                case 10:
                    if (!recordCreate.error) return [3 /*break*/, 12];
                    _m = react_router_1.redirect;
                    _o = [path_1.path.to.salesRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(recordCreate.error, "Failed to insert model record"))];
                case 11: throw _m.apply(void 0, _o.concat([_v.sent()]));
                case 12: return [4 /*yield*/, client.storage
                        .from("private")
                        .move(documentPath, newPath)];
                case 13:
                    move = _v.sent();
                    if (!move.error) return [3 /*break*/, 15];
                    _p = react_router_1.redirect;
                    _q = [path_1.path.to.salesRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(move.error, "Failed to move file"))];
                case 14: throw _p.apply(void 0, _q.concat([_v.sent()]));
                case 15: return [4 /*yield*/, (0, jobs_1.trigger)("model-thumbnail", {
                        companyId: companyId,
                        modelId: modelId
                    })];
                case 16:
                    _v.sent();
                    return [3 /*break*/, 20];
                case 17:
                    newPath = "".concat(companyId, "/opportunity-line/").concat(targetLineId, "/").concat(fileName);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .move(documentPath, newPath)];
                case 18:
                    move = _v.sent();
                    if (!move.error) return [3 /*break*/, 20];
                    _r = react_router_1.redirect;
                    _s = [path_1.path.to.salesRfqDetails(rfqId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(move.error, "Failed to move file"))];
                case 19: throw _r.apply(void 0, _s.concat([_v.sent()]));
                case 20: return [2 /*return*/, { success: true }];
            }
        });
    });
}
