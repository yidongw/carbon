"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSupplierSidebar = useSupplierSidebar;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useSupplierSidebar(_a) {
    var contacts = _a.contacts, locations = _a.locations;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("supplierId not found");
    return [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Details"], ["Details"]))),
            to: path_1.path.to.supplierDetails(supplierId),
            icon: <lu_1.LuBuilding />,
            shortcut: "Command+Shift+d"
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Contacts"], ["Contacts"]))),
            to: path_1.path.to.supplierContacts(supplierId),
            role: ["employee"],
            count: contacts,
            icon: <lu_1.LuContact />,
            shortcut: "Command+Shift+c"
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Locations"], ["Locations"]))),
            to: path_1.path.to.supplierLocations(supplierId),
            role: ["employee", "supplier"],
            count: locations,
            icon: <lu_1.LuMapPin />,
            shortcut: "Command+Shift+l"
        },
        {
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Payment"], ["Payment"]))),
            to: path_1.path.to.supplierPayment(supplierId),
            role: ["employee"],
            icon: <lu_1.LuCreditCard />,
            shortcut: "Command+Shift+p"
        },
        {
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Tax"], ["Tax"]))),
            to: path_1.path.to.supplierTax(supplierId),
            role: ["employee"],
            icon: <lu_1.LuReceipt />,
            shortcut: "Command+Shift+t"
        },
        {
            name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Shipping"], ["Shipping"]))),
            to: path_1.path.to.supplierShipping(supplierId),
            role: ["employee"],
            icon: <lu_1.LuTruck />,
            shortcut: "Command+Shift+s"
        },
        {
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Processes"], ["Processes"]))),
            to: path_1.path.to.supplierProcesses(supplierId),
            role: ["employee"],
            icon: <lu_1.LuCog />,
            shortcut: "Command+Shift+r"
        },
        {
            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Default Attachments"], ["Default Attachments"]))),
            to: path_1.path.to.supplierDefaultAttachments(supplierId),
            role: ["employee"],
            icon: <lu_1.LuFiles />
        },
        {
            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Risks"], ["Risks"]))),
            to: path_1.path.to.supplierRisks(supplierId),
            role: ["employee"],
            icon: <lu_1.LuShieldAlert />
        },
        {
            name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
            to: "".concat(path_1.path.to.supplierQuotes, "?filter=supplierId:eq:").concat(supplierId),
            icon: <lu_1.LuPackageSearch />
        },
        {
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Orders"], ["Orders"]))),
            to: "".concat(path_1.path.to.purchaseOrders, "?filter=supplierId:eq:").concat(supplierId),
            icon: <lu_1.LuLayoutList />
        },
        {
            name: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Invoices"], ["Invoices"]))),
            to: "".concat(path_1.path.to.purchaseInvoices, "?filter=supplierId:eq:").concat(supplierId),
            icon: <lu_1.LuCreditCard />
        }
        // {
        //   name: t`Shipping`,
        //   to: path.to.supplierShipping(supplierId),
        //   role: ["employee"],
        //   icon: <LuTruck />,
        //   shortcut: "Command+Shift+s",
        // },
        // {
        //   name: t`Accounting`,
        //   to: path.to.supplierAccounting(supplierId),
        //   role: ["employee"],
        //   icon: <LuLandmark />,
        //   shortcut: "Command+Shift+a",
        // },
    ].filter(function (item) {
        return item.role === undefined ||
            item.role.some(function (role) { return permissions.is(role); });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
