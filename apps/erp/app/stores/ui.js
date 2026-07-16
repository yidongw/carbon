"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUIStore = void 0;
var zustand_1 = require("zustand");
exports.useUIStore = (0, zustand_1.create)()(function (set) { return ({
    isSearchModalOpen: false,
    openSearchModal: function () { return set({ isSearchModalOpen: true }); },
    closeSearchModal: function () { return set({ isSearchModalOpen: false }); },
    toggleSearchModal: function () {
        return set(function (state) { return ({ isSearchModalOpen: !state.isSearchModalOpen }); });
    },
    isSidebarOpen: true,
    setSidebarOpen: function (open) { return set({ isSidebarOpen: open }); },
    toggleSidebar: function () { return set(function (state) { return ({ isSidebarOpen: !state.isSidebarOpen }); }); }
}); });
