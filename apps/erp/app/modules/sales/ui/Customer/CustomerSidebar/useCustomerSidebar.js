"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomerSidebar = useCustomerSidebar;
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function useCustomerSidebar(_a) {
    var contacts = _a.contacts, locations = _a.locations;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var customerId = (0, react_router_1.useParams)().customerId;
    if (!customerId)
        throw new Error("customerId not found");
    return [
        {
            name: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Details"], ["Details"]))),
            to: path_1.path.to.customerDetails(customerId),
            icon: <lu_1.LuBuilding />,
            shortcut: "Command+Shift+d"
        },
        {
            name: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Contacts"], ["Contacts"]))),
            to: path_1.path.to.customerContacts(customerId),
            role: ["employee"],
            count: contacts,
            icon: <lu_1.LuContact />,
            shortcut: "Command+Shift+c"
        },
        {
            name: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Locations"], ["Locations"]))),
            to: path_1.path.to.customerLocations(customerId),
            role: ["employee", "customer"],
            count: locations,
            icon: <lu_1.LuMapPin />,
            shortcut: "Command+Shift+l"
        },
        {
            name: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Payment"], ["Payment"]))),
            to: path_1.path.to.customerPayment(customerId),
            role: ["employee"],
            icon: <lu_1.LuCreditCard />,
            shortcut: "Command+Shift+p"
        },
        {
            name: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Tax"], ["Tax"]))),
            to: path_1.path.to.customerTax(customerId),
            role: ["employee"],
            icon: <lu_1.LuReceipt />,
            shortcut: "Command+Shift+t"
        },
        {
            name: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Shipping"], ["Shipping"]))),
            to: path_1.path.to.customerShipping(customerId),
            role: ["employee"],
            icon: <lu_1.LuTruck />,
            shortcut: "Command+Shift+s"
        },
        {
            name: t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Risks"], ["Risks"]))),
            to: path_1.path.to.customerRisks(customerId),
            role: ["employee"],
            icon: <lu_1.LuShieldAlert />
        },
        {
            name: t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["RFQs"], ["RFQs"]))),
            to: "".concat(path_1.path.to.salesRfqs, "?filter=customerId:eq:").concat(customerId),
            role: ["employee"],
            icon: <ri_1.RiProgress2Line />
        },
        {
            name: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Quotes"], ["Quotes"]))),
            to: "".concat(path_1.path.to.quotes, "?filter=customerId:eq:").concat(customerId),
            role: ["employee"],
            icon: <ri_1.RiProgress4Line />
        },
        {
            name: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Orders"], ["Orders"]))),
            to: "".concat(path_1.path.to.salesOrders, "?filter=customerId:eq:").concat(customerId),
            role: ["employee"],
            icon: <ri_1.RiProgress8Line />
        },
        {
            name: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Invoices"], ["Invoices"]))),
            to: "".concat(path_1.path.to.salesInvoices, "?filter=customerId:eq:").concat(customerId),
            icon: <lu_1.LuCreditCard />
        }
        // {
        //   name: "Accounting",
        //   to: path.to.customerAccounting(customerId),
        //   role: ["employee"],
        //   icon: <LuLandmark />,
        //   shortcut: "Command+Shift+a",
        // },
    ].filter(function (item) {
        return item.role === undefined ||
            item.role.some(function (role) { return permissions.is(role); });
    });
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
