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
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var categoryLabels = {
    materialCost: "Material",
    partCost: "Part",
    toolCost: "Tool",
    consumableCost: "Consumable",
    serviceCost: "Service",
    laborCost: "Labor",
    machineCost: "Machine",
    overheadCost: "Overhead",
    outsideCost: "Outside"
};
var QuoteLinePricing = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var line = _a.line, pricesByQuantity = _a.pricesByQuantity, exchangeRate = _a.exchangeRate, getLineCosts = _a.getLineCosts;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var hasCalculatedCost = line.methodType !== "Pull from Inventory";
    var quantities = (_b = line.quantity) !== null && _b !== void 0 ? _b : [1];
    var _p = (0, react_router_1.useParams)(), quoteId = _p.quoteId, lineId = _p.lineId;
    if (!quoteId)
        throw new Error("Could not find quoteId");
    if (!lineId)
        throw new Error("Could not find lineId");
    // Consolidated state for all editable fields
    var _q = (0, react_2.useState)({
        prices: pricesByQuantity,
        unitCost: (_c = line.unitCost) !== null && _c !== void 0 ? _c : 0,
        additionalCharges: line.additionalCharges || {},
        taxPercent: (_d = line.taxPercent) !== null && _d !== void 0 ? _d : 0
    }), editableFields = _q[0], setEditableFields = _q[1];
    var _r = (0, react_2.useState)(false), showCategoryMarkups = _r[0], setShowCategoryMarkups = _r[1];
    var _s = (0, react_2.useState)(""), customMarkup = _s[0], setCustomMarkup = _s[1];
    (0, react_2.useEffect)(function () {
        setEditableFields(function (prev) {
            var _a, _b;
            return (__assign(__assign({}, prev), { prices: pricesByQuantity, unitCost: (_a = line.unitCost) !== null && _a !== void 0 ? _a : 0, additionalCharges: line.additionalCharges || {}, taxPercent: (_b = line.taxPercent) !== null && _b !== void 0 ? _b : 0 }));
        });
    }, [
        pricesByQuantity,
        line.unitCost,
        line.additionalCharges,
        line.taxPercent
    ]);
    var settings = (0, hooks_1.useSettings)();
    var defaultCategoryMarkups = (0, react_2.useMemo)(function () {
        var _a;
        var raw = sales_models_1.quoteLineCategoryMarkupsValidator.parse((_a = settings.quoteLineCategoryMarkups) !== null && _a !== void 0 ? _a : {});
        // Settings stores decimals (0.5 = 50%), but quote line markups use whole numbers (50 = 50%)
        var converted = {};
        for (var _i = 0, _b = Object.entries(raw); _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], value = _c[1];
            converted[key] = value * 100;
        }
        return converted;
    }, [settings]);
    var categoryMarkupsByQuantity = (0, react_2.useMemo)(function () {
        var _a, _b;
        var result = {};
        for (var _i = 0, quantities_1 = quantities; _i < quantities_1.length; _i++) {
            var quantity = quantities_1[_i];
            var priceMarkups = sales_models_1.quoteLineCategoryMarkupsValidator.parse((_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.categoryMarkups) !== null && _b !== void 0 ? _b : {});
            result[quantity] =
                Object.keys(priceMarkups).length > 0
                    ? priceMarkups
                    : defaultCategoryMarkups;
        }
        return result;
    }, [editableFields.prices, quantities, defaultCategoryMarkups]);
    var unitPricePrecision = (_e = line.unitPricePrecision) !== null && _e !== void 0 ? _e : 2;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var isEmployee = permissions.is("employee");
    var isEditable = permissions.can("update", "sales") &&
        isEmployee &&
        ["Draft"].includes((_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _f === void 0 ? void 0 : _f.status) !== null && _g !== void 0 ? _g : "");
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error);
        }
    }, [fetcher.data]);
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _t = (0, hooks_1.useUser)(), userId = _t.id, company = _t.company;
    var baseCurrency = (_h = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _h !== void 0 ? _h : "USD";
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var unitPriceFormatter = (0, hooks_1.useCurrencyFormatter)({
        currency: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _j === void 0 ? void 0 : _j.currencyCode) !== null && _k !== void 0 ? _k : baseCurrency,
        maximumFractionDigits: unitPricePrecision
    });
    var presentationCurrencyFormatter = (0, hooks_1.useCurrencyFormatter)({
        currency: (_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _l === void 0 ? void 0 : _l.currencyCode) !== null && _m !== void 0 ? _m : baseCurrency,
        maximumFractionDigits: unitPricePrecision
    });
    var additionalCharges = (0, react_2.useMemo)(function () {
        var parsedAdditionalCharges = sales_models_1.quoteLineAdditionalChargesValidator.safeParse(editableFields.additionalCharges);
        return parsedAdditionalCharges.success ? parsedAdditionalCharges.data : {};
    }, [editableFields.additionalCharges]);
    var additionalChargesByQuantity = quantities.map(function (quantity) {
        var charges = Object.values(additionalCharges).reduce(function (acc, charge) {
            var _a, _b;
            var amount = (_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0;
            return acc + amount;
        }, 0);
        return charges;
    });
    var taxableAdditionalChargesByQuantity = quantities.map(function (quantity) {
        return Object.values(additionalCharges).reduce(function (acc, charge) {
            var _a, _b;
            if (charge.taxable === false)
                return acc;
            return acc + ((_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0);
        }, 0);
    });
    var onUpdateChargeDescription = (0, react_2.useCallback)(function (chargeId, description) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCharges, costUpdate;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    updatedCharges = __assign(__assign({}, additionalCharges), (_a = {}, _a[chargeId] = __assign(__assign({}, additionalCharges[chargeId]), { description: description }), _a));
                    setEditableFields(function (prev) {
                        return __assign(__assign({}, prev), { additionalCharges: updatedCharges });
                    });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteLine").update({
                            additionalCharges: updatedCharges
                        }).eq("id", lineId))];
                case 1:
                    costUpdate = _b.sent();
                    if (costUpdate === null || costUpdate === void 0 ? void 0 : costUpdate.error) {
                        console.error(costUpdate.error);
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to update quote line"], ["Failed to update quote line"]))));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [additionalCharges, lineId, carbon, t]);
    var onUpdateChargeAmount = (0, react_2.useCallback)(function (chargeId, quantity, amount) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCharges, costUpdate;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    updatedCharges = __assign(__assign({}, additionalCharges), (_a = {}, _a[chargeId] = __assign(__assign({}, additionalCharges[chargeId]), { amounts: __assign(__assign({}, additionalCharges[chargeId].amounts), (_b = {}, _b[quantity] = amount, _b)) }), _a));
                    setEditableFields(function (prev) { return (__assign(__assign({}, prev), { additionalCharges: updatedCharges })); });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteLine").update({
                            additionalCharges: updatedCharges
                        }).eq("id", lineId))];
                case 1:
                    costUpdate = _c.sent();
                    if (costUpdate === null || costUpdate === void 0 ? void 0 : costUpdate.error) {
                        console.error(costUpdate.error);
                        react_1.toast.error("Failed to update quote line");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [additionalCharges, carbon, lineId]);
    var onUpdateChargeTaxable = (0, react_2.useCallback)(function (chargeId, taxable) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCharges, costUpdate;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    updatedCharges = __assign(__assign({}, additionalCharges), (_a = {}, _a[chargeId] = __assign(__assign({}, additionalCharges[chargeId]), { taxable: taxable }), _a));
                    setEditableFields(function (prev) { return (__assign(__assign({}, prev), { additionalCharges: updatedCharges })); });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteLine").update({ additionalCharges: updatedCharges }).eq("id", lineId))];
                case 1:
                    costUpdate = _b.sent();
                    if (costUpdate === null || costUpdate === void 0 ? void 0 : costUpdate.error) {
                        console.error(costUpdate.error);
                        react_1.toast.error("Failed to update quote line");
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [additionalCharges, lineId, carbon]);
    var costsByQuantity = quantities.map(function (quantity) {
        var costs = getLineCosts(quantity);
        return {
            materialCost: costs.materialCost / quantity,
            partCost: costs.partCost / quantity,
            toolCost: costs.toolCost / quantity,
            consumableCost: costs.consumableCost / quantity,
            serviceCost: costs.serviceCost / quantity,
            laborCost: costs.laborCost / quantity,
            machineCost: costs.machineCost / quantity,
            overheadCost: costs.overheadCost / quantity,
            outsideCost: costs.outsideCost / quantity
        };
    });
    var unitCostsByQuantity = hasCalculatedCost
        ? costsByQuantity.map(function (costs) {
            return Object.values(costs).reduce(function (sum, v) { return sum + v; }, 0);
        })
        : quantities.map(function () { return editableFields.unitCost; });
    var computeUnitPriceFromMarkups = (0, react_2.useCallback)(function (categoryCosts, markups) {
        return sales_models_1.costCategoryKeys.reduce(function (sum, key) {
            var _a, _b;
            var cost = (_a = categoryCosts[key]) !== null && _a !== void 0 ? _a : 0;
            var markup = (_b = markups[key]) !== null && _b !== void 0 ? _b : 0;
            return sum + cost * (1 + markup / 100);
        }, 0);
    }, []);
    var visibleCategories = sales_models_1.costCategoryKeys.filter(function (key) {
        return costsByQuantity.some(function (costs) { return costs[key] > 0; });
    });
    var netPricesByQuantity = quantities.map(function (quantity, index) {
        var _a, _b, _c, _d;
        var price = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.unitPrice) !== null && _b !== void 0 ? _b : 0;
        var discount = (_d = (_c = editableFields.prices[quantity]) === null || _c === void 0 ? void 0 : _c.discountPercent) !== null && _d !== void 0 ? _d : 0;
        var netPrice = price * (1 - discount);
        return netPrice;
    });
    var onRecalculate = function (markup) {
        var newMarkups = {};
        for (var _i = 0, costCategoryKeys_1 = sales_models_1.costCategoryKeys; _i < costCategoryKeys_1.length; _i++) {
            var key = costCategoryKeys_1[_i];
            newMarkups[key] = markup;
        }
        var newCategoryMarkupsByQuantity = {};
        for (var _a = 0, quantities_2 = quantities; _a < quantities_2.length; _a++) {
            var quantity = quantities_2[_a];
            newCategoryMarkupsByQuantity[quantity] = newMarkups;
        }
        var unitPricesByQuantity = costsByQuantity.map(function (costs) {
            return computeUnitPriceFromMarkups(costs, newMarkups);
        });
        var formData = new FormData();
        formData.append("unitPricesByQuantity", JSON.stringify(unitPricesByQuantity));
        formData.append("quantities", JSON.stringify(quantities));
        formData.append("categoryMarkupsByQuantity", JSON.stringify(newCategoryMarkupsByQuantity));
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.quoteLineRecalculatePrice(quoteId, lineId)
        });
    };
    var onUpdatePrecision = function (precision) {
        var formData = new FormData();
        formData.append("precision", precision.toString());
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.quoteLineUpdatePrecision(quoteId, lineId)
        });
    };
    var onUpdateCost = (0, react_2.useCallback)(function (value) { return __awaiter(void 0, void 0, void 0, function () {
        var costUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!line.itemId)
                        return [2 /*return*/];
                    setEditableFields(function (prev) { return (__assign(__assign({}, prev), { unitCost: value })); });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("itemCost").update({
                            unitCost: value,
                            costIsAdjusted: true,
                            updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString()
                        }).eq("itemId", line.itemId).single())];
                case 1:
                    costUpdate = _a.sent();
                    if (costUpdate === null || costUpdate === void 0 ? void 0 : costUpdate.error) {
                        console.error(costUpdate.error);
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to update item cost"], ["Failed to update item cost"]))));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon, line.itemId, t]);
    var onUpdateCategoryMarkup = (0, react_2.useCallback)(function (category, quantity, value) { return __awaiter(void 0, void 0, void 0, function () {
        var existingMarkups, newMarkups, quantityIndex, categoryCosts, unitPrice, priceUpdate;
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    existingMarkups = (_b = categoryMarkupsByQuantity[quantity]) !== null && _b !== void 0 ? _b : {};
                    newMarkups = __assign(__assign({}, existingMarkups), (_a = {}, _a[category] = value, _a));
                    quantityIndex = quantities.indexOf(quantity);
                    categoryCosts = costsByQuantity[quantityIndex];
                    unitPrice = computeUnitPriceFromMarkups(categoryCosts, newMarkups);
                    setEditableFields(function (prev) {
                        var _a;
                        return (__assign(__assign({}, prev), { prices: __assign(__assign({}, prev.prices), (_a = {}, _a[quantity] = __assign(__assign({}, prev.prices[quantity]), { categoryMarkups: newMarkups, unitPrice: unitPrice }), _a)) }));
                    });
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteLinePrice").update({
                            categoryMarkups: newMarkups,
                            unitPrice: unitPrice
                        }).eq("quoteLineId", lineId).eq("quantity", quantity))];
                case 1:
                    priceUpdate = _c.sent();
                    if (priceUpdate === null || priceUpdate === void 0 ? void 0 : priceUpdate.error) {
                        console.error(priceUpdate.error);
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to update category markups"], ["Failed to update category markups"]))));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [
        categoryMarkupsByQuantity,
        carbon,
        lineId,
        costsByQuantity,
        quantities,
        computeUnitPriceFromMarkups,
        t
    ]);
    var onUpdatePrice = (0, react_2.useCallback)(function (key, quantity, value) { return __awaiter(void 0, void 0, void 0, function () {
        var unitPricePrecision, hasPrice, oldPrices, newPrices, roundedValue, update, insert;
        var _a, _b;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    unitPricePrecision = (_c = line.unitPricePrecision) !== null && _c !== void 0 ? _c : 2;
                    hasPrice = !!editableFields.prices[quantity];
                    oldPrices = __assign({}, editableFields.prices);
                    newPrices = __assign({}, oldPrices);
                    if (!hasPrice) {
                        newPrices[quantity] = {
                            quoteId: quoteId,
                            quoteLineId: lineId,
                            quantity: quantity,
                            leadTime: 0,
                            unitPrice: 0,
                            discountPercent: 0,
                            exchangeRate: exchangeRate !== null && exchangeRate !== void 0 ? exchangeRate : 1,
                            shippingCost: 0,
                            createdBy: userId
                        };
                    }
                    roundedValue = value;
                    if (key === "unitPrice") {
                        // Round the value to the precision of the quote line
                        roundedValue = Number(value.toFixed(unitPricePrecision));
                    }
                    newPrices[quantity] = __assign(__assign({}, newPrices[quantity]), (_a = {}, _a[key] = roundedValue, _a));
                    setEditableFields(function (prev) { return (__assign(__assign({}, prev), { prices: newPrices })); });
                    if (!hasPrice) return [3 /*break*/, 2];
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteLinePrice").update((_b = {},
                            _b[key] = roundedValue,
                            _b.quoteLineId = lineId,
                            _b.quantity = quantity,
                            _b)).eq("quoteLineId", lineId).eq("quantity", quantity))];
                case 1:
                    update = _d.sent();
                    if (update === null || update === void 0 ? void 0 : update.error) {
                        console.error(update.error);
                        react_1.toast.error("Failed to update quote line");
                    }
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("quoteLinePrice").insert(__assign(__assign({}, newPrices[quantity]), { quoteLineId: lineId, quantity: quantity })))];
                case 3:
                    insert = _d.sent();
                    if (insert === null || insert === void 0 ? void 0 : insert.error) {
                        console.error(insert.error);
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to insert quote line"], ["Failed to insert quote line"]))));
                    }
                    _d.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); }, [
        line.unitPricePrecision,
        editableFields.prices,
        quoteId,
        lineId,
        exchangeRate,
        userId,
        carbon,
        t
    ]);
    return (<react_1.Card>
      <react_1.HStack className="justify-between">
        <react_1.CardHeader>
          <react_1.CardTitle>
            <macro_1.Trans>Pricing</macro_1.Trans>
          </react_1.CardTitle>
        </react_1.CardHeader>
        {isEditable && (<react_1.CardAction>
            <react_1.HStack>
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button variant="secondary" rightIcon={<lu_1.LuChevronDown />} isLoading={fetcher.state === "loading" &&
                fetcher.formAction ===
                    path_1.path.to.quoteLineUpdatePrecision(quoteId, lineId)} isDisabled={!isEditable ||
                (fetcher.state === "loading" &&
                    fetcher.formAction ===
                        path_1.path.to.quoteLineUpdatePrecision(quoteId, lineId))}>
                    Precision
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <react_1.DropdownMenuRadioGroup value={unitPricePrecision.toString()} onValueChange={function (value) { return onUpdatePrecision(value); }}>
                    <react_1.DropdownMenuRadioItem value="2">.00</react_1.DropdownMenuRadioItem>
                    <react_1.DropdownMenuRadioItem value="3">
                      .000
                    </react_1.DropdownMenuRadioItem>
                    <react_1.DropdownMenuRadioItem value="4">
                      .0000
                    </react_1.DropdownMenuRadioItem>
                  </react_1.DropdownMenuRadioGroup>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
              <react_1.DropdownMenu>
                <react_1.DropdownMenuTrigger asChild>
                  <react_1.Button variant="secondary" leftIcon={<lu_1.LuRefreshCcw />} rightIcon={<lu_1.LuChevronDown />} isLoading={fetcher.state === "loading" &&
                fetcher.formAction ===
                    path_1.path.to.quoteLineRecalculatePrice(quoteId, lineId)} isDisabled={!isEditable ||
                (fetcher.state === "loading" &&
                    fetcher.formAction ===
                        path_1.path.to.quoteLineRecalculatePrice(quoteId, lineId))}>
                    Markup %
                  </react_1.Button>
                </react_1.DropdownMenuTrigger>
                <react_1.DropdownMenuContent align="end">
                  <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border mb-1" onClick={function (e) { return e.stopPropagation(); }} onKeyDown={function (e) { return e.stopPropagation(); }}>
                    <react_1.NumberField value={customMarkup === "" ? undefined : Number(customMarkup)} minValue={0} formatOptions={{
                style: "decimal",
                maximumFractionDigits: 2
            }} onChange={function (val) {
                if (Number.isFinite(val))
                    setCustomMarkup(String(val));
            }}>
                      <react_1.NumberInput size="sm" placeholder={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Custom %"], ["Custom %"])))} className="w-32 h-7"/>
                    </react_1.NumberField>
                    <react_1.DropdownMenuItem asChild onSelect={function (e) {
                var val = parseFloat(customMarkup);
                if (!Number.isFinite(val) || val < 0) {
                    e.preventDefault();
                    return;
                }
                onRecalculate(val);
                setCustomMarkup("");
            }}>
                      <react_1.Button size="sm" variant="secondary" className="h-7 px-2 text-xs">
                        Apply
                      </react_1.Button>
                    </react_1.DropdownMenuItem>
                  </div>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(0); }}>
                    0% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(10); }}>
                    10% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(15); }}>
                    15% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(20); }}>
                    20% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(30); }}>
                    30% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(40); }}>
                    40% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(50); }}>
                    50% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(60); }}>
                    60% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(70); }}>
                    70% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(80); }}>
                    80% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(90); }}>
                    90% Markup
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuItem onClick={function () { return onRecalculate(100); }}>
                    100% Markup
                  </react_1.DropdownMenuItem>
                </react_1.DropdownMenuContent>
              </react_1.DropdownMenu>
            </react_1.HStack>
          </react_1.CardAction>)}
      </react_1.HStack>
      <react_1.CardContent>
        <react_1.Table>
          <react_1.Thead>
            <react_1.Tr>
              <react_1.Th className="w-[300px]"/>
              {quantities.map(function (quantity) { return (<react_1.Th key={quantity.toString()}>{quantity}</react_1.Th>); })}
            </react_1.Tr>
          </react_1.Thead>
          <react_1.Tbody>
            <react_1.Tr>
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Lead Time</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            var _a, _b;
            var leadTime = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.leadTime) !== null && _b !== void 0 ? _b : 0;
            return (<react_1.Td key={quantity.toString()} className="group-hover:bg-muted/50">
                    <react_1.NumberField value={leadTime} formatOptions={{
                    style: "unit",
                    unit: "day",
                    unitDisplay: "long"
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== leadTime) {
                        onUpdatePrice("leadTime", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            {isEmployee && (<react_1.Tr className={(0, react_1.cn)(hasCalculatedCost && "[&>td]:bg-muted/60")}>
                <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                  <react_1.HStack className="w-full justify-between ">
                    <span>Unit Cost</span>
                  </react_1.HStack>
                </react_1.Td>

                {unitCostsByQuantity.map(function (cost, index) {
                return hasCalculatedCost ? (<react_1.Td key={index} className="group-hover:bg-muted/50">
                      <react_1.VStack spacing={0}>
                        <span>
                          {unitPriceFormatter.format(unitCostsByQuantity[index])}
                        </span>
                      </react_1.VStack>
                    </react_1.Td>) : (<react_1.Td key={index} className="group-hover:bg-muted/50">
                      <react_1.NumberField value={editableFields.unitCost} formatOptions={{
                        style: "currency",
                        currency: baseCurrency
                    }} minValue={0} onChange={function (value) {
                        if (Number.isFinite(value) &&
                            value !== editableFields.unitCost) {
                            onUpdateCost(value);
                        }
                    }}>
                        <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                      </react_1.NumberField>
                    </react_1.Td>);
            })}
              </react_1.Tr>)}

            {isEmployee && (<react_1.Tr>
                <react_1.Td className="border-r border-border">
                  <react_1.HStack className="w-full justify-between ">
                    <span className="flex items-center justify-start gap-2">
                      Markup Percent
                      <react_1.Tooltip>
                        <react_1.TooltipTrigger tabIndex={-1}>
                          <lu_1.LuInfo className="w-4 h-4"/>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent>(Price - Cost) / Cost</react_1.TooltipContent>
                      </react_1.Tooltip>
                    </span>
                  </react_1.HStack>
                </react_1.Td>
                {quantities.map(function (quantity, index) {
                var _a, _b;
                var price = (_b = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.unitPrice) !== null && _b !== void 0 ? _b : 0;
                var cost = unitCostsByQuantity[index];
                var markup = cost > 0 ? (price - cost) / cost : 0;
                return (<react_1.Td key={quantity.toString()}>
                      {cost > 0 ? (<react_1.NumberField value={markup} formatOptions={{
                            style: "percent",
                            maximumFractionDigits: 2
                        }} onChange={function (value) {
                            if (Number.isFinite(value) && value !== markup) {
                                onUpdatePrice("unitPrice", quantity, cost * (1 + value));
                            }
                        }}>
                          <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                        </react_1.NumberField>) : (<span className="text-muted-foreground">-</span>)}
                    </react_1.Td>);
            })}
              </react_1.Tr>)}
            {isEmployee && hasCalculatedCost && (<>
                <react_1.Tr>
                  <react_1.Td className="border-r border-border">
                    <react_1.Button variant="ghost" className="-ml-3" rightIcon={showCategoryMarkups ? (<lu_1.LuChevronDown />) : (<lu_1.LuChevronRight />)} onClick={function () {
                return setShowCategoryMarkups(!showCategoryMarkups);
            }}>
                      Markup by Category
                    </react_1.Button>
                  </react_1.Td>
                  {quantities.map(function (quantity) { return (<react_1.Td key={quantity.toString()}/>); })}
                </react_1.Tr>
                {showCategoryMarkups &&
                visibleCategories.map(function (category) {
                    return (<react_1.Tr key={category}>
                        <react_1.Td className="border-r border-border pl-8">
                          <span>{categoryLabels[category]}</span>
                        </react_1.Td>
                        {quantities.map(function (quantity, index) {
                            var _a, _b, _c, _d;
                            var categoryCost = (_b = (_a = costsByQuantity[index]) === null || _a === void 0 ? void 0 : _a[category]) !== null && _b !== void 0 ? _b : 0;
                            var markupValue = (_d = (_c = categoryMarkupsByQuantity[quantity]) === null || _c === void 0 ? void 0 : _c[category]) !== null && _d !== void 0 ? _d : 0;
                            return (<react_1.Td key={quantity.toString()}>
                              {categoryCost > 0 ? (<react_1.VStack spacing={0}>
                                  <react_1.NumberField value={markupValue / 100} formatOptions={{
                                        style: "percent",
                                        maximumFractionDigits: 2
                                    }} minValue={0} onChange={function (value) {
                                        var percent = value * 100;
                                        if (Number.isFinite(percent) &&
                                            percent !== markupValue) {
                                            onUpdateCategoryMarkup(category, quantity, percent);
                                        }
                                    }}>
                                    <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                                  </react_1.NumberField>
                                  <span className="text-xs text-muted-foreground">
                                    {unitPriceFormatter.format(categoryCost)}
                                  </span>
                                </react_1.VStack>) : (<span className="text-muted-foreground">-</span>)}
                            </react_1.Td>);
                        })}
                      </react_1.Tr>);
                })}
              </>)}
            <react_1.Tr>
              <react_1.Td className="border-r border-border">
                <react_1.HStack className="w-full justify-between ">
                  <span>Unit Price</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            var _a;
            var price = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.unitPrice;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.NumberField value={price} formatOptions={{
                    style: "currency",
                    currency: baseCurrency,
                    maximumFractionDigits: unitPricePrecision
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== price) {
                        onUpdatePrice("unitPrice", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            <react_1.Tr>
              <react_1.Td className="border-r border-border">
                <react_1.HStack className="w-full justify-between ">
                  <span>Discount Percent</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var _a;
            var discount = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.discountPercent;
            return (<react_1.Td key={index}>
                    <react_1.NumberField value={discount} formatOptions={{
                    style: "percent",
                    maximumFractionDigits: 2
                }} minValue={0} maxValue={1} onChange={function (value) {
                    if (Number.isFinite(value) && value !== discount) {
                        onUpdatePrice("discountPercent", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm"/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            <react_1.Tr className="[&>td]:bg-muted/60">
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Net Unit Price</span>
                </react_1.HStack>
              </react_1.Td>
              {netPricesByQuantity.map(function (price, index) {
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.VStack spacing={0}>
                      <span>{unitPriceFormatter.format(price)}</span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>

            {isEmployee && (<react_1.Tr className="[&>td]:bg-muted/60">
                <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                  <react_1.HStack className="w-full justify-between ">
                    <span className="flex items-center justify-start gap-2">
                      Profit Percent
                      <react_1.Tooltip>
                        <react_1.TooltipTrigger tabIndex={-1}>
                          <lu_1.LuInfo className="w-4 h-4"/>
                        </react_1.TooltipTrigger>
                        <react_1.TooltipContent>(Price - Cost) / Price</react_1.TooltipContent>
                      </react_1.Tooltip>
                    </span>
                  </react_1.HStack>
                </react_1.Td>
                {netPricesByQuantity.map(function (price, index) {
                var cost = unitCostsByQuantity[index];
                var profit = ((price - cost) / price) * 100;
                return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                      <react_1.VStack spacing={0}>
                        {Number.isFinite(profit) ? (<span className={(0, react_1.cn)(profit < -0.01 && "text-red-500")}>
                            {profit.toFixed(2)}%
                          </span>) : (<span>-</span>)}
                      </react_1.VStack>
                    </react_1.Td>);
            })}
              </react_1.Tr>)}
            {isEmployee && (<react_1.Tr className="[&>td]:bg-muted/60">
                <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                  <react_1.HStack className="w-full justify-between ">
                    <span>Total Profit</span>
                  </react_1.HStack>
                </react_1.Td>
                {quantities.map(function (quantity, index) {
                var price = netPricesByQuantity[index];
                var cost = unitCostsByQuantity[index];
                var profit = (price - cost) * quantity;
                return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                      <react_1.VStack spacing={0}>
                        {price ? (<span className={(0, react_1.cn)(profit < -0.01 && "text-red-500")}>
                            {formatter.format(profit)}
                          </span>) : (<span>-</span>)}
                      </react_1.VStack>
                    </react_1.Td>);
            })}
              </react_1.Tr>)}
            <react_1.Tr>
              <react_1.Td className="border-r border-border">
                <react_1.HStack className="w-full justify-between ">
                  <span>Shipping Cost</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            var _a;
            var shippingCost = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.shippingCost;
            return (<react_1.Td key={quantity.toString()}>
                    <react_1.NumberField value={shippingCost} formatOptions={{
                    style: "currency",
                    currency: baseCurrency
                }} minValue={0} onChange={function (value) {
                    if (Number.isFinite(value) && value !== shippingCost) {
                        onUpdatePrice("shippingCost", quantity, value);
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm" min={0}/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            {Object.entries(additionalCharges)
            .sort(function (a, b) {
            return a[1].description.localeCompare(b[1].description);
        })
            .map(function (_a) {
            var _b;
            var chargeId = _a[0], charge = _a[1];
            var isDeleting = fetcher.state === "loading" &&
                fetcher.formAction ===
                    path_1.path.to.deleteQuoteLineCost(quoteId, lineId) &&
                ((_b = fetcher.formData) === null || _b === void 0 ? void 0 : _b.get("id")) === chargeId;
            return (<react_1.Tr key={chargeId}>
                    <react_1.Td className="border-r border-border">
                      <react_1.HStack className="w-full justify-between ">
                        <react_1.Input defaultValue={charge.description} size="sm" className="border-0 -ml-3 shadow-none" onBlur={function (e) {
                    if (e.target.value &&
                        e.target.value !== charge.description) {
                        onUpdateChargeDescription(chargeId, e.target.value);
                    }
                }}/>
                        <react_1.HStack spacing={1} className="items-center pr-1">
                          <react_1.Tooltip>
                            <react_1.TooltipTrigger>
                              <react_1.Switch variant="small" checked={charge.taxable !== false} disabled={!isEditable} onCheckedChange={function (checked) {
                    return onUpdateChargeTaxable(chargeId, checked === true);
                }}/>
                            </react_1.TooltipTrigger>
                            <react_1.TooltipContent>Taxable</react_1.TooltipContent>
                          </react_1.Tooltip>
                          <fetcher.Form method="post" action={path_1.path.to.deleteQuoteLineCost(quoteId, lineId)}>
                            <input type="hidden" name="id" value={chargeId}/>
                            <input type="hidden" name="additionalCharges" value={JSON.stringify(additionalCharges !== null && additionalCharges !== void 0 ? additionalCharges : {})}/>
                            <react_1.Button type="submit" aria-label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Delete"], ["Delete"])))} size="sm" variant="secondary" isDisabled={!permissions.can("update", "sales") ||
                    isDeleting} isLoading={isDeleting}>
                              <lu_1.LuTrash className="w-3 h-3"/>
                            </react_1.Button>
                          </fetcher.Form>
                        </react_1.HStack>
                      </react_1.HStack>
                    </react_1.Td>
                    {quantities.map(function (quantity) {
                    var _a, _b;
                    var amount = (_b = (_a = charge.amounts) === null || _a === void 0 ? void 0 : _a[quantity]) !== null && _b !== void 0 ? _b : 0;
                    return (<react_1.Td key={quantity.toString()}>
                          <react_1.VStack spacing={0}>
                            <react_1.NumberField defaultValue={amount} formatOptions={{
                            style: "currency",
                            currency: baseCurrency
                        }} onChange={function (value) {
                            if (Number.isFinite(value) &&
                                value !== amount) {
                                onUpdateChargeAmount(chargeId, quantity, value);
                            }
                        }}>
                              <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" size="sm" isDisabled={!isEditable} min={0}/>
                            </react_1.NumberField>
                          </react_1.VStack>
                        </react_1.Td>);
                })}
                  </react_1.Tr>);
        })}
            <react_1.Tr>
              <react_1.Td className="border-r border-border">
                <react_1.HStack className="w-full justify-between ">
                  <fetcher.Form method="post" action={path_1.path.to.newQuoteLineCost(quoteId, lineId)}>
                    <input type="hidden" name="additionalCharges" value={JSON.stringify(additionalCharges !== null && additionalCharges !== void 0 ? additionalCharges : {})}/>
                    <react_1.Button className="-ml-3" type="submit" rightIcon={<lu_1.LuCirclePlus />} variant="ghost" isLoading={fetcher.formAction ===
            path_1.path.to.newQuoteLineCost(quoteId, lineId) &&
            fetcher.state === "loading"} isDisabled={!isEditable ||
            (fetcher.formAction ===
                path_1.path.to.newQuoteLineCost(quoteId, lineId) &&
                fetcher.state === "loading")}>
                      Add
                    </react_1.Button>
                  </fetcher.Form>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity) {
            return <react_1.Td key={quantity.toString()}></react_1.Td>;
        })}
            </react_1.Tr>
            <react_1.Tr className="[&>td]:bg-muted/60">
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Subtotal</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var _a, _b, _c, _d;
            var price = ((_a = netPricesByQuantity[index]) !== null && _a !== void 0 ? _a : 0) * quantity +
                ((_c = (_b = editableFields.prices[quantity]) === null || _b === void 0 ? void 0 : _b.shippingCost) !== null && _c !== void 0 ? _c : 0) +
                ((_d = additionalChargesByQuantity[index]) !== null && _d !== void 0 ? _d : 0);
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.VStack spacing={0}>
                      <span>{formatter.format(price)}</span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            <react_1.Tr className="[&>td]:bg-muted/60">
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Tax Percent</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var taxPercent = editableFields.taxPercent;
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.NumberField value={taxPercent} formatOptions={{
                    style: "percent",
                    maximumFractionDigits: 2
                }} onChange={function (value) {
                    if (Number.isFinite(value) && value !== taxPercent) {
                        setEditableFields(function (prev) { return (__assign(__assign({}, prev), { taxPercent: value })); });
                        // TODO: handle mutation
                    }
                }}>
                      <react_1.NumberInput className="border-0 -ml-3 shadow-none disabled:bg-transparent disabled:opacity-100" isDisabled={!isEditable} size="sm"/>
                    </react_1.NumberField>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            <react_1.Tr className="font-bold [&>td]:bg-muted/60">
              <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                <react_1.HStack className="w-full justify-between ">
                  <span>Total Price</span>
                </react_1.HStack>
              </react_1.Td>
              {quantities.map(function (quantity, index) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            var subtotal = ((_a = netPricesByQuantity[index]) !== null && _a !== void 0 ? _a : 0) * quantity +
                ((_c = (_b = editableFields.prices[quantity]) === null || _b === void 0 ? void 0 : _b.shippingCost) !== null && _c !== void 0 ? _c : 0) +
                ((_d = additionalChargesByQuantity[index]) !== null && _d !== void 0 ? _d : 0);
            var taxableSubtotal = ((_e = netPricesByQuantity[index]) !== null && _e !== void 0 ? _e : 0) * quantity +
                ((_g = (_f = editableFields.prices[quantity]) === null || _f === void 0 ? void 0 : _f.shippingCost) !== null && _g !== void 0 ? _g : 0) +
                ((_h = taxableAdditionalChargesByQuantity[index]) !== null && _h !== void 0 ? _h : 0);
            var tax = taxableSubtotal * editableFields.taxPercent;
            var price = subtotal + tax;
            return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                    <react_1.VStack spacing={0}>
                      <span>{formatter.format(price)}</span>
                    </react_1.VStack>
                  </react_1.Td>);
        })}
            </react_1.Tr>
            {((_o = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _o === void 0 ? void 0 : _o.currencyCode) !== baseCurrency && (<>
                <react_1.Tr className="[&>td]:bg-muted/60">
                  <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                    <react_1.HStack className="w-full justify-between ">
                      <span>Exchange Rate</span>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantities.map(function (quantity, index) {
                var _a;
                var exchangeRate = (_a = editableFields.prices[quantity]) === null || _a === void 0 ? void 0 : _a.exchangeRate;
                return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                        <react_1.VStack spacing={0}>
                          <span>{exchangeRate !== null && exchangeRate !== void 0 ? exchangeRate : 1}</span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
                <react_1.Tr className="font-bold [&>td]:bg-muted/60">
                  <react_1.Td className="border-r border-border group-hover:bg-muted/50">
                    <react_1.HStack className="w-full justify-between ">
                      <span>Converted Total Price</span>
                    </react_1.HStack>
                  </react_1.Td>
                  {quantities.map(function (quantity, index) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j;
                var subtotal = ((_a = netPricesByQuantity[index]) !== null && _a !== void 0 ? _a : 0) * quantity +
                    ((_c = (_b = editableFields.prices[quantity]) === null || _b === void 0 ? void 0 : _b.shippingCost) !== null && _c !== void 0 ? _c : 0) +
                    ((_d = additionalChargesByQuantity[index]) !== null && _d !== void 0 ? _d : 0);
                var taxableSubtotal = ((_e = netPricesByQuantity[index]) !== null && _e !== void 0 ? _e : 0) * quantity +
                    ((_g = (_f = editableFields.prices[quantity]) === null || _f === void 0 ? void 0 : _f.shippingCost) !== null && _g !== void 0 ? _g : 0) +
                    ((_h = taxableAdditionalChargesByQuantity[index]) !== null && _h !== void 0 ? _h : 0);
                var tax = taxableSubtotal * editableFields.taxPercent;
                var price = subtotal + tax;
                var exchangeRate = (_j = editableFields.prices[quantity]) === null || _j === void 0 ? void 0 : _j.exchangeRate;
                var convertedPrice = price * (exchangeRate !== null && exchangeRate !== void 0 ? exchangeRate : 1);
                return (<react_1.Td key={index} className="group-hover:bg-muted/50">
                        <react_1.VStack spacing={0}>
                          <span>
                            {presentationCurrencyFormatter.format(convertedPrice)}
                          </span>
                        </react_1.VStack>
                      </react_1.Td>);
            })}
                </react_1.Tr>
              </>)}
          </react_1.Tbody>
        </react_1.Table>
      </react_1.CardContent>
    </react_1.Card>);
};
exports.default = QuoteLinePricing;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
