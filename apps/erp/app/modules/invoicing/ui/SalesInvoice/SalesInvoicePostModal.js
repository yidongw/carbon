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
var Form_1 = require("~/components/Form");
var useIntegrations_1 = require("~/hooks/useIntegrations");
var path_1 = require("~/utils/path");
var invoicing_models_1 = require("../../invoicing.models");
var SalesInvoicePostModal = function (_a) {
    var _b;
    var fetcher = _a.fetcher, isOpen = _a.isOpen, onClose = _a.onClose, invoiceId = _a.invoiceId, linesToShip = _a.linesToShip, customerId = _a.customerId, customerContactId = _a.customerContactId, _c = _a.defaultCc, defaultCc = _c === void 0 ? [] : _c;
    var t = (0, macro_1.useLingui)().t;
    var hasLinesToShip = linesToShip.length > 0;
    var integrations = (0, useIntegrations_1.useIntegrations)();
    var canEmail = integrations.has("email");
    var _d = (0, react_2.useState)(canEmail ? "Email" : "None"), notificationType = _d[0], setNotificationType = _d[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
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
        <form_1.ValidatedForm method="post" validator={invoicing_models_1.salesInvoicePostValidator} action={path_1.path.to.salesInvoicePost(invoiceId)} defaultValues={{
            notification: notificationType,
            customerContact: customerContactId !== null && customerContactId !== void 0 ? customerContactId : undefined,
            cc: defaultCc
        }} fetcher={fetcher}>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              <macro_1.Trans>Post Invoice</macro_1.Trans>
            </react_1.ModalTitle>
            <react_1.ModalDescription>
              {hasLinesToShip ? (<>
                  A shipment will be automatically created and posted for the
                  items below.
                </>) : (<>Are you sure you want to post this invoice?</>)}
            </react_1.ModalDescription>
          </react_1.ModalHeader>
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              {hasLinesToShip && (<div className="w-full">
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
                      {linesToShip.map(function (line) { return (<react_1.Tr key={line.itemId} className="text-sm">
                          <react_1.Td>
                            <react_1.VStack spacing={0}>
                              <span>{line.itemReadableId}</span>
                              {line.description && (<span className="text-xs text-muted-foreground">
                                  {line.description}
                                </span>)}
                            </react_1.VStack>
                          </react_1.Td>
                          <react_1.Td className="text-right">{line.quantity}</react_1.Td>
                        </react_1.Tr>); })}
                    </react_1.Tbody>
                  </react_1.Table>
                </div>)}

              {canEmail && (<Form_1.SelectControlled label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Send Via"], ["Send Via"])))} name="notification" options={[
                {
                    label: "None",
                    value: "None"
                },
                {
                    label: "Email",
                    value: "Email"
                }
            ]} value={notificationType} onChange={function (t) {
                if (t)
                    setNotificationType(t.value);
            }}/>)}

              {notificationType === "Email" && (<>
                  <Form_1.CustomerContact name="customerContact" customer={customerId !== null && customerId !== void 0 ? customerId : undefined}/>
                  <Form_1.EmailRecipients name="cc" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["CC"], ["CC"])))} type="employee"/>
                </>)}
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button isDisabled={fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} type="submit">
                {hasLinesToShip ? "Post and Ship Invoice" : "Post Invoice"}
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
};
exports.default = SalesInvoicePostModal;
var templateObject_1, templateObject_2;
