"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SalaryRecordPaymentPicker;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var salaryDetail_utils_1 = require("./salaryDetail.utils");
function SalaryRecordPaymentPicker(_a) {
    var records = _a.records, year = _a.year, month = _a.month, returnTo = _a.returnTo;
    var navigate = (0, react_router_1.useNavigate)();
    var searchParams = (0, react_router_1.useSearchParams)()[0];
    var currencyFormatter = (0, hooks_1.useCurrencyFormatter)({ minimumFractionDigits: 2 });
    var periodLabel = "".concat(salaryDetail_utils_1.MONTH_NAMES[month - 1], " ").concat(year);
    var payable = records.filter(function (row) { var _a; return row.employeeId && ((_a = row.amountOwed) !== null && _a !== void 0 ? _a : 0) > 0; });
    var onClose = function () { return navigate(returnTo); };
    var onSelect = function (employeeId) {
        var next = new URLSearchParams(searchParams);
        next.delete("recordPayment");
        next.set("pay", employeeId);
        if (!next.has("returnTo")) {
            next.set("returnTo", returnTo);
        }
        navigate("".concat(path_1.path.to.accountingSalary, "?").concat(next.toString()));
    };
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) { return !open && onClose(); }}>
        <react_1.ModalDrawerContent>
          <react_1.ModalDrawerHeader>
            <react_1.ModalDrawerTitle>
              <macro_1.Trans>Record payment</macro_1.Trans>
            </react_1.ModalDrawerTitle>
            <p className="text-sm text-muted-foreground font-normal mt-1">
              <macro_1.Trans>Select an employee for {periodLabel}</macro_1.Trans>
            </p>
          </react_1.ModalDrawerHeader>
          <react_1.ModalDrawerBody className="w-full">
            {payable.length === 0 ? (<p className="text-sm text-muted-foreground">
                <macro_1.Trans>
                  No employees have an outstanding balance this period.
                </macro_1.Trans>
              </p>) : (<react_1.VStack spacing={1} className="w-full">
                {payable.map(function (row) {
                var _a, _b;
                var name = (0, salaryDetail_utils_1.getEmployeeName)(row);
                var owed = (_a = row.amountOwed) !== null && _a !== void 0 ? _a : 0;
                return (<button key={row.employeeId} type="button" className="flex w-full items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/60" onClick={function () { return onSelect(row.employeeId); }}>
                      <react_1.HStack spacing={2} className="items-center min-w-0">
                        <react_1.Avatar className="size-8 shrink-0" src={(_b = row.avatarUrl) !== null && _b !== void 0 ? _b : undefined} name={name}/>
                        <span className="text-sm font-medium truncate">
                          {name}
                        </span>
                      </react_1.HStack>
                      <span className="text-sm font-semibold tabular-nums shrink-0">
                        {currencyFormatter.format(owed)}
                      </span>
                    </button>);
            })}
              </react_1.VStack>)}
          </react_1.ModalDrawerBody>
          <react_1.ModalDrawerFooter>
            <react_1.HStack className="w-full justify-end">
              <react_1.Button size="md" variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalDrawerFooter>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
}
