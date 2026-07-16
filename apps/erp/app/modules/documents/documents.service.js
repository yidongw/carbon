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
exports.deleteDocument = deleteDocument;
exports.deleteDocumentFavorite = deleteDocumentFavorite;
exports.deleteDocumentLabel = deleteDocumentLabel;
exports.getDocument = getDocument;
exports.getDocuments = getDocuments;
exports.getDocumentExtensions = getDocumentExtensions;
exports.getDocumentLabels = getDocumentLabels;
exports.insertDocumentFavorite = insertDocumentFavorite;
exports.insertDocumentLabel = insertDocumentLabel;
exports.moveDocumentToTrash = moveDocumentToTrash;
exports.restoreDocument = restoreDocument;
exports.upsertDocument = upsertDocument;
exports.updateDocumentFavorite = updateDocumentFavorite;
exports.updateDocumentLabels = updateDocumentLabels;
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
var shared_service_1 = require("../shared/shared.service");
function deleteDocument(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("document").delete().eq("id", id)];
        });
    });
}
function deleteDocumentFavorite(client, id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentFavorite")
                    .delete()
                    .eq("documentId", id)
                    .eq("userId", userId)];
        });
    });
}
function deleteDocumentLabel(client, id, label) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("documentLabel")
                    .delete()
                    .eq("documentId", id)
                    .eq("label", label)];
        });
    });
}
function getDocument(client, documentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("documents").select("*").eq("id", documentId).single()];
        });
    });
}
function getDocuments(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("documents")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("active", args.active);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("name.ilike.%".concat(args.search, "%,description.ilike.%").concat(args.search, "%"));
            }
            if (args === null || args === void 0 ? void 0 : args.favorite) {
                query = query.eq("favorite", true);
            }
            if (args.recent) {
                query = query.order("lastActivityAt", { ascending: false });
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "favorite", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getDocumentExtensions(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("documentExtensions").select("extension")];
        });
    });
}
function getDocumentLabels(client, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("documentLabels").select("*").eq("userId", userId)];
        });
    });
}
function insertDocumentFavorite(client, id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("documentFavorite").insert({ documentId: id, userId: userId })];
        });
    });
}
function insertDocumentLabel(client, id, label, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("documentLabel").insert({ documentId: id, label: label, userId: userId })];
        });
    });
}
function moveDocumentToTrash(client, id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("document")
                    .update({
                    active: false,
                    updatedBy: userId,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", id)];
        });
    });
}
function restoreDocument(client, id, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("document")
                    .update({
                    active: true,
                    updatedBy: userId,
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", id)];
        });
    });
}
function upsertDocument(client, document) {
    return __awaiter(this, void 0, void 0, function () {
        var type, extension, data;
        var _a;
        return __generator(this, function (_b) {
            type = (0, shared_service_1.getDocumentType)((_a = document.name) !== null && _a !== void 0 ? _a : "");
            if ("createdBy" in document) {
                return [2 /*return*/, (client
                        .from("document")
                        // @ts-ignore
                        .insert(__assign(__assign({}, document), { type: type }))
                        .select("*")
                        .single())];
            }
            extension = document.extension, data = __rest(document, ["extension"]);
            return [2 /*return*/, client
                    .from("document")
                    .update((0, supabase_1.sanitize)(__assign(__assign({}, data), { type: type, updatedAt: new Date().toISOString() })))
                    .eq("id", document.id)];
        });
    });
}
function updateDocumentFavorite(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var id, favorite, userId;
        return __generator(this, function (_a) {
            id = args.id, favorite = args.favorite, userId = args.userId;
            if (!favorite) {
                return [2 /*return*/, client
                        .from("documentFavorite")
                        .delete()
                        .eq("documentId", id)
                        .eq("userId", userId)];
            }
            else {
                return [2 /*return*/, client
                        .from("documentFavorite")
                        .insert({ documentId: id, userId: userId })];
            }
            return [2 /*return*/];
        });
    });
}
function updateDocumentLabels(client, document) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!document.labels) {
                throw new Error("No labels provided");
            }
            return [2 /*return*/, client
                    .from("documentLabel")
                    .delete()
                    .eq("documentId", document.documentId)
                    .eq("userId", document.userId)
                    .then(function () {
                    return client.from("documentLabel").insert(
                    // @ts-ignore
                    document.labels.map(function (label) { return ({
                        documentId: document.documentId,
                        label: label,
                        userId: document.userId
                    }); }));
                })];
        });
    });
}
