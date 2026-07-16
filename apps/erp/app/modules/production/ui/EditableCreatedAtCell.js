"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditableCreatedAtCell = EditableCreatedAtCell;
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var productionQuantityDisplay_utils_1 = require("~/modules/production/productionQuantityDisplay.utils");
function toCalendarValue(iso) {
    if (iso) {
        return (0, date_1.toCalendarDateTime)((0, date_1.parseAbsolute)(iso, (0, date_1.getLocalTimeZone)()));
    }
    return (0, date_1.toCalendarDateTime)((0, date_1.now)((0, date_1.getLocalTimeZone)()));
}
function CreatedAtPickerPanel(_a) {
    var value = _a.value, onChange = _a.onChange;
    return (<div>
      <react_1.Calendar value={value} onChange={function (date) {
            onChange(value.set({
                year: date.year,
                month: date.month,
                day: date.day
            }));
        }}/>
      <react_1.TimePicker label="Time" value={value} onChange={function (time) {
            if (!time)
                return;
            onChange(value.set({
                hour: time.hour,
                minute: time.minute,
                second: time.second,
                millisecond: time.millisecond
            }));
        }}/>
    </div>);
}
function EditableCreatedAtCell(_a) {
    var _this = this;
    var createdAt = _a.createdAt, row = _a.row, onSave = _a.onSave, canEdit = _a.canEdit, className = _a.className;
    var t = (0, macro_1.useLingui)().t;
    var _b = (0, react_2.useState)(createdAt !== null && createdAt !== void 0 ? createdAt : null), displayValue = _b[0], setDisplayValue = _b[1];
    var _c = (0, react_2.useState)(false), open = _c[0], setOpen = _c[1];
    var _d = (0, react_2.useState)(null), draftValue = _d[0], setDraftValue = _d[1];
    var _e = (0, react_2.useState)(false), saving = _e[0], setSaving = _e[1];
    (0, react_2.useEffect)(function () {
        setDisplayValue(createdAt !== null && createdAt !== void 0 ? createdAt : null);
    }, [createdAt]);
    var display = (0, productionQuantityDisplay_utils_1.formatDateTime)(displayValue);
    var closePicker = function () {
        setOpen(false);
        setDraftValue(null);
    };
    var persistDraft = function (draft) { return __awaiter(_this, void 0, void 0, function () {
        var iso, previous, error;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    iso = draft.toDate((0, date_1.getLocalTimeZone)()).toISOString();
                    if (iso === displayValue || saving) {
                        closePicker();
                        return [2 /*return*/];
                    }
                    previous = displayValue;
                    setSaving(true);
                    return [4 /*yield*/, onSave(iso, row)];
                case 1:
                    error = (_a.sent()).error;
                    setSaving(false);
                    if (error) {
                        setDisplayValue(previous);
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to update time"], ["Failed to update time"]))));
                        return [2 /*return*/];
                    }
                    setDisplayValue(iso);
                    requestAnimationFrame(function () {
                        closePicker();
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var handleSave = function () {
        if (!draftValue || saving)
            return;
        void persistDraft(draftValue);
    };
    var handleCancel = function () {
        if (saving)
            return;
        closePicker();
    };
    if (!canEdit) {
        return (<span className={(0, react_1.cn)("text-sm text-muted-foreground whitespace-nowrap", className)}>
        {display}
      </span>);
    }
    return (<react_1.Popover open={open} onOpenChange={function (nextOpen) {
            if (nextOpen) {
                setDraftValue(toCalendarValue(displayValue));
                setOpen(true);
                return;
            }
            if (saving)
                return;
            handleCancel();
        }} modal={false}>
      <react_1.PopoverTrigger asChild>
        <button type="button" className={(0, react_1.cn)("text-sm text-muted-foreground whitespace-nowrap text-left rounded-sm -mx-1 px-1 transition-shadow", "hover:underline cursor-pointer", open && "ring-2 ring-ring ring-inset bg-background", className)} data-prevent-row-nav onPointerDown={function (event) { return event.stopPropagation(); }}>
          {display}
        </button>
      </react_1.PopoverTrigger>
      <react_1.PopoverContent align="start" side="bottom" sideOffset={6} className="w-auto overflow-hidden p-0" onOpenAutoFocus={function (event) { return event.preventDefault(); }} onClick={function (event) { return event.stopPropagation(); }} onPointerDown={function (event) { return event.stopPropagation(); }} onEscapeKeyDown={function (event) {
            if (saving) {
                event.preventDefault();
                return;
            }
            event.preventDefault();
            handleCancel();
        }} onInteractOutside={function (event) {
            if (saving)
                event.preventDefault();
        }}>
        {draftValue ? (<div className={(0, react_1.cn)("p-4 pb-3", saving && "pointer-events-none opacity-60")}>
            <CreatedAtPickerPanel value={draftValue} onChange={setDraftValue}/>
          </div>) : null}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-popover px-4 py-3">
          <react_1.HStack spacing={2}>
            <react_1.Button type="button" variant="secondary" isDisabled={saving} onClick={handleCancel}>
              <macro_1.Trans>Cancel</macro_1.Trans>
            </react_1.Button>
            <react_1.Button type="button" variant="primary" isLoading={saving} isDisabled={saving || !draftValue} onClick={handleSave}>
              <macro_1.Trans>Save</macro_1.Trans>
            </react_1.Button>
          </react_1.HStack>
        </div>
      </react_1.PopoverContent>
    </react_1.Popover>);
}
var templateObject_1;
