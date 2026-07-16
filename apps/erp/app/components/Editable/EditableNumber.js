"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var EditableNumber = function (mutation, numberFieldProps) {
    return function (_a) {
        var value = _a.value, row = _a.row, accessorKey = _a.accessorKey, onError = _a.onError, onUpdate = _a.onUpdate;
        return (<react_1.NumberField {...numberFieldProps} value={value} onChange={function (numberValue) {
                var _a;
                if (!Number.isFinite(numberValue) || numberValue === value)
                    return;
                onUpdate((_a = {}, _a[accessorKey] = numberValue, _a));
                // @ts-ignore
                mutation(accessorKey, numberValue, row)
                    .then(function (_a) {
                    var _b;
                    var error = _a.error;
                    if (error) {
                        onError();
                        onUpdate((_b = {}, _b[accessorKey] = value, _b));
                    }
                })
                    .catch(function () {
                    var _a;
                    onError();
                    onUpdate((_a = {}, _a[accessorKey] = value, _a));
                });
            }}>
        <react_1.NumberInput size="sm" className="w-full rounded-none outline-none border-none focus-visible:ring-0" autoFocus onFocus={function (e) { return e.currentTarget.select(); }}/>
      </react_1.NumberField>);
    };
};
exports.default = EditableNumber;
