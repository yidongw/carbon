"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberRow = NumberRow;
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
/**
 * A labeled numeric input. `NumberField` (react-aria) is a container — it needs
 * a composed `NumberInputGroup` child to render an actual input — so callers
 * can't just pass a `label` prop. This wraps the boilerplate.
 */
function NumberRow(_a) {
    var label = _a.label, value = _a.value, onChange = _a.onChange, minValue = _a.minValue, maxValue = _a.maxValue;
    return (<div className="flex flex-col gap-1.5">
      <react_1.Label>{label}</react_1.Label>
      <react_1.NumberField value={value} onChange={function (v) { return onChange(Number.isNaN(v) ? 0 : v); }} minValue={minValue} maxValue={maxValue} aria-label={label}>
        <react_1.NumberInputGroup className="relative">
          <react_1.NumberInput />
          <react_1.NumberInputStepper>
            <react_1.NumberIncrementStepper>
              <lu_1.LuChevronUp size="1em" strokeWidth="3"/>
            </react_1.NumberIncrementStepper>
            <react_1.NumberDecrementStepper>
              <lu_1.LuChevronDown size="1em" strokeWidth="3"/>
            </react_1.NumberDecrementStepper>
          </react_1.NumberInputStepper>
        </react_1.NumberInputGroup>
      </react_1.NumberField>
    </div>);
}
