"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var PurchaseInvoicePostModal = function (_a) {
    var _b;
    var isOpen = _a.isOpen, onClose = _a.onClose, invoiceId = _a.invoiceId, linesToReceive = _a.linesToReceive;
    var items = (0, stores_1.useItems)()[0];
    var navigate = (0, react_router_1.useNavigate)();
    var hasLinesToReceive = linesToReceive.length > 0;
    var hasTrackedItems = (0, react_2.useMemo)(function () {
        return linesToReceive.some(function (line) {
            var item = items.find(function (i) { return i.id === line.itemId; });
            return ((item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Serial" ||
                (item === null || item === void 0 ? void 0 : item.itemTrackingType) === "Batch");
        });
    }, [linesToReceive, items]);
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            if (fetcher.data.receiptId) {
                navigate(path_1.path.to.receipt(fetcher.data.receiptId));
            }
            onClose();
        }
        else if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false && ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.message)) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success]);
    return (<react_1.Modal open={isOpen} onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            <macro_1.Trans>Post Invoice</macro_1.Trans>
          </react_1.ModalTitle>
        </react_1.ModalHeader>
        <react_1.ModalBody>
          {hasLinesToReceive ? (<div className="gap-4 w-full flex flex-col">
              {hasTrackedItems ? (<>
                  <p>
                    Are you sure you want to post this invoice? A receipt will
                    be created for:
                  </p>
                  <react_1.Alert variant="destructive">
                    <lu_1.LuTriangleAlert className="h-4 w-4"/>
                    <react_1.AlertTitle>
                      <macro_1.Trans>Serial or Batch Tracking Required</macro_1.Trans>
                    </react_1.AlertTitle>
                    <react_1.AlertDescription>
                      Some items require serial or batch tracking. The receipt
                      will be created but not posted. You will be redirected to
                      the receipt to enter tracking information.
                    </react_1.AlertDescription>
                  </react_1.Alert>
                </>) : (<p>
                  Are you sure you want to post this invoice? A receipt will be
                  automatically created and posted for:
                </p>)}
              <react_1.Table>
                <react_1.Thead>
                  <react_1.Tr>
                    <react_1.Th>
                      <macro_1.Trans>Item</macro_1.Trans>
                    </react_1.Th>
                    <react_1.Th className="text-right">Quantity</react_1.Th>
                  </react_1.Tr>
                </react_1.Thead>
                <react_1.Tbody>
                  {linesToReceive.map(function (line) {
                var _a;
                return (<react_1.Tr key={line.itemId} className="text-sm">
                      <react_1.Td>
                        <react_1.VStack spacing={0}>
                          <span>
                            {(_a = (0, utils_1.getItemReadableId)(items, line.itemId)) !== null && _a !== void 0 ? _a : ""}
                          </span>
                          {line.description && (<span className="text-xs text-muted-foreground">
                              {line.description}
                            </span>)}
                        </react_1.VStack>
                      </react_1.Td>
                      <react_1.Td className="text-right">{line.quantity}</react_1.Td>
                    </react_1.Tr>);
            })}
                </react_1.Tbody>
              </react_1.Table>
            </div>) : (<p>Are you sure you want to post this invoice?</p>)}
        </react_1.ModalBody>
        <react_1.ModalFooter>
          <react_1.HStack>
            <react_1.Button variant="solid" onClick={onClose}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <fetcher.Form method="post" action={path_1.path.to.purchaseInvoicePost(invoiceId)}>
              {hasTrackedItems && (<input type="hidden" name="skipReceiptPost" value="true"/>)}
              <react_1.Button isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} type="submit">
                {hasLinesToReceive
            ? hasTrackedItems
                ? "Post and Create Receipt"
                : "Post and Receive Invoice"
            : "Post Invoice"}
              </react_1.Button>
            </fetcher.Form>
          </react_1.HStack>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = PurchaseInvoicePostModal;
