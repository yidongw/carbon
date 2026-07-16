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
exports.deleteAttribute = deleteAttribute;
exports.deleteAttributeCategory = deleteAttributeCategory;
exports.deleteDepartment = deleteDepartment;
exports.deleteHoliday = deleteHoliday;
exports.deleteShift = deleteShift;
exports.getAttribute = getAttribute;
exports.getAttributeCategories = getAttributeCategories;
exports.getAttributeCategory = getAttributeCategory;
exports.getAttributeDataTypes = getAttributeDataTypes;
exports.getDepartment = getDepartment;
exports.getDepartments = getDepartments;
exports.getDepartmentsList = getDepartmentsList;
exports.getDepartmentsTree = getDepartmentsTree;
exports.getEmployeeJob = getEmployeeJob;
exports.getEmployeeSummary = getEmployeeSummary;
exports.getHoliday = getHoliday;
exports.getHolidays = getHolidays;
exports.getHolidayYears = getHolidayYears;
exports.getPeople = getPeople;
exports.getContacts = getContacts;
exports.getShift = getShift;
exports.getShifts = getShifts;
exports.getShiftsList = getShiftsList;
exports.insertAttribute = insertAttribute;
exports.insertAttributeCategory = insertAttributeCategory;
exports.insertEmployeeJob = insertEmployeeJob;
exports.updateAttribute = updateAttribute;
exports.updateAttributeCategory = updateAttributeCategory;
exports.updateAttributeSortOrder = updateAttributeSortOrder;
exports.updateEmployeeJob = updateEmployeeJob;
exports.upsertDepartment = upsertDepartment;
exports.upsertHoliday = upsertHoliday;
exports.upsertShift = upsertShift;
exports.clockIn = clockIn;
exports.clockOut = clockOut;
exports.createTimeCardEntry = createTimeCardEntry;
exports.deleteTimeCardEntry = deleteTimeCardEntry;
exports.getClockedInEmployees = getClockedInEmployees;
exports.getOpenClockEntry = getOpenClockEntry;
exports.getRecentTimecards = getRecentTimecards;
exports.getScheduledEmployeesToday = getScheduledEmployeesToday;
exports.getTimeCardEntry = getTimeCardEntry;
exports.getTimeCardEntries = getTimeCardEntries;
exports.getTimecardEntries = getTimecardEntries;
exports.getWeeklyHoursForEmployees = getWeeklyHoursForEmployees;
exports.updateTimeCardEntry = updateTimeCardEntry;
exports.getEmployeeSalaryList = getEmployeeSalaryList;
exports.getEmployeeSalaryRecord = getEmployeeSalaryRecord;
exports.getSalaryRecordBalances = getSalaryRecordBalances;
exports.getAmountOwed = getAmountOwed;
exports.getEmployeeSalaryPayments = getEmployeeSalaryPayments;
exports.getCompanySalaryPayments = getCompanySalaryPayments;
exports.getSalaryReadyToPay = getSalaryReadyToPay;
exports.recordSalaryPayment = recordSalaryPayment;
exports.getEmployeeSalaryHistory = getEmployeeSalaryHistory;
var users_service_1 = require("~/modules/users/users.service");
var query_1 = require("~/utils/query");
var supabase_1 = require("~/utils/supabase");
function deleteAttribute(client, attributeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userAttribute")
                    .update({ active: false })
                    .eq("id", attributeId)];
        });
    });
}
function deleteAttributeCategory(client, attributeCategoryId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userAttributeCategory")
                    .update({ active: false })
                    .eq("id", attributeCategoryId)];
        });
    });
}
function deleteDepartment(client, departmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("department").delete().eq("id", departmentId)];
        });
    });
}
function deleteHoliday(client, holidayId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("holiday").delete().eq("id", holidayId)];
        });
    });
}
function deleteShift(client, shiftId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Set all employeeShifts to null
            return [2 /*return*/, client.from("shift").update({ active: false }).eq("id", shiftId)];
        });
    });
}
function getAttribute(client, attributeId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userAttribute")
                    .select("*, userAttributeCategory(name)")
                    .eq("id", attributeId)
                    .eq("active", true)
                    .single()];
        });
    });
}
function getAttributes(client, companyId, userIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userAttributeCategory")
                    .select("*,\n      userAttribute(id, name, listOptions, canSelfManage,\n        attributeDataType(id, isBoolean, isDate, isNumeric, isText, isUser, isFile),\n        userAttributeValue(\n          id, userId, valueBoolean, valueDate, valueNumeric, valueText, valueUser, valueFile, user!userAttributeValue_userId_fkey(id, fullName, avatarUrl)\n        )\n      )")
                    .eq("companyId", companyId)
                    .eq("userAttribute.active", true)
                    .in("userAttribute.userAttributeValue.userId", userIds)
                    .order("sortOrder", { foreignTable: "userAttribute", ascending: true })];
        });
    });
}
function getAttributeCategories(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("userAttributeCategory")
                .select("*, userAttribute(id, name, attributeDataType(id))", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("active", true)
                .eq("userAttribute.active", true);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getAttributeCategory(client, id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userAttributeCategory")
                    .select("*,\n      userAttribute(\n        id, name, sortOrder,\n        attributeDataType(id, label, isBoolean, isDate, isList, isNumeric, isText, isUser, isFile))\n      ", {
                    count: "exact"
                })
                    .eq("id", id)
                    .eq("active", true)
                    .eq("userAttribute.active", true)
                    .single()];
        });
    });
}
function getAttributeDataTypes(client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("attributeDataType").select("*")];
        });
    });
}
function getDepartment(client, departmentId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("department").select("*").eq("id", departmentId).single()];
        });
    });
}
function getDepartments(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("department")
                .select("*, department(id, name)", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "name", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getDepartmentsList(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("department")
                    .select("id, name")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getDepartmentsTree(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("department")
                    .select("id, name, parentDepartmentId")
                    .eq("companyId", companyId)
                    .order("name")];
        });
    });
}
function getEmployeeJob(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeJob")
                    .select("*")
                    .eq("id", employeeId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getEmployeeSummary(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeSummary")
                    .select("*")
                    .eq("id", employeeId)
                    .eq("companyId", companyId)
                    .single()];
        });
    });
}
function getHoliday(client, holidayId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("holiday").select("*").eq("id", holidayId).single()];
        });
    });
}
function getHolidays(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("holiday")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "date", ascending: true }
                ]);
            }
            return [2 /*return*/, query];
        });
    });
}
function getHolidayYears(client, companyId) {
    return client.from("holidayYears").select("year").eq("companyId", companyId);
}
function getPeople(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var employees, userIds, attributeCategories, people;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, users_service_1.getEmployees)(client, companyId, args)];
                case 1:
                    employees = _a.sent();
                    if (employees.error)
                        return [2 /*return*/, employees];
                    if (!employees.data)
                        throw new Error("Failed to get employee data");
                    userIds = employees.data.reduce(function (acc, employee) {
                        if (employee.id)
                            acc.push(employee.id);
                        return acc;
                    }, []);
                    return [4 /*yield*/, getAttributes(client, companyId, userIds)];
                case 2:
                    attributeCategories = _a.sent();
                    if (attributeCategories.error)
                        return [2 /*return*/, attributeCategories];
                    people = employees.data.map(function (employee) {
                        var userId = employee.id;
                        var employeeAttributes = attributeCategories.data.reduce(function (acc, category) {
                            if (!category.userAttribute || !Array.isArray(category.userAttribute))
                                return acc;
                            category.userAttribute.forEach(
                            // @ts-ignore
                            function (attribute) {
                                var _a;
                                if (attribute.userAttributeValue &&
                                    Array.isArray(attribute.userAttributeValue) &&
                                    !Array.isArray(attribute.attributeDataType)) {
                                    var userAttributeId = attribute.id;
                                    var userAttributeValue = attribute.userAttributeValue.find(
                                    // @ts-ignore
                                    function (attributeValue) { return attributeValue.userId === userId; });
                                    var value = typeof (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.valueBoolean) === "boolean"
                                        ? userAttributeValue.valueBoolean
                                        : (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.valueDate) ||
                                            (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.valueNumeric) ||
                                            (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.valueText) ||
                                            (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.valueUser) ||
                                            (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.valueFile);
                                    if (value && (userAttributeValue === null || userAttributeValue === void 0 ? void 0 : userAttributeValue.id)) {
                                        acc[userAttributeId] = {
                                            userAttributeValueId: userAttributeValue.id,
                                            // @ts-ignore
                                            dataType: (_a = attribute.attributeDataType) === null || _a === void 0 ? void 0 : _a.id,
                                            value: value,
                                            user: !Array.isArray(userAttributeValue.user)
                                                ? userAttributeValue.user
                                                : undefined
                                        };
                                    }
                                }
                            });
                            return acc;
                        }, {});
                        return __assign(__assign({}, employee), { attributes: employeeAttributes });
                    });
                    return [2 /*return*/, {
                            count: employees.count,
                            data: people,
                            error: null
                        }];
            }
        });
    });
}
function getContacts(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query, contacts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = client
                        .from("contact")
                        .select("*", { count: "exact" })
                        .eq("companyId", companyId);
                    if (args.search) {
                        query = query.or("firstName.ilike.%".concat(args.search, "%,lastName.ilike.%").concat(args.search, "%,email.ilike.%").concat(args.search, "%"));
                    }
                    query = (0, query_1.setGenericQueryFilters)(query, args, [
                        { column: "lastName", ascending: true }
                    ]);
                    return [4 /*yield*/, query];
                case 1:
                    contacts = _a.sent();
                    if (!contacts.data)
                        throw new Error("Failed to get contacts data");
                    return [2 /*return*/, {
                            count: contacts.count,
                            data: contacts.data,
                            error: null
                        }];
            }
        });
    });
}
function getShift(client, shiftId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("shifts")
                    .select("*")
                    .eq("id", shiftId)
                    .eq("active", true)
                    .single()];
        });
    });
}
function getShifts(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("shifts")
                .select("*", {
                count: "exact"
            })
                .eq("companyId", companyId)
                .eq("active", true);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("name", "%".concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "locationId", ascending: true }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getShiftsList(client, locationId) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client.from("shift").select("id, name").eq("active", true);
            if (locationId) {
                query = query.eq("locationId", locationId);
            }
            return [2 /*return*/, query.order("name")];
        });
    });
}
function insertAttribute(client, attribute) {
    return __awaiter(this, void 0, void 0, function () {
        var sortOrders, maxSortOrder;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("userAttribute")
                        .select("sortOrder")
                        .eq("userAttributeCategoryId", attribute.userAttributeCategoryId)];
                case 1:
                    sortOrders = _a.sent();
                    if (sortOrders.error)
                        return [2 /*return*/, sortOrders];
                    maxSortOrder = sortOrders.data.reduce(function (max, item) {
                        return Math.max(max, item.sortOrder);
                    }, 0);
                    return [2 /*return*/, client
                            .from("userAttribute")
                            .upsert([__assign(__assign({}, attribute), { sortOrder: maxSortOrder + 1 })])
                            .select("id")
                            .single()];
            }
        });
    });
}
function insertAttributeCategory(client, attributeCategory) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("userAttributeCategory")
                    .upsert([attributeCategory])
                    .select("id")
                    .single()];
        });
    });
}
function insertEmployeeJob(client, job) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("employeeJob").insert(job).select("*").single()];
        });
    });
}
function updateAttribute(client, attribute) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!attribute.id)
                throw new Error("id is required");
            return [2 /*return*/, client
                    .from("userAttribute")
                    .update((0, supabase_1.sanitize)({
                    name: attribute.name,
                    listOptions: attribute.listOptions,
                    canSelfManage: attribute.canSelfManage,
                    updatedBy: attribute.updatedBy
                }))
                    .eq("id", attribute.id)];
        });
    });
}
function updateAttributeCategory(client, attributeCategory) {
    return __awaiter(this, void 0, void 0, function () {
        var id, update;
        return __generator(this, function (_a) {
            id = attributeCategory.id, update = __rest(attributeCategory, ["id"]);
            return [2 /*return*/, client
                    .from("userAttributeCategory")
                    .update((0, supabase_1.sanitize)(update))
                    .eq("id", id)];
        });
    });
}
function updateAttributeSortOrder(client, updates) {
    return __awaiter(this, void 0, void 0, function () {
        var updatePromises;
        return __generator(this, function (_a) {
            updatePromises = updates.map(function (_a) {
                var id = _a.id, sortOrder = _a.sortOrder, updatedBy = _a.updatedBy;
                return client.from("userAttribute").update({ sortOrder: sortOrder, updatedBy: updatedBy }).eq("id", id);
            });
            return [2 /*return*/, Promise.all(updatePromises)];
        });
    });
}
// Uses upsert so callers can update employee job fields without first
// ensuring insertEmployeeJob ran (e.g. legacy employees missing a row).
function updateEmployeeJob(client, employeeId, employeeJob) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, updatedBy, customFields, jobFields;
        return __generator(this, function (_a) {
            companyId = employeeJob.companyId, updatedBy = employeeJob.updatedBy, customFields = employeeJob.customFields, jobFields = __rest(employeeJob, ["companyId", "updatedBy", "customFields"]);
            return [2 /*return*/, client.from("employeeJob").upsert((0, supabase_1.sanitize)(__assign(__assign({ id: employeeId, companyId: companyId }, jobFields), { customFields: customFields, updatedBy: updatedBy, updatedAt: new Date().toISOString() })), { onConflict: "id,companyId" })];
        });
    });
}
function upsertDepartment(client, department) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("id" in department) {
                return [2 /*return*/, client
                        .from("department")
                        .update((0, supabase_1.sanitize)(department))
                        .eq("id", department.id)];
            }
            return [2 /*return*/, client.from("department").insert(department).select("*").single()];
        });
    });
}
function upsertHoliday(client, holiday) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in holiday) {
                return [2 /*return*/, client.from("holiday").insert(holiday).select("*").single()];
            }
            return [2 /*return*/, client.from("holiday").update((0, supabase_1.sanitize)(holiday)).eq("id", holiday.id)];
        });
    });
}
function upsertShift(client, shift) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if ("createdBy" in shift) {
                return [2 /*return*/, client.from("shift").insert([shift]).select("*").single()];
            }
            return [2 /*return*/, client.from("shift").update((0, supabase_1.sanitize)(shift)).eq("id", shift.id)];
        });
    });
}
function clockIn(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var existing;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getOpenClockEntry(client, args.employeeId, args.companyId)];
                case 1:
                    existing = _a.sent();
                    if (existing.data) {
                        return [2 /*return*/, { data: null, error: { message: "Already clocked in" } }];
                    }
                    return [2 /*return*/, client.from("timeCardEntry").insert({
                            employeeId: args.employeeId,
                            companyId: args.companyId,
                            createdBy: args.createdBy
                        })];
            }
        });
    });
}
function clockOut(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var open;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getOpenClockEntry(client, args.employeeId, args.companyId)];
                case 1:
                    open = _b.sent();
                    if (!open.data) {
                        return [2 /*return*/, { data: null, error: { message: "Not currently clocked in" } }];
                    }
                    return [2 /*return*/, client
                            .from("timeCardEntry")
                            .update((0, supabase_1.sanitize)({
                            clockOut: (_a = args.clockOut) !== null && _a !== void 0 ? _a : new Date().toISOString(),
                            note: args.note,
                            updatedBy: args.updatedBy,
                            updatedAt: new Date().toISOString()
                        }))
                            .eq("id", open.data.id)];
            }
        });
    });
}
function createTimeCardEntry(client, entry) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("timeCardEntry")
                    .insert((0, supabase_1.sanitize)(entry))
                    .select("id")
                    .single()];
        });
    });
}
function deleteTimeCardEntry(client, entryId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("timeCardEntry").delete().eq("id", entryId)];
        });
    });
}
function getClockedInEmployees(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("timeCardEntries")
                    .select("*")
                    .eq("companyId", companyId)
                    .is("clockOut", null)
                    .order("clockIn", { ascending: true })];
        });
    });
}
function getOpenClockEntry(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("timeCardEntry")
                    .select("*")
                    .eq("employeeId", employeeId)
                    .eq("companyId", companyId)
                    .is("clockOut", null)
                    .maybeSingle()];
        });
    });
}
function getRecentTimecards(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("timeCardEntries")
                    .select("*")
                    .eq("companyId", companyId)
                    .order("clockIn", { ascending: false })
                    .limit(100)];
        });
    });
}
function getScheduledEmployeesToday(client, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, dayNames, today;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client
                        .from("employeeJob")
                        .select("id, shiftId, shift:shift(id, name, startTime, endTime, sunday, monday, tuesday, wednesday, thursday, friday, saturday)")
                        .eq("companyId", companyId)
                        .not("shiftId", "is", null)];
                case 1:
                    data = (_a.sent()).data;
                    if (!data)
                        return [2 /*return*/, []];
                    dayNames = [
                        "sunday",
                        "monday",
                        "tuesday",
                        "wednesday",
                        "thursday",
                        "friday",
                        "saturday"
                    ];
                    today = dayNames[new Date().getDay()];
                    return [2 /*return*/, data.filter(function (ej) {
                            var shift = ej.shift;
                            return shift && shift[today] === true;
                        })];
            }
        });
    });
}
function getTimeCardEntry(client, entryId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client.from("timeCardEntry").select("*").eq("id", entryId).single()];
        });
    });
}
function getTimeCardEntries(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("timeCardEntry")
                .select("*")
                .eq("employeeId", args.employeeId)
                .eq("companyId", args.companyId)
                .order("clockIn", { ascending: false });
            if (args.from) {
                query = query.gte("clockIn", args.from);
            }
            if (args.to) {
                query = query.lte("clockIn", args.to);
            }
            return [2 /*return*/, query];
        });
    });
}
function getTimecardEntries(client, companyId, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("timeCardEntries")
                .select("*", { count: "exact" })
                .eq("companyId", companyId);
            if (args.search) {
                query = query.or("firstName.ilike.%".concat(args.search, "%,lastName.ilike.%").concat(args.search, "%"));
            }
            query = (0, query_1.setGenericQueryFilters)(query, args, [
                { column: "clockIn", ascending: false }
            ]);
            return [2 /*return*/, query];
        });
    });
}
function getWeeklyHoursForEmployees(client, companyId, employeeIds) {
    return __awaiter(this, void 0, void 0, function () {
        var now, dayOfWeek, monday, entries, weeklyMs, _i, _a, entry, end, ms;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    now = new Date();
                    dayOfWeek = now.getDay();
                    monday = new Date(now);
                    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
                    monday.setHours(0, 0, 0, 0);
                    return [4 /*yield*/, client
                            .from("timeCardEntry")
                            .select("employeeId, clockIn, clockOut")
                            .eq("companyId", companyId)
                            .in("employeeId", employeeIds)
                            .gte("clockIn", monday.toISOString())];
                case 1:
                    entries = (_c.sent()).data;
                    weeklyMs = {};
                    for (_i = 0, _a = entries !== null && entries !== void 0 ? entries : []; _i < _a.length; _i++) {
                        entry = _a[_i];
                        end = entry.clockOut
                            ? new Date(entry.clockOut).getTime()
                            : Date.now();
                        ms = end - new Date(entry.clockIn).getTime();
                        weeklyMs[entry.employeeId] = ((_b = weeklyMs[entry.employeeId]) !== null && _b !== void 0 ? _b : 0) + ms;
                    }
                    return [2 /*return*/, weeklyMs];
            }
        });
    });
}
function updateTimeCardEntry(client, args) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("timeCardEntry")
                    .update((0, supabase_1.sanitize)({
                    clockIn: args.clockIn,
                    clockOut: args.clockOut,
                    note: args.note,
                    updatedBy: args.updatedBy,
                    updatedAt: new Date().toISOString()
                }))
                    .eq("id", args.entryId)];
        });
    });
}
function attachDepartmentToSalaryRecords(client, companyId, records) {
    return __awaiter(this, void 0, void 0, function () {
        var employeeIds, _a, jobs, summaries, departmentByEmployee, _i, _b, job, _c, _d, summary, existing;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    employeeIds = __spreadArray([], new Set(records.map(function (row) { return row.employeeId; }).filter(function (id) { return !!id; })), true);
                    if (employeeIds.length === 0) {
                        return [2 /*return*/, records];
                    }
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("employeeJob")
                                .select("id, departmentId")
                                .eq("companyId", companyId)
                                .in("id", employeeIds),
                            client
                                .from("employeeSummary")
                                .select("id, departmentName")
                                .eq("companyId", companyId)
                                .in("id", employeeIds)
                        ])];
                case 1:
                    _a = _f.sent(), jobs = _a[0].data, summaries = _a[1].data;
                    departmentByEmployee = new Map();
                    for (_i = 0, _b = jobs !== null && jobs !== void 0 ? jobs : []; _i < _b.length; _i++) {
                        job = _b[_i];
                        departmentByEmployee.set(job.id, {
                            departmentId: job.departmentId,
                            departmentName: null
                        });
                    }
                    for (_c = 0, _d = summaries !== null && summaries !== void 0 ? summaries : []; _c < _d.length; _c++) {
                        summary = _d[_c];
                        if (summary.id == null)
                            continue;
                        existing = departmentByEmployee.get(summary.id);
                        departmentByEmployee.set(summary.id, {
                            departmentId: (_e = existing === null || existing === void 0 ? void 0 : existing.departmentId) !== null && _e !== void 0 ? _e : null,
                            departmentName: summary.departmentName
                        });
                    }
                    return [2 /*return*/, records.map(function (row) {
                            var _a, _b;
                            if (!row.employeeId)
                                return row;
                            var department = departmentByEmployee.get(row.employeeId);
                            if (!department)
                                return row;
                            return __assign(__assign({}, row), { departmentId: (_a = row.departmentId) !== null && _a !== void 0 ? _a : department.departmentId, departmentName: (_b = row.departmentName) !== null && _b !== void 0 ? _b : department.departmentName });
                        })];
            }
        });
    });
}
function getEmployeeIdsForDepartmentFilters(client, companyId, filters) {
    return __awaiter(this, void 0, void 0, function () {
        var departmentFilters, departmentIds, _i, departmentFilters_1, filter, values, _a, values_1, id, _b, data, error;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    departmentFilters = filters.filter(function (f) { return f.column === "departmentId" && f.value; });
                    if (departmentFilters.length === 0) {
                        return [2 /*return*/, { employeeIds: null, error: null }];
                    }
                    departmentIds = new Set();
                    for (_i = 0, departmentFilters_1 = departmentFilters; _i < departmentFilters_1.length; _i++) {
                        filter = departmentFilters_1[_i];
                        values = filter.operator === "in" || filter.operator === "contains"
                            ? filter.value.split(",")
                            : [filter.value];
                        for (_a = 0, values_1 = values; _a < values_1.length; _a++) {
                            id = values_1[_a];
                            if (id)
                                departmentIds.add(id);
                        }
                    }
                    return [4 /*yield*/, client
                            .from("employeeJob")
                            .select("id")
                            .eq("companyId", companyId)
                            .in("departmentId", __spreadArray([], departmentIds, true))];
                case 1:
                    _b = _d.sent(), data = _b.data, error = _b.error;
                    if (error) {
                        return [2 /*return*/, { employeeIds: [], error: error }];
                    }
                    return [2 /*return*/, { employeeIds: (_c = data === null || data === void 0 ? void 0 : data.map(function (row) { return row.id; })) !== null && _c !== void 0 ? _c : [], error: null }];
            }
        });
    });
}
var SALARY_PAYMENT_STATUSES = ["Unpaid", "Partially Paid", "Paid"];
function collectSalaryStatusValues(filters) {
    var statuses = new Set();
    for (var _i = 0, filters_1 = filters; _i < filters_1.length; _i++) {
        var filter = filters_1[_i];
        if (filter.column !== "status" || !filter.value)
            continue;
        var values = filter.operator === "in" || filter.operator === "contains"
            ? filter.value
                .split(",")
                .map(function (v) { return v.trim(); })
                .filter(Boolean)
            : [filter.value];
        for (var _a = 0, values_2 = values; _a < values_2.length; _a++) {
            var value = values_2[_a];
            if (SALARY_PAYMENT_STATUSES.includes(value)) {
                statuses.add(value);
            }
        }
    }
    return __spreadArray([], statuses, true);
}
function applySalaryStatusFilter(
// eslint-disable-next-line @typescript-eslint/no-explicit-any
query, statuses) {
    if (statuses.length === 0 ||
        statuses.length >= SALARY_PAYMENT_STATUSES.length) {
        return query;
    }
    if (statuses.length === 1) {
        return query.eq("status", statuses[0]);
    }
    return query.in("status", statuses);
}
function getEmployeeSalaryList(client, companyId, year, month, args) {
    return __awaiter(this, void 0, void 0, function () {
        var filters, _a, departmentEmployeeIds, departmentError, salaryStatuses, otherFilters, query, result, _b;
        var _c;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    filters = (_d = args === null || args === void 0 ? void 0 : args.filters) !== null && _d !== void 0 ? _d : [];
                    return [4 /*yield*/, getEmployeeIdsForDepartmentFilters(client, companyId, filters)];
                case 1:
                    _a = _e.sent(), departmentEmployeeIds = _a.employeeIds, departmentError = _a.error;
                    if (departmentError) {
                        return [2 /*return*/, {
                                data: null,
                                error: departmentError,
                                count: null,
                                status: 0,
                                statusText: ""
                            }];
                    }
                    if (departmentEmployeeIds !== null && departmentEmployeeIds.length === 0) {
                        return [2 /*return*/, { data: [], error: null, count: 0, status: 200, statusText: "OK" }];
                    }
                    salaryStatuses = collectSalaryStatusValues(filters);
                    otherFilters = filters.filter(function (f) { return f.column !== "departmentId" && f.column !== "status"; });
                    query = client
                        .from("employeeSalaryRecords")
                        .select("*", { count: "exact" })
                        .eq("companyId", companyId)
                        .eq("year", year)
                        .eq("month", month);
                    if (departmentEmployeeIds !== null) {
                        query = query.in("employeeId", departmentEmployeeIds);
                    }
                    if (args === null || args === void 0 ? void 0 : args.search) {
                        query = query.ilike("employeeName", "%".concat(args.search, "%"));
                    }
                    query = applySalaryStatusFilter(query, salaryStatuses);
                    if (args) {
                        query = (0, query_1.setGenericQueryFilters)(query, __assign(__assign({}, args), { filters: otherFilters }), [
                            { column: "employeeName", ascending: true }
                        ]);
                    }
                    else {
                        query = query.order("employeeName", { ascending: true });
                    }
                    return [4 /*yield*/, query];
                case 2:
                    result = _e.sent();
                    if (result.error || !result.data) {
                        return [2 /*return*/, result];
                    }
                    _b = [__assign({}, result)];
                    _c = {};
                    return [4 /*yield*/, attachDepartmentToSalaryRecords(client, companyId, result.data)];
                case 3: return [2 /*return*/, __assign.apply(void 0, _b.concat([(_c.data = _e.sent(), _c)]))];
            }
        });
    });
}
function getEmployeeSalaryRecord(client, employeeId, companyId, year, month) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeSalaryRecords")
                    .select("*")
                    .eq("employeeId", employeeId)
                    .eq("companyId", companyId)
                    .eq("year", year)
                    .eq("month", month)
                    .maybeSingle()];
        });
    });
}
function getSalaryRecordBalances(client, salaryRecordId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeSalaryRecord")
                    .select("id, totalEarned, totalPaid")
                    .eq("id", salaryRecordId)
                    .eq("companyId", companyId)
                    .maybeSingle()];
        });
    });
}
function getAmountOwed(record) {
    var _a, _b;
    return ((_a = record.totalEarned) !== null && _a !== void 0 ? _a : 0) - ((_b = record.totalPaid) !== null && _b !== void 0 ? _b : 0);
}
function getEmployeeSalaryPayments(client, salaryRecordId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeSalaryPayment")
                    .select("*, paidByUser:user!paidBy(firstName, lastName, fullName)")
                    .eq("salaryRecordId", salaryRecordId)
                    .order("paidAt", { ascending: false })];
        });
    });
}
function getCompanySalaryPayments(client, companyId, year, month, args) {
    return __awaiter(this, void 0, void 0, function () {
        var monthStart, nextMonth, nextYear, monthEnd, query;
        return __generator(this, function (_a) {
            monthStart = "".concat(year, "-").concat(String(month).padStart(2, "0"), "-01");
            nextMonth = month === 12 ? 1 : month + 1;
            nextYear = month === 12 ? year + 1 : year;
            monthEnd = "".concat(nextYear, "-").concat(String(nextMonth).padStart(2, "0"), "-01");
            query = client
                .from("employeeSalaryPayment")
                .select("id, amount, paidAt, notes, salaryRecordId,\n       paidByUser:user!paidBy(firstName, lastName, fullName),\n       salaryRecord:employeeSalaryRecords!inner(\n         employeeId, employeeName, firstName, lastName, avatarUrl, year, month\n       )", { count: "exact" })
                .eq("companyId", companyId)
                .gte("paidAt", monthStart)
                .lt("paidAt", monthEnd);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("salaryRecord.employeeName", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "paidAt", ascending: false }
                ]);
            }
            else {
                query = query.order("paidAt", { ascending: false });
            }
            return [2 /*return*/, query];
        });
    });
}
function getSalaryReadyToPay(client, companyId, year, month, args) {
    return __awaiter(this, void 0, void 0, function () {
        var query;
        return __generator(this, function (_a) {
            query = client
                .from("employeeSalaryRecords")
                .select("*", { count: "exact" })
                .eq("companyId", companyId)
                .eq("year", year)
                .eq("month", month)
                .gt("amountOwed", 0);
            if (args === null || args === void 0 ? void 0 : args.search) {
                query = query.ilike("employeeName", "%".concat(args.search, "%"));
            }
            if (args) {
                query = (0, query_1.setGenericQueryFilters)(query, args, [
                    { column: "employeeName", ascending: true }
                ]);
            }
            else {
                query = query.order("employeeName", { ascending: true });
            }
            return [2 /*return*/, query];
        });
    });
}
function recordSalaryPayment(client, data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            return [2 /*return*/, client
                    .from("employeeSalaryPayment")
                    .insert({
                    salaryRecordId: data.salaryRecordId,
                    companyId: data.companyId,
                    amount: data.amount,
                    paidAt: data.paidAt,
                    paidBy: data.paidBy,
                    notes: (_a = data.notes) !== null && _a !== void 0 ? _a : null
                })
                    .select("id")
                    .single()];
        });
    });
}
function getEmployeeSalaryHistory(client, employeeId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, client
                    .from("employeeSalaryRecords")
                    .select("*")
                    .eq("employeeId", employeeId)
                    .eq("companyId", companyId)
                    .order("year", { ascending: false })
                    .order("month", { ascending: false })
                    .limit(24)];
        });
    });
}
// Job Assignment Rules functions have moved to ./people.jobAssignmentRules.service.ts
// (re-exported via ./index.ts).
//
// TODO: split the remaining salary and production-pay approval helpers into
// people.salary.service.ts and people.approvals.service.ts respectively.
