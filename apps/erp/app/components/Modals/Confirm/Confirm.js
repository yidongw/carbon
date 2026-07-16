"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Confirm = function (_a) {
    var _b, _c;
    var action = _a.action, _d = _a.isOpen, isOpen = _d === void 0 ? true : _d, title = _a.title, text = _a.text, _e = _a.confirmText, confirmText = _e === void 0 ? "Confirm" : _e, onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
            submitted.current = false;
        }
    }, [fetcher.state, onSubmit]);
    (0, react_2.useEffect)(function () {
        var _a, _b, _c, _d;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === true && ((_b = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _b === void 0 ? void 0 : _b.message)) {
            react_1.toast.success(fetcher.data.message);
        }
        if (((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success) === false && ((_d = fetcher === null || fetcher === void 0 ? void 0 : fetcher.data) === null || _d === void 0 ? void 0 : _d.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message, (_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success]);
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>{title}</react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <p className="text-sm text-muted-foreground">{text}</p>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            Cancel
          </react_1.Button>
          <fetcher.Form method="post" action={action} onSubmit={function () { return (submitted.current = true); }}>
            <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit">
              {confirmText}
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = Confirm;
