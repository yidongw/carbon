"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParams = exports.requestReferrer = exports.getStoragePath = exports.getPrivateUrl = exports.removeSubdomain = exports.path = exports.MES_URL = exports.ERP_URL = void 0;
var auth_1 = require("@carbon/auth");
var react_router_1 = require("react-router");
exports.ERP_URL = (0, auth_1.getAppUrl)();
exports.MES_URL = (0, auth_1.getMESUrl)();
var x = "/x";
var api = "/api";
var file = "/file";
exports.path = {
    to: {
        api: {
            batchNumbers: function (itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/batch-numbers?itemId=").concat(itemId));
            },
            failureModes: "".concat(api, "/failure-modes"),
            qualityIssueTypes: "".concat(api, "/quality-issue-types"),
            serialNumbers: function (itemId) {
                return (0, react_router_1.generatePath)("".concat(api, "/serial-numbers?itemId=").concat(itemId));
            }
        },
        file: {
            jobTraveler: function (id) { return "".concat((0, auth_1.getAppUrl)()).concat(file, "/traveler/").concat(id, ".pdf"); },
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
            previewImage: function (bucket, path) {
                return (0, react_router_1.generatePath)("".concat(file, "/preview/image?file=").concat(bucket, "/").concat(path));
            },
            previewFile: function (path) { return (0, react_router_1.generatePath)("".concat(file, "/preview/").concat(path)); },
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
            }
        },
        accountSettings: "".concat(exports.ERP_URL, "/x/account"),
        acknowledge: "".concat(x, "/acknowledge"),
        active: "".concat(x, "/active"),
        assigned: "".concat(x, "/assigned"),
        salary: "".concat(x, "/salary"),
        salaryMonth: function (year, month) {
            return (0, react_router_1.generatePath)("".concat(x, "/salary/").concat(year, "/").concat(month));
        },
        authenticatedRoot: x,
        callback: "/callback",
        companySwitch: function (companyId) {
            return (0, react_router_1.generatePath)("".concat(x, "/company/switch/").concat(companyId));
        },
        complete: "".concat(x, "/complete"),
        consolePinIn: "".concat(x, "/console/pin-in"),
        consolePinOut: "".concat(x, "/console/pin-out"),
        consoleToggle: "".concat(x, "/console/toggle"),
        convertEntity: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/entity/").concat(id, "/convert")); },
        endShift: "".concat(x, "/end-shift"),
        endOperation: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/end/").concat(id)); },
        feedback: "".concat(x, "/feedback"),
        finish: "".concat(x, "/finish"),
        health: "/health",
        kanbanComplete: function (id) { return "".concat(exports.ERP_URL, "/api/kanban/complete/").concat(id); },
        inspectionSteps: "".concat(x, "/steps/inspection"),
        inventoryAdjustment: "".concat(x, "/adjustment"),
        jobDag: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/job/").concat(id)); },
        jobs: "".concat(x, "/jobs"),
        issue: "".concat(x, "/issue"),
        issueTrackedEntity: "".concat(x, "/issue-tracked-entity"),
        qualityIssueNew: "".concat(x, "/quality-issue/new"),
        location: "".concat(x, "/location"),
        manualPrint: "".concat(x, "/print"),
        login: "/login",
        logout: "/logout",
        verify: "/verify",
        maintenance: "".concat(x, "/maintenance"),
        maintenanceDetail: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/dispatch/").concat(id)); },
        maintenanceDispatchItem: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/dispatch/").concat(id, "/item"));
        },
        addAndIssueMaintenanceDispatchItem: function (dispatchId) {
            return (0, react_router_1.generatePath)("".concat(x, "/dispatch/").concat(dispatchId, "/add-and-issue"));
        },
        maintenanceEvent: "".concat(x, "/maintenance-event"),
        messagingNotify: "".concat(x, "/proxy/api/messaging/notify"),
        newMaintenanceDispatch: "".concat(x, "/dispatch/new"),
        onboarding: "".concat(exports.ERP_URL, "/onboarding"),
        printingSettings: "".concat(exports.ERP_URL, "/x/settings/printing"),
        operation: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/operation/").concat(id)); },
        operations: "".concat(x, "/operations?saved=1"),
        productionEvent: "".concat(x, "/event"),
        recent: "".concat(x, "/recent"),
        record: "".concat(x, "/record"),
        recordDelete: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/record/").concat(id, "/delete")); },
        refreshSession: "/refresh-session",
        requestAccess: "/request-access",
        rework: "".concat(x, "/rework"),
        reworkTargets: function (operationId) {
            return (0, react_router_1.generatePath)("".concat(x, "/rework-targets/").concat(operationId));
        },
        triggerRework: "".concat(x, "/trigger-rework"),
        root: "/",
        scrap: "".concat(x, "/scrap"),
        scrapReasons: "".concat(api, "/scrap-reasons"),
        scrapEntity: function (operationId, id, parentId) {
            var basePath = (0, react_router_1.generatePath)("".concat(x, "/entity/").concat(operationId, "/").concat(id, "/scrap"));
            return parentId ? "".concat(basePath, "?parentId=").concat(parentId) : basePath;
        },
        startOperation: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/start/").concat(id)); },
        switchCompany: function (companyId) {
            return (0, react_router_1.generatePath)("".concat(x, "/company/switch/").concat(companyId));
        },
        suggestion: "".concat(x, "/suggestion"),
        timecard: "".concat(api, "/timecard"),
        timeCardPage: "".concat(x, "/timecard"),
        unconsume: "".concat(x, "/unconsume"),
        picking: "".concat(x, "/picking"),
        pickingDetail: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/picking/").concat(id)); },
        pickingLineQuantity: function (id) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking/").concat(id, "/line/quantity"));
        },
        pickingTracked: function (id, lineId) {
            return (0, react_router_1.generatePath)("".concat(x, "/picking/").concat(id, "/tracked/").concat(lineId));
        },
        pickingStatus: function (id) { return (0, react_router_1.generatePath)("".concat(x, "/picking/").concat(id, "/status")); },
        workCenter: function (workCenter) {
            return (0, react_router_1.generatePath)("".concat(x, "/operations/").concat(workCenter));
        },
        itemMaster: function (itemId, type) {
            return "".concat((0, auth_1.getAppUrl)()).concat(x, "/").concat(type.toLowerCase(), "/").concat(itemId, "/details");
        },
        jobDetail: function (id) { return "".concat((0, auth_1.getAppUrl)()).concat(x, "/job/").concat(id, "/details"); }
    }
};
var removeSubdomain = function (url) {
    if (!url)
        return "localhost:3000";
    var parts = url.split("/")[0].split(".");
    var domain = parts.slice(-2).join(".");
    return domain;
};
exports.removeSubdomain = removeSubdomain;
var getPrivateUrl = function (path) {
    return "/file/preview/private/".concat(path);
};
exports.getPrivateUrl = getPrivateUrl;
var getStoragePath = function (bucket, path) {
    return "".concat(auth_1.SUPABASE_URL, "/storage/v1/object/public/").concat(bucket, "/").concat(path);
};
exports.getStoragePath = getStoragePath;
var requestReferrer = function (request) {
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
