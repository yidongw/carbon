"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredOverlay = RegisteredOverlay;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var configTableShared_1 = require("~/modules/production/ui/Jobs/configTableShared");
var completeOverlayConfirm_1 = require("./completeOverlayConfirm");
var overlay_registry_1 = require("./overlay.registry");
var overlayModalContentClassName = configTableShared_1.configParamsModalContentClassName;
function RegisteredOverlay(_a) {
    var _b, _c;
    var instance = _a.instance, stackIndex = _a.stackIndex, onClose = _a.onClose;
    var i18n = (0, macro_1.useLingui)().i18n;
    var entry = (0, overlay_registry_1.getOverlayRegistryEntry)(instance.overlayId);
    var confirmMode = (_b = entry === null || entry === void 0 ? void 0 : entry.confirmMode) !== null && _b !== void 0 ? _b : "server";
    var loadFetcher = (0, react_router_1.useFetcher)({ key: "overlay-load-".concat(instance.id) });
    var submitFetcher = (0, react_router_1.useFetcher)({ key: "overlay-submit-".concat(instance.id) });
    var prevSubmitState = (0, react_2.useRef)(submitFetcher.state);
    var loadOverlay = (0, react_2.useRef)(loadFetcher.load);
    loadOverlay.current = loadFetcher.load;
    var handleConfirmSuccess = (0, react_2.useCallback)(function (data) {
        (0, completeOverlayConfirm_1.completeOverlayConfirm)({
            data: data,
            instance: instance,
            confirmMode: confirmMode,
            onClose: onClose,
            i18n: i18n
        });
    }, [confirmMode, instance, onClose, i18n]);
    (0, react_2.useEffect)(function () {
        void loadOverlay.current(instance.url);
    }, [instance.url]);
    // A read-only overlay's data is fetched once, so inline mutations inside it
    // (e.g. changing an assignee) don't refresh it. Re-load the overlay whenever an
    // outside mutation fetcher settles, so it reflects the change without reopening.
    // Excludes this overlay's own submit (handled via confirm) and GET loads.
    var fetchers = (0, react_router_1.useFetchers)();
    var pendingMutations = fetchers.filter(function (f) {
        return f.state !== "idle" &&
            f.formMethod &&
            f.formMethod.toUpperCase() !== "GET" &&
            f.key !== "overlay-submit-".concat(instance.id);
    }).length;
    var prevPendingMutations = (0, react_2.useRef)(pendingMutations);
    (0, react_2.useEffect)(function () {
        if (prevPendingMutations.current > 0 && pendingMutations === 0) {
            void loadOverlay.current(instance.url);
        }
        prevPendingMutations.current = pendingMutations;
    }, [pendingMutations, instance.url]);
    (0, react_2.useEffect)(function () {
        if (confirmMode !== "server")
            return;
        var prev = prevSubmitState.current;
        prevSubmitState.current = submitFetcher.state;
        // Fetchers go submitting → loading → idle when the action revalidates loaders.
        if ((prev === "submitting" || prev === "loading") &&
            submitFetcher.state === "idle") {
            handleConfirmSuccess(submitFetcher.data);
        }
    }, [
        confirmMode,
        submitFetcher.state,
        submitFetcher.data,
        handleConfirmSuccess
    ]);
    if (!entry)
        return null;
    var Content = entry.render;
    var zIndex = 50 + stackIndex * 10;
    var isLoading = loadFetcher.data === undefined && loadFetcher.state !== "idle";
    var contentProps = {
        loaderData: loadFetcher.data,
        props: (_c = instance.props) !== null && _c !== void 0 ? _c : {},
        isLoading: isLoading,
        url: instance.url,
        close: function () { return onClose(instance.id); },
        onCreated: instance.onCreated,
        submitFetcher: submitFetcher,
        confirmMode: confirmMode,
        onConfirmSuccess: handleConfirmSuccess
    };
    if (entry.type === "modal") {
        return (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    onClose(instance.id);
            }}>
        <react_1.ModalContent stackZIndex={zIndex} className={overlayModalContentClassName}>
          <Content {...contentProps}/>
        </react_1.ModalContent>
      </react_1.Modal>);
    }
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose(instance.id);
        }}>
      <react_1.DrawerContent style={{ zIndex: zIndex }} onOpenAutoFocus={function (event) {
            if (isLoading)
                event.preventDefault();
        }}>
        <Content {...contentProps}/>
      </react_1.DrawerContent>
    </react_1.Drawer>);
}
