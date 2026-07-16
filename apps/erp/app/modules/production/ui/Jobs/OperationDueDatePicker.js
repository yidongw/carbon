"use client";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationDueDatePicker = OperationDueDatePicker;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
function OperationDueDatePicker(_a) {
    var operationId = _a.operationId, dueDate = _a.dueDate, manuallyScheduled = _a.manuallyScheduled, onChange = _a.onChange;
    var submit = (0, react_router_1.useSubmit)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    return (<react_1.DatePicker value={dueDate ? (0, date_1.parseDate)(dueDate) : null} isPreviewInline inline={dueDate ? (<span className="flex flex-grow line-clamp-1 items-center gap-1 text-xs text-muted-foreground">
            {manuallyScheduled && <lu_1.LuPin className="h-3 w-3 shrink-0"/>}
            {formatDate(dueDate)}
          </span>) : (true)} onChange={function (value) {
            var _a;
            var dateStr = (_a = value === null || value === void 0 ? void 0 : value.toString()) !== null && _a !== void 0 ? _a : null;
            onChange === null || onChange === void 0 ? void 0 : onChange(dateStr);
            submit({ id: operationId, dueDate: dateStr !== null && dateStr !== void 0 ? dateStr : "" }, {
                method: "post",
                action: path_1.path.to.jobOperationDueDate,
                navigate: false,
                fetcherKey: "jobOperationDueDate:".concat(operationId)
            });
        }}/>);
}
