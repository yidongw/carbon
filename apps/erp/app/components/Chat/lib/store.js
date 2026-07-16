"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChatStore = void 0;
// import {
//   endOfMonth,
//   getLocalTimeZone,
//   startOfMonth,
//   startOfYear,
//   today,
// } from "@internationalized/date";
var zustand_1 = require("zustand");
// Command system with / prefix - natural language suggestions
var COMMAND_SUGGESTIONS = [
// {
//   command: "/show",
//   title: "Show latest transactions",
//   toolName: "getTransactions",
//   toolParams: { pageSize: 10, sort: ["date", "desc"] },
//   keywords: ["show", "latest", "transactions", "recent"],
// },
// {
//   command: "/show",
//   title: "Show cash burn and top 3 vendor increases",
//   toolName: "getBurnRateAnalysis",
//   toolParams: { showCanvas: true },
//   keywords: ["show", "burn", "cash", "vendor", "increases", "analysis"],
// },
// {
//   command: "/show",
//   title: "Show where we're spending the most this month",
//   toolName: "getSpending",
//   toolParams: {
//     from: dateValues.startOfMonthISO,
//     to: dateValues.endOfMonthISO,
//     showCanvas: true,
//   },
//   keywords: ["show", "spending", "most", "this month", "where"],
// },
// {
//   command: "/show",
//   title: "Show weekly trends and insights",
//   toolName: "getBurnRateAnalysis",
//   toolParams: {
//     from: dateValues.weekAgoISO,
//     to: dateValues.todayISO,
//     showCanvas: true,
//   },
//   keywords: ["show", "weekly", "trends", "insights"],
// },
// {
//   command: "/show",
//   title: "Show revenue performance",
//   toolName: "getRevenue",
//   toolParams: {
//     from: dateValues.startOfYearISO,
//     to: dateValues.endOfMonthISO,
//     showCanvas: true,
//   },
//   keywords: ["show", "revenue", "performance", "analyze"],
// },
// {
//   command: "/show",
//   title: "Show expense breakdown by category",
//   toolName: "getSpending",
//   toolParams: { showCanvas: true },
//   keywords: ["show", "expense", "breakdown", "category"],
// },
// {
//   command: "/show",
//   title: "Show profit margins",
//   toolName: "getProfit",
//   toolParams: { showCanvas: true },
//   keywords: ["show", "profit", "margins"],
// },
// {
//   command: "/show",
//   title: "Show cash runway",
//   toolName: "getRunway",
//   toolParams: { showCanvas: true },
//   keywords: ["show", "runway", "cash", "left"],
// },
// {
//   command: "/find",
//   title: "Find untagged transactions from last month",
//   toolName: "getTransactions",
//   toolParams: {
//     from: dateValues.monthAgoISO,
//     to: dateValues.todayISO,
//     statuses: ["pending"],
//   },
//   keywords: ["find", "untagged", "transactions", "last month", "clean"],
// },
// {
//   command: "/find",
//   title: "Find recurring payments",
//   toolName: "getTransactions",
//   toolParams: { recurring: true },
//   keywords: ["find", "recurring", "payments", "subscriptions"],
// },
// {
//   command: "/analyze",
//   title: "Analyze burn rate trends",
//   toolName: "getBurnRateAnalysis",
//   toolParams: { showCanvas: true },
//   keywords: ["analyze", "burn", "rate", "trends"],
// },
// {
//   command: "/analyze",
//   title: "Analyze spending patterns",
//   toolName: "getSpending",
//   toolParams: { showCanvas: true },
//   keywords: ["analyze", "spending", "patterns"],
// },
];
exports.useChatStore = (0, zustand_1.create)()(function (set, get) { return ({
    // Initial state
    input: "",
    isWebSearch: false,
    isUploading: false,
    isRecording: false,
    isProcessing: false,
    showCommands: false,
    selectedCommandIndex: 0,
    commandQuery: "",
    cursorPosition: 0,
    filteredCommands: COMMAND_SUGGESTIONS,
    // Basic setters
    setInput: function (input) { return set({ input: input }); },
    clearInput: function () { return set({ input: "", cursorPosition: 0 }); },
    setIsWebSearch: function (isWebSearch) { return set({ isWebSearch: isWebSearch }); },
    setIsUploading: function (isUploading) { return set({ isUploading: isUploading }); },
    setIsRecording: function (isRecording) { return set({ isRecording: isRecording }); },
    setIsProcessing: function (isProcessing) { return set({ isProcessing: isProcessing }); },
    setShowCommands: function (showCommands) { return set({ showCommands: showCommands }); },
    setSelectedCommandIndex: function (selectedCommandIndex) {
        return set({ selectedCommandIndex: selectedCommandIndex });
    },
    setCommandQuery: function (commandQuery) { return set({ commandQuery: commandQuery }); },
    setCursorPosition: function (cursorPosition) { return set({ cursorPosition: cursorPosition }); },
    // Input change handler
    handleInputChange: function (e) {
        var value = e.target.value;
        var cursorPos = e.target.selectionStart;
        set({ input: value, cursorPosition: cursorPos });
        // Check if we're typing a command
        var textBeforeCursor = value.substring(0, cursorPos);
        var lastSlashIndex = textBeforeCursor.lastIndexOf("/");
        if (lastSlashIndex !== -1) {
            var textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);
            // Filter commands based on the query
            var query_1 = textAfterSlash.toLowerCase().trim();
            var filtered = COMMAND_SUGGESTIONS.filter(function (command) {
                var matchesCommand = command.command.toLowerCase().includes(query_1);
                var matchesTitle = command.title.toLowerCase().includes(query_1);
                var matchesKeywords = command.keywords.some(function (keyword) {
                    return keyword.toLowerCase().includes(query_1);
                });
                return matchesCommand || matchesTitle || matchesKeywords;
            });
            // Always show commands when typing after a slash, regardless of spaces
            set({
                commandQuery: textAfterSlash,
                showCommands: true,
                selectedCommandIndex: 0,
                filteredCommands: filtered
            });
            return;
        }
        set({
            showCommands: false,
            commandQuery: "",
            filteredCommands: COMMAND_SUGGESTIONS
        });
    },
    // Command selection handler
    handleCommandSelect: function (command) {
        var _a = get(), input = _a.input, cursorPosition = _a.cursorPosition;
        var textBeforeCursor = input.substring(0, cursorPosition);
        var lastSlashIndex = textBeforeCursor.lastIndexOf("/");
        var textAfterCursor = input.substring(cursorPosition);
        // Replace the command with the full suggestion
        var newText = "".concat(textBeforeCursor.substring(0, lastSlashIndex)).concat(command.title, " ").concat(textAfterCursor);
        set({
            input: newText,
            showCommands: false,
            commandQuery: ""
        });
    },
    // Keyboard navigation handler
    handleKeyDown: function (e) {
        var _a = get(), showCommands = _a.showCommands, filteredCommands = _a.filteredCommands, selectedCommandIndex = _a.selectedCommandIndex;
        if (!showCommands)
            return;
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                set({
                    selectedCommandIndex: Math.min(selectedCommandIndex + 1, filteredCommands.length - 1)
                });
                break;
            case "ArrowUp":
                e.preventDefault();
                set({
                    selectedCommandIndex: Math.max(selectedCommandIndex - 1, 0)
                });
                break;
            case "Enter": {
                e.preventDefault();
                var currentCommand = get().selectCurrentCommand();
                if (currentCommand) {
                    get().handleCommandSelect(currentCommand);
                }
                break;
            }
            case "Escape":
                set({ showCommands: false, commandQuery: "" });
                break;
        }
    },
    // Utility functions
    resetCommandState: function () {
        set({
            showCommands: false,
            commandQuery: "",
            selectedCommandIndex: 0
        });
    },
    navigateCommandUp: function () {
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        var _a = get(), selectedCommandIndex = _a.selectedCommandIndex, filteredCommands = _a.filteredCommands;
        set({
            selectedCommandIndex: Math.max(selectedCommandIndex - 1, 0)
        });
    },
    navigateCommandDown: function () {
        var _a = get(), selectedCommandIndex = _a.selectedCommandIndex, filteredCommands = _a.filteredCommands;
        set({
            selectedCommandIndex: Math.min(selectedCommandIndex + 1, filteredCommands.length - 1)
        });
    },
    selectCurrentCommand: function () {
        var _a = get(), filteredCommands = _a.filteredCommands, selectedCommandIndex = _a.selectedCommandIndex;
        return filteredCommands[selectedCommandIndex] || null;
    }
}); });
