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
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineIntegration = defineIntegration;
/**
 * Ensures the code is running on the server.
 * Throws an error if called from the browser.
 */
var withServerOnly = function () {
    if (typeof document !== "undefined") {
        throw new Error("Server only integration hooks cannot be used in the browser");
    }
};
/**
 * Defines an integration with type-safe configuration and server-only hook protection.
 *
 * This function:
 * - Validates required fields at definition time
 * - Computes `active` from OAuth config if not explicitly set
 * - Wraps server-only hooks (onInstall, onUninstall, onHealthcheck) with browser guards
 * - Preserves full type information for the integration config
 *
 * @example
 * ```ts
 * const MyIntegration = defineIntegration({
 *   name: "My Integration",
 *   id: "my-integration",
 *   active: true, // must be true AND clientId must be set for OAuth integrations
 *   category: "Tools",
 *   logo: MyLogo,
 *   description: "...",
 *   shortDescription: "...",
 *   images: [],
 *   settings: [],
 *   schema: z.object({}),
 *   oauth: {
 *     clientId: SOME_CLIENT_ID, // if empty/undefined, integration will be inactive
 *     ...
 *   },
 *   onInstall: async (companyId) => { ... },
 *   onHealthcheck: async (companyId, metadata) => { ... },
 * });
 * ```
 */
function defineIntegration(options) {
    // Validate required fields at definition time
    if (!options.id) {
        throw new Error("Integration must have an 'id' defined");
    }
    if (!options.name) {
        throw new Error("Integration '".concat(options.id, "' must have a 'name' defined"));
    }
    return __assign(__assign({}, options), { 
        /**
         * Computes whether an integration should be active based on its configuration.
         * - If `active` is explicitly false, return false
         * - If the integration has OAuth config, also require clientId to be set and non-empty
         * - Otherwise, use the `active` value (defaults to true)
         */
        get active() {
            var _a;
            var isActive = (_a = options.active) !== null && _a !== void 0 ? _a : true;
            // If explicitly inactive, return false
            if (!isActive) {
                return false;
            }
            // If the integration has OAuth config, also require clientId to be configured
            if (options.oauth) {
                return !!options.oauth.clientId;
            }
            return isActive;
        },
        get onInstall() {
            withServerOnly();
            return options.onInstall;
        },
        get onUninstall() {
            withServerOnly();
            return options.onUninstall;
        },
        get onHealthcheck() {
            withServerOnly();
            return options.onHealthcheck;
        } });
}
