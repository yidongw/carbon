"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tw = void 0;
var react_pdf_tailwind_1 = require("react-pdf-tailwind");
/**
 * Tailwind instance for Job Traveler blocks. Kept identical to the theme
 * previously inlined in JobTravelerPDF so block output is unchanged.
 */
exports.tw = (0, react_pdf_tailwind_1.createTw)({
    theme: {
        fontFamily: {
            sans: ["Helvetica", "Arial", "sans-serif"]
        },
        extend: {
            colors: {
                gray: {
                    500: "#7d7d7d"
                }
            }
        }
    }
});
