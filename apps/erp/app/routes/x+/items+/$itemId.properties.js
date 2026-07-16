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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var items_1 = require("~/modules/items");
var resources_1 = require("~/modules/resources");
var shared_1 = require("~/modules/shared");
var typeConfig = {
    Part: { tagTable: "part", getSummary: items_1.getPart },
    Material: { tagTable: "material", getSummary: items_1.getMaterial },
    Tool: { tagTable: "tool", getSummary: items_1.getTool },
    Consumable: { tagTable: "consumable", getSummary: items_1.getConsumable }
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, url, typeParam, supportedItemTypes, type, _d, tagTable, getSummary, needsMakeMethods, _e, summary, supplierParts, pickMethods, tags, makeMethods, files, locations, common;
        var _f, _g, _h, _j, _k, _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        bypassRls: true
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    url = new URL(request.url);
                    typeParam = url.searchParams.get("type");
                    supportedItemTypes = [
                        "Part",
                        "Material",
                        "Tool",
                        "Consumable"
                    ];
                    type = supportedItemTypes.includes(typeParam !== null && typeParam !== void 0 ? typeParam : "")
                        ? typeParam
                        : "Part";
                    _d = typeConfig[type], tagTable = _d.tagTable, getSummary = _d.getSummary;
                    needsMakeMethods = type === "Part" || type === "Tool";
                    return [4 /*yield*/, Promise.all([
                            getSummary(client, itemId, companyId),
                            (0, items_1.getSupplierParts)(client, itemId, companyId),
                            (0, items_1.getPickMethods)(client, itemId, companyId),
                            (0, shared_1.getTagsList)(client, companyId, tagTable),
                            needsMakeMethods ? (0, items_1.getMakeMethods)(client, itemId, companyId) : null,
                            (0, items_1.getItemFiles)(client, itemId, companyId),
                            (0, resources_1.getLocationsList)(client, companyId)
                        ])];
                case 2:
                    _e = _m.sent(), summary = _e[0], supplierParts = _e[1], pickMethods = _e[2], tags = _e[3], makeMethods = _e[4], files = _e[5], locations = _e[6];
                    if (!summary.data) {
                        throw new Response("Not Found", { status: 404 });
                    }
                    // Guard against cross-tenant access: the detail RPCs run with RLS bypassed
                    // and are not scoped by company, so verify the item belongs to the caller's
                    // company before returning it (mirrors the part route's companyId check).
                    if (summary.data.companyId !== companyId) {
                        throw new Response("Not Found", { status: 404 });
                    }
                    common = {
                        itemId: itemId,
                        supplierParts: (_f = supplierParts.data) !== null && _f !== void 0 ? _f : [],
                        pickMethods: (_g = pickMethods.data) !== null && _g !== void 0 ? _g : [],
                        files: files,
                        tags: (_h = tags.data) !== null && _h !== void 0 ? _h : [],
                        locations: (_j = locations.data) !== null && _j !== void 0 ? _j : []
                    };
                    // Each branch casts summary.data to the correct type for the discriminated
                    // union. The cast is safe: getSummary is selected from typeConfig[type] so
                    // the runtime type always matches.
                    switch (type) {
                        case "Material":
                            return [2 /*return*/, __assign(__assign({}, common), { type: type, summary: summary.data })];
                        case "Consumable":
                            return [2 /*return*/, __assign(__assign({}, common), { type: type, summary: summary.data })];
                        case "Tool":
                            return [2 /*return*/, __assign(__assign({}, common), { type: type, summary: summary.data, makeMethods: (_k = makeMethods === null || makeMethods === void 0 ? void 0 : makeMethods.data) !== null && _k !== void 0 ? _k : [] })];
                        default:
                            return [2 /*return*/, __assign(__assign({}, common), { type: "Part", summary: summary.data, makeMethods: (_l = makeMethods === null || makeMethods === void 0 ? void 0 : makeMethods.data) !== null && _l !== void 0 ? _l : [] })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
