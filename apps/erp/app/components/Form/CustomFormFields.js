"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("react");
var useCustomFieldsSchema_1 = require("~/hooks/useCustomFieldsSchema");
var shared_1 = require("~/modules/shared");
var Customer_1 = require("./Customer");
var Employee_1 = require("./Employee");
var Supplier_1 = require("./Supplier");
var CustomFormFields = function (_a) {
    var table = _a.table, _b = _a.tags, tags = _b === void 0 ? [] : _b;
    var customFormSchema = (0, useCustomFieldsSchema_1.useCustomFieldsSchema)();
    var tableFields = customFormSchema === null || customFormSchema === void 0 ? void 0 : customFormSchema[table];
    var additionalValidatorCtx = (0, form_1.useAdditionalValidatorsContext)();
    var tagsKey = tags.join(",");
    var requiredFieldNames = (0, react_1.useMemo)(function () {
        if (!tableFields)
            return [];
        return tableFields
            .filter(function (field) {
            if (!field.required || field.dataTypeId === shared_1.DataType.Boolean)
                return false;
            if (!field.tags || field.tags.length === 0)
                return true;
            return field.tags.some(function (tag) { return tagsKey.split(",").includes(tag); });
        })
            .map(function (field) { return getCustomFieldName(field.id); });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableFields, tagsKey]);
    (0, react_1.useEffect)(function () {
        if (!additionalValidatorCtx || requiredFieldNames.length === 0)
            return;
        var id = "custom-".concat(table);
        additionalValidatorCtx.register(id, function (formData) {
            var errors = {};
            for (var _i = 0, requiredFieldNames_1 = requiredFieldNames; _i < requiredFieldNames_1.length; _i++) {
                var name_1 = requiredFieldNames_1[_i];
                var value = formData.get(name_1);
                if (!value || (typeof value === "string" && value.trim() === "")) {
                    errors[name_1] = "Required";
                }
            }
            return errors;
        });
        return function () { return additionalValidatorCtx.unregister(id); };
    }, [requiredFieldNames, table, additionalValidatorCtx]);
    if (!tableFields)
        return null;
    return (<>
      {tableFields
            .sort(function (a, b) { return a.sortOrder - b.sortOrder; })
            .filter(function (field) {
            if (!field.tags ||
                !Array.isArray(field.tags) ||
                field.tags.length === 0)
                return true;
            return field.tags.some(function (tag) { return tags.includes(tag); });
        })
            .map(function (field) {
            var _a, _b, _c;
            var isRequired = (_a = field.required) !== null && _a !== void 0 ? _a : false;
            switch (field.dataTypeId) {
                case shared_1.DataType.Boolean:
                    return (<form_1.Boolean key={field.id} name={getCustomFieldName(field.id)} label={field.name}/>);
                case shared_1.DataType.Date:
                    return (<form_1.DatePicker key={field.id} name={getCustomFieldName(field.id)} label={field.name} isRequired={isRequired}/>);
                case shared_1.DataType.List:
                    return (<form_1.Select key={field.id} name={getCustomFieldName(field.id)} label={field.name} placeholder={"Select ".concat(field.name)} isRequired={isRequired} options={(_c = (_b = field.listOptions) === null || _b === void 0 ? void 0 : _b.map(function (o) { return ({
                            label: o,
                            value: o
                        }); })) !== null && _c !== void 0 ? _c : []}/>);
                case shared_1.DataType.Numeric:
                    return (<form_1.Number key={field.id} name={getCustomFieldName(field.id)} label={field.name} isRequired={isRequired}/>);
                case shared_1.DataType.Text:
                    return (<form_1.Input key={field.id} name={getCustomFieldName(field.id)} label={field.name} isRequired={isRequired}/>);
                case shared_1.DataType.User:
                    return (<Employee_1.default key={field.id} name={getCustomFieldName(field.id)} label={field.name} isRequired={isRequired}/>);
                case shared_1.DataType.Customer:
                    return (<Customer_1.default key={field.id} name={getCustomFieldName(field.id)} label={field.name} isRequired={isRequired}/>);
                case shared_1.DataType.Supplier:
                    return (<Supplier_1.default key={field.id} name={getCustomFieldName(field.id)} label={field.name} isRequired={isRequired}/>);
                default:
                    return null;
            }
        })}
    </>);
};
exports.default = CustomFormFields;
function getCustomFieldName(id) {
    return "custom-".concat(id);
}
