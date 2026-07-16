"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CompanyDefaultAttachmentsCard;
var macro_1 = require("@lingui/react/macro");
var DefaultAttachmentsPanel_1 = require("./DefaultAttachmentsPanel");
function CompanyDefaultAttachmentsCard(_a) {
    var files = _a.files;
    return (<DefaultAttachmentsPanel_1.default files={files} storagePathPrefix="default-attachments/company" title={<macro_1.Trans>Default Attachments</macro_1.Trans>} description={<macro_1.Trans>
          Files attached here ride along on every purchase order email by
          default. Suppliers will receive them alongside the PO PDF.
        </macro_1.Trans>}/>);
}
