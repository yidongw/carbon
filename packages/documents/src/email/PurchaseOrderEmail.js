"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@carbon/utils");
var components_1 = require("@react-email/components");
var purchase_order_1 = require("../utils/purchase-order");
var shared_1 = require("../utils/shared");
var Theme_1 = require("./components/Theme");
var PurchaseOrderEmail = function (_a) {
    var _b;
    var company = _a.company, locale = _a.locale, purchaseOrder = _a.purchaseOrder, purchaseOrderLines = _a.purchaseOrderLines, purchaseOrderLocations = _a.purchaseOrderLocations, recipient = _a.recipient, sender = _a.sender, paymentTerms = _a.paymentTerms;
    var deliveryName = purchaseOrderLocations.deliveryName, deliveryAddressLine1 = purchaseOrderLocations.deliveryAddressLine1, deliveryAddressLine2 = purchaseOrderLocations.deliveryAddressLine2, deliveryCity = purchaseOrderLocations.deliveryCity, deliveryStateProvince = purchaseOrderLocations.deliveryStateProvince, deliveryPostalCode = purchaseOrderLocations.deliveryPostalCode, deliveryCountryName = purchaseOrderLocations.deliveryCountryName, dropShipment = purchaseOrderLocations.dropShipment, customerName = purchaseOrderLocations.customerName, customerAddressLine1 = purchaseOrderLocations.customerAddressLine1, customerAddressLine2 = purchaseOrderLocations.customerAddressLine2, customerCity = purchaseOrderLocations.customerCity, customerStateProvince = purchaseOrderLocations.customerStateProvince, customerPostalCode = purchaseOrderLocations.customerPostalCode, customerCountryName = purchaseOrderLocations.customerCountryName;
    var formatter = (0, shared_1.getCurrencyFormatter)((_b = company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD", locale);
    var preview = (<components_1.Preview>{"".concat(purchaseOrder.purchaseOrderId, " from ").concat(company.name)}</components_1.Preview>);
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    var lightStyles = (0, Theme_1.getEmailInlineStyles)("light");
    var paymentTerm = paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.find(function (term) { return term.id === purchaseOrder.paymentTermId; });
    return (<Theme_1.EmailThemeProvider preview={preview}>
      <components_1.Body className={"my-auto mx-auto font-sans ".concat(themeClasses.body)} style={lightStyles.body}>
        <components_1.Container className={"mx-auto py-5 px-0 w-[660px] max-w-full ".concat(themeClasses.container)} style={{
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: lightStyles.container.borderColor
        }}>
          <components_1.Section>
            <components_1.Row>
              <components_1.Column>
                {company.logoLightIcon ? (<components_1.Img src={company.logoLightIcon} width="auto" height="42" alt={"".concat(company.name, " Logo")}/>) : (<components_1.Text className={"text-3xl font-bold ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
                    {company.name}
                  </components_1.Text>)}
              </components_1.Column>
              <components_1.Column className="text-right">
                <components_1.Text className={"text-3xl font-light ".concat(themeClasses.mutedText)} style={{ color: lightStyles.mutedText.color }}>
                  Purchase Order
                </components_1.Text>
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>
          <components_1.Section>
            <components_1.Text className={"text-left text-sm font-medium ".concat(themeClasses.text, " my-9")} style={{ color: lightStyles.text.color }}>
              {recipient.firstName ? "Hi ".concat(recipient.firstName, ", ") : "Hi, "}
              please see the attached purchase order and let me know if you have
              any questions.
            </components_1.Text>
          </components_1.Section>
          <components_1.Section className="bg-gray-50 rounded-lg text-xs">
            <components_1.Row>
              <components_1.Column className="p-5" colSpan={2}>
                <components_1.Section>
                  {paymentTerm && (<components_1.Row>
                      <components_1.Column>
                        <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                          Payment Terms
                        </components_1.Text>
                        <components_1.Text>{paymentTerm.name}</components_1.Text>
                      </components_1.Column>
                    </components_1.Row>)}
                  <components_1.Row>
                    <components_1.Column>
                      <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                        Order ID
                      </components_1.Text>
                      <components_1.Text>{purchaseOrder.purchaseOrderId}</components_1.Text>
                    </components_1.Column>
                    <components_1.Column>
                      <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                        Requested Date
                      </components_1.Text>
                      <components_1.Text>
                        {purchaseOrder.receiptRequestedDate
            ? (0, utils_1.formatDate)(purchaseOrder.receiptRequestedDate, undefined, locale)
            : "-"}
                      </components_1.Text>
                    </components_1.Column>
                  </components_1.Row>
                </components_1.Section>
              </components_1.Column>
              <components_1.Column className="p-5" colSpan={2}>
                <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px]")} style={{ color: lightStyles.mutedText.color }}>
                  Ship To
                </components_1.Text>
                {dropShipment ? (<>
                    <components_1.Text>{customerName}</components_1.Text>
                    {customerAddressLine1 && (<components_1.Text>{customerAddressLine1}</components_1.Text>)}
                    {customerAddressLine2 && (<components_1.Text>{customerAddressLine2}</components_1.Text>)}
                    <components_1.Text>
                      {(0, utils_1.formatCityStatePostalCode)(customerCity, customerStateProvince, customerPostalCode)}
                    </components_1.Text>
                    <components_1.Text>{customerCountryName}</components_1.Text>
                  </>) : (<>
                    <components_1.Text>{company.name}</components_1.Text>
                    <components_1.Text>{deliveryName}</components_1.Text>
                    {deliveryAddressLine1 && (<components_1.Text>{deliveryAddressLine1}</components_1.Text>)}
                    {deliveryAddressLine2 && (<components_1.Text>{deliveryAddressLine2}</components_1.Text>)}
                    <components_1.Text>
                      {(0, utils_1.formatCityStatePostalCode)(deliveryCity, deliveryStateProvince, deliveryPostalCode)}
                    </components_1.Text>
                    <components_1.Text>{deliveryCountryName}</components_1.Text>
                  </>)}
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>
          <components_1.Section className="mt-8 mb-4">
            <components_1.Text className={"".concat(themeClasses.mutedText, " uppercase text-[10px] pl-5")} style={{ color: lightStyles.mutedText.color }}>
              Purchase Order Lines
            </components_1.Text>
          </components_1.Section>
          <components_1.Section>
            {purchaseOrderLines.map(function (line) {
            var _a;
            return (<components_1.Row key={line.id} className="mb-2.5 pl-5">
                <components_1.Column>
                  <components_1.Text className="text-xs font-semibold">
                    {(0, purchase_order_1.getLineDescription)(line)}
                  </components_1.Text>
                  {(_a = (0, purchase_order_1.getLineDescriptionDetails)(line)) === null || _a === void 0 ? void 0 : _a.split("\n").map(function (l, i) { return (<components_1.Text key={i} className={"text-xs ".concat(themeClasses.mutedText)} style={{ color: lightStyles.mutedText.color }}>
                        {l}
                      </components_1.Text>); })}
                </components_1.Column>
                <components_1.Column className="text-right pr-5 align-top w-[100px]">
                  <components_1.Text className="text-xs font-semibold">
                    {line.purchaseOrderLineType === "Comment"
                    ? ""
                    : "(".concat(line.purchaseQuantity, " ").concat(line.purchaseUnitOfMeasureCode, ")")}
                  </components_1.Text>
                </components_1.Column>
                <components_1.Column className="text-right pr-5 align-top w-[100px]">
                  <components_1.Text className="text-xs font-semibold">
                    {line.purchaseOrderLineType === "Comment"
                    ? "-"
                    : line.unitPrice
                        ? formatter.format(line.unitPrice)
                        : "-"}
                  </components_1.Text>
                </components_1.Column>
              </components_1.Row>);
        })}
          </components_1.Section>
          <components_1.Hr className="my-8"/>
          <components_1.Section className="text-right">
            <components_1.Row>
              <components_1.Column className="pr-8">
                <components_1.Text className={"text-[10px] font-semibold ".concat(themeClasses.mutedText)} style={{ color: lightStyles.mutedText.color }}>
                  TOTAL
                </components_1.Text>
              </components_1.Column>
              <components_1.Column className="border-l border-gray-200 h-12"></components_1.Column>
              <components_1.Column className="w-[90px] pr-5">
                <components_1.Text className="text-base font-semibold whitespace-nowrap">
                  {formatter.format((0, purchase_order_1.getTotal)(purchaseOrderLines))}
                </components_1.Text>
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>
          <components_1.Hr className="mb-20"/>
          <components_1.Section>
            <components_1.Row>
              <components_1.Column className="text-center">
                {company.logoLightIcon ? (<components_1.Img src={company.logoLightIcon} width="60" height="auto" alt={"".concat(company.name, " Logo")}/>) : (<components_1.Text className={"text-3xl font-bold ".concat(themeClasses.text)} style={{ color: lightStyles.text.color }}>
                    {company.name}
                  </components_1.Text>)}
              </components_1.Column>
            </components_1.Row>
          </components_1.Section>
        </components_1.Container>
      </components_1.Body>
    </Theme_1.EmailThemeProvider>);
};
exports.default = PurchaseOrderEmail;
