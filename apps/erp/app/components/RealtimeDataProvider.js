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
var react_2 = require("react");
var hooks_1 = require("~/hooks");
var stores_1 = require("~/stores");
var hydratedFromIdb = false;
var hydratedFromServer = false;
var RealtimeDataProvider = function (_a) {
    var children = _a.children;
    var _b = (0, auth_1.useCarbon)(), carbon = _b.carbon, accessToken = _b.accessToken;
    var companyId = (0, hooks_1.useUser)().company.id;
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        hydratedFromServer = false;
    }, [companyId]);
    // Reset on logout so the next login triggers a fresh server hydrate.
    (0, react_2.useEffect)(function () {
        if (!accessToken)
            hydratedFromServer = false;
    }, [accessToken]);
    var _c = (0, stores_1.useItems)(), setItems = _c[1];
    var _d = (0, stores_1.useSuppliers)(), setSuppliers = _d[1];
    var _e = (0, stores_1.useCustomers)(), setCustomers = _e[1];
    var _f = (0, stores_1.usePeople)(), setPeople = _f[1];
    var fetchQuantities = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, totalMap, locationMap, _i, data_1, row, qty, locId;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon || !companyId)
                        return [2 /*return*/];
                    return [4 /*yield*/, (0, database_1.fetchAllFromTable)(carbon, 
                        // @ts-ignore -- itemStockQuantities is a materialized view
                        "itemStockQuantities", "itemId, locationId, quantityOnHand", function (query) { return query.eq("companyId", companyId); })];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error || !data)
                        return [2 /*return*/];
                    totalMap = new Map();
                    locationMap = new Map();
                    for (_i = 0, data_1 = data; _i < data_1.length; _i++) {
                        row = data_1[_i];
                        if (!row.itemId)
                            continue;
                        qty = Number(row.quantityOnHand) || 0;
                        locId = row.locationId || "";
                        totalMap.set(row.itemId, ((_b = totalMap.get(row.itemId)) !== null && _b !== void 0 ? _b : 0) + qty);
                        if (!locationMap.has(row.itemId))
                            locationMap.set(row.itemId, {});
                        if (locId)
                            locationMap.get(row.itemId)[locId] = qty;
                    }
                    setItems(function (currentItems) {
                        return currentItems.map(function (item) {
                            var _a, _b;
                            return (__assign(__assign({}, item), { quantityOnHand: (_a = totalMap.get(item.id)) !== null && _a !== void 0 ? _a : 0, quantityByLocation: (_b = locationMap.get(item.id)) !== null && _b !== void 0 ? _b : {} }));
                        });
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var hydrate = function () { return __awaiter(void 0, void 0, void 0, function () {
        var idb, _a, items, suppliers, customers, people;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, Promise.resolve().then(function () { return require("localforage"); })];
                case 1:
                    idb = (_f.sent()).default;
                    if (!hydratedFromIdb) {
                        hydratedFromIdb = true;
                        idb.getItem("customers").then(function (data) {
                            if (data && !hydratedFromServer)
                                setCustomers(data, true);
                        });
                        idb.getItem("items").then(function (data) {
                            if (data && !hydratedFromServer)
                                setItems(data, true);
                        });
                        idb.getItem("suppliers").then(function (data) {
                            if (data && !hydratedFromServer)
                                setSuppliers(data, true);
                        });
                        // Don't load people from cache since we just cleared it above
                        // idb.getItem("people").then((data) => {
                        //   // @ts-ignore
                        //   if (data && !hydratedFromServer) setPeople(data, true);
                        // });
                    }
                    if (!carbon || !accessToken || hydratedFromServer)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            (0, database_1.fetchAllFromTable)(carbon, "item", "id, readableIdWithRevision, unitOfMeasureCode, name, type, replenishmentSystem, active, itemTrackingType", function (query) {
                                return query
                                    .eq("companyId", companyId)
                                    .order("readableId", { ascending: true })
                                    .order("revision", { ascending: false });
                            }),
                            (0, database_1.fetchAllFromTable)(carbon, "supplier", "id, name, website, supplierStatus, readableId", function (query) { return query.eq("companyId", companyId).order("name"); }),
                            (0, database_1.fetchAllFromTable)(carbon, "customer", "id, name, website, readableId", function (query) {
                                return query.eq("companyId", companyId).order("name");
                            }),
                            (0, database_1.fetchAllFromTable)(carbon, "employees", "id, name, firstName, lastName, email, avatarUrl, number", function (query) { return query.eq("companyId", companyId).order("name"); })
                        ])];
                case 2:
                    _a = _f.sent(), items = _a[0], suppliers = _a[1], customers = _a[2], people = _a[3];
                    if (items.error) {
                        throw new Error("Failed to fetch items");
                    }
                    if (suppliers.error) {
                        throw new Error("Failed to fetch suppliers");
                    }
                    if (customers.error) {
                        throw new Error("Failed to fetch customers");
                    }
                    if (people.error) {
                        throw new Error("Failed to fetch people");
                    }
                    hydratedFromServer = true;
                    // @ts-ignore
                    setItems((_b = items.data) !== null && _b !== void 0 ? _b : []);
                    setSuppliers((_c = suppliers.data) !== null && _c !== void 0 ? _c : []);
                    setCustomers((_d = customers.data) !== null && _d !== void 0 ? _d : []);
                    // @ts-ignore
                    setPeople((_e = people.data) !== null && _e !== void 0 ? _e : []);
                    return [4 /*yield*/, Promise.all([
                            idb.setItem("items", items.data),
                            idb.setItem("suppliers", suppliers.data),
                            idb.setItem("customers", customers.data),
                            idb.setItem("people", people.data)
                        ])];
                case 3:
                    _f.sent();
                    fetchQuantities();
                    return [2 /*return*/];
            }
        });
    }); };
    // Re-run when auth becomes ready: `hydrate()` bails if `carbon` / `accessToken` are missing,
    // and with only `[companyId]` that first run could be the only attempt — leaving `items` empty
    // (e.g. New Job item combobox shows no options).
    // biome-ignore lint/correctness/useExhaustiveDependencies: hydrate closes over setters + idb
    (0, react_2.useEffect)(function () {
        if (!companyId)
            return;
        hydrate().catch(function (err) { return console.error("hydrate failed:", err); });
    }, [companyId, carbon, accessToken]);
    (0, react_1.useInterval)(fetchQuantities, companyId ? 10 * 60 * 1000 : null);
    (0, react_1.useRealtimeChannel)({
        topic: "realtime:core",
        dependencies: [companyId],
        setup: function (channel, carbon) {
            var _this = this;
            return channel
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "item"
            }, function (payload) {
                switch (payload.eventType) {
                    case "INSERT":
                        if ("companyId" in payload.new &&
                            payload.new.companyId !== companyId)
                            return;
                        var inserted_1 = payload.new;
                        setItems(function (items) {
                            return __spreadArray(__spreadArray([], items, true), [
                                {
                                    id: inserted_1.id,
                                    name: inserted_1.name,
                                    readableIdWithRevision: inserted_1.readableIdWithRevision,
                                    description: inserted_1.description,
                                    replenishmentSystem: inserted_1.replenishmentSystem,
                                    itemTrackingType: inserted_1.itemTrackingType,
                                    unitOfMeasureCode: inserted_1.unitOfMeasureCode,
                                    type: inserted_1.type,
                                    active: inserted_1.active
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
                                    return __assign(__assign({}, i), { readableIdWithRevision: updated_1.readableIdWithRevision, name: updated_1.name, replenishmentSystem: updated_1.replenishmentSystem, itemTrackingType: updated_1.itemTrackingType, unitOfMeasureCode: updated_1.unitOfMeasureCode, type: updated_1.type, active: updated_1.active });
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
            })
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "customer"
            }, function (payload) {
                switch (payload.eventType) {
                    case "INSERT":
                        if ("companyId" in payload.new &&
                            payload.new.companyId !== companyId)
                            return;
                        var inserted_2 = payload.new;
                        setCustomers(function (customers) {
                            var _a;
                            return __spreadArray(__spreadArray([], customers, true), [
                                {
                                    id: inserted_2.id,
                                    name: inserted_2.name,
                                    website: inserted_2.website,
                                    readableId: (_a = inserted_2.readableId) !== null && _a !== void 0 ? _a : undefined
                                }
                            ], false).sort(function (a, b) { return a.name.localeCompare(b.name); });
                        });
                        break;
                    case "UPDATE":
                        var updated_2 = payload.new;
                        setCustomers(function (customers) {
                            return customers
                                .map(function (p) {
                                var _a;
                                if (p.id === updated_2.id) {
                                    return __assign(__assign({}, p), { name: updated_2.name, website: updated_2.website, readableId: (_a = updated_2.readableId) !== null && _a !== void 0 ? _a : undefined });
                                }
                                return p;
                            })
                                .sort(function (a, b) { return a.name.localeCompare(b.name); });
                        });
                        break;
                    case "DELETE":
                        var deleted_2 = payload.old;
                        setCustomers(function (customers) {
                            return customers.filter(function (p) { return p.id !== deleted_2.id; });
                        });
                        break;
                    default:
                        break;
                }
            })
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "supplier"
            }, function (payload) {
                switch (payload.eventType) {
                    case "INSERT":
                        if ("companyId" in payload.new &&
                            payload.new.companyId !== companyId)
                            return;
                        var inserted_3 = payload.new;
                        setSuppliers(function (suppliers) {
                            var _a;
                            return __spreadArray(__spreadArray([], suppliers, true), [
                                {
                                    id: inserted_3.id,
                                    name: inserted_3.name,
                                    website: inserted_3.website,
                                    supplierStatus: inserted_3.supplierStatus,
                                    readableId: (_a = inserted_3.readableId) !== null && _a !== void 0 ? _a : undefined
                                }
                            ], false).sort(function (a, b) { return a.name.localeCompare(b.name); });
                        });
                        break;
                    case "UPDATE":
                        var updated_3 = payload.new;
                        setSuppliers(function (suppliers) {
                            return suppliers
                                .map(function (p) {
                                var _a;
                                if (p.id === updated_3.id) {
                                    return __assign(__assign({}, p), { name: updated_3.name, website: updated_3.website, supplierStatus: updated_3.supplierStatus, readableId: (_a = updated_3.readableId) !== null && _a !== void 0 ? _a : undefined });
                                }
                                return p;
                            })
                                .sort(function (a, b) { return a.name.localeCompare(b.name); });
                        });
                        break;
                    case "DELETE":
                        var deleted_3 = payload.old;
                        setSuppliers(function (suppliers) {
                            return suppliers.filter(function (p) { return p.id !== deleted_3.id; });
                        });
                        break;
                    default:
                        break;
                }
            })
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "employee"
            }, function (payload) { return __awaiter(_this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, carbon
                                .from("employees")
                                .select("id, name, firstName, lastName, avatarUrl, email, number")
                                .eq("companyId", companyId)
                                .order("name")];
                        case 1:
                            data = (_a.sent()).data;
                            if (data) {
                                // @ts-ignore
                                setPeople(data);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    });
    return <>{children}</>;
};
exports.default = RealtimeDataProvider;
