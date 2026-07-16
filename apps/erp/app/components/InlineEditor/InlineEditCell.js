"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineEditCell = InlineEditCell;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var useEntityUpdate_1 = require("./useEntityUpdate");
var useSynced_1 = require("./useSynced");
function toCalendarDate(value) {
    if (!value)
        return undefined;
    try {
        return (0, date_1.parseDate)(value.slice(0, 10));
    }
    catch (_a) {
        return undefined;
    }
}
function toCalendarDateTimeValue(value) {
    if (!value)
        return undefined;
    try {
        return (0, date_1.toCalendarDateTime)((0, date_1.parseAbsolute)(value, (0, date_1.getLocalTimeZone)()));
    }
    catch (_a) {
        return undefined;
    }
}
function SelectCell(_a) {
    var _b;
    var row = _a.row, config = _a.config;
    var update = (0, useEntityUpdate_1.useEntityUpdate)(config.update);
    var _c = (0, useSynced_1.useSynced)((_b = config.value(row)) !== null && _b !== void 0 ? _b : undefined), value = _c[0], setValue = _c[1];
    var options = typeof config.options === "function" ? config.options(row) : config.options;
    var commit = function (next) {
        var _a, _b;
        setValue(next || undefined);
        update(((_b = (_a = config.idAccessor) === null || _a === void 0 ? void 0 : _a.call(config, row)) !== null && _b !== void 0 ? _b : row.id), config.field, next || null);
    };
    var renderInline = function (v, opts) {
        var _a, _b, _c;
        if (config.renderInline)
            return config.renderInline(v, opts, row);
        // Resolve the option's label; never fall back to the raw id value (that shows
        // an ugly "LOC_..." / "SMETH_..." string while options are still loading).
        var label = (_b = (_a = opts.find(function (o) { return o.value === v; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : (_c = config.fallbackLabel) === null || _c === void 0 ? void 0 : _c.call(config, row);
        if (label == null)
            return <span aria-hidden/>;
        return <react_1.Badge variant="secondary">{label}</react_1.Badge>;
    };
    if (config.kind === "picker") {
        return (<react_1.Combobox value={value} isClearable={config.clearable} inline={renderInline} options={options} onChange={commit}/>);
    }
    return (<form_1.SelectBase value={value} isClearable={config.clearable} inline={renderInline} options={options} onChange={commit}/>);
}
function BooleanCell(_a) {
    var _b, _c;
    var row = _a.row, config = _a.config;
    var update = (0, useEntityUpdate_1.useEntityUpdate)(config.update);
    var _d = (0, useSynced_1.useSynced)((_b = config.value(row)) !== null && _b !== void 0 ? _b : false), checked = _d[0], setChecked = _d[1];
    var serialize = (_c = config.serialize) !== null && _c !== void 0 ? _c : (function (c) { return (c ? "on" : "off"); });
    return (<react_1.Switch variant="small" checked={checked} onCheckedChange={function (next) {
            var _a, _b;
            setChecked(next);
            update(((_b = (_a = config.idAccessor) === null || _a === void 0 ? void 0 : _a.call(config, row)) !== null && _b !== void 0 ? _b : row.id), config.field, serialize(next));
        }}/>);
}
function TextCell(_a) {
    var _b;
    var row = _a.row, config = _a.config;
    var update = (0, useEntityUpdate_1.useEntityUpdate)(config.update);
    var server = (_b = config.value(row)) !== null && _b !== void 0 ? _b : "";
    var _c = (0, react_2.useState)(false), editing = _c[0], setEditing = _c[1];
    var commit = function (next) {
        var _a, _b;
        setEditing(false);
        if (next !== server)
            update(((_b = (_a = config.idAccessor) === null || _a === void 0 ? void 0 : _a.call(config, row)) !== null && _b !== void 0 ? _b : row.id), config.field, next || null);
    };
    if (editing) {
        return (<react_1.Input autoFocus defaultValue={server} placeholder={config.placeholder} size="sm" className="border-0 bg-transparent rounded-none w-full" onBlur={function (e) { return commit(e.currentTarget.value); }} onKeyDown={function (e) {
                if (e.key === "Enter")
                    commit(e.currentTarget.value);
                if (e.key === "Escape")
                    setEditing(false);
            }}/>);
    }
    // Display state: show the value, or a "+" affordance when empty — never blank.
    return (<button type="button" className="flex w-full items-center text-left text-sm hover:text-foreground" onClick={function () { return setEditing(true); }}>
      {server ? (<span className="truncate">{server}</span>) : (<span className="text-muted-foreground/60">
          <lu_1.LuPlus className="size-4"/>
        </span>)}
    </button>);
}
function DateCell(_a) {
    var _b, _c, _d, _e;
    var row = _a.row, config = _a.config;
    var withTime = (_b = config.withTime) !== null && _b !== void 0 ? _b : false;
    var update = (0, useEntityUpdate_1.useEntityUpdate)(config.update);
    var _f = (0, useSynced_1.useSynced)((_c = config.value(row)) !== null && _c !== void 0 ? _c : undefined), value = _f[0], setValue = _f[1];
    var _g = (0, react_2.useState)(false), open = _g[0], setOpen = _g[1];
    // Draft the selection so the change only lands on Save (mirrors the pickups
    // "Submitted" editor); Cancel / click-away discard, Clear resets to empty.
    var _h = (0, react_2.useState)(null), draft = _h[0], setDraft = _h[1];
    var preview = value ? ((_e = (_d = config.renderInline) === null || _d === void 0 ? void 0 : _d.call(config, value)) !== null && _e !== void 0 ? _e : value) : "";
    var serialize = function (d) {
        return withTime
            ? d.toDate((0, date_1.getLocalTimeZone)()).toISOString()
            : d.toString();
    };
    var openPicker = function () {
        var _a;
        setDraft((_a = (withTime ? toCalendarDateTimeValue(value) : toCalendarDate(value))) !== null && _a !== void 0 ? _a : null);
        setOpen(true);
    };
    var close = function () {
        setOpen(false);
        setDraft(null);
    };
    var commit = function (next) {
        var _a, _b;
        setValue(next !== null && next !== void 0 ? next : undefined);
        update(((_b = (_a = config.idAccessor) === null || _a === void 0 ? void 0 : _a.call(config, row)) !== null && _b !== void 0 ? _b : row.id), config.field, next);
        close();
    };
    return (<react_1.Popover open={open} onOpenChange={function (next) { return (next ? openPicker() : close()); }} modal={false}>
      <react_1.PopoverTrigger asChild>
        <button type="button" className="flex w-full items-center text-left text-sm hover:text-foreground" data-prevent-row-nav onPointerDown={function (e) { return e.stopPropagation(); }}>
          {preview ? (<span className="truncate">{preview}</span>) : (<span className="text-muted-foreground/60">
              <lu_1.LuPlus className="size-4"/>
            </span>)}
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" side="bottom" sideOffset={6} className="w-auto overflow-hidden p-0" onOpenAutoFocus={function (e) { return e.preventDefault(); }} onPointerDown={function (e) { return e.stopPropagation(); }} onClick={function (e) { return e.stopPropagation(); }}>
        <div className="p-3 pb-2">
          <react_1.Calendar value={draft} onChange={function (date) {
            return setDraft(function (prev) {
                if (!withTime)
                    return date;
                return prev
                    ? prev.set({
                        year: date.year,
                        month: date.month,
                        day: date.day
                    })
                    : (0, date_1.toCalendarDateTime)(date);
            });
        }}/>
          {withTime && (<react_1.TimePicker label="Time" value={draft} onChange={function (time) {
                if (!time)
                    return;
                setDraft(function (prev) {
                    return prev
                        ? prev.set({
                            hour: time.hour,
                            minute: time.minute,
                            second: time.second,
                            millisecond: time.millisecond
                        })
                        : prev;
                });
            }}/>)}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border bg-popover px-3 py-2">
          <react_1.Button type="button" variant="ghost" onClick={function () { return commit(null); }}>
            <macro_1.Trans>Clear</macro_1.Trans>
          </react_1.Button>
          <react_1.HStack spacing={2}>
            <react_1.Button type="button" variant="secondary" onClick={close}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="button" variant="primary" isDisabled={!draft} onClick={function () { return commit(draft ? serialize(draft) : null); }}>
              <macro_1.Trans>Save</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
/**
 * Generic inline-edit table cell. Dispatches by `kind` to the right form-context-free
 * base editor, applies optimistic UI, and submits through the module's update action.
 */
function InlineEditCell(_a) {
    var row = _a.row, config = _a.config;
    switch (config.kind) {
        case "boolean":
            return <BooleanCell row={row} config={config}/>;
        case "text":
            return <TextCell row={row} config={config}/>;
        case "date":
            return <DateCell row={row} config={config}/>;
        default:
            return <SelectCell row={row} config={config}/>;
    }
}
