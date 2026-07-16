"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollIntoView = scrollIntoView;
function scrollIntoView(element) {
    element === null || element === void 0 ? void 0 : element.scrollIntoView({
        inline: "nearest",
        block: "nearest"
    });
}
