"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBoolean = parseBoolean;
exports.pluralize = pluralize;
function parseBoolean(value, defaultValue) {
    if (!value)
        return defaultValue;
    if (typeof value === "boolean")
        return value;
    // Fast-path the canonical lowercased forms before allocating
    // `trim().toLowerCase()` strings.
    if (value === "true" || value === "1")
        return true;
    if (value === "false" || value === "0")
        return false;
    var normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1")
        return true;
    if (normalized === "false" || normalized === "0")
        return false;
    return defaultValue; // or throw an error if invalid
}
/**
 * Returns the singular or plural form of a word based on count.
 * @param count - The number to check
 * @param singular - The singular form of the word
 * @param plural - The plural form (defaults to singular + "s")
 * @returns The appropriate form of the word
 */
function pluralize(count, singular, plural) {
    return count === 1 ? singular : (plural !== null && plural !== void 0 ? plural : "".concat(singular, "s"));
}
