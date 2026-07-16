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
exports.loader = loader;
var auth_server_1 = require("@carbon/auth/auth.server");
var qr_1 = require("@carbon/documents/qr");
var react_router_1 = require("react-router");
var inventory_service_1 = require("~/modules/inventory/inventory.service");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var client, id, action, kanban, url, kanbanUrl, qrColor, baseUrl, buffer;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "inventory"
                    })];
                case 1:
                    client = (_c.sent()).client;
                    id = params.id, action = params.action;
                    if (!id)
                        throw new Error("Could not find kanban id");
                    if (!action)
                        throw new Error("Could not find kanban action");
                    if (!["order", "start", "complete"].includes(action)) {
                        throw new Error("Invalid kanban action");
                    }
                    return [4 /*yield*/, (0, inventory_service_1.getKanban)(client, id)];
                case 2:
                    kanban = _c.sent();
                    if (kanban.error) {
                        return [2 /*return*/, (0, react_router_1.data)({ error: "Unauthorized" }, { status: 401 })];
                    }
                    url = new URL(request.url);
                    kanbanUrl = "";
                    qrColor = "000000";
                    baseUrl = "".concat(url.protocol, "//").concat(url.host);
                    if (action === "order") {
                        kanbanUrl = "".concat(baseUrl).concat(path_1.path.to.api.kanban(id));
                        qrColor = "000000"; // black
                    }
                    else if (action === "start") {
                        kanbanUrl = "".concat(baseUrl).concat(path_1.path.to.api.kanbanStart(id));
                        qrColor = "059669"; // emerald-600
                    }
                    else if (action === "complete") {
                        kanbanUrl = "".concat(baseUrl).concat(path_1.path.to.api.kanbanComplete(id));
                        qrColor = "2563eb"; // blue-600
                    }
                    return [4 /*yield*/, (0, qr_1.generateQRCodeBuffer)(kanbanUrl, 36, qrColor)];
                case 3:
                    buffer = _c.sent();
                    // @ts-ignore
                    return [2 /*return*/, new Response(buffer, {
                            headers: {
                                "Content-Type": "image/png",
                                "Cache-Control": "public, max-age=31536000, immutable"
                            }
                        })];
            }
        });
    });
}
