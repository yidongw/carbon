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
exports.getCompanySettings = getCompanySettings;
exports.setLocation = setLocation;
exports.getLocation = getLocation;
var auth_1 = require("@carbon/auth");
var cookie = require("cookie");
function getCompanySettings(request, companyId) {
    var cookieHeader = request.headers.get("cookie");
    var parsed = cookieHeader ? cookie.parse(cookieHeader)[companyId] : null;
    if (parsed && !parsed.includes(":")) {
        // temporary check for backwards compatibility
        return { location: parsed };
    }
    return {
        location: undefined
    };
}
function setLocation(companyId, locationId) {
    return cookie.serialize(companyId, locationId, {
        path: "/",
        maxAge: 31536000
    });
}
function getLocation(request, client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, companyId, location, updated, employeeJob, locations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = args.userId, companyId = args.companyId;
                    location = getCompanySettings(request, companyId).location;
                    updated = false;
                    if (!!location) return [3 /*break*/, 4];
                    return [4 /*yield*/, client
                            .from("employeeJob")
                            .select("locationId")
                            .eq("id", userId)
                            .eq("companyId", companyId)
                            .single()];
                case 1:
                    employeeJob = _a.sent();
                    if (!(employeeJob.data && employeeJob.data.locationId)) return [3 /*break*/, 2];
                    location = employeeJob.data.locationId;
                    updated = true;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, client
                        .from("location")
                        .select("id")
                        .eq("companyId", companyId)];
                case 3:
                    locations = _a.sent();
                    if (locations.data && locations.data.length > 0) {
                        location = locations.data[0].id;
                        updated = true;
                    }
                    _a.label = 4;
                case 4:
                    if (!location)
                        throw (0, auth_1.notFound)("Failed to get a valid location. Please add one in the resources module.");
                    if (updated) {
                        setLocation(companyId, location);
                    }
                    return [2 /*return*/, { location: location, updated: updated }];
            }
        });
    });
}
