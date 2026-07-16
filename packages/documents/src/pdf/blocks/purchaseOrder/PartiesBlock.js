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
    var purchaseOrder = data.purchaseOrder, purchaseOrderLocations = data.purchaseOrderLocations, paymentTerms = data.paymentTerms, company = data.company, accountsPayableBillingAddress = data.accountsPayableBillingAddress, currencyCode = data.currencyCode, locale = data.locale;
    var supplierName = purchaseOrderLocations.supplierName, supplierAddressLine1 = purchaseOrderLocations.supplierAddressLine1, supplierAddressLine2 = purchaseOrderLocations.supplierAddressLine2, supplierCity = purchaseOrderLocations.supplierCity, supplierStateProvince = purchaseOrderLocations.supplierStateProvince, supplierPostalCode = purchaseOrderLocations.supplierPostalCode, supplierCountryCode = purchaseOrderLocations.supplierCountryCode, supplierCountryName = purchaseOrderLocations.supplierCountryName, deliveryName = purchaseOrderLocations.deliveryName, deliveryAddressLine1 = purchaseOrderLocations.deliveryAddressLine1, deliveryAddressLine2 = purchaseOrderLocations.deliveryAddressLine2, deliveryCity = purchaseOrderLocations.deliveryCity, deliveryStateProvince = purchaseOrderLocations.deliveryStateProvince, deliveryPostalCode = purchaseOrderLocations.deliveryPostalCode, deliveryCountryCode = purchaseOrderLocations.deliveryCountryCode, deliveryCountryName = purchaseOrderLocations.deliveryCountryName, dropShipment = purchaseOrderLocations.dropShipment, customerName = purchaseOrderLocations.customerName, customerAddressLine1 = purchaseOrderLocations.customerAddressLine1, customerAddressLine2 = purchaseOrderLocations.customerAddressLine2, customerCity = purchaseOrderLocations.customerCity, customerStateProvince = purchaseOrderLocations.customerStateProvince, customerPostalCode = purchaseOrderLocations.customerPostalCode, customerCountryCode = purchaseOrderLocations.customerCountryCode, customerCountryName = purchaseOrderLocations.customerCountryName;
    var paymentTerm = paymentTerms === null || paymentTerms === void 0 ? void 0 : paymentTerms.find(function (term) { return term.id === (purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.paymentTermId); });
    var shipAddress = dropShipment
        ? {
            name: customerName,
            addressLine1: customerAddressLine1,
            addressLine2: customerAddressLine2,
            city: customerCity,
            stateProvince: customerStateProvince,
            postalCode: customerPostalCode,
            country: customerCountryName !== null && customerCountryName !== void 0 ? customerCountryName : customerCountryCode
        }
        : {
            name: deliveryName,
            addressLine1: deliveryAddressLine1,
            addressLine2: deliveryAddressLine2,
            city: deliveryCity,
            stateProvince: deliveryStateProvince,
            postalCode: deliveryPostalCode,
            country: deliveryCountryName !== null && deliveryCountryName !== void 0 ? deliveryCountryName : deliveryCountryCode
        };
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        {/* LEFT — Supplier */}
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Supplier
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[9px] text-gray-800")}>
            <components_1.AddressBlock name={supplierName} addressLine1={supplierAddressLine1} addressLine2={supplierAddressLine2} city={supplierCity} stateProvince={supplierStateProvince} postalCode={supplierPostalCode} country={supplierCountryName !== null && supplierCountryName !== void 0 ? supplierCountryName : supplierCountryCode}/>
            {purchaseOrderLocations.supplierTaxId &&
            !(0, utils_1.isEoriCountry)(supplierCountryCode) && (<renderer_1.Text>Tax ID: {purchaseOrderLocations.supplierTaxId}</renderer_1.Text>)}
            {purchaseOrderLocations.supplierVatNumber && (<renderer_1.Text>VAT: {purchaseOrderLocations.supplierVatNumber}</renderer_1.Text>)}
            {purchaseOrderLocations.supplierEori && (<renderer_1.Text>EORI: {purchaseOrderLocations.supplierEori}</renderer_1.Text>)}
            {purchaseOrderLocations.supplierContactName && (<renderer_1.Text>Contact: {purchaseOrderLocations.supplierContactName}</renderer_1.Text>)}
            {purchaseOrderLocations.supplierContactEmail && (<renderer_1.Text>Email: {purchaseOrderLocations.supplierContactEmail}</renderer_1.Text>)}
          </renderer_1.View>
        </renderer_1.View>

        {/* RIGHT — Order Info + Deliver To */}
        <renderer_1.View style={tw("w-1/2 flex flex-col")}>
          <renderer_1.View style={tw("p-3 border-b border-gray-200")}>
            <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
              Order Info
            </renderer_1.Text>
            <renderer_1.View style={tw("text-[9px] text-gray-800")}>
              {(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.purchaseOrderId) && (<renderer_1.Text>PO Number: {purchaseOrder.purchaseOrderId}</renderer_1.Text>)}
              {(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.orderDate) && (<renderer_1.Text>
                  Date: {(0, utils_1.formatDate)(purchaseOrder.orderDate, undefined, locale)}
                </renderer_1.Text>)}
              <renderer_1.Text>Currency: {currencyCode}</renderer_1.Text>
              {(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.supplierReference) && (<renderer_1.Text>Reference: {purchaseOrder.supplierReference}</renderer_1.Text>)}
              {(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.receiptRequestedDate) && (<renderer_1.Text>
                  Requested:{" "}
                  {(0, utils_1.formatDate)(purchaseOrder.receiptRequestedDate, undefined, locale)}
                </renderer_1.Text>)}
              {(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.receiptPromisedDate) && (<renderer_1.Text>
                  Promised:{" "}
                  {(0, utils_1.formatDate)(purchaseOrder.receiptPromisedDate, undefined, locale)}
                </renderer_1.Text>)}
              {paymentTerm && <renderer_1.Text>Payment Terms: {paymentTerm.name}</renderer_1.Text>}
              {(purchaseOrder === null || purchaseOrder === void 0 ? void 0 : purchaseOrder.incoterm) && (<renderer_1.Text>
                  Incoterm: {purchaseOrder.incoterm}
                  {purchaseOrder.incotermLocation
                ? " \u2014 ".concat(purchaseOrder.incotermLocation)
                : ""}
                </renderer_1.Text>)}
            </renderer_1.View>
            <renderer_1.View style={tw("h-[1px] bg-gray-200 my-2")}/>
            <renderer_1.View style={tw("text-[9px] text-gray-800")}>
              {company.vatNumber && <renderer_1.Text>VAT: {company.vatNumber}</renderer_1.Text>}
              {(function () {
            var _a, _b, _c, _d, _e, _f;
            var name = (_b = (_a = purchaseOrder.assigneeFullName) !== null && _a !== void 0 ? _a : purchaseOrder.accountManagerFullName) !== null && _b !== void 0 ? _b : purchaseOrder.createdByFullName;
            var email = (_d = (_c = purchaseOrder.assigneeEmail) !== null && _c !== void 0 ? _c : purchaseOrder.accountManagerEmail) !== null && _d !== void 0 ? _d : purchaseOrder.createdByEmail;
            var phone = (_f = (_e = purchaseOrder.assigneePhone) !== null && _e !== void 0 ? _e : purchaseOrder.accountManagerPhone) !== null && _f !== void 0 ? _f : purchaseOrder.createdByPhone;
            return (<>
                    {name && <renderer_1.Text>Contact: {name}</renderer_1.Text>}
                    {email && <renderer_1.Text>Email: {email}</renderer_1.Text>}
                    {phone && <renderer_1.Text>Phone: {phone}</renderer_1.Text>}
                  </>);
        })()}
              {(accountsPayableBillingAddress === null || accountsPayableBillingAddress === void 0 ? void 0 : accountsPayableBillingAddress.email) && (<>
                  <renderer_1.Text style={tw("font-bold mt-1")}>
                    Billing documents and enquiries:
                  </renderer_1.Text>
                  <renderer_1.Text style={tw("font-bold")}>
                    {accountsPayableBillingAddress.email}
                  </renderer_1.Text>
                </>)}
            </renderer_1.View>
          </renderer_1.View>

          <renderer_1.View style={tw("p-3")}>
            <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
              Deliver To
            </renderer_1.Text>
            <renderer_1.View style={tw("text-[9px] text-gray-800")}>
              <components_1.AddressBlock {...shipAddress}/>
            </renderer_1.View>
          </renderer_1.View>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
