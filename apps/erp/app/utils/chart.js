"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupDataByDay = groupDataByDay;
exports.groupDataByMonth = groupDataByMonth;
function groupDataByDay(data, args) {
    var start = args.start, end = args.end, groupBy = args.groupBy;
    var result = {};
    var d = new Date(start);
    var e = new Date(end);
    if (d > e)
        return {};
    while (d <= e) {
        var date = d.toISOString().split("T")[0];
        result[date] = [];
        d.setDate(d.getDate() + 1);
    }
    data.forEach(function (d) {
        var _a;
        var date = new Date(d[groupBy].toString()).toISOString().split("T")[0];
        (_a = result[date]) === null || _a === void 0 ? void 0 : _a.push(d);
    });
    return result;
}
function groupDataByMonth(data, args) {
    var start = args.start, end = args.end, groupBy = args.groupBy;
    var result = {};
    var d = new Date(start);
    var e = new Date(end);
    if (d > e)
        return {};
    while (d <= e) {
        var monthKey = "".concat(d.getFullYear(), "-").concat(String(d.getMonth() + 1).padStart(2, "0"));
        result[monthKey] = [];
        d.setMonth(d.getMonth() + 1);
    }
    data.forEach(function (item) {
        var date = new Date(item[groupBy].toString());
        var monthKey = "".concat(date.getFullYear(), "-").concat(String(date.getMonth() + 1).padStart(2, "0"));
        if (result[monthKey]) {
            result[monthKey].push(item);
        }
    });
    return result;
}
