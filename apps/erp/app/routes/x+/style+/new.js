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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.action = action;
exports.default = StylesNewRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var jobs_1 = require("@carbon/jobs");
var macro_1 = require("@lingui/core/macro");
var react_router_1 = require("react-router");
var items_1 = require("~/modules/items");
var template_service_1 = require("~/modules/items/template.service");
var Styles_1 = require("~/modules/items/ui/Styles");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Styles"], ["Styles"]))),
    to: path_1.path.to.items,
    module: "items"
};
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, modal, validation, _d, templateId, styleData, styleColorIds, styleSizeIds, upsertStyle, createStyle, message, _e, _f, _g, _h, _j, itemId, stagingThumbnailPath, fileName, finalThumbnailPath, move;
        var _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "parts"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _l.sent();
                    modal = formData.get("type") === "modal";
                    return [4 /*yield*/, (0, form_1.validator)(items_1.styleValidator).validate(formData)];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _d = validation.data, templateId = _d.templateId, styleData = __rest(_d, ["templateId"]);
                    styleColorIds = Array.from(formData.entries())
                        .filter(function (_a) {
                        var key = _a[0];
                        return key.startsWith("styleColorIds[");
                    })
                        .map(function (_a) {
                        var value = _a[1];
                        return value;
                    })
                        .filter(Boolean);
                    styleSizeIds = Array.from(formData.entries())
                        .filter(function (_a) {
                        var key = _a[0];
                        return key.startsWith("styleSizeIds[");
                    })
                        .map(function (_a) {
                        var value = _a[1];
                        return value;
                    })
                        .filter(Boolean);
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("~/modules/items/style.server"); })];
                case 4:
                    upsertStyle = (_l.sent()).upsertStyle;
                    return [4 /*yield*/, upsertStyle(client, __assign(__assign({}, styleData), { styleColorIds: styleColorIds, styleSizeIds: styleSizeIds, companyId: companyId, customFields: (0, form_2.setCustomFields)(formData), createdBy: userId }))];
                case 5:
                    createStyle = _l.sent();
                    if (!createStyle.error) return [3 /*break*/, 10];
                    message = "Failed to insert style: ".concat(JSON.stringify(createStyle.error));
                    if (!modal) return [3 /*break*/, 7];
                    _f = react_router_1.data;
                    _g = [createStyle];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createStyle.error, message))];
                case 6:
                    _e = _f.apply(void 0, _g.concat([_l.sent()]));
                    return [3 /*break*/, 9];
                case 7:
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.items];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(createStyle.error, message))];
                case 8:
                    _e = _h.apply(void 0, _j.concat([_l.sent()]));
                    _l.label = 9;
                case 9: return [2 /*return*/, _e];
                case 10:
                    if (!validation.data.modelUploadId) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, jobs_1.trigger)("model-thumbnail", {
                            companyId: companyId,
                            modelId: validation.data.modelUploadId
                        })];
                case 11:
                    _l.sent();
                    _l.label = 12;
                case 12:
                    itemId = (_k = createStyle.data) === null || _k === void 0 ? void 0 : _k.id;
                    if (!itemId)
                        throw new Error("Style ID not found");
                    stagingThumbnailPath = validation.data.thumbnailPath;
                    if (!(stagingThumbnailPath === null || stagingThumbnailPath === void 0 ? void 0 : stagingThumbnailPath.includes("/thumbnails/staging/"))) return [3 /*break*/, 15];
                    fileName = stagingThumbnailPath.split("/").pop();
                    finalThumbnailPath = "".concat(companyId, "/thumbnails/").concat(itemId, "/").concat(fileName);
                    return [4 /*yield*/, client.storage
                            .from("private")
                            .move(stagingThumbnailPath, finalThumbnailPath)];
                case 13:
                    move = _l.sent();
                    if (!!move.error) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("item")
                            .update({ thumbnailPath: finalThumbnailPath })
                            .eq("id", itemId)];
                case 14:
                    _l.sent();
                    _l.label = 15;
                case 15:
                    if (!templateId) return [3 /*break*/, 17];
                    return [4 /*yield*/, (0, template_service_1.applyTemplateToItem)(client, {
                            templateId: templateId,
                            itemId: itemId,
                            companyId: companyId,
                            userId: userId
                        })];
                case 16:
                    _l.sent();
                    _l.label = 17;
                case 17: return [2 /*return*/, modal
                        ? (0, react_router_1.data)(createStyle, { status: 201 })
                        : (0, react_router_1.redirect)(path_1.path.to.style(itemId))];
            }
        });
    });
}
function StylesNewRoute() {
    var initialValues = {
        id: "",
        revision: "0",
        name: "",
        description: "",
        itemTrackingType: "Inventory",
        replenishmentSystem: "Make",
        defaultMethodType: "Make to Order",
        unitOfMeasureCode: "EA",
        unitCost: 0,
        lotSize: 0,
        active: true,
        shelfLifeCalculateFromBom: false
    };
    return (<div className="max-w-4xl w-full p-2 sm:p-0 mx-auto mt-0 md:mt-8">
      <Styles_1.StyleForm initialValues={initialValues}/>
    </div>);
}
var templateObject_1;
