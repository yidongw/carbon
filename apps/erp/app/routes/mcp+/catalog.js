"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMcpCatalog = buildMcpCatalog;
var MODULE_META = {
    sales: { label: "Sales", description: "Quotes, orders, customers" },
    items: {
        label: "Items",
        description: "SKUs, inventory items, configurations"
    },
    production: {
        label: "Production",
        description: "Jobs, operations, scheduling"
    },
    purchasing: { label: "Purchasing", description: "POs, suppliers, receipts" },
    resources: { label: "Resources", description: "Machines, tools, labor" },
    settings: { label: "Settings", description: "Company config, tax, terms" },
    quality: { label: "Quality", description: "Inspections, testing, standards" },
    accounting: { label: "Accounting", description: "GL, journals, periods" },
    inventory: {
        label: "Inventory",
        description: "On-hand, movements, transfers"
    },
    people: { label: "People", description: "Employees, shifts, attendance" },
    shared: { label: "Shared", description: "Common cross-module operations" },
    invoicing: { label: "Invoicing", description: "Invoices, AR, payments" },
    users: { label: "Users", description: "User & permission management" },
    documents: { label: "Documents", description: "PDFs, attachments" },
    account: { label: "Account", description: "Profile & attributes" }
};
function buildMcpCatalog(meta, blocked) {
    var _a;
    var blockedSet = new Set(blocked);
    var tools = meta.tools
        .filter(function (t) { return !blockedSet.has(t.name); })
        .map(function (t) { return ({
        name: t.name,
        module: t.module,
        classification: t.classification,
        description: t.description,
        paramCount: t.paramCount
    }); });
    var counts = new Map();
    for (var _i = 0, tools_1 = tools; _i < tools_1.length; _i++) {
        var t = tools_1[_i];
        counts.set(t.module, ((_a = counts.get(t.module)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    var modules = __spreadArray([], counts.entries(), true).map(function (_a) {
        var _b, _c, _d, _e;
        var key = _a[0], count = _a[1];
        return ({
            key: key,
            label: (_c = (_b = MODULE_META[key]) === null || _b === void 0 ? void 0 : _b.label) !== null && _c !== void 0 ? _c : key,
            description: (_e = (_d = MODULE_META[key]) === null || _d === void 0 ? void 0 : _d.description) !== null && _e !== void 0 ? _e : "",
            count: count
        });
    })
        .sort(function (a, b) { return b.count - a.count; });
    return { total: tools.length, moduleCount: modules.length, modules: modules, tools: tools };
}
