"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TraceabilityTable = TraceabilityTable;
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var metadata_1 = require("./metadata");
var TrackedEntityStatus_1 = require("./TrackedEntityStatus");
var utils_1 = require("./utils");
function TraceabilityTable(_a) {
    var payload = _a.payload, rootId = _a.rootId, selectedId = _a.selectedId, onSelect = _a.onSelect;
    var _b = (0, react_2.useState)(new Set()), collapsed = _b[0], setCollapsed = _b[1];
    var rowRefs = (0, react_2.useRef)(new Map());
    var _c = (0, react_2.useMemo)(function () {
        var entityById = new Map();
        var activityById = new Map();
        for (var _i = 0, _a = payload.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            entityById.set(e.id, e);
        }
        for (var _b = 0, _c = payload.activities; _b < _c.length; _b++) {
            var a = _c[_b];
            activityById.set(a.id, a);
        }
        var downstream = new Map();
        var push = function (m, k, v) {
            if (!m.has(k))
                m.set(k, []);
            m.get(k).push(v);
        };
        for (var _d = 0, _e = payload.inputs; _d < _e.length; _d++) {
            var i = _e[_d];
            push(downstream, i.trackedEntityId, {
                targetId: i.trackedActivityId,
                quantity: i.quantity,
                kind: "input"
            });
            push(downstream, i.trackedActivityId, {
                targetId: i.trackedEntityId,
                quantity: i.quantity,
                kind: "input"
            });
        }
        for (var _f = 0, _g = payload.outputs; _f < _g.length; _f++) {
            var o = _g[_f];
            push(downstream, o.trackedActivityId, {
                targetId: o.trackedEntityId,
                quantity: o.quantity,
                kind: "output"
            });
            push(downstream, o.trackedEntityId, {
                targetId: o.trackedActivityId,
                quantity: o.quantity,
                kind: "output"
            });
        }
        return { entityById: entityById, activityById: activityById, downstream: downstream };
    }, [payload]), entityById = _c.entityById, activityById = _c.activityById, downstream = _c.downstream;
    var rows = (0, react_2.useMemo)(function () {
        var out = [];
        var visited = new Set();
        function kindOf(id) {
            return entityById.has(id) ? "entity" : "activity";
        }
        function walk(id, depth, edgeQuantity, edgeKind, isLast) {
            var _a;
            if (isLast === void 0) { isLast = true; }
            if (visited.has(id)) {
                out.push({
                    kind: kindOf(id),
                    id: id,
                    depth: depth,
                    edgeQuantity: edgeQuantity,
                    edgeKind: edgeKind,
                    isReference: true,
                    isLast: isLast
                });
                return;
            }
            visited.add(id);
            out.push({
                kind: kindOf(id),
                id: id,
                depth: depth,
                edgeQuantity: edgeQuantity,
                edgeKind: edgeKind,
                isLast: isLast
            });
            if (collapsed.has(id))
                return;
            var children = (_a = downstream.get(id)) !== null && _a !== void 0 ? _a : [];
            children.forEach(function (c, idx) {
                walk(c.targetId, depth + 1, c.quantity, c.kind, idx === children.length - 1);
            });
        }
        walk(rootId, 0);
        return out;
    }, [rootId, downstream, entityById, collapsed]);
    var toggle = function (id) {
        return setCollapsed(function (prev) {
            var next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
    };
    // When a selection arrives (e.g. from search), expand all ancestors and
    // scroll the row into view.
    (0, react_2.useEffect)(function () {
        if (!selectedId || selectedId === rootId)
            return;
        var path = [];
        var visited = new Set();
        function find(id) {
            var _a;
            if (visited.has(id))
                return false;
            visited.add(id);
            if (id === selectedId)
                return true;
            var children = (_a = downstream.get(id)) !== null && _a !== void 0 ? _a : [];
            for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                var c = children_1[_i];
                if (find(c.targetId)) {
                    path.push(id);
                    return true;
                }
            }
            return false;
        }
        find(rootId);
        if (path.length > 0) {
            setCollapsed(function (prev) {
                var changed = false;
                var next = new Set(prev);
                for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                    var ancestor = path_1[_i];
                    if (next.has(ancestor)) {
                        next.delete(ancestor);
                        changed = true;
                    }
                }
                return changed ? next : prev;
            });
        }
        // Scroll row into view after expansion settles
        requestAnimationFrame(function () {
            var el = rowRefs.current.get(selectedId);
            el === null || el === void 0 ? void 0 : el.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }, [selectedId, rootId, downstream]);
    return (<div className="w-full h-full overflow-auto py-2">
      <div className="bg-card border-y border-border/40">
        {rows.map(function (row, i) {
            var _a, _b;
            return (<TreeRow key={"".concat(row.id, ":").concat(i)} row={row} entity={entityById.get(row.id)} activity={activityById.get(row.id)} isSelected={row.id === selectedId} isCollapsed={collapsed.has(row.id)} hasChildren={!row.isReference && ((_b = (_a = downstream.get(row.id)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0} onToggle={function () { return toggle(row.id); }} onSelect={function () { return onSelect === null || onSelect === void 0 ? void 0 : onSelect(row.id); }} registerRef={function (el) {
                    if (el)
                        rowRefs.current.set(row.id, el);
                    else
                        rowRefs.current.delete(row.id);
                }}/>);
        })}
      </div>
    </div>);
}
function TreeRow(_a) {
    var _b;
    var row = _a.row, entity = _a.entity, activity = _a.activity, isSelected = _a.isSelected, isCollapsed = _a.isCollapsed, hasChildren = _a.hasChildren, onToggle = _a.onToggle, onSelect = _a.onSelect, registerRef = _a.registerRef;
    var t = (0, macro_1.useLingui)().t;
    if (row.kind === "entity") {
        if (!entity)
            return null;
        var headline = (0, utils_1.entityHeadline)(entity, 12);
        var href_1 = (0, utils_1.sourceLinkHref)(entity.sourceDocument, entity.sourceDocumentId);
        return (<button ref={registerRef} type="button" onClick={onSelect} className={(0, react_1.cn)("group w-full flex items-center gap-2 px-4 text-left h-12", "border-b border-border/40 last:border-b-0 transition-colors", isSelected ? "bg-accent/40" : "hover:bg-accent/20", row.isReference && "text-muted-foreground italic")}>
        <Indent depth={row.depth}/>
        <ToggleOrLeaf hasChildren={hasChildren} isCollapsed={isCollapsed} isReference={!!row.isReference} onToggle={onToggle}/>
        <react_1.HStack spacing={2} className="flex-1 min-w-0 items-center">
          <span className={(0, react_1.cn)("text-sm truncate", isSelected && "font-medium", row.isReference && "underline decoration-dotted")}>
            {headline}
          </span>
          {row.isReference && <RefBadge />}
          {!row.isReference && <TrackedEntityStatus_1.default status={entity.status}/>}
        </react_1.HStack>
        {!row.isReference && (<span className="text-xs tabular-nums text-muted-foreground shrink-0 w-12 text-right">
            {entity.quantity}
          </span>)}
        {!row.isReference && entity.sourceDocument && (<span className="text-[11px] text-muted-foreground truncate max-w-[140px] hidden md:inline">
            {entity.sourceDocument}
          </span>)}
        {href_1 && (<react_router_1.Link to={href_1} onClick={function (e) { return e.stopPropagation(); }} className="text-muted-foreground hover:text-foreground shrink-0" aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Open source document"], ["Open source document"])))}>
            <lu_1.LuExternalLink className="w-3.5 h-3.5"/>
          </react_router_1.Link>)}
      </button>);
    }
    if (!activity)
        return null;
    var kind = (0, metadata_1.activityKindFor)(activity.type);
    var meta = metadata_1.ACTIVITY_KIND_META[kind];
    var Icon = meta.icon;
    var label = (_b = activity.type) !== null && _b !== void 0 ? _b : meta.label;
    var href = (0, utils_1.sourceLinkHref)(activity.sourceDocument, activity.sourceDocumentId);
    return (<button ref={registerRef} type="button" onClick={onSelect} className={(0, react_1.cn)("group w-full flex items-center gap-2 px-4 text-left h-12", "border-b border-border/40 last:border-b-0 transition-colors", isSelected ? "bg-accent/40" : "hover:bg-accent/20", row.isReference && "text-muted-foreground italic")}>
      <Indent depth={row.depth}/>
      <ToggleOrLeaf hasChildren={hasChildren} isCollapsed={isCollapsed} isReference={!!row.isReference} onToggle={onToggle}/>
      <react_1.HStack spacing={2} className="flex-1 min-w-0 items-center">
        <span className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0" style={{ background: meta.color }}>
          <Icon className="w-2.5 h-2.5 text-white"/>
        </span>
        <span className={(0, react_1.cn)("text-sm truncate", isSelected && "font-medium", row.isReference && "underline decoration-dotted")}>
          {label}
        </span>
        {row.isReference && <RefBadge />}
      </react_1.HStack>
      {!row.isReference && row.edgeQuantity != null && (<span className="text-xs tabular-nums text-muted-foreground shrink-0 w-12 text-right">
          {row.edgeQuantity}
        </span>)}
      {!row.isReference && activity.sourceDocument && (<span className="text-[11px] text-muted-foreground truncate max-w-[140px] hidden md:inline">
          {activity.sourceDocument}
        </span>)}
      {href && (<react_router_1.Link to={href} onClick={function (e) { return e.stopPropagation(); }} className="text-muted-foreground hover:text-foreground shrink-0" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Open source document"], ["Open source document"])))}>
          <lu_1.LuExternalLink className="w-3.5 h-3.5"/>
        </react_router_1.Link>)}
    </button>);
}
function Indent(_a) {
    var depth = _a.depth;
    if (depth === 0)
        return null;
    return (<div className="flex shrink-0">
      {Array.from({ length: depth }).map(function (_, i) { return (<div key={i} className="w-4 h-12 border-l border-border/50 ml-px"/>); })}
    </div>);
}
function ToggleOrLeaf(_a) {
    var hasChildren = _a.hasChildren, isCollapsed = _a.isCollapsed, isReference = _a.isReference, onToggle = _a.onToggle;
    if (hasChildren) {
        return (<button type="button" onClick={function (e) {
                e.stopPropagation();
                onToggle();
            }} className="text-muted-foreground hover:text-foreground shrink-0" aria-label={isCollapsed ? "Expand" : "Collapse"}>
        {isCollapsed ? (<lu_1.LuChevronRight className="size-4.5"/>) : (<lu_1.LuChevronDown className="size-4.5"/>)}
      </button>);
    }
    return <div className="w-3.5 shrink-0"/>;
}
function RefBadge() {
    return (<react_1.Badge variant="outline" className="text-[9px] px-1 py-0 uppercase tracking-wide">
      ref
    </react_1.Badge>);
}
var templateObject_1, templateObject_2;
