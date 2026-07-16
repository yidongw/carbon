"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var DimensionSelector_1 = require("./DimensionSelector");
var JournalLineRow = function (_a) {
    var _b, _c;
    var line = _a.line, index = _a.index, currencyCode = _a.currencyCode, onChange = _a.onChange, onDelete = _a.onDelete, canDelete = _a.canDelete, isDisabled = _a.isDisabled, availableDimensions = _a.availableDimensions, _d = _a.autoSaveDimensions, autoSaveDimensions = _d === void 0 ? false : _d;
    var t = (0, macro_1.useLingui)().t;
    var handleAccountChange = function (accountId) {
        onChange(__assign(__assign({}, line), { accountId: accountId }));
    };
    var handleDebitChange = function (value) {
        var numValue = isNaN(value) ? null : value;
        onChange(__assign(__assign({}, line), { debit: numValue, credit: numValue !== null && numValue > 0 ? null : line.credit }));
    };
    var handleCreditChange = function (value) {
        var numValue = isNaN(value) ? null : value;
        onChange(__assign(__assign({}, line), { credit: numValue, debit: numValue !== null && numValue > 0 ? null : line.debit }));
    };
    var handleDimensionsChange = function (dimensions) {
        onChange(__assign(__assign({}, line), { dimensions: dimensions }));
    };
    return (<div className="group">
      <div className="grid grid-cols-[auto_1fr_140px_140px_40px] items-start gap-3 py-4 px-4 transition-colors hover:bg-muted/30">
        {/* Row number */}
        <div className="flex h-9 w-6 items-center justify-center text-xs font-medium text-muted-foreground tabular-nums">
          {index + 1}
        </div>

        {/* Account and Description */}
        <div className="space-y-2">
          <Form_1.AccountControlled value={line.accountId} onChange={handleAccountChange} placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select account"], ["Select account"])))} isReadOnly={isDisabled}/>

          <react_1.Input placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Line description (optional)"], ["Line description (optional)"])))} value={line.description} onChange={function (e) { return onChange(__assign(__assign({}, line), { description: e.target.value })); }} isReadOnly={isDisabled} size="sm"/>

          {availableDimensions.length > 0 && (<DimensionSelector_1.default journalLineId={line.id} availableDimensions={availableDimensions} currentDimensions={line.dimensions} onChange={handleDimensionsChange} autoSave={autoSaveDimensions}/>)}
        </div>

        {/* Debit */}
        <react_1.NumberField value={(_b = line.debit) !== null && _b !== void 0 ? _b : 0} onChange={handleDebitChange} formatOptions={{
            style: "currency",
            currency: currencyCode
        }} minValue={0} isDisabled={isDisabled} isReadOnly={isDisabled}>
          <react_1.NumberInput className="text-right font-mono tabular-nums" isReadOnly={isDisabled}/>
        </react_1.NumberField>

        {/* Credit */}
        <react_1.NumberField value={(_c = line.credit) !== null && _c !== void 0 ? _c : 0} onChange={handleCreditChange} formatOptions={{
            style: "currency",
            currency: currencyCode
        }} minValue={0} isDisabled={isDisabled} isReadOnly={isDisabled}>
          <react_1.NumberInput className="text-right font-mono tabular-nums" isReadOnly={isDisabled}/>
        </react_1.NumberField>

        {/* Delete button */}
        <div className="flex h-9 items-center justify-center">
          {!isDisabled && (<react_1.IconButton aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Delete line"], ["Delete line"])))} icon={<lu_1.LuTrash />} variant="ghost" onClick={onDelete} isDisabled={!canDelete} className="size-8 p-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-0"/>)}
        </div>
      </div>
    </div>);
};
exports.default = JournalLineRow;
var templateObject_1, templateObject_2, templateObject_3;
