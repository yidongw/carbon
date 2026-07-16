"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartiesBlock = PartiesBlock;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../components");
var tw_1 = require("./tw");
function PartiesBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var salesInvoice = data.salesInvoice, salesInvoiceShipment = data.salesInvoiceShipment, salesInvoiceLocations = data.salesInvoiceLocations, salesOrderIds = data.salesOrderIds, paymentTerms = data.paymentTerms, shippingMethods = data.shippingMethods, locale = data.locale;
    var customerName = salesInvoiceLocations.customerName, customerAddressLine1 = salesInvoiceLocations.customerAddressLine1, customerAddressLine2 = salesInvoiceLocations.customerAddressLine2, customerCity = salesInvoiceLocations.customerCity, customerStateProvince = salesInvoiceLocations.customerStateProvince, customerPostalCode = salesInvoiceLocations.customerPostalCode, customerCountryName = salesInvoiceLocations.customerCountryName, customerTaxId = salesInvoiceLocations.customerTaxId, customerVatNumber = salesInvoiceLocations.customerVatNumber, customerEori = salesInvoiceLocations.customerEori, invoiceCustomerName = salesInvoiceLocations.invoiceCustomerName, invoiceAddressLine1 = salesInvoiceLocations.invoiceAddressLine1, invoiceAddressLine2 = salesInvoiceLocations.invoiceAddressLine2, invoiceCity = salesInvoiceLocations.invoiceCity, invoiceStateProvince = salesInvoiceLocations.invoiceStateProvince, invoicePostalCode = salesInvoiceLocations.invoicePostalCode, invoiceCountryName = salesInvoiceLocations.invoiceCountryName, shipmentCustomerName = salesInvoiceLocations.shipmentCustomerName, shipmentAddressLine1 = salesInvoiceLocations.shipmentAddressLine1, shipmentAddressLine2 = salesInvoiceLocations.shipmentAddressLine2, shipmentCity = salesInvoiceLocations.shipmentCity, shipmentStateProvince = salesInvoiceLocations.shipmentStateProvince, shipmentPostalCode = salesInvoiceLocations.shipmentPostalCode, shipmentCountryName = salesInvoiceLocations.shipmentCountryName;
    var paymentTerm = paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.find(function (term) { return term.id === (salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.paymentTermId); });
    var shippingMethod = shippingMethods === null || shippingMethods === void 0 ? void 0 : shippingMethods.find(function (method) { return method.id === (salesInvoiceShipment === null || salesInvoiceShipment === void 0 ? void 0 : salesInvoiceShipment.shippingMethodId); });
    return (
    /* Body row — Bill To (left) | Invoice Details + Ship To stacked (right) */
    <renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        {/* LEFT — Bill To (the customer being invoiced) */}
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Bill To
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[9px] text-gray-800")}>
            <components_1.AddressBlock name={invoiceCustomerName !== null && invoiceCustomerName !== void 0 ? invoiceCustomerName : customerName} addressLine1={invoiceAddressLine1 !== null && invoiceAddressLine1 !== void 0 ? invoiceAddressLine1 : customerAddressLine1} addressLine2={invoiceAddressLine2 !== null && invoiceAddressLine2 !== void 0 ? invoiceAddressLine2 : customerAddressLine2} city={invoiceCity !== null && invoiceCity !== void 0 ? invoiceCity : customerCity} stateProvince={invoiceStateProvince !== null && invoiceStateProvince !== void 0 ? invoiceStateProvince : customerStateProvince} postalCode={invoicePostalCode !== null && invoicePostalCode !== void 0 ? invoicePostalCode : customerPostalCode} country={invoiceCountryName !== null && invoiceCountryName !== void 0 ? invoiceCountryName : customerCountryName}/>
            {customerTaxId &&
            !(0, utils_1.isEoriCountry)(invoiceCountryName !== null && invoiceCountryName !== void 0 ? invoiceCountryName : customerCountryName) && (<renderer_1.Text>Tax ID: {customerTaxId}</renderer_1.Text>)}
            {customerVatNumber && <renderer_1.Text>VAT: {customerVatNumber}</renderer_1.Text>}
            {customerEori && <renderer_1.Text>EORI: {customerEori}</renderer_1.Text>}
          </renderer_1.View>
        </renderer_1.View>

        {/* RIGHT — Invoice Details + Ship To stacked */}
        <renderer_1.View style={tw("w-1/2 flex flex-col")}>
          {/* Invoice Details — Due Date prominent */}
          <renderer_1.View style={tw(shipmentCustomerName ? "p-3 border-b border-gray-200" : "p-3")}>
            <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
              Invoice Details
            </renderer_1.Text>
            <renderer_1.View style={tw("text-[9px] text-gray-800")}>
              {(salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.dateIssued) && (<renderer_1.Text>
                  Date Issued:{" "}
                  {(0, utils_1.formatDate)(salesInvoice.dateIssued, undefined, locale)}
                </renderer_1.Text>)}
              {(salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.dateDue) && (<renderer_1.Text style={tw("font-bold")}>
                  Due Date:{" "}
                  {(0, utils_1.formatDate)(salesInvoice.dateDue, undefined, locale)}
                </renderer_1.Text>)}
              {(salesInvoice === null || salesInvoice === void 0 ? void 0 : salesInvoice.customerReference) && (<renderer_1.Text>Customer Ref: {salesInvoice.customerReference}</renderer_1.Text>)}
              {salesOrderIds && salesOrderIds.length > 0 && (<renderer_1.Text>
                  {salesOrderIds.length > 1
                ? "Sales Orders: "
                : "Sales Order: "}
                  {salesOrderIds.join(", ")}
                </renderer_1.Text>)}
              {paymentTerm && <renderer_1.Text>Payment Terms: {paymentTerm.name}</renderer_1.Text>}
              {shippingMethod && <renderer_1.Text>Shipping: {shippingMethod.name}</renderer_1.Text>}
              {(salesInvoiceShipment === null || salesInvoiceShipment === void 0 ? void 0 : salesInvoiceShipment.shippingTermId) && (<renderer_1.Text>
                  Shipping Terms: {salesInvoiceShipment.shippingTermId}
                </renderer_1.Text>)}
              {(salesInvoiceShipment === null || salesInvoiceShipment === void 0 ? void 0 : salesInvoiceShipment.incoterm) && (<renderer_1.Text>
                  Incoterm: {salesInvoiceShipment.incoterm}
                  {salesInvoiceShipment.incotermLocation
                ? " \u2014 ".concat(salesInvoiceShipment.incotermLocation)
                : ""}
                </renderer_1.Text>)}
            </renderer_1.View>
          </renderer_1.View>

          {/* Ship To — only when shipment has a distinct address (not falling back to customer's main address) */}
          {shipmentCustomerName && (<renderer_1.View style={tw("p-3")}>
              <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
                Ship To
              </renderer_1.Text>
              <renderer_1.View style={tw("text-[9px] text-gray-800")}>
                <components_1.AddressBlock name={shipmentCustomerName} addressLine1={shipmentAddressLine1} addressLine2={shipmentAddressLine2} city={shipmentCity} stateProvince={shipmentStateProvince} postalCode={shipmentPostalCode} country={shipmentCountryName}/>
              </renderer_1.View>
            </renderer_1.View>)}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
