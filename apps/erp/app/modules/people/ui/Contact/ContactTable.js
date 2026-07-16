"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var macro_1 = require("@lingui/react/macro");
var react_1 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var ContactTable = (0, react_1.memo)(function (_a) {
    var data = _a.data, count = _a.count;
    var t = (0, macro_1.useLingui)().t;
    var columns = (0, react_1.useMemo)(function () {
        return [
            {
                accessorKey: "firstName",
                header: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["First Name"], ["First Name"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "lastName",
                header: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Last Name"], ["Last Name"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuUser />
                }
            },
            {
                accessorKey: "email",
                header: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Email"], ["Email"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuMail />
                }
            },
            {
                accessorKey: "mobilePhone",
                header: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Mobile Phone"], ["Mobile Phone"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuPhone />
                }
            },
            {
                accessorKey: "workPhone",
                header: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Work Phone"], ["Work Phone"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuPhone />
                }
            },
            {
                accessorKey: "homePhone",
                header: t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Home Phone"], ["Home Phone"]))),
                cell: function (item) { return item.getValue(); },
                meta: {
                    icon: <lu_1.LuPhone />
                }
            }
        ];
    }, [t]);
    return (<components_1.Table count={count} columns={columns} data={data} defaultColumnPinning={{
            left: ["Select"]
        }} title={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Contacts"], ["Contacts"])))} table="contact"/>);
});
ContactTable.displayName = "ContactTable";
exports.default = ContactTable;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
