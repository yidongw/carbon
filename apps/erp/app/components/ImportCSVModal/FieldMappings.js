"use client";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMapping = FieldMapping;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var PaymentTermForm_1 = require("~/modules/accounting/ui/PaymentTerms/PaymentTermForm");
var inventory_1 = require("~/modules/inventory");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var enumMatch_1 = require("./enumMatch");
var useCreateLookup_1 = require("./useCreateLookup");
var useCsvContext_1 = require("./useCsvContext");
function FieldMapping(_a) {
    var _this = this;
    var formId = _a.formId, table = _a.table, onReset = _a.onReset;
    var t = (0, macro_1.useLingui)().t;
    var initialized = (0, react_2.useRef)(false);
    var validate = (0, form_1.useFormContext)(formId).validate;
    var _b = (0, useCsvContext_1.useCsvContext)(), fileColumns = _b.fileColumns, filePath = _b.filePath, firstRows = _b.firstRows;
    var fetcher = (0, react_router_1.useFetcher)();
    var mappableFields = shared_1.fieldMappings[table];
    var _c = (0, react_2.useState)(0), currentStep = _c[0], setCurrentStep = _c[1];
    var _d = (0, react_2.useState)({}), columnMappings = _d[0], setColumnMappings = _d[1];
    var _e = (0, react_2.useState)(function () {
        return Object.entries(mappableFields).reduce(function (acc, _a) {
            var name = _a[0], _b = _a[1], type = _b.type, enumData = _b.enumData;
            if (type === "enum") {
                acc[name] = { Default: enumData.default };
            }
            return acc;
        }, {});
    }), enumMappings = _e[0], setEnumMappings = _e[1];
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (!fileColumns || !firstRows || initialized.current)
            return;
        // Try exact matching by label and field name before calling the LLM
        var fileColumnsLower = fileColumns.map(function (c) { return c.toLowerCase().trim(); });
        var exactMatches = {};
        for (var _i = 0, _a = Object.entries(mappableFields); _i < _a.length; _i++) {
            var _b = _a[_i], fieldName = _b[0], fieldDef = _b[1];
            // Match by label (e.g., "Process Type" === "Process Type")
            var labelIdx = fileColumnsLower.indexOf(fieldDef.label.toLowerCase());
            if (labelIdx !== -1) {
                exactMatches[fieldName] = fileColumns[labelIdx];
                continue;
            }
            // Match by field name (e.g., "processType" === "processtype")
            var nameIdx = fileColumnsLower.indexOf(fieldName.toLowerCase());
            if (nameIdx !== -1) {
                exactMatches[fieldName] = fileColumns[nameIdx];
            }
        }
        // If all fields matched exactly, skip the LLM call
        if (Object.keys(exactMatches).length === Object.keys(mappableFields).length) {
            initialized.current = true;
            setColumnMappings(exactMatches);
            return;
        }
        fetcher.submit({
            fileColumns: fileColumns
        }, {
            method: "POST",
            action: path_1.path.to.api.generateCsvColumns(table),
            encType: "application/json"
        });
    }, [fileColumns, firstRows]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if (fetcher.data &&
            Object.keys(fetcher.data).length > 0 &&
            !initialized.current) {
            initialized.current = true;
            setColumnMappings(function (prevMappings) {
                if (!fetcher.data || !fileColumns)
                    return prevMappings;
                return Object.entries(fetcher.data).reduce(function (acc, _a) {
                    var key = _a[0], value = _a[1];
                    if (fileColumns.includes(value)) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
            });
        }
    }, [fetcher.data]);
    var enumFields = Object.entries(mappableFields).filter(function (_a) {
        var _ = _a[0], type = _a[1].type;
        return type === "enum";
    });
    var steps = enumFields.length > 0 ? enumFields.length + 1 : 1;
    var onNext = function () {
        if (currentStep < steps - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    var onPrevious = function () {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    var onColumnMappingChange = function (name, value) {
        setColumnMappings(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var onEnumMappingChange = function (enumerable, name, value) {
        setEnumMappings(function (prev) {
            var _a, _b;
            return (__assign(__assign({}, prev), (_a = {}, _a[enumerable] = __assign(__assign({}, prev[enumerable]), (_b = {}, _b[name] = value, _b)), _a)));
        });
    };
    return (<>
      <react_1.ModalHeader>
        <div className="flex space-x-4 items-center mb-4">
          <react_1.ModalTitle className="m-0 p-0">
            {currentStep === 0
            ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Field Mapping"], ["Field Mapping"]))) : enumFields[currentStep - 1][1].label}
          </react_1.ModalTitle>
          {steps > 1 && (<span className="ml-auto text-sm text-muted-foreground whitespace-nowrap">
              {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Step"], ["Step"])))} {currentStep + 1} {t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["of"], ["of"])))} {steps}
            </span>)}
        </div>

        <react_1.ModalDescription>
          {currentStep === 0
            ? t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["We've mapped each column to what we believe is correct, but please review the data below to confirm it's accurate."], ["We've mapped each column to what we believe is correct, but please review the data below to confirm it's accurate."]))) : enumFields[currentStep - 1][1].enumData.description}
        </react_1.ModalDescription>
      </react_1.ModalHeader>
      <react_1.ModalBody>
        <div className="mt-6">
          {currentStep === 0 ? (<div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="text-sm">
                <macro_1.Trans>CSV column</macro_1.Trans>
              </div>
              <div className="text-sm">
                <macro_1.Trans>Carbon column</macro_1.Trans>
              </div>
              {Object.entries(mappableFields).map(function (_a) {
                var name = _a[0], _b = _a[1], label = _b.label, required = _b.required, type = _b.type;
                return (<FieldRow key={name} label={label} type={type} required={required} name={name} mappedColumn={columnMappings[name]} isLoading={fetcher.state !== "idle"} onColumnMappingChange={onColumnMappingChange}/>);
            })}
            </div>) : (<>
              {Object.entries(columnMappings).map(function (_a) {
                var name = _a[0], value = _a[1];
                return (<input type="hidden" key={name} name={name} value={value}/>);
            })}
              <input type="hidden" name="enumMappings" value={JSON.stringify(enumMappings)}/>
            </>)}
          {enumFields.map(function (_a, index) {
            var name = _a[0], enumData = _a[1].enumData;
            return currentStep === index + 1 && (<EnumMappingStep key={name} name={name} enumData={enumData} mappedColumn={columnMappings[name]} firstRows={firstRows} mappings={enumMappings[name]} onEnumMappingChange={onEnumMappingChange}/>);
        })}
        </div>

        <div className="flex flex-col w-full gap-2 mt-4">
          {currentStep === steps - 1 && (<Form_1.Submit isDisabled={!filePath || fetcher.state !== "idle"} type="submit">
              <macro_1.Trans>Confirm Import</macro_1.Trans>
            </Form_1.Submit>)}
          {currentStep < steps - 1 && (<react_1.Button variant="secondary" type="button" onClick={function () { return __awaiter(_this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(currentStep === 0)) return [3 /*break*/, 2];
                            return [4 /*yield*/, validate()];
                        case 1:
                            result = _a.sent();
                            if (!result.error) {
                                onNext();
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            onNext();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            }); }}>
              <macro_1.Trans>Next</macro_1.Trans>
            </react_1.Button>)}
          {currentStep === 0 && (<react_1.Button variant="link" type="button" onClick={onReset}>
              <macro_1.Trans>Choose another file</macro_1.Trans>
            </react_1.Button>)}

          {currentStep > 0 && (<react_1.Button variant="link" type="button" onClick={onPrevious}>
              <macro_1.Trans>Previous</macro_1.Trans>
            </react_1.Button>)}
        </div>
      </react_1.ModalBody>
    </>);
}
function FieldRow(_a) {
    var _b;
    var name = _a.name, label = _a.label, type = _a.type, required = _a.required, mappedColumn = _a.mappedColumn, isLoading = _a.isLoading, onColumnMappingChange = _a.onColumnMappingChange;
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var _c = (0, useCsvContext_1.useCsvContext)(), fileColumns = _c.fileColumns, firstRows = _c.firstRows;
    var firstRow = firstRows === null || firstRows === void 0 ? void 0 : firstRows.at(0);
    var description = firstRow === null || firstRow === void 0 ? void 0 : firstRow[mappedColumn];
    var formatDescription = function (description) {
        if (!description)
            return;
        switch (type) {
            case "date":
                return formatDate(description);
            case "currency":
                return formatter.format(parseFloat(description));
            case "boolean":
                return description.toLowerCase() === "true" ? "Yes" : "No";
            default:
                return description;
        }
    };
    return (<>
      <div className="relative flex min-w-0 items-center gap-2">
        <form_1.Combobox name={name} onChange={function (value) {
            if (value === null || value === void 0 ? void 0 : value.value) {
                onColumnMappingChange(name, value.value);
            }
        }} isLoading={isLoading} value={mappedColumn} options={(_b = __spreadArray(__spreadArray([], ((fileColumns === null || fileColumns === void 0 ? void 0 : fileColumns.filter(function (column) { return column !== ""; })) || []), true), (mappedColumn && !required ? ["None"] : []), true)) === null || _b === void 0 ? void 0 : _b.map(function (column) { return ({ value: column, label: column }); })}/>

        <div className="flex items-center justify-end">
          <lu_1.LuMoveRight className="text-muted-foreground"/>
        </div>
      </div>

      <span className="flex h-10 w-full items-center justify-between whitespace-nowrap border border-border bg-transparent px-3 py-2 rounded-md text-sm space-x-3">
        <div className="grow whitespace-nowrap font-normal text-muted-foreground justify-between flex">
          <span>{label}</span>

          {description && (<react_1.TooltipProvider delayDuration={50}>
              <react_1.Tooltip>
                <react_1.TooltipTrigger>
                  <lu_1.LuInfo />
                </react_1.TooltipTrigger>
                <react_1.TooltipContent className="p-2 text-sm">
                  {formatDescription(description)}
                </react_1.TooltipContent>
              </react_1.Tooltip>
            </react_1.TooltipProvider>)}
        </div>
      </span>
    </>);
}
function EnumMappingStep(_a) {
    var _this = this;
    var _b, _c;
    var name = _a.name, enumData = _a.enumData, mappedColumn = _a.mappedColumn, firstRows = _a.firstRows, mappings = _a.mappings, onEnumMappingChange = _a.onEnumMappingChange;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var company = (0, hooks_1.useUser)().company;
    var showReadableId = (_c = (_b = (0, hooks_1.useCompanySettings)()) === null || _b === void 0 ? void 0 : _b.showSupplierReadableId) !== null && _c !== void 0 ? _c : false;
    var _d = (0, react_2.useState)(function () {
        if ("options" in enumData) {
            return (enumData.options.map(function (option) { return ({
                label: option,
                value: option
            }); }) || []);
        }
        else {
            return [];
        }
    }), options = _d[0], setOptions = _d[1];
    var uniqueValues = Array.from(new Set(firstRows === null || firstRows === void 0 ? void 0 : firstRows.map(function (row) { return row[mappedColumn || ""]; }).filter(function (value) { return !!value; })));
    var fetchOptions = (0, react_2.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!("fetcher" in enumData)) return [3 /*break*/, 2];
                    return [4 /*yield*/, enumData.fetcher(carbon, company.id)];
                case 1:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(error.message);
                    }
                    else {
                        setOptions(data.map(function (item) { return (0, enumMatch_1.toMatchableOption)(item, showReadableId); }));
                    }
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [enumData, carbon, company.id, showReadableId]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    (0, react_2.useEffect)(function () {
        if ("fetcher" in enumData && carbon) {
            fetchOptions();
        }
    }, [enumData, carbon, company.id, fetchOptions]);
    // Auto-match CSV values to options once when options become available.
    // Ref guard prevents clobbering user edits on re-render.
    var autoMatchedRef = (0, react_2.useRef)(false);
    // biome-ignore lint/correctness/useExhaustiveDependencies: one-shot effect
    (0, react_2.useEffect)(function () {
        if (autoMatchedRef.current)
            return;
        if (options.length === 0 || uniqueValues.length === 0)
            return;
        var lookup = (0, enumMatch_1.buildOptionLookup)(options);
        for (var _i = 0, uniqueValues_1 = uniqueValues; _i < uniqueValues_1.length; _i++) {
            var csvValue = uniqueValues_1[_i];
            if (mappings[csvValue])
                continue;
            var matched = (0, enumMatch_1.matchCsvValue)(lookup, csvValue);
            if (matched)
                onEnumMappingChange(name, csvValue, matched);
        }
        autoMatchedRef.current = true;
    }, [options, mappedColumn]);
    // Inline create-and-link for name-only lookups (e.g. supplier type). Created
    // ids flow through onEnumMappingChange into enumMappings, so the import
    // payload is unchanged — the edge function only ever sees real ids. The same
    // batch path serves both the per-value combobox create and the "create all
    // missing" banner; the route is idempotent, so values that already exist are
    // linked instead of duplicated.
    var creatableLookup = enumData.creatableLookup;
    var _e = (0, useCreateLookup_1.useCreateLookup)({
        lookup: creatableLookup,
        onLinked: function (csvValue, id, label) {
            setOptions(function (prev) {
                return prev.some(function (o) { return o.value === id; })
                    ? prev
                    : __spreadArray(__spreadArray([], prev, true), [{ label: label, value: id }], false);
            });
            onEnumMappingChange(name, csvValue, id);
        }
    }), createMissingValues = _e.create, isCreating = _e.isCreating;
    var unmatchedValues = creatableLookup
        ? uniqueValues.filter(function (csvValue) { return !mappings[csvValue]; })
        : [];
    // Rich lookups (payment term, shipping method) need more than a name, so
    // "create" opens the existing form modal pre-filled with the typed value.
    // Once the refreshed options contain it, the pending CSV value is linked.
    var creatableForm = enumData.creatableForm;
    var permissions = (0, hooks_1.usePermissions)();
    var canCreateViaForm = (creatableForm === "paymentTerm" &&
        permissions.can("create", "accounting")) ||
        (creatableForm === "shippingMethod" &&
            permissions.can("create", "inventory"));
    var formModal = (0, react_1.useDisclosure)();
    var _f = (0, react_2.useState)(""), formCreatedName = _f[0], setFormCreatedName = _f[1];
    var pendingFormCsvValueRef = (0, react_2.useRef)(null);
    // biome-ignore lint/correctness/useExhaustiveDependencies: link once options refresh
    (0, react_2.useEffect)(function () {
        var csvValue = pendingFormCsvValueRef.current;
        if (csvValue === null || !formCreatedName)
            return;
        var matched = (0, enumMatch_1.matchCsvValue)((0, enumMatch_1.buildOptionLookup)(options), formCreatedName);
        if (matched) {
            onEnumMappingChange(name, csvValue, matched);
            pendingFormCsvValueRef.current = null;
            setFormCreatedName("");
        }
    }, [options]);
    return (<div>
      {creatableLookup && unmatchedValues.length > 0 && (<div className="mt-1 mb-4 flex items-center justify-between gap-4 rounded-md border bg-muted/40 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border bg-background">
              <lu_1.LuListPlus className="h-4 w-4 text-muted-foreground"/>
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-medium">
                <macro_1.Trans>{unmatchedValues.length} values missing</macro_1.Trans>
              </span>
              <react_1.TooltipProvider delayDuration={50}>
                <react_1.Tooltip>
                  <react_1.TooltipTrigger className="w-fit text-left text-xs text-muted-foreground">
                    <macro_1.Trans>View missing values</macro_1.Trans>
                  </react_1.TooltipTrigger>
                  <react_1.TooltipContent className="max-w-64 p-2 text-sm">
                    {unmatchedValues.join(", ")}
                  </react_1.TooltipContent>
                </react_1.Tooltip>
              </react_1.TooltipProvider>
            </div>
          </div>
          <react_1.Button variant="secondary" size="md" leftIcon={<lu_1.LuPlus />} disabled={isCreating} onClick={function () {
                return createMissingValues(unmatchedValues, unmatchedValues);
            }}>
            <macro_1.Trans>Create {unmatchedValues.length} values</macro_1.Trans>
          </react_1.Button>
        </div>)}
      <div className="grid grid-cols-2 gap-4">
        <div className="font-medium ">
          {"".concat((0, string_1.capitalize)(mappedColumn !== null && mappedColumn !== void 0 ? mappedColumn : "CSV"), " Value")}
        </div>
        <div className="font-medium">
          <macro_1.Trans>Carbon Value</macro_1.Trans>
        </div>

        {__spreadArray([], new Set(__spreadArray(__spreadArray([], uniqueValues, true), ["Default"], false)), true).map(function (csvValue) {
            var comboboxProps = {
                name: "".concat(name, "-").concat(csvValue),
                value: mappings[csvValue],
                options: options,
                onChange: function (value) {
                    if (value === null || value === void 0 ? void 0 : value.value) {
                        onEnumMappingChange(name, csvValue, value.value);
                    }
                }
            };
            return (<react_2.Fragment key={csvValue}>
              <div className="relative flex min-w-0 items-center gap-2">
                <div>{csvValue}</div>
                <div className="flex items-center justify-end">
                  <lu_1.LuMoveRight className="text-muted-foreground"/>
                </div>
              </div>
              {creatableLookup ? (<form_1.CreatableCombobox {...comboboxProps} onCreateOption={function (inputValue) {
                        return createMissingValues([csvValue], [inputValue]);
                    }}/>) : canCreateViaForm ? (<form_1.CreatableCombobox {...comboboxProps} onCreateOption={function (inputValue) {
                        setFormCreatedName(inputValue);
                        pendingFormCsvValueRef.current = csvValue;
                        formModal.onOpen();
                    }}/>) : (<form_1.Combobox {...comboboxProps}/>)}
            </react_2.Fragment>);
        })}
      </div>
      {formModal.isOpen && creatableForm === "paymentTerm" && (<PaymentTermForm_1.default type="modal" onClose={function () {
                formModal.onClose();
                fetchOptions();
            }} initialValues={{
                name: formCreatedName,
                calculationMethod: "Net",
                daysDue: 0,
                discountPercentage: 0,
                daysDiscount: 0
            }}/>)}
      {formModal.isOpen && creatableForm === "shippingMethod" && (<inventory_1.ShippingMethodForm type="modal" onClose={function () {
                formModal.onClose();
                fetchOptions();
            }} initialValues={{
                name: formCreatedName,
                carrier: ""
            }}/>)}
    </div>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
