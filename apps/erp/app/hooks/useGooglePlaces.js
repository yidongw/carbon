"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
exports.useGooglePlaces = void 0;
var auth_1 = require("@carbon/auth");
var macro_1 = require("@lingui/react/macro");
var nanoid_1 = require("nanoid");
var react_1 = require("react");
var useGooglePlaces = function () {
    var t = (0, macro_1.useLingui)().t;
    var _a = (0, react_1.useState)([]), suggestions = _a[0], setSuggestions = _a[1];
    var _b = (0, react_1.useState)(false), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    var sessionTokenRef = (0, react_1.useRef)("");
    var getSuggestions = (0, react_1.useCallback)(function (input) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, placeSuggestions, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!auth_1.GOOGLE_PLACES_API_KEY) {
                        setError(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Google Places API key not configured"], ["Google Places API key not configured"]))));
                        return [2 /*return*/];
                    }
                    if (!input) {
                        setSuggestions([]);
                        setError(null);
                        return [2 /*return*/];
                    }
                    // Generate session token on first autocomplete request
                    if (!sessionTokenRef.current) {
                        sessionTokenRef.current = (0, nanoid_1.nanoid)();
                    }
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("https://places.googleapis.com/v1/places:autocomplete", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "X-Goog-Api-Key": auth_1.GOOGLE_PLACES_API_KEY
                            },
                            body: JSON.stringify({
                                input: input,
                                includedPrimaryTypes: ["street_address"],
                                languageCode: "en",
                                sessionToken: sessionTokenRef.current
                            })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Google Places API error: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    placeSuggestions = (data.suggestions || [])
                        .map(function (suggestion) {
                        var prediction = suggestion.placePrediction;
                        if (!prediction)
                            return null;
                        return {
                            placeId: prediction.placeId,
                            text: prediction.text.text
                        };
                    })
                        .filter(function (suggestion) { return suggestion !== null; });
                    setSuggestions(placeSuggestions);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    console.error("Google Places API error:", err_1);
                    setError(err_1 instanceof Error ? err_1.message : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to fetch suggestions"], ["Failed to fetch suggestions"]))));
                    setSuggestions([]);
                    return [3 /*break*/, 6];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); }, [t]);
    var parseAddressComponents = function (components) {
        if (!components) {
            return {
                addressLine1: "",
                addressLine2: "",
                city: "",
                stateProvince: "",
                postalCode: "",
                countryCode: ""
            };
        }
        var addressMap = {};
        components.forEach(function (component) {
            var types = component.types;
            if (types.includes("street_number")) {
                addressMap.streetNumber = component.longText;
            }
            if (types.includes("route")) {
                addressMap.route = component.longText;
            }
            if (types.includes("subpremise")) {
                addressMap.subpremise = component.longText;
            }
            if (types.includes("locality")) {
                addressMap.city = component.longText;
            }
            if (types.includes("sublocality")) {
                addressMap.sublocality = component.longText;
            }
            if (types.includes("administrative_area_level_1")) {
                addressMap.stateProvince = component.shortText;
            }
            if (types.includes("postal_code")) {
                addressMap.postalCode = component.longText;
            }
            if (types.includes("country")) {
                addressMap.countryCode = component.shortText;
            }
        });
        return {
            addressLine1: "".concat(addressMap.streetNumber || "", " ").concat(addressMap.route || "").trim(),
            addressLine2: addressMap.subpremise || "",
            city: addressMap.city || addressMap.sublocality || "",
            stateProvince: addressMap.stateProvince || "",
            postalCode: addressMap.postalCode || "",
            countryCode: addressMap.countryCode || ""
        };
    };
    var getPlaceDetails = function (placeId) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!auth_1.GOOGLE_PLACES_API_KEY) {
                        setError(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Google Places API key not configured"], ["Google Places API key not configured"]))));
                        return [2 /*return*/, null];
                    }
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("https://places.googleapis.com/v1/places/".concat(placeId, "?sessionToken=").concat(sessionTokenRef.current), {
                            headers: {
                                "X-Goog-Api-Key": auth_1.GOOGLE_PLACES_API_KEY,
                                "X-Goog-FieldMask": "addressComponents"
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Google Places API error: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    if (!data.addressComponents) {
                        throw new Error("No address components found");
                    }
                    return [2 /*return*/, parseAddressComponents(data.addressComponents)];
                case 4:
                    err_2 = _a.sent();
                    console.error("Google Places API error:", err_2);
                    setError(err_2 instanceof Error ? err_2.message : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to fetch place details"], ["Failed to fetch place details"]))));
                    return [2 /*return*/, null];
                case 5:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var selectPlace = (0, react_1.useCallback)(function (placeId) { return __awaiter(void 0, void 0, void 0, function () {
        var addressComponents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPlaceDetails(placeId)];
                case 1:
                    addressComponents = _a.sent();
                    setSuggestions([]);
                    // Generate a new session token for the next autocomplete session
                    sessionTokenRef.current = (0, nanoid_1.nanoid)();
                    return [2 /*return*/, addressComponents];
            }
        });
    }); }, []);
    var clearSuggestions = (0, react_1.useCallback)(function () {
        setSuggestions([]);
        setError(null);
    }, []);
    return {
        suggestions: suggestions,
        loading: loading,
        error: error,
        getSuggestions: getSuggestions,
        selectPlace: selectPlace,
        clearSuggestions: clearSuggestions
    };
};
exports.useGooglePlaces = useGooglePlaces;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
