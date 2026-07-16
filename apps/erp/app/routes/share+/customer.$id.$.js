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
exports.loader = void 0;
var client_server_1 = require("@carbon/auth/client.server");
var plan_server_1 = require("@carbon/ee/plan.server");
var kv_1 = require("@carbon/kv");
var utils_1 = require("@carbon/utils");
var production_1 = require("~/modules/production");
var shared_service_1 = require("~/modules/shared/shared.service");
var supportedFileTypes = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    svg: "image/svg+xml",
    avif: "image/avif",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    wmv: "video/x-ms-wmv",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    flac: "audio/flac",
    dxf: "application/dxf",
    dwg: "application/dxf",
    stl: "application/stl",
    obj: "application/obj",
    glb: "application/glb",
    gltf: "application/gltf",
    fbx: "application/fbx",
    ply: "application/ply",
    off: "application/off",
    step: "application/step"
};
var loader = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    function downloadFile() {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, serviceRole.storage.from(bucket).download("".concat(path))];
                    case 1:
                        result = _a.sent();
                        if (result.error) {
                            console.error(result.error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, result.data];
                }
            });
        });
    }
    var id, ip, ratelimit, success, serviceRole, customer, hasPlan, path, bucket, pathMatch, companyId, operationId, fileType, job, contentType, fileData, headers;
    var _c, _d, _e;
    var params = _b.params, request = _b.request;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                id = params.id;
                if (!id) {
                    throw new Error("Customer ID is required");
                }
                ip = (_c = request.headers.get("x-forwarded-for")) !== null && _c !== void 0 ? _c : "127.0.0.1";
                ratelimit = new kv_1.Ratelimit({
                    redis: kv_1.redis,
                    limiter: kv_1.Ratelimit.slidingWindow(10, "1 m"), // 10 downloads per minute
                    analytics: true
                });
                return [4 /*yield*/, ratelimit.limit(ip)];
            case 1:
                success = (_f.sent()).success;
                if (!success) {
                    return [2 /*return*/, new Response(null, { status: 429 })];
                }
                serviceRole = (0, client_server_1.getCarbonServiceRole)();
                return [4 /*yield*/, (0, shared_service_1.getCustomerPortal)(serviceRole, id)];
            case 2:
                customer = _f.sent();
                if (customer.error) {
                    console.error(customer.error);
                    throw new Error("Customer not found");
                }
                if (!customer.data.customerId) {
                    console.error(customer.error);
                    throw new Error("Customer not found");
                }
                return [4 /*yield*/, (0, plan_server_1.companyHasPlan)(serviceRole, customer.data.companyId, {
                        feature: "CUSTOMER_PORTALS"
                    })];
            case 3:
                hasPlan = _f.sent();
                if (!hasPlan) {
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                path = params["*"];
                bucket = "private";
                if (!path)
                    throw new Error("Path not found");
                path = decodeURIComponent(path);
                pathMatch = (_d = params["*"]) === null || _d === void 0 ? void 0 : _d.match(/^([^/]+)\/job\/([^/]+)\/[^/]+$/);
                companyId = pathMatch === null || pathMatch === void 0 ? void 0 : pathMatch[1];
                operationId = pathMatch === null || pathMatch === void 0 ? void 0 : pathMatch[2];
                fileType = (_e = path.split(".").pop()) === null || _e === void 0 ? void 0 : _e.toLowerCase();
                if (companyId !== customer.data.companyId) {
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                if (!operationId) {
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                return [4 /*yield*/, (0, production_1.getJobByOperationId)(serviceRole, operationId)];
            case 4:
                job = _f.sent();
                if (job.error) {
                    console.error(job.error);
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                if (job.data.companyId !== customer.data.companyId) {
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                if (job.data.customerId !== customer.data.customerId) {
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                if (!fileType ||
                    (!(fileType in supportedFileTypes) &&
                        !utils_1.supportedModelTypes.includes(fileType)))
                    throw new Error("File type ".concat(fileType, " not supported"));
                contentType = supportedFileTypes[fileType];
                if (!path.includes(customer.data.companyId)) {
                    return [2 /*return*/, new Response(null, { status: 403 })];
                }
                return [4 /*yield*/, downloadFile()];
            case 5:
                fileData = _f.sent();
                if (!!fileData) return [3 /*break*/, 8];
                // Wait for a second and try again
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
            case 6:
                // Wait for a second and try again
                _f.sent();
                return [4 /*yield*/, downloadFile()];
            case 7:
                fileData = _f.sent();
                if (!fileData) {
                    throw new Error("Failed to download file after retry");
                }
                _f.label = 8;
            case 8:
                headers = new Headers({
                    "Content-Type": contentType,
                    "Cache-Control": "private, max-age=31536000, immutable"
                });
                return [2 /*return*/, new Response(fileData, { status: 200, headers: headers })];
        }
    });
}); };
exports.loader = loader;
