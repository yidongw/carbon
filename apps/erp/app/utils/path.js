"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicModelUrl = exports.getPrivateUrl = exports.getParams = exports.requestReferrer = exports.getStoragePath = exports.onboardingSequence = exports.path = exports.ERP_URL = exports.MES_URL = void 0;
var auth_1 = require("@carbon/auth");
var react_router_1 = require("react-router");
var x = "/x"; // from ~/routes/x+ folder
var api = "/api"; // from ~/routes/api+ folder
var file = "/file"; // from ~/routes/file+ folder
var share = "/share"; // from ~/routes/shared+ folder
var onboarding = "/onboarding"; // from ~/routes/onboarding+ folder
var selectCompany = "/select-company"; // from ~/routes/select-company+ folder
exports.MES_URL = (0, auth_1.getMESUrl)();
exports.ERP_URL = (0, auth_1.getAppUrl)();
exports.path = {
    to: {
        api: {
            abilities: "".concat(api, "/resources/abilities"),
            accounts: "".concat(api, "/accounting/accounts"),
            assetClasses: "".concat(api, "/accounting/asset-classes"),
            assign: "".concat(api, "/assign"),
            batchNumbers: function (itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/batch-numbers?itemId=").concat(itemId));
            },
            billOfMaterials: function (methodId, withOperations) {
                if (withOperations === void 0) { withOperations = false; }
                return (0, react_router_1.generatePath)("".concat(api, "/items/methods/").concat(methodId, "/bom?withOperations=").concat(withOperations));
            },
            billOfMaterialsCsv: function (methodId, withOperations) {
                if (withOperations === void 0) { withOperations = false; }
                return (0, react_router_1.generatePath)("".concat(api, "/items/methods/").concat(methodId, "/bom.csv?withOperations=").concat(withOperations));
            },
            chat: "".concat(api, "/ai/chat"),
            countries: "".concat(api, "/countries"),
            currencies: "".concat(api, "/accounting/currencies"),
            customerContacts: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/sales/customer-contacts/").concat(id));
            },
            customerLocations: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/sales/customer-locations/").concat(id));
            },
            customerStatuses: "".concat(api, "/sales/customer-statuses"),
            customerTypes: "".concat(api, "/sales/customer-types"),
            customFieldOptions: function (table, fieldId) {
                return (0, react_router_1.generatePath)("".concat(api, "/settings/custom-fields/").concat(table, "/").concat(fieldId));
            },
            costCenters: "".concat(api, "/accounting/cost-centers"),
            departments: "".concat(api, "/people/departments"),
            timecard: "".concat(api, "/people/timecard"),
            outstandingTrainings: "".concat(api, "/resources/trainings"),
            digitalQuote: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/sales/digital-quote/").concat(id));
            },
            digitalSupplierQuote: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/purchasing/digital-quote/").concat(id));
            },
            docs: "".concat(api, "/docs"),
            employeeTypes: "".concat(api, "/people/employee-types"),
            emptyPermissions: "".concat(api, "/people/empty-permissions"),
            failureModes: "".concat(api, "/resources/failure-modes"),
            gauges: "".concat(api, "/quality/gauges"),
            createCsvLookup: "".concat(api, "/csv/create-lookup"),
            generateCsvColumns: function (table) {
                return (0, react_router_1.generatePath)("".concat(api, "/ai/csv/").concat(table, "/columns"));
            },
            inspectionDocumentBalloonAnalyze: function (inspectionDocumentId) {
                return (0, react_router_1.generatePath)("".concat(api, "/quality/inspection-document/").concat(inspectionDocumentId, "/balloon-analyze"));
            },
            groupsByType: function (type) {
                return (0, react_router_1.generatePath)("".concat(api, "/people/groups?type=").concat(type));
            },
            groupsByTypeWithUsers: function (type) {
                return (0, react_router_1.generatePath)("".concat(api, "/people/groups?type=").concat(type, "&include=users"));
            },
            groupMembers: function (groupId) {
                return (0, react_router_1.generatePath)("".concat(api, "/users/groups/").concat(groupId, "/members"));
            },
            usersSearch: function (q) {
                return (0, react_router_1.generatePath)("".concat(api, "/users/search?q=").concat(encodeURIComponent(q)));
            },
            usersBatch: function (ids) {
                return (0, react_router_1.generatePath)("".concat(api, "/users/batch?ids=").concat(ids.join(",")));
            },
            item: function (type) { return (0, react_router_1.generatePath)("".concat(api, "/item/").concat(type)); },
            itemCostRecalculate: function (itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/").concat(itemId, "/recalculate-cost"));
            },
            itemConfigurable: "".concat(api, "/items/configurable"),
            itemForecast: function (itemId, locationId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/").concat(itemId, "/").concat(locationId, "/forecast"));
            },
            itemPostingGroups: "".concat(api, "/items/groups"),
            jobBillOfMaterials: function (id, withOperations) {
                if (withOperations === void 0) { withOperations = false; }
                return (0, react_router_1.generatePath)("".concat(api, "/production/methods/").concat(id, "/bom?withOperations=").concat(withOperations));
            },
            jobBillOfMaterialsCsv: function (id, withOperations) {
                if (withOperations === void 0) { withOperations = false; }
                return (0, react_router_1.generatePath)("".concat(api, "/production/methods/").concat(id, "/bom.csv?withOperations=").concat(withOperations));
            },
            jobBillOfProcessPreview: function (jobId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/jobs/").concat(jobId, "/bill-of-process"));
            },
            jobConfigTable: function (jobId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/jobs/").concat(jobId, "/config-table"));
            },
            masterWorkOrderBundles: function (masterWorkOrderId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/master-work-orders/").concat(masterWorkOrderId, "/bundles"));
            },
            masterWorkOrderProcesses: function (masterWorkOrderId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/master-work-orders/").concat(masterWorkOrderId, "/processes"));
            },
            masterWorkOrderSplitBatch: function (masterWorkOrderId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/master-work-orders/").concat(masterWorkOrderId, "/split-batch"));
            },
            bundleWorkOrderProcesses: function (bundleWorkOrderId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/bundle-work-orders/").concat(bundleWorkOrderId, "/processes"));
            },
            operationQuantityReports: function (operationId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/operations/").concat(operationId, "/quantity-reports"));
            },
            operationSupplierQuantityReports: function (operationId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/operations/").concat(operationId, "/supplier-quantity-reports"));
            },
            operationSubcontractPricing: function (operationId, supplierProcessId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/operations/").concat(operationId, "/subcontract-pricing?supplierProcessId=").concat(encodeURIComponent(supplierProcessId)));
            },
            quantityReportLines: function (reportId, includeInvalidated) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/quantity-reports/").concat(reportId, "/lines").concat(includeInvalidated ? "?includeInvalidated=true" : ""));
            },
            supplierQuantityReportLines: function (reportId, includeInvalidated) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/supplier-quantity-reports/").concat(reportId, "/lines").concat(includeInvalidated ? "?includeInvalidated=true" : ""));
            },
            supplierQuantityReportCreatePo: function (reportId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/supplier-quantity-reports/").concat(reportId, "/create-po"));
            },
            itemConfigTable: function (itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/").concat(itemId, "/config-table"));
            },
            jobs: "".concat(api, "/production/jobs"),
            kanban: function (id) { return (0, react_router_1.generatePath)("".concat(api, "/kanban/").concat(id)); },
            kanbanCollision: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/kanban/collision/").concat(id));
            },
            kanbanComplete: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/kanban/complete/").concat(id));
            },
            kanbanJobLink: function (id) { return (0, react_router_1.generatePath)("".concat(api, "/kanban/link/").concat(id)); },
            kanbanStart: function (id) { return (0, react_router_1.generatePath)("".concat(api, "/kanban/start/").concat(id)); },
            locations: "".concat(api, "/resources/locations"),
            maintenanceDispatches: "".concat(api, "/resources/maintenance"),
            maintenanceSchedules: "".concat(api, "/resources/scheduled-maintenance"),
            materialDimensions: function (formId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/dimensions/").concat(formId));
            },
            materialFinishes: function (substanceId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/finishes/").concat(substanceId));
            },
            materialForms: "".concat(api, "/items/forms"),
            materials: function (materialFormId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/materials").concat(materialFormId ? "?materialFormId=".concat(materialFormId) : ""));
            },
            materialGrades: function (substanceId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/grades/").concat(substanceId));
            },
            materialTypes: function (substanceId, formId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/types/").concat(substanceId, "/").concat(formId));
            },
            materialSubstances: "".concat(api, "/items/substances"),
            styleColors: "".concat(api, "/items/style-colors"),
            styleSizes: "".concat(api, "/items/style-sizes"),
            messagingNotify: "".concat(api, "/messaging/notify"),
            mrp: function (locationId) {
                return (0, react_router_1.generatePath)("".concat(api, "/mrp").concat(locationId ? "?location=".concat(locationId) : ""));
            },
            modelUpload: "".concat(api, "/model/upload"),
            onShapeBom: function (documentId, versionId, elementId) {
                return (0, react_router_1.generatePath)("".concat(api, "/integrations/onshape/d/").concat(documentId, "/v/").concat(versionId, "/e/").concat(elementId, "/bom"));
            },
            onShapeDocuments: "".concat(api, "/integrations/onshape/documents"),
            onShapeVersions: function (documentId) {
                return (0, react_router_1.generatePath)("".concat(api, "/integrations/onshape/d/").concat(documentId, "/versions"));
            },
            onShapeElements: function (documentId, versionId) {
                return (0, react_router_1.generatePath)("".concat(api, "/integrations/onshape/d/").concat(documentId, "/v/").concat(versionId, "/elements"));
            },
            onShapeSync: "".concat(api, "/integrations/onshape/sync"),
            linearCreateIssue: "".concat(api, "/integrations/linear/issue/create"),
            linearLinkExistingIssue: "".concat(api, "/integrations/linear/issue/link"),
            linearSyncNotes: "".concat(api, "/integrations/linear/issue/sync-notes"),
            jiraCreateIssue: "".concat(api, "/integrations/jira/issue/create"),
            jiraLinkExistingIssue: "".concat(api, "/integrations/jira/issue/link"),
            jiraSyncNotes: "".concat(api, "/integrations/jira/issue/sync-notes"),
            outsideOperations: function (jobId) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/outside-operations/").concat(jobId));
            },
            purchasingKpi: function (key) {
                return (0, react_router_1.generatePath)("".concat(api, "/purchasing/kpi/").concat(key));
            },
            qualityKpi: function (key) { return (0, react_router_1.generatePath)("".concat(api, "/quality/kpi/").concat(key)); },
            procedures: "".concat(api, "/production/procedures"),
            processes: "".concat(api, "/resources/processes"),
            itemRecipeProcesses: function (itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/items/").concat(itemId, "/recipe-processes"));
            },
            productionKpi: function (key) {
                return (0, react_router_1.generatePath)("".concat(api, "/production/kpi/").concat(key));
            },
            quoteBillOfMaterials: function (methodId, withOperations) {
                if (withOperations === void 0) { withOperations = false; }
                return (0, react_router_1.generatePath)("".concat(api, "/sales/quote/line/").concat(methodId, "/bom?withOperations=").concat(withOperations));
            },
            quoteBillOfMaterialsCsv: function (methodId, withOperations) {
                if (withOperations === void 0) { withOperations = false; }
                return (0, react_router_1.generatePath)("".concat(api, "/sales/quote/line/").concat(methodId, "/bom.csv?withOperations=").concat(withOperations));
            },
            quotes: "".concat(api, "/sales/quotes"),
            quoteLines: function (quoteId) {
                return (0, react_router_1.generatePath)("".concat(api, "/sales/quotes/").concat(quoteId, "/lines"));
            },
            rollback: function (table, id) {
                return (0, react_router_1.generatePath)("".concat(api, "/settings/sequence/rollback?table=").concat(table, "&currentSequence=").concat(id));
            },
            resourcesKpi: function (key) {
                return (0, react_router_1.generatePath)("".concat(api, "/resources/kpi/").concat(key));
            },
            salesCustomerOverride: "".concat(api, "/sales/customer-override"),
            salesKpi: function (key) { return (0, react_router_1.generatePath)("".concat(api, "/sales/kpi/").concat(key)); },
            salesResolvePrice: "".concat(api, "/sales/resolve-price"),
            salesOrders: "".concat(api, "/sales/orders"),
            scrapReasons: "".concat(api, "/production/scrap-reasons"),
            search: "".concat(api, "/search"),
            seedQualityDocuments: "".concat(api, "/quality/documents/seed"),
            sequences: function (table) { return "".concat(api, "/settings/sequences?table=").concat(table); },
            serialNumbers: function (itemId, isReadOnly) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/serial-numbers?itemId=").concat(itemId, "&isReadOnly=").concat(isReadOnly));
            },
            services: "".concat(api, "/items/services"),
            shifts: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/people/shifts?location=").concat(id));
            },
            storageUnits: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/storage-units?locationId=").concat(id));
            },
            storageUnitsTree: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/storage-units-tree?locationId=").concat(id));
            },
            storageUnitsWithQuantities: function (locationId, itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/storage-units-with-quantities?locationId=").concat(locationId).concat(itemId ? "&itemId=".concat(itemId) : ""));
            },
            storageTypes: "".concat(api, "/inventory/storage-types"),
            storageUnitDescendants: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/storage-unit-descendants?id=").concat(id));
            },
            storageUnitChildren: function (parentId) {
                return (0, react_router_1.generatePath)("".concat(api, "/inventory/storage-unit-children?parentId=").concat(parentId));
            },
            supplierContacts: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/purchasing/supplier-contacts/").concat(id));
            },
            supplierLocations: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/purchasing/supplier-locations/").concat(id));
            },
            supplierProcesses: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/purchasing/supplier-processes/").concat(id));
            },
            supplierProcessesBySupplier: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/purchasing/supplier-processes-by-supplier/").concat(id));
            },
            supplierTypes: "".concat(api, "/purchasing/supplier-types"),
            tags: function (table) {
                return (0, react_router_1.generatePath)("".concat(api, "/shared/tags?table=").concat(table));
            },
            unitOfMeasures: "".concat(api, "/items/uoms"),
            webhookTables: "".concat(api, "/webhook/tables"),
            webhookStripe: "".concat(api, "/webhook/stripe"),
            workCentersByLocation: function (id) {
                return (0, react_router_1.generatePath)("".concat(api, "/resources/work-centers?location=").concat(id));
            },
            workCenters: "".concat(api, "/resources/work-centers"),
            paymentTerms: "".concat(api, "/accounting/payment-terms"),
            shippingMethods: "".concat(api, "/inventory/shipping-methods"),
            templates: "".concat(api, "/items/templates")
        },
        external: {
            mes: exports.MES_URL,
            mesJobOperationsForJob: function (jobId) {
                return "".concat(exports.MES_URL, "/x/operations?search=").concat(encodeURIComponent(jobId));
            },
            mesJobOperation: function (id) { return "".concat(exports.MES_URL, "/x/operation/").concat(id); },
            mesJobOperationStart: function (id, type) {
                return "".concat(exports.MES_URL, "/x/start/").concat(id, "?type=").concat(type);
            },
            mesJobOperationComplete: function (id) { return "".concat(exports.MES_URL, "/x/end/").concat(id); }
        },
        file: {
            cadModel: function (id) { return (0, react_router_1.generatePath)("".concat(file, "/model/").concat(id)); },
            kanbanLabelsPdf: function (ids, action) {
                var idString = Array.isArray(ids) ? ids.join(",") : ids;
                return (0, react_router_1.generatePath)("".concat(file, "/kanban/labels/").concat(action, ".pdf?ids=").concat(idString));
            },
            kanbanQrCode: function (id, action) {
                return (0, react_router_1.generatePath)("".concat(file, "/kanban/").concat(id, "/").concat(action, ".png"));
            },
            jobTraveler: function (id) { return (0, react_router_1.generatePath)("".concat(file, "/traveler/").concat(id, ".pdf")); },
            jobTravelerByJobId: function (jobId) {
                return (0, react_router_1.generatePath)("".concat(file, "/job/").concat(jobId, "/traveler.pdf"));
            },
            nonConformance: function (id) { return (0, react_router_1.generatePath)("".concat(file, "/issue/").concat(id, ".pdf")); },
            operationLabelsPdf: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, trackedEntityId = _b.trackedEntityId;
                var url = "".concat(file, "/operation/").concat(id, "/labels.pdf");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (trackedEntityId)
                    params.append("trackedEntityId", trackedEntityId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            operationLabelsZpl: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, trackedEntityId = _b.trackedEntityId;
                var url = "".concat(file, "/operation/").concat(id, "/labels.zpl");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (trackedEntityId)
                    params.append("trackedEntityId", trackedEntityId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            preview: function (bucket, path) {
                return (0, react_router_1.generatePath)("".concat(file, "/preview/").concat(bucket, "/").concat(path));
            },
            previewImage: function (bucket, path) {
                return (0, react_router_1.generatePath)("".concat(file, "/preview/image?file=").concat(bucket, "/").concat(path));
            },
            previewFile: function (path) { return (0, react_router_1.generatePath)("".concat(file, "/preview/").concat(path)); },
            purchaseOrder: function (id) {
                return (0, react_router_1.generatePath)("".concat(file, "/purchase-order/").concat(id, ".pdf"));
            },
            receiptLabelsPdf: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, lineId = _b.lineId;
                var url = "".concat(file, "/receipt/").concat(id, "/labels.pdf");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (lineId)
                    params.append("lineId", lineId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            receiptLabelsZpl: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, lineId = _b.lineId;
                var url = "".concat(file, "/receipt/").concat(id, "/labels.zpl");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (lineId)
                    params.append("lineId", lineId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            salesOrder: function (id) { return (0, react_router_1.generatePath)("".concat(file, "/sales-order/").concat(id, ".pdf")); },
            salesInvoice: function (id) {
                return (0, react_router_1.generatePath)("".concat(file, "/sales-invoice/").concat(id, ".pdf"));
            },
            shipment: function (id) { return (0, react_router_1.generatePath)("".concat(file, "/shipment/").concat(id, ".pdf")); },
            shipmentLabelsPdf: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, lineId = _b.lineId;
                var url = "".concat(file, "/shipment/").concat(id, "/labels.pdf");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (lineId)
                    params.append("lineId", lineId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            shipmentLabelsZpl: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, lineId = _b.lineId;
                var url = "".concat(file, "/shipment/").concat(id, "/labels.zpl");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (lineId)
                    params.append("lineId", lineId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            trackedEntityLabelPdf: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize;
                var url = "".concat(file, "/entity/").concat(id, "/labels.pdf");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            trackedEntityLabelZpl: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize;
                var url = "".concat(file, "/entity/").concat(id, "/labels.zpl");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            storageUnitLabelsZpl: function (ids, opts) {
                var idString = Array.isArray(ids) ? ids.join(",") : ids;
                var url = "".concat(file, "/storage-unit/labels.zpl?ids=").concat(idString);
                if (opts === null || opts === void 0 ? void 0 : opts.labelSize)
                    url += "&labelSize=".concat(opts.labelSize);
                return url;
            },
            storageUnitLabelsPdf: function (ids, opts) {
                var idString = Array.isArray(ids) ? ids.join(",") : ids;
                var url = "".concat(file, "/storage-unit/labels.pdf?ids=").concat(idString);
                if (opts === null || opts === void 0 ? void 0 : opts.labelSize)
                    url += "&labelSize=".concat(opts.labelSize);
                return url;
            },
            stockTransfer: function (id) {
                return (0, react_router_1.generatePath)("".concat(file, "/stock-transfer/").concat(id, ".pdf"));
            },
            stockTransferLabelsPdf: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, lineId = _b.lineId;
                var url = "".concat(file, "/stock-transfer/").concat(id, "/labels.pdf");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (lineId)
                    params.append("lineId", lineId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            stockTransferLabelsZpl: function (id, _a) {
                var _b = _a === void 0 ? {} : _a, labelSize = _b.labelSize, lineId = _b.lineId;
                var url = "".concat(file, "/stock-transfer/").concat(id, "/labels.zpl");
                var params = new URLSearchParams();
                if (labelSize)
                    params.append("labelSize", labelSize);
                if (lineId)
                    params.append("lineId", lineId);
                var queryString = params.toString();
                if (queryString)
                    url += "?".concat(queryString);
                return (0, react_router_1.generatePath)(url);
            },
            quote: function (id) { return (0, react_router_1.generatePath)("".concat(file, "/quote/").concat(id, ".pdf")); }
        },
        legal: {
            termsAndConditions: "https://carbon.ms/terms",
            privacyPolicy: "https://carbon.ms/privacy"
        },
        onboarding: {
            company: "".concat(onboarding, "/company"),
            location: "".concat(onboarding, "/location"),
            plan: "".concat(onboarding, "/plan"),
            root: "".concat(onboarding),
            theme: "".concat(onboarding, "/theme"),
            user: "".concat(onboarding, "/user")
        },
        authenticatedRoot: x,
        selectCompany: selectCompany,
        acknowledge: "".concat(x, "/acknowledge"),
        approvalRules: "".concat(x, "/settings/approval-rules"),
        approvalRule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/approval-rules/").concat(id));
        },
        newApprovalRule: function (documentType) {
            return documentType
                ? "".concat(x, "/settings/approval-rules/new?type=").concat(documentType)
                : "".concat(x, "/settings/approval-rules/new");
        },
        deleteApprovalRule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/approval-rules/").concat(id, "/delete"));
        },
        abilities: "".concat(x, "/resources/abilities"),
        ability: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/resources/ability/").concat(id)); },
        account: "".concat(x, "/account"),
        accountPersonal: "".concat(x, "/account/personal"),
        accountPassword: "".concat(x, "/account/password"),
        accounting: "".concat(x, "/accounting"),
        accountingDefaults: "".concat(x, "/accounting/defaults"),
        accountingJournals: "".concat(x, "/accounting/journals"),
        accountingSettings: "".concat(x, "/settings/accounting"),
        journalEntry: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/journal-entry/").concat(id)); },
        journalEntryDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/journal-entry/").concat(id, "/details"));
        },
        newJournalEntry: "".concat(x, "/accounting/journals/new"),
        postJournalEntry: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/journal-entry/").concat(id, "/post"));
        },
        reverseJournalEntry: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/journal-entry/").concat(id, "/reverse"));
        },
        journalLineDimensions: function (lineId) {
            return "/api/accounting/journal-line-dimensions/".concat(lineId);
        },
        accountingGroupsBankAccounts: "".concat(x, "/accounting/groups/bank-accounts"),
        accountingGroupsFixedAssets: "".concat(x, "/accounting/groups/fixed-assets"),
        accountingGroupsInventory: "".concat(x, "/accounting/groups/inventory"),
        accountingGroupsPurchasing: "".concat(x, "/accounting/groups/purchasing"),
        accountingGroupsSales: "".concat(x, "/accounting/groups/sales"),
        accountingRoot: "".concat(x, "/accounting"),
        fixedAssets: "".concat(x, "/accounting/fixed-assets"),
        fixedAsset: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id)); },
        fixedAssetDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id, "/details"));
        },
        fixedAssetDispose: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id, "/dispose"));
        },
        fixedAssetRegister: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id, "/register"));
        },
        fixedAssetPurchase: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id, "/purchase"));
        },
        fixedAssetSell: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id, "/sell")); },
        newFixedAsset: "".concat(x, "/accounting/fixed-assets/new"),
        deleteFixedAsset: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/fixed-asset/").concat(id, "/delete"));
        },
        assetClasses: "".concat(x, "/accounting/asset-classes"),
        assetClass: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/asset-class/").concat(id));
        },
        newAssetClass: "".concat(x, "/accounting/asset-classes/new"),
        deleteAssetClass: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/asset-class/").concat(id, "/delete"));
        },
        depreciationRuns: "".concat(x, "/accounting/depreciation-runs"),
        depreciationRun: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/depreciation-run/").concat(id));
        },
        newDepreciationRun: "".concat(x, "/accounting/depreciation-runs/new"),
        deleteDepreciationRun: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/depreciation-run/").concat(id, "/delete"));
        },
        repeatDepreciationRun: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/depreciation-run/").concat(id, "/repeat"));
        },
        fixedAssetImport: "".concat(x, "/accounting/fixed-asset-import"),
        intercompany: "".concat(x, "/accounting/intercompany"),
        newIntercompanyTransaction: "".concat(x, "/accounting/intercompany/new"),
        activeMethodVersion: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/versions/activate/").concat(id));
        },
        activateGauge: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/gauges/activate/").concat(id));
        },
        attribute: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/attribute/").concat(id)); },
        attributes: "".concat(x, "/people/attributes"),
        apiIntroduction: "/docs/api/js/intro",
        apiIntro: function (lang) { return (0, react_router_1.generatePath)("/docs/api/".concat(lang, "/intro/")); },
        apiTable: function (lang, table) {
            return (0, react_router_1.generatePath)("/docs/api/".concat(lang, "/table/").concat(table));
        },
        apiKey: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/settings/api-keys/").concat(id)); },
        apiKeys: "".concat(x, "/settings/api-keys"),
        attributeCategory: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/attributes/").concat(id));
        },
        attributeCategoryList: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/attributes/list/").concat(id));
        },
        auditLog: "".concat(x, "/settings/audit-logs"),
        auditLogDetails: "".concat(x, "/settings/audit-logs/details"),
        batchProperty: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/batch-property/").concat(itemId, "/property"));
        },
        batchPropertyOrder: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/batch-property/").concat(itemId, "/property/order"));
        },
        billing: "".concat(x, "/settings/billing"),
        bulkEditPermissions: "".concat(x, "/people/bulk-edit-permissions"),
        bulkUpdateItems: "".concat(x, "/items/update"),
        bulkUpdateCustomer: "".concat(x, "/customer/update"),
        bulkUpdateSupplier: "".concat(x, "/supplier/update"),
        bulkUpdateWorkCenter: "".concat(x, "/work-center/update"),
        bulkUpdateProcess: "".concat(x, "/process/update"),
        bulkUpdateGauge: "".concat(x, "/gauge/update"),
        bulkUpdatePaymentTerm: "".concat(x, "/payment-term/update"),
        bulkUpdateEmployee: "".concat(x, "/people/employees/update"),
        bulkUpdateProductionPlanning: "".concat(x, "/production/planning/update"),
        bulkUpdatePurchasingPlanning: "".concat(x, "/purchasing/planning/update"),
        bulkUpdateProcedure: "".concat(x, "/procedure/update"),
        bulkUpdateJob: "".concat(x, "/job/update"),
        bulkUpdateIssue: "".concat(x, "/issue/update"),
        updateIssueItem: "".concat(x, "/issue/item/update"),
        splitIssueItem: "".concat(x, "/issue/item/split"),
        assignIssueItemEntities: "".concat(x, "/issue/item/assign-entities"),
        issueActionTasksOrder: "".concat(x, "/issue/action-tasks/order"),
        bulkUpdateIssueWorkflow: "".concat(x, "/issue-workflow/update"),
        bulkUpdatePurchaseOrder: "".concat(x, "/purchase-order/update"),
        bulkUpdatePurchasingRfq: "".concat(x, "/purchasing-rfq/update"),
        bulkUpdatePurchaseInvoice: "".concat(x, "/purchase-invoice/update"),
        bulkUpdateQuote: "".concat(x, "/quote/update"),
        bulkUpdateQualityDocument: "".concat(x, "/quality-document/update"),
        bulkUpdateReceiptLine: "".concat(x, "/receipt/lines/update"),
        bulkUpdateSalesInvoice: "".concat(x, "/sales-invoice/update"),
        bulkUpdateSalesOrder: "".concat(x, "/sales-order/update"),
        bulkUpdateSalesRfq: "".concat(x, "/sales-rfq/update"),
        bulkUpdateShipmentLine: "".concat(x, "/shipment/lines/update"),
        bulkUpdateStockTransferLine: "".concat(x, "/stock-transfer/lines/update"),
        bulkUpdateSupplierQuote: "".concat(x, "/supplier-quote/update"),
        bulkUpdateTraining: "".concat(x, "/training/update"),
        calibrations: "".concat(x, "/quality/calibrations"),
        chartOfAccount: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/charts/").concat(id));
        },
        chartOfAccounts: "".concat(x, "/accounting/charts"),
        moveChartOfAccount: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/charts/move/").concat(id));
        },
        costCenter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/cost-centers/").concat(id));
        },
        costCenters: "".concat(x, "/accounting/cost-centers"),
        trialBalance: "".concat(x, "/accounting/trial-balance"),
        balanceSheet: "".concat(x, "/accounting/balance-sheet"),
        incomeStatement: "".concat(x, "/accounting/income-statement"),
        company: "".concat(x, "/settings/company"),
        companySwitch: function (companyId) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/company/switch/").concat(companyId));
        },
        companies: "".concat(x, "/settings/companies"),
        completeTrainingAssignment: function (id) {
            return (0, react_router_1.generatePath)("".concat(share, "/training/").concat(id));
        },
        configurationParameter: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/parameter"));
        },
        configurationParameterGroup: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/parameter/group"));
        },
        configurationParameterGroupOrder: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/parameter/group/order"));
        },
        configurationParameterOrder: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/parameter/order"));
        },
        configurationRule: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/rule"));
        },
        contractor: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/contractors/").concat(id));
        },
        contractors: "".concat(x, "/resources/contractors"),
        consumable: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id)); },
        consumables: "".concat(x, "/items/consumables"),
        consumableCosting: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/costing"));
        },
        consumableDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/details"));
        },
        consumableInventory: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/inventory"));
        },
        consumableInventoryLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/inventory?location=").concat(locationId));
        },
        consumablePlanning: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/planning"));
        },
        consumablePlanningLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/planning?location=").concat(locationId));
        },
        consumablePurchasing: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/purchasing"));
        },
        consumableQuality: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/quality"));
        },
        consumableRoot: "".concat(x, "/consumable"),
        consumableSupplier: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(itemId, "/purchasing/").concat(id));
        },
        consumableSuppliers: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/suppliers"));
        },
        convertQuoteToOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/convert"));
        },
        convertSupplierQuoteToOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/convert"));
        },
        exchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/exchange-rates/").concat(id));
        },
        exchangeRates: "".concat(x, "/accounting/exchange-rates"),
        dimension: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/accounting/dimensions/").concat(id)); },
        dimensions: "".concat(x, "/accounting/dimensions"),
        customer: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id)); },
        customerDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/details"));
        },
        customerRoot: "".concat(x, "/customer"),
        customers: "".concat(x, "/sales/customers"),
        customerAccounts: "".concat(x, "/people/customers"),
        customerAccounting: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/accounting"));
        },
        customerContact: function (customerId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(customerId, "/contacts/").concat(id));
        },
        customerContacts: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/contacts"));
        },
        customerLocation: function (customerId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(customerId, "/locations/").concat(id));
        },
        customerLocations: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/locations"));
        },
        customerPart: function (id, customerPartToItemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/sales/customer-parts/").concat(customerPartToItemId));
        },
        customerPayment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/payments"));
        },
        customerPortals: "".concat(x, "/sales/customer-portals"),
        customerPortal: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/customer-portals/").concat(id));
        },
        customerShipping: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/shipping"));
        },
        customerTax: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/tax")); },
        customerRisks: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/risks")); },
        customerStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/customer-statuses/").concat(id));
        },
        customerStatuses: "".concat(x, "/sales/customer-statuses"),
        customerType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/customer-types/").concat(id));
        },
        customerTypes: "".concat(x, "/sales/customer-types"),
        customField: function (tableId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/custom-fields/").concat(tableId, "/").concat(id));
        },
        customFields: "".concat(x, "/settings/custom-fields"),
        customFieldsTable: function (table) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/custom-fields/").concat(table));
        },
        customFieldList: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/custom-fields/").concat(id));
        },
        deactivateUsers: "".concat(x, "/people/deactivate"),
        defaultRevision: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/revisions/default/").concat(id));
        },
        deleteAbility: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/abilities/delete/").concat(id));
        },
        deleteAccountingCharts: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/charts/delete/").concat(id));
        },
        deleteCostCenter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/cost-centers/delete/").concat(id));
        },
        deleteApiKey: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/api-keys/delete/").concat(id));
        },
        deleteAttribute: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/attribute/delete/").concat(id));
        },
        deleteAttributeCategory: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/attributes/delete/").concat(id));
        },
        deleteBatchProperty: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/batch-property/").concat(itemId, "/property/delete/").concat(id));
        },
        deleteCompany: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/companies/delete/").concat(id));
        },
        deleteConfigurationParameter: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/parameter/delete/").concat(id));
        },
        deleteConfigurationParameterGroup: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/parameter/group/delete/").concat(id));
        },
        deleteConfigurationRule: function (itemId, field) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/rule/delete/").concat(field));
        },
        deleteContractor: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/contractors/delete/").concat(id));
        },
        deleteExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/exchange-rates/delete/").concat(id));
        },
        deleteDimension: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/dimensions/delete/").concat(id));
        },
        deleteCustomer: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/delete")); },
        deleteCustomerContact: function (customerId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(customerId, "/contacts/delete/").concat(id));
        },
        deleteCustomerLocation: function (customerId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(customerId, "/locations/delete/").concat(id));
        },
        deleteCustomerPart: function (id, customerPartToItemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/sales/customer-parts/delete/").concat(customerPartToItemId));
        },
        deleteCustomerStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/customer-statuses/delete/").concat(id));
        },
        deleteCustomerType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/customer-types/delete/").concat(id));
        },
        deleteCustomField: function (tableId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/custom-fields/").concat(tableId, "/delete/").concat(id));
        },
        deleteDepartment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/departments/delete/").concat(id));
        },
        deleteDocument: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/documents/").concat(id, "/trash")); },
        deleteDocumentPermanently: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/documents/").concat(id, "/delete"));
        },
        deleteEmployeeAbility: function (abilityId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/ability/").concat(abilityId, "/employee/delete/").concat(id));
        },
        deleteEmployeeType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/employee-types/delete/").concat(id));
        },
        deleteFailureMode: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/failure-modes/delete/").concat(id));
        },
        deleteGauge: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/gauges/delete/").concat(id));
        },
        deleteGaugeCalibrationRecord: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/calibrations/delete/").concat(id));
        },
        deleteGaugeType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/gauge-types/delete/").concat(id));
        },
        deleteGroup: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/groups/delete/").concat(id));
        },
        deleteHoliday: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/holidays/delete/").concat(id));
        },
        deleteTimecard: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/timecard/delete/").concat(id));
        },
        deleteLocation: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/locations/delete/").concat(id));
        },
        deleteItem: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/delete/").concat(id)); },
        deleteItemPostingGroup: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/groups/delete/").concat(id));
        },
        deleteJournalEntry: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/journal-entry/").concat(id, "/delete"));
        },
        deleteJob: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/delete")); },
        deleteJobMaterial: function (jobId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/material/delete/").concat(id));
        },
        deleteJobOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/step/delete/").concat(id));
        },
        deleteJobOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/parameter/delete/").concat(id));
        },
        deleteJobOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/tool/delete/").concat(id));
        },
        deleteMaterialDimension: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/dimensions/delete/").concat(id));
        },
        deleteMaterialFinish: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/finishes/delete/").concat(id));
        },
        deleteStyleColor: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/colors/delete/").concat(id));
        },
        deleteStyleSize: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/sizes/delete/").concat(id));
        },
        deleteMaterialForm: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/forms/delete/").concat(id));
        },
        deleteMaterialGrade: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/grades/delete/").concat(id));
        },
        deleteMaterialType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/types/delete/").concat(id));
        },
        deleteMaterialSubstance: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/substances/delete/").concat(id));
        },
        deleteMethodMaterial: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/material/delete/").concat(id));
        },
        deleteMethodOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/step/delete/").concat(id));
        },
        deleteMethodOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/parameter/delete/").concat(id));
        },
        deleteMethodOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/tool/delete/").concat(id));
        },
        deleteIssue: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/delete/").concat(id)); },
        deleteIssueAssociation: function (id, type, associationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/association/delete/").concat(type, "/").concat(associationId));
        },
        deleteIssueWorkflow: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue-workflow/delete/").concat(id));
        },
        deleteInvestigationType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/investigation-types/delete/").concat(id));
        },
        deleteRequiredAction: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/required-actions/delete/").concat(id));
        },
        deleteRisk: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quality/risks/delete/").concat(id)); },
        deleteIssueType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/issue-types/delete/").concat(id));
        },
        deleteKanban: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/kanbans/delete/").concat(id));
        },
        deleteMaintenanceDispatch: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/maintenance/delete/").concat(id));
        },
        deleteMaintenanceSchedule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/scheduled-maintenance/delete/").concat(id));
        },
        deleteNoQuoteReason: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/no-quote-reasons/delete/").concat(id));
        },
        deleteCustomerPortal: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/customer-portals/delete/").concat(id));
        },
        deleteNote: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/shared/notes/").concat(id, "/delete")); },
        deletePartner: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/partners/delete/").concat(id));
        },
        deletePaymentTerm: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/payment-terms/delete/").concat(id));
        },
        deleteStockTransfer: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/delete/").concat(id));
        },
        deleteStockTransferLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/line/").concat(lineId, "/delete"));
        },
        deleteProcedure: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/delete/").concat(id));
        },
        deleteProcedureStep: function (id, stepId) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/steps/delete/").concat(stepId));
        },
        deleteProcedureParameter: function (id, parameterId) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/parameters/delete/").concat(parameterId));
        },
        deleteProcess: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/processes/delete/").concat(id));
        },
        deleteProductionEvent: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/event/delete/").concat(id));
        },
        deleteProductionQuantity: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/quantity/delete/").concat(id));
        },
        deleteProductionQuantityReport: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/quantity-report/delete/").concat(id));
        },
        deleteDemandProjections: function (itemId, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/projections/delete/").concat(itemId, "/").concat(locationId));
        },
        deletePurchaseInvoice: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/delete"));
        },
        deletePurchaseInvoiceLine: function (invoiceId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(invoiceId, "/").concat(lineId, "/delete"));
        },
        deletePurchaseOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/delete"));
        },
        deletePurchaseOrderLine: function (orderId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(orderId, "/").concat(lineId, "/delete"));
        },
        deleteQualityDocument: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality-document/delete/").concat(id));
        },
        deleteQualityDocumentStep: function (id, stepId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality-document/").concat(id, "/steps/delete/").concat(stepId));
        },
        deleteQuote: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/delete")); },
        deleteQuoteLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/").concat(lineId, "/delete"));
        },
        deleteQuoteLineCost: function (quoteId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(lineId, "/cost/delete"));
        },
        deleteQuoteMaterial: function (quoteId, lineId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/").concat(quoteId, "/").concat(lineId, "/material/delete/").concat(id));
        },
        deleteQuoteOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/step/delete/").concat(id));
        },
        deleteQuoteOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/parameter/delete/").concat(id));
        },
        deleteQuoteOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/tool/delete/").concat(id));
        },
        deleteReceipt: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id, "/delete")); },
        deleteSalesInvoice: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/delete"));
        },
        deleteSalesInvoiceLine: function (invoiceId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(invoiceId, "/").concat(lineId, "/delete"));
        },
        deleteSalesOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/delete"));
        },
        deleteSalesOrderLine: function (orderId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(orderId, "/").concat(lineId, "/delete"));
        },
        deleteSalesRfq: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/delete")); },
        deleteSalesRfqLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/").concat(lineId, "/delete"));
        },
        deleteSavedView: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/shared/views/delete/").concat(id));
        },
        deleteScrapReason: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/scrap-reasons/delete/").concat(id));
        },
        deleteJobRule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/job-rules/delete/").concat(id));
        },
        deleteShift: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/shifts/delete/").concat(id));
        },
        deleteShipment: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/shipment/").concat(id, "/delete")); },
        deleteStorageUnit: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/storage-units/delete/").concat(id));
        },
        deleteStorageType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/storage-types/delete/").concat(id));
        },
        deleteShippingMethod: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/shipping-methods/delete/").concat(id));
        },
        deleteSupplier: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/delete")); },
        deleteSupplierContact: function (supplierId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/contacts/delete/").concat(id));
        },
        deleteSupplierLocation: function (supplierId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/locations/delete/").concat(id));
        },
        deleteSupplierProcess: function (supplierId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/processes/delete/").concat(id));
        },
        deleteSupplierQuote: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/delete"));
        },
        deleteSupplierQuoteLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/").concat(lineId, "/delete"));
        },
        deleteSupplierType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing/supplier-types/delete/").concat(id));
        },
        deleteSuggestion: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/suggestions/delete/").concat(id));
        },
        deleteTraining: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/training/delete/").concat(id)); },
        deleteTrainingAssignment: function (assignmentId) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/assignments/assignment/").concat(assignmentId, "/delete"));
        },
        deleteTrainingQuestion: function (id, questionId) {
            return (0, react_router_1.generatePath)("".concat(x, "/training/").concat(id, "/questions/delete/").concat(questionId));
        },
        deleteUom: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/uom/delete/").concat(id)); },
        deleteUserAttribute: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/account/").concat(id, "/delete/attribute"));
        },
        deleteWebhook: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/webhooks/delete/").concat(id));
        },
        deleteWarehouseTransfer: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(id, "/delete"));
        },
        deleteWorkCenter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/work-centers/delete/").concat(id));
        },
        demandProjection: function (itemId, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/projections/").concat(itemId, "/").concat(locationId));
        },
        demandProjections: "".concat(x, "/production/projections"),
        department: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/departments/").concat(id)); },
        departments: "".concat(x, "/people/departments"),
        document: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/documents/search/").concat(id)); },
        documentView: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/documents/search/view/").concat(id));
        },
        documents: "".concat(x, "/documents/search"),
        documentFavorite: "".concat(x, "/documents/favorite"),
        documentRestore: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/documents/").concat(id, "/restore"));
        },
        documentsTrash: "".concat(x, "/documents/search?q=trash"),
        employeeAbility: function (abilityId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/ability/").concat(abilityId, "/employee/").concat(id));
        },
        employeeAccount: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/employees/").concat(id));
        },
        employeeAccounts: "".concat(x, "/people/permissions"),
        permissions: "".concat(x, "/people/permissions"),
        employeeType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/employee-types/").concat(id));
        },
        employeeTypes: "".concat(x, "/people/employee-types"),
        peopleInviteLinks: "".concat(x, "/people/invite-links"),
        peopleApplications: "".concat(x, "/people/applications"),
        operators: "".concat(x, "/people/operators"),
        operator: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/operators/").concat(id)); },
        operatorResetPin: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/operators/reset-pin/").concat(id));
        },
        externalCustomer: function (id) { return (0, react_router_1.generatePath)("/share/customer/".concat(id)); },
        externalCustomerFile: function (id, path) {
            return (0, react_router_1.generatePath)("/share/customer/".concat(id, "/").concat(path));
        },
        externalQuote: function (id) { return (0, react_router_1.generatePath)("/share/quote/".concat(id)); },
        externalSupplierQuote: function (id) {
            return (0, react_router_1.generatePath)("/share/supplier-quote/".concat(id));
        },
        externalScar: function (id) { return (0, react_router_1.generatePath)("/share/scar/".concat(id)); },
        externalTraining: function (assignmentId) {
            return (0, react_router_1.generatePath)("/share/training/".concat(assignmentId));
        },
        feedback: "".concat(x, "/feedback"),
        failureMode: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/failure-modes/").concat(id));
        },
        failureModes: "".concat(x, "/resources/failure-modes"),
        fiscalYears: "".concat(x, "/accounting/years"),
        inspectionDocument: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/inspection/").concat(id)); },
        inspectionDocuments: "".concat(x, "/quality/inspection"),
        deleteInspectionDocument: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inspection/").concat(id, "/delete"));
        },
        newInspectionDocument: "".concat(x, "/quality/inspection/new"),
        saveInspectionDocument: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inspection/").concat(id, "/save"));
        },
        updateInspectionDocumentName: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inspection/").concat(id, "/update-name"));
        },
        gauge: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quality/gauges/").concat(id)); },
        gauges: "".concat(x, "/quality/gauges"),
        gaugeCalibrationRecord: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/calibrations/").concat(id));
        },
        gaugeCalibrationRecords: "".concat(x, "/quality/calibrations"),
        gaugeDeactivate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/gauges/deactivate/").concat(id));
        },
        gaugeTypes: "".concat(x, "/quality/gauge-types"),
        gaugeType: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quality/gauge-types/").concat(id)); },
        group: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/groups/").concat(id)); },
        groups: "".concat(x, "/people/groups"),
        holiday: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/holidays/").concat(id)); },
        holidays: "".concat(x, "/people/holidays"),
        import: function (tableId) { return (0, react_router_1.generatePath)("".concat(x, "/shared/import/").concat(tableId)); },
        integration: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/integrations/").concat(id));
        },
        integrationDeactivate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/integrations/deactivate/").concat(id));
        },
        integrations: "".concat(x, "/settings/integrations"),
        inventory: "".concat(x, "/inventory"),
        inventoryQuantities: "".concat(x, "/inventory/quantities"),
        inventoryItem: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/quantities/").concat(id, "/details"));
        },
        inventoryItemActivity: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/quantities/").concat(id, "/activity"));
        },
        inventoryItemAdjustment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/quantities/").concat(id, "/adjustment"));
        },
        inventoryRoot: "".concat(x, "/inventory"),
        inventorySettings: "".concat(x, "/settings/inventory"),
        invoicing: "".concat(x, "/invoicing"),
        issues: "".concat(x, "/quality/issues"),
        issue: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id)); },
        issueDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/details")); },
        issueStatus: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/status")); },
        closeIssue: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/close")); },
        issueActions: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id)); },
        issueDispositions: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/dispositions"));
        },
        issueTaskStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue/task/").concat(id, "/status"));
        },
        issueTaskSupplier: "".concat(x, "/issue/task/supplier"),
        issueActionDueDate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue/action/").concat(id, "/due-date"));
        },
        issueActionProcesses: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue/action/").concat(id, "/processes"));
        },
        issueReview: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/review")); },
        issueWorkflow: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/issue-workflow/").concat(id)); },
        issueWorkflows: "".concat(x, "/quality/issue-workflows"),
        investigationType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/investigation-types/").concat(id));
        },
        investigationTypes: "".concat(x, "/quality/investigation-types"),
        issueType: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quality/issue-types/").concat(id)); },
        issueTypes: "".concat(x, "/quality/issue-types"),
        items: "".concat(x, "/items"),
        itemCostUpdate: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/cost/").concat(id)); },
        itemPostingGroup: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/groups/").concat(id)); },
        itemPostingGroups: "".concat(x, "/items/groups"),
        itemsSettings: "".concat(x, "/settings/items"),
        job: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id)); },
        jobBatchNumber: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/batch")); },
        jobComplete: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/complete")); },
        jobConfigure: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/configure")); },
        jobDag: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/dag")); },
        jobDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/details")); },
        jobInspectionSteps: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/steps?filter=type:eq:Inspection"));
        },
        jobMaterial: function (jobId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/material/").concat(id));
        },
        jobMaterials: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/materials")); },
        jobMethod: function (jobId, methodId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(jobId, "/method/").concat(methodId));
        },
        jobMakeMethod: function (jobId, makeMethodId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(jobId, "/make/").concat(makeMethodId));
        },
        jobMaterialsOrder: "".concat(x, "/job/methods/material/order"),
        jobMethodGet: "".concat(x, "/job/methods/get"),
        jobMethodSave: "".concat(x, "/job/methods/save"),
        jobOperation: function (jobId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/operation/").concat(id));
        },
        jobOperations: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/operations")); },
        jobOperationsOrder: function (jobId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/operation/order"));
        },
        jobOperationsDelete: function (jobId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/operation/delete"));
        },
        jobOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/step/").concat(id));
        },
        jobOperationStepOrder: function (operationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/").concat(operationId, "/step/order"));
        },
        jobOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/parameter/").concat(id));
        },
        jobOperationProcedureSync: "".concat(x, "/job/methods/operation/procedure/sync"),
        jobOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/operation/tool/").concat(id));
        },
        jobOperationDueDate: "".concat(x, "/job/methods/operation/due-date"),
        jobOperationStatus: "".concat(x, "/job/methods/operation/status"),
        jobOperationStepRecords: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/steps"));
        },
        jobProductionEvent: function (jobId, eventId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(jobId, "/events/").concat(eventId));
        },
        jobProductionEvents: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/events")); },
        jobProductionQuantities: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/quantities"));
        },
        jobProductionQuantity: function (jobId, quantityId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(jobId, "/quantities/").concat(quantityId));
        },
        newJobProductionQuantity: function (jobId, opts) {
            var base = (0, react_router_1.generatePath)("".concat(x, "/job/").concat(jobId, "/quantities/new"));
            var opId = opts === null || opts === void 0 ? void 0 : opts.jobOperationId;
            if (!opId)
                return base;
            return "".concat(base, "?").concat(new URLSearchParams({ jobOperationId: opId }).toString());
        },
        jobs: "".concat(x, "/production/jobs"),
        masterWorkOrders: "".concat(x, "/production/master-work-orders"),
        masterWorkOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/master-work-order/").concat(id));
        },
        masterWorkOrderProcesses: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/master-work-order/").concat(id, "/processes"));
        },
        masterWorkOrderQuantities: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/master-work-order/").concat(id, "/quantities"));
        },
        masterWorkOrderMaterials: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/master-work-order/").concat(id, "/materials"));
        },
        masterWorkOrderBundleWorkOrders: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/master-work-order/").concat(id, "/bundle-work-orders"));
        },
        newMasterWorkOrder: "".concat(x, "/production/master-work-orders/new"),
        bundleWorkOrders: "".concat(x, "/production/bundle-work-orders"),
        bundleWorkOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/bundle-work-order/").concat(id));
        },
        bundleWorkOrderProcesses: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/bundle-work-order/").concat(id, "/processes"));
        },
        bundleWorkOrderQuantities: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/bundle-work-order/").concat(id, "/quantities"));
        },
        jobRecalculate: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/recalculate")); },
        jobRelease: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/release")); },
        jobStatus: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id, "/status")); },
        kanban: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/inventory/kanbans/").concat(id)); },
        kanbans: "".concat(x, "/inventory/kanbans"),
        documentTemplates: "".concat(x, "/templates"),
        documentSections: "".concat(x, "/templates/shared"),
        documentTemplate: function (type) { return (0, react_router_1.generatePath)("".concat(x, "/templates/").concat(type)); },
        manualPrint: "".concat(x, "/print"),
        location: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/resources/locations/").concat(id)); },
        locations: "".concat(x, "/resources/locations"),
        login: "/login",
        joinLink: function (code) { return (0, react_router_1.generatePath)("/join/".concat(code)); },
        joinLinkLink: function (code) { return (0, react_router_1.generatePath)("/join/".concat(code, "/link")); },
        joinLinkApply: function (code) { return (0, react_router_1.generatePath)("/join/".concat(code, "/apply")); },
        joinLinkSubmitted: function (code) {
            return (0, react_router_1.generatePath)("/join/".concat(code, "/submitted"));
        },
        logout: "/logout",
        logos: "".concat(x, "/settings/logos"),
        maintenanceDispatch: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(id)); },
        maintenanceDispatchComments: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(id, "/comments"));
        },
        maintenanceDispatchEvents: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(id, "/events"));
        },
        maintenanceDispatchItems: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(id, "/items"));
        },
        maintenanceDispatchStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(id, "/status"));
        },
        maintenanceDispatchUpdate: "".concat(x, "/maintenance/update"),
        maintenanceDispatchWorkCenters: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(id, "/work-centers"));
        },
        newMaintenanceDispatchItem: function (dispatchId) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(dispatchId, "/item/new"));
        },
        deleteMaintenanceDispatchItem: function (dispatchId, itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(dispatchId, "/item/").concat(itemId, "/delete"));
        },
        newMaintenanceDispatchEvent: function (dispatchId) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(dispatchId, "/event/new"));
        },
        editMaintenanceDispatchEvent: function (dispatchId, eventId) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(dispatchId, "/event/").concat(eventId));
        },
        deleteMaintenanceDispatchEvent: function (dispatchId, eventId) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(dispatchId, "/event/").concat(eventId, "/delete"));
        },
        addAndIssueMaintenanceDispatchItem: function (dispatchId) {
            return (0, react_router_1.generatePath)("".concat(x, "/maintenance/").concat(dispatchId, "/add-and-issue"));
        },
        maintenanceDispatches: "".concat(x, "/resources/maintenance"),
        maintenanceSchedule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/scheduled-maintenance/").concat(id));
        },
        maintenanceSchedules: "".concat(x, "/resources/scheduled-maintenance"),
        makeMethodGet: "".concat(x, "/items/methods/get"),
        makeMethodSave: "".concat(x, "/items/methods/save"),
        markTrainingComplete: "".concat(x, "/resources/assignments/complete"),
        material: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id)); },
        materialCosting: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/costing"));
        },
        materialDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/details"));
        },
        materialDimension: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/dimensions/").concat(id));
        },
        materialDimensions: "".concat(x, "/items/dimensions"),
        materialFinish: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/finishes/").concat(id)); },
        materialFinishes: "".concat(x, "/items/finishes"),
        styleColor: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/colors/").concat(id)); },
        styleColors: "".concat(x, "/items/colors"),
        styleSize: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/sizes/").concat(id)); },
        styleSizes: "".concat(x, "/items/sizes"),
        materialForm: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/forms/").concat(id)); },
        materialForms: "".concat(x, "/items/forms"),
        materialGrade: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/grades/").concat(id)); },
        materialGrades: "".concat(x, "/items/grades"),
        materialType: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/types/").concat(id)); },
        materialTypes: "".concat(x, "/items/types"),
        materialInventory: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/inventory"));
        },
        materialInventoryLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/inventory?location=").concat(locationId));
        },
        materialPlanning: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/planning"));
        },
        materialPlanningLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/planning?location=").concat(locationId));
        },
        materialPricing: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/pricing"));
        },
        materialPurchasing: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/purchasing"));
        },
        materialQuality: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/quality"));
        },
        materialRoot: "".concat(x, "/material"),
        materialSupplier: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(itemId, "/purchasing/").concat(id));
        },
        materialSuppliers: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/suppliers"));
        },
        materials: "".concat(x, "/items/materials"),
        materialSubstance: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/substances/").concat(id));
        },
        materialSubstances: "".concat(x, "/items/substances"),
        methodMaterial: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/material/").concat(id));
        },
        methodMaterials: "".concat(x, "/items/methods/materials"),
        methodMaterialsOrder: "".concat(x, "/items/methods/material/order"),
        methodOperation: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/").concat(id));
        },
        methodOperations: "".concat(x, "/items/methods/operations"),
        methodOperationsOrder: "".concat(x, "/items/methods/operation/order"),
        methodOperationsDelete: "".concat(x, "/items/methods/operation/delete"),
        methodOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/step/").concat(id));
        },
        methodOperationStepOrder: function (operationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/").concat(operationId, "/step/order"));
        },
        methodOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/parameter/").concat(id));
        },
        methodOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/methods/operation/tool/").concat(id));
        },
        newAbility: "".concat(x, "/resources/abilities/new"),
        newApiKey: "".concat(x, "/settings/api-keys/new"),
        newAttribute: "".concat(x, "/people/attribute/new"),
        newAttributeCategory: "".concat(x, "/people/attributes/new"),
        newAttributeForCategory: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/people/attributes/list/").concat(id, "/new"));
        },
        newBatch: "".concat(x, "/inventory/batches/new"),
        newBulkJob: "".concat(x, "/job/bulk/new"),
        newChartOfAccount: "".concat(x, "/accounting/charts/new"),
        newChartOfAccountGroup: "".concat(x, "/accounting/charts/new-group"),
        newCostCenter: "".concat(x, "/accounting/cost-centers/new"),
        newCompany: "".concat(x, "/settings/company/new"),
        newCompanyInGroup: "".concat(x, "/settings/companies/new"),
        tryDemo: "".concat(x, "/settings/company/demo"),
        demoSeed: "".concat(x, "/demo/seed"),
        demoExtendRequest: "".concat(x, "/demo/extend-request"),
        newConsumable: "".concat(x, "/consumable/new"),
        newConsumableSupplier: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/purchasing/new"));
        },
        newContractor: "".concat(x, "/resources/contractors/new"),
        newExchangeRate: "".concat(x, "/accounting/exchange-rates/new"),
        newDimension: "".concat(x, "/accounting/dimensions/new"),
        newCustomer: "".concat(x, "/customer/new"),
        newCustomerAccount: "".concat(x, "/people/customers/new"),
        newCustomerContact: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/contacts/new"));
        },
        newCustomerLocation: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/customer/").concat(id, "/locations/new"));
        },
        newCustomerStatus: "".concat(x, "/sales/customer-statuses/new"),
        newCustomerType: "".concat(x, "/sales/customer-types/new"),
        newCustomField: function (tableId) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/custom-fields/").concat(tableId, "/new"));
        },
        newCustomerPart: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/sales/customer-parts/new"));
        },
        newDemandProjection: "".concat(x, "/production/projections/new"),
        newDepartment: "".concat(x, "/people/departments/new"),
        newDocument: "".concat(x, "/documents/new"),
        newEmployee: "".concat(x, "/people/employees/new"),
        newOperator: "".concat(x, "/people/operators/new"),
        newEmployeeAbility: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/ability/").concat(id, "/employee/new"));
        },
        newEmployeeType: "".concat(x, "/people/employee-types/new"),
        newInviteLink: "".concat(x, "/people/invite-links/new"),
        newFailureMode: "".concat(x, "/resources/failure-modes/new"),
        newFixture: "".concat(x, "/fixture/new"),
        newFixtureSupplier: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/fixture/").concat(id, "/purchasing/new"));
        },
        newGauge: "".concat(x, "/quality/gauges/new"),
        newGaugeCalibrationRecord: "".concat(x, "/quality/calibrations/new"),
        newGaugeType: "".concat(x, "/quality/gauge-types/new"),
        newGroup: "".concat(x, "/people/groups/new"),
        newHoliday: "".concat(x, "/people/holidays/new"),
        newTimecard: "".concat(x, "/people/timecard/new"),
        newInvestigationType: "".concat(x, "/quality/investigation-types/new"),
        newIssue: "".concat(x, "/issue/new"),
        newIssueAssociation: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/issue/").concat(id, "/association/new"));
        },
        newIssueType: "".concat(x, "/quality/issue-types/new"),
        newIssueWorkflow: "".concat(x, "/issue-workflow/new"),
        newItemPostingGroup: "".concat(x, "/items/groups/new"),
        newJob: "".concat(x, "/job/new"),
        newJobMaterial: function (jobId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/material/new"));
        },
        newJobOperation: function (jobId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/methods/").concat(jobId, "/operation/new"));
        },
        newJobOperationStep: "".concat(x, "/job/methods/operation/step/new"),
        newJobOperationParameter: "".concat(x, "/job/methods/operation/parameter/new"),
        newJobOperationTool: "".concat(x, "/job/methods/operation/tool/new"),
        newJobMaterialsSession: function (jobId) {
            return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(jobId, "/materials/session/new"));
        },
        newKanban: "".concat(x, "/inventory/kanbans/new"),
        newLocation: "".concat(x, "/resources/locations/new"),
        newMaintenanceDispatch: "".concat(x, "/maintenance/new"),
        newMaintenanceSchedule: "".concat(x, "/resources/scheduled-maintenance/new"),
        newMakeMethodVersion: "".concat(x, "/items/methods/version/new"),
        newMaterial: "".concat(x, "/material/new"),
        newMethodMaterial: "".concat(x, "/items/methods/material/new"),
        newMethodOperation: "".concat(x, "/items/methods/operation/new"),
        newMethodOperationStep: "".concat(x, "/items/methods/operation/step/new"),
        newMethodOperationTool: "".concat(x, "/items/methods/operation/tool/new"),
        newMethodOperationParameter: "".concat(x, "/items/methods/operation/parameter/new"),
        newMaterialDimension: "".concat(x, "/items/dimensions/new"),
        newMaterialFinish: "".concat(x, "/items/finishes/new"),
        newStyleColor: "".concat(x, "/items/colors/new"),
        newStyleSize: "".concat(x, "/items/sizes/new"),
        newMaterialForm: "".concat(x, "/items/forms/new"),
        newMaterialGrade: "".concat(x, "/items/grades/new"),
        newMaterialSubstance: "".concat(x, "/items/substances/new"),
        newMaterialSupplier: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/purchasing/new"));
        },
        newNote: "".concat(x, "/shared/notes/new"),
        newPart: "".concat(x, "/part/new"),
        newPartSupplier: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/purchasing/new"));
        },
        newStockTransfer: "".concat(x, "/stock-transfer/new"),
        newStockTransferLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/line/new"));
        },
        newSuggestion: "".concat(x, "/resources/suggestions/new"),
        newProcedure: "".concat(x, "/production/procedures/new"),
        newProcedureStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/steps/new"));
        },
        newProcedureParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/parameters/new"));
        },
        newMaterialType: "".concat(x, "/items/types/new"),
        newNoQuoteReason: "".concat(x, "/sales/no-quote-reasons/new"),
        newCustomerPortal: "".concat(x, "/sales/customer-portals/new"),
        newPartner: "".concat(x, "/resources/partners/new"),
        newPaymentTerm: "".concat(x, "/accounting/payment-terms/new"),
        newProcess: "".concat(x, "/resources/processes/new"),
        newPurchaseInvoice: "".concat(x, "/purchase-invoice/new"),
        newPurchaseInvoiceLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/new"));
        },
        newPurchaseOrder: "".concat(x, "/purchase-order/new"),
        newPurchaseOrderLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/new"));
        },
        newQualityDocument: "".concat(x, "/quality/documents/new"),
        newQualityDocumentStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality-document/").concat(id, "/steps/new"));
        },
        newQuote: "".concat(x, "/quote/new"),
        newQuoteLine: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/new")); },
        newQuoteLineCost: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/").concat(lineId, "/cost/new"));
        },
        newQuoteOperation: function (quoteId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/").concat(quoteId, "/").concat(lineId, "/operation/new"));
        },
        newQuoteOperationStep: "".concat(x, "/quote/methods/operation/step/new"),
        newQuoteOperationParameter: "".concat(x, "/quote/methods/operation/parameter/new"),
        newQuoteOperationTool: "".concat(x, "/quote/methods/operation/tool/new"),
        newQuoteMaterial: function (quoteId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/").concat(quoteId, "/").concat(lineId, "/material/new"));
        },
        newReceipt: "".concat(x, "/receipt/new"),
        newRequiredAction: "".concat(x, "/quality/required-actions/new"),
        newRevision: "".concat(x, "/items/revisions/new"),
        newRisk: "".concat(x, "/quality/risks/new"),
        newSalesInvoice: "".concat(x, "/sales-invoice/new"),
        newSalesInvoiceLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/new"));
        },
        newSalesOrder: "".concat(x, "/sales-order/new"),
        newSalesOrderLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/new"));
        },
        newSalesOrderLineShipment: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/").concat(lineId, "/shipment"));
        },
        newSalesRFQ: "".concat(x, "/sales-rfq/new"),
        newSalesRFQLine: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/new")); },
        newScrapReason: "".concat(x, "/production/scrap-reasons/new"),
        newStorageUnit: "".concat(x, "/inventory/storage-units/new"),
        newStorageType: "".concat(x, "/inventory/storage-types/new"),
        newShipment: "".concat(x, "/shipment/new"),
        newShift: "".concat(x, "/people/shifts/new"),
        newJobRule: "".concat(x, "/production/job-rules/new"),
        newShippingMethod: "".concat(x, "/inventory/shipping-methods/new"),
        newService: "".concat(x, "/service/new"),
        newStyle: "".concat(x, "/style/new"),
        newServiceSupplier: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/service/").concat(id, "/purchasing/new"));
        },
        newSupplier: "".concat(x, "/supplier/new"),
        newSupplierAccount: "".concat(x, "/people/suppliers/new"),
        newSupplierContact: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/contacts/new"));
        },
        newSupplierLocation: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/locations/new"));
        },
        newSupplierProcess: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/processes/new"));
        },
        newSupplierQuote: "".concat(x, "/supplier-quote/new"),
        newSupplierQuoteLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/new"));
        },
        newSupplierType: "".concat(x, "/purchasing/supplier-types/new"),
        newTag: "".concat(x, "/settings/tags/new"),
        newTool: "".concat(x, "/tool/new"),
        newToolSupplier: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/purchasing/new"));
        },
        newTraining: "".concat(x, "/resources/training/new"),
        newTrainingAssignment: "".concat(x, "/resources/assignments/new"),
        newTrainingQuestion: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/training/").concat(id, "/questions/new"));
        },
        newUom: "".concat(x, "/items/uom/new"),
        newWarehouseTransfer: "".concat(x, "/warehouse-transfer/new"),
        newWarehouseTransferLine: function (transferId) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(transferId, "/details/new"));
        },
        newWorkCenter: "".concat(x, "/resources/work-centers/new"),
        newWebhook: "".concat(x, "/settings/webhooks/new"),
        noQuoteReasons: "".concat(x, "/sales/no-quote-reasons"),
        noQuoteReason: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/no-quote-reasons/").concat(id));
        },
        notificationSettings: "".concat(x, "/account/notifications"),
        part: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id)); },
        style: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id)); },
        itemProperties: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/").concat(id, "/properties")); },
        partCosting: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/costing")); },
        partDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/details")); },
        partMake: function (id, makeMethodId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/make/").concat(makeMethodId));
        },
        partInventory: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/inventory")); },
        partInventoryLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/inventory?location=").concat(locationId));
        },
        partPlanning: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/planning")); },
        partPlanningLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/planning?location=").concat(locationId));
        },
        partPricing: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/pricing")); },
        partPurchasing: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/purchasing")); },
        partRoot: "".concat(x, "/part"),
        partQuality: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/quality")); },
        partRules: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/rules")); },
        materialRules: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/material/").concat(id, "/rules")); },
        consumableRules: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/consumable/").concat(id, "/rules"));
        },
        toolRules: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/rules")); },
        storageRules: "".concat(x, "/inventory/storage-rules"),
        storageRule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/storage-rules/").concat(id));
        },
        newStorageRule: "".concat(x, "/inventory/storage-rules/new"),
        deleteStorageRule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/storage-rules/").concat(id, "/delete"));
        },
        storageRuleAssignItem: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/rules/assign/").concat(itemId));
        },
        storageRuleUnassignItem: function (itemId, ruleId) {
            return (0, react_router_1.generatePath)("".concat(x, "/items/rules/unassign/").concat(itemId, "/").concat(ruleId));
        },
        storageRuleAssignWorkCenter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/work-centers/rules/assign/").concat(id));
        },
        storageRuleUnassignWorkCenter: function (id, ruleId) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/work-centers/rules/unassign/").concat(id, "/").concat(ruleId));
        },
        partSales: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(id, "/sales")); },
        styleCosting: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/costing")); },
        styleDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/details")); },
        styleInventory: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/inventory")); },
        styleInventoryLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/inventory?location=").concat(locationId));
        },
        stylePlanning: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/planning")); },
        stylePlanningLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/planning?location=").concat(locationId));
        },
        styleRoot: "".concat(x, "/style"),
        styleSales: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/style/").concat(id, "/sales")); },
        partSupplier: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/part/").concat(itemId, "/purchasing/").concat(id));
        },
        parts: "".concat(x, "/items/parts"),
        partner: function (id, abilityId) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/partners/").concat(id, "/").concat(abilityId));
        },
        partners: "".concat(x, "/resources/partners"),
        paymentTerm: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/payment-terms/").concat(id));
        },
        paymentTerms: "".concat(x, "/accounting/payment-terms"),
        people: "".concat(x, "/people/employees"),
        peopleTimecard: "".concat(x, "/people/timecard"),
        timecard: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/timecard/").concat(id)); },
        contact: "".concat(x, "/people/contact"),
        accountingSalary: "".concat(x, "/accounting/salary"),
        accountingPayments: "".concat(x, "/accounting/payments"),
        quantityReview: "".concat(x, "/production/quantities"),
        productionQuantityReport: function (reportId) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/quantities/report/").concat(reportId));
        },
        quantityReviewReport: function (reportId) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/quantities/report/").concat(reportId));
        },
        quantityReviewForEmployee: function (employeeId) {
            return "".concat(x, "/production/quantities?filter=approvalStatus:eq:Pending&filter=employeeId:eq:").concat(employeeId);
        },
        employeeSalary: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/salary/").concat(id));
        },
        employeeSalaryMonth: function (id, year, month) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/salary/").concat(id, "/").concat(year, "/").concat(month));
        },
        newSalaryPayment: function (id, year, month) {
            return (0, react_router_1.generatePath)("".concat(x, "/accounting/salary/").concat(id, "/").concat(year, "/").concat(month, "/pay"));
        },
        recordSalaryPayment: function (year, month, returnTo) {
            var params = new URLSearchParams({
                year: String(year),
                month: String(month),
                recordPayment: "1"
            });
            if (returnTo) {
                params.set("returnTo", returnTo);
            }
            return "".concat(x, "/accounting/salary?").concat(params.toString());
        },
        person: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/person/").concat(id)); },
        personDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/person/").concat(id, "/details")); },
        personJob: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/person/").concat(id, "/job")); },
        personTimecard: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/person/").concat(id, "/timecard")); },
        personAttributeCategory: function (personId, categoryId) {
            return (0, react_router_1.generatePath)("".concat(x, "/person/").concat(personId, "/attributes/").concat(categoryId));
        },
        stockTransfer: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id)); },
        stockTransferComplete: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/complete"));
        },
        stockTransferLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/line/").concat(lineId));
        },
        stockTransferLineQuantity: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/line/quantity"));
        },
        stockTransferScan: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/scan/").concat(lineId));
        },
        stockTransferStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/stock-transfer/").concat(id, "/status"));
        },
        stockTransfers: "".concat(x, "/inventory/stock-transfers"),
        suggestion: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/suggestions/").concat(id));
        },
        suggestions: "".concat(x, "/resources/suggestions"),
        template: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(id)); },
        templateConfigurationParameter: function (templateId) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/parameter"));
        },
        templateConfigurationParameterGroup: function (templateId) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/parameter/group"));
        },
        templateConfigurationParameterGroupOrder: function (templateId) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/parameter/group/order"));
        },
        templateConfigurationParameterOrder: function (templateId) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/parameter/order"));
        },
        templateConfigurationRule: function (templateId) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/rule"));
        },
        templateDeleteConfigurationParameter: function (templateId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/parameter/delete/").concat(id));
        },
        templateDeleteConfigurationParameterGroup: function (templateId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/parameter/group/delete/").concat(id));
        },
        templateDeleteConfigurationRule: function (templateId, field) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(templateId, "/rule/delete/").concat(field));
        },
        deleteTemplate: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(id, "/delete")); },
        templateDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/").concat(id, "/details"));
        },
        templateMethodMaterial: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/material/").concat(id));
        },
        templateMethodMaterialsOrder: "".concat(x, "/template/methods/material/order"),
        templateMethodOperation: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/").concat(id));
        },
        templateMethodOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/parameter/").concat(id));
        },
        templateMethodOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/step/").concat(id));
        },
        templateMethodOperationStepOrder: function (operationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/").concat(operationId, "/step/order"));
        },
        templateMethodOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/tool/").concat(id));
        },
        templateMethodOperationsDelete: "".concat(x, "/template/methods/operation/delete"),
        templateMethodOperationsOrder: "".concat(x, "/template/methods/operation/order"),
        templateNew: "".concat(x, "/template/new"),
        templateNewMethodMaterial: "".concat(x, "/template/methods/material/new"),
        templateNewMethodOperation: "".concat(x, "/template/methods/operation/new"),
        templateNewMethodOperationParameter: "".concat(x, "/template/methods/operation/parameter/new"),
        templateNewMethodOperationStep: "".concat(x, "/template/methods/operation/step/new"),
        templateNewMethodOperationTool: "".concat(x, "/template/methods/operation/tool/new"),
        templateDeleteMethodMaterial: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/material/delete/").concat(id));
        },
        templateDeleteMethodOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/parameter/delete/").concat(id));
        },
        templateDeleteMethodOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/step/delete/").concat(id));
        },
        templateDeleteMethodOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/template/methods/operation/tool/delete/").concat(id));
        },
        templates: "".concat(x, "/items/templates"),
        styles: "".concat(x, "/items/styles"),
        procedure: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id)); },
        procedureStep: function (id, attributeId) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/steps/").concat(attributeId));
        },
        procedureStepOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/steps/order"));
        },
        procedureParameter: function (id, parameterId) {
            return (0, react_router_1.generatePath)("".concat(x, "/procedure/").concat(id, "/parameters/").concat(parameterId));
        },
        procedures: "".concat(x, "/production/procedures"),
        process: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/resources/processes/").concat(id)); },
        processes: "".concat(x, "/resources/processes"),
        processActivate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/processes/activate/").concat(id));
        },
        processDeactivate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/processes/deactivate/").concat(id));
        },
        printingSettings: "".concat(x, "/settings/printing"),
        printingSettingsJobs: "".concat(x, "/settings/printing/jobs"),
        deletePrinterRoute: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/printing/").concat(id, "/delete"));
        },
        production: "".concat(x, "/production"),
        productionDashboard: "".concat(x, "/production/dashboard"),
        productionPlanning: "".concat(x, "/production/planning"),
        productionQuantities: "".concat(x, "/production/quantities"),
        newProductionQuantity: "".concat(x, "/production/quantities/new"),
        jobRules: "".concat(x, "/production/job-rules"),
        jobRule: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/production/job-rules/").concat(id)); },
        jobRulesSimulate: "".concat(x, "/production/job-rules/simulate"),
        productionPlanningItem: function (itemId) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/planning/").concat(itemId));
        },
        peopleSettings: "".concat(x, "/settings/people"),
        productionSettings: "".concat(x, "/settings/production"),
        profile: "".concat(x, "/account/profile"),
        accountSecurity: "".concat(x, "/account/security"),
        purchaseInvoice: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id));
        },
        purchaseInvoiceDelivery: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/delivery"));
        },
        purchaseInvoiceDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/details"));
        },
        purchaseInvoiceExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/exchange-rate"));
        },
        purchaseInvoiceLine: function (invoiceId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(invoiceId, "/").concat(id, "/details"));
        },
        purchaseInvoiceLineOrder: function (invoiceId) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(invoiceId, "/line-order"));
        },
        purchaseInvoicePost: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/post"));
        },
        purchaseInvoiceRoot: "".concat(x, "/purchase-invoice"),
        purchaseInvoiceStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/status"));
        },
        purchaseInvoiceVoid: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-invoice/").concat(id, "/void"));
        },
        purchaseInvoices: "".concat(x, "/purchasing/invoices"),
        purchaseOrder: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id)); },
        purchaseOrderDuplicate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/duplicate"));
        },
        purchaseOrderDelivery: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/delivery"));
        },
        purchaseOrderDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/details"));
        },
        purchaseOrderExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/exchange-rate"));
        },
        purchaseOrderExternalDocuments: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/external"));
        },
        purchaseOrderFavorite: "".concat(x, "/purchasing/orders/favorite"),
        purchaseOrderLine: function (orderId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(orderId, "/").concat(id, "/details"));
        },
        purchaseOrderLineOrder: function (orderId) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(orderId, "/line-order"));
        },
        purchaseOrderPayment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/payment"));
        },
        purchaseOrderFinalize: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/finalize"));
        },
        supplierDefaultAttachments: function (supplierId) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/default-attachments"));
        },
        purchaseOrderRoot: "".concat(x, "/purchase-order"),
        purchaseOrderStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchase-order/").concat(id, "/status"));
        },
        purchaseOrders: "".concat(x, "/purchasing/orders"),
        purchasing: "".concat(x, "/purchasing"),
        purchasingDashboard: "".concat(x, "/purchasing/dashboard"),
        purchasingPlanning: "".concat(x, "/purchasing/planning"),
        purchasingSettings: "".concat(x, "/settings/purchasing"),
        quality: "".concat(x, "/quality"),
        qualityDashboard: "".concat(x, "/quality/dashboard"),
        qualityActions: "".concat(x, "/quality/actions"),
        inboundInspections: "".concat(x, "/quality/inbound-inspections"),
        inboundInspection: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/inbound-inspections/").concat(id));
        },
        qualityDocument: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality-document/").concat(id));
        },
        qualityDocuments: "".concat(x, "/quality/documents"),
        qualityDocumentStep: function (id, attributeId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality-document/").concat(id, "/steps/").concat(attributeId));
        },
        qualityDocumentStepOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality-document/").concat(id, "/steps/order"));
        },
        qualitySettings: "".concat(x, "/settings/quality"),
        quote: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id)); },
        quoteAssembly: function (quoteId, lineId, assemblyId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/lines/").concat(lineId, "/assembly/").concat(assemblyId));
        },
        quoteDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/details")); },
        quoteDrag: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/drag")); },
        quoteDuplicate: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/duplicate")); },
        quoteExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/exchange-rate"));
        },
        quoteExternalDocuments: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/external"));
        },
        quoteFavorite: "".concat(x, "/sales/quotes/favorite"),
        quoteFinalize: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/finalize")); },
        quoteInternalDocuments: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/internal"));
        },
        quoteLine: function (quoteId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(id, "/details"));
        },
        quoteLineOrder: function (quoteId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/line-order"));
        },
        quoteLineConfigure: function (quoteId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(lineId, "/configure"));
        },
        quoteLineMakeMethod: function (quoteId, lineId, makeMethodId) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(lineId, "/make/").concat(makeMethodId)); },
        quoteLineMethod: function (quoteId, quoteLineId, methodId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(quoteLineId, "/method/").concat(methodId));
        },
        quoteLineRecalculatePrice: function (quoteId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(lineId, "/recalculate-price"));
        },
        quoteLineUpdatePrecision: function (quoteId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(quoteId, "/").concat(lineId, "/update-precision"));
        },
        quoteMaterial: function (quoteId, lineId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/").concat(quoteId, "/").concat(lineId, "/material/").concat(id));
        },
        quoteMaterialsOrder: "".concat(x, "/quote/methods/material/order"),
        quoteMethodGet: "".concat(x, "/quote/methods/get"),
        quoteMethodSave: "".concat(x, "/quote/methods/save"),
        quoteOperation: function (quoteId, lineId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/").concat(quoteId, "/").concat(lineId, "/operation/").concat(id));
        },
        quoteOperationsOrder: "".concat(x, "/quote/methods/operation/order"),
        quoteOperationsDelete: "".concat(x, "/quote/methods/operation/delete"),
        quoteOperationStep: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/step/").concat(id));
        },
        quoteOperationStepOrder: function (operationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/").concat(operationId, "/step/order"));
        },
        quoteOperationParameter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/parameter/").concat(id));
        },
        quoteOperationTool: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quote/methods/operation/tool/").concat(id));
        },
        quotePayment: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/payment")); },
        quoteShipment: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/shipment")); },
        quoteStatus: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quote/").concat(id, "/status")); },
        quotes: "".concat(x, "/sales/quotes"),
        receipt: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id)); },
        receiptInvoice: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id, "/invoice")); },
        receiptDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id, "/details")); },
        receiptLineDelete: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/receipt/lines/").concat(id, "/delete"));
        },
        receiptFixedAssetLineUpdate: "".concat(x, "/receipt/fixed-asset-lines/update"),
        receiptLineSplit: "".concat(x, "/receipt/lines/split"),
        receiptLines: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id, "/lines")); },
        receiptLinesTracking: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/receipt/lines/tracking"));
        },
        receipts: "".concat(x, "/inventory/receipts"),
        receiptPost: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id, "/post")); },
        receiptRoot: "".concat(x, "/receipt"),
        receiptVoid: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/receipt/").concat(id, "/void")); },
        refreshSession: "/refresh-session",
        requiredAction: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/quality/required-actions/").concat(id));
        },
        requiredActions: "".concat(x, "/quality/required-actions"),
        resendInvite: "".concat(x, "/people/resend-invite"),
        resources: "".concat(x, "/resources"),
        revokeInviteLink: "".concat(x, "/people/invite-links/revoke"),
        updateInviteLinkExpiry: "".concat(x, "/people/invite-links/update-expiry"),
        reviewMembershipApplication: "".concat(x, "/people/applications/review"),
        resourcesDashboard: "".concat(x, "/resources/dashboard"),
        resourcesSettings: "".concat(x, "/settings/resources"),
        revision: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/revisions/").concat(id)); },
        revokeInvite: "".concat(x, "/people/revoke-invite"),
        risks: "".concat(x, "/quality/risks"),
        risk: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/quality/risks/").concat(id)); },
        root: "/",
        routings: "".concat(x, "/items/routing"),
        sales: "".concat(x, "/sales"),
        salesDashboard: "".concat(x, "/sales/dashboard"),
        salesInvoice: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id)); },
        salesInvoiceDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/details"));
        },
        salesInvoiceExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/exchange-rate"));
        },
        salesInvoiceLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/").concat(lineId, "/details"));
        },
        salesInvoiceLineOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/line-order"));
        },
        salesInvoicePost: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/post"));
        },
        salesInvoiceShipment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/shipment"));
        },
        salesInvoiceStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/status"));
        },
        salesInvoiceVoid: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-invoice/").concat(id, "/void"));
        },
        salesInvoices: "".concat(x, "/sales/invoices"),
        salesOrder: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id)); },
        salesOrderConfirm: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/confirm"));
        },
        salesOrderShipment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/shipment"));
        },
        salesOrderDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/details"));
        },
        salesOrderExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/exchange-rate"));
        },
        salesOrderExternalDocuments: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/external"));
        },
        salesOrderFavorite: "".concat(x, "/sales-order/orders/favorite"),
        salesOrderInternalDocuments: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/internal"));
        },
        salesOrderLine: function (orderId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(orderId, "/").concat(id, "/details"));
        },
        salesOrderLineOrder: function (orderId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(orderId, "/line-order"));
        },
        salesOrderLineToJob: function (orderId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(orderId, "/").concat(lineId, "/job"));
        },
        salesOrderLinesToJobs: function (orderId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(orderId, "/lines/jobs"));
        },
        salesOrderPayment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/payment"));
        },
        salesOrderRelease: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/release"));
        },
        salesOrderStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/status"));
        },
        salesOrderCancelPreview: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-order/").concat(id, "/cancel-preview"));
        },
        salesOrders: "".concat(x, "/sales/orders"),
        salesPriceList: "".concat(x, "/sales/price-list"),
        deletePriceOverride: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/price-list/delete/").concat(id));
        },
        newPriceOverride: "".concat(x, "/sales/price-list/new"),
        duplicatePriceList: "".concat(x, "/sales/price-list/duplicate"),
        priceOverride: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales/price-list/").concat(id)); },
        salesPricingRules: "".concat(x, "/sales/pricing-rules"),
        pricingRule: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales/pricing-rules/").concat(id)); },
        newPricingRule: "".concat(x, "/sales/pricing-rules/new"),
        deletePricingRule: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales/pricing-rules/delete/").concat(id));
        },
        salesRfq: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id)); },
        salesRfqConvert: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/convert"));
        },
        salesRfqDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/details"));
        },
        salesRfqDrag: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/drag")); },
        salesRfqFavorite: "".concat(x, "/sales/rfqs/favorite"),
        salesRfqLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/").concat(lineId, "/details"));
        },
        salesRfqLineOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/line-order"));
        },
        salesRfqRoot: "".concat(x, "/sales-rfq"),
        salesRfqStatus: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/sales-rfq/").concat(id, "/status")); },
        salesRfqs: "".concat(x, "/sales/rfqs"),
        salesSettings: "".concat(x, "/settings/sales"),
        // Purchasing RFQ paths
        purchasingRfq: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id)); },
        purchasingRfqDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/details"));
        },
        purchasingRfqFavorite: "".concat(x, "/purchasing/rfqs/favorite"),
        purchasingRfqLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/").concat(lineId, "/details"));
        },
        purchasingRfqLineOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/line-order"));
        },
        purchasingRfqRoot: "".concat(x, "/purchasing-rfq"),
        purchasingRfqStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/status"));
        },
        cancelPurchasingRfq: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/cancel"));
        },
        purchasingRfqFinalize: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/finalize"));
        },
        purchasingRfqs: "".concat(x, "/purchasing/rfqs"),
        newPurchasingRFQ: "".concat(x, "/purchasing-rfq/new"),
        newPurchasingRFQLine: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/new"));
        },
        deletePurchasingRfq: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/delete"));
        },
        deletePurchasingRfqLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/").concat(lineId, "/delete"));
        },
        purchasingRfqConvert: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/convert"));
        },
        purchasingRfqCompare: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/compare"));
        },
        purchasingRfqSuppliers: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing-rfq/").concat(id, "/suppliers"));
        },
        purchasingRfqPreview: function (id) {
            return (0, react_router_1.generatePath)("/share/purchasing-rfq/".concat(id));
        },
        saveViews: "".concat(x, "/shared/views"),
        saveViewOrder: "".concat(x, "/shared/view/order"),
        scheduleOperation: "".concat(x, "/schedule/operations"),
        scheduleOperationUpdate: "".concat(x, "/schedule/operations/update"),
        scheduleDates: "".concat(x, "/schedule/dates"),
        scheduleDatesUpdate: "".concat(x, "/schedule/dates/update"),
        scrapReason: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/production/scrap-reasons/").concat(id));
        },
        scrapReasons: "".concat(x, "/production/scrap-reasons"),
        serialNumbers: "".concat(x, "/inventory/serial-numbers"),
        serialNumber: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/serial-numbers/").concat(id));
        },
        service: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/service/").concat(id)); },
        services: "".concat(x, "/items/services"),
        serviceDetails: function (id) { return "".concat(x, "/service/").concat(id, "/details"); },
        serviceRoot: "".concat(x, "/service"),
        servicePurchasing: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/service/").concat(id, "/purchasing"));
        },
        serviceSupplier: function (serviceId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/service/").concat(serviceId, "/purchasing/").concat(id));
        },
        serviceSuppliers: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/service/").concat(id, "/suppliers"));
        },
        settings: "".concat(x, "/settings"),
        sequences: "".concat(x, "/settings/sequences"),
        storageUnit: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/storage-units/").concat(id));
        },
        storageUnits: "".concat(x, "/inventory/storage-units"),
        storageType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/storage-types/").concat(id));
        },
        storageTypes: "".concat(x, "/inventory/storage-types"),
        shift: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/people/shifts/").concat(id)); },
        shifts: "".concat(x, "/people/shifts"),
        shipments: "".concat(x, "/inventory/shipments"),
        shipment: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/shipment/").concat(id)); },
        shipmentDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/shipment/").concat(id, "/details"));
        },
        shipmentFixedAssetLineUpdate: "".concat(x, "/shipment/fixed-asset-lines/update"),
        shipmentLineDelete: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/shipment/lines/").concat(id, "/delete"));
        },
        shipmentLineSplit: "".concat(x, "/shipment/lines/split"),
        shipmentLinesTracking: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/shipment/lines/tracking"));
        },
        shipmentPost: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/shipment/").concat(id, "/post")); },
        shipmentVoid: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/shipment/").concat(id, "/void")); },
        shippingMethod: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/inventory/shipping-methods/").concat(id));
        },
        warehouseTransfers: "".concat(x, "/inventory/warehouse-transfers"),
        warehouseTransfer: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(id));
        },
        warehouseTransferDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(id, "/details"));
        },
        warehouseTransferStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(id, "/status"));
        },
        warehouseTransferShip: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(id, "/ship"));
        },
        warehouseTransferReceive: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(id, "/receive"));
        },
        warehouseTransferLines: function (transferId) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(transferId, "/lines"));
        },
        warehouseTransferLine: function (transferId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/warehouse-transfer/").concat(transferId, "/details/").concat(lineId));
        },
        pickingLists: "".concat(x, "/inventory/picking-lists"),
        pickingSchedule: "".concat(x, "/picking-list/schedule"),
        pickingListsTable: "".concat(x, "/inventory/picking-lists"),
        newPickingList: "".concat(x, "/picking-list/new"),
        pickingList: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(id)); },
        pickingListDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(id, "/details"));
        },
        pickingListStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(id, "/status"));
        },
        pickingListDelete: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(id, "/delete"));
        },
        pickingListLine: function (pickingListId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(pickingListId, "/details/").concat(lineId));
        },
        pickingListTracked: function (pickingListId, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(pickingListId, "/tracked/").concat(lineId));
        },
        pickingListLineQuantity: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking-list/").concat(id, "/line/quantity"));
        },
        shippingMethods: "".concat(x, "/inventory/shipping-methods"),
        supplier: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id)); },
        supplierApproval: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/approval"));
        },
        suppliers: "".concat(x, "/purchasing/suppliers"),
        supplierAccounts: "".concat(x, "/people/suppliers"),
        supplierAccounting: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/accounting"));
        },
        supplierContact: function (supplierId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/contacts/").concat(id));
        },
        supplierDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/details"));
        },
        supplierContacts: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/contacts"));
        },
        supplierLocation: function (supplierId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/locations/").concat(id));
        },
        supplierLocations: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/locations"));
        },
        supplierPayment: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/payments"));
        },
        supplierProcess: function (supplierId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(supplierId, "/processes/").concat(id));
        },
        supplierProcesses: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/processes"));
        },
        supplierRisks: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/risks")); },
        supplierShipping: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/shipping"));
        },
        supplierTax: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/supplier/").concat(id, "/tax")); },
        supplierQuote: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id)); },
        supplierQuotes: "".concat(x, "/purchasing/quotes"),
        supplierQuoteFavorite: "".concat(x, "/purchasing/quotes/favorite"),
        supplierQuoteDetails: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/details"));
        },
        supplierQuoteExchangeRate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/exchange-rate"));
        },
        supplierQuoteLine: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/").concat(lineId, "/details"));
        },
        supplierQuoteLineOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/line-order"));
        },
        supplierQuoteFinalize: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/finalize"));
        },
        supplierQuoteSend: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/send"));
        },
        supplierQuoteStatus: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/supplier-quote/").concat(id, "/status"));
        },
        supplierRoot: "".concat(x, "/supplier"),
        supplierType: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/purchasing/supplier-types/").concat(id));
        },
        supplierTypes: "".concat(x, "/purchasing/supplier-types"),
        tableSequence: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/settings/sequences/").concat(id));
        },
        tags: "".concat(x, "/settings/tags"),
        deleteTag: function (table, name) {
            return "".concat(x, "/settings/tags/delete?table=").concat(encodeURIComponent(table), "&name=").concat(encodeURIComponent(name));
        },
        theme: "".concat(x, "/account/theme"),
        timecards: "".concat(x, "/timecards"),
        tool: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id)); },
        toolCosting: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/costing")); },
        toolDetails: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/details")); },
        toolInventory: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/inventory")); },
        toolInventoryLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/inventory?location=").concat(locationId));
        },
        toolMake: function (id, makeMethodId) {
            return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/make/").concat(makeMethodId));
        },
        toolPlanning: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/planning")); },
        toolPlanningLocation: function (id, locationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/planning?location=").concat(locationId));
        },
        toolPricing: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/pricing")); },
        toolPurchasing: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/purchasing")); },
        toolQuality: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/quality")); },
        toolRoot: "".concat(x, "/tool"),
        toolSupplier: function (itemId, id) {
            return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(itemId, "/suppliers/").concat(id));
        },
        toolSuppliers: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/tool/").concat(id, "/suppliers")); },
        tools: "".concat(x, "/items/tools"),
        traceability: "".concat(x, "/traceability"),
        traceabilityGraph: "".concat(x, "/traceability/graph"),
        trackedEntities: "".concat(x, "/inventory/tracked-entities"),
        trackedEntityExpiry: "".concat(x, "/inventory/tracked-entity/expiry"),
        training: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/training/").concat(id)); },
        trainings: "".concat(x, "/resources/training"),
        trainingQuestion: function (id, questionId) {
            return (0, react_router_1.generatePath)("".concat(x, "/training/").concat(id, "/questions/").concat(questionId));
        },
        trainingQuestionOrder: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/training/").concat(id, "/questions/order"));
        },
        trainingAssignments: "".concat(x, "/resources/assignments"),
        trainingAssignmentDetail: function (trainingId) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/assignments/").concat(trainingId));
        },
        trainingAssignment: function (assignmentId) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/assignments/assignment/").concat(assignmentId));
        },
        uom: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/items/uom/").concat(id)); },
        uoms: "".concat(x, "/items/uom"),
        userAttribute: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/account/").concat(id, "/attribute")); },
        users: "".concat(x, "/people"),
        webhook: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/settings/webhooks/").concat(id)); },
        webhooks: "".concat(x, "/settings/webhooks"),
        workCenters: "".concat(x, "/resources/work-centers"),
        workCenter: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/work-centers/").concat(id));
        },
        workCenterActivate: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/resources/work-centers/activate/").concat(id));
        }
    }
};
exports.onboardingSequence = [
    exports.path.to.onboarding.user,
    exports.path.to.onboarding.company
];
var getStoragePath = function (bucket, path) {
    return "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/").concat(bucket, "/").concat(path);
};
exports.getStoragePath = getStoragePath;
var requestReferrer = function (request, withParams) {
    if (withParams === void 0) { withParams = true; }
    return request.headers.get("referer");
};
exports.requestReferrer = requestReferrer;
var getParams = function (request) {
    var _a;
    var url = new URL((_a = (0, exports.requestReferrer)(request)) !== null && _a !== void 0 ? _a : "");
    var searchParams = new URLSearchParams(url.search);
    return searchParams.toString();
};
exports.getParams = getParams;
var getPrivateUrl = function (path) {
    return "/file/preview/private/".concat(path);
};
exports.getPrivateUrl = getPrivateUrl;
var getPublicModelUrl = function (path) {
    return "/file/model/public/".concat(path);
};
exports.getPublicModelUrl = getPublicModelUrl;
