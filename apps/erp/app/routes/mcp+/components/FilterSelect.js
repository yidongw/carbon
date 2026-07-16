"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterSelect = FilterSelect;
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_dom_1 = require("react-dom");
var lu_1 = require("react-icons/lu");
// The menu renders in a portal so it isn't clipped by the ToolBrowser card's
// `overflow-hidden` (used to round the row corners). Closes on outside-click,
// scroll, or resize.
function FilterSelect(_a) {
    var value = _a.value, options = _a.options, placeholder = _a.placeholder, onChange = _a.onChange;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_2.useState)(null), rect = _c[0], setRect = _c[1];
    var triggerRef = (0, react_2.useRef)(null);
    var menuRef = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        if (!open)
            return;
        var onDoc = function (e) {
            var _a, _b;
            var t = e.target;
            if (((_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.contains(t)) || ((_b = menuRef.current) === null || _b === void 0 ? void 0 : _b.contains(t)))
                return;
            setOpen(false);
        };
        var dismiss = function () { return setOpen(false); };
        document.addEventListener("mousedown", onDoc);
        window.addEventListener("scroll", dismiss, true);
        window.addEventListener("resize", dismiss);
        return function () {
            document.removeEventListener("mousedown", onDoc);
            window.removeEventListener("scroll", dismiss, true);
            window.removeEventListener("resize", dismiss);
        };
    }, [open]);
    var toggle = function () {
        var _a, _b;
        if (!open)
            setRect((_b = (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) !== null && _b !== void 0 ? _b : null);
        setOpen(function (o) { return !o; });
    };
    var select = function (v) {
        onChange(v);
        setOpen(false);
    };
    var current = options.find(function (o) { return o.value === value; });
    var optionClass = function (selected) {
        return (0, react_1.cn)("block w-full text-left px-[10px] py-[7px] border-none bg-transparent rounded-md text-[0.8rem] text-foreground cursor-pointer font-[inherit] whitespace-nowrap transition-[background,color] duration-[120ms] hover:bg-muted", selected && "text-[var(--acc)] bg-[var(--acc-tint-strong)] font-semibold");
    };
    return (<>
      <button ref={triggerRef} type="button" className={(0, react_1.cn)("inline-flex items-center gap-2 h-[38px] px-[11px] border bg-card rounded-lg text-[0.8rem] font-semibold text-foreground cursor-pointer whitespace-nowrap transition-[border-color,box-shadow] duration-150", open
            ? "border-[var(--acc)] shadow-[0_0_0_3px_var(--acc-ring)]"
            : "border-border hover:border-muted-foreground")} aria-haspopup="listbox" aria-expanded={open} onClick={toggle}>
        <span className={(0, react_1.cn)(!current && "text-muted-foreground font-medium")}>
          {current ? current.label : placeholder}
        </span>
        <lu_1.LuChevronDown size={14} className={(0, react_1.cn)("text-muted-foreground shrink-0 transition-transform duration-200", open && "rotate-180")}/>
      </button>
      {open &&
            rect &&
            (0, react_dom_1.createPortal)(<div ref={menuRef} role="listbox" style={{
                    position: "fixed",
                    top: rect.bottom + 6,
                    left: rect.left,
                    minWidth: rect.width
                }} className="max-h-[280px] overflow-auto bg-card border border-border rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_14px_30px_-12px_rgba(0,0,0,0.22)] p-[5px] z-[1000] flex flex-col gap-px">
            <button type="button" role="option" aria-selected={!value} className={optionClass(!value)} onClick={function () { return select(""); }}>
              {placeholder}
            </button>
            {options.map(function (o) { return (<button type="button" key={o.value} role="option" aria-selected={o.value === value} className={optionClass(o.value === value)} onClick={function () { return select(o.value); }}>
                {o.label}
              </button>); })}
          </div>, document.body)}
    </>);
}
