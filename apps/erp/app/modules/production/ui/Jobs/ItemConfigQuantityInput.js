"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemConfigQuantityInput = ItemConfigQuantityInput;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var defaultFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10
};
function ConfigTableAdornment(_a) {
    var configTableTotal = _a.configTableTotal;
    return (<div className={(0, react_1.cn)("pointer-events-none absolute right-0 top-0 z-10 m-px flex h-[calc(100%-2px)] w-10 items-center justify-center rounded-r-md border-l border-border transition-colors", configTableTotal > 0 ? "text-emerald-500" : "text-muted-foreground")} aria-hidden>
      <lu_1.LuTable size="1em" strokeWidth="3"/>
    </div>);
}
/**
 * Quantity field with optional item configuration-parameters table affordance
 * (steppers when no config params; table icon opens the config overlay).
 */
function ItemConfigQuantityInput(_a) {
    var id = _a.id, label = _a.label, _b = _a.hideLabel, hideLabel = _b === void 0 ? false : _b, value = _a.value, onChange = _a.onChange, _c = _a.minValue, minValue = _c === void 0 ? 0 : _c, maxValue = _a.maxValue, _d = _a.isDisabled, isDisabled = _d === void 0 ? false : _d, _e = _a.isReadOnly, isReadOnly = _e === void 0 ? false : _e, _f = _a.size, size = _f === void 0 ? "md" : _f, _g = _a.formatOptions, formatOptions = _g === void 0 ? defaultFormatOptions : _g, numberFieldProps = _a.numberFieldProps, hasConfigurationParameters = _a.hasConfigurationParameters, onOpenConfigTable = _a.onOpenConfigTable, _h = _a.configTableTotal, configTableTotal = _h === void 0 ? 0 : _h, _j = _a.openConfigAccessibilityLabel, openConfigAccessibilityLabel = _j === void 0 ? "Configure quantities" : _j;
    var safeValue = Number.isFinite(value) ? value : 0;
    var canOpenConfigTable = hasConfigurationParameters && onOpenConfigTable != null && !isDisabled;
    var showAdornment = canOpenConfigTable;
    var showStepper = !showAdornment && !isReadOnly && !isDisabled && size !== "sm";
    var handleChange = function (next) {
        onChange(Number.isFinite(next) ? next : 0);
    };
    var field = (<react_1.NumberField {...numberFieldProps} id={id} value={safeValue} onChange={handleChange} minValue={minValue} maxValue={maxValue} formatOptions={formatOptions} isDisabled={isDisabled} isReadOnly={isReadOnly}>
      <react_1.NumberInputGroup className="relative">
        <react_1.NumberInput isReadOnly={isReadOnly} isDisabled={isDisabled} size={size} className={(0, react_1.cn)("tabular-nums", showAdornment && "pr-10", isReadOnly &&
            configTableTotal > 0 &&
            "cursor-pointer text-foreground")}/>
        {showAdornment ? (<ConfigTableAdornment configTableTotal={configTableTotal}/>) : showStepper ? (<react_1.NumberInputStepper>
            <react_1.NumberIncrementStepper>
              <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
            </react_1.NumberIncrementStepper>
            <react_1.NumberDecrementStepper>
              <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
            </react_1.NumberDecrementStepper>
          </react_1.NumberInputStepper>) : null}
      </react_1.NumberInputGroup>
    </react_1.NumberField>);
    var shellClassName = "w-full cursor-pointer [&_input]:cursor-pointer [&_input]:pointer-events-none";
    return (<div className="flex w-full min-w-0 flex-col gap-1">
      {!hideLabel && label ? <react_1.Label htmlFor={id}>{label}</react_1.Label> : null}
      {canOpenConfigTable ? (<div role="button" tabIndex={0} aria-label={openConfigAccessibilityLabel} className={shellClassName} onClick={onOpenConfigTable} onKeyDown={function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpenConfigTable();
                }
            }}>
          {field}
        </div>) : (field)}
    </div>);
}
