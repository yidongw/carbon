"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressBlock = void 0;
var renderer_1 = require("@react-pdf/renderer");
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
var tw = (0, react_pdf_tailwind_1.createTw)({
    theme: {
        fontFamily: {
            sans: ["Inter", "Helvetica", "Arial", "sans-serif"]
        }
    }
});
/**
 * Render the address portion of a party block: name (bold), address lines, and
 * combined city/state/postal/country. Returns a Fragment so callers can wrap
 * it in their own <View> and add extra lines (Tax ID, VAT, contact info, etc.)
 * as siblings. AddressBlock is address-only by design.
 */
var AddressBlock = function (_a) {
    var name = _a.name, addressLine1 = _a.addressLine1, addressLine2 = _a.addressLine2, city = _a.city, stateProvince = _a.stateProvince, postalCode = _a.postalCode, country = _a.country;
    var stateAndPostal = [stateProvince, postalCode].filter(Boolean).join(" ");
    return (<>
      {name && <renderer_1.Text style={tw("font-bold")}>{name}</renderer_1.Text>}
      {addressLine1 && <renderer_1.Text>{addressLine1}</renderer_1.Text>}
      {addressLine2 && <renderer_1.Text>{addressLine2}</renderer_1.Text>}
      {city && <renderer_1.Text>{city}</renderer_1.Text>}
      {stateAndPostal && <renderer_1.Text>{stateAndPostal}</renderer_1.Text>}
      {country && <renderer_1.Text>{country}</renderer_1.Text>}
    </>);
};
exports.AddressBlock = AddressBlock;
