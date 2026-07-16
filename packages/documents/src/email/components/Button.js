"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
var components_1 = require("@react-email/components");
var Theme_1 = require("./Theme");
function Button(_a) {
    var href = _a.href, children = _a.children, _b = _a.variant, variant = _b === void 0 ? "primary" : _b, _c = _a.className, className = _c === void 0 ? "" : _c;
    var themeClasses = (0, Theme_1.getEmailThemeClasses)();
    var lightStyles = (0, Theme_1.getEmailInlineStyles)("light");
    var baseClasses = "bg-transparent text-[14px] font-medium no-underline text-center px-6 py-3 border border-solid";
    var variantClasses = variant === "primary"
        ? themeClasses.button
        : "border-gray-300 text-gray-600";
    // Inline styles for maximum email client compatibility
    var buttonStyle = variant === "primary"
        ? {
            color: lightStyles.button.color,
            borderColor: lightStyles.button.borderColor
        }
        : {
            color: "#6b7280",
            borderColor: "#d1d5db"
        };
    return (<components_1.Button className={"".concat(baseClasses, " ").concat(variantClasses, " ").concat(className)} href={href} style={buttonStyle}>
      {children}
    </components_1.Button>);
}
