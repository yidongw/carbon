"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseOptions = baseOptions;
function baseOptions() {
    return {
        // Light-only, like the editorial Guide.
        themeSwitch: { enabled: false },
        // The site-wide MainHeader carries the brand + nav; keep the Fumadocs sidebar
        // wordmark empty so "Carbon" isn't duplicated below the header.
        nav: {},
        links: [],
    };
}
