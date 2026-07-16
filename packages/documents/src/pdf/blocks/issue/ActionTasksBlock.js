"use strict";
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
exports.ActionTasksBlock = ActionTasksBlock;
var renderer_1 = require("@react-pdf/renderer");
var components_1 = require("../../components");
var tw_1 = require("../tw");
/** Repeating action-task blocks, each with optional nested inspections. */
function ActionTasksBlock(_a) {
    var data = _a.data;
    var tw = (0, tw_1.useTw)();
    var actionTasks = data.actionTasks, requiredActions = data.requiredActions, assignees = data.assignees, jobOperationStepRecords = data.jobOperationStepRecords, operationToJobId = data.operationToJobId;
    var sortedActionTasks = __spreadArray([], actionTasks, true).sort(function (a, b) { var _a, _b; return ((_a = a.sortOrder) !== null && _a !== void 0 ? _a : 0) - ((_b = b.sortOrder) !== null && _b !== void 0 ? _b : 0); });
    if (sortedActionTasks.length === 0)
        return null;
    return (<renderer_1.View style={tw("mb-4")}>
      {sortedActionTasks.map(function (task) {
            var _a, _b, _c, _d, _e;
            return (<renderer_1.View key={task.id} style={tw("border border-gray-200 mb-4")} wrap={false}>
          <renderer_1.View style={tw("p-3")}>
            <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
              {((_a = task.supplier) === null || _a === void 0 ? void 0 : _a.name) ? "Supplier " : ""}
              {(_b = requiredActions.find(function (action) { return action.id === task.actionTypeId; })) === null || _b === void 0 ? void 0 : _b.name}
            </renderer_1.Text>
            <renderer_1.View style={tw("flex flex-col gap-1 text-[10px]")}>
              {((_c = task.supplier) === null || _c === void 0 ? void 0 : _c.name) && (<renderer_1.View style={tw("flex flex-row gap-2")}>
                  <renderer_1.Text style={tw("font-bold text-gray-600")}>Supplier:</renderer_1.Text>
                  <renderer_1.Text style={tw("text-gray-800")}>{task.supplier.name}</renderer_1.Text>
                </renderer_1.View>)}
              {task.assignee && assignees[task.assignee] && (<renderer_1.View style={tw("flex flex-row gap-2")}>
                  <renderer_1.Text style={tw("font-bold text-gray-600")}>
                    {((_d = task.supplier) === null || _d === void 0 ? void 0 : _d.name) ? "Verified by" : "Completed by"}:
                  </renderer_1.Text>
                  <renderer_1.Text style={tw("text-gray-800")}>
                    {assignees[task.assignee]}
                  </renderer_1.Text>
                </renderer_1.View>)}
              {task.completedDate && (<renderer_1.View style={tw("flex flex-row gap-2")}>
                  <renderer_1.Text style={tw("font-bold text-gray-600")}>
                    Completed on:
                  </renderer_1.Text>
                  <renderer_1.Text style={tw("text-gray-800")}>{task.completedDate}</renderer_1.Text>
                </renderer_1.View>)}
            </renderer_1.View>
            {Object.keys((_e = task.notes) !== null && _e !== void 0 ? _e : {}).length > 0 && (<renderer_1.View style={tw("mt-2 pt-2 border-t border-gray-200")}>
                <components_1.Note content={task.notes}/>
              </renderer_1.View>)}
            {/* Job Operation Step Records */}
            {jobOperationStepRecords
                    .filter(function (step) { return step.nonConformanceActionId === task.id; })
                    .some(function (step) {
                    var _a;
                    return (_a = step.jobOperationStepRecord) === null || _a === void 0 ? void 0 : _a.some(function (record) { return record.booleanValue !== null; });
                }) && (<renderer_1.View style={tw("mt-2 pt-2 border-t border-gray-200")}>
                <renderer_1.Text style={tw("text-[9px] font-bold text-gray-600 mb-1 uppercase")}>
                  Inspections
                </renderer_1.Text>
                {jobOperationStepRecords
                        .filter(function (step) { return step.nonConformanceActionId === task.id; })
                        .map(function (step) {
                        var _a;
                        return (_a = step.jobOperationStepRecord) === null || _a === void 0 ? void 0 : _a.filter(function (record) { return record.booleanValue !== null; }).map(function (record) { return (<renderer_1.View key={record.id} style={tw("flex flex-row gap-2 text-[10px] py-0.5")}>
                          <renderer_1.View style={{
                                width: 10,
                                height: 10,
                                border: "1px solid #9ca3af",
                                marginTop: 2,
                                position: "relative"
                            }}>
                            <renderer_1.Text style={{
                                position: "absolute",
                                fontSize: 10,
                                fontWeight: "bold",
                                lineHeight: 1,
                                textAlign: "center",
                                top: -3,
                                left: -1.5
                            }}>
                              {record.booleanValue ? "✓" : ""}
                            </renderer_1.Text>
                          </renderer_1.View>
                          <renderer_1.View style={tw("flex flex-col")}>
                            <renderer_1.Text style={tw("text-gray-800")}>{step.name}</renderer_1.Text>
                            <renderer_1.Text style={tw("text-[8px] text-gray-400 mt-0.5")}>
                              {operationToJobId[step.operationId] && (<>Job {operationToJobId[step.operationId]} • </>)}
                              {assignees[record.createdBy] || "Unknown"} •{" "}
                              {new Date(record.createdAt)
                                .toISOString()
                                .split("T")[0]}
                            </renderer_1.Text>
                          </renderer_1.View>
                        </renderer_1.View>); });
                    })}
              </renderer_1.View>)}
          </renderer_1.View>
        </renderer_1.View>);
        })}
    </renderer_1.View>);
}
