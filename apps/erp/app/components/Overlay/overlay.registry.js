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
Object.defineProperty(exports, "__esModule", { value: true });
exports.overlayRegistry = void 0;
exports.getOverlayRegistryEntry = getOverlayRegistryEntry;
var ConfigParamsTableModal_1 = require("~/modules/production/ui/Jobs/ConfigParamsTableModal");
var renderLazyOverlay_1 = require("./renderLazyOverlay");
exports.overlayRegistry = {
    newMasterWorkOrder: {
        type: "drawer",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var data = ctx.loaderData;
            if (!data)
                return null;
            return { initialValues: data.initialValues };
        }, function () {
            return Promise.resolve().then(function () { return require("~/modules/production/ui/MasterWorkOrders/MasterWorkOrderForm"); });
        })
    },
    newProductionQuantity: {
        type: "drawer",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            var data = ctx.loaderData;
            if (!data)
                return null;
            var seeded = data.seededActor;
            return {
                jobOptions: data.jobOptions,
                jobId: data.jobId,
                lockJobSelection: (_a = data.lockJobSelection) !== null && _a !== void 0 ? _a : false,
                lockOperationSelection: (_b = data.lockOperationSelection) !== null && _b !== void 0 ? _b : false,
                initialValues: {
                    jobOperationId: data.jobOperationId,
                    actorKind: (_d = (_c = seeded === null || seeded === void 0 ? void 0 : seeded.actorKind) !== null && _c !== void 0 ? _c : data.defaultActorKind) !== null && _d !== void 0 ? _d : "employee",
                    employeeId: seeded === null || seeded === void 0 ? void 0 : seeded.employeeId,
                    supplierProcessId: seeded === null || seeded === void 0 ? void 0 : seeded.supplierProcessId,
                    supplierId: seeded === null || seeded === void 0 ? void 0 : seeded.supplierId,
                    notes: "",
                    lines: [
                        {
                            type: "Production",
                            quantity: (_f = (_e = data.remainingByOperationId) === null || _e === void 0 ? void 0 : _e[data.jobOperationId]) !== null && _f !== void 0 ? _f : 0
                        }
                    ]
                },
                remainingByOperationId: (_g = data.remainingByOperationId) !== null && _g !== void 0 ? _g : {},
                operationOptions: (_h = data.operationOptions) !== null && _h !== void 0 ? _h : [],
                configurationParameters: (_j = data.configurationParameters) !== null && _j !== void 0 ? _j : null,
                configReferenceSource: (_k = data.configReferenceSource) !== null && _k !== void 0 ? _k : null,
                itemId: (_l = data.itemId) !== null && _l !== void 0 ? _l : null,
                processId: (_m = data.processId) !== null && _m !== void 0 ? _m : null,
                operationType: (_o = data.operationType) !== null && _o !== void 0 ? _o : null,
                defaultActorKind: (_p = data.defaultActorKind) !== null && _p !== void 0 ? _p : "employee",
                lockActorSelection: (_q = data.lockActorSelection) !== null && _q !== void 0 ? _q : false
            };
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/Jobs/ProductionQuantityForm"); }); })
    },
    newJobProductionQuantity: {
        type: "drawer",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            var data = ctx.loaderData;
            if (!data)
                return null;
            var seeded = data.seededActor;
            return {
                jobId: data.jobId,
                jobOptions: data.jobOption ? [data.jobOption] : undefined,
                initialValues: {
                    jobOperationId: data.jobOperationId,
                    notes: "",
                    employeeId: (_a = seeded === null || seeded === void 0 ? void 0 : seeded.employeeId) !== null && _a !== void 0 ? _a : "",
                    actorKind: (_c = (_b = seeded === null || seeded === void 0 ? void 0 : seeded.actorKind) !== null && _b !== void 0 ? _b : data.defaultActorKind) !== null && _c !== void 0 ? _c : "employee",
                    supplierProcessId: (_d = seeded === null || seeded === void 0 ? void 0 : seeded.supplierProcessId) !== null && _d !== void 0 ? _d : "",
                    supplierId: (_e = seeded === null || seeded === void 0 ? void 0 : seeded.supplierId) !== null && _e !== void 0 ? _e : "",
                    lines: [
                        {
                            type: "Production",
                            quantity: (_g = (_f = data.remainingByOperationId) === null || _f === void 0 ? void 0 : _f[data.jobOperationId]) !== null && _g !== void 0 ? _g : 0
                        }
                    ]
                },
                remainingByOperationId: (_h = data.remainingByOperationId) !== null && _h !== void 0 ? _h : {},
                operationOptions: (_j = data.operationOptions) !== null && _j !== void 0 ? _j : [],
                configurationParameters: (_k = data.configurationParameters) !== null && _k !== void 0 ? _k : null,
                configReferenceSource: (_l = data.configReferenceSource) !== null && _l !== void 0 ? _l : null,
                itemId: (_m = data.itemId) !== null && _m !== void 0 ? _m : null,
                processId: (_o = data.processId) !== null && _o !== void 0 ? _o : null,
                operationType: (_p = data.operationType) !== null && _p !== void 0 ? _p : null,
                defaultActorKind: (_r = (_q = seeded === null || seeded === void 0 ? void 0 : seeded.actorKind) !== null && _q !== void 0 ? _q : data.defaultActorKind) !== null && _r !== void 0 ? _r : "employee",
                lockJobSelection: Boolean(data.jobOption),
                lockActorSelection: (_s = seeded === null || seeded === void 0 ? void 0 : seeded.lockActorSelection) !== null && _s !== void 0 ? _s : false,
                lockOperationSelection: Boolean(data.jobOperationId)
            };
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/Jobs/ProductionQuantityForm"); }); })
    },
    editJobProductionQuantity: {
        type: "drawer",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
            var data = ctx.loaderData;
            if (!data)
                return null;
            var shared = {
                operationOptions: (_a = data.operationOptions) !== null && _a !== void 0 ? _a : [],
                configurationParameters: (_b = data.configurationParameters) !== null && _b !== void 0 ? _b : null,
                configReferenceSource: (_c = data.configReferenceSource) !== null && _c !== void 0 ? _c : null,
                itemId: (_d = data.itemId) !== null && _d !== void 0 ? _d : null,
                processId: (_e = data.processId) !== null && _e !== void 0 ? _e : null,
                operationType: (_f = data.operationType) !== null && _f !== void 0 ? _f : null
            };
            if (data.mode === "supplier-report" && data.supplierReport) {
                var report = data.supplierReport;
                return __assign(__assign({}, shared), { initialValues: {
                        jobOperationId: report.jobOperationId,
                        actorKind: "supplier",
                        supplierProcessId: report.supplierProcessId,
                        supplierId: (_h = (_g = report.supplierProcess) === null || _g === void 0 ? void 0 : _g.supplierId) !== null && _h !== void 0 ? _h : "",
                        notes: (_j = report.notes) !== null && _j !== void 0 ? _j : "",
                        lines: report.activeLines.map(function (line) {
                            var _a, _b, _c;
                            return ({
                                type: line.type,
                                quantity: line.quantity,
                                scrapReasonId: (_a = line.scrapReasonId) !== null && _a !== void 0 ? _a : undefined,
                                notes: (_b = line.notes) !== null && _b !== void 0 ? _b : undefined,
                                configuration: (_c = line.configuration) !== null && _c !== void 0 ? _c : undefined
                            });
                        })
                    }, defaultActorKind: "supplier" });
            }
            if (data.mode === "employee-report" && data.employeeReport) {
                var report = data.employeeReport;
                return __assign(__assign({}, shared), { initialValues: {
                        jobOperationId: report.jobOperationId,
                        actorKind: "employee",
                        employeeId: report.employeeId,
                        notes: (_k = report.notes) !== null && _k !== void 0 ? _k : "",
                        lines: report.activeLines.map(function (line) {
                            var _a, _b, _c;
                            return ({
                                type: line.type,
                                quantity: line.quantity,
                                scrapReasonId: (_a = line.scrapReasonId) !== null && _a !== void 0 ? _a : undefined,
                                notes: (_b = line.notes) !== null && _b !== void 0 ? _b : undefined,
                                configuration: (_c = line.configuration) !== null && _c !== void 0 ? _c : undefined
                            });
                        })
                    }, defaultActorKind: "employee" });
            }
            var pq = data.productionQuantity;
            if (!pq)
                return null;
            var isSupplierLine = data.mode === "supplier-line";
            var supplierProcess = isSupplierLine && pq.supplierProcess
                ? Array.isArray(pq.supplierProcess)
                    ? pq.supplierProcess[0]
                    : pq.supplierProcess
                : undefined;
            return __assign(__assign({}, shared), { initialValues: {
                    id: pq.id,
                    type: (_l = pq.type) !== null && _l !== void 0 ? _l : "Scrap",
                    jobOperationId: (_m = pq.jobOperationId) !== null && _m !== void 0 ? _m : "",
                    quantity: (_o = pq.quantity) !== null && _o !== void 0 ? _o : 0,
                    scrapReasonId: (_p = pq.scrapReasonId) !== null && _p !== void 0 ? _p : "",
                    notes: (_q = pq.notes) !== null && _q !== void 0 ? _q : "",
                    employeeId: isSupplierLine || !pq.employeeId ? "" : ((_r = pq.employeeId) !== null && _r !== void 0 ? _r : ""),
                    actorKind: isSupplierLine
                        ? "supplier"
                        : "employee",
                    supplierProcessId: isSupplierLine
                        ? ((_s = pq.supplierProcessId) !== null && _s !== void 0 ? _s : "")
                        : "",
                    supplierId: isSupplierLine
                        ? ((_t = supplierProcess === null || supplierProcess === void 0 ? void 0 : supplierProcess.supplierId) !== null && _t !== void 0 ? _t : "")
                        : "",
                    configuration: (_u = pq.configuration) !== null && _u !== void 0 ? _u : undefined
                }, defaultActorKind: (isSupplierLine ? "supplier" : "employee") });
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/Jobs/ProductionQuantityForm"); }); })
    },
    newTag: {
        type: "drawer",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a, _b;
            var data = ctx.loaderData;
            if (!data)
                return null;
            var name = ctx.props.name;
            return {
                initialValues: {
                    name: name !== null && name !== void 0 ? name : "",
                    table: (_a = data.table) !== null && _a !== void 0 ? _a : ""
                },
                lockTable: (_b = data.lockTable) !== null && _b !== void 0 ? _b : false
            };
        }, function () { return Promise.resolve().then(function () { return require("~/modules/settings/ui/Tags/TagForm"); }); })
    },
    jobBillOfProcessPreview: {
        type: "modal",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a, _b;
            return (_b = (_a = ctx.loaderData) === null || _a === void 0 ? void 0 : _a.billOfProcess) !== null && _b !== void 0 ? _b : null;
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/Jobs/JobBillOfProcess"); }); })
    },
    jobConfigTable: {
        type: "modal",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a;
            var data = ctx.loaderData;
            if (!((_a = data === null || data === void 0 ? void 0 : data.parameters) === null || _a === void 0 ? void 0 : _a.length))
                return null;
            return {
                parameters: data.parameters,
                initialRows: data.initialRows,
                jobDisplayId: data.jobDisplayId,
                history: data.history,
                optionLabels: data.colorNames
            };
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/Jobs/JobConfigQuantities"); }); })
    },
    itemConfigTable: {
        type: "modal",
        // Read-only view: its only button dismisses (never POSTs). Url-addressable
        // like the rest — config rides props in-app, with a server-fetched fallback
        // for deep links.
        confirmMode: "none",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var _a;
            var data = ctx.loaderData;
            if (!((_a = data === null || data === void 0 ? void 0 : data.parameters) === null || _a === void 0 ? void 0 : _a.length))
                return null;
            // Config comes via props in-app; on a deep link props is empty, so fall
            // back to the row's saved config fetched by the loader.
            var fromProps = ctx.props.configuration;
            var configuration = fromProps !== undefined ? fromProps : data.configuration;
            var _b = (0, ConfigParamsTableModal_1.buildConfigEditorRows)({
                parameters: data.parameters,
                configuration: configuration
            }), initialRows = _b.initialRows, referenceByRowIndex = _b.referenceByRowIndex;
            return {
                parameters: data.parameters,
                initialRows: initialRows,
                referenceByRowIndex: referenceByRowIndex,
                jobDisplayId: data.itemReadableId,
                optionLabels: data.colorNames
            };
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/Jobs/ConfigParamsTableModal"); }); })
    },
    masterWorkOrderBundles: {
        type: "modal",
        // Read-only view of a master work order's bundles; its only button dismisses.
        confirmMode: "none",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var data = ctx.loaderData;
            if (!data)
                return null;
            return {
                bundleWorkOrders: data.bundleWorkOrders,
                count: data.count,
                masterDisplayId: data.masterDisplayId
            };
        }, function () {
            return Promise.resolve().then(function () { return require("~/modules/production/ui/MasterWorkOrders/MasterWorkOrderBundlesOverlay"); });
        })
    },
    masterWorkOrderProcesses: {
        type: "modal",
        confirmMode: "none",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var data = ctx.loaderData;
            if (!data)
                return null;
            return {
                processes: data.processes,
                masterDisplayId: data.masterDisplayId
            };
        }, function () {
            return Promise.resolve().then(function () { return require("~/modules/production/ui/MasterWorkOrders/MasterWorkOrderProcessesOverlay"); });
        })
    },
    bundleWorkOrderProcesses: {
        type: "modal",
        confirmMode: "none",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var data = ctx.loaderData;
            if (!data)
                return null;
            return {
                operations: data.operations,
                count: data.count,
                jobId: data.jobId,
                jobStatus: data.jobStatus,
                bundleDisplayId: data.bundleDisplayId
            };
        }, function () {
            return Promise.resolve().then(function () { return require("~/modules/production/ui/MasterWorkOrders/BundleWorkOrderProcessesOverlay"); });
        })
    },
    masterWorkOrderSplitBatch: {
        type: "modal",
        // The Confirm button POSTs the reviewed split to the route action.
        confirmMode: "server",
        render: (0, renderLazyOverlay_1.renderLazyOverlay)(function (ctx) {
            var data = ctx.loaderData;
            if (!data)
                return null;
            return {
                colorAxis: data.colorAxis,
                sizeAxis: data.sizeAxis,
                cells: data.cells,
                existingBundles: data.existingBundles,
                splitRows: data.splitRows,
                masterDisplayId: data.masterDisplayId
            };
        }, function () { return Promise.resolve().then(function () { return require("~/modules/production/ui/MasterWorkOrders/SplitBatchOverlay"); }); })
    }
};
function getOverlayRegistryEntry(id) {
    return exports.overlayRegistry[id];
}
