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
var react_1 = require("@carbon/react");
var Form_1 = require("~/components/Form");
var AddressAutocomplete_1 = require("~/components/Form/AddressAutocomplete");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var SubsidiaryCompanyForm = function (_a) {
    var _b;
    var company = _a.company, parentCompanyId = _a.parentCompanyId;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.companies);
    var parentCompanyOptions = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.companies.filter(function (c) { return !c.isEliminationEntity; }).map(function (c) {
        var _a, _b;
        return ({
            value: (_a = c.id) !== null && _a !== void 0 ? _a : "",
            label: (_b = c.name) !== null && _b !== void 0 ? _b : ""
        });
    })) !== null && _b !== void 0 ? _b : [];
    return (<>
      <form_1.ValidatedForm method="post" validator={settings_1.subsidiaryValidator} defaultValues={__assign(__assign({}, company), { parentCompanyId: parentCompanyId })}>
        <react_1.VStack spacing={4}>
          <div className="flex flex-col gap-4 w-full">
            <Form_1.Select name="parentCompanyId" label="Parent Company" options={parentCompanyOptions}/>
            <Form_1.Input name="name" label="Company Name"/>
            <AddressAutocomplete_1.default variant="grid"/>
            <Form_1.Currency name="baseCurrencyCode" label="Base Currency"/>
          </div>
          <Form_1.Submit withBlocker={false}>Save</Form_1.Submit>
        </react_1.VStack>
      </form_1.ValidatedForm>
    </>);
};
exports.default = SubsidiaryCompanyForm;
