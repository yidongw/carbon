"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartiesBlock = PartiesBlock;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
function PartiesBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var salesOrder = data.salesOrder, salesOrderLocations = data.salesOrderLocations, paymentTerms = data.paymentTerms, shippingMethods = data.shippingMethods, locale = data.locale;
    var customerName = salesOrderLocations.customerName, customerAddressLine1 = salesOrderLocations.customerAddressLine1, customerAddressLine2 = salesOrderLocations.customerAddressLine2, customerCity = salesOrderLocations.customerCity, customerStateProvince = salesOrderLocations.customerStateProvince, customerPostalCode = salesOrderLocations.customerPostalCode, customerCountryName = salesOrderLocations.customerCountryName, customerTaxId = salesOrderLocations.customerTaxId, customerVatNumber = salesOrderLocations.customerVatNumber, customerEori = salesOrderLocations.customerEori, paymentCustomerName = salesOrderLocations.paymentCustomerName, paymentAddressLine1 = salesOrderLocations.paymentAddressLine1, paymentAddressLine2 = salesOrderLocations.paymentAddressLine2, paymentCity = salesOrderLocations.paymentCity, paymentStateProvince = salesOrderLocations.paymentStateProvince, paymentPostalCode = salesOrderLocations.paymentPostalCode, paymentCountryName = salesOrderLocations.paymentCountryName;
    var paymentTerm = paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.find(function (term) { return term.id === (salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.paymentTermId); });
    var shippingMethod = shippingMethods === null || shippingMethods === void 0 ? void 0 : shippingMethods.find(function (method) { return method.id === (salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.shippingMethodId); });
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        {/* LEFT — Customer block */}
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Customer
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[9px] text-gray-800")}>
            <components_1.AddressBlock name={customerName} addressLine1={customerAddressLine1} addressLine2={customerAddressLine2} city={customerCity} stateProvince={customerStateProvince} postalCode={customerPostalCode} country={customerCountryName}/>
            {customerTaxId && !(0, utils_1.isEoriCountry)(customerCountryName) && (<renderer_1.Text>Tax ID: {customerTaxId}</renderer_1.Text>)}
            {customerVatNumber && <renderer_1.Text>VAT: {customerVatNumber}</renderer_1.Text>}
            {customerEori && <renderer_1.Text>EORI: {customerEori}</renderer_1.Text>}
          </renderer_1.View>
        </renderer_1.View>

        {/* RIGHT — Order Details + Bill To stacked */}
        <renderer_1.View style={tw("w-1/2 flex flex-col")}>
          <renderer_1.View style={tw(paymentCustomerName ? "p-3 border-b border-gray-200" : "p-3")}>
            <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
              Order Details
            </renderer_1.Text>
            <renderer_1.View style={tw("text-[9px] text-gray-800")}>
              {(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.orderDate) && (<renderer_1.Text>
                  Date: {(0, utils_1.formatDate)(salesOrder.orderDate, undefined, locale)}
                </renderer_1.Text>)}
              {(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.customerReference) && (<renderer_1.Text>Customer Ref: {salesOrder.customerReference}</renderer_1.Text>)}
              {(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.receiptRequestedDate) && (<renderer_1.Text>
                  Requested:{" "}
                  {(0, utils_1.formatDate)(salesOrder.receiptRequestedDate, undefined, locale)}
                </renderer_1.Text>)}
              {(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.receiptPromisedDate) && (<renderer_1.Text>
                  Promised:{" "}
                  {(0, utils_1.formatDate)(salesOrder.receiptPromisedDate, undefined, locale)}
                </renderer_1.Text>)}
              {paymentTerm && <renderer_1.Text>Payment Terms: {paymentTerm.name}</renderer_1.Text>}
              {shippingMethod && <renderer_1.Text>Shipping: {shippingMethod.name}</renderer_1.Text>}
              {(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.shippingTermName) && (<renderer_1.Text>Shipping Terms: {salesOrder.shippingTermName}</renderer_1.Text>)}
              {(salesOrder === null || salesOrder === void 0 ? void 0 : salesOrder.incoterm) && (<renderer_1.Text>
                  Incoterm: {salesOrder.incoterm}
                  {salesOrder.incotermLocation
                ? " \u2014 ".concat(salesOrder.incotermLocation)
                : ""}
                </renderer_1.Text>)}
            </renderer_1.View>
          </renderer_1.View>

          {paymentCustomerName && (<renderer_1.View style={tw("p-3")}>
              <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
                Bill To
              </renderer_1.Text>
              <renderer_1.View style={tw("text-[9px] text-gray-800")}>
                <components_1.AddressBlock name={paymentCustomerName} addressLine1={paymentAddressLine1} addressLine2={paymentAddressLine2} city={paymentCity} stateProvince={paymentStateProvince} postalCode={paymentPostalCode} country={paymentCountryName}/>
              </renderer_1.View>
            </renderer_1.View>)}
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
