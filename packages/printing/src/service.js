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
exports.getPrintJobs = getPrintJobs;
exports.getPrintJob = getPrintJob;
exports.getPrintJobContent = getPrintJobContent;
exports.createPrintJob = createPrintJob;
exports.updatePrintJobContent = updatePrintJobContent;
exports.updatePrintJobStatus = updatePrintJobStatus;
exports.getPrinterRoutes = getPrinterRoutes;
exports.getPrinterRoute = getPrinterRoute;
exports.upsertPrinterRoute = upsertPrinterRoute;
exports.deletePrinterRoute = deletePrinterRoute;
exports.getPrintingSettings = getPrintingSettings;
exports.updatePrintingSettings = updatePrintingSettings;
// -- Print Jobs --
function getPrintJobs(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query, limit, offset;
        var _a, _b;
        return __generator(this, function (_c) {
            query = client
                .from("printJob")
                .select("id, companyId, status, contentType, printerUrl, sourceDocument, sourceDocumentId, sourceDocumentReadableId, description, origin, error, attempts, createdBy, createdAt, updatedAt, updatedBy, completedAt", { count: "exact" })
                .eq("companyId", companyId)
                .order("createdAt", { ascending: false });
            if (args === null || args === void 0 ? void 0 : args.status) {
                query = query.eq("status", args.status);
            }
            if (args === null || args === void 0 ? void 0 : args.origin) {
                query = query.eq("origin", args.origin);
            }
            if (args === null || args === void 0 ? void 0 : args.sourceDocument) {
                query = query.eq("sourceDocument", args.sourceDocument);
            }
            if (args === null || args === void 0 ? void 0 : args.contentType) {
                query = query.eq("contentType", args.contentType);
            }
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.or("description.ilike.%".concat(args.search, "%,sourceDocumentReadableId.ilike.%").concat(args.search, "%"));
            }
            limit = (_a = args === null || args === void 0 ? void 0 : args.limit) !== null && _a !== void 0 ? _a : 100;
            offset = (_b = args === null || args === void 0 ? void 0 : args.offset) !== null && _b !== void 0 ? _b : 0;
            query = query.range(offset, offset + limit - 1);
            return [2 /*return*/, query];
        });
    });
}
function getPrintJob(client, printJobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("printJob")
                    .select("id, companyId, status, contentType, printerUrl, sourceDocument, sourceDocumentId, sourceDocumentReadableId, description, origin, error, attempts, createdBy, createdAt, updatedAt, updatedBy, completedAt")
                    .eq("id", printJobId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getPrintJobContent(client, printJobId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("printJob")
                    .select("id, content, contentType")
                    .eq("id", printJobId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function createPrintJob(client, job) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            return [2 /*return*/, client
                    .from("printJob")
                    .insert({
                    companyId: job.companyId,
                    contentType: (_a = job.contentType) !== null && _a !== void 0 ? _a : null,
                    content: (_b = job.content) !== null && _b !== void 0 ? _b : null,
                    printerUrl: job.printerUrl,
                    sourceDocument: job.sourceDocument,
                    sourceDocumentId: job.sourceDocumentId,
                    sourceDocumentReadableId: job.sourceDocumentReadableId,
                    description: job.description,
                    status: (_c = job.status) !== null && _c !== void 0 ? _c : "generating",
                    origin: (_d = job.origin) !== null && _d !== void 0 ? _d : "auto",
                    createdBy: job.createdBy
                })
                    .select("id")
                    .single()];
        });
    });
}
function updatePrintJobContent(client, printJobId, companyId, content, contentType) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("printJob")
                    .update({
                    content: content,
                    contentType: contentType,
                    status: "queued",
                    updatedAt: new Date().toISOString()
                })
                    .eq("id", printJobId)
                    .eq("companyId", companyId)];
        });
    });
}
function updatePrintJobStatus(client, printJobId, companyId, status, opts) {
    return __awaiter(this, void 0, void 0, function () {
        var update;
        var _a;
        return __generator(this, function (_b) {
            update = {
                status: status,
                updatedAt: new Date().toISOString()
            };
            if (status === "failed") {
                update.error = (_a = opts === null || opts === void 0 ? void 0 : opts.error) !== null && _a !== void 0 ? _a : null;
            }
            else {
                update.error = null;
            }
            if (status === "completed") {
                update.completedAt = new Date().toISOString();
            }
            return [2 /*return*/, client
                    .from("printJob")
                    .update(update)
                    .eq("id", printJobId)
                    .eq("companyId", companyId)];
        });
    });
}
// -- Printer Routes --
function getPrinterRoutes(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("printerRoute")
                        .select("*")
                        .eq("companyId", companyId)
                        .order("name")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, __assign(__assign({}, result), { 
                            // "format" is text in the DB but constrained to 'zpl' | 'pdf' by a CHECK
                            data: result.data })];
            }
        });
    });
}
function getPrinterRoute(client, routeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("printerRoute")
                    .select("id, locationId, name, format, mediaSizeId, printerUrl, apiKey, templateId")
                    .eq("id", routeId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function upsertPrinterRoute(client, route) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            if (route.id) {
                return [2 /*return*/, client
                        .from("printerRoute")
                        .update({
                        locationId: (_a = route.locationId) !== null && _a !== void 0 ? _a : null,
                        name: route.name,
                        format: route.format,
                        mediaSizeId: (_b = route.mediaSizeId) !== null && _b !== void 0 ? _b : null,
                        printerUrl: route.printerUrl,
                        apiKey: (_c = route.apiKey) !== null && _c !== void 0 ? _c : null,
                        templateId: (_d = route.templateId) !== null && _d !== void 0 ? _d : null,
                        updatedAt: new Date().toISOString()
                    })
                        .eq("id", route.id)
                        .eq("companyId", route.companyId)];
            }
            return [2 /*return*/, client.from("printerRoute").insert({
                    companyId: route.companyId,
                    locationId: (_e = route.locationId) !== null && _e !== void 0 ? _e : null,
                    name: route.name,
                    format: route.format,
                    mediaSizeId: (_f = route.mediaSizeId) !== null && _f !== void 0 ? _f : null,
                    printerUrl: route.printerUrl,
                    apiKey: (_g = route.apiKey) !== null && _g !== void 0 ? _g : null,
                    templateId: (_h = route.templateId) !== null && _h !== void 0 ? _h : null
                })];
        });
    });
}
function deletePrinterRoute(client, routeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("printerRoute")
                    .delete()
                    .eq("id", routeId)
                    .eq("companyId", companyId)];
        });
    });
}
// -- Printing Settings --
function getPrintingSettings(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .select("printing")
                    .eq("id", companyId)
                    .single()];
        });
    });
}
function updatePrintingSettings(client, companyId, settings) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("companySettings")
                    .update({
                    printing: settings
                })
                    .eq("id", companyId)];
        });
    });
}
