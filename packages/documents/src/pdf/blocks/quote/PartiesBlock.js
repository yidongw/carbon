"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartiesBlock = PartiesBlock;
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
function PartiesBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var quote = data.quote, quoteCustomerDetails = data.quoteCustomerDetails, payment = data.payment, paymentTerms = data.paymentTerms, shipment = data.shipment, maxLeadTime = data.maxLeadTime, locale = data.locale;
    var customerName = quoteCustomerDetails.customerName, customerAddressLine1 = quoteCustomerDetails.customerAddressLine1, customerAddressLine2 = quoteCustomerDetails.customerAddressLine2, customerCity = quoteCustomerDetails.customerCity, customerStateProvince = quoteCustomerDetails.customerStateProvince, customerPostalCode = quoteCustomerDetails.customerPostalCode, customerCountryCode = quoteCustomerDetails.customerCountryCode, customerCountryName = quoteCustomerDetails.customerCountryName, customerTaxId = quoteCustomerDetails.customerTaxId, customerVatNumber = quoteCustomerDetails.customerVatNumber, customerEori = quoteCustomerDetails.customerEori, contactName = quoteCustomerDetails.contactName, contactEmail = quoteCustomerDetails.contactEmail;
    var paymentTerm = paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.find(function (pt) { return pt.id === (payment === null || payment === void 0 ? void 0 : payment.paymentTermId); });
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        {/* LEFT — To (customer) */}
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            To
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[9px] text-gray-800")}>
            <components_1.AddressBlock name={customerName} addressLine1={customerAddressLine1} addressLine2={customerAddressLine2} city={customerCity} stateProvince={customerStateProvince} postalCode={customerPostalCode} country={customerCountryName !== null && customerCountryName !== void 0 ? customerCountryName : customerCountryCode}/>
            {customerTaxId && !(0, utils_1.isEoriCountry)(customerCountryCode) && (<renderer_1.Text>Tax ID: {customerTaxId}</renderer_1.Text>)}
            {customerVatNumber && <renderer_1.Text>VAT: {customerVatNumber}</renderer_1.Text>}
            {customerEori && <renderer_1.Text>EORI: {customerEori}</renderer_1.Text>}
            {contactName && <renderer_1.Text>Contact: {contactName}</renderer_1.Text>}
            {contactEmail && <renderer_1.Text>Email: {contactEmail}</renderer_1.Text>}
          </renderer_1.View>
        </renderer_1.View>

        {/* RIGHT — Quote Details */}
        <renderer_1.View style={tw("w-1/2 p-3")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Quote Details
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[9px] text-gray-800")}>
            <renderer_1.Text>
              Date:{" "}
              {(0, utils_1.formatDate)((0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(), undefined, locale)}
            </renderer_1.Text>
            {quote.expirationDate && (<renderer_1.Text style={tw("font-bold")}>
                Expires: {(0, utils_1.formatDate)(quote.expirationDate, undefined, locale)}
              </renderer_1.Text>)}
            {quote.customerReference && (<renderer_1.Text>Reference: {quote.customerReference}</renderer_1.Text>)}
            {maxLeadTime > 0 && (<renderer_1.Text>
                Max Lead Time: {maxLeadTime} {(0, utils_1.pluralize)(maxLeadTime, "day")}
              </renderer_1.Text>)}
            {paymentTerm && <renderer_1.Text>Payment Terms: {paymentTerm.name}</renderer_1.Text>}
            {(shipment === null || shipment === void 0 ? void 0 : shipment.incoterm) && (<renderer_1.Text>
                Incoterm: {shipment.incoterm}
                {shipment.incotermLocation
                ? " \u2014 ".concat(shipment.incotermLocation)
                : ""}
              </renderer_1.Text>)}
          </renderer_1.View>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
