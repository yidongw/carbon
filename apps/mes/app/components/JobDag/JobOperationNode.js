"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobOperationNode = void 0;
var react_1 = require("@carbon/react");
var react_2 = require("@xyflow/react");
var react_3 = require("react");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var STATUS_COLORS = {
    Done: { border: "border-green-500", bar: "bg-green-500" },
    "In Progress": { border: "border-blue-500", bar: "bg-blue-500" },
    Ready: { border: "border-teal-500", bar: "bg-teal-500" },
    Waiting: { border: "border-gray-400", bar: "bg-gray-400" },
    Todo: { border: "border-gray-300", bar: "bg-gray-300" },
    Paused: { border: "border-amber-500", bar: "bg-amber-500" },
    Canceled: { border: "border-red-500", bar: "bg-red-500" }
};
function JobOperationNodeImpl(_a) {
    var _b;
    var data = _a.data;
    var d = data;
    var colors = (_b = STATUS_COLORS[d.status]) !== null && _b !== void 0 ? _b : STATUS_COLORS.Todo;
    var isHorizontal = d.direction === "LR";
    var navigate = (0, react_router_1.useNavigate)();
    return (<>
      <react_2.Handle type="target" position={isHorizontal ? react_2.Position.Left : react_2.Position.Top} className="invisible"/>
      <div role="button" tabIndex={0} onClick={function () { return navigate(path_1.path.to.operation(d.id)); }} onKeyDown={function (e) {
            if (e.key === "Enter")
                navigate(path_1.path.to.operation(d.id));
        }} className={(0, react_1.cn)("w-[200px] rounded-lg border-2 bg-card px-3 py-2 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors", colors.border)}>
        {d.itemId && (<div className="truncate text-[11px] text-muted-foreground leading-tight">
            {d.itemId}
          </div>)}
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium leading-tight">
            {d.description}
          </span>
          {d.isRework && (<span className="shrink-0 text-[10px] font-semibold text-red-600 bg-red-100 rounded px-1">
              Rework
            </span>)}
        </div>
        <react_1.BarProgress segments={[
            { value: d.quantityComplete, className: "bg-emerald-500" },
            { value: d.quantityReworked, className: "bg-yellow-500" },
            { value: d.quantityScrapped, className: "bg-red-500" }
        ]} progress={d.quantityComplete} max={d.targetQuantity || 1} value={"".concat(d.quantityComplete, "/").concat(d.targetQuantity)} className="mt-1"/>
        {d.quantityScrapped > 0 && (<div className="mt-0.5 text-right text-[11px] text-red-500">
            {d.quantityScrapped} scrapped
          </div>)}
      </div>
      <react_2.Handle type="source" position={isHorizontal ? react_2.Position.Right : react_2.Position.Bottom} className="invisible"/>
    </>);
}
exports.JobOperationNode = (0, react_3.memo)(JobOperationNodeImpl);
