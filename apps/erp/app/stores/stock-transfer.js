"use strict";
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
exports.clearSelectedToItemStorageUnits = exports.clearStockTransferWizard = exports.updateTransferLineQuantity = exports.hasTransferLinesToItemStorageUnit = exports.hasTransferLine = exports.removeTransferLine = exports.addTransferLine = exports.isToItemStorageUnitSelected = exports.toggleToItemStorageUnitSelection = exports.useStockTransferWizardLinesCount = exports.useStockTransferWizard = exports.isInStockTransferSession = exports.clearStockTransferSession = exports.removeFromStockTransferSession = exports.addToStockTransferSession = exports.useTransferItems = exports.useOrderItems = exports.useStockTransferSessionItemsCount = exports.useStockTransferSession = void 0;
var react_1 = require("@nanostores/react");
var nanostores_1 = require("nanostores");
var hooks_1 = require("~/hooks");
var $sessionStore = (0, nanostores_1.atom)({
    items: []
});
var $sessionItemsCount = (0, nanostores_1.computed)($sessionStore, function (session) { return session.items.length; });
var $orderItems = (0, nanostores_1.computed)($sessionStore, function (session) {
    return session.items.filter(function (item) { return item.action === "order"; });
});
var $transferItems = (0, nanostores_1.computed)($sessionStore, function (session) {
    return session.items.filter(function (item) { return item.action === "transfer"; });
});
var useStockTransferSession = function () {
    return (0, hooks_1.useNanoStore)($sessionStore, "session");
};
exports.useStockTransferSession = useStockTransferSession;
var useStockTransferSessionItemsCount = function () {
    return (0, react_1.useStore)($sessionItemsCount);
};
exports.useStockTransferSessionItemsCount = useStockTransferSessionItemsCount;
var useOrderItems = function () { return (0, react_1.useStore)($orderItems); };
exports.useOrderItems = useOrderItems;
var useTransferItems = function () { return (0, react_1.useStore)($transferItems); };
exports.useTransferItems = useTransferItems;
// StockTransferSession actions
var addToStockTransferSession = function (item) {
    var currentStockTransferSession = $sessionStore.get();
    // Check if item already exists with same action
    var existingItemIndex = currentStockTransferSession.items.findIndex(function (sessionItem) {
        return sessionItem.id === item.id && sessionItem.action === item.action;
    });
    if (existingItemIndex >= 0) {
        // Update existing item
        var updatedItems = __spreadArray([], currentStockTransferSession.items, true);
        updatedItems[existingItemIndex] = __assign(__assign({}, updatedItems[existingItemIndex]), item);
        $sessionStore.set({ items: updatedItems });
    }
    else {
        // Add new item
        $sessionStore.set({ items: __spreadArray(__spreadArray([], currentStockTransferSession.items, true), [item], false) });
    }
};
exports.addToStockTransferSession = addToStockTransferSession;
var removeFromStockTransferSession = function (itemId, action) {
    var currentStockTransferSession = $sessionStore.get();
    var updatedItems = currentStockTransferSession.items.filter(function (item) { return !(item.id === itemId && item.action === action); });
    $sessionStore.set({ items: updatedItems });
};
exports.removeFromStockTransferSession = removeFromStockTransferSession;
var clearStockTransferSession = function () {
    $sessionStore.set({ items: [] });
};
exports.clearStockTransferSession = clearStockTransferSession;
var isInStockTransferSession = function (itemId, action) {
    var currentStockTransferSession = $sessionStore.get();
    return currentStockTransferSession.items.some(function (item) { return item.id === itemId && item.action === action; });
};
exports.isInStockTransferSession = isInStockTransferSession;
var $wizardStore = (0, nanostores_1.atom)({
    selectedToItemStorageUnitIds: new Set(),
    lines: []
});
var $wizardLinesCount = (0, nanostores_1.computed)($wizardStore, function (wizard) { return wizard.lines.filter(function (line) { var _a; return ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0) > 0; }).length; });
var useStockTransferWizard = function () {
    return (0, hooks_1.useNanoStore)($wizardStore, "wizard");
};
exports.useStockTransferWizard = useStockTransferWizard;
var useStockTransferWizardLinesCount = function () {
    return (0, react_1.useStore)($wizardLinesCount);
};
exports.useStockTransferWizardLinesCount = useStockTransferWizardLinesCount;
// Stock Transfer Wizard actions
var toggleToItemStorageUnitSelection = function (itemId, storageUnitId) {
    var currentWizard = $wizardStore.get();
    var compositeKey = "".concat(itemId, ":").concat(storageUnitId);
    var newSelectedToItemStorageUnitIds = new Set(currentWizard.selectedToItemStorageUnitIds);
    if (newSelectedToItemStorageUnitIds.has(compositeKey)) {
        newSelectedToItemStorageUnitIds.delete(compositeKey);
        // Remove all lines that have this itemId and toStorageUnitId
        var updatedLines = currentWizard.lines.filter(function (line) {
            return !(line.itemId === itemId && line.toStorageUnitId === storageUnitId);
        });
        $wizardStore.set({
            selectedToItemStorageUnitIds: newSelectedToItemStorageUnitIds,
            lines: updatedLines
        });
    }
    else {
        newSelectedToItemStorageUnitIds.add(compositeKey);
        $wizardStore.set(__assign(__assign({}, currentWizard), { selectedToItemStorageUnitIds: newSelectedToItemStorageUnitIds }));
    }
};
exports.toggleToItemStorageUnitSelection = toggleToItemStorageUnitSelection;
var isToItemStorageUnitSelected = function (itemId, storageUnitId) {
    var currentWizard = $wizardStore.get();
    var compositeKey = "".concat(itemId, ":").concat(storageUnitId);
    return currentWizard.selectedToItemStorageUnitIds.has(compositeKey);
};
exports.isToItemStorageUnitSelected = isToItemStorageUnitSelected;
var addTransferLine = function (line) {
    var currentWizard = $wizardStore.get();
    // Check if a line with same itemId, fromStorageUnitId and toStorageUnitId already exists
    var existingLineIndex = currentWizard.lines.findIndex(function (l) {
        return l.itemId === line.itemId &&
            l.fromStorageUnitId === line.fromStorageUnitId &&
            l.toStorageUnitId === line.toStorageUnitId;
    });
    if (existingLineIndex >= 0) {
        // Update existing line
        var updatedLines = __spreadArray([], currentWizard.lines, true);
        updatedLines[existingLineIndex] = __assign(__assign({}, updatedLines[existingLineIndex]), line);
        $wizardStore.set(__assign(__assign({}, currentWizard), { lines: updatedLines }));
    }
    else {
        // Add new line
        $wizardStore.set(__assign(__assign({}, currentWizard), { lines: __spreadArray(__spreadArray([], currentWizard.lines, true), [line], false) }));
    }
};
exports.addTransferLine = addTransferLine;
var removeTransferLine = function (itemId, fromStorageUnitId, toStorageUnitId) {
    var currentWizard = $wizardStore.get();
    var updatedLines = currentWizard.lines.filter(function (line) {
        return !(line.itemId === itemId &&
            line.fromStorageUnitId === fromStorageUnitId &&
            line.toStorageUnitId === toStorageUnitId);
    });
    $wizardStore.set(__assign(__assign({}, currentWizard), { lines: updatedLines }));
};
exports.removeTransferLine = removeTransferLine;
var hasTransferLine = function (itemId, fromStorageUnitId, toStorageUnitId) {
    var currentWizard = $wizardStore.get();
    return currentWizard.lines.some(function (line) {
        return line.itemId === itemId &&
            line.fromStorageUnitId === fromStorageUnitId &&
            line.toStorageUnitId === toStorageUnitId;
    });
};
exports.hasTransferLine = hasTransferLine;
var hasTransferLinesToItemStorageUnit = function (itemId, storageUnitId) {
    var currentWizard = $wizardStore.get();
    return currentWizard.lines.some(function (line) {
        var _a;
        return line.itemId === itemId &&
            line.toStorageUnitId === storageUnitId &&
            ((_a = line.quantity) !== null && _a !== void 0 ? _a : 0) > 0;
    });
};
exports.hasTransferLinesToItemStorageUnit = hasTransferLinesToItemStorageUnit;
var updateTransferLineQuantity = function (itemId, fromStorageUnitId, toStorageUnitId, quantity) {
    var currentWizard = $wizardStore.get();
    var lineIndex = currentWizard.lines.findIndex(function (line) {
        return line.itemId === itemId &&
            line.fromStorageUnitId === fromStorageUnitId &&
            line.toStorageUnitId === toStorageUnitId;
    });
    if (lineIndex >= 0) {
        var updatedLines = __spreadArray([], currentWizard.lines, true);
        updatedLines[lineIndex] = __assign(__assign({}, updatedLines[lineIndex]), { quantity: quantity });
        $wizardStore.set(__assign(__assign({}, currentWizard), { lines: updatedLines }));
    }
};
exports.updateTransferLineQuantity = updateTransferLineQuantity;
var clearStockTransferWizard = function () {
    $wizardStore.set({
        selectedToItemStorageUnitIds: new Set(),
        lines: []
    });
};
exports.clearStockTransferWizard = clearStockTransferWizard;
var clearSelectedToItemStorageUnits = function () {
    var currentWizard = $wizardStore.get();
    $wizardStore.set(__assign(__assign({}, currentWizard), { selectedToItemStorageUnitIds: new Set() }));
};
exports.clearSelectedToItemStorageUnits = clearSelectedToItemStorageUnits;
