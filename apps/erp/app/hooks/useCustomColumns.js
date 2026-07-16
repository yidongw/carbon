"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCustomColumns = useCustomColumns;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var components_1 = require("~/components");
var Enumerable_1 = require("~/components/Enumerable");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var useCustomFieldsSchema_1 = require("./useCustomFieldsSchema");
function useCustomColumns(table) {
    var t = (0, macro_1.useLingui)().t;
    var customFieldsSchemas = (0, useCustomFieldsSchema_1.useCustomFieldsSchema)();
    var schema = customFieldsSchemas === null || customFieldsSchemas === void 0 ? void 0 : customFieldsSchemas[table];
    var people = (0, stores_1.usePeople)()[0];
    var customers = (0, stores_1.useCustomers)()[0];
    var suppliers = (0, stores_1.useSuppliers)()[0];
    // Memoized so the returned array has a stable identity across renders.
    // Tables put this in their column-builder useMemo deps; a fresh array every
    // render rebuilt the columns and remounted every cell (closing menus, etc.).
    return (0, react_2.useMemo)(function () {
        var customColumns = [];
        schema === null || schema === void 0 ? void 0 : schema.forEach(function (field) {
            var _a;
            customColumns.push({
                accessorKey: "customFields->>".concat(field.id),
                header: field.name,
                meta: {
                    icon: <ColumnIcon dataTypeId={field.dataTypeId}/>,
                    filter: field.dataTypeId === shared_1.DataType.Boolean
                        ? {
                            type: "static",
                            options: [
                                { value: "on", label: t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Yes"], ["Yes"]))) },
                                { value: "", label: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No"], ["No"]))) }
                            ]
                        }
                        : field.dataTypeId === shared_1.DataType.List
                            ? {
                                type: "static",
                                options: ((_a = field.listOptions) === null || _a === void 0 ? void 0 : _a.map(function (option) { return ({
                                    value: option,
                                    label: <Enumerable_1.Enumerable value={option}/>
                                }); })) || []
                            }
                            : field.dataTypeId === shared_1.DataType.User
                                ? {
                                    type: "static",
                                    options: people.map(function (person) { return ({
                                        value: person.id,
                                        label: person.name
                                    }); })
                                }
                                : field.dataTypeId === shared_1.DataType.Text
                                    ? {
                                        type: "fetcher",
                                        endpoint: path_1.path.to.api.customFieldOptions(table, field.id)
                                    }
                                    : field.dataTypeId === shared_1.DataType.Customer
                                        ? {
                                            type: "static",
                                            options: customers.map(function (customer) { return ({
                                                value: customer.id,
                                                label: customer.name
                                            }); })
                                        }
                                        : field.dataTypeId === shared_1.DataType.Supplier
                                            ? {
                                                type: "static",
                                                options: suppliers.map(function (supplier) { return ({
                                                    value: supplier.id,
                                                    label: supplier.name
                                                }); })
                                            }
                                            : undefined
                },
                cell: function (item) {
                    var _a, _b, _c, _d, _e, _f, _g;
                    switch (field.dataTypeId) {
                        case shared_1.DataType.Boolean:
                            return isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields ? (<react_1.Checkbox isChecked={((_a = item.row.original) === null || _a === void 0 ? void 0 : _a.customFields[field.id]) === "on"}/>) : (<react_1.Checkbox isChecked={false}/>);
                        case shared_1.DataType.Date:
                            return isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields
                                ? (_b = item.row.original) === null || _b === void 0 ? void 0 : _b.customFields[field.id]
                                : null;
                        case shared_1.DataType.List:
                            return isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields ? (<Enumerable_1.Enumerable value={item.row.original.customFields[field.id]}/>) : null;
                        case shared_1.DataType.Numeric:
                            return isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields
                                ? (_c = item.row.original) === null || _c === void 0 ? void 0 : _c.customFields[field.id]
                                : null;
                        case shared_1.DataType.Text:
                            return isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields
                                ? (_d = item.row.original) === null || _d === void 0 ? void 0 : _d.customFields[field.id]
                                : null;
                        case shared_1.DataType.User:
                            if (isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields) {
                                var personId = (_e = item.row.original) === null || _e === void 0 ? void 0 : _e.customFields[field.id];
                                return <components_1.EmployeeAvatar employeeId={personId}/>;
                            }
                            else {
                                return null;
                            }
                        case shared_1.DataType.Customer:
                            if (isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields) {
                                var customerId = (_f = item.row.original) === null || _f === void 0 ? void 0 : _f.customFields[field.id];
                                return <components_1.CustomerAvatar customerId={customerId}/>;
                            }
                            else {
                                return null;
                            }
                        case shared_1.DataType.Supplier:
                            if (isObject(item.row.original.customFields) &&
                                field.id in item.row.original.customFields) {
                                var supplierId = (_g = item.row.original) === null || _g === void 0 ? void 0 : _g.customFields[field.id];
                                return <components_1.SupplierAvatar supplierId={supplierId}/>;
                            }
                            else {
                                return null;
                            }
                        default:
                            return null;
                    }
                }
            });
        });
        return customColumns;
    }, [schema, t, people, customers, suppliers, table]);
}
function isObject(value) {
    return value !== null && typeof value === "object";
}
function ColumnIcon(_a) {
    var dataTypeId = _a.dataTypeId;
    switch (dataTypeId) {
        case shared_1.DataType.Boolean:
            return <lu_1.LuToggleLeft />;
        case shared_1.DataType.Date:
            return <lu_1.LuCalendar />;
        case shared_1.DataType.List:
            return <lu_1.LuList />;
        case shared_1.DataType.Numeric:
            return <lu_1.LuHash />;
        case shared_1.DataType.Text:
            return <lu_1.LuCaseSensitive />;
        case shared_1.DataType.User:
            return <lu_1.LuUser />;
        case shared_1.DataType.Customer:
            return <lu_1.LuSquareUser />;
        case shared_1.DataType.Supplier:
            return <lu_1.LuContainer />;
        default:
            return null;
    }
}
var templateObject_1, templateObject_2;
