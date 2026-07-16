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
var lodash_template_1 = require("lodash.template");
var react_router_1 = require("react-router");
var quality_1 = require("./data/quality");
function interpolateContent(content, data) {
    if (typeof content === "string") {
        return (0, lodash_template_1.default)(content)(data);
    }
    if (Array.isArray(content)) {
        return content.map(function (item) { return interpolateContent(item, data); });
    }
    if (content && typeof content === "object") {
        var result = {};
        for (var _i = 0, _a = Object.entries(content); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (key === "text" && typeof value === "string") {
                result[key] = (0, lodash_template_1.default)(value)(data);
            }
            else {
                result[key] = interpolateContent(value, data);
            }
        }
        return result;
    }
    return content;
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, companyId, _d, currentDocuments, company, interpolatedDocuments, insertDocuments;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "quality"
                        })];
                case 1:
                    _c = _e.sent(), client = _c.client, userId = _c.userId, companyId = _c.companyId;
                    return [4 /*yield*/, Promise.all([
                            client.from("qualityDocument").select("*").eq("companyId", companyId),
                            client.from("company").select("name").eq("id", companyId).single()
                        ])];
                case 2:
                    _d = _e.sent(), currentDocuments = _d[0], company = _d[1];
                    if (currentDocuments.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: currentDocuments.error.message }, { status: 500 })];
                    }
                    if (currentDocuments.data.length > 0) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Documents already exist" }, { status: 400 })];
                    }
                    if (company.error || !company.data) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: "Company not found" }, { status: 404 })];
                    }
                    interpolatedDocuments = quality_1.documents.map(function (document) { return (__assign(__assign({}, document), { content: interpolateContent(document.content, { company: company.data }), companyId: companyId, createdBy: userId })); });
                    return [4 /*yield*/, client
                            .from("qualityDocument")
                            .insert(interpolatedDocuments)];
                case 3:
                    insertDocuments = _e.sent();
                    if (insertDocuments.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ success: false, message: insertDocuments.error.message }, { status: 500 })];
                    }
                    return [2 /*return*/, { success: true, message: "Successfully seeded documents" }];
            }
        });
    });
}
