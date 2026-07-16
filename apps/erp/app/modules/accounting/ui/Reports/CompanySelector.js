"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var hooks_1 = require("~/hooks");
var ALL = "__all__";
var CompanySelector = function (_a) {
    var _b, _c;
    var companies = _a.companies, selectedCompanyIds = _a.selectedCompanyIds;
    var _d = (0, hooks_1.useUrlParams)(), setParams = _d[1];
    if (companies.length <= 1)
        return null;
    var allSelected = selectedCompanyIds.length === companies.length;
    var value = allSelected ? ALL : selectedCompanyIds[0];
    var label = allSelected
        ? "All Companies"
        : ((_c = (_b = companies.find(function (c) { return c.id === value; })) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : "All Companies");
    var onChange = function (next) {
        setParams({ companies: next === ALL ? "all" : next });
    };
    return (<react_1.DropdownMenu>
      <react_1.DropdownMenuTrigger asChild>
        <react_1.Button variant="secondary" leftIcon={<lu_1.LuBuilding2 />}>
          {label}
        </react_1.Button>
      </react_1.DropdownMenuTrigger>
      <react_1.DropdownMenuContent>
        <react_1.DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <react_1.DropdownMenuRadioItem value={ALL}>
            All Companies
          </react_1.DropdownMenuRadioItem>
          {companies.map(function (company) { return (<react_1.DropdownMenuRadioItem key={company.id} value={company.id}>
              {company.name}
            </react_1.DropdownMenuRadioItem>); })}
        </react_1.DropdownMenuRadioGroup>
      </react_1.DropdownMenuContent>
    </react_1.DropdownMenu>);
};
exports.default = CompanySelector;
