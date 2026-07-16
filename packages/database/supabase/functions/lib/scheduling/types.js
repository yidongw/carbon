"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingStrategy = void 0;
var SchedulingStrategy;
(function (SchedulingStrategy) {
    SchedulingStrategy[SchedulingStrategy["PriorityLeastTime"] = 0] = "PriorityLeastTime";
    SchedulingStrategy[SchedulingStrategy["LeastTime"] = 1] = "LeastTime";
    SchedulingStrategy[SchedulingStrategy["Random"] = 2] = "Random";
})(SchedulingStrategy || (exports.SchedulingStrategy = SchedulingStrategy = {}));
