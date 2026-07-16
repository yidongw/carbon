"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStorageRuleViolations = useStorageRuleViolations;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var violation_modal_1 = require("./violation-modal");
/**
 * Centralised handler for item rule violations + action errors.
 *
 * Wraps a `useFetcher` and:
 * - toasts any `error.message` returned by the action
 * - opens `<StorageRuleViolationModal>` when the action returns `violations`
 * - re-posts the last form data with `acknowledged=true` when the user
 *   clicks "Acknowledge & continue"
 * - resets the dismissed/ack flags on every fresh submission
 *
 * Call sites only have to swap `fetcher.submit(...)` for `rules.submit(...)`
 * and render `<rules.ViolationModal />`. Everything else is wired internally.
 */
function useStorageRuleViolations(_a) {
    var _b;
    var action = _a.action, onSuccess = _a.onSuccess;
    var fetcher = (0, react_router_1.useFetcher)();
    var lastSubmissionRef = (0, react_2.useRef)(null);
    // Tracks whether a submission was issued but onSuccess hasn't fired yet.
    // Server actions that respond with `throw redirect(...)` leave
    // `fetcher.data` undefined after the request settles, so we can't rely on
    // `data` alone to detect "operation succeeded".
    var pendingSuccessRef = (0, react_2.useRef)(false);
    var _c = (0, react_2.useState)(false), dismissed = _c[0], setDismissed = _c[1];
    // Staged payload for the *current* submission. We can't read `fetcher.data`
    // directly: on a redirect-throw, RR7 keeps the previous action's payload
    // attached to the fetcher, so the violation modal would stay mounted
    // forever (page reload was the only way out). Instead, we clear `staged`
    // when a new submission starts and only re-stage if `fetcher.data` is a
    // *different* reference than what we last consumed.
    var _d = (0, react_2.useState)(undefined), staged = _d[0], setStaged = _d[1];
    var lastSeenDataRef = (0, react_2.useRef)(undefined);
    // Track idle→submitting transitions so the hook resets correctly even when
    // the form submits via `fetcher={...}` prop directly (bypassing `submit()`).
    var prevIdleRef = (0, react_2.useRef)(true);
    var data = fetcher.data;
    var idle = fetcher.state === "idle";
    var violations = (_b = staged === null || staged === void 0 ? void 0 : staged.violations) !== null && _b !== void 0 ? _b : [];
    var ruleNames = staged === null || staged === void 0 ? void 0 : staged.ruleNames;
    var hasViolations = violations.length > 0 && !dismissed;
    // Detect idle→submitting. Clear the staged payload from the previous
    // submission and reset per-submission flags. Works whether the form drives
    // the fetcher via `fetcher={...}` prop or via `submit()`.
    (0, react_2.useEffect)(function () {
        if (!idle && prevIdleRef.current) {
            setDismissed(false);
            setStaged(undefined);
            pendingSuccessRef.current = true;
            if (fetcher.formData) {
                lastSubmissionRef.current = fetcher.formData;
            }
        }
        prevIdleRef.current = idle;
    }, [idle, fetcher.formData]);
    // On settle: stage the payload (if changed) and decide success/error/block
    // in one pass. Consolidated into a single effect so the success check reads
    // the fresh `data` directly — splitting it caused the success effect to see
    // a stale `staged` from the same render, firing `onSuccess` before the
    // staging effect's setState had propagated.
    // biome-ignore lint/correctness/useExhaustiveDependencies: onSuccess identity is intentionally not tracked
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (!idle)
            return;
        var dataChanged = data !== lastSeenDataRef.current;
        lastSeenDataRef.current = data;
        if (dataChanged) {
            setStaged(data);
            if ((_a = data === null || data === void 0 ? void 0 : data.error) === null || _a === void 0 ? void 0 : _a.message) {
                react_1.toast.error(data.error.message);
                pendingSuccessRef.current = false;
                return;
            }
            if (((_b = data === null || data === void 0 ? void 0 : data.violations) !== null && _b !== void 0 ? _b : []).length > 0) {
                // Violations — keep modal open, don't fire success.
                return;
            }
            if (!pendingSuccessRef.current)
                return;
            pendingSuccessRef.current = false;
            onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
            return;
        }
        // Data ref unchanged across the submission → redirect-throw success.
        // `staged` was cleared at submit-start; nothing to render.
        if (!pendingSuccessRef.current)
            return;
        pendingSuccessRef.current = false;
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
    }, [idle, data]);
    var submit = (0, react_2.useCallback)(function (formData) {
        lastSubmissionRef.current = formData;
        // Reset the dismiss flag synchronously so the next response opens the
        // modal even if the previous one was dismissed without new violations.
        setDismissed(false);
        pendingSuccessRef.current = true;
        fetcher.submit(formData, { method: "post", action: action });
    }, [fetcher, action]);
    var acknowledge = (0, react_2.useCallback)(function () {
        if (!lastSubmissionRef.current)
            return;
        var formData = new FormData();
        for (var _i = 0, _a = lastSubmissionRef.current.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], k = _b[0], v = _b[1];
            formData.append(k, v);
        }
        formData.set("acknowledged", "true");
        setDismissed(false);
        pendingSuccessRef.current = true;
        fetcher.submit(formData, { method: "post", action: action });
    }, [fetcher, action]);
    var cancel = (0, react_2.useCallback)(function () { return setDismissed(true); }, []);
    var ViolationModal = (0, react_2.useCallback)(function () {
        if (!hasViolations)
            return null;
        return (<violation_modal_1.default violations={violations} ruleNames={ruleNames} isSubmitting={!idle} onCancel={cancel} onAcknowledge={acknowledge}/>);
    }, [hasViolations, violations, ruleNames, idle, cancel, acknowledge]);
    return { fetcher: fetcher, submit: submit, ViolationModal: ViolationModal };
}
