"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnCard = ColumnCard;
exports.BoardContainer = BoardContainer;
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var core_1 = require("@dnd-kit/core");
var sortable_1 = require("@dnd-kit/sortable");
var utilities_1 = require("@dnd-kit/utilities");
var macro_1 = require("@lingui/react/macro");
var class_variance_authority_1 = require("class-variance-authority");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
var ItemCard_1 = require("./ItemCard");
function ColumnCard(_a) {
    var column = _a.column, items = _a.items, isOverlay = _a.isOverlay, progressByItemId = _a.progressByItemId, _b = _a.isDateView, isDateView = _b === void 0 ? false : _b, _c = _a.disableColumnDrag, disableColumnDrag = _c === void 0 ? false : _c, _d = _a.CardComponent, CardComponent = _d === void 0 ? ItemCard_1.ItemCard : _d;
    var params = (0, react_1.useUrlParams)()[0];
    var currentFilters = params.getAll("filter").filter(Boolean);
    var itemsIds = (0, react_2.useMemo)(function () {
        return items.map(function (item) { return item.id; });
    }, [items]);
    var totalDuration = items.reduce(function (acc, item) {
        var _a, _b;
        // @ts-expect-error TS2339 - TODO: fix type
        return acc + Math.max(((_a = item === null || item === void 0 ? void 0 : item.duration) !== null && _a !== void 0 ? _a : 0) - ((_b = item === null || item === void 0 ? void 0 : item.progress) !== null && _b !== void 0 ? _b : 0), 0);
    }, 0);
    var _e = (0, sortable_1.useSortable)({
        id: column.id,
        data: {
            type: "column",
            column: column
        },
        attributes: {
            roleDescription: "Column: ".concat(column.title)
        }
    }), setNodeRef = _e.setNodeRef, attributes = _e.attributes, listeners = _e.listeners, transform = _e.transform, transition = _e.transition, isDragging = _e.isDragging;
    var style = {
        transition: transition,
        transform: utilities_1.CSS.Translate.toString(transform)
    };
    var variants = (0, class_variance_authority_1.cva)("w-[350px] max-w-full flex flex-col flex-shrink-0 snap-center rounded-none bg-card/30 border-0 border-r", {
        variants: {
            dragging: {
                default: "",
                over: "ring-2 opacity-30",
                overlay: "ring-2 ring-primary"
            }
        }
    });
    return (<div ref={setNodeRef} style={style} className={(0, react_1.cn)("".concat(variants({
            dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined
        }), " flex flex-col p-[1px] pt-0"), currentFilters.length > 0
            ? "h-[calc(100dvh-var(--header-height)*2-var(--filters-height))]"
            : "h-[calc(100dvh-var(--header-height)*2)]")}>
      <div className={(0, react_1.cn)("p-4 w-full font-semibold text-left flex flex-row space-between items-center sticky top-0 z-1 border-b", column.isBlocked && column.blockingDispatchId
            ? "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400"
            : "bg-card")}>
        <div className="flex flex-grow items-start space-x-2">
          {!column.isBlocked && (column.active || !isDateView) ? (<react_1.PulsingDot inactive={!column.active} className="mt-2"/>) : null}
          <div className="flex flex-col flex-grow">
            <span className="mr-auto truncate"> {column.title}</span>
            {column.isBlocked && column.blockingDispatchId ? (<react_1.Tooltip>
                <react_1.TooltipTrigger asChild>
                  <react_router_1.Link to={path_1.path.to.maintenanceDispatch(column.blockingDispatchId)} className="inline-flex items-center gap-1 text-xs font-normal">
                    <span>Blocked by {column.blockingDispatchReadableId}</span>
                  </react_router_1.Link>
                </react_1.TooltipTrigger>
                <react_1.TooltipContent>
                  <p>
                    <macro_1.Trans>View maintenance dispatch</macro_1.Trans>
                  </p>
                </react_1.TooltipContent>
              </react_1.Tooltip>) : !isDateView && totalDuration > 0 ? (<span className="text-muted-foreground text-xs">
                {(0, utils_1.formatDurationMilliseconds)(totalDuration)}
              </span>) : (<span className="text-muted-foreground text-xs">
                No scheduled time
              </span>)}
          </div>
        </div>
        {!disableColumnDrag && (<react_1.IconButton aria-label={"Move column: ".concat(column.title)} icon={<lu_1.LuGripVertical />} variant={"ghost"} {...attributes} {...listeners} className="cursor-grab relative"/>)}
      </div>
      <react_1.ScrollArea className="flex-grow">
        <div className="flex flex-col gap-2 p-2">
          <sortable_1.SortableContext items={itemsIds}>
            {items.map(function (item) { return (<CardComponent key={item.id} item={item} progressByItemId={progressByItemId}/>); })}
          </sortable_1.SortableContext>
        </div>
        <react_1.ScrollBar orientation="horizontal"/>
      </react_1.ScrollArea>
    </div>);
}
function BoardContainer(_a) {
    var children = _a.children;
    var dndContext = (0, core_1.useDndContext)();
    var variations = (0, class_variance_authority_1.cva)("relative px-0 flex lg:justify-center", {
        variants: {
            dragging: {
                default: "snap-x snap-mandatory",
                active: "snap-none"
            }
        }
    });
    return (<react_1.ScrollArea className={variations({
            dragging: dndContext.active ? "active" : "default"
        })}>
      <div className="flex gap-0 items-start flex-row justify-start p-0">
        {children}
      </div>
      <react_1.ScrollBar orientation="horizontal" forceMount className="h-5"/>
    </react_1.ScrollArea>);
}
