"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components/Table/components");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function SalaryRowActions(_a) {
    var employeeId = _a.employeeId, salaryRecordId = _a.salaryRecordId, amountOwed = _a.amountOwed, pendingAmount = _a.pendingAmount, year = _a.year, month = _a.month;
    var permissions = (0, hooks_1.usePermissions)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var detailTo = path_1.path.to.employeeSalaryMonth(employeeId, year, month);
    var hasPending = (pendingAmount !== null && pendingAmount !== void 0 ? pendingAmount : 0) > 0;
    var primaryTo = hasPending
        ? path_1.path.to.quantityReviewForEmployee(employeeId)
        : detailTo;
    var paymentTo = (0, react_2.useMemo)(function () {
        if (!permissions.can("create", "people") ||
            !salaryRecordId ||
            (amountOwed !== null && amountOwed !== void 0 ? amountOwed : 0) <= 0) {
            return null;
        }
        var params = new URLSearchParams(searchParams);
        params.set("year", String(year));
        params.set("month", String(month));
        params.set("pay", employeeId);
        return "".concat(path_1.path.to.accountingSalary, "?").concat(params.toString());
    }, [
        amountOwed,
        employeeId,
        month,
        permissions,
        salaryRecordId,
        searchParams,
        year
    ]);
    return (<components_1.RowActionsContainer className="gap-1">
      <react_1.Button asChild size="sm" variant={hasPending ? "primary" : "secondary"}>
        <react_router_1.Link to={primaryTo}>
          {hasPending ? (<>
              <lu_1.LuClipboardCheck className="size-3.5 mr-1.5"/>
              <macro_1.Trans>Review</macro_1.Trans>
            </>) : (<>
              <lu_1.LuEye className="size-3.5 mr-1.5"/>
              <macro_1.Trans>View</macro_1.Trans>
            </>)}
        </react_router_1.Link>
      </react_1.Button>
      {paymentTo ? (<react_1.ActionMenu>
          <react_1.MenuItem asChild>
            <react_router_1.Link to={paymentTo}>
              <react_1.MenuIcon icon={<lu_1.LuBanknote />}/>
              <macro_1.Trans>Record payment</macro_1.Trans>
            </react_router_1.Link>
          </react_1.MenuItem>
        </react_1.ActionMenu>) : null}
    </components_1.RowActionsContainer>);
}
exports.default = (0, react_2.memo)(SalaryRowActions);
