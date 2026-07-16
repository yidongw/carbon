"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProductionJobPicker = useProductionJobPicker;
var react_1 = require("react");
var react_router_1 = require("react-router");
var noopSetJobId = function (_nextJobId) { };
/** Refetch create-route loader data when the user picks a different job in an overlay form. */
function useProductionJobPicker(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    var _o = _a.enabled, enabled = _o === void 0 ? true : _o, loaderPath = _a.loaderPath, jobIdProp = _a.jobIdProp, initialJobId = _a.initialJobId, _p = _a.operationOptions, operationOptions = _p === void 0 ? [] : _p, configurationParameters = _a.configurationParameters, configReferenceSource = _a.configReferenceSource, itemId = _a.itemId, processId = _a.processId, operationType = _a.operationType, defaultActorKind = _a.defaultActorKind, lockActorSelection = _a.lockActorSelection, supplierId = _a.supplierId;
    var seededJobId = (jobIdProp === null || jobIdProp === void 0 ? void 0 : jobIdProp.trim()) || (initialJobId === null || initialJobId === void 0 ? void 0 : initialJobId.trim()) || "";
    var _q = (0, react_1.useState)(seededJobId), selectedJobId = _q[0], setSelectedJobIdState = _q[1];
    var userChangedJob = (0, react_1.useRef)(false);
    var cascadeFetcher = (0, react_router_1.useFetcher)();
    var loadCascade = (0, react_1.useRef)(cascadeFetcher.load);
    loadCascade.current = cascadeFetcher.load;
    (0, react_1.useEffect)(function () {
        if (!enabled)
            return;
        if (!selectedJobId)
            return;
        if (!userChangedJob.current && selectedJobId === seededJobId)
            return;
        var params = new URLSearchParams({
            overlay: "true",
            jobId: selectedJobId
        });
        void loadCascade.current("".concat(loaderPath, "?").concat(params.toString()));
    }, [enabled, selectedJobId, seededJobId, loaderPath]);
    var setSelectedJobId = enabled
        ? function (nextJobId) {
            userChangedJob.current = true;
            setSelectedJobIdState(nextJobId);
        }
        : noopSetJobId;
    var cascadeMatchesJob = ((_b = cascadeFetcher.data) === null || _b === void 0 ? void 0 : _b.jobId) === selectedJobId;
    var cascadeData = enabled && userChangedJob.current && cascadeMatchesJob
        ? cascadeFetcher.data
        : undefined;
    var isCascadeLoading = enabled &&
        userChangedJob.current &&
        (!cascadeMatchesJob || cascadeFetcher.state !== "idle");
    return {
        selectedJobId: enabled ? selectedJobId : seededJobId,
        setSelectedJobId: setSelectedJobId,
        isCascadeLoading: isCascadeLoading,
        operationOptions: (_c = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.operationOptions) !== null && _c !== void 0 ? _c : operationOptions,
        configurationParameters: (_d = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.configurationParameters) !== null && _d !== void 0 ? _d : configurationParameters,
        configReferenceSource: (_e = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.configReferenceSource) !== null && _e !== void 0 ? _e : configReferenceSource,
        itemId: (_f = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.itemId) !== null && _f !== void 0 ? _f : itemId,
        processId: (_g = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.processId) !== null && _g !== void 0 ? _g : processId,
        operationType: (_h = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.operationType) !== null && _h !== void 0 ? _h : operationType,
        defaultActorKind: (_j = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.defaultActorKind) !== null && _j !== void 0 ? _j : defaultActorKind,
        lockActorSelection: (_l = (_k = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.lockActorSelection) !== null && _k !== void 0 ? _k : lockActorSelection) !== null && _l !== void 0 ? _l : false,
        supplierId: (_m = cascadeData === null || cascadeData === void 0 ? void 0 : cascadeData.supplierId) !== null && _m !== void 0 ? _m : supplierId
    };
}
