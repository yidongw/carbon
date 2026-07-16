"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var useCustomFieldsSchema_1 = require("~/hooks/useCustomFieldsSchema");
var shared_1 = require("~/modules/shared");
var Enumerable_1 = require("../Enumerable");
var Customer_1 = require("./Customer");
var Employee_1 = require("./Employee");
var Supplier_1 = require("./Supplier");
var CustomFormInlineFields = function (_a) {
    var _b = _a.customFields, fields = _b === void 0 ? {} : _b, table = _a.table, _c = _a.tags, tags = _c === void 0 ? [] : _c, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d, onUpdate = _a.onUpdate;
    var customFormSchema = (0, useCustomFieldsSchema_1.useCustomFieldsSchema)();
    var tableFields = customFormSchema === null || customFormSchema === void 0 ? void 0 : customFormSchema[table];
    if (!fields)
        return null;
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            var _s, _t;
            switch (field.dataTypeId) {
                case shared_1.DataType.Boolean:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_a = {},
                            _a[field.id] = fields && field.id in fields
                                ? fields[field.id]
                                : false,
                            _a} validator={zod_1.z.object((_b = {},
                            _b[field.id] = zod_form_data_1.zfd.checkbox(),
                            _b))} className="w-full">
                  <form_1.Boolean label={field.name} name={field.id} variant="small" isDisabled={isDisabled} onChange={function (value) {
                            var _a;
                            onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = value ? "on" : "", _a))));
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.Date:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_c = {},
                            _c[field.id] = fields[field.id],
                            _c} validator={zod_1.z.object((_d = {},
                            _d[field.id] = zod_form_data_1.zfd.text(zod_1.z.string().optional()),
                            _d))} className="w-full">
                  <form_1.DatePicker name={field.id} label={field.name} inline isDisabled={isDisabled} onChange={function (date) {
                            var _a;
                            var modifiedDate = date === null ? null : date.split("T")[0];
                            onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = modifiedDate, _a))));
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.List:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_e = {},
                            _e[field.id] = fields[field.id],
                            _e} validator={zod_1.z.object((_f = {},
                            _f[field.id] = zod_form_data_1.zfd.text(zod_1.z.string().optional()),
                            _f))} className="w-full">
                  <form_1.Select name={field.id} label={field.name} inline={function (value, options) {
                            return <Enumerable_1.Enumerable value={value}/>;
                        }} isReadOnly={isDisabled} options={(_t = (_s = field.listOptions) === null || _s === void 0 ? void 0 : _s.map(function (option) { return ({
                            value: option,
                            label: option
                        }); })) !== null && _t !== void 0 ? _t : []} onChange={function (value) {
                            var _a;
                            var _b;
                            onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = (_b = value === null || value === void 0 ? void 0 : value.value) !== null && _b !== void 0 ? _b : null, _a))));
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.Numeric:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_g = {},
                            _g[field.id] = fields[field.id],
                            _g} validator={zod_1.z.object((_h = {},
                            _h[field.id] = zod_form_data_1.zfd.numeric(zod_1.z.number().min(0, { message: "Quantity is required" })),
                            _h))} className="w-full">
                  <form_1.NumberControlled label={field.name} name={field.id} inline isReadOnly={isDisabled} value={fields[field.id]} onChange={function (value) {
                            var _a;
                            onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = value, _a))));
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.Text:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_j = {},
                            _j[field.id] = fields[field.id],
                            _j} validator={zod_1.z.object((_k = {},
                            _k[field.id] = zod_form_data_1.zfd.text(zod_1.z.string().optional()),
                            _k))} className="w-full">
                  <form_1.InputControlled name={field.id} label={field.name} value={fields[field.id]} size="sm" inline isReadOnly={isDisabled} onBlur={function (e) {
                            var _a;
                            onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = e.target.value, _a))));
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.User:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_l = {},
                            _l[field.id] = fields[field.id],
                            _l} validator={zod_1.z.object((_m = {},
                            _m[field.id] = zod_form_data_1.zfd.text(zod_1.z.string().optional()),
                            _m))} className="w-full">
                  <Employee_1.default name={field.id} label={field.name} inline isReadOnly={isDisabled} onChange={function (value) {
                            var _a;
                            if (value === null || value === void 0 ? void 0 : value.value) {
                                onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = value.value, _a))));
                            }
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.Customer:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_o = {},
                            _o[field.id] = fields[field.id],
                            _o} validator={zod_1.z.object((_p = {},
                            _p[field.id] = zod_form_data_1.zfd.text(zod_1.z.string().optional()),
                            _p))} className="w-full">
                  <Customer_1.default name={field.id} label={field.name} inline isReadOnly={isDisabled} onChange={function (value) {
                            var _a;
                            if (value === null || value === void 0 ? void 0 : value.value) {
                                onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = value.value, _a))));
                            }
                        }}/>
                </form_1.ValidatedForm>);
                case shared_1.DataType.Supplier:
                    return (
                    // biome-ignore lint/correctness/useJsxKeyInIterable: suppressed due to migration
                    <form_1.ValidatedForm defaultValues={_q = {},
                            _q[field.id] = fields[field.id],
                            _q} validator={zod_1.z.object((_r = {},
                            _r[field.id] = zod_form_data_1.zfd.text(zod_1.z.string().optional()),
                            _r))} className="w-full">
                  <Supplier_1.default name={field.id} label={field.name} inline isReadOnly={isDisabled} onChange={function (value) {
                            var _a;
                            if (value === null || value === void 0 ? void 0 : value.value) {
                                onUpdate(JSON.stringify(__assign(__assign({}, fields), (_a = {}, _a[field.id] = value.value, _a))));
                            }
                        }}/>
                </form_1.ValidatedForm>);
                default:
                    return null;
            }
        })}
    </>);
};
exports.default = CustomFormInlineFields;
