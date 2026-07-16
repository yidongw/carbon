"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionList = void 0;
var react_virtual_1 = require("@tanstack/react-virtual");
var react_1 = require("react");
var ITEM_HEIGHT = 44;
var MAX_VISIBLE_ITEMS = 6;
exports.MentionList = (0, react_1.forwardRef)(function (props, ref) {
    var _a = (0, react_1.useState)(0), selectedIndex = _a[0], setSelectedIndex = _a[1];
    var parentRef = (0, react_1.useRef)(null);
    var virtualizer = (0, react_virtual_1.useVirtualizer)({
        count: props.items.length,
        getScrollElement: function () { return parentRef.current; },
        estimateSize: function () { return ITEM_HEIGHT; },
        overscan: 5
    });
    var selectItem = function (index) {
        var item = props.items[index];
        if (item) {
            props.command(item);
        }
    };
    var upHandler = function () {
        var newIndex = (selectedIndex + props.items.length - 1) % props.items.length;
        setSelectedIndex(newIndex);
        virtualizer.scrollToIndex(newIndex, { align: "auto" });
    };
    var downHandler = function () {
        var newIndex = (selectedIndex + 1) % props.items.length;
        setSelectedIndex(newIndex);
        virtualizer.scrollToIndex(newIndex, { align: "auto" });
    };
    var enterHandler = function () {
        selectItem(selectedIndex);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_1.useEffect)(function () { return setSelectedIndex(0); }, [props.items]);
    (0, react_1.useImperativeHandle)(ref, function () { return ({
        onKeyDown: function (_a) {
            var event = _a.event;
            if (event.key === "ArrowUp") {
                upHandler();
                return true;
            }
            if (event.key === "ArrowDown") {
                downHandler();
                return true;
            }
            if (event.key === "Enter") {
                enterHandler();
                return true;
            }
            return false;
        }
    }); });
    if (props.items.length === 0) {
        return (<div className="bg-popover border rounded-md shadow-md p-2 text-muted-foreground text-sm">
          No results
        </div>);
    }
    var virtualItems = virtualizer.getVirtualItems();
    return (<div className="bg-popover text-popover-foreground border rounded-md shadow-md overflow-hidden min-w-[240px]">
        <div ref={parentRef} className="overflow-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent" style={{
            height: "".concat(Math.min(props.items.length, MAX_VISIBLE_ITEMS) * ITEM_HEIGHT, "px")
        }}>
          <div style={{
            height: "".concat(virtualizer.getTotalSize(), "px"),
            width: "100%",
            position: "relative"
        }}>
            {virtualItems.map(function (virtualRow) {
            var item = props.items[virtualRow.index];
            if (!item)
                return null;
            var isSelected = virtualRow.index === selectedIndex;
            return (<button type="button" className={"absolute top-0 left-0 w-full text-left px-3 text-sm ".concat(isSelected
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50")} style={{
                    height: "".concat(ITEM_HEIGHT, "px"),
                    transform: "translateY(".concat(virtualRow.start, "px)")
                }} key={item.id} onClick={function () { return selectItem(virtualRow.index); }}>
                  {item.helper ? (<div className="flex flex-col justify-center gap-0.5 py-1 h-full">
                      <p className="line-clamp-1 leading-tight">{item.label}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-tight">
                        {item.helper}
                      </p>
                    </div>) : (<div className="flex items-center h-full">
                      <span className="line-clamp-1">{item.label}</span>
                    </div>)}
                </button>);
        })}
          </div>
        </div>
      </div>);
});
exports.MentionList.displayName = "MentionList";
