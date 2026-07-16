"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var ConfirmDelete = function (_a) {
    var action = _a.action, _b = _a.isOpen, isOpen = _b === void 0 ? true : _b, name = _a.name, text = _a.text, _c = _a.deleteText, deleteText = _c === void 0 ? "Delete" : _c, onCancel = _a.onCancel, onSubmit = _a.onSubmit;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" && submitted.current) {
            onSubmit === null || onSubmit === void 0 ? void 0 : onSubmit();
            submitted.current = false;
        }
    }, [fetcher.state, onSubmit]);
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Delete ", ""], ["Delete ", ""])), name)}</react_1.ModalTitle>
        </react_1.ModalHeader>

        <react_1.ModalBody>
          <p className="text-sm text-muted-foreground">{text}</p>
        </react_1.ModalBody>

        <react_1.ModalFooter>
          <react_1.Button variant="secondary" onClick={onCancel}>
            <macro_1.Trans>Cancel</macro_1.Trans>
          </react_1.Button>
          <fetcher.Form method="post" action={action} onSubmit={function () { return (submitted.current = true); }}>
            <react_1.Button variant="destructive" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit">
              {deleteText}
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = ConfirmDelete;
var templateObject_1;
