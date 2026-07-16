"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var react_2 = require("react");
var IntercompanyBalanceMatrix = (0, react_2.memo)(function (_a) {
    var data = _a.data;
    var _b = (0, react_2.useMemo)(function () {
        var companyMap = new Map();
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var entry = data_1[_i];
            companyMap.set(entry.sourceCompanyId, entry.sourceCompanyName);
            companyMap.set(entry.targetCompanyId, entry.targetCompanyName);
        }
        var companies = Array.from(companyMap.entries()).map(function (_a) {
            var id = _a[0], name = _a[1];
            return ({
                id: id,
                name: name
            });
        });
        var matrix = new Map();
        for (var _a = 0, data_2 = data; _a < data_2.length; _a++) {
            var entry = data_2[_a];
            matrix.set("".concat(entry.sourceCompanyId, ":").concat(entry.targetCompanyId), Number(entry.balance));
        }
        return { companies: companies, matrix: matrix };
    }, [data]), companies = _b.companies, matrix = _b.matrix;
    if (companies.length === 0) {
        return null;
    }
    var formatAmount = function (amount) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };
    return (<react_1.Card>
        <react_1.CardHeader>
          <react_1.CardTitle>Intercompany Balances</react_1.CardTitle>
        </react_1.CardHeader>
        <react_1.CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium text-muted-foreground">
                    From / To
                  </th>
                  {companies.map(function (c) { return (<th key={c.id} className="text-right p-2 font-medium text-muted-foreground">
                      {c.name}
                    </th>); })}
                </tr>
              </thead>
              <tbody>
                {companies.map(function (source) { return (<tr key={source.id} className="border-b">
                    <td className="p-2 font-medium">{source.name}</td>
                    {companies.map(function (target) {
                var _a;
                var balance = (_a = matrix.get("".concat(source.id, ":").concat(target.id))) !== null && _a !== void 0 ? _a : 0;
                var isSelf = source.id === target.id;
                return (<td key={target.id} className={"text-right p-2 ".concat(isSelf
                        ? "text-muted-foreground"
                        : balance > 0
                            ? "text-foreground"
                            : balance < 0
                                ? "text-destructive"
                                : "text-muted-foreground")}>
                          {isSelf ? "—" : formatAmount(balance)}
                        </td>);
            })}
                  </tr>); })}
              </tbody>
            </table>
          </div>
        </react_1.CardContent>
      </react_1.Card>);
});
IntercompanyBalanceMatrix.displayName = "IntercompanyBalanceMatrix";
exports.default = IntercompanyBalanceMatrix;
