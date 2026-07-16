"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var PurchaseInvoiceVoidModal = function (_a) {
    var onClose = _a.onClose;
    var invoiceId = (0, react_router_1.useParams)().invoiceId;
    if (!invoiceId)
        throw new Error("invoiceId not found");
    var navigation = (0, react_router_1.useNavigation)();
    var fetcher = (0, react_router_1.useFetcher)();
    var submitted = (0, react_2.useRef)(false);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useIsomorphicLayoutEffect)(function () {
        if (fetcher.state === "loading" && submitted.current) {
            submitted.current = false;
            onClose();
        }
    }, [fetcher.state]);
    return (<react_1.Modal open={true} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalOverlay />
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Void Purchase Invoice</macro_1.Trans>
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            <macro_1.Trans>
              Are you sure you want to void this purchase invoice? This action
              will reverse all financial transactions and cannot be undone.
            </macro_1.Trans>
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          <react_1.Alert variant="destructive">
            <lu_1.LuTriangleAlert className="h-4 w-4"/>
            <react_1.AlertTitle>
              <macro_1.Trans>Warning</macro_1.Trans>
            </react_1.AlertTitle>
            <react_1.AlertDescription>
              <macro_1.Trans>Voiding this purchase invoice will:</macro_1.Trans>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>
                  <macro_1.Trans>Reverse all journal and cost ledger entries</macro_1.Trans>
                </li>
                <li>
                  <macro_1.Trans>
                    Reverse any item ledger entries from this invoice
                  </macro_1.Trans>
                </li>
                <li>
                  <macro_1.Trans>Update the purchase order quantities</macro_1.Trans>
                </li>
                <li>
                  <macro_1.Trans>Leave any related receipts untouched</macro_1.Trans>
                </li>
              </ul>
            </react_1.AlertDescription>
          </react_1.Alert>
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.HStack>
            <react_1.Button variant="solid" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <fetcher.Form action={path_1.path.to.purchaseInvoiceVoid(invoiceId)} method="post" onSubmit={function () {
            submitted.current = true;
        }}>
              <react_1.Button variant="destructive" isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" || navigation.state !== "idle"} type="submit">
                <macro_1.Trans>Void Invoice</macro_1.Trans>
              </react_1.Button>
            </fetcher.Form>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = PurchaseInvoiceVoidModal;
