"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
exports.loader = loader;
exports.default = SalaryRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var people_1 = require("~/modules/people");
var salary_payment_server_1 = require("~/modules/people/salary-payment.server");
var Salary_1 = require("~/modules/people/ui/Salary");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, _d, _e;
        var request = _b.request;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            create: "people"
                        })];
                case 1:
                    _c = _f.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    _d = salary_payment_server_1.handleRecordSalaryPaymentAction;
                    _e = [request,
                        client,
                        companyId,
                        userId];
                    return [4 /*yield*/, request.formData()];
                case 2: return [2 /*return*/, _d.apply(void 0, _e.concat([_f.sent()]))];
            }
        });
    });
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, url, searchParams, now, year, month, search, payEmployeeId, recordPayment, returnToParam, salaryReturnParams, defaultReturnTo, returnTo, _d, limit, offset, sorts, filters, _e, records, departments, payment, record, amountOwed;
        var _f, _g, _h, _j, _k, _l;
        var request = _b.request;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people"
                    })];
                case 1:
                    _c = _m.sent(), client = _c.client, companyId = _c.companyId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    now = new Date();
                    year = Number((_f = searchParams.get("year")) !== null && _f !== void 0 ? _f : now.getFullYear());
                    month = Number((_g = searchParams.get("month")) !== null && _g !== void 0 ? _g : now.getMonth() + 1);
                    search = searchParams.get("search");
                    payEmployeeId = searchParams.get("pay");
                    recordPayment = searchParams.get("recordPayment") === "1";
                    returnToParam = searchParams.get("returnTo");
                    salaryReturnParams = new URLSearchParams(searchParams);
                    salaryReturnParams.delete("pay");
                    salaryReturnParams.delete("recordPayment");
                    salaryReturnParams.delete("returnTo");
                    defaultReturnTo = "".concat(path_1.path.to.accountingSalary, "?").concat(salaryReturnParams.toString());
                    returnTo = returnToParam && returnToParam.startsWith("/")
                        ? returnToParam
                        : defaultReturnTo;
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.getEmployeeSalaryList)(client, companyId, year, month, {
                                search: search,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            }),
                            (0, people_1.getDepartmentsList)(client, companyId)
                        ])];
                case 2:
                    _e = _m.sent(), records = _e[0], departments = _e[1];
                    if (records.error) {
                        console.error("Failed to load salary data", records.error);
                    }
                    payment = null;
                    if (!payEmployeeId) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, people_1.getEmployeeSalaryRecord)(client, payEmployeeId, companyId, year, month)];
                case 3:
                    record = _m.sent();
                    amountOwed = record.data ? (0, people_1.getAmountOwed)(record.data) : 0;
                    if (((_h = record.data) === null || _h === void 0 ? void 0 : _h.id) && amountOwed > 0) {
                        payment = {
                            year: year,
                            month: month,
                            salaryRecordId: record.data.id,
                            amountOwed: amountOwed,
                            returnTo: returnTo
                        };
                    }
                    else {
                        throw (0, react_router_1.redirect)(returnTo);
                    }
                    _m.label = 4;
                case 4: return [2 /*return*/, {
                        records: (_j = records.data) !== null && _j !== void 0 ? _j : [],
                        count: (_k = records.count) !== null && _k !== void 0 ? _k : 0,
                        departments: (_l = departments.data) !== null && _l !== void 0 ? _l : [],
                        year: year,
                        month: month,
                        payment: payment,
                        pickPayment: recordPayment && !payment,
                        returnTo: returnTo
                    }];
            }
        });
    });
}
function SalaryRoute() {
    var _a = (0, react_router_1.useLoaderData)(), records = _a.records, count = _a.count, departments = _a.departments, year = _a.year, month = _a.month, payment = _a.payment, pickPayment = _a.pickPayment, returnTo = _a.returnTo;
    return (<react_1.VStack spacing={0} className="h-full">
      <Salary_1.SalaryTable data={records} count={count} departments={departments} year={year} month={month}/>
      {pickPayment ? (<Salary_1.SalaryRecordPaymentPicker records={records} year={year} month={month} returnTo={returnTo}/>) : null}
      {payment ? (<Salary_1.SalaryPaymentForm salaryRecordId={payment.salaryRecordId} year={payment.year} month={payment.month} amountOwed={payment.amountOwed} returnTo={payment.returnTo}/>) : null}
    </react_1.VStack>);
}
