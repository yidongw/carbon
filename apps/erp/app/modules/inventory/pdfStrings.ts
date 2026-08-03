import { msg } from "@lingui/core/macro";

// Keep-alive manifest for server-generated PDF labels.
//
// The packing-slip PDF (packages/documents) renders these labels through a
// plain `t(key)` lookup rather than a lingui macro, and that package isn't in
// the lingui extract globs — so without this file the extractor treats the
// strings as obsolete and drops them from the catalog (breaking PDF
// translations). Listing them here as `msg` keeps them in the erp catalog
// across extract/translate runs. The array is never used at runtime; it exists
// purely for static extraction. Keep it in sync with the PDF block labels.
export const pdfLabelStrings = [
  msg`Packing Slip`,
  msg`Shipping`,
  msg`Method`,
  msg`Payment`,
  msg`Terms`,
  msg`Ship To`,
  msg`Shipment Details`,
  msg`Date`,
  msg`Customer PO #`,
  msg`Tracking`,
  msg`Description`,
  msg`Qty`,
  msg`Serial/Batch`,
  msg`Notes`,
  msg`Standard Terms & Conditions`
];
