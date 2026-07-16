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
exports.default = KanbanRedirectRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var client_server_1 = require("@carbon/auth/client.server");
var jobs_1 = require("@carbon/jobs");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Redirect_1 = require("~/components/Redirect");
var inventory_1 = require("~/modules/inventory");
var items_1 = require("~/modules/items");
var production_1 = require("~/modules/production");
var purchasing_1 = require("~/modules/purchasing");
var path_1 = require("~/utils/path");
function handleKanban(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var kanban, _c, manufacturing, defaultStorageUnit, leadTime, startDate, dueDate, storageUnitId, serviceRole, createdJob, id_1, _d, upsertMethod, associateKanban, jobId, redirectUrl, operation, operationId, setupTime, laborTime, machineTime, type, existingPurchaseOrder, purchaseOrderId, newPurchaseOrder, _e, item, supplierPart, inventory, itemCost, itemReplenishment, createPurchaseOrderLine;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v;
        var client = _b.client, companyId = _b.companyId, companyGroupId = _b.companyGroupId, userId = _b.userId, id = _b.id;
        return __generator(this, function (_w) {
            switch (_w.label) {
                case 0: return [4 /*yield*/, (0, inventory_1.getKanban)(client, id)];
                case 1:
                    kanban = _w.sent();
                    if (((_f = kanban.data) === null || _f === void 0 ? void 0 : _f.replenishmentSystem) === "Make" &&
                        ((_g = kanban.data) === null || _g === void 0 ? void 0 : _g.jobReadableId)) {
                        return [2 /*return*/, {
                                data: path_1.path.to.api.kanbanCollision(id),
                                error: null
                            }];
                    }
                    if (kanban.error || !kanban.data) {
                        return [2 /*return*/, {
                                data: null,
                                error: "Kanban is not active"
                            }];
                    }
                    if (kanban.data.companyId !== companyId) {
                        return [2 /*return*/, {
                                data: null,
                                error: "Kanban is not active"
                            }];
                    }
                    if (!(kanban.data.replenishmentSystem === "Make")) return [3 /*break*/, 9];
                    if (!kanban.data.itemId) {
                        return [2 /*return*/, {
                                data: null,
                                error: "Failed to create job"
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getItemReplenishment)(client, kanban.data.itemId, companyId),
                            (0, inventory_1.getDefaultStorageUnitForJob)(client, kanban.data.itemId, kanban.data.locationId, companyId)
                        ])];
                case 2:
                    _c = _w.sent(), manufacturing = _c[0], defaultStorageUnit = _c[1];
                    leadTime = (_j = (_h = manufacturing.data) === null || _h === void 0 ? void 0 : _h.leadTime) !== null && _j !== void 0 ? _j : 7;
                    startDate = (0, date_1.today)((0, date_1.getLocalTimeZone)());
                    dueDate = startDate.add({ days: leadTime }).toString();
                    storageUnitId = kanban.data.storageUnitId || defaultStorageUnit || undefined;
                    serviceRole = (0, client_server_1.getCarbonServiceRole)();
                    return [4 /*yield*/, (0, production_1.insertJob)(serviceRole, {
                            itemId: kanban.data.itemId,
                            quantity: kanban.data.quantity,
                            locationId: kanban.data.locationId,
                            storageUnitId: storageUnitId,
                            unitOfMeasureCode: kanban.data.purchaseUnitOfMeasureCode,
                            deadlineType: "Hard Deadline",
                            startDate: startDate.toString(),
                            dueDate: dueDate,
                            companyId: companyId,
                            createdBy: userId
                        }, { skipMethod: true, skipRecalculate: true })];
                case 3:
                    createdJob = _w.sent();
                    id_1 = (_k = createdJob.data) === null || _k === void 0 ? void 0 : _k.id;
                    if (createdJob.error || !id_1) {
                        console.error(createdJob.error);
                        return [2 /*return*/, {
                                data: null,
                                error: "Failed to create job"
                            }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.upsertJobMethod)(serviceRole, "itemToJob", {
                                sourceId: kanban.data.itemId,
                                targetId: id_1,
                                companyId: companyId,
                                userId: userId,
                                configuration: undefined
                            }),
                            (0, production_1.updateKanbanJob)(serviceRole, {
                                id: kanban.data.id,
                                jobId: id_1,
                                companyId: companyId,
                                userId: userId
                            })
                        ])];
                case 4:
                    _d = _w.sent(), upsertMethod = _d[0], associateKanban = _d[1];
                    if (associateKanban.error) {
                        console.error(associateKanban.error);
                        return [2 /*return*/, {
                                data: null,
                                error: "Failed to associate kanban with job"
                            }];
                    }
                    if (!(!upsertMethod.error && kanban.data.autoRelease)) return [3 /*break*/, 6];
                    return [4 /*yield*/, Promise.all([
                            (0, jobs_1.trigger)("recalculate", {
                                type: "jobRequirements",
                                id: id_1,
                                companyId: companyId,
                                userId: userId
                            }),
                            (0, production_1.runMRP)(serviceRole, {
                                type: "job",
                                id: id_1,
                                companyId: companyId,
                                userId: userId
                            }),
                            serviceRole.functions.invoke("schedule", {
                                body: {
                                    jobId: id_1,
                                    companyId: companyId,
                                    userId: userId,
                                    mode: "initial",
                                    direction: "backward"
                                }
                            }),
                            serviceRole
                                .from("job")
                                .update({
                                status: "Ready"
                            })
                                .eq("id", id_1)
                        ])];
                case 5:
                    _w.sent();
                    return [3 /*break*/, 7];
                case 6:
                    if (upsertMethod.error) {
                        console.error(upsertMethod.error);
                    }
                    _w.label = 7;
                case 7:
                    jobId = id_1;
                    redirectUrl = path_1.path.to.job(jobId);
                    return [4 /*yield*/, (0, production_1.getActiveJobOperationByJobId)(client, jobId, companyId)];
                case 8:
                    operation = _w.sent();
                    if (operation && kanban.data.autoRelease) {
                        operationId = operation.id;
                        if (kanban.data.autoStartJob) {
                            setupTime = operation.setupTime;
                            laborTime = operation.laborTime;
                            machineTime = operation.machineTime;
                            type = "Labor";
                            if (machineTime && !laborTime) {
                                type = "Machine";
                            }
                            if (setupTime) {
                                type = "Setup";
                            }
                            redirectUrl = path_1.path.to.external.mesJobOperationStart(operationId, type);
                        }
                        else {
                            redirectUrl = path_1.path.to.external.mesJobOperation(operationId);
                        }
                        return [2 /*return*/, {
                                data: redirectUrl,
                                error: null
                            }];
                    }
                    return [2 /*return*/, {
                            data: redirectUrl,
                            error: null
                        }];
                case 9:
                    if (!(kanban.data.replenishmentSystem === "Buy")) return [3 /*break*/, 15];
                    return [4 /*yield*/, client
                            .from("purchaseOrder")
                            .select("id")
                            .eq("supplierId", kanban.data.supplierId)
                            .in("status", ["Planned", "Draft"])
                            .eq("companyId", companyId)
                            .maybeSingle()];
                case 10:
                    existingPurchaseOrder = _w.sent();
                    purchaseOrderId = (_l = existingPurchaseOrder.data) === null || _l === void 0 ? void 0 : _l.id;
                    if (!!purchaseOrderId) return [3 /*break*/, 12];
                    return [4 /*yield*/, (0, purchasing_1.insertPurchaseOrder)(client, {
                            supplierId: kanban.data.supplierId,
                            status: "Draft",
                            purchaseOrderType: "Purchase",
                            companyId: companyId,
                            companyGroupId: companyGroupId,
                            createdBy: userId
                        })];
                case 11:
                    newPurchaseOrder = _w.sent();
                    if (newPurchaseOrder.error || !newPurchaseOrder.data) {
                        console.error(newPurchaseOrder.error);
                        return [2 /*return*/, {
                                data: null,
                                error: "Failed to create purchase order"
                            }];
                    }
                    purchaseOrderId = newPurchaseOrder.data.id;
                    _w.label = 12;
                case 12: return [4 /*yield*/, Promise.all([
                        client
                            .from("item")
                            .select("name, readableIdWithRevision, type, unitOfMeasureCode, itemCost(unitCost), itemReplenishment(purchasingUnitOfMeasureCode, conversionFactor, leadTime)")
                            .eq("id", kanban.data.itemId)
                            .eq("companyId", companyId)
                            .single(),
                        client
                            .from("supplierPart")
                            .select("*")
                            .eq("itemId", kanban.data.itemId)
                            .eq("companyId", companyId)
                            .eq("supplierId", kanban.data.supplierId)
                            .maybeSingle(),
                        client
                            .from("pickMethod")
                            .select("defaultStorageUnitId")
                            .eq("itemId", kanban.data.itemId)
                            .eq("companyId", companyId)
                            .eq("locationId", kanban.data.locationId)
                            .maybeSingle()
                    ])];
                case 13:
                    _e = _w.sent(), item = _e[0], supplierPart = _e[1], inventory = _e[2];
                    itemCost = (_o = (_m = item === null || item === void 0 ? void 0 : item.data) === null || _m === void 0 ? void 0 : _m.itemCost) === null || _o === void 0 ? void 0 : _o[0];
                    itemReplenishment = (_p = item === null || item === void 0 ? void 0 : item.data) === null || _p === void 0 ? void 0 : _p.itemReplenishment;
                    if (item.error) {
                        console.error(item.error);
                        return [2 /*return*/, {
                                data: null,
                                error: "Failed to get item"
                            }];
                    }
                    return [4 /*yield*/, (0, purchasing_1.upsertPurchaseOrderLine)(client, {
                            purchaseOrderId: purchaseOrderId,
                            purchaseOrderLineType: (_q = item.data) === null || _q === void 0 ? void 0 : _q.type,
                            itemId: kanban.data.itemId,
                            purchaseQuantity: kanban.data.quantity,
                            supplierUnitPrice: (_t = (_s = (_r = supplierPart === null || supplierPart === void 0 ? void 0 : supplierPart.data) === null || _r === void 0 ? void 0 : _r.unitPrice) !== null && _s !== void 0 ? _s : itemCost === null || itemCost === void 0 ? void 0 : itemCost.unitCost) !== null && _t !== void 0 ? _t : 0,
                            supplierShippingCost: 0,
                            supplierTaxAmount: 0,
                            exchangeRate: 1,
                            purchaseUnitOfMeasureCode: kanban.data.purchaseUnitOfMeasureCode,
                            inventoryUnitOfMeasureCode: ((_u = item.data) === null || _u === void 0 ? void 0 : _u.unitOfMeasureCode) || kanban.data.purchaseUnitOfMeasureCode,
                            conversionFactor: kanban.data.conversionFactor ||
                                (itemReplenishment === null || itemReplenishment === void 0 ? void 0 : itemReplenishment.conversionFactor) ||
                                1,
                            locationId: kanban.data.locationId,
                            storageUnitId: kanban.data.storageUnitId ||
                                ((_v = inventory.data) === null || _v === void 0 ? void 0 : _v.defaultStorageUnitId) ||
                                undefined,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 14:
                    createPurchaseOrderLine = _w.sent();
                    if (createPurchaseOrderLine.error) {
                        console.error(createPurchaseOrderLine.error);
                        return [2 /*return*/, {
                                data: null,
                                error: "Failed to create purchase order line"
                            }];
                    }
                    return [2 /*return*/, {
                            data: path_1.path.to.purchaseOrder(purchaseOrderId),
                            error: null
                        }];
                case 15: return [2 /*return*/, {
                        data: null,
                        error: "".concat(kanban.data.replenishmentSystem, " is not supported")
                    }];
            }
        });
    });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, companyGroupId, userId, id;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _d.sent(), client = _c.client, companyId = _c.companyId, companyGroupId = _c.companyGroupId, userId = _c.userId;
                    id = params.id;
                    if (!id)
                        throw (0, auth_1.notFound)("id not found");
                    return [4 /*yield*/, handleKanban({ client: client, companyId: companyId, companyGroupId: companyGroupId, userId: userId, id: id })];
                case 2: return [2 /*return*/, _d.sent()];
            }
        });
    });
}
function KanbanRedirectRoute() {
    var promise = (0, react_router_1.useLoaderData)();
    return (<div className="flex h-screen w-screen items-center justify-center">
      <react_2.Suspense fallback={<react_1.Loading className="size-8" isLoading/>}>
        <react_router_1.Await resolve={promise}>
          {function (resolvedPromise) {
            var _a;
            if (resolvedPromise.error) {
                return <div>{resolvedPromise.error}</div>;
            }
            return <Redirect_1.Redirect path={(_a = resolvedPromise === null || resolvedPromise === void 0 ? void 0 : resolvedPromise.data) !== null && _a !== void 0 ? _a : ""}/>;
        }}
        </react_router_1.Await>
      </react_2.Suspense>
    </div>);
}
