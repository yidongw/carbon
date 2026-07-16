"use client";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var database_1 = require("@carbon/database");
var react_1 = require("@carbon/react");
var localforage_1 = require("localforage");
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var hydratedFromIdb = false;
var hydratedFromServer = false;
var RealtimeDataProvider = function (_a) {
    var children = _a.children;
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _b = (0, auth_1.useCarbon)(), carbon = _b.carbon, accessToken = _b.accessToken, isRealtimeAuthSet = _b.isRealtimeAuthSet;
    var companyId = (0, hooks_1.useUser)().company.id;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        hydratedFromServer = false;
    }, [companyId]);
    var _c = (0, stores_1.useItems)(), setItems = _c[1];
    var _d = (0, stores_1.usePeople)(), setPeople = _d[1];
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var channelRef = (0, react_2.useRef)(null);
    var hydrate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, items, people, itemData;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!hydratedFromIdb) {
                        hydratedFromIdb = true;
                        localforage_1.default.getItem("items").then(function (data) {
                            if (data && !hydratedFromServer)
                                setItems(data, true);
                        });
                        localforage_1.default.getItem("people").then(function (data) {
                            // @ts-ignore
                            if (data && !hydratedFromServer)
                                setPeople(data, true);
                        });
                    }
                    if (!carbon || !accessToken || hydratedFromServer)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            (0, database_1.fetchAllFromTable)(carbon, "item", "id, readableIdWithRevision, name, type, replenishmentSystem, itemTrackingType, active, thumbnailPath, modelUpload:modelUploadId(thumbnailPath)", function (query) {
                                return query
                                    .eq("companyId", companyId)
                                    .order("readableId", { ascending: true })
                                    .order("revision", { ascending: false });
                            }),
                            (0, database_1.fetchAllFromTable)(carbon, "employees", "id, name, firstName, lastName, email, avatarUrl", function (query) { return query.eq("companyId", companyId).order("name"); })
                        ])];
                case 1:
                    _a = _d.sent(), items = _a[0], people = _a[1];
                    if (items.error) {
                        throw new Error("Failed to fetch items");
                    }
                    if (people.error) {
                        throw new Error("Failed to fetch people");
                    }
                    hydratedFromServer = true;
                    itemData = ((_b = items.data) !== null && _b !== void 0 ? _b : []);
                    setItems(itemData.map(function (item) {
                        var _a, _b, _c;
                        return ({
                            id: item.id,
                            name: item.name,
                            readableIdWithRevision: item.readableIdWithRevision,
                            type: item.type,
                            replenishmentSystem: item.replenishmentSystem,
                            itemTrackingType: item.itemTrackingType,
                            active: item.active,
                            thumbnailPath: (_c = (_a = item.thumbnailPath) !== null && _a !== void 0 ? _a : (_b = item.modelUpload) === null || _b === void 0 ? void 0 : _b.thumbnailPath) !== null && _c !== void 0 ? _c : null
                        });
                    }));
                    setPeople(
                    // @ts-ignore
                    (_c = people.data) !== null && _c !== void 0 ? _c : []);
                    return [2 /*return*/];
            }
        });
    }); };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (!companyId)
            return;
        hydrate();
    }, [companyId, accessToken]);
    (0, react_1.useRealtimeChannel)({
        topic: "realtime:core",
        dependencies: [companyId],
        setup: function (channel) {
            return channel.on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "item",
                filter: "companyId=eq.".concat(companyId)
            }, function (payload) {
                if ("companyId" in payload.new && payload.new.companyId !== companyId)
                    return;
                switch (payload.eventType) {
                    case "INSERT":
                        var inserted_1 = payload.new;
                        setItems(function (items) {
                            return __spreadArray(__spreadArray([], items, true), [
                                {
                                    id: inserted_1.id,
                                    name: inserted_1.name,
                                    readableIdWithRevision: inserted_1.readableIdWithRevision,
                                    replenishmentSystem: inserted_1.replenishmentSystem,
                                    itemTrackingType: inserted_1.itemTrackingType,
                                    type: inserted_1.type,
                                    active: inserted_1.active,
                                    thumbnailPath: inserted_1.thumbnailPath
                                }
                            ], false).sort(function (a, b) {
                                return a.readableIdWithRevision.localeCompare(b.readableIdWithRevision);
                            });
                        });
                        break;
                    case "UPDATE":
                        var updated_1 = payload.new;
                        setItems(function (items) {
                            return items
                                .map(function (i) {
                                if (i.id === updated_1.id) {
                                    return __assign(__assign({}, i), { readableIdWithRevision: updated_1.readableIdWithRevision, name: updated_1.name, replenishmentSystem: updated_1.replenishmentSystem, type: updated_1.type, active: updated_1.active, thumbnailPath: updated_1.thumbnailPath });
                                }
                                return i;
                            })
                                .sort(function (a, b) {
                                return a.readableIdWithRevision.localeCompare(b.readableIdWithRevision);
                            });
                        });
                        break;
                    case "DELETE":
                        var deleted_1 = payload.old;
                        setItems(function (items) { return items.filter(function (p) { return p.id !== deleted_1.id; }); });
                        break;
                    default:
                        break;
                }
            });
        }
    });
    return <>{children}</>;
};
exports.default = RealtimeDataProvider;
