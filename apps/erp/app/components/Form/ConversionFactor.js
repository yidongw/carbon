"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var UnitOfMeasure_1 = require("./UnitOfMeasure");
var ConversionDirection;
(function (ConversionDirection) {
    ConversionDirection[ConversionDirection["PurchasedToInventory"] = 0] = "PurchasedToInventory";
    ConversionDirection[ConversionDirection["InventoryToPurchased"] = 1] = "InventoryToPurchased";
})(ConversionDirection || (ConversionDirection = {}));
var ConversionFactor = (0, react_2.forwardRef)(function (_a, ref) {
    var name = _a.name, label = _a.label, isRequired = _a.isRequired, isReadOnly = _a.isReadOnly, helperText = _a.helperText, value = _a.value, onChange = _a.onChange, purchasingCode = _a.purchasingCode, inventoryCode = _a.inventoryCode;
    var t = (0, macro_1.useLingui)().t;
    var resolvedLabel = label !== null && label !== void 0 ? label : t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Conversion Factor"], ["Conversion Factor"])));
    var _b = (0, form_1.useField)(name), getInputProps = _b.getInputProps, error = _b.error, defaultValue = _b.defaultValue, fieldIsOptional = _b.isOptional;
    var _c = (0, form_1.useControlField)(name), controlValue = _c[0], setControlValue = _c[1];
    var _d = (0, react_2.useState)(false), open = _d[0], setOpen = _d[1];
    var initialValue = (0, react_2.useRef)(defaultValue);
    var _e = (0, react_2.useState)(initialValue.current), conversionFactor = _e[0], setConversionFactor = _e[1];
    (0, react_2.useEffect)(function () {
        if (value) {
            setControlValue(value);
            setConversionFactor(value);
            initialValue.current = value;
        }
    }, [setControlValue, value]);
    var _f = (0, react_2.useState)(ConversionDirection.InventoryToPurchased), conversionDirection = _f[0], setConversionDirection = _f[1];
    var switchDirection = function () {
        if (conversionDirection === ConversionDirection.InventoryToPurchased) {
            setConversionDirection(ConversionDirection.PurchasedToInventory);
        }
        else {
            setConversionDirection(ConversionDirection.InventoryToPurchased);
        }
    };
    var unitOfMeasureOptions = (0, UnitOfMeasure_1.useUnitOfMeasure)();
    var description = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e, _f;
        var purchaseUnit = (_c = (_b = (_a = unitOfMeasureOptions.find(function (option) { return option.value === purchasingCode; })) === null || _a === void 0 ? void 0 : _a.label) !== null && _b !== void 0 ? _b : purchasingCode) !== null && _c !== void 0 ? _c : "";
        var inventoryUnit = (_f = (_e = (_d = unitOfMeasureOptions.find(function (option) { return option.value === inventoryCode; })) === null || _d === void 0 ? void 0 : _d.label) !== null && _e !== void 0 ? _e : inventoryCode) !== null && _f !== void 0 ? _f : "";
        var inverseOfConversion = 1 / conversionFactor;
        if (purchasingCode === inventoryCode)
            return t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No conversion is required"], ["No conversion is required"])));
        if (conversionDirection === ConversionDirection.InventoryToPurchased) {
            return (<>
            <span className={(0, react_1.cn)(Number.isNaN(conversionFactor) && "opacity-0")}>
              {"There ".concat(conversionFactor === 1 ? "is" : "are", " ").concat((0, utils_1.twoDecimals)(conversionFactor), " ").concat(inventoryUnit.toLocaleLowerCase(), " in one ")}
              <span className="text-primary">
                {purchaseUnit.toLocaleLowerCase()}
              </span>
            </span>
          </>);
        }
        return (<>
          <span>
            {"There ".concat(conversionFactor === 1 ? "is" : "are", " ").concat((0, utils_1.twoDecimals)(inverseOfConversion), " ")}
            <span className="text-primary">
              {purchaseUnit.toLocaleLowerCase()}
            </span>
            {" in one ".concat(inventoryUnit.toLocaleLowerCase())}
          </span>
        </>);
    }, [
        conversionDirection,
        conversionFactor,
        inventoryCode,
        purchasingCode,
        unitOfMeasureOptions,
        t
    ]);
    (0, react_2.useEffect)(function () {
        if (inventoryCode === purchasingCode) {
            setConversionFactor(1);
            setControlValue(1);
            initialValue.current = 1;
        }
    }, [inventoryCode, purchasingCode, setControlValue]);
    var onPurchaseUnitChange = function (v) {
        setConversionFactor(1 / v);
        onChange === null || onChange === void 0 ? void 0 : onChange(1 / v);
    };
    var onInventoryUnitChange = function (v) {
        setConversionFactor(v);
        onChange === null || onChange === void 0 ? void 0 : onChange(v);
    };
    var onConfirm = function () {
        setControlValue(conversionFactor);
        setOpen(false);
        initialValue.current = conversionFactor;
    };
    var onCancel = function () {
        setConversionFactor(initialValue.current);
        setOpen(false);
    };
    var resolvedIsOptional = isRequired ? false : (fieldIsOptional !== null && fieldIsOptional !== void 0 ? fieldIsOptional : false);
    return (<react_1.FormControl isInvalid={!!error} isRequired={isRequired}>
        {resolvedLabel && (<react_1.FormLabel htmlFor={name} isOptional={resolvedIsOptional}>
            {resolvedLabel}
          </react_1.FormLabel>)}
        <input {...getInputProps({
        id: name
    })} type="hidden" name={name} id={name} value={controlValue}/>
        <react_1.Modal open={open} onOpenChange={function (open) {
            if (!open)
                onCancel();
        }}>
          <react_1.CommandTrigger disabled={isReadOnly || inventoryCode === purchasingCode} icon={<lu_1.LuLanguages className="w-4 h-4 opacity-50"/>} ref={ref} onClick={function () { return setOpen(true); }}>
            {controlValue ? (0, utils_1.twoDecimals)(controlValue) : "-"}
          </react_1.CommandTrigger>

          <react_1.ModalContent>
            <react_1.ModalBody>
              <react_1.VStack spacing={8}>
                <react_1.VStack className="w-full text-center">
                  <div className="w-full text-lg">{description}</div>
                  <div className="w-full">
                    <react_1.Button onClick={switchDirection} variant="secondary" size="sm" className="border-dashed">
                      <macro_1.Trans>Switch</macro_1.Trans>
                      <lu_1.LuArrowRightLeft className="w-4 h-4 ml-1"/>
                    </react_1.Button>
                  </div>
                </react_1.VStack>
                {conversionDirection ===
            ConversionDirection.PurchasedToInventory ? (<react_1.HStack className="w-full justify-around items-start">
                    <react_1.VStack spacing={1}>
                      <react_1.NumberField value={1 / conversionFactor} onChange={onPurchaseUnitChange}>
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
                      <span className="text-xs text-primary">
                        <macro_1.Trans>Purchased</macro_1.Trans>
                      </span>
                    </react_1.VStack>
                    <react_1.VStack className="w-auto pt-2">
                      <span className="font-mono text-xl">=</span>
                    </react_1.VStack>
                    <react_1.VStack spacing={1}>
                      <react_1.NumberField value={1}>
                        <react_1.NumberInputGroup className="relative">
                          <react_1.NumberInput isReadOnly/>
                        </react_1.NumberInputGroup>
                      </react_1.NumberField>
                      <span className="text-xs text-muted-foreground ">
                        <macro_1.Trans>Inventory</macro_1.Trans>
                      </span>
                    </react_1.VStack>
                  </react_1.HStack>) : (<react_1.HStack className="w-full justify-around items-start">
                    <react_1.VStack spacing={1}>
                      <react_1.NumberField value={conversionFactor} onChange={onInventoryUnitChange}>
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
                      <span className="text-xs text-muted-foreground ">
                        <macro_1.Trans>Inventory</macro_1.Trans>
                      </span>
                    </react_1.VStack>
                    <react_1.VStack className="w-auto pt-2">
                      <span className="font-mono text-xl">=</span>
                    </react_1.VStack>
                    <react_1.VStack spacing={1}>
                      <react_1.NumberField value={1}>
                        <react_1.NumberInputGroup className="relative">
                          <react_1.NumberInput isReadOnly/>
                        </react_1.NumberInputGroup>
                      </react_1.NumberField>
                      <span className="text-xs text-muted-foreground text-primary">
                        <macro_1.Trans>Purchased</macro_1.Trans>
                      </span>
                    </react_1.VStack>
                  </react_1.HStack>)}
              </react_1.VStack>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={onCancel}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button onClick={onConfirm}>
                <macro_1.Trans>Confirm</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>
        {helperText && <react_1.FormHelperText>{helperText}</react_1.FormHelperText>}
        {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
      </react_1.FormControl>);
});
ConversionFactor.displayName = "ConversionFactor";
exports.default = ConversionFactor;
var templateObject_1, templateObject_2;
