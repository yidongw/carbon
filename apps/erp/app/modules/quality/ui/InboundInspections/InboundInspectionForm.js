"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var quality_models_1 = require("~/modules/quality/quality.models");
var statusOptions = [
    { value: "Passed", label: "Pass" },
    { value: "Failed", label: "Fail" }
];
var InboundInspectionForm = function (_a) {
    var inspectionId = _a.inspectionId, itemReadableId = _a.itemReadableId, itemName = _a.itemName, serialOrBatch = _a.serialOrBatch, receiptReadableId = _a.receiptReadableId, receiverId = _a.receiverId, currentUserId = _a.currentUserId, enforceFourEyes = _a.enforceFourEyes, disabled = _a.disabled, _b = _a.open, open = _b === void 0 ? true : _b, action = _a.action, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var fetcher = (0, react_router_1.useFetcher)();
    var showFourEyesWarning = enforceFourEyes && !!receiverId && receiverId === currentUserId;
    var canUpdate = permissions.can("update", "quality");
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open={open} onOpenChange={function (next) {
            if (!next)
                onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm method="post" action={action} validator={quality_models_1.inboundInspectionValidator} defaultValues={{
            id: inspectionId,
            status: undefined,
            notes: ""
        }} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                <macro_1.Trans>Inspect</macro_1.Trans> {itemReadableId}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <react_1.VStack spacing={4} className="w-full">
                <div className="grid grid-cols-2 gap-4 w-full text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      <macro_1.Trans>Item</macro_1.Trans>
                    </div>
                    <div className="font-medium">{itemReadableId}</div>
                    <div className="text-muted-foreground">{itemName}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      <macro_1.Trans>Serial / Batch</macro_1.Trans>
                    </div>
                    <div className="font-medium">{serialOrBatch || "—"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      <macro_1.Trans>Receipt</macro_1.Trans>
                    </div>
                    <div className="font-medium">{receiptReadableId}</div>
                  </div>
                </div>

                {showFourEyesWarning && (<react_1.Alert variant="warning">
                    <lu_1.LuTriangleAlert className="size-4"/>
                    <react_1.AlertTitle>
                      <macro_1.Trans>You received this item</macro_1.Trans>
                    </react_1.AlertTitle>
                    <react_1.AlertDescription>
                      <macro_1.Trans>
                        Company policy asks for a different person to inspect
                        inbound items than the one who received them.
                      </macro_1.Trans>
                    </react_1.AlertDescription>
                  </react_1.Alert>)}

                <Form_1.Select name="status" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Disposition"], ["Disposition"])))} options={statusOptions}/>

                <Form_1.TextArea name="notes" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack spacing={2}>
                <react_1.Button variant="secondary" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <Form_1.Submit isDisabled={disabled || !canUpdate}>
                  <macro_1.Trans>Submit Inspection</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = InboundInspectionForm;
var templateObject_1, templateObject_2;
