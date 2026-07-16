"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submit = void 0;
exports.DefaultDisabledSubmit = DefaultDisabledSubmit;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var hooks_1 = require("../hooks");
var formStateContext_1 = require("../internal/formStateContext");
var userFacingFormContext_1 = require("../userFacingFormContext");
function DefaultDisabledSubmit(_a) {
    var children = _a.children, formId = _a.formId, isDisabled = _a.isDisabled;
    var touchedFields = (0, userFacingFormContext_1.useFormContext)(formId).touchedFields;
    var isTouched = Object.keys(touchedFields).length > 0;
    return (<exports.Submit formId={formId} isDisabled={!isTouched || isDisabled}>
      {children}
    </exports.Submit>);
}
exports.Submit = (0, react_2.forwardRef)(function (_a, ref) {
    var formId = _a.formId, children = _a.children, isDisabledProp = _a.isDisabled, _b = _a.withBlocker, withBlocker = _b === void 0 ? true : _b, props = __rest(_a, ["formId", "children", "isDisabled", "withBlocker"]);
    var formStateCtx = (0, formStateContext_1.useFormStateContext)();
    var isDisabled = formStateCtx.isDisabled || formStateCtx.isReadOnly || isDisabledProp;
    var isSubmitting = (0, hooks_1.useIsSubmitting)(formId);
    var transition = (0, react_router_1.useNavigation)();
    var isIdle = transition.state === "idle";
    var formState = (0, form_1.useFormState)(formId);
    var isTouched = Object.keys(formState.touchedFields).length > 0;
    var blocker = (0, react_router_1.useBlocker)(function (_a) {
        var currentLocation = _a.currentLocation, nextLocation = _a.nextLocation;
        return withBlocker &&
            isTouched &&
            currentLocation.pathname !== nextLocation.pathname;
    });
    return (<>
        <react_1.Button ref={ref} form={formId} type="submit" disabled={isDisabled || isSubmitting} isLoading={isSubmitting} isDisabled={isDisabled || isSubmitting || !isIdle} {...props}>
          {children}
        </react_1.Button>
        {blocker.state === "blocked" && (<react_1.Modal open onOpenChange={function (open) { return !open && blocker.reset(); }}>
            <react_1.ModalContent>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Unsaved changes</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>Are you sure you want to leave this page?</macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" onClick={function () { return blocker.reset(); }}>
                  <macro_1.Trans>Stay on this page</macro_1.Trans>
                </react_1.Button>
                <react_1.Button onClick={function () { return blocker.proceed(); }}>
                  <macro_1.Trans>Leave this page</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </react_1.ModalContent>
          </react_1.Modal>)}
      </>);
});
exports.Submit.displayName = "Submit";
exports.default = exports.Submit;
