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
exports.loader = loader;
exports.action = action;
exports.default = EditDocumentRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_router_1 = require("react-router");
var documents_1 = require("~/modules/documents");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, documentId, document, _c, _d;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "documents"
                    })];
                case 1:
                    client = (_e.sent()).client;
                    documentId = params.documentId;
                    if (!documentId)
                        throw (0, auth_1.notFound)("documentId not found");
                    return [4 /*yield*/, (0, documents_1.getDocument)(client, documentId)];
                case 2:
                    document = _e.sent();
                    if (!document.error) return [3 /*break*/, 4];
                    _c = react_router_1.redirect;
                    _d = [path_1.path.to.documents];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(document.error, "Failed to get document"))];
                case 3: throw _c.apply(void 0, _d.concat([_e.sent()]));
                case 4: return [2 /*return*/, {
                        document: document.data
                    }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, validation, _d, _e, _f, id, extension, document, updateDocument, _g, _h, _j, _k;
        var request = _b.request;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "documents"
                        })];
                case 1:
                    _c = _l.sent(), client = _c.client, userId = _c.userId;
                    _e = (_d = (0, form_1.validator)(documents_1.documentValidator)).validate;
                    return [4 /*yield*/, request.formData()];
                case 2: return [4 /*yield*/, _e.apply(_d, [_l.sent()])];
                case 3:
                    validation = _l.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _f = validation.data, id = _f.id, extension = _f.extension, document = __rest(_f, ["id", "extension"]);
                    if (!id)
                        throw new Error("Could not find documentId");
                    return [4 /*yield*/, (0, documents_1.upsertDocument)(client, __assign(__assign({ id: id }, document), { name: "".concat(document.name, ".").concat(extension), updatedBy: userId }))];
                case 4:
                    updateDocument = _l.sent();
                    if (!updateDocument.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.documents];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateDocument.error, "Failed to update document"))];
                case 5: throw _g.apply(void 0, _h.concat([_l.sent()]));
                case 6:
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.documents];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated document"))];
                case 7: throw _j.apply(void 0, _k.concat([_l.sent()]));
            }
        });
    });
}
function EditDocumentRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var document = (0, react_router_1.useLoaderData)().document;
    var name = document.name;
    if (name)
        name = name.split(".").slice(0, -1).join(".");
    var initialValues = {
        id: (_a = document.id) !== null && _a !== void 0 ? _a : "",
        name: name !== null && name !== void 0 ? name : "",
        description: (_b = document.description) !== null && _b !== void 0 ? _b : "",
        type: (_c = document.type) !== null && _c !== void 0 ? _c : "",
        extension: (_d = document.extension) !== null && _d !== void 0 ? _d : "",
        size: (_e = document.size) !== null && _e !== void 0 ? _e : 0,
        readGroups: (_f = document.readGroups) !== null && _f !== void 0 ? _f : [],
        writeGroups: (_g = document.writeGroups) !== null && _g !== void 0 ? _g : []
    };
    return (<documents_1.DocumentForm key={initialValues.id} initialValues={initialValues} ownerId={(_h = document.createdBy) !== null && _h !== void 0 ? _h : ""}/>);
}
