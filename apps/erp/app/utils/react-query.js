"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.materialTypesQuery = exports.groupsByTypeQuery = exports.workCentersQuery = exports.webhookTablesQuery = exports.storageRuleAssignmentsQuery = exports.storageRulesQuery = exports.uomsQuery = exports.supplierTypesQuery = exports.supplierProcessesBySupplierQuery = exports.supplierProcessesQuery = exports.supplierLocationsQuery = exports.supplierContactsQuery = exports.shippingMethodsQuery = exports.serialNumbersQuery = exports.storageUnitsQuery = exports.proceduresQuery = exports.processesQuery = exports.paymentTermsQuery = exports.locationsQuery = exports.itemPostingGroupsQuery = exports.docsQuery = exports.configurableItemsQuery = exports.customerTypesQuery = exports.customerLocationsQuery = exports.customerContactsQuery = exports.currenciesQuery = exports.countriesQuery = exports.accountsQuery = exports.abilitiesQuery = exports.getClientCache = exports.getCompanyId = void 0;
var cookie = require("cookie");
var RefreshRate;
(function (RefreshRate) {
    RefreshRate[RefreshRate["Never"] = Infinity] = "Never";
    RefreshRate[RefreshRate["High"] = 120000] = "High";
    RefreshRate[RefreshRate["Medium"] = 600000] = "Medium";
    RefreshRate[RefreshRate["Low"] = 1800000] = "Low";
})(RefreshRate || (RefreshRate = {}));
var getCompanyId = function () {
    if (typeof document === "undefined") {
        return null;
    }
    var cookieHeader = document.cookie;
    // biome-ignore lint/complexity/useLiteralKeys: suppressed due to migration
    var parsed = cookieHeader ? cookie.parse(cookieHeader)["companyId"] : null;
    return parsed !== null && parsed !== void 0 ? parsed : null;
};
exports.getCompanyId = getCompanyId;
var getClientCache = function () {
    if (typeof window === "undefined") {
        return undefined;
    }
    return window.clientCache;
};
exports.getClientCache = getClientCache;
var abilitiesQuery = function (companyId) { return ({
    queryKey: ["abilities", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.abilitiesQuery = abilitiesQuery;
var accountsQuery = function (companyId) { return ({
    queryKey: ["accounts", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.accountsQuery = accountsQuery;
var countriesQuery = function () { return ({
    queryKey: ["countries"],
    staleTime: RefreshRate.Never
}); };
exports.countriesQuery = countriesQuery;
var currenciesQuery = function () { return ({
    queryKey: ["currencies"],
    staleTime: RefreshRate.Never
}); };
exports.currenciesQuery = currenciesQuery;
var customerContactsQuery = function (customerId) { return ({
    queryKey: ["customerContacts", customerId],
    staleTime: RefreshRate.Low
}); };
exports.customerContactsQuery = customerContactsQuery;
var customerLocationsQuery = function (customerId) { return ({
    queryKey: ["customerLocations", customerId],
    staleTime: RefreshRate.Low
}); };
exports.customerLocationsQuery = customerLocationsQuery;
var customerTypesQuery = function (companyId) { return ({
    queryKey: ["customerTypes", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.customerTypesQuery = customerTypesQuery;
var configurableItemsQuery = function (companyId) { return ({
    queryKey: ["configurableItems", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.configurableItemsQuery = configurableItemsQuery;
var docsQuery = function () { return ({
    queryKey: ["docs"],
    staleTime: RefreshRate.Never
}); };
exports.docsQuery = docsQuery;
var itemPostingGroupsQuery = function (companyId) { return ({
    queryKey: ["itemPostingGroups", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.itemPostingGroupsQuery = itemPostingGroupsQuery;
var locationsQuery = function (companyId) { return ({
    queryKey: ["locations", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.locationsQuery = locationsQuery;
var paymentTermsQuery = function (companyId) { return ({
    queryKey: ["paymentTerms", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.paymentTermsQuery = paymentTermsQuery;
var processesQuery = function (companyId) { return ({
    queryKey: ["processes", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.processesQuery = processesQuery;
var proceduresQuery = function (companyId) { return ({
    queryKey: ["procedures", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.proceduresQuery = proceduresQuery;
var storageUnitsQuery = function (companyId, locationId, itemId) { return ({
    queryKey: [
        "storageUnits",
        companyId !== null && companyId !== void 0 ? companyId : "null",
        locationId !== null && locationId !== void 0 ? locationId : "null",
        itemId !== null && itemId !== void 0 ? itemId : "null"
    ],
    staleTime: RefreshRate.Low
}); };
exports.storageUnitsQuery = storageUnitsQuery;
var serialNumbersQuery = function (companyId, itemId) { return ({
    queryKey: ["serialNumbers", companyId !== null && companyId !== void 0 ? companyId : "null", itemId !== null && itemId !== void 0 ? itemId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.serialNumbersQuery = serialNumbersQuery;
var shippingMethodsQuery = function (companyId) { return ({
    queryKey: ["shippingMethods", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.shippingMethodsQuery = shippingMethodsQuery;
var supplierContactsQuery = function (supplierId) { return ({
    queryKey: ["supplierContacts", supplierId],
    staleTime: RefreshRate.Low
}); };
exports.supplierContactsQuery = supplierContactsQuery;
var supplierLocationsQuery = function (supplierId) { return ({
    queryKey: ["supplierLocations", supplierId],
    staleTime: RefreshRate.Low
}); };
exports.supplierLocationsQuery = supplierLocationsQuery;
var supplierProcessesQuery = function (processId) { return ({
    queryKey: ["supplierProcesses", processId],
    staleTime: RefreshRate.Low
}); };
exports.supplierProcessesQuery = supplierProcessesQuery;
var supplierProcessesBySupplierQuery = function (supplierId) { return ({
    queryKey: ["supplierProcessesBySupplier", supplierId],
    staleTime: RefreshRate.Low
}); };
exports.supplierProcessesBySupplierQuery = supplierProcessesBySupplierQuery;
var supplierTypesQuery = function (companyId) { return ({
    queryKey: ["supplierTypes", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.supplierTypesQuery = supplierTypesQuery;
var uomsQuery = function (companyId) { return ({
    queryKey: ["uoms", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Medium
}); };
exports.uomsQuery = uomsQuery;
var storageRulesQuery = function (companyId, targetType) { return ({
    queryKey: ["storageRules", targetType !== null && targetType !== void 0 ? targetType : "all", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.storageRulesQuery = storageRulesQuery;
var storageRuleAssignmentsQuery = function (targetType, targetId, companyId) { return ({
    queryKey: [
        "storageRuleAssignments",
        targetType,
        targetId,
        companyId !== null && companyId !== void 0 ? companyId : "null"
    ],
    staleTime: RefreshRate.Low
}); };
exports.storageRuleAssignmentsQuery = storageRuleAssignmentsQuery;
var webhookTablesQuery = function () { return ({
    queryKey: ["webhookTables"],
    staleTime: RefreshRate.Never
}); };
exports.webhookTablesQuery = webhookTablesQuery;
var workCentersQuery = function (companyId) { return ({
    queryKey: ["workCenters", companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.workCentersQuery = workCentersQuery;
var groupsByTypeQuery = function (companyId, type) { return ({
    queryKey: ["groupsByType", companyId !== null && companyId !== void 0 ? companyId : "null", type !== null && type !== void 0 ? type : "null"],
    staleTime: RefreshRate.Low
}); };
exports.groupsByTypeQuery = groupsByTypeQuery;
var materialTypesQuery = function (substanceId, formId, companyId) { return ({
    queryKey: ["materialTypes", substanceId, formId, companyId !== null && companyId !== void 0 ? companyId : "null"],
    staleTime: RefreshRate.Low
}); };
exports.materialTypesQuery = materialTypesQuery;
