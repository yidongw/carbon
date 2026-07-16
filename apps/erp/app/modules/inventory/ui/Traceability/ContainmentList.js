"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainmentList = ContainmentList;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function ContainmentList(_a) {
    var items = _a.items;
    if (items.length === 0)
        return null;
    return (<ul className="divide-y divide-border/30">
      {items.map(function (item) {
            var _a;
            return (<li key={item.id}>
          <react_router_1.Link to={path_1.path.to.issueDetails(item.id)} className="group flex items-center justify-between gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors" onClick={function (e) { return e.stopPropagation(); }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className={(0, react_1.cn)("size-2 rounded-full shrink-0", item.containmentStatus === "Uncontained"
                    ? "bg-red-500"
                    : "bg-amber-500")}/>
              <span className="text-sm font-medium truncate">
                {(_a = item.readableId) !== null && _a !== void 0 ? _a : item.id.slice(0, 8)}
              </span>
              <span className={(0, react_1.cn)("text-[10px] uppercase tracking-wide font-medium shrink-0", item.containmentStatus === "Uncontained"
                    ? "text-red-500"
                    : "text-amber-500")}>
                {item.containmentStatus}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {item.priority && (<span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {item.priority}
                </span>)}
              <lu_1.LuExternalLink className="size-3 text-muted-foreground/60 group-hover:text-foreground transition-colors"/>
            </div>
          </react_router_1.Link>
        </li>);
        })}
    </ul>);
}
