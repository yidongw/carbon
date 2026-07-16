"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SalaryDetailView;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var salaryDetail_utils_1 = require("./salaryDetail.utils");
function CompletionTable(_a) {
    var rows = _a.rows, formatCurrency = _a.formatCurrency, formatUnitCost = _a.formatUnitCost, showApprove = _a.showApprove, onApprove = _a.onApprove, isApproving = _a.isApproving;
    var t = (0, macro_1.useLingui)().t;
    if (rows.length === 0) {
        return (<p className="px-6 py-10 text-center text-sm text-muted-foreground">
        <macro_1.Trans>No entries</macro_1.Trans>
      </p>);
    }
    return (<div className="overflow-x-auto">
      <react_1.Table>
        <react_1.Thead>
          <react_1.Tr>
            <react_1.Th>{t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Job"], ["Job"])))}</react_1.Th>
            <react_1.Th>{t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Operation"], ["Operation"])))}</react_1.Th>
            <react_1.Th className="text-right">{t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Qty"], ["Qty"])))}</react_1.Th>
            <react_1.Th className="text-right">{t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Unit rate"], ["Unit rate"])))}</react_1.Th>
            <react_1.Th className="text-right">{t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Amount"], ["Amount"])))}</react_1.Th>
            <react_1.Th>{t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Submitted"], ["Submitted"])))}</react_1.Th>
            {showApprove && <react_1.Th className="w-28"/>}
          </react_1.Tr>
        </react_1.Thead>
        <react_1.Tbody>
          {rows.map(function (c) {
            var _a;
            return (<react_1.Tr key={c.id}>
              <react_1.Td className="font-mono text-sm font-medium">
                {(0, salaryDetail_utils_1.getJobReadableId)(c)}
              </react_1.Td>
              <react_1.Td>
                <div className="text-sm">{(_a = (0, salaryDetail_utils_1.getProcessName)(c)) !== null && _a !== void 0 ? _a : "—"}</div>
                {(0, salaryDetail_utils_1.getJobOperationDescription)(c) && (<div className="text-xs text-muted-foreground truncate max-w-48">
                    {(0, salaryDetail_utils_1.getJobOperationDescription)(c)}
                  </div>)}
              </react_1.Td>
              <react_1.Td className="text-right tabular-nums">{c.quantity}</react_1.Td>
              <react_1.Td className="text-right tabular-nums">
                {formatUnitCost((0, salaryDetail_utils_1.getUnitCost)(c))}
              </react_1.Td>
              <react_1.Td className="text-right tabular-nums font-semibold">
                {formatCurrency((0, salaryDetail_utils_1.getEarned)(c))}
              </react_1.Td>
              <react_1.Td className="text-sm text-muted-foreground whitespace-nowrap">
                {(0, salaryDetail_utils_1.formatDateTime)(c.createdAt)}
              </react_1.Td>
              {showApprove && onApprove && (<react_1.Td>
                  <react_1.Button size="sm" variant="secondary" leftIcon={<lu_1.LuCircleCheck />} onClick={function () { return onApprove(c.id); }} isDisabled={isApproving}>
                    <macro_1.Trans>Approve</macro_1.Trans>
                  </react_1.Button>
                </react_1.Td>)}
            </react_1.Tr>);
        })}
        </react_1.Tbody>
      </react_1.Table>
    </div>);
}
function SalaryDetailView(_a) {
    var _b, _c, _d, _e;
    var employeeId = _a.employeeId, year = _a.year, month = _a.month, salaryRecord = _a.salaryRecord, employee = _a.employee, completions = _a.completions, pending = _a.pending, payments = _a.payments;
    var t = (0, macro_1.useLingui)().t;
    var navigate = (0, react_router_1.useNavigate)();
    var fetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var canUpdate = permissions.can("update", "people");
    var canCreatePayment = permissions.can("create", "people");
    (0, react_2.useEffect)(function () {
        if (fetcher.state !== "idle" || !fetcher.data)
            return;
        if (fetcher.data.error) {
            react_1.toast.error(fetcher.data.error);
            return;
        }
        if (fetcher.data.ok) {
            react_1.toast.success(t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Saved"], ["Saved"]))));
        }
    }, [fetcher.data, fetcher.state, t]);
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)({ minimumFractionDigits: 2 });
    var formatCurrency = function (amount) {
        return amount == null ? "—" : currencyFormatter.format(amount);
    };
    var unitCostFormatter = (0, hooks_1.useCurrencyFormatter)({ minimumFractionDigits: 4 });
    var formatUnitCost = function (amount) {
        return amount == null ? "—" : unitCostFormatter.format(amount);
    };
    var employeeName = (0, salaryDetail_utils_1.getEmployeeName)(employee
        ? {
            fullName: employee.name,
            firstName: employee.firstName,
            lastName: employee.lastName
        }
        : null, "") ||
        (salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.employeeName) ||
        employeeId;
    var employeeAvatar = (_c = (_b = employee === null || employee === void 0 ? void 0 : employee.avatarUrl) !== null && _b !== void 0 ? _b : salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.avatarUrl) !== null && _c !== void 0 ? _c : undefined;
    var periodLabel = "".concat(salaryDetail_utils_1.MONTH_NAMES[month - 1], " ").concat(year);
    var totalEarned = (_d = salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.totalEarned) !== null && _d !== void 0 ? _d : 0;
    var totalPaid = (_e = salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.totalPaid) !== null && _e !== void 0 ? _e : 0;
    var amountOwed = totalEarned - totalPaid;
    var paymentStatus = (0, salaryDetail_utils_1.getSalaryPaymentStatus)(totalEarned, totalPaid);
    var isApproving = fetcher.state !== "idle";
    var submitAction = path_1.path.to.employeeSalaryMonth(employeeId, year, month);
    var approveEntry = function (productionQuantityId) {
        var formData = new FormData();
        formData.append("productionQuantityId", productionQuantityId);
        fetcher.submit(formData, { method: "post", action: submitAction });
    };
    return (<div className="max-w-4xl w-full p-2 sm:px-0 mx-auto mt-0 md:mt-8 pb-8">
      <react_1.VStack spacing={4} className="w-full">
        <react_1.Card>
          <react_1.CardHeader>
            <react_1.HStack className="items-start justify-between gap-4 flex-wrap">
              <react_1.HStack spacing={3} className="items-center min-w-0">
                <react_1.Avatar className="size-11" src={employeeAvatar} name={employeeName}/>
                <div className="min-w-0">
                  <react_1.CardTitle className="text-xl text-balance">
                    {employeeName}
                  </react_1.CardTitle>
                  <react_1.CardDescription className="mt-1">
                    <macro_1.Trans>Salary for {periodLabel}</macro_1.Trans>
                  </react_1.CardDescription>
                </div>
              </react_1.HStack>
              {salaryRecord && (<react_1.Badge variant={(0, salaryDetail_utils_1.statusVariant)(paymentStatus)} className="shrink-0">
                  {paymentStatus}
                </react_1.Badge>)}
            </react_1.HStack>
          </react_1.CardHeader>

          <react_1.CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <react_1.HStack spacing={2} className="text-sm text-muted-foreground mb-2">
                  <lu_1.LuBanknote className="size-4 shrink-0"/>
                  <span>
                    <macro_1.Trans>Total earned</macro_1.Trans>
                  </span>
                </react_1.HStack>
                <p className="text-2xl font-medium tracking-tight tabular-nums">
                  {formatCurrency(totalEarned)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {completions.length} <macro_1.Trans>approved completion(s)</macro_1.Trans>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <react_1.HStack spacing={2} className="text-sm text-muted-foreground mb-2">
                  <lu_1.LuCircleCheck className="size-4 shrink-0"/>
                  <span>
                    <macro_1.Trans>Total paid</macro_1.Trans>
                  </span>
                </react_1.HStack>
                <p className="text-2xl font-medium tracking-tight tabular-nums">
                  {formatCurrency(totalPaid)}
                </p>
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  {payments.length} <macro_1.Trans>payment(s)</macro_1.Trans>
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <react_1.HStack spacing={2} className="text-sm text-muted-foreground mb-2">
                  <lu_1.LuClock className="size-4 shrink-0"/>
                  <span>
                    <macro_1.Trans>Outstanding</macro_1.Trans>
                  </span>
                </react_1.HStack>
                <p className={"text-2xl font-medium tracking-tight tabular-nums ".concat(amountOwed > 0 ? "text-amber-600 dark:text-amber-400" : "")}>
                  {formatCurrency(amountOwed)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {amountOwed > 0 ? (<macro_1.Trans>Pending payment</macro_1.Trans>) : (<macro_1.Trans>Fully paid</macro_1.Trans>)}
                </p>
              </div>
            </div>
          </react_1.CardContent>

          {canCreatePayment && amountOwed > 0 && (salaryRecord === null || salaryRecord === void 0 ? void 0 : salaryRecord.id) ? (<react_1.CardFooter className="flex flex-wrap gap-2 justify-end border-t border-border">
              <react_1.Button leftIcon={<lu_1.LuBanknote />} onClick={function () {
                return navigate(path_1.path.to.newSalaryPayment(employeeId, year, month));
            }}>
                <macro_1.Trans>Record payment</macro_1.Trans>
              </react_1.Button>
            </react_1.CardFooter>) : null}
        </react_1.Card>

        {canUpdate && pending.length > 0 && (<react_1.Card>
            <react_1.CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <div>
                <react_1.CardTitle>
                  <macro_1.Trans>Pending approval</macro_1.Trans>
                </react_1.CardTitle>
                <react_1.CardDescription className="mt-1">
                  <macro_1.Trans>
                    Approve here or manage all pending items on the quantity
                    review page.
                  </macro_1.Trans>
                </react_1.CardDescription>
              </div>
              <react_1.HStack spacing={2} className="shrink-0">
                <react_1.Badge variant="secondary">{pending.length}</react_1.Badge>
                <react_1.Button size="sm" variant="ghost" rightIcon={<lu_1.LuExternalLink />} onClick={function () { return navigate(path_1.path.to.quantityReview); }}>
                  <macro_1.Trans>Quantity review</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.CardHeader>
            <react_1.CardContent className="p-0">
              <CompletionTable rows={pending} formatCurrency={formatCurrency} formatUnitCost={formatUnitCost} showApprove onApprove={approveEntry} isApproving={isApproving}/>
            </react_1.CardContent>
          </react_1.Card>)}

        <react_1.Card>
          <react_1.CardHeader>
            <react_1.CardTitle>
              <macro_1.Trans>Approved completions</macro_1.Trans>
            </react_1.CardTitle>
            <react_1.CardDescription>
              <macro_1.Trans>Production quantities approved for this pay period.</macro_1.Trans>
            </react_1.CardDescription>
          </react_1.CardHeader>
          <react_1.CardContent className="p-0">
            {completions.length === 0 ? (<p className="px-6 py-10 text-center text-sm text-muted-foreground">
                <macro_1.Trans>No approved completions this period</macro_1.Trans>
              </p>) : (<CompletionTable rows={completions} formatCurrency={formatCurrency} formatUnitCost={formatUnitCost}/>)}
          </react_1.CardContent>
        </react_1.Card>

        {payments.length > 0 && (<react_1.Card>
            <react_1.CardHeader>
              <react_1.CardTitle>
                <macro_1.Trans>Payment history</macro_1.Trans>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardContent className="p-0">
              <div className="overflow-x-auto">
                <react_1.Table>
                  <react_1.Thead>
                    <react_1.Tr>
                      <react_1.Th>{t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Amount"], ["Amount"])))}</react_1.Th>
                      <react_1.Th>{t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Paid at"], ["Paid at"])))}</react_1.Th>
                      <react_1.Th>{t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Paid by"], ["Paid by"])))}</react_1.Th>
                      <react_1.Th>{t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Notes"], ["Notes"])))}</react_1.Th>
                    </react_1.Tr>
                  </react_1.Thead>
                  <react_1.Tbody>
                    {payments.map(function (p) {
                var _a;
                return (<react_1.Tr key={p.id}>
                        <react_1.Td className="tabular-nums font-semibold">
                          {formatCurrency(p.amount)}
                        </react_1.Td>
                        <react_1.Td className="text-sm whitespace-nowrap">
                          {(0, salaryDetail_utils_1.formatDateTime)(p.paidAt)}
                        </react_1.Td>
                        <react_1.Td className="text-sm">
                          {(0, salaryDetail_utils_1.getEmployeeName)(p.paidByUser)}
                        </react_1.Td>
                        <react_1.Td className="text-sm text-muted-foreground max-w-xs truncate">
                          {(_a = p.notes) !== null && _a !== void 0 ? _a : "—"}
                        </react_1.Td>
                      </react_1.Tr>);
            })}
                  </react_1.Tbody>
                </react_1.Table>
              </div>
            </react_1.CardContent>
          </react_1.Card>)}

        <react_router_1.Outlet />
      </react_1.VStack>
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11;
