"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountControlled = void 0;
exports.useAccounts = useAccounts;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var react_query_1 = require("~/utils/react-query");
var seedDataDisplayName_1 = require("~/utils/seedDataDisplayName");
function useAccounts(classes) {
    var fetcher = (0, react_router_1.useFetcher)();
    var companyId = (0, react_query_1.getCompanyId)();
    var queryKey = (0, react_query_1.accountsQuery)(companyId).queryKey;
    var _a = (0, react_2.useState)(function () {
        var _a, _b;
        return (_b = (_a = (0, react_query_1.getClientCache)()) === null || _a === void 0 ? void 0 : _a.getQueryData(queryKey)) !== null && _b !== void 0 ? _b : [];
    }), accounts = _a[0], setAccounts = _a[1];
    (0, react_1.useMount)(function () {
        if (accounts.length === 0) {
            fetcher.load("".concat(path_1.path.to.api.accounts, "?isGroup=false"));
        }
    });
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data) {
            (_b = (0, react_query_1.getClientCache)()) === null || _b === void 0 ? void 0 : _b.setQueryData(queryKey, fetcher.data.data);
            setAccounts(fetcher.data.data);
        }
    }, [fetcher.data, queryKey]);
    return (0, react_2.useMemo)(function () {
        if (!classes || classes.length === 0)
            return accounts;
        return accounts.filter(function (a) { return a.class && classes.includes(a.class); });
    }, [accounts, classes]);
}
var badgeColors = {
    Asset: "green",
    Liability: "red",
    Equity: "blue",
    Revenue: "yellow",
    Expense: "orange"
};
function useAccountOptions(classes) {
    var i18n = (0, macro_1.useLingui)().i18n;
    var accounts = useAccounts(classes);
    return (0, react_2.useMemo)(function () {
        return accounts.map(function (c) { return ({
            value: c.id,
            label: (<div className="flex items-center justify-between w-full gap-2">
            <span className="truncate">
              {(0, seedDataDisplayName_1.translateSeedDisplayName)(c.name, i18n)}
            </span>
            {c.class && <react_1.Badge variant={badgeColors[c.class]}>{c.class}</react_1.Badge>}
          </div>),
            helper: c.number
        }); });
    }, [accounts, i18n]);
}
var Account = function (_a) {
    var _b;
    var classes = _a.classes, props = __rest(_a, ["classes"]);
    var options = useAccountOptions(classes);
    return (<form_1.Combobox options={options} {...props} label={(_b = props === null || props === void 0 ? void 0 : props.label) !== null && _b !== void 0 ? _b : "Account"}/>);
};
Account.displayName = "Account";
exports.default = Account;
var AccountControlled = function (_a) {
    var classes = _a.classes, props = __rest(_a, ["classes"]);
    var options = useAccountOptions(classes);
    return <react_1.Combobox options={options} {...props}/>;
};
exports.AccountControlled = AccountControlled;
exports.AccountControlled.displayName = "AccountControlled";
