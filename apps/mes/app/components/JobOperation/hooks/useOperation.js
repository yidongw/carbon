"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.useOperation = useOperation;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useOperation(_a) {
    var operation = _a.operation, events = _a.events, trackedEntities = _a.trackedEntities, pauseInterval = _a.pauseInterval, procedure = _a.procedure;
    var t = (0, macro_1.useLingui)().t;
    var params = (0, hooks_1.useUrlParams)()[0];
    var trackedEntityParam = params.get("trackedEntityId");
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var _b = (0, auth_1.useCarbon)(), carbon = _b.carbon, accessToken = _b.accessToken;
    var user = (0, hooks_1.useUser)();
    var revalidator = (0, react_router_1.useRevalidator)();
    // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
    var channelRef = (0, react_2.useRef)(null);
    var actionsSheet = (0, react_1.useDisclosure)();
    var scrapModal = (0, react_1.useDisclosure)();
    var reworkModal = (0, react_1.useDisclosure)();
    var completeModal = (0, react_1.useDisclosure)();
    var finishModal = (0, react_1.useDisclosure)();
    var issueModal = (0, react_1.useDisclosure)();
    var serialModal = (0, react_1.useDisclosure)();
    // we do this to avoid re-rendering when the modal is open
    var isAnyModalOpen = pauseInterval ||
        actionsSheet.isOpen ||
        scrapModal.isOpen ||
        reworkModal.isOpen ||
        completeModal.isOpen ||
        finishModal.isOpen ||
        issueModal.isOpen ||
        serialModal.isOpen;
    var _c = (0, react_2.useState)(null), selectedMaterial = _c[0], setSelectedMaterial = _c[1];
    var _d = (0, react_2.useState)("details"), activeTab = _d[0], setActiveTab = _d[1];
    var _e = (0, react_2.useState)(function () {
        if (operation.setupDuration > 0) {
            return "Setup";
        }
        if (operation.machineDuration > 0) {
            return "Machine";
        }
        return "Labor";
    }), eventType = _e[0], setEventType = _e[1];
    var _f = (0, react_2.useState)(operation), operationState = _f[0], setOperationState = _f[1];
    var _g = (0, react_2.useState)(events), eventState = _g[0], setEventState = _g[1];
    (0, react_2.useEffect)(function () {
        setEventState(events);
    }, [events]);
    (0, react_2.useEffect)(function () {
        setOperationState(operation);
    }, [operation]);
    (0, react_1.useRealtimeChannel)({
        topic: "job-operations:".concat(operation.id),
        dependencies: [operation.jobId],
        setup: function (channel) {
            return channel
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "job",
                filter: "id=eq.".concat(operation.jobId)
            }, function (payload) {
                if (payload.eventType === "UPDATE") {
                    revalidator.revalidate();
                }
            })
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "productionEvent",
                filter: "jobOperationId=eq.".concat(operation.id)
            }, function (payload) {
                switch (payload.eventType) {
                    case "INSERT":
                        var inserted_1 = payload.new;
                        setEventState(function (prevEvents) { return __spreadArray(__spreadArray([], prevEvents, true), [
                            inserted_1
                        ], false); });
                        break;
                    case "UPDATE":
                        var updated_1 = payload.new;
                        setEventState(function (prevEvents) {
                            return prevEvents.map(function (event) {
                                return event.id === updated_1.id
                                    ? __assign(__assign({}, event), updated_1)
                                    : event;
                            });
                        });
                        break;
                    case "DELETE":
                        var deleted_1 = payload.old;
                        setEventState(function (prevEvents) {
                            return prevEvents.filter(function (event) { return event.id !== deleted_1.id; });
                        });
                        break;
                    default:
                        break;
                }
            })
                .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "jobOperation",
                filter: "id=eq.".concat(operation.id)
            }, function (payload) {
                if (payload.eventType === "UPDATE") {
                    var updated_2 = payload.new;
                    setOperationState(function (prev) {
                        var _a;
                        return (__assign(__assign(__assign({}, prev), updated_2), { operationStatus: (_a = updated_2.status) !== null && _a !== void 0 ? _a : prev.operationStatus }));
                    });
                }
                else if (payload.eventType === "DELETE") {
                    react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["This operation has been deleted"], ["This operation has been deleted"]))));
                    window.location.href = path_1.path.to.operations;
                }
            });
        }
    });
    var getProgress = (0, react_2.useCallback)(function () {
        var timeNow = (0, date_1.now)((0, date_1.getLocalTimeZone)());
        return eventState.reduce(function (acc, event) {
            var _a;
            if (event.endTime && event.type) {
                acc[event.type.toLowerCase()] +=
                    ((_a = event.duration) !== null && _a !== void 0 ? _a : 0) * 1000;
            }
            else if (event.startTime && event.type) {
                var startTime = (0, date_1.toZoned)((0, date_1.parseAbsolute)(event.startTime, (0, date_1.getLocalTimeZone)()), (0, date_1.getLocalTimeZone)());
                var difference = timeNow.compare(startTime);
                if (difference > 0) {
                    acc[event.type.toLowerCase()] += difference;
                }
            }
            return acc;
        }, {
            setup: 0,
            labor: 0,
            machine: 0
        });
    }, [eventState]);
    var _h = (0, react_2.useState)(getProgress), progress = _h[0], setProgress = _h[1];
    var activeEvents = (0, react_2.useMemo)(function () {
        return {
            setupProductionEvent: events.find(function (e) {
                return e.type === "Setup" && e.endTime === null && e.employeeId === user.id;
            }),
            laborProductionEvent: events.find(function (e) {
                return e.type === "Labor" && e.endTime === null && e.employeeId === user.id;
            }),
            machineProductionEvent: eventState.find(function (e) { return e.type === "Machine" && e.endTime === null; })
        };
    }, [eventState, events, user.id]);
    var active = (0, react_2.useMemo)(function () {
        return {
            setup: !!activeEvents.setupProductionEvent,
            labor: !!activeEvents.laborProductionEvent,
            machine: !!activeEvents.machineProductionEvent
        };
    }, [activeEvents]);
    (0, react_1.useInterval)(function () {
        setProgress(getProgress());
    }, (active.setup || active.labor || active.machine) && !isAnyModalOpen
        ? 1000
        : null);
    var operationId = (0, react_router_1.useParams)().operationId;
    var _j = (0, react_2.useState)([]), availableEntities = _j[0], setAvailableEntities = _j[1];
    // show the serial selector with the remaining serial numbers for the operation
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (trackedEntityParam)
            return;
        var uncompletedEntities = trackedEntities.filter(function (entity) {
            var _a;
            return !("Operation ".concat(operationId) in
                ((_a = entity.attributes) !== null && _a !== void 0 ? _a : {}));
        });
        if (uncompletedEntities.length > 0)
            serialModal.onOpen();
        setAvailableEntities(uncompletedEntities);
        // causes an infinite loop on navigation
    }, [trackedEntities, trackedEntityParam]);
    return __assign(__assign({ active: active, availableEntities: availableEntities, hasActiveEvents: progress.setup > 0 || progress.labor > 0 || progress.machine > 0 }, activeEvents), { progress: progress, operation: operationState, actionsSheet: actionsSheet, activeTab: activeTab, eventType: eventType, scrapModal: scrapModal, reworkModal: reworkModal, completeModal: completeModal, finishModal: finishModal, issueModal: issueModal, serialModal: serialModal, isOverdue: operation.operationDueDate
            ? new Date(operation.operationDueDate) < new Date()
            : false, selectedMaterial: selectedMaterial, setSelectedMaterial: setSelectedMaterial, setActiveTab: setActiveTab, setEventType: setEventType });
}
var templateObject_1;
