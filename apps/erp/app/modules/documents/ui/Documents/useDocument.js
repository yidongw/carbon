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
exports.useDocument = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var useDocument = function () {
    var navigate = (0, react_router_1.useNavigate)();
    var permissions = (0, hooks_1.usePermissions)();
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _a = (0, hooks_1.useUrlParams)(), params = _a[0], setParams = _a[1];
    var user = (0, hooks_1.useUser)();
    var canDelete = (0, react_2.useCallback)(function (doc) {
        var _a;
        return (!permissions.can("delete", "documents") ||
            // @ts-ignore
            !((_a = doc.writeGroups) === null || _a === void 0 ? void 0 : _a.some(function (group) { return user === null || user === void 0 ? void 0 : user.groups.includes(group); })));
    }, [permissions, user]);
    var canUpdate = (0, react_2.useCallback)(function (document) {
        var _a;
        return (!permissions.can("update", "documents") ||
            // @ts-ignore
            !((_a = document.writeGroups) === null || _a === void 0 ? void 0 : _a.some(function (group) { return user === null || user === void 0 ? void 0 : user.groups.includes(group); })));
    }, [permissions, user]);
    var insertTransaction = (0, react_2.useCallback)(function (document, type) {
        if ((user === null || user === void 0 ? void 0 : user.id) === undefined)
            throw new Error("User is undefined");
        if (!document.id)
            throw new Error("Document id is undefined");
        return carbon === null || carbon === void 0 ? void 0 : carbon.from("documentTransaction").insert({
            documentId: document.id,
            type: type,
            userId: user.id
        });
    }, [carbon, user === null || user === void 0 ? void 0 : user.id]);
    var deleteLabel = (0, react_2.useCallback)(function (document, label) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!document.id)
                throw new Error("Document id is undefined");
            if ((user === null || user === void 0 ? void 0 : user.id) === undefined)
                throw new Error("User is undefined");
            return [2 /*return*/, carbon === null || carbon === void 0 ? void 0 : carbon.from("documentLabel").delete().eq("documentId", document.id).eq("userId", user.id).eq("label", label)];
        });
    }); }, [carbon, user === null || user === void 0 ? void 0 : user.id]);
    var download = (0, react_2.useCallback)(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
        var url, response, blob, blobUrl, a, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!doc.path)
                        throw new Error("Document path is undefined");
                    url = path_1.path.to.file.previewFile("private/".concat(doc.path));
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.blob()];
                case 3:
                    blob = _b.sent();
                    blobUrl = window.URL.createObjectURL(blob);
                    a = document.createElement("a");
                    document.body.appendChild(a);
                    a.href = blobUrl;
                    a.download = (_a = doc.name) !== null && _a !== void 0 ? _a : "File";
                    a.click();
                    window.URL.revokeObjectURL(blobUrl);
                    document.body.removeChild(a);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    react_1.toast.error("Error downloading file");
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, insertTransaction(doc, "Download")];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); }, [insertTransaction]);
    var view = (0, react_2.useCallback)(function (document) {
        navigate("".concat(path_1.path.to.documentView(document.id), "/?").concat(params));
    }, [navigate, params]);
    var edit = (0, react_2.useCallback)(function (document) {
        return navigate("".concat(path_1.path.to.document(document.id), "?").concat(params));
    }, [navigate, params]);
    var favorite = (0, react_2.useCallback)(function (document) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!document.favorite) return [3 /*break*/, 2];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("documentFavorite").delete().eq("documentId", document.id).eq("userId", user === null || user === void 0 ? void 0 : user.id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, insertTransaction(document, "Unfavorite")];
                case 2: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("documentFavorite").insert({ documentId: document.id, userId: user === null || user === void 0 ? void 0 : user.id }))];
                case 3:
                    _a.sent();
                    return [2 /*return*/, insertTransaction(document, "Favorite")];
            }
        });
    }); }, [insertTransaction, carbon, user === null || user === void 0 ? void 0 : user.id]);
    var isImage = (0, react_2.useCallback)(function (fileType) {
        return ["png", "jpg", "jpeg", "gif", "svg", "avif", "webp"].includes(fileType);
    }, []);
    var isPdf = (0, react_2.useCallback)(function (fileType) {
        return fileType === "pdf";
    }, []);
    var label = (0, react_2.useCallback)(function (document, labels) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((user === null || user === void 0 ? void 0 : user.id) === undefined)
                        throw new Error("User is undefined");
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("documentLabel").delete().eq("documentId", document.id).eq("userId", user.id).then(function () {
                            return carbon === null || carbon === void 0 ? void 0 : carbon.from("documentLabel").insert(labels.map(function (label) { return ({
                                documentId: document.id,
                                label: label,
                                userId: user.id
                            }); }));
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/, insertTransaction(document, "Label")];
            }
        });
    }); }, [insertTransaction, carbon, user.id]);
    var makePreview = (0, react_2.useCallback)(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!doc.path)
                        throw new Error("Document path is undefined");
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").download(doc.path))];
                case 1:
                    result = _b.sent();
                    if (!result || result.error) {
                        react_1.toast.error(((_a = result === null || result === void 0 ? void 0 : result.error) === null || _a === void 0 ? void 0 : _a.message) || "Error previewing file");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, window.URL.createObjectURL(result.data)];
            }
        });
    }); }, [carbon]);
    var removeLabel = (0, react_2.useCallback)(function (document, label) {
        return carbon === null || carbon === void 0 ? void 0 : carbon.from("documentLabel").delete().eq("documentId", document.id).eq("userId", user === null || user === void 0 ? void 0 : user.id).eq("label", label);
    }, [carbon, user === null || user === void 0 ? void 0 : user.id]);
    var setLabel = (0, react_2.useCallback)(function (label) {
        setParams({ label: label });
    }, [setParams]);
    return {
        canDelete: canDelete,
        canUpdate: canUpdate,
        download: download,
        deleteLabel: deleteLabel,
        edit: edit,
        favorite: favorite,
        isImage: isImage,
        isPdf: isPdf,
        label: label,
        view: view,
        makePreview: makePreview,
        removeLabel: removeLabel,
        setLabel: setLabel
    };
};
exports.useDocument = useDocument;
