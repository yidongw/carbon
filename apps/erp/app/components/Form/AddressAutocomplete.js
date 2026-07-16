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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var useGooglePlaces_1 = require("~/hooks/useGooglePlaces");
var Country_1 = require("./Country");
var AddressAutocomplete = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? "vertical" : _b;
    var t = (0, macro_1.useLingui)().t;
    var address1Field = "addressLine1";
    var _c = (0, form_1.useControlField)(address1Field), value = _c[0], setValue = _c[1];
    var _d = (0, form_1.useControlField)("countryCode"), setCountryCode = _d[1];
    var clearError = (0, form_1.useFormContext)().clearError;
    var _e = (0, form_1.useField)(address1Field), error = _e.error, isAddressLine1Optional = _e.isOptional;
    var _f = (0, react_2.useState)(false), open = _f[0], setOpen = _f[1];
    var _g = (0, react_2.useState)(false), justSelected = _g[0], setJustSelected = _g[1];
    var _h = (0, react_2.useState)(false), userInteracted = _h[0], setUserInteracted = _h[1];
    var containerRef = (0, react_2.useRef)(null);
    var addressLine2Ref = (0, react_2.useRef)(null);
    var cityRef = (0, react_2.useRef)(null);
    var stateProvinceRef = (0, react_2.useRef)(null);
    var postalCodeRef = (0, react_2.useRef)(null);
    var _j = (0, useGooglePlaces_1.useGooglePlaces)(), suggestions = _j.suggestions, loading = _j.loading, getSuggestions = _j.getSuggestions, selectPlace = _j.selectPlace, clearSuggestions = _j.clearSuggestions;
    var handleInputChange = (0, react_2.useCallback)(function (input) {
        if (input && !justSelected && userInteracted) {
            getSuggestions(input);
            setOpen(true);
        }
        else {
            clearSuggestions();
            setOpen(false);
        }
    }, [getSuggestions, clearSuggestions, justSelected, userInteracted]);
    var debouncedGetSuggestions = (0, react_1.useDebounce)(handleInputChange, 300);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (userInteracted) {
            debouncedGetSuggestions(value || "");
        }
    }, [value, userInteracted]);
    (0, react_2.useEffect)(function () {
        if (!open)
            return;
        var handleClickOutside = function (event) {
            if (containerRef.current &&
                !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return function () { return document.removeEventListener("mousedown", handleClickOutside); };
    }, [open]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var handleSelect = (0, react_2.useCallback)(function (placeId) { return __awaiter(void 0, void 0, void 0, function () {
        var address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setOpen(false);
                    clearSuggestions();
                    setJustSelected(true);
                    return [4 /*yield*/, selectPlace(placeId)];
                case 1:
                    address = _a.sent();
                    if (!address)
                        return [2 /*return*/];
                    setValue(address.addressLine1);
                    // Populate remaining address fields via refs
                    if (addressLine2Ref.current)
                        addressLine2Ref.current.value = address.addressLine2;
                    if (cityRef.current)
                        cityRef.current.value = address.city;
                    if (stateProvinceRef.current)
                        stateProvinceRef.current.value = address.stateProvince;
                    if (postalCodeRef.current)
                        postalCodeRef.current.value = address.postalCode;
                    setCountryCode(address.countryCode);
                    clearError(address1Field, "addressLine2", "city", "stateProvince", "postalCode", "countryCode");
                    return [2 /*return*/];
            }
        });
    }); }, [
        clearSuggestions,
        selectPlace,
        setValue,
        setCountryCode,
        clearError,
        address1Field
    ]);
    var handleInputFocus = (0, react_2.useCallback)(function () {
        setUserInteracted(true);
        if ((value || "").length >= 3 && !justSelected) {
            setOpen(true);
        }
    }, [value, justSelected]);
    var handleValueChange = (0, react_2.useCallback)(function (newValue) {
        setUserInteracted(true);
        setJustSelected(false);
        setValue(newValue);
    }, [setValue]);
    var handleKeyDown = (0, react_2.useCallback)(function (e) {
        if (e.key === "Tab") {
            setOpen(false);
        }
    }, []);
    var addressAutocompleteField = (<react_1.FormControl isInvalid={!!error}>
      <react_1.FormLabel htmlFor={address1Field} isOptional={isAddressLine1Optional}>
        <macro_1.Trans>Address Line 1</macro_1.Trans>
      </react_1.FormLabel>
      <div className="relative w-full" ref={containerRef}>
        <react_1.Command shouldFilter={false} className="bg-transparent">
          <react_1.CommandInputTextField id={address1Field} name={address1Field} value={value || ""} onValueChange={handleValueChange} onFocus={handleInputFocus} onKeyDown={handleKeyDown} autoComplete="off" className="bg-transparent"/>
          {open && suggestions.length > 0 && (<react_1.CommandList className="absolute w-full top-10 z-[9999] rounded-md border bg-popover text-popover-foreground shadow-md p-0">
              <react_1.CommandEmpty>
                {loading ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Loading..."], ["Loading..."]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["No addresses found"], ["No addresses found"])))}
              </react_1.CommandEmpty>
              <react_1.CommandGroup>
                {suggestions.map(function (suggestion) { return (<react_1.CommandItem key={suggestion.placeId} value={suggestion.placeId} className="cursor-pointer" onSelect={function () { return handleSelect(suggestion.placeId); }} onMouseDown={function (e) {
                    e.preventDefault();
                    handleSelect(suggestion.placeId);
                }}>
                    {suggestion.text}
                  </react_1.CommandItem>); })}
              </react_1.CommandGroup>
            </react_1.CommandList>)}
        </react_1.Command>
      </div>
      {error && <react_1.FormErrorMessage>{error}</react_1.FormErrorMessage>}
    </react_1.FormControl>);
    var addressLine2Field = (<form_1.Input ref={addressLine2Ref} name="addressLine2" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Address Line 2"], ["Address Line 2"])))}/>);
    var cityField = <form_1.Input ref={cityRef} name="city" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["City"], ["City"])))}/>;
    var stateProvinceField = (<form_1.Input ref={stateProvinceRef} name="stateProvince" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["State / Province"], ["State / Province"])))}/>);
    var postalCodeField = (<form_1.Input ref={postalCodeRef} name="postalCode" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Postal Code"], ["Postal Code"])))}/>);
    var countryField = <Country_1.default name="countryCode" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Country"], ["Country"])))}/>;
    if (variant === "grid") {
        return (<>
        {addressAutocompleteField}
        {addressLine2Field}
        {cityField}
        {stateProvinceField}
        {postalCodeField}
        {countryField}
      </>);
    }
    // Default vertical layout
    return (<react_1.VStack spacing={4}>
      {addressAutocompleteField}
      {addressLine2Field}
      {cityField}
      {stateProvinceField}
      {postalCodeField}
      {countryField}
    </react_1.VStack>);
};
exports.default = AddressAutocomplete;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
