"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortPickModal = ShortPickModal;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
function ShortPickModal(_a) {
    var pickingListId = _a.pickingListId, lineId = _a.lineId, itemName = _a.itemName, quantityToPick = _a.quantityToPick, quantityPicked = _a.quantityPicked, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(quantityPicked > 0 ? quantityPicked : quantityToPick), quantity = _b[0], setQuantity = _b[1];
    var submitted = (0, react_2.useRef)(false);
    var isSubmitting = fetcher.state !== "idle";
    (0, react_2.useEffect)(function () {
        if (submitted.current && fetcher.state === "idle") {
            onClose();
        }
    }, [fetcher.state, onClose]);
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" action={path_1.path.to.pickingListLineQuantity(pickingListId)} validator={inventory_models_1.pickQuantityValidator} defaultValues={{
            pickingListLineId: lineId,
            quantity: quantity,
            markShort: "true"
        }} fetcher={fetcher} onSubmit={function () {
            submitted.current = true;
        }}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Short pick ", ""], ["Short pick ", ""])), itemName)}</react_1.ModalTitle>
            <react_1.ModalDescription>
              <macro_1.Trans>How many were actually picked?</macro_1.Trans>
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <form_1.Hidden name="pickingListLineId"/>
            <form_1.Hidden name="markShort" value="true"/>
            <form_1.NumberControlled name="quantity" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Picked quantity"], ["Picked quantity"])))} value={quantity} onChange={setQuantity} minValue={0} maxValue={quantityToPick}/>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="submit" isLoading={isSubmitting}>
              <macro_1.Trans>Mark Short</macro_1.Trans>
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
exports.default = ShortPickModal;
var templateObject_1, templateObject_2;
