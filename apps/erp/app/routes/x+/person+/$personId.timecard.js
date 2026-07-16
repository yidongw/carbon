"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loader = loader;
exports.action = action;
exports.default = PersonTimecardRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var people_1 = require("~/modules/people");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
function getWeekBounds(offset) {
    if (offset === void 0) { offset = 0; }
    var now = new Date();
    var dayOfWeek = now.getDay(); // 0 = Sunday
    var monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7) + offset * 7);
    monday.setHours(0, 0, 0, 0);
    var sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return {
        from: monday.toISOString(),
        to: sunday.toISOString(),
        monday: monday,
        sunday: sunday
    };
}
function formatDuration(clockIn, clockOut) {
    var end = clockOut ? new Date(clockOut).getTime() : Date.now();
    var ms = end - new Date(clockIn).getTime();
    var hours = Math.floor(ms / 3600000);
    var minutes = Math.floor((ms % 3600000) / 60000);
    return "".concat(hours, "h ").concat(minutes, "m");
}
function formatTotalHours(entries) {
    var totalMs = 0;
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var end = entry.clockOut
            ? new Date(entry.clockOut).getTime()
            : Date.now();
        totalMs += end - new Date(entry.clockIn).getTime();
    }
    var hours = Math.floor(totalMs / 3600000);
    var minutes = Math.floor((totalMs % 3600000) / 60000);
    return "".concat(hours, "h ").concat(minutes, "m");
}
function formatTime(dateStr, locale) {
    return new Date(dateStr).toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit"
    });
}
function formatDay(dateStr, locale) {
    return new Date(dateStr).toLocaleDateString(locale, {
        weekday: "short",
        month: "short",
        day: "numeric"
    });
}
/** Format a UTC date string to a local datetime-local input value */
function toLocalDatetimeInput(dateStr) {
    var d = new Date(dateStr);
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    var hours = String(d.getHours()).padStart(2, "0");
    var minutes = String(d.getMinutes()).padStart(2, "0");
    return "".concat(year, "-").concat(month, "-").concat(day, "T").concat(hours, ":").concat(minutes);
}
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, personId, url, weekOffset, _d, from, to, _e, entries, openEntry, companySettings, employeeShift, shift;
        var _f, _g, _h, _j;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "people"
                    })];
                case 1:
                    _c = _k.sent(), client = _c.client, companyId = _c.companyId;
                    personId = params.personId;
                    if (!personId)
                        throw new Error("Could not find personId");
                    url = new URL(request.url);
                    weekOffset = parseInt((_f = url.searchParams.get("week")) !== null && _f !== void 0 ? _f : "0", 10);
                    _d = getWeekBounds(weekOffset), from = _d.from, to = _d.to;
                    return [4 /*yield*/, Promise.all([
                            (0, people_1.getTimeCardEntries)(client, {
                                employeeId: personId,
                                companyId: companyId,
                                from: from,
                                to: to
                            }),
                            (0, people_1.getOpenClockEntry)(client, personId, companyId),
                            (0, settings_1.getCompanySettings)(client, companyId),
                            client
                                .from("employeeJob")
                                .select("shiftId, shift:shift(startTime, endTime, sunday, monday, tuesday, wednesday, thursday, friday, saturday)")
                                .eq("id", personId)
                                .eq("companyId", companyId)
                                .maybeSingle()
                        ])];
                case 2:
                    _e = _k.sent(), entries = _e[0], openEntry = _e[1], companySettings = _e[2], employeeShift = _e[3];
                    if (!((_g = companySettings.data) === null || _g === void 0 ? void 0 : _g.timeCardEnabled)) {
                        throw (0, react_router_1.redirect)(path_1.path.to.personDetails(personId));
                    }
                    shift = (_h = employeeShift === null || employeeShift === void 0 ? void 0 : employeeShift.data) === null || _h === void 0 ? void 0 : _h.shift;
                    return [2 /*return*/, {
                            entries: (_j = entries.data) !== null && _j !== void 0 ? _j : [],
                            openEntry: openEntry.data,
                            weekOffset: weekOffset,
                            from: from,
                            to: to,
                            shift: shift
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, personId, formData, intent, validation, employeeId, result, _d, _e, _f, _g, validation, employeeId, result, _h, _j, _k, _l, validation, result, _m, _o, _p, _q, validation, result, _r, _s, _t, _u, clockInVal, clockOutVal, result, _v, _w, _x, _y;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_z) {
            switch (_z.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            view: "people"
                        })];
                case 1:
                    _c = _z.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    personId = params.personId;
                    if (!personId)
                        throw new Error("No person ID provided");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _z.sent();
                    intent = formData.get("intent");
                    if (!(intent === "clockIn")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, form_1.validator)(people_1.clockInValidator).validate(formData)];
                case 3:
                    validation = _z.sent();
                    if (validation.error)
                        return [2 /*return*/, (0, react_router_1.data)({}, { status: 400 })];
                    employeeId = validation.data.employeeId || personId;
                    return [4 /*yield*/, (0, people_1.clockIn)(client, {
                            employeeId: employeeId,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 4:
                    result = _z.sent();
                    if (!result.error) return [3 /*break*/, 6];
                    _d = react_router_1.data;
                    _e = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, result.error.message))];
                case 5: return [2 /*return*/, _d.apply(void 0, _e.concat([_z.sent()]))];
                case 6:
                    _f = react_router_1.data;
                    _g = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Clocked in"))];
                case 7: return [2 /*return*/, _f.apply(void 0, _g.concat([_z.sent()]))];
                case 8:
                    if (!(intent === "clockOut")) return [3 /*break*/, 14];
                    return [4 /*yield*/, (0, form_1.validator)(people_1.clockOutValidator).validate(formData)];
                case 9:
                    validation = _z.sent();
                    if (validation.error)
                        return [2 /*return*/, (0, react_router_1.data)({}, { status: 400 })];
                    employeeId = validation.data.employeeId || personId;
                    return [4 /*yield*/, (0, people_1.clockOut)(client, {
                            employeeId: employeeId,
                            companyId: companyId,
                            updatedBy: userId,
                            note: validation.data.note
                        })];
                case 10:
                    result = _z.sent();
                    if (!result.error) return [3 /*break*/, 12];
                    _h = react_router_1.data;
                    _j = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, result.error.message))];
                case 11: return [2 /*return*/, _h.apply(void 0, _j.concat([_z.sent()]))];
                case 12:
                    _k = react_router_1.data;
                    _l = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Clocked out"))];
                case 13: return [2 /*return*/, _k.apply(void 0, _l.concat([_z.sent()]))];
                case 14:
                    if (!(intent === "updateEntry")) return [3 /*break*/, 20];
                    return [4 /*yield*/, (0, form_1.validator)(people_1.updateTimeCardEntryValidator).validate(formData)];
                case 15:
                    validation = _z.sent();
                    if (validation.error)
                        return [2 /*return*/, (0, react_router_1.data)({}, { status: 400 })];
                    return [4 /*yield*/, (0, people_1.updateTimeCardEntry)(client, {
                            entryId: validation.data.entryId,
                            clockIn: validation.data.clockIn,
                            clockOut: validation.data.clockOut || null,
                            note: validation.data.note || null,
                            updatedBy: userId
                        })];
                case 16:
                    result = _z.sent();
                    if (!result.error) return [3 /*break*/, 18];
                    _m = react_router_1.data;
                    _o = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to update entry"))];
                case 17: return [2 /*return*/, _m.apply(void 0, _o.concat([_z.sent()]))];
                case 18:
                    _p = react_router_1.data;
                    _q = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Entry updated"))];
                case 19: return [2 /*return*/, _p.apply(void 0, _q.concat([_z.sent()]))];
                case 20:
                    if (!(intent === "deleteEntry")) return [3 /*break*/, 26];
                    return [4 /*yield*/, (0, form_1.validator)(people_1.deleteTimeCardEntryValidator).validate(formData)];
                case 21:
                    validation = _z.sent();
                    if (validation.error)
                        return [2 /*return*/, (0, react_router_1.data)({}, { status: 400 })];
                    return [4 /*yield*/, (0, people_1.deleteTimeCardEntry)(client, validation.data.entryId)];
                case 22:
                    result = _z.sent();
                    if (!result.error) return [3 /*break*/, 24];
                    _r = react_router_1.data;
                    _s = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to delete entry"))];
                case 23: return [2 /*return*/, _r.apply(void 0, _s.concat([_z.sent()]))];
                case 24:
                    _t = react_router_1.data;
                    _u = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Entry deleted"))];
                case 25: return [2 /*return*/, _t.apply(void 0, _u.concat([_z.sent()]))];
                case 26:
                    if (!(intent === "addEntry")) return [3 /*break*/, 31];
                    clockInVal = formData.get("clockIn");
                    clockOutVal = formData.get("clockOut");
                    if (!clockInVal)
                        return [2 /*return*/, (0, react_router_1.data)({}, { status: 400 })];
                    return [4 /*yield*/, client.from("timeCardEntry").insert({
                            employeeId: personId,
                            companyId: companyId,
                            clockIn: clockInVal,
                            clockOut: clockOutVal || null,
                            createdBy: userId
                        })];
                case 27:
                    result = _z.sent();
                    if (!result.error) return [3 /*break*/, 29];
                    _v = react_router_1.data;
                    _w = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to add entry"))];
                case 28: return [2 /*return*/, _v.apply(void 0, _w.concat([_z.sent()]))];
                case 29:
                    _x = react_router_1.data;
                    _y = [{}];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Entry added"))];
                case 30: return [2 /*return*/, _x.apply(void 0, _y.concat([_z.sent()]))];
                case 31: return [2 /*return*/, (0, react_router_1.data)({}, { status: 400 })];
            }
        });
    });
}
function getShiftTimesForDate(dateStr, shift) {
    if (!shift)
        return null;
    // Parse YYYY-MM-DD as local date (not UTC)
    var _a = dateStr.split("-").map(Number), year = _a[0], month = _a[1], day2 = _a[2];
    var date = new Date(year, month - 1, day2);
    var dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
    ];
    var day = dayNames[date.getDay()];
    if (!shift[day])
        return null;
    var _b = shift.startTime.split(":").map(Number), startH = _b[0], startM = _b[1];
    var _c = shift.endTime.split(":").map(Number), endH = _c[0], endM = _c[1];
    var clockIn = new Date(date);
    clockIn.setHours(startH, startM, 0, 0);
    var clockOut = new Date(date);
    clockOut.setHours(endH, endM, 0, 0);
    if (clockOut <= clockIn)
        clockOut.setDate(clockOut.getDate() + 1);
    return {
        clockIn: toLocalDatetimeInput(clockIn.toISOString()),
        clockOut: toLocalDatetimeInput(clockOut.toISOString())
    };
}
function PersonTimecardRoute() {
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _a = (0, react_router_1.useLoaderData)(), entries = _a.entries, openEntry = _a.openEntry, weekOffset = _a.weekOffset, from = _a.from, to = _a.to, shift = _a.shift;
    var personId = (0, react_router_1.useParams)().personId;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(null), editingId = _b[0], setEditingId = _b[1];
    var _c = (0, react_2.useState)(""), editClockIn = _c[0], setEditClockIn = _c[1];
    var _d = (0, react_2.useState)(""), editClockOut = _d[0], setEditClockOut = _d[1];
    var _e = (0, react_2.useState)(""), editNote = _e[0], setEditNote = _e[1];
    var _f = (0, react_2.useState)(0), setTick = _f[1];
    var _g = (0, react_2.useState)(false), showAddForm = _g[0], setShowAddForm = _g[1];
    var _h = (0, react_2.useState)(""), addDate = _h[0], setAddDate = _h[1];
    var _j = (0, react_2.useState)(""), addClockIn = _j[0], setAddClockIn = _j[1];
    var _k = (0, react_2.useState)(""), addClockOut = _k[0], setAddClockOut = _k[1];
    var _l = (0, react_2.useState)(null), deletingEntry = _l[0], setDeletingEntry = _l[1];
    // Update live durations every minute
    (0, react_2.useEffect)(function () {
        var interval = setInterval(function () { return setTick(function (t) { return t + 1; }); }, 60000);
        return function () { return clearInterval(interval); };
    }, []);
    var monday = new Date(from);
    var sunday = new Date(to);
    var isCurrentWeek = weekOffset === 0;
    (0, react_2.useEffect)(function () {
        if (fetcher.data && fetcher.state === "idle") {
            setEditingId(null);
            setShowAddForm(false);
        }
    }, [fetcher.data, fetcher.state]);
    // Auto-populate shift times when date is selected for new entry
    (0, react_2.useEffect)(function () {
        if (!addDate)
            return;
        var shiftTimes = getShiftTimesForDate(addDate, shift !== null && shift !== void 0 ? shift : null);
        if (shiftTimes) {
            setAddClockIn(shiftTimes.clockIn);
            setAddClockOut(shiftTimes.clockOut);
        }
        else {
            // No shift for this day, default 9am-5pm
            var _a = addDate.split("-").map(Number), y = _a[0], m = _a[1], dy = _a[2];
            var d = new Date(y, m - 1, dy);
            d.setHours(9, 0, 0, 0);
            setAddClockIn(toLocalDatetimeInput(d.toISOString()));
            d.setHours(17, 0, 0, 0);
            setAddClockOut(toLocalDatetimeInput(d.toISOString()));
        }
    }, [addDate, shift]);
    function startEdit(entry) {
        var _a;
        setEditingId(entry.id);
        setEditClockIn(toLocalDatetimeInput(entry.clockIn));
        setEditClockOut(entry.clockOut ? toLocalDatetimeInput(entry.clockOut) : "");
        setEditNote((_a = entry.note) !== null && _a !== void 0 ? _a : "");
    }
    return (<react_1.Card className="overflow-hidden">
      <react_1.CardHeader>
        <react_1.HStack className="justify-between items-center">
          <react_1.CardTitle>
            <macro_1.Trans>Timecards</macro_1.Trans>
          </react_1.CardTitle>
          <react_1.HStack className="gap-1">
            <react_1.Button variant="secondary" leftIcon={<lu_1.LuPlus />} onClick={function () {
            setShowAddForm(!showAddForm);
            setAddDate("");
            setAddClockIn("");
            setAddClockOut("");
        }}>
              <macro_1.Trans>Add Entry</macro_1.Trans>
            </react_1.Button>
            {openEntry ? (<fetcher.Form method="post">
                <input type="hidden" name="intent" value="clockOut"/>
                <react_1.Button variant="destructive" type="submit" disabled={fetcher.state !== "idle"}>
                  <macro_1.Trans>Clock Out</macro_1.Trans>
                </react_1.Button>
              </fetcher.Form>) : (<fetcher.Form method="post">
                <input type="hidden" name="intent" value="clockIn"/>
                <react_1.Button leftIcon={<lu_1.LuPlay />} type="submit" disabled={fetcher.state !== "idle"}>
                  <macro_1.Trans>Clock In</macro_1.Trans>
                </react_1.Button>
              </fetcher.Form>)}
          </react_1.HStack>
        </react_1.HStack>
        {openEntry && (<react_1.Badge variant="green" className="w-fit">
            <macro_1.Trans>
              Clocked in since {formatTime(openEntry.clockIn, locale)}
            </macro_1.Trans>
          </react_1.Badge>)}
      </react_1.CardHeader>
      <react_1.CardContent>
        <react_1.HStack className="justify-between items-center mb-4">
          <react_1.Button variant="outline" asChild leftIcon={<lu_1.LuChevronLeft />}>
            <react_router_1.Link to={"".concat(path_1.path.to.personTimecard(personId), "?week=").concat(weekOffset - 1)}>
              <macro_1.Trans>Prev</macro_1.Trans>
            </react_router_1.Link>
          </react_1.Button>
          <span className="text-sm text-muted-foreground">
            {formatDate(monday.toISOString(), { dateStyle: "medium" })} —{" "}
            {formatDate(sunday.toISOString(), { dateStyle: "medium" })}
          </span>
          <react_1.Button variant="outline" disabled={isCurrentWeek} asChild={!isCurrentWeek} rightIcon={<lu_1.LuChevronRight />}>
            {isCurrentWeek ? (<span>
                <macro_1.Trans>Next</macro_1.Trans>
              </span>) : (<react_router_1.Link to={"".concat(path_1.path.to.personTimecard(personId), "?week=").concat(weekOffset + 1)}>
                <macro_1.Trans>Next</macro_1.Trans>
              </react_router_1.Link>)}
          </react_1.Button>
        </react_1.HStack>

        <react_1.Table className="table-fixed w-full">
          <colgroup>
            <col className="w-[16%]"/>
            <col className="w-[28%]"/>
            <col className="w-[28%]"/>
            <col className="w-[12%]"/>
            <col className="w-[16%]"/>
          </colgroup>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th className="whitespace-nowrap">
                <macro_1.Trans>Date</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Clock In</macro_1.Trans>
              </react_1.Th>
              <react_1.Th>
                <macro_1.Trans>Clock Out</macro_1.Trans>
              </react_1.Th>
              <react_1.Th className="text-center">
                <macro_1.Trans>Duration</macro_1.Trans>
              </react_1.Th>
              <react_1.Th />
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            {showAddForm && (<react_1.Tr>
                <react_1.Td>
                  <react_1.Select value={addDate} onValueChange={function (value) { return setAddDate(value); }}>
                    <react_1.SelectTrigger size="sm">
                      <react_1.SelectValue placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Date"], ["Date"])))}/>
                    </react_1.SelectTrigger>
                    <react_1.SelectContent>
                      {Array.from({ length: 7 }, function (_, i) {
                var d = new Date(monday);
                d.setDate(monday.getDate() + i);
                var val = "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, "0"), "-").concat(String(d.getDate()).padStart(2, "0"));
                return (<react_1.SelectItem key={val} value={val}>
                            {d.toLocaleDateString(locale, {
                        weekday: "short",
                        month: "short",
                        day: "numeric"
                    })}
                          </react_1.SelectItem>);
            })}
                    </react_1.SelectContent>
                  </react_1.Select>
                </react_1.Td>
                <react_1.Td>
                  <react_1.Input type="datetime-local" value={addClockIn} onChange={function (e) { return setAddClockIn(e.target.value); }} className="h-8 text-xs w-full [&::-webkit-calendar-picker-indicator]:hidden"/>
                </react_1.Td>
                <react_1.Td>
                  <react_1.Input type="datetime-local" value={addClockOut} onChange={function (e) { return setAddClockOut(e.target.value); }} className="h-8 text-xs w-full [&::-webkit-calendar-picker-indicator]:hidden"/>
                </react_1.Td>
                <react_1.Td className="text-muted-foreground text-center">—</react_1.Td>
                <react_1.Td className="text-center">
                  <react_1.HStack className="justify-center">
                    <fetcher.Form method="post">
                      <input type="hidden" name="intent" value="addEntry"/>
                      <input type="hidden" name="clockIn" value={isNaN(new Date(addClockIn).getTime())
                ? ""
                : new Date(addClockIn).toISOString()}/>
                      {addClockOut &&
                !isNaN(new Date(addClockOut).getTime()) && (<input type="hidden" name="clockOut" value={new Date(addClockOut).toISOString()}/>)}
                      <react_1.Button variant="secondary" type="submit" disabled={isNaN(new Date(addClockIn).getTime())}>
                        <macro_1.Trans>Save</macro_1.Trans>
                      </react_1.Button>
                    </fetcher.Form>
                    <react_1.Button variant="ghost" onClick={function () { return setShowAddForm(false); }}>
                      <macro_1.Trans>Cancel</macro_1.Trans>
                    </react_1.Button>
                  </react_1.HStack>
                </react_1.Td>
              </react_1.Tr>)}
            {entries.length === 0 && !showAddForm ? (<react_1.Tr>
                <react_1.Td colSpan={5} className="text-center text-muted-foreground py-8">
                  <macro_1.Trans>No time entries for this week</macro_1.Trans>
                </react_1.Td>
              </react_1.Tr>) : (entries.map(function (entry) {
            return editingId === entry.id ? (<react_1.Tr key={entry.id}>
                    <react_1.Td className="whitespace-nowrap">
                      {formatDay(entry.clockIn, locale)}
                    </react_1.Td>
                    <react_1.Td>
                      <react_1.Input type="datetime-local" value={editClockIn} onChange={function (e) { return setEditClockIn(e.target.value); }} className="h-8 text-xs w-full [&::-webkit-calendar-picker-indicator]:hidden"/>
                    </react_1.Td>
                    <react_1.Td>
                      <react_1.Input type="datetime-local" value={editClockOut} onChange={function (e) { return setEditClockOut(e.target.value); }} className="h-8 text-xs w-full [&::-webkit-calendar-picker-indicator]:hidden"/>
                    </react_1.Td>
                    <react_1.Td className="text-muted-foreground text-center">—</react_1.Td>
                    <react_1.Td className="text-center">
                      <react_1.HStack className="justify-center">
                        <fetcher.Form method="post">
                          <input type="hidden" name="intent" value="updateEntry"/>
                          <input type="hidden" name="entryId" value={entry.id}/>
                          <input type="hidden" name="clockIn" value={isNaN(new Date(editClockIn).getTime())
                    ? ""
                    : new Date(editClockIn).toISOString()}/>
                          {editClockOut &&
                    !isNaN(new Date(editClockOut).getTime()) && (<input type="hidden" name="clockOut" value={new Date(editClockOut).toISOString()}/>)}
                          <input type="hidden" name="note" value={editNote}/>
                          <react_1.Button variant="secondary" type="submit" disabled={isNaN(new Date(editClockIn).getTime())}>
                            <macro_1.Trans>Save</macro_1.Trans>
                          </react_1.Button>
                        </fetcher.Form>
                        <react_1.Button variant="ghost" onClick={function () { return setEditingId(null); }}>
                          <macro_1.Trans>Cancel</macro_1.Trans>
                        </react_1.Button>
                      </react_1.HStack>
                    </react_1.Td>
                  </react_1.Tr>) : (<react_1.Tr key={entry.id}>
                    <react_1.Td className="whitespace-nowrap">
                      {formatDay(entry.clockIn, locale)}
                    </react_1.Td>
                    <react_1.Td>{formatTime(entry.clockIn, locale)}</react_1.Td>
                    <react_1.Td>
                      {entry.clockOut ? (formatTime(entry.clockOut, locale)) : (<react_1.Badge variant="green">
                          <macro_1.Trans>Active</macro_1.Trans>
                        </react_1.Badge>)}
                    </react_1.Td>
                    <react_1.Td className="text-center">
                      {formatDuration(entry.clockIn, entry.clockOut)}
                    </react_1.Td>
                    <react_1.Td className="text-right">
                      <react_1.DropdownMenu>
                        <react_1.DropdownMenuTrigger asChild>
                          <react_1.IconButton aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["More options"], ["More options"])))} variant="ghost" icon={<lu_1.LuEllipsisVertical />}/>
                        </react_1.DropdownMenuTrigger>
                        <react_1.DropdownMenuContent align="end">
                          <react_1.DropdownMenuItem onClick={function () { return startEdit(entry); }}>
                            <react_1.DropdownMenuIcon icon={<lu_1.LuPencil />}/>
                            <macro_1.Trans>Edit</macro_1.Trans>
                          </react_1.DropdownMenuItem>
                          <react_1.DropdownMenuItem onClick={function () {
                    return setDeletingEntry({
                        id: entry.id,
                        clockIn: entry.clockIn
                    });
                }} className="text-destructive">
                            <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                            <macro_1.Trans>Delete</macro_1.Trans>
                          </react_1.DropdownMenuItem>
                        </react_1.DropdownMenuContent>
                      </react_1.DropdownMenu>
                    </react_1.Td>
                  </react_1.Tr>);
        }))}
          </react_1.Tbody>
        </react_1.Table>

        {entries.length > 0 && (<div className="mt-4 text-right text-sm font-medium">
            <macro_1.Trans>Total:</macro_1.Trans> {formatTotalHours(entries)}
          </div>)}
      </react_1.CardContent>
      {deletingEntry && (<Modals_1.ConfirmDelete name={"Timecard (".concat(new Date(deletingEntry.clockIn).toLocaleString(locale), ")")} text={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Are you sure you want to delete this timecard? This cannot be undone."], ["Are you sure you want to delete this timecard? This cannot be undone."])))} onCancel={function () { return setDeletingEntry(null); }} onSubmit={function () {
                var formData = new FormData();
                formData.append("intent", "deleteEntry");
                formData.append("entryId", deletingEntry.id);
                fetcher.submit(formData, { method: "post" });
                setDeletingEntry(null);
            }}/>)}
    </react_1.Card>);
}
var templateObject_1, templateObject_2, templateObject_3;
