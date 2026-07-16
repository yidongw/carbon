"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var FinalizeRFQModal = function (_a) {
    var rfqId = _a.rfqId, lines = _a.lines, suppliers = _a.suppliers, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var fetcher = (0, react_router_1.useFetcher)();
    var isLoading = fetcher.state !== "idle";
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "loading") {
            onClose();
        }
    }, [fetcher.state, onClose]);
    // Build default values with all suppliers
    var defaultValues = {
        suppliers: suppliers.map(function (s) { return ({
            supplierId: s.supplierId,
            rfqSupplierId: s.id,
            contactId: ""
        }); })
    };
    return (<react_1.Modal open onOpenChange={function (open) {
            if (!open) {
                onClose();
            }
        }}>
      <react_1.ModalContent>
        <form_1.ValidatedForm method="post" validator={purchasing_models_1.purchasingRfqFinalizeValidator} action={path_1.path.to.purchasingRfqFinalize(rfqId)} onSuccess={onClose} defaultValues={defaultValues} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Send RFQ to Suppliers</macro_1.Trans>
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              Create supplier quotes and send quote requests to the selected
              suppliers.
            </react_1.ModalDescription>
          </react_1.ModalHeader>

          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              {!canEmail ? (<react_1.Alert variant="warning">
                  <lu_1.LuMailX className="h-4 w-4"/>
                  <react_1.AlertTitle>
                    <macro_1.Trans>Email notifications not configured</macro_1.Trans>
                  </react_1.AlertTitle>
                  <react_1.AlertDescription>
                    Configure the Resend integration to enable email
                    notifications. Supplier quotes will still be created and you
                    can share links manually.
                  </react_1.AlertDescription>
                </react_1.Alert>) : null}
              <react_1.VStack spacing={4} className="w-full">
                {suppliers.map(function (supplier, index) { return (<react_1.VStack key={supplier.id} spacing={2} className="w-full p-4 border rounded-lg">
                    <react_1.HStack className="w-full justify-between">
                      <react_1.Heading size="h4" as="h3">
                        {supplier.supplier.name}
                      </react_1.Heading>
                    </react_1.HStack>

                    <input type="hidden" name={"suppliers[".concat(index, "].supplierId")} value={supplier.supplierId}/>
                    <input type="hidden" name={"suppliers[".concat(index, "].rfqSupplierId")} value={supplier.id}/>

                    {canEmail && (<Form_1.SupplierContact name={"suppliers[".concat(index, "].contactId")} supplier={supplier.supplierId} label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Contact (optional)"], ["Contact (optional)"])))}/>)}
                  </react_1.VStack>); })}
              </react_1.VStack>

              <div className="text-sm text-muted-foreground">
                {lines.length} line item{lines.length !== 1 ? "s" : ""} will be
                included in each supplier quote.
              </div>
            </react_1.VStack>
          </react_1.ModalBody>

          <react_1.ModalFooter>
            <react_1.Button variant="secondary" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="submit" isDisabled={isLoading} isLoading={isLoading}>
              Send to {suppliers.length} Supplier
              {suppliers.length !== 1 ? "s" : ""}
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = FinalizeRFQModal;
var templateObject_1;
