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
exports.IssueMaterialModal = IssueMaterialModal;
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var macro_1 = require("@lingui/react/macro");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var date_1 = require("@internationalized/date");
var i18n_1 = require("@react-aria/i18n");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var models_1 = require("~/services/models");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
function IssueMaterialModal(_a) {
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    var operationId = _a.operationId, _l = _a.expiredEntityPolicy, expiredEntityPolicy = _l === void 0 ? "Block" : _l, locationId = _a.locationId, workCenterId = _a.workCenterId, material = _a.material, parentId = _a.parentId, parentIdIsSerialized = _a.parentIdIsSerialized, _m = _a.trackedInputs, trackedInputs = _m === void 0 ? [] : _m, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var items = (0, stores_1.useItems)()[0];
    var numberFormatter = (0, i18n_1.useNumberFormatter)({ maximumFractionDigits: 4 });
    // Item selection state
    var _o = (0, react_2.useState)((_b = material === null || material === void 0 ? void 0 : material.itemId) !== null && _b !== void 0 ? _b : ""), selectedItemId = _o[0], setSelectedItemId = _o[1];
    var _p = (0, react_2.useState)(null), itemDetails = _p[0], setItemDetails = _p[1];
    var _q = (0, react_2.useState)(false), isLoadingItem = _q[0], setIsLoadingItem = _q[1];
    // Determine tracking type from material or item details
    var trackingType = (0, react_2.useMemo)(function () {
        var _a;
        if (material) {
            if (material.requiresSerialTracking)
                return "Serial";
            if (material.requiresBatchTracking)
                return "Batch";
            return "Inventory";
        }
        return (_a = itemDetails === null || itemDetails === void 0 ? void 0 : itemDetails.itemTrackingType) !== null && _a !== void 0 ? _a : null;
    }, [material, itemDetails]);
    // Item options for the combobox
    var itemOptions = (0, react_2.useMemo)(function () {
        return items.map(function (item) { return ({
            label: item.readableIdWithRevision,
            helper: item.name,
            value: item.id
        }); });
    }, [items]);
    // Serial number state and options
    var serialNumbers = useSerialNumbers(trackingType === "Serial" ? selectedItemId : undefined).data;
    // Today in the local timezone — used for "is this entity expired"
    // comparisons throughout the modal. Memoized so we re-derive option
    // lists once a day rather than every render.
    var todayLocal = (0, react_2.useMemo)(function () { return (0, date_1.today)((0, date_1.getLocalTimeZone)()); }, []);
    var isExpiryPast = (0, react_2.useCallback)(function (date) {
        if (!date)
            return false;
        try {
            return (0, date_1.parseDate)(date).compare(todayLocal) < 0;
        }
        catch (_a) {
            return false;
        }
    }, [todayLocal]);
    // Format an expiration date as `MMM d, yyyy` for the option helper text.
    // Browsers all support this through Intl.DateTimeFormat, no extra deps.
    var formatExpiry = (0, react_2.useCallback)(function (date) {
        if (!date)
            return "";
        try {
            var cd = (0, date_1.parseDate)(date);
            return new Intl.DateTimeFormat(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric"
            }).format(cd.toDate((0, date_1.getLocalTimeZone)()));
        }
        catch (_a) {
            return date;
        }
    }, []);
    var serialOptions = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = serialNumbers === null || serialNumbers === void 0 ? void 0 : serialNumbers.data) === null || _a === void 0 ? void 0 : _a.filter(function (sn) {
            // When policy = Block, expired stock is not a valid choice — drop
            // it from the picker entirely so operators can't even pick it.
            // Warn / BlockWithOverride keep it visible (overridable downstream).
            return expiredEntityPolicy === "Block"
                ? !isExpiryPast(sn.expirationDate)
                : true;
        }).map(function (sn) {
            var _a;
            var expired = isExpiryPast(sn.expirationDate);
            var label = (<span key={sn.id} className="flex items-center gap-2">
              {sn.readableId && (<span className="font-medium">{sn.readableId}</span>)}
              <span className="text-xs text-muted-foreground font-mono truncate">
                {sn.id}
              </span>
              {expired && <react_1.Badge variant="red">Expired</react_1.Badge>}
            </span>);
            var helper = sn.expirationDate
                ? "".concat(expired ? "Expired" : "Expires", " ").concat(formatExpiry(sn.expirationDate))
                : undefined;
            return {
                label: label,
                value: sn.id,
                helper: helper,
                expirationDate: (_a = sn.expirationDate) !== null && _a !== void 0 ? _a : null,
                isExpired: expired
            };
        })) !== null && _b !== void 0 ? _b : []);
    }, [serialNumbers, isExpiryPast, formatExpiry, expiredEntityPolicy]);
    // Batch number state and options
    var batchNumbers = useBatchNumbers(trackingType === "Batch" ? selectedItemId : undefined).data;
    var batchOptions = (0, react_2.useMemo)(function () {
        var _a, _b;
        return ((_b = (_a = batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) === null || _a === void 0 ? void 0 : _a.filter(function (bn) { return bn.status === "Available"; }).filter(function (bn) {
            return expiredEntityPolicy === "Block"
                ? !isExpiryPast(bn.expirationDate)
                : true;
        }).map(function (bn) {
            var _a;
            var expired = isExpiryPast(bn.expirationDate);
            var label = (<span key={bn.id} className="flex items-center gap-2">
              {bn.readableId && (<span className="font-medium">{bn.readableId}</span>)}
              <span className="text-xs text-muted-foreground font-mono truncate">
                {bn.id.slice(0, 10)}
              </span>
              <span className="text-xs text-muted-foreground">
                {bn.quantity} available
              </span>
              {expired && <react_1.Badge variant="red">Expired</react_1.Badge>}
            </span>);
            var helper = bn.expirationDate
                ? "".concat(expired ? "Expired" : "Expires", " ").concat(formatExpiry(bn.expirationDate))
                : undefined;
            return {
                label: label,
                value: bn.id,
                helper: helper,
                availableQuantity: bn.quantity,
                expirationDate: (_a = bn.expirationDate) !== null && _a !== void 0 ? _a : null,
                isExpired: expired
            };
        })) !== null && _b !== void 0 ? _b : []);
    }, [batchNumbers, isExpiryPast, formatExpiry, expiredEntityPolicy]);
    // Unconsume options for batch
    var unconsumeOptions = (0, react_2.useMemo)(function () {
        return trackedInputs.map(function (input) { return ({
            label: (<span className="flex items-center gap-2">
          {input.readableId && (<span className="font-medium">{input.readableId}</span>)}
          <span className="text-xs text-muted-foreground font-mono truncate">
            {input.id.slice(0, 10)}
          </span>
          <span className="text-xs text-muted-foreground">
            qty {input.quantity}
          </span>
        </span>),
            value: input.id
        }); });
    }, [trackedInputs]);
    // Quantity for inventory items
    var initialQuantity = (0, react_2.useMemo)(function () {
        var _a, _b, _c, _d, _e;
        if (!material)
            return 1;
        var total = parentIdIsSerialized
            ? ((_b = (_a = material.quantity) !== null && _a !== void 0 ? _a : material.estimatedQuantity) !== null && _b !== void 0 ? _b : 1)
            : ((_d = (_c = material.estimatedQuantity) !== null && _c !== void 0 ? _c : material.quantity) !== null && _d !== void 0 ? _d : 1);
        var remaining = total - ((_e = material.quantityIssued) !== null && _e !== void 0 ? _e : 0);
        return Math.max(1, remaining);
    }, [material, parentIdIsSerialized]);
    // Serial numbers selection state
    var _r = (0, react_2.useState)(Array(Math.max(1, initialQuantity))
        .fill("")
        .map(function (_, index) { return ({ index: index, id: "" }); })), selectedSerialNumbers = _r[0], setSelectedSerialNumbers = _r[1];
    var _s = (0, react_2.useState)({}), serialErrors = _s[0], setSerialErrors = _s[1];
    var _t = (0, react_2.useState)([]), selectedTrackedInputs = _t[0], setSelectedTrackedInputs = _t[1];
    // Batch numbers selection state
    var _u = (0, react_2.useState)([{ index: 0, id: "", quantity: initialQuantity }]), selectedBatchNumbers = _u[0], setSelectedBatchNumbers = _u[1];
    var _v = (0, react_2.useState)({}), batchErrors = _v[0], setBatchErrors = _v[1];
    var _w = (0, react_2.useState)(""), unconsumedBatch = _w[0], setUnconsumedBatch = _w[1];
    // Tab state
    var _x = (0, react_2.useState)("scan"), activeTab = _x[0], setActiveTab = _x[1];
    // Expiry override state. Surfaced when a selected serial/batch is expired.
    // Server enforces the actual company policy (Warn / Block / BlockWithOverride);
    // this UI lets the operator type a reason that the server records when the
    // policy is BlockWithOverride and ignores otherwise.
    var _y = (0, react_2.useState)(""), expiryOverrideReason = _y[0], setExpiryOverrideReason = _y[1];
    var expiredSerialIds = (0, react_2.useMemo)(function () {
        var _a;
        var byId = new Map(((_a = serialNumbers === null || serialNumbers === void 0 ? void 0 : serialNumbers.data) !== null && _a !== void 0 ? _a : []).map(function (s) { return [s.id, s.expirationDate]; }));
        return selectedSerialNumbers
            .filter(function (s) { return s.id && isExpiryPast(byId.get(s.id)); })
            .map(function (s) { return s.id; });
    }, [selectedSerialNumbers, serialNumbers, isExpiryPast]);
    var expiredBatchIds = (0, react_2.useMemo)(function () {
        var _a;
        var byId = new Map(((_a = batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) !== null && _a !== void 0 ? _a : []).map(function (b) { return [b.id, b.expirationDate]; }));
        return selectedBatchNumbers
            .filter(function (b) { return b.id && isExpiryPast(byId.get(b.id)); })
            .map(function (b) { return b.id; });
    }, [selectedBatchNumbers, batchNumbers, isExpiryPast]);
    var hasExpiredSelection = expiredSerialIds.length > 0 || expiredBatchIds.length > 0;
    // Split entities result state (for batch splitting)
    var _z = (0, react_2.useState)([]), splitEntitiesResult = _z[0], setSplitEntitiesResult = _z[1];
    // Fetchers
    var fetcher = (0, react_router_1.useFetcher)();
    var unconsumeFetcher = (0, react_router_1.useFetcher)();
    var inventoryFetcher = (0, react_router_1.useFetcher)();
    // Sub-modals for batch splitting
    var convertDisclosure = (0, react_1.useDisclosure)();
    var scrapDisclosure = (0, react_1.useDisclosure)();
    var _0 = (0, react_2.useState)(null), trackedEntity = _0[0], setTrackedEntity = _0[1];
    // Fetch item details when item is selected (only when no material provided)
    var handleItemChange = (0, react_2.useCallback)(function (itemId) { return __awaiter(_this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedItemId(itemId);
                    setItemDetails(null);
                    setSelectedSerialNumbers([{ index: 0, id: "" }]);
                    setSelectedBatchNumbers([{ index: 0, id: "", quantity: 1 }]);
                    setSerialErrors({});
                    setBatchErrors({});
                    if (!(itemId && carbon && !material)) return [3 /*break*/, 2];
                    setIsLoadingItem(true);
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("id, name, unitOfMeasureCode, itemTrackingType")
                            .eq("id", itemId)
                            .single()];
                case 1:
                    data = (_a.sent()).data;
                    if (data) {
                        setItemDetails(data);
                    }
                    setIsLoadingItem(false);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); }, [carbon, material]);
    // Validation functions
    var validateSerialNumber = (0, react_2.useCallback)(function (value, index) {
        var _a;
        if (!value)
            return "Serial number is required";
        var isDuplicate = selectedSerialNumbers.some(function (sn, i) { return sn.id === value && i !== index; });
        if (isDuplicate)
            return "Duplicate serial number";
        var isValid = serialOptions.some(function (opt) { return opt.value === value; });
        if (!isValid) {
            var sn = (_a = serialNumbers === null || serialNumbers === void 0 ? void 0 : serialNumbers.data) === null || _a === void 0 ? void 0 : _a.find(function (s) { return s.id === value; });
            if (sn)
                return "Serial number is ".concat(sn.status);
            return "Serial number is not available";
        }
        return null;
    }, [selectedSerialNumbers, serialOptions, serialNumbers === null || serialNumbers === void 0 ? void 0 : serialNumbers.data]);
    var validateBatchNumber = (0, react_2.useCallback)(function (value, qty, index) {
        var _a;
        if (!value)
            return "Batch number is required";
        var isDuplicate = selectedBatchNumbers.some(function (bn, i) { return bn.id === value && i !== index; });
        if (isDuplicate)
            return "Duplicate batch number";
        var batchOption = batchOptions.find(function (opt) { return opt.value === value; });
        if (!batchOption) {
            var bn = (_a = batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data) === null || _a === void 0 ? void 0 : _a.find(function (b) { return b.id === value; });
            if (bn)
                return "Batch number is ".concat(bn.status);
            return "Batch number is not available";
        }
        if (qty <= 0)
            return "Quantity must be greater than 0";
        if (qty > batchOption.availableQuantity)
            return "Quantity cannot exceed available quantity (".concat(batchOption.availableQuantity, ")");
        return null;
    }, [selectedBatchNumbers, batchOptions, batchNumbers === null || batchNumbers === void 0 ? void 0 : batchNumbers.data]);
    // Update functions for serial numbers
    var updateSerialNumber = (0, react_2.useCallback)(function (serialNumber) {
        setSelectedSerialNumbers(function (prev) {
            var newSerialNumbers = __spreadArray([], prev, true);
            newSerialNumbers[serialNumber.index] = serialNumber;
            return newSerialNumbers;
        });
    }, []);
    var addSerialNumber = (0, react_2.useCallback)(function () {
        setSelectedSerialNumbers(function (prev) {
            var newIndex = prev.length;
            return __spreadArray(__spreadArray([], prev, true), [{ index: newIndex, id: "" }], false);
        });
    }, []);
    var removeSerialNumber = (0, react_2.useCallback)(function (indexToRemove) {
        setSelectedSerialNumbers(function (prev) {
            var filtered = prev.filter(function (_, i) { return i !== indexToRemove; });
            return filtered.map(function (item, i) { return (__assign(__assign({}, item), { index: i })); });
        });
        setSerialErrors(function (prev) {
            var newErrors = __assign({}, prev);
            delete newErrors[indexToRemove];
            var reindexedErrors = {};
            Object.entries(newErrors).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var keyNum = parseInt(key);
                if (keyNum > indexToRemove) {
                    reindexedErrors[keyNum - 1] = value;
                }
                else {
                    reindexedErrors[keyNum] = value;
                }
            });
            return reindexedErrors;
        });
    }, []);
    // Update functions for batch numbers
    var updateBatchNumber = (0, react_2.useCallback)(function (batchNumber) {
        setSelectedBatchNumbers(function (prev) {
            var newBatchNumbers = __spreadArray([], prev, true);
            newBatchNumbers[batchNumber.index] = batchNumber;
            return newBatchNumbers;
        });
    }, []);
    var addBatchNumber = (0, react_2.useCallback)(function () {
        setSelectedBatchNumbers(function (prev) {
            var newIndex = prev.length;
            return __spreadArray(__spreadArray([], prev, true), [{ index: newIndex, id: "", quantity: 1 }], false);
        });
    }, []);
    var removeBatchNumber = (0, react_2.useCallback)(function (indexToRemove) {
        setSelectedBatchNumbers(function (prev) {
            var filtered = prev.filter(function (_, i) { return i !== indexToRemove; });
            return filtered.map(function (item, i) { return (__assign(__assign({}, item), { index: i })); });
        });
        setBatchErrors(function (prev) {
            var newErrors = __assign({}, prev);
            delete newErrors[indexToRemove];
            var reindexedErrors = {};
            Object.entries(newErrors).forEach(function (_a) {
                var key = _a[0], value = _a[1];
                var keyNum = parseInt(key);
                if (keyNum > indexToRemove) {
                    reindexedErrors[keyNum - 1] = value;
                }
                else {
                    reindexedErrors[keyNum] = value;
                }
            });
            return reindexedErrors;
        });
    }, []);
    var validateBatchInput = (0, react_2.useCallback)(function (value, index) {
        if (!value) {
            setBatchErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[index] = "Batch number is required", _a)));
            });
            return false;
        }
        var duplicateIndices = selectedBatchNumbers
            .map(function (bn, i) { return (bn.id === value && i !== index ? i : -1); })
            .filter(function (i) { return i !== -1; });
        if (duplicateIndices.length > 0) {
            setBatchErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[index] = "Duplicate batch number", _a)));
            });
            return false;
        }
        var batchOption = batchOptions.find(function (opt) { return opt.value === value; });
        if (!batchOption) {
            setBatchErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[index] = "Batch number is not available", _a)));
            });
            return false;
        }
        var currentBatchNumber = selectedBatchNumbers[index];
        if (currentBatchNumber.quantity > batchOption.availableQuantity) {
            var remainingQuantity_1 = currentBatchNumber.quantity - batchOption.availableQuantity;
            updateBatchNumber(__assign(__assign({}, currentBatchNumber), { id: value, quantity: batchOption.availableQuantity }));
            setSelectedBatchNumbers(function (prev) {
                var newIndex = prev.length;
                return __spreadArray(__spreadArray([], prev, true), [
                    { index: newIndex, id: "", quantity: remainingQuantity_1 }
                ], false);
            });
        }
        setBatchErrors(function (prev) {
            var newErrors = __assign({}, prev);
            delete newErrors[index];
            return newErrors;
        });
        return true;
    }, [selectedBatchNumbers, batchOptions, updateBatchNumber]);
    var toggleTrackedInput = (0, react_2.useCallback)(function (id) {
        setSelectedTrackedInputs(function (prev) {
            if (prev.includes(id)) {
                return prev.filter(function (item) { return item !== id; });
            }
            return __spreadArray(__spreadArray([], prev, true), [id], false);
        });
    }, []);
    // Submit handlers
    var handleSubmitSerial = (0, react_2.useCallback)(function () {
        if (!parentId) {
            react_1.toast.error("Parent tracking ID is required for serial tracked items.");
            return;
        }
        // Either material.id or (operationId + selectedItemId) must be provided
        if (!(material === null || material === void 0 ? void 0 : material.id) && !selectedItemId) {
            react_1.toast.error("Please select an item to issue.");
            return;
        }
        var hasErrors = false;
        var newErrors = {};
        selectedSerialNumbers.forEach(function (sn) {
            var error = validateSerialNumber(sn.id, sn.index);
            if (error) {
                newErrors[sn.index] = error;
                hasErrors = true;
            }
        });
        setSerialErrors(newErrors);
        if (!hasErrors) {
            var overrideFields = hasExpiredSelection && expiryOverrideReason.trim().length > 0
                ? {
                    overrideExpired: true,
                    overrideReason: expiryOverrideReason.trim()
                }
                : {};
            var payload = (material === null || material === void 0 ? void 0 : material.id)
                ? __assign({ materialId: material.id, parentTrackedEntityId: parentId, children: selectedSerialNumbers.map(function (sn) { return ({
                        trackedEntityId: sn.id,
                        quantity: 1
                    }); }) }, overrideFields) : __assign({ jobOperationId: operationId, itemId: selectedItemId, parentTrackedEntityId: parentId, children: selectedSerialNumbers.map(function (sn) { return ({
                    trackedEntityId: sn.id,
                    quantity: 1
                }); }) }, overrideFields);
            fetcher.submit(JSON.stringify(payload), {
                method: "post",
                action: path_1.path.to.issueTrackedEntity,
                encType: "application/json"
            });
        }
    }, [
        selectedSerialNumbers,
        validateSerialNumber,
        parentId,
        material === null || material === void 0 ? void 0 : material.id,
        operationId,
        selectedItemId,
        fetcher,
        hasExpiredSelection,
        expiryOverrideReason
    ]);
    var handleSubmitBatch = (0, react_2.useCallback)(function () {
        if (!parentId) {
            react_1.toast.error("Parent tracking ID is required for batch tracked items.");
            return;
        }
        // Either material.id or (operationId + selectedItemId) must be provided
        if (!(material === null || material === void 0 ? void 0 : material.id) && !selectedItemId) {
            react_1.toast.error("Please select an item to issue.");
            return;
        }
        var hasErrors = false;
        var newErrors = {};
        selectedBatchNumbers.forEach(function (bn) {
            var error = validateBatchNumber(bn.id, bn.quantity, bn.index);
            if (error) {
                newErrors[bn.index] = error;
                hasErrors = true;
            }
        });
        setBatchErrors(newErrors);
        if (!hasErrors) {
            var overrideFields = hasExpiredSelection && expiryOverrideReason.trim().length > 0
                ? {
                    overrideExpired: true,
                    overrideReason: expiryOverrideReason.trim()
                }
                : {};
            var payload = (material === null || material === void 0 ? void 0 : material.id)
                ? __assign({ materialId: material.id, parentTrackedEntityId: parentId, children: selectedBatchNumbers.map(function (bn) { return ({
                        trackedEntityId: bn.id,
                        quantity: bn.quantity
                    }); }) }, overrideFields) : __assign({ jobOperationId: operationId, itemId: selectedItemId, parentTrackedEntityId: parentId, children: selectedBatchNumbers.map(function (bn) { return ({
                    trackedEntityId: bn.id,
                    quantity: bn.quantity
                }); }) }, overrideFields);
            fetcher.submit(JSON.stringify(payload), {
                method: "post",
                action: path_1.path.to.issueTrackedEntity,
                encType: "application/json"
            });
        }
    }, [
        selectedBatchNumbers,
        validateBatchNumber,
        parentId,
        material === null || material === void 0 ? void 0 : material.id,
        operationId,
        selectedItemId,
        fetcher,
        hasExpiredSelection,
        expiryOverrideReason
    ]);
    var handleUnconsumeSerial = (0, react_2.useCallback)(function () {
        if (selectedTrackedInputs.length === 0) {
            react_1.toast.error("Please select at least one item to unconsume");
            return;
        }
        if (!(material === null || material === void 0 ? void 0 : material.id) || !parentId) {
            react_1.toast.error("Material and parent ID are required to unconsume");
            return;
        }
        var payload = {
            materialId: material.id,
            parentTrackedEntityId: parentId,
            children: selectedTrackedInputs.map(function (id) { return ({
                trackedEntityId: id,
                quantity: 1
            }); })
        };
        unconsumeFetcher.submit(JSON.stringify(payload), {
            method: "post",
            action: path_1.path.to.unconsume,
            encType: "application/json"
        });
    }, [selectedTrackedInputs, material === null || material === void 0 ? void 0 : material.id, parentId, unconsumeFetcher]);
    var handleUnconsumeBatch = (0, react_2.useCallback)(function () {
        var _a, _b;
        if (!unconsumedBatch) {
            react_1.toast.error("Please select a batch to unconsume");
            return;
        }
        if (!(material === null || material === void 0 ? void 0 : material.id) || !parentId) {
            react_1.toast.error("Material and parent ID are required to unconsume");
            return;
        }
        var payload = {
            materialId: material.id,
            parentTrackedEntityId: parentId,
            children: [
                {
                    trackedEntityId: unconsumedBatch,
                    quantity: (_b = (_a = trackedInputs.find(function (input) { return input.id === unconsumedBatch; })) === null || _a === void 0 ? void 0 : _a.quantity) !== null && _b !== void 0 ? _b : 0
                }
            ]
        };
        unconsumeFetcher.submit(JSON.stringify(payload), {
            method: "post",
            action: path_1.path.to.unconsume,
            encType: "application/json"
        });
    }, [
        unconsumedBatch,
        material === null || material === void 0 ? void 0 : material.id,
        parentId,
        trackedInputs,
        unconsumeFetcher
    ]);
    // Handle fetcher responses
    var processedFetcherData = (0, react_2.useRef)(null);
    (0, react_2.useEffect)(function () {
        if (fetcher.state === "idle" &&
            fetcher.data &&
            fetcher.data !== processedFetcherData.current) {
            processedFetcherData.current = fetcher.data;
            if (fetcher.data.success) {
                var warning = fetcher.data.warning;
                if (warning)
                    react_1.toast.warning(warning);
                if (fetcher.data.splitEntities &&
                    fetcher.data.splitEntities.length > 0) {
                    setSplitEntitiesResult(fetcher.data.splitEntities.map(function (entity) { return ({
                        newId: entity.newId,
                        originalId: entity.originalId,
                        readableId: entity.readableId,
                        quantity: entity.quantity
                    }); }));
                    react_1.toast.success(fetcher.data.message);
                }
                else {
                    onClose();
                    if (fetcher.data.message) {
                        react_1.toast.success(fetcher.data.message);
                    }
                }
            }
            else if (fetcher.data.message) {
                react_1.toast.error(fetcher.data.message);
            }
        }
    }, [fetcher.state, fetcher.data, onClose]);
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if ((_a = unconsumeFetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
            if (unconsumeFetcher.data.message) {
                react_1.toast.success(unconsumeFetcher.data.message);
            }
        }
        else if ((_b = unconsumeFetcher.data) === null || _b === void 0 ? void 0 : _b.message) {
            react_1.toast.error(unconsumeFetcher.data.message);
        }
    }, [unconsumeFetcher.data, onClose]);
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = inventoryFetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onClose();
        }
    }, [inventoryFetcher.data, onClose]);
    // Determine what to render based on state
    var showItemSelector = !(material === null || material === void 0 ? void 0 : material.itemId);
    var showContent = (material === null || material === void 0 ? void 0 : material.itemId) || itemDetails;
    var hasTrackedInputs = trackedInputs.length > 0;
    return (<>
      <react_1.Modal open onOpenChange={onClose}>
        <react_1.ModalContent>
          <react_1.ModalHeader>
            <react_1.ModalTitle>
              {(_d = (_c = material === null || material === void 0 ? void 0 : material.description) !== null && _c !== void 0 ? _c : (0, utils_1.getItemReadableId)(items, selectedItemId)) !== null && _d !== void 0 ? _d : "Issue Material"}
            </react_1.ModalTitle>
            {!material && (<react_1.ModalDescription>
                Select an item and specify the quantity to issue
              </react_1.ModalDescription>)}
          </react_1.ModalHeader>

          {splitEntitiesResult.length > 0 ? (
        // Show split entities result
        <react_1.ModalBody>
              <react_1.Alert variant="default" className="mb-4">
                <lu_1.LuGitBranch className="mr-2"/>
                <react_1.AlertTitle>Batch Split Occurred</react_1.AlertTitle>
                <react_1.AlertDescription>
                  <div className="flex flex-col gap-2">
                    <p>A new batch entity was created from a split:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {splitEntitiesResult.map(function (split) {
                var _a, _b;
                return (<li key={split.newId} className="flex flex-col text-sm">
                          <span className="text-md font-semibold">
                            {(_b = (_a = split.readableId) !== null && _a !== void 0 ? _a : (0, utils_1.getItemReadableId)(items, material === null || material === void 0 ? void 0 : material.itemId)) !== null && _b !== void 0 ? _b : "Material"}
                          </span>
                          <div className="flex gap-2 items-center">
                            <span className="font-mono flex gap-1 items-center">
                              <lu_1.LuQrCode />
                              {split.newId}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground flex gap-1 items-center truncate">
                              <lu_1.LuScale />
                              {numberFormatter.format(split.quantity)}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <components_1.PrintButton sourceDocument="Split" sourceDocumentId={split.newId} locationId={locationId} context="workCenter" workCenterId={workCenterId} fileRoutes={{
                        pdf: path_1.path.to.file.trackedEntityLabelPdf,
                        zpl: path_1.path.to.file.trackedEntityLabelZpl
                    }}/>
                            <react_1.Button variant="secondary" leftIcon={<lu_1.LuArrowRightLeft />} onClick={function () {
                        setTrackedEntity(split.newId);
                        convertDisclosure.onOpen();
                    }}>
                              Convert
                            </react_1.Button>
                            <react_1.Button variant="secondary" leftIcon={<lu_1.LuTrash />} onClick={function () {
                        setTrackedEntity(split.newId);
                        scrapDisclosure.onOpen();
                    }}>
                              Scrap
                            </react_1.Button>
                          </div>
                        </li>);
            })}
                    </ul>
                  </div>
                </react_1.AlertDescription>
              </react_1.Alert>
            </react_1.ModalBody>) : trackingType === "Inventory" || trackingType === null ? (
        // Inventory item - use ValidatedForm
        <form_1.ValidatedForm method="post" action={path_1.path.to.issue} onSuccess={onClose} validator={models_1.issueValidator} defaultValues={{
                materialId: (_e = material === null || material === void 0 ? void 0 : material.id) !== null && _e !== void 0 ? _e : "",
                jobOperationId: operationId,
                itemId: selectedItemId,
                // Default to the remaining qty, but never submit zero/negative
                // — that's how this modal ends up posting an invalid form and
                // the server bouncing it silently when a material has been
                // fully issued already.
                quantity: Math.max(1, ((_f = material === null || material === void 0 ? void 0 : material.estimatedQuantity) !== null && _f !== void 0 ? _f : 0) -
                    ((_g = material === null || material === void 0 ? void 0 : material.quantityIssued) !== null && _g !== void 0 ? _g : 0)),
                adjustmentType: "Negative Adjmt."
            }} fetcher={inventoryFetcher}>
              <react_1.ModalBody>
                <form_1.Hidden name="jobOperationId"/>
                <form_1.Hidden name="materialId"/>
                {(material === null || material === void 0 ? void 0 : material.id) && (<form_1.Hidden name="adjustmentType" value="Negative Adjmt."/>)}
                <div className="flex flex-col gap-4">
                  {showItemSelector && (<div>
                      <label className="block text-sm font-medium mb-1">
                        Item
                      </label>
                      <react_1.Combobox placeholder={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Select an item..."], ["Select an item..."])))} value={selectedItemId} onChange={function (value) {
                    handleItemChange(value);
                }} options={itemOptions}/>
                      <input type="hidden" name="itemId" value={selectedItemId}/>
                    </div>)}
                  {(material === null || material === void 0 ? void 0 : material.id) && (<form_1.Hidden name="itemId" value={selectedItemId}/>)}

                  {isLoadingItem && (<div className="text-sm text-muted-foreground">
                      Loading item details...
                    </div>)}

                  {showContent && trackingType === "Inventory" && (<>
                      {!(material === null || material === void 0 ? void 0 : material.id) && (<div>
                          <label className="block text-sm font-medium mb-1">
                            Adjustment Type
                          </label>
                          <react_1.Select name="adjustmentType" defaultValue="Negative Adjmt.">
                            <react_1.SelectTrigger>
                              <react_1.SelectValue />
                            </react_1.SelectTrigger>
                            <react_1.SelectContent>
                              <react_1.SelectItem value="Positive Adjmt.">
                                Add to Inventory
                              </react_1.SelectItem>
                              <react_1.SelectItem value="Negative Adjmt.">
                                Pull from Inventory
                              </react_1.SelectItem>
                            </react_1.SelectContent>
                          </react_1.Select>
                        </div>)}
                      {/*
                  Use the form-aware `<Number>` (FormNumberInput) so
                  `name="quantity"` lands on react-aria's NumberField
                  and a hidden form input is rendered with the numeric
                  value. The previous inline NumberField put `name` on
                  NumberInput (the display slot), which react-aria
                  ignores — the form submitted with no `quantity` key,
                  the server's zod schema rejected it, and the action
                  returned a 400 the modal silently swallowed.
                */}
                      <form_1.Number name="quantity" label="Quantity" minValue={0.01}/>
                    </>)}
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button variant="secondary" size="lg" onClick={onClose}>
                  Cancel
                </react_1.Button>
                <react_1.Button type="submit" variant="primary" size="lg" isLoading={inventoryFetcher.state !== "idle"} isDisabled={inventoryFetcher.state !== "idle" ||
                !selectedItemId ||
                isLoadingItem}>
                  Issue
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>) : (
        // Tracked items (Serial or Batch)
        <>
              <react_1.ModalBody>
                <div className="flex flex-col gap-4">
                  {showItemSelector && (<div>
                      <label className="block text-sm font-medium mb-1">
                        Item
                      </label>
                      <react_1.Combobox placeholder={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Select an item..."], ["Select an item..."])))} value={selectedItemId} onChange={handleItemChange} options={itemOptions}/>
                    </div>)}

                  {isLoadingItem && (<div className="text-sm text-muted-foreground">
                      Loading item details...
                    </div>)}

                  {showContent && trackingType === "Serial" && (<react_1.Tabs value={activeTab} onValueChange={setActiveTab}>
                      <react_1.TabsList className={(0, react_1.cn)("grid w-full grid-cols-2 mb-4", hasTrackedInputs && "grid-cols-3")}>
                        <react_1.TabsTrigger value="scan">
                          <lu_1.LuQrCode className="mr-2"/>
                          Scan
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="select">
                          <lu_1.LuList className="mr-2"/>
                          Select
                        </react_1.TabsTrigger>
                        {hasTrackedInputs && (<react_1.TabsTrigger value="unconsume">
                            <lu_1.LuUndo2 className="mr-2"/>
                            Unconsume
                          </react_1.TabsTrigger>)}
                      </react_1.TabsList>

                      <react_1.TabsContent value="scan">
                        <div className="flex flex-col gap-4">
                          {selectedSerialNumbers.map(function (sn, index) { return (<div key={"".concat(index, "-serial-scan")} className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <react_1.InputGroup>
                                    <react_1.Input placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Serial Number ", ""], ["Serial Number ", ""])), index + 1)} value={sn.id} onChange={function (e) {
                        var newValue = e.target.value;
                        var newSerialNumbers = __spreadArray([], selectedSerialNumbers, true);
                        newSerialNumbers[index] = {
                            index: index,
                            id: newValue
                        };
                        setSelectedSerialNumbers(newSerialNumbers);
                    }} onBlur={function (e) {
                        var newValue = e.target.value;
                        var error = validateSerialNumber(newValue, index);
                        setSerialErrors(function (prev) {
                            var newErrors = __assign({}, prev);
                            if (error) {
                                newErrors[index] = error;
                            }
                            else {
                                delete newErrors[index];
                            }
                            return newErrors;
                        });
                        if (!error) {
                            updateSerialNumber({
                                index: index,
                                id: newValue
                            });
                        }
                        else {
                            var newSerialNumbers = __spreadArray([], selectedSerialNumbers, true);
                            newSerialNumbers[index] = {
                                index: index,
                                id: ""
                            };
                            setSelectedSerialNumbers(newSerialNumbers);
                        }
                    }} className={(0, react_1.cn)(serialErrors[index] &&
                        "border-destructive")}/>
                                    <react_1.InputRightElement className="pl-2">
                                      {!serialErrors[index] && sn.id ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
                                    </react_1.InputRightElement>
                                  </react_1.InputGroup>
                                </div>
                                {index > 0 && (<react_1.IconButton aria-label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Remove Serial Number"], ["Remove Serial Number"])))} icon={<lu_1.LuX />} variant="ghost" onClick={function () { return removeSerialNumber(index); }} className="flex-shrink-0"/>)}
                              </div>
                              {serialErrors[index] && (<span className="text-xs text-destructive">
                                  {serialErrors[index]}
                                </span>)}
                            </div>); })}
                          <div>
                            <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={addSerialNumber}>
                              Add
                            </react_1.Button>
                          </div>
                        </div>
                      </react_1.TabsContent>

                      <react_1.TabsContent value="select">
                        <div className="flex flex-col gap-4">
                          {selectedSerialNumbers.map(function (sn, index) { return (<div key={"".concat(index, "-serial-select")} className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <react_1.Combobox placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Select Serial Number ", ""], ["Select Serial Number ", ""])), index + 1)} value={sn.id} onChange={function (value) {
                        var newSerialNumbers = __spreadArray([], selectedSerialNumbers, true);
                        newSerialNumbers[index] = {
                            index: index,
                            id: value
                        };
                        setSelectedSerialNumbers(newSerialNumbers);
                        var error = validateSerialNumber(value, index);
                        setSerialErrors(function (prev) {
                            var newErrors = __assign({}, prev);
                            if (error) {
                                newErrors[index] = error;
                            }
                            else {
                                delete newErrors[index];
                            }
                            return newErrors;
                        });
                    }} options={serialOptions}/>
                                </div>
                                {index > 0 && (<react_1.IconButton aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Remove Serial Number"], ["Remove Serial Number"])))} icon={<lu_1.LuX />} variant="ghost" onClick={function () { return removeSerialNumber(index); }} className="flex-shrink-0"/>)}
                              </div>
                              {serialErrors[index] && (<span className="text-xs text-destructive">
                                  {serialErrors[index]}
                                </span>)}
                            </div>); })}
                          <div>
                            <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={addSerialNumber}>
                              Add
                            </react_1.Button>
                          </div>
                        </div>
                      </react_1.TabsContent>

                      {hasTrackedInputs && (<react_1.TabsContent value="unconsume">
                          <div className="flex flex-col gap-4">
                            {trackedInputs.map(function (input) { return (<div key={input.id} className="flex items-center gap-3 p-2 border rounded-md">
                                <react_1.Checkbox id={"unconsume-".concat(input.id)} checked={selectedTrackedInputs.includes(input.id)} onCheckedChange={function () {
                            return toggleTrackedInput(input.id);
                        }}/>
                                <label htmlFor={"unconsume-".concat(input.id)} className="flex-1 cursor-pointer">
                                  <div className="font-medium text-sm">
                                    {input.id}
                                  </div>
                                  {input.readableId && (<div className="text-xs text-muted-foreground">
                                      Serial: {input.readableId}
                                    </div>)}
                                </label>
                              </div>); })}
                            {trackedInputs.length === 0 && (<react_1.Alert variant="warning">
                                <react_1.AlertTitle>No consumed materials</react_1.AlertTitle>
                                <react_1.AlertDescription>
                                  There are no consumed materials to unconsume.
                                </react_1.AlertDescription>
                              </react_1.Alert>)}
                          </div>
                        </react_1.TabsContent>)}
                    </react_1.Tabs>)}

                  {showContent && trackingType === "Batch" && (<react_1.Tabs value={activeTab} onValueChange={setActiveTab}>
                      <react_1.TabsList className={(0, react_1.cn)("grid w-full grid-cols-2 mb-4", hasTrackedInputs && "grid-cols-3")}>
                        <react_1.TabsTrigger value="scan">
                          <lu_1.LuQrCode className="mr-2"/>
                          Scan
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="select">
                          <lu_1.LuList className="mr-2"/>
                          Select
                        </react_1.TabsTrigger>
                        {hasTrackedInputs && (<react_1.TabsTrigger value="unconsume">
                            <lu_1.LuUndo2 className="mr-2"/>
                            Unconsume
                          </react_1.TabsTrigger>)}
                      </react_1.TabsList>

                      <react_1.TabsContent value="scan">
                        <div className="flex flex-col gap-4">
                          {selectedBatchNumbers.map(function (batch, index) {
                    var _a, _b;
                    return (<div key={index} className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <react_1.InputGroup>
                                    <react_1.Input value={batch.id} onChange={function (e) {
                            var newValue = e.target.value;
                            updateBatchNumber(__assign(__assign({}, batch), { id: newValue }));
                        }} onBlur={function (e) {
                            validateBatchInput(e.target.value, index);
                        }} placeholder={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Scan batch number"], ["Scan batch number"])))}/>
                                    <react_1.InputRightElement className="pl-2">
                                      {!batchErrors[index] && batch.id ? (<lu_1.LuCheck className="text-emerald-500"/>) : (<lu_1.LuQrCode />)}
                                    </react_1.InputRightElement>
                                  </react_1.InputGroup>
                                </div>
                                <div className="w-24">
                                  <react_1.NumberField id={"quantity-".concat(index)} value={batch.quantity} onChange={function (value) {
                            return updateBatchNumber(__assign(__assign({}, batch), { quantity: value }));
                        }} minValue={0.01} maxValue={(_b = (_a = batchOptions.find(function (o) { return o.value === batch.id; })) === null || _a === void 0 ? void 0 : _a.availableQuantity) !== null && _b !== void 0 ? _b : 999999}>
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
                                </div>
                                {index > 0 && (<react_1.IconButton aria-label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Remove Batch Number"], ["Remove Batch Number"])))} icon={<lu_1.LuX />} variant="ghost" onClick={function () { return removeBatchNumber(index); }}/>)}
                              </div>
                              {batchErrors[index] && (<span className="text-xs text-destructive">
                                  {batchErrors[index]}
                                </span>)}
                            </div>);
                })}
                          <div>
                            <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={addBatchNumber}>
                              Add
                            </react_1.Button>
                          </div>
                        </div>
                      </react_1.TabsContent>

                      <react_1.TabsContent value="select">
                        <div className="flex flex-col gap-4">
                          {selectedBatchNumbers.map(function (batch, index) {
                    var _a, _b;
                    return (<div key={index} className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <react_1.Combobox value={batch.id} onChange={function (value) {
                            updateBatchNumber(__assign(__assign({}, batch), { id: value }));
                            validateBatchInput(value, index);
                        }} options={batchOptions} placeholder={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Select batch number"], ["Select batch number"])))}/>
                                </div>
                                <div className="w-24">
                                  <react_1.NumberField value={batch.quantity} onChange={function (value) {
                            return updateBatchNumber(__assign(__assign({}, batch), { quantity: value }));
                        }} minValue={0.01} maxValue={(_b = (_a = batchOptions.find(function (o) { return o.value === batch.id; })) === null || _a === void 0 ? void 0 : _a.availableQuantity) !== null && _b !== void 0 ? _b : 999999}>
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
                                </div>
                                {index > 0 && (<react_1.IconButton aria-label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Remove Batch Number"], ["Remove Batch Number"])))} icon={<lu_1.LuX />} variant="ghost" onClick={function () { return removeBatchNumber(index); }}/>)}
                              </div>
                              {batchErrors[index] && (<span className="text-xs text-destructive">
                                  {batchErrors[index]}
                                </span>)}
                            </div>);
                })}
                          <div>
                            <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuCirclePlus />} onClick={addBatchNumber}>
                              Add Batch
                            </react_1.Button>
                          </div>
                        </div>
                      </react_1.TabsContent>

                      {hasTrackedInputs && (<react_1.TabsContent value="unconsume">
                          <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                              <div className="flex-1">
                                <react_1.Combobox value={unconsumedBatch} onChange={setUnconsumedBatch} options={unconsumeOptions} placeholder={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Select batch to unconsume"], ["Select batch to unconsume"])))}/>
                              </div>
                              {unconsumedBatch && (<div className="w-24">
                                  <react_1.Input isReadOnly value={(_j = (_h = trackedInputs
                            .find(function (input) {
                            return input.id === unconsumedBatch;
                        })) === null || _h === void 0 ? void 0 : _h.quantity.toString()) !== null && _j !== void 0 ? _j : "0"}/>
                                </div>)}
                            </div>
                            <div className="h-8"/>
                          </div>
                        </react_1.TabsContent>)}
                    </react_1.Tabs>)}
                  {hasExpiredSelection && activeTab !== "unconsume" && (<react_1.Alert variant={expiredEntityPolicy === "Warn"
                    ? "warning"
                    : "destructive"}>
                      <react_1.AlertTitle>
                        {expiredEntityPolicy === "Warn"
                    ? "Expired stock selected"
                    : "Override required"}
                      </react_1.AlertTitle>
                      <react_1.AlertDescription>
                        <div className="flex flex-col gap-2">
                          <p>
                            {expiredSerialIds.length + expiredBatchIds.length}{" "}
                            of the selected{" "}
                            {trackingType === "Serial" ? "serials" : "batches"}{" "}
                            are past their expiration date.
                            {expiredEntityPolicy === "Warn"
                    ? " The issue will go through with a warning."
                    : " Enter a reason below to record the override."}
                          </p>
                          {expiredEntityPolicy === "BlockWithOverride" && (<textarea className="border rounded-md p-2 text-sm bg-background" placeholder={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Reason for issuing expired stock"], ["Reason for issuing expired stock"])))} value={expiryOverrideReason} onChange={function (e) {
                        return setExpiryOverrideReason(e.target.value);
                    }} rows={2}/>)}
                        </div>
                      </react_1.AlertDescription>
                    </react_1.Alert>)}
                </div>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                {splitEntitiesResult.length > 0 ? (<react_1.Button variant="primary" size="lg" onClick={onClose}>
                    Close
                  </react_1.Button>) : (<>
                    <react_1.Button variant="secondary" size="lg" onClick={onClose}>
                      Cancel
                    </react_1.Button>
                    {activeTab === "unconsume" ? (<react_1.Button variant="destructive" size="lg" onClick={trackingType === "Serial"
                        ? handleUnconsumeSerial
                        : handleUnconsumeBatch} isLoading={unconsumeFetcher.state !== "idle"} isDisabled={unconsumeFetcher.state !== "idle" ||
                        (trackingType === "Serial"
                            ? selectedTrackedInputs.length === 0
                            : !unconsumedBatch)}>
                        Unconsume
                      </react_1.Button>) : (<react_1.Button variant="primary" size="lg" onClick={trackingType === "Serial"
                        ? handleSubmitSerial
                        : handleSubmitBatch} isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle" ||
                        !selectedItemId ||
                        isLoadingItem}>
                        Issue
                      </react_1.Button>)}
                  </>)}
              </react_1.ModalFooter>
            </>)}

          {/* Footer for split entities result */}
          {splitEntitiesResult.length > 0 && (<react_1.ModalFooter>
              <react_1.Button variant="primary" size="lg" onClick={onClose}>
                Close
              </react_1.Button>
            </react_1.ModalFooter>)}
        </react_1.ModalContent>
      </react_1.Modal>

      {/* Sub-modals for batch splitting */}
      {convertDisclosure.isOpen && (<ConvertSplitModal trackedEntity={trackedEntity} itemType={(_k = material === null || material === void 0 ? void 0 : material.itemType) !== null && _k !== void 0 ? _k : "Part"} onCancel={function () {
                convertDisclosure.onClose();
                setTrackedEntity(null);
            }} onSuccess={function (convertedEntity) {
                setSplitEntitiesResult(function (prev) {
                    return prev.map(function (entity) {
                        return entity.newId === convertedEntity.trackedEntityId
                            ? __assign(__assign({}, entity), { readableId: convertedEntity.readableId, quantity: convertedEntity.quantity }) : entity;
                    });
                });
                convertDisclosure.onClose();
                setTrackedEntity(null);
            }}/>)}
      {scrapDisclosure.isOpen && (<ScrapSplitModal materialId={material === null || material === void 0 ? void 0 : material.id} parentTrackedEntityId={parentId !== null && parentId !== void 0 ? parentId : ""} trackedEntity={trackedEntity} onCancel={function () {
                scrapDisclosure.onClose();
                setTrackedEntity(null);
            }} onSuccess={function () {
                scrapDisclosure.onClose();
                setTrackedEntity(null);
                onClose();
            }}/>)}
    </>);
}
// Sub-modal for converting split batch entities
function ConvertSplitModal(_a) {
    var trackedEntity = _a.trackedEntity, itemType = _a.itemType, onCancel = _a.onCancel, onSuccess = _a.onSuccess;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) && fetcher.data.convertedEntity) {
            react_1.toast.success("Entity converted successfully");
            onSuccess(fetcher.data.convertedEntity);
        }
        else if (((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success) === false) {
            react_1.toast.error(fetcher.data.message || "Failed to convert entity");
        }
    }, [fetcher.data, onSuccess]);
    if (!trackedEntity)
        return null;
    return (<react_1.Modal open onOpenChange={onCancel}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            Convert to New {itemType === "Material" ? "Size" : "Revision"}
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            Convert this tracked entity into a quantity of 1 of a new size.
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <form_1.ValidatedForm method="post" action={path_1.path.to.convertEntity(trackedEntity)} defaultValues={{
            trackedEntityId: trackedEntity,
            newRevision: "",
            quantity: 1
        }} validator={models_1.convertEntityValidator} fetcher={fetcher}>
          <form_1.Hidden name="trackedEntityId"/>
          <react_1.ModalBody>
            <div className="flex flex-col gap-4">
              <form_1.Input name="newRevision" label={"New ".concat(itemType === "Material" ? "Size" : "Revision")} autoFocus/>
              <form_1.Number name="quantity" label="Quantity" minValue={0.001}/>
            </div>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.Button variant="secondary" size="lg" onClick={onCancel}>
              Cancel
            </react_1.Button>
            <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit" size="lg" variant="primary">
              Convert
            </react_1.Button>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
// Sub-modal for scrapping split batch entities
function ScrapSplitModal(_a) {
    var _b;
    var materialId = _a.materialId, parentTrackedEntityId = _a.parentTrackedEntityId, trackedEntity = _a.trackedEntity, onCancel = _a.onCancel, onSuccess = _a.onSuccess;
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            onSuccess();
        }
    }, [(_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.success, onSuccess]);
    if (!trackedEntity)
        return null;
    return (<react_1.Modal open onOpenChange={onCancel}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>Are you sure you want to scrap this batch?</react_1.ModalTitle>
          <react_1.ModalDescription>
            The remaining quantity will be removed from inventory and issued to
            the job
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <react_1.ModalFooter>
          <react_1.Button variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </react_1.Button>
          <fetcher.Form method="post" action={path_1.path.to.scrapEntity(materialId, trackedEntity, parentTrackedEntityId)}>
            <react_1.Button isLoading={fetcher.state !== "idle"} isDisabled={fetcher.state !== "idle"} type="submit" size="lg" variant="destructive">
              Scrap
            </react_1.Button>
          </fetcher.Form>
        </react_1.ModalFooter>
      </react_1.ModalContent>
    </react_1.Modal>);
}
// Hook for fetching serial numbers
function useSerialNumbers(itemId) {
    var serialNumbersFetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    (0, react_2.useEffect)(function () {
        if (itemId) {
            serialNumbersFetcher.load(path_1.path.to.api.serialNumbers(itemId));
        }
    }, [itemId]);
    return { data: serialNumbersFetcher.data };
}
// Hook for fetching batch numbers
function useBatchNumbers(itemId) {
    var batchNumbersFetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        if (itemId) {
            batchNumbersFetcher.load(path_1.path.to.api.batchNumbers(itemId));
        }
    }, [itemId, batchNumbersFetcher.load]);
    return { data: batchNumbersFetcher.data };
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
