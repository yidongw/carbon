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
exports.default = MESTimecardPage;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var people_service_1 = require("~/services/people.service");
var path_1 = require("~/utils/path");
function getWeekBounds(offset) {
    if (offset === void 0) { offset = 0; }
    var now = new Date();
    var dayOfWeek = now.getDay();
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
function formatDuration(clockInStr, clockOutStr) {
    var end = clockOutStr ? new Date(clockOutStr).getTime() : Date.now();
    var ms = end - new Date(clockInStr).getTime();
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
        var _c, client, companyId, userId, url, weekOffset, _d, from, to, _e, entries, openEntry;
        var _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    weekOffset = parseInt((_f = url.searchParams.get("week")) !== null && _f !== void 0 ? _f : "0", 10);
                    _d = getWeekBounds(weekOffset), from = _d.from, to = _d.to;
                    return [4 /*yield*/, Promise.all([
                            client
                                .from("timeCardEntry")
                                .select("*")
                                .eq("employeeId", userId)
                                .eq("companyId", companyId)
                                .gte("clockIn", from)
                                .lte("clockIn", to)
                                .order("clockIn", { ascending: false }),
                            (0, people_service_1.getOpenClockEntry)(client, userId, companyId)
                        ])];
                case 2:
                    _e = _h.sent(), entries = _e[0], openEntry = _e[1];
                    return [2 /*return*/, {
                            entries: (_g = entries.data) !== null && _g !== void 0 ? _g : [],
                            openEntry: openEntry.data,
                            weekOffset: weekOffset,
                            from: from,
                            to: to
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, intent, result, result, entryId, clockInVal, clockOutVal, result, entryId, result;
        var _d, _e, _f, _g;
        var request = _b.request;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _h.sent();
                    intent = formData.get("intent");
                    if (!(intent === "clockIn")) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, people_service_1.clockIn)(client, {
                            employeeId: userId,
                            companyId: companyId,
                            createdBy: userId
                        })];
                case 3:
                    result = _h.sent();
                    return [2 /*return*/, { success: !result.error, error: (_d = result.error) === null || _d === void 0 ? void 0 : _d.message }];
                case 4:
                    if (!(intent === "clockOut")) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, people_service_1.clockOut)(client, {
                            employeeId: userId,
                            companyId: companyId,
                            updatedBy: userId
                        })];
                case 5:
                    result = _h.sent();
                    return [2 /*return*/, { success: !result.error, error: (_e = result.error) === null || _e === void 0 ? void 0 : _e.message }];
                case 6:
                    if (!(intent === "updateEntry")) return [3 /*break*/, 8];
                    entryId = formData.get("entryId");
                    clockInVal = formData.get("clockIn");
                    clockOutVal = formData.get("clockOut");
                    return [4 /*yield*/, (0, people_service_1.updateTimeCardEntry)(client, {
                            entryId: entryId,
                            clockIn: clockInVal,
                            clockOut: clockOutVal || null,
                            updatedBy: userId
                        })];
                case 7:
                    result = _h.sent();
                    return [2 /*return*/, { success: !result.error, error: (_f = result.error) === null || _f === void 0 ? void 0 : _f.message }];
                case 8:
                    if (!(intent === "deleteEntry")) return [3 /*break*/, 10];
                    entryId = formData.get("entryId");
                    return [4 /*yield*/, client
                            .from("timeCardEntry")
                            .delete()
                            .eq("id", entryId)];
                case 9:
                    result = _h.sent();
                    return [2 /*return*/, { success: !result.error, error: (_g = result.error) === null || _g === void 0 ? void 0 : _g.message }];
                case 10: return [2 /*return*/, { success: false, error: "Unknown intent" }];
            }
        });
    });
}
function MESTimecardPage() {
    var _a = (0, react_router_1.useLoaderData)(), entries = _a.entries, openEntry = _a.openEntry, weekOffset = _a.weekOffset, from = _a.from, to = _a.to;
    var fetcher = (0, react_router_1.useFetcher)();
    var _b = (0, react_2.useState)(null), editingId = _b[0], setEditingId = _b[1];
    var _c = (0, react_2.useState)(""), editClockIn = _c[0], setEditClockIn = _c[1];
    var _d = (0, react_2.useState)(""), editClockOut = _d[0], setEditClockOut = _d[1];
    var _e = (0, react_2.useState)(0), setTick = _e[1];
    var t = (0, macro_1.useLingui)().t;
    var locale = (0, i18n_1.useLocale)().locale;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _f = (0, react_2.useState)(null), deletingEntry = _f[0], setDeletingEntry = _f[1];
    var monday = new Date(from);
    var sunday = new Date(to);
    var isCurrentWeek = weekOffset === 0;
    (0, react_2.useEffect)(function () {
        var interval = setInterval(function () { return setTick(function (t) { return t + 1; }); }, 60000);
        return function () { return clearInterval(interval); };
    }, []);
    (0, react_2.useEffect)(function () {
        if (fetcher.data && fetcher.state === "idle") {
            setEditingId(null);
        }
    }, [fetcher.data, fetcher.state]);
    function startEdit(entry) {
        setEditingId(entry.id);
        setEditClockIn(toLocalDatetimeInput(entry.clockIn));
        setEditClockOut(entry.clockOut ? toLocalDatetimeInput(entry.clockOut) : "");
    }
    return (<div className="flex flex-col h-full w-full overflow-y-auto p-4 md:p-6">
      <div className="max-w-[60rem] mx-auto w-full">
        <react_1.Card className="overflow-hidden">
          <react_1.CardHeader>
            <react_1.HStack className="justify-between items-center">
              <react_1.CardTitle>
                <macro_1.Trans>My Hours</macro_1.Trans>
              </react_1.CardTitle>
              <react_1.HStack className="gap-1">
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
                <react_router_1.Link to={"".concat(path_1.path.to.timeCardPage, "?week=").concat(weekOffset - 1)}>
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
                  </span>) : (<react_router_1.Link to={"".concat(path_1.path.to.timeCardPage, "?week=").concat(weekOffset + 1)}>
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
                {entries.length === 0 ? (<react_1.Tr>
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
                              <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} variant="ghost" icon={<lu_1.LuEllipsisVertical />}/>
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
                <macro_1.Trans>Total: {formatTotalHours(entries)}</macro_1.Trans>
              </div>)}
          </react_1.CardContent>
        </react_1.Card>
      </div>
      {deletingEntry && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    setDeletingEntry(null);
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>
                  Delete Timecard (
                  {new Date(deletingEntry.clockIn).toLocaleString(locale)})
                </macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <macro_1.Trans>
                Are you sure you want to delete this timecard? This cannot be
                undone.
              </macro_1.Trans>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={function () { return setDeletingEntry(null); }}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button variant="destructive" onClick={function () {
                var formData = new FormData();
                formData.append("intent", "deleteEntry");
                formData.append("entryId", deletingEntry.id);
                fetcher.submit(formData, { method: "post" });
                setDeletingEntry(null);
            }}>
                <macro_1.Trans>Delete</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
    </div>);
}
var templateObject_1;
