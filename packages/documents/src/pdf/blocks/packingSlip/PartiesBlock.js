"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartiesBlock = PartiesBlock;
var utils_1 = require("@carbon/utils");
var renderer_1 = require("@react-pdf/renderer");
var tw_1 = require("../tw");
/** Ship-To address + Shipment details (date, source doc, customer PO, tracking). */
function PartiesBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var customer = data.customer, shippingAddress = data.shippingAddress, shipment = data.shipment, sourceDocument = data.sourceDocument, sourceDocumentId = data.sourceDocumentId, customerReference = data.customerReference, locale = data.locale;
    var _b = shippingAddress !== null && shippingAddress !== void 0 ? shippingAddress : {}, addressLine1 = _b.addressLine1, addressLine2 = _b.addressLine2, city = _b.city, stateProvince = _b.stateProvince, postalCode = _b.postalCode, countryCode = _b.countryCode;
    return (<renderer_1.View style={tw("border border-gray-200 mb-4")}>
      <renderer_1.View style={tw("flex flex-row")}>
        <renderer_1.View style={tw("w-1/2 p-3 border-r border-gray-200")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Ship To
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[10px] text-gray-800")}>
            {customer.name && (<renderer_1.Text style={tw("font-bold")}>{customer.name}</renderer_1.Text>)}
            {addressLine1 && <renderer_1.Text style={tw("mt-1")}>{addressLine1}</renderer_1.Text>}
            {addressLine2 && <renderer_1.Text>{addressLine2}</renderer_1.Text>}
            {city && <renderer_1.Text>{city}</renderer_1.Text>}
            {(stateProvince || postalCode) && (<renderer_1.Text>
                {[stateProvince, postalCode].filter(Boolean).join(" ")}
              </renderer_1.Text>)}
            {countryCode && <renderer_1.Text>{countryCode}</renderer_1.Text>}
          </renderer_1.View>
        </renderer_1.View>
        <renderer_1.View style={tw("w-1/2 p-3")}>
          <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
            Shipment Details
          </renderer_1.Text>
          <renderer_1.View style={tw("text-[10px] text-gray-800")}>
            {(shipment === null || shipment === void 0 ? void 0 : shipment.postingDate) && (<renderer_1.Text>
                Date: {(0, utils_1.formatDate)(shipment.postingDate, undefined, locale)}
              </renderer_1.Text>)}
            {sourceDocument && sourceDocumentId && (<renderer_1.Text>
                {sourceDocument}: {sourceDocumentId}
              </renderer_1.Text>)}
            {customerReference && (<renderer_1.Text>Customer PO #: {customerReference}</renderer_1.Text>)}
            {(shipment === null || shipment === void 0 ? void 0 : shipment.trackingNumber) && (<renderer_1.Text>Tracking: {shipment.trackingNumber}</renderer_1.Text>)}
          </renderer_1.View>
        </renderer_1.View>
      </renderer_1.View>
    </renderer_1.View>);
}
