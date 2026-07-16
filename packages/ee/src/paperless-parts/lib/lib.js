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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMaterialPropertiesCache = clearMaterialPropertiesCache;
exports.getMaterialPropertiesCacheStats = getMaterialPropertiesCacheStats;
exports.getMaterialProperties = getMaterialProperties;
exports.getOrCreateMaterial = getOrCreateMaterial;
exports.getCustomerIdAndContactId = getCustomerIdAndContactId;
exports.getCustomerLocationIds = getCustomerLocationIds;
exports.getEmployeeAndSalesPersonId = getEmployeeAndSalesPersonId;
exports.getOrderLocationId = getOrderLocationId;
exports.getCarbonOrderStatus = getCarbonOrderStatus;
exports.getPaperlessPart = getPaperlessPart;
exports.createPartFromComponent = createPartFromComponent;
exports.getOrCreatePart = getOrCreatePart;
exports.insertOrderLines = insertOrderLines;
exports.insertQuoteLines = insertQuoteLines;
var openai_1 = require("@ai-sdk/openai");
var client_server_1 = require("@carbon/auth/client.server");
var utils_1 = require("@carbon/utils");
var ai_1 = require("ai");
var nanoid_1 = require("nanoid");
var zod_1 = require("zod");
var utils_2 = require("./utils");
function lookupEntityByPaperlessId(carbon, entityType, integration, externalId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, carbon
                        .from("externalIntegrationMapping")
                        .select("entityId")
                        .eq("entityType", entityType)
                        .eq("integration", integration)
                        .eq("externalId", externalId)
                        .eq("companyId", companyId)
                        .maybeSingle()];
                case 1:
                    data = (_b.sent()).data;
                    return [2 /*return*/, (_a = data === null || data === void 0 ? void 0 : data.entityId) !== null && _a !== void 0 ? _a : null];
            }
        });
    });
}
function createPaperlessMapping(carbon, entityType, entityId, integration, externalId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, client_server_1.getCarbonServiceRole)()
                        .from("externalIntegrationMapping")
                        .delete()
                        .eq("entityType", entityType)
                        .eq("entityId", entityId)
                        .eq("integration", integration)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, carbon.from("externalIntegrationMapping").insert({
                            entityType: entityType,
                            entityId: entityId,
                            integration: integration,
                            externalId: String(externalId),
                            companyId: companyId,
                            allowDuplicateExternalId: false
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Strip special characters from filename for safe storage
 */
function stripSpecialCharacters(inputString) {
    // Keep only characters that are valid for S3 keys
    return inputString === null || inputString === void 0 ? void 0 : inputString.replace(/[^a-zA-Z0-9/!_\-.*'() &$@=;:+,?]/g, "");
}
/**
 * Download file from external URL and convert to File object
 */
function downloadFileFromUrl(url, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var response, blob, file, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log("Downloading file from: ".concat(url));
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        console.error("Failed to download file from ".concat(url, ": ").concat(response.statusText));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.blob()];
                case 2:
                    blob = _a.sent();
                    file = new File([blob], filename, { type: blob.type });
                    console.log("Successfully downloaded: ".concat(filename, " (").concat(blob.size, " bytes)"));
                    return [2 /*return*/, file];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error downloading file from ".concat(url, ":"), error_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Check if file extension is a supported model type
 */
function isModelFile(filename) {
    var extension = filename.toLowerCase().split(".").pop() || "";
    return utils_1.supportedModelTypes.includes(extension);
}
var substanceSchema = zod_1.z.object({
    substanceId: zod_1.z
        .string()
        .describe("The ID of the best matching material substance"),
    confidence: zod_1.z
        .number()
        .min(0)
        .max(1)
        .describe("Confidence level of the match (0-1)"),
    reasoningText: zod_1.z
        .string()
        .describe("Brief explanation of why this substance was chosen")
});
function determineMaterialSubstance(carbon, materialInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var substances, availableSubstances, object, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, carbon
                        .from("materialSubstance")
                        .select("id, name")
                        .is("companyId", null)];
                case 1:
                    substances = _b.sent();
                    if (substances.error || !((_a = substances.data) === null || _a === void 0 ? void 0 : _a.length)) {
                        console.error("Failed to fetch material substances:", substances.error);
                        return [2 /*return*/, null];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    availableSubstances = substances.data
                        .map(function (s) { return "".concat(s.id, ": ").concat(s.name); })
                        .join("\n");
                    return [4 /*yield*/, (0, ai_1.generateObject)({
                            model: (0, openai_1.openai)(utils_1.openAiCategorizationModel),
                            schema: substanceSchema,
                            prompt: "\n      Based on the following material information, determine the best matching material substance from the available options.\n      \n      Material Information:\n      - Description: ".concat(materialInfo.description, "\n      - Material Name: ").concat(materialInfo.materialName, "\n      - Material Display Name: ").concat(materialInfo.materialDisplayName, "\n      - Material Family: ").concat(materialInfo.materialFamily, "\n      - Material Class: ").concat(materialInfo.materialClass, "\n      - Process Name: ").concat(materialInfo.processName, "\n      \n      Available Material Substances:\n      ").concat(availableSubstances, "\n      \n      Select the substance that best matches the material information provided. Consider material type, grade, and common industry terminology.\n      "),
                            temperature: 0.2
                        })];
                case 3:
                    object = (_b.sent()).object;
                    return [2 /*return*/, object];
                case 4:
                    error_2 = _b.sent();
                    console.error("Failed to determine material substance using AI:", error_2);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var materialPropertiesSchema = zod_1.z.object({
    gradeId: zod_1.z
        .string()
        .describe("The ID of the best matching material grade")
        .nullable(),
    dimensionId: zod_1.z
        .string()
        .describe("The ID of the best matching material dimension")
        .nullable(),
    finishId: zod_1.z
        .string()
        .describe("The ID of the best matching material finish")
        .nullable(),
    typeId: zod_1.z
        .string()
        .describe("The ID of the best matching material type")
        .nullable(),
    quantity: zod_1.z.number().describe("The quantity of the material properties"),
    confidence: zod_1.z.number().describe("Confidence level of the match (0-1)"),
    reasoningText: zod_1.z
        .string()
        .describe("Brief explanation of why this material properties were chosen")
});
var materialPropertiesCache = new Map();
// Cache TTL in milliseconds (30 minutes)
var CACHE_TTL = 30 * 60 * 1000;
/**
 * Clean expired cache entries
 */
function cleanExpiredCache() {
    var now = Date.now();
    for (var _i = 0, _a = materialPropertiesCache.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (now - value.timestamp > CACHE_TTL) {
            materialPropertiesCache.delete(key);
        }
    }
}
/**
 * Get cached material properties or fetch from database if not cached
 */
function getCachedMaterialProperties(carbon, substanceId) {
    return __awaiter(this, void 0, void 0, function () {
        var cached, _a, grades, dimensions, finishes, types, forms, substance, cacheEntry;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Clean expired entries periodically
                    if (materialPropertiesCache.size > 0) {
                        cleanExpiredCache();
                    }
                    cached = materialPropertiesCache.get(substanceId);
                    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                        return [2 /*return*/, cached];
                    }
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("materialGrade")
                                .select("id, name")
                                .is("companyId", null)
                                .eq("materialSubstanceId", substanceId),
                            carbon
                                .from("materialDimension")
                                .select("id, name, materialFormId")
                                .is("companyId", null)
                                .or("materialFormId.eq.plate,materialFormId.eq.sheet"),
                            carbon
                                .from("materialFinish")
                                .select("id, name")
                                .is("companyId", null)
                                .eq("materialSubstanceId", substanceId),
                            carbon
                                .from("materialType")
                                .select("id, name, code")
                                .is("companyId", null)
                                .eq("materialSubstanceId", substanceId),
                            carbon
                                .from("materialForm")
                                .select("id, name, code")
                                .or("code.eq.plate,code.eq.sheet")
                                .is("companyId", null),
                            carbon
                                .from("materialSubstance")
                                .select("id, name, code")
                                .eq("id", substanceId)
                                .single()
                        ])];
                case 1:
                    _a = _b.sent(), grades = _a[0], dimensions = _a[1], finishes = _a[2], types = _a[3], forms = _a[4], substance = _a[5];
                    // Check for any errors
                    if (grades.error ||
                        dimensions.error ||
                        finishes.error ||
                        types.error ||
                        forms.error ||
                        substance.error) {
                        console.error("Error fetching material properties:", {
                            grades: grades.error,
                            dimensions: dimensions.error,
                            finishes: finishes.error,
                            types: types.error,
                            forms: forms.error,
                            substance: substance.error
                        });
                        return [2 /*return*/, null];
                    }
                    if (!substance.data) {
                        console.error("Substance not found for ID: ".concat(substanceId));
                        return [2 /*return*/, null];
                    }
                    cacheEntry = {
                        grades: grades.data || [],
                        dimensions: dimensions.data || [],
                        finishes: finishes.data || [],
                        types: types.data || [],
                        forms: forms.data || [],
                        substance: substance.data,
                        timestamp: Date.now()
                    };
                    // Cache the result
                    materialPropertiesCache.set(substanceId, cacheEntry);
                    return [2 /*return*/, cacheEntry];
            }
        });
    });
}
/**
 * Clear all cached material properties
 */
function clearMaterialPropertiesCache() {
    materialPropertiesCache.clear();
    console.log("Material properties cache cleared");
}
/**
 * Get current cache statistics
 */
function getMaterialPropertiesCacheStats() {
    var substances = Array.from(materialPropertiesCache.keys());
    var timestamps = Array.from(materialPropertiesCache.values()).map(function (v) { return v.timestamp; });
    return {
        size: materialPropertiesCache.size,
        substances: substances,
        oldestEntry: timestamps.length > 0 ? Math.min.apply(Math, timestamps) : undefined,
        newestEntry: timestamps.length > 0 ? Math.max.apply(Math, timestamps) : undefined
    };
}
function determineMaterialProperties(carbon, substanceId, materialInfo) {
    return __awaiter(this, void 0, void 0, function () {
        var materialProperties, grades, dimensions, finishes, types, forms, substance, object, dimension, form, grade, finish, type;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, getCachedMaterialProperties(carbon, substanceId)];
                case 1:
                    materialProperties = _g.sent();
                    if (!materialProperties) {
                        return [2 /*return*/, null];
                    }
                    grades = materialProperties.grades, dimensions = materialProperties.dimensions, finishes = materialProperties.finishes, types = materialProperties.types, forms = materialProperties.forms, substance = materialProperties.substance;
                    return [4 /*yield*/, (0, ai_1.generateObject)({
                            model: (0, openai_1.openai)(utils_1.openAiCategorizationModel),
                            schema: materialPropertiesSchema,
                            prompt: "\n    Based on the following material information, determine the best matching material properties from the available options.\n\n    If the material is sheet metal, the quantity returned should be the parts per sheet. Use the materialFormId from the dimension to determine the formId to return.\n    \n    Material Information:\n    - Description: ".concat(materialInfo.description, "\n    - Material Name: ").concat((_a = materialInfo.material) === null || _a === void 0 ? void 0 : _a.name, "\n    - Material Display Name: ").concat((_b = materialInfo.material) === null || _b === void 0 ? void 0 : _b.display_name, "\n    - Material Family: ").concat((_c = materialInfo.material) === null || _c === void 0 ? void 0 : _c.family, "\n    - Material Class: ").concat((_d = materialInfo.material) === null || _d === void 0 ? void 0 : _d.material_class, "\n    - Process Name: ").concat((_e = materialInfo.process) === null || _e === void 0 ? void 0 : _e.name, "\n\n    - Material Metadata:\n    ").concat((_f = materialInfo.material_operations) === null || _f === void 0 ? void 0 : _f.map(function (op) {
                                var _a;
                                return (_a = op.costing_variables) === null || _a === void 0 ? void 0 : _a.map(function (cv) { return "- ".concat(cv.label, ": ").concat(cv.value); }).join("\n");
                            }).filter(Boolean).join("\n"), "\n    \n    Available Material Properties:\n    - Grades: ").concat(grades.map(function (g) { return "".concat(g.id, ": ").concat(g.name); }).join("\n"), "\n    - Dimensions: ").concat(dimensions
                                .map(function (d) { return "".concat(d.id, ": ").concat(d.name, ", ").concat(d.materialFormId); })
                                .join("\n"), "\n    - Finishes: ").concat(finishes.map(function (f) { return "".concat(f.id, ": ").concat(f.name); }).join("\n"), "\n    - Types: ").concat(types.map(function (t) { return "".concat(t.id, ": ").concat(t.name); }).join("\n"), "\n    \n    Select the properties that best match the material information provided. Consider material type, grade, and common industry terminology.\n    "),
                            temperature: 0.2
                        })];
                case 2:
                    object = (_g.sent()).object;
                    if (object.confidence < 0.5) {
                        return [2 /*return*/, null];
                    }
                    dimension = dimensions.find(function (d) { return d.id === object.dimensionId; });
                    form = forms.find(function (f) { return f.id === (dimension === null || dimension === void 0 ? void 0 : dimension.materialFormId); });
                    grade = grades.find(function (g) { return g.id === object.gradeId; });
                    finish = finishes.find(function (f) { return f.id === object.finishId; });
                    type = types.find(function (t) { return t.id === object.typeId; });
                    // Return enhanced structure with both IDs, names, and codes
                    return [2 /*return*/, {
                            // IDs for database operations
                            gradeId: object.gradeId,
                            dimensionId: object.dimensionId,
                            finishId: object.finishId,
                            formId: dimension === null || dimension === void 0 ? void 0 : dimension.materialFormId,
                            typeId: object.typeId,
                            // Names for getMaterialDescription
                            materialType: type === null || type === void 0 ? void 0 : type.name,
                            substance: substance.name,
                            grade: grade === null || grade === void 0 ? void 0 : grade.name,
                            shape: form === null || form === void 0 ? void 0 : form.name,
                            dimensions: dimension === null || dimension === void 0 ? void 0 : dimension.name,
                            finish: finish === null || finish === void 0 ? void 0 : finish.name,
                            // Codes for getMaterialId
                            materialTypeCode: type === null || type === void 0 ? void 0 : type.code,
                            substanceCode: substance.code,
                            shapeCode: form === null || form === void 0 ? void 0 : form.code,
                            // Other properties
                            quantity: object.quantity,
                            confidence: object.confidence,
                            reasoningText: object.reasoningText
                        }];
            }
        });
    });
}
/**
 * Get material properties with names and codes needed for getMaterialId and getMaterialDescription
 *
 * @example
 * ```typescript
 * const materialProps = await getMaterialProperties(client, materialId, companyId);
 * if (materialProps) {
 *   const newMaterialId = getMaterialId(materialProps);
 *   const newDescription = getMaterialDescription(materialProps);
 * }
 * ```
 *
 * @param carbon - Supabase client
 * @param materialId - The material ID (readableId)
 * @param companyId - The company ID
 * @returns Material naming details with both names and codes
 */
function getMaterialProperties(carbon, materialId, companyId) {
    return __awaiter(this, void 0, void 0, function () {
        var materialNamingDetails, details, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, carbon
                            .rpc("get_material_naming_details", { readable_id: materialId })
                            .single()];
                case 1:
                    materialNamingDetails = _a.sent();
                    if (materialNamingDetails.error || !materialNamingDetails.data) {
                        console.error("Failed to get material naming details:", materialNamingDetails.error);
                        return [2 /*return*/, null];
                    }
                    details = materialNamingDetails.data;
                    return [2 /*return*/, {
                            // IDs for database operations (not available from this function)
                            gradeId: null,
                            dimensionId: null,
                            finishId: null,
                            formId: undefined,
                            typeId: null,
                            // Names for getMaterialDescription
                            materialType: details.materialType,
                            substance: details.substance,
                            grade: details.grade,
                            shape: details.shape,
                            dimensions: details.dimensions,
                            finish: details.finish,
                            // Codes for getMaterialId
                            materialTypeCode: details.materialTypeCode,
                            substanceCode: details.substanceCode,
                            shapeCode: details.shapeCode,
                            // Other properties
                            quantity: undefined,
                            confidence: undefined,
                            reasoningText: undefined
                        }];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error getting material properties:", error_3);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getOrCreateMaterial(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var materialInfo, substanceResult, materialPropertiesResult, quantity, materialQuery, materialResult, item, readableId, description, itemInsert, materialData, materialInsert;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    if (!(((_b = (_a = args.input.process) === null || _a === void 0 ? void 0 : _a.name) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes("laser")) ||
                        ((_d = (_c = args.input.process) === null || _c === void 0 ? void 0 : _c.name) === null || _d === void 0 ? void 0 : _d.toLowerCase().includes("plasma")) ||
                        ((_f = (_e = args.input.process) === null || _e === void 0 ? void 0 : _e.name) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes("jet")))) return [3 /*break*/, 8];
                    console.log("Found material with laser, plasma, or jet process");
                    materialInfo = {
                        description: args.input.description || "",
                        materialName: ((_g = args.input.material) === null || _g === void 0 ? void 0 : _g.name) || "",
                        materialDisplayName: ((_h = args.input.material) === null || _h === void 0 ? void 0 : _h.display_name) || "",
                        materialFamily: ((_j = args.input.material) === null || _j === void 0 ? void 0 : _j.family) || "",
                        materialClass: ((_k = args.input.material) === null || _k === void 0 ? void 0 : _k.material_class) || "",
                        processName: ((_l = args.input.process) === null || _l === void 0 ? void 0 : _l.name) || ""
                    };
                    return [4 /*yield*/, determineMaterialSubstance(carbon, materialInfo)];
                case 1:
                    substanceResult = _v.sent();
                    if (!substanceResult) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, determineMaterialProperties(carbon, substanceResult.substanceId, args.input)];
                case 2:
                    materialPropertiesResult = _v.sent();
                    if (!materialPropertiesResult) {
                        return [2 /*return*/, null];
                    }
                    quantity = materialPropertiesResult.quantity
                        ? 1 / materialPropertiesResult.quantity
                        : ((_o = (_m = args.input.quantities) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.quantity) || 1;
                    materialQuery = carbon
                        .from("material")
                        .select("id")
                        .eq("companyId", args.companyId);
                    if (substanceResult.substanceId) {
                        materialQuery = materialQuery.eq("materialSubstanceId", substanceResult.substanceId);
                    }
                    else {
                        materialQuery = materialQuery.is("materialSubstanceId", null);
                    }
                    if (materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.gradeId) {
                        materialQuery = materialQuery.eq("gradeId", materialPropertiesResult.gradeId);
                    }
                    else {
                        materialQuery = materialQuery.is("gradeId", null);
                    }
                    if (materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.dimensionId) {
                        materialQuery = materialQuery.eq("dimensionId", materialPropertiesResult.dimensionId);
                    }
                    else {
                        materialQuery = materialQuery.is("dimensionId", null);
                    }
                    if (materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.finishId) {
                        materialQuery = materialQuery.eq("finishId", materialPropertiesResult.finishId);
                    }
                    else {
                        materialQuery = materialQuery.is("finishId", null);
                    }
                    if (materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.typeId) {
                        materialQuery = materialQuery.eq("materialTypeId", materialPropertiesResult.typeId);
                    }
                    else {
                        materialQuery = materialQuery.is("materialTypeId", null);
                    }
                    return [4 /*yield*/, materialQuery.single()];
                case 3:
                    materialResult = _v.sent();
                    if (!materialResult.data) return [3 /*break*/, 5];
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("id, revision, unitOfMeasureCode")
                            .eq("companyId", args.companyId)
                            .eq("readableId", materialResult.data.id)];
                case 4:
                    item = _v.sent();
                    if (item.error || !((_p = item.data) === null || _p === void 0 ? void 0 : _p.length)) {
                        console.error("Failed to find item:");
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            itemId: (_r = (_q = item.data[0]) === null || _q === void 0 ? void 0 : _q.id) !== null && _r !== void 0 ? _r : "",
                            unitOfMeasureCode: (_t = (_s = item.data[0]) === null || _s === void 0 ? void 0 : _s.unitOfMeasureCode) !== null && _t !== void 0 ? _t : "EA",
                            quantity: quantity
                        }];
                case 5:
                    readableId = (0, utils_1.getMaterialId)({
                        materialTypeCode: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.materialTypeCode,
                        substanceCode: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.substanceCode,
                        grade: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.grade,
                        shapeCode: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.shapeCode,
                        dimensions: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.dimensions,
                        finish: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.finish
                    });
                    description = (0, utils_1.getMaterialDescription)({
                        materialType: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.materialType,
                        substance: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.substance,
                        grade: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.grade,
                        shape: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.shape,
                        dimensions: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.dimensions,
                        finish: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.finish
                    });
                    return [4 /*yield*/, carbon
                            .from("item")
                            .insert({
                            readableId: readableId,
                            name: description,
                            type: "Material",
                            replenishmentSystem: "Buy",
                            defaultMethodType: args.defaultMethodType,
                            itemTrackingType: args.defaultTrackingType,
                            unitOfMeasureCode: "EA",
                            active: true,
                            companyId: args.companyId,
                            createdBy: args.createdBy
                        })
                            .select("id, unitOfMeasureCode")
                            .single()];
                case 6:
                    itemInsert = _v.sent();
                    if (itemInsert.error) {
                        console.error("Failed to insert item:", itemInsert.error);
                        return [2 /*return*/, null];
                    }
                    materialData = {
                        id: readableId,
                        companyId: args.companyId,
                        materialSubstanceId: substanceResult.substanceId,
                        materialFormId: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.formId,
                        gradeId: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.gradeId,
                        dimensionId: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.dimensionId,
                        finishId: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.finishId,
                        materialTypeId: materialPropertiesResult === null || materialPropertiesResult === void 0 ? void 0 : materialPropertiesResult.typeId,
                        createdBy: args.createdBy
                    };
                    return [4 /*yield*/, carbon
                            .from("material")
                            .upsert(materialData)
                            .select("id")
                            .single()];
                case 7:
                    materialInsert = _v.sent();
                    if (materialInsert.error) {
                        console.error("Failed to insert material:", materialInsert.error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, {
                            itemId: itemInsert.data.id,
                            unitOfMeasureCode: (_u = itemInsert.data.unitOfMeasureCode) !== null && _u !== void 0 ? _u : "EA",
                            quantity: quantity
                        }];
                case 8: return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Upload CAD model file and create model record
 */
function uploadModelFile(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var file, companyId, itemId, salesOrderLineId, createdBy, existingItem, lineUpdate_1, modelId, fileExtension, modelPath, modelUpload, modelRecord, _a, lineUpdate, itemUpdate, error_4;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    file = args.file, companyId = args.companyId, itemId = args.itemId, salesOrderLineId = args.salesOrderLineId, createdBy = args.createdBy;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("modelUploadId")
                            .eq("id", itemId)
                            .single()];
                case 2:
                    existingItem = _c.sent();
                    if (existingItem.error) {
                        console.error("Failed to read item ".concat(itemId, " before model upload:"), existingItem.error);
                        return [2 /*return*/, false];
                    }
                    if (!existingItem.data.modelUploadId) return [3 /*break*/, 4];
                    return [4 /*yield*/, carbon
                            .from("salesOrderLine")
                            .update({ modelUploadId: existingItem.data.modelUploadId })
                            .eq("id", salesOrderLineId)];
                case 3:
                    lineUpdate_1 = _c.sent();
                    if (lineUpdate_1.error) {
                        console.error("Failed to link existing model to sales order line:", lineUpdate_1.error);
                        return [2 /*return*/, false];
                    }
                    console.log("Item ".concat(itemId, " already has model ").concat(existingItem.data.modelUploadId, "; skipped uploading ").concat(file.name, " and linked line ").concat(salesOrderLineId, " to existing model"));
                    return [2 /*return*/, true];
                case 4:
                    modelId = (0, nanoid_1.nanoid)();
                    fileExtension = file.name.split(".").pop();
                    modelPath = "".concat(companyId, "/models/").concat(modelId, ".").concat(fileExtension);
                    console.log("Uploading CAD model ".concat(file.name, " to ").concat(modelPath));
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(modelPath, file, {
                            upsert: true
                        })];
                case 5:
                    modelUpload = _c.sent();
                    if (modelUpload.error) {
                        console.error("Failed to upload model ".concat(file.name, ":"), modelUpload.error);
                        return [2 /*return*/, false];
                    }
                    if (!((_b = modelUpload.data) === null || _b === void 0 ? void 0 : _b.path)) {
                        console.error("No path returned for uploaded model ".concat(file.name));
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, carbon.from("modelUpload").insert({
                            id: modelId,
                            modelPath: modelUpload.data.path,
                            name: file.name,
                            size: file.size,
                            companyId: companyId,
                            createdBy: createdBy
                        })];
                case 6:
                    modelRecord = _c.sent();
                    if (modelRecord.error) {
                        console.error("Failed to create model record for ".concat(file.name, ":"), modelRecord.error);
                        return [2 /*return*/, false];
                    }
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("salesOrderLine")
                                .update({ modelUploadId: modelId })
                                .eq("id", salesOrderLineId),
                            carbon.from("item").update({ modelUploadId: modelId }).eq("id", itemId)
                        ])];
                case 7:
                    _a = _c.sent(), lineUpdate = _a[0], itemUpdate = _a[1];
                    if (lineUpdate.error) {
                        console.error("Failed to link model to sales order line:", lineUpdate.error);
                        return [2 /*return*/, false];
                    }
                    if (itemUpdate.error) {
                        console.error("Failed to link model to item:", itemUpdate.error);
                        return [2 /*return*/, false];
                    }
                    console.log("Successfully uploaded CAD model ".concat(file.name, " and linked to line ").concat(salesOrderLineId, " and item ").concat(itemId));
                    return [2 /*return*/, true];
                case 8:
                    error_4 = _c.sent();
                    console.error("Error uploading model ".concat(file.name, ":"), error_4);
                    return [2 /*return*/, false];
                case 9: return [2 /*return*/];
            }
        });
    });
}
/**
 * Upload file to Carbon storage and create document record using upsertDocument
 */
function uploadFileToItem(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var file, companyId, itemId, storagePath, fileUpload, error_5;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    file = args.file, companyId = args.companyId, itemId = args.itemId;
                    if (file.name === "flat.step")
                        return [2 /*return*/, false];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    storagePath = "".concat(companyId, "/parts/").concat(itemId, "/").concat(stripSpecialCharacters(file.name));
                    console.log("Uploading ".concat(file.name, " to ").concat(storagePath));
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(storagePath, file, {
                            cacheControl: "".concat(12 * 60 * 60),
                            upsert: true
                        })];
                case 2:
                    fileUpload = _b.sent();
                    if (fileUpload.error) {
                        console.error("Failed to upload file ".concat(file.name, ":"), fileUpload.error);
                        return [2 /*return*/, false];
                    }
                    if (!((_a = fileUpload.data) === null || _a === void 0 ? void 0 : _a.path)) {
                        console.error("No path returned for uploaded file ".concat(file.name));
                        return [2 /*return*/, false];
                    }
                    return [2 /*return*/, true];
                case 3:
                    error_5 = _b.sent();
                    console.error("Error uploading file ".concat(file.name, ":"), error_5);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * Download and upload supporting files for a component
 */
function processSupportingFiles(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var supportingFiles, companyId, lineId, itemId, createdBy, hasModel, _i, supportingFiles_1, supportingFile, file, uploadSuccess, uploadSuccess, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    supportingFiles = args.supportingFiles, companyId = args.companyId, lineId = args.lineId, itemId = args.itemId, createdBy = args.createdBy;
                    if (!(supportingFiles === null || supportingFiles === void 0 ? void 0 : supportingFiles.length)) {
                        return [2 /*return*/];
                    }
                    console.log("Processing ".concat(supportingFiles.length, " supporting files for line ").concat(lineId));
                    hasModel = false;
                    _i = 0, supportingFiles_1 = supportingFiles;
                    _a.label = 1;
                case 1:
                    if (!(_i < supportingFiles_1.length)) return [3 /*break*/, 10];
                    supportingFile = supportingFiles_1[_i];
                    if (!supportingFile.url || !supportingFile.filename) {
                        console.warn("Skipping supporting file with missing URL or filename:", supportingFile);
                        return [3 /*break*/, 9];
                    }
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, downloadFileFromUrl(supportingFile.url, supportingFile.filename)];
                case 3:
                    file = _a.sent();
                    if (!file) {
                        console.error("Failed to download supporting file: ".concat(supportingFile.filename));
                        return [3 /*break*/, 9];
                    }
                    if (!(isModelFile(file.name) && !hasModel)) return [3 /*break*/, 5];
                    console.log("Processing ".concat(file.name, " as CAD model"));
                    return [4 /*yield*/, uploadModelFile(carbon, {
                            file: file,
                            companyId: companyId,
                            itemId: itemId,
                            salesOrderLineId: lineId,
                            createdBy: createdBy
                        })];
                case 4:
                    uploadSuccess = _a.sent();
                    if (uploadSuccess) {
                        hasModel = true;
                    }
                    else {
                        console.error("Failed to upload CAD model: ".concat(supportingFile.filename));
                    }
                    return [3 /*break*/, 7];
                case 5:
                    console.log("Processing ".concat(file.name, " as document"));
                    return [4 /*yield*/, uploadFileToItem(carbon, {
                            file: file,
                            companyId: companyId,
                            itemId: itemId,
                            createdBy: createdBy
                        })];
                case 6:
                    uploadSuccess = _a.sent();
                    if (!uploadSuccess) {
                        console.error("Failed to upload supporting file: ".concat(supportingFile.filename));
                    }
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_6 = _a.sent();
                    console.error("Error processing supporting file ".concat(supportingFile.filename, ":"), error_6);
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getCustomerIdAndContactId(carbon, paperless, args) {
    return __awaiter(this, void 0, void 0, function () {
        var customerId, customerContactId, company, contact, _a, createdBy, paperlessPartsCustomerId, existingCustomerId, customerName, existingCustomerByName, newCustomer, customerName_1, existingAccountsResponse, paperlessPartsAccountId, existingPaperlessAccount, newPaperlessPartsAccount, err_1, errorBody, e_1, errorBody, e_2, searchStrategies, _i, searchStrategies_1, searchTerm, searchResponse, allAccountsResponse, existingCustomerIdByPaperless, existingCustomerByName, customerData, newCustomer, paperlessPartsContactId, existingContactId, existingCustomerContact, existingContactByEmail, contactId, updatedContact, newContact, existingCustomerContactLink, newCustomerContact;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    company = args.company, contact = args.contact, _a = args.createdBy, createdBy = _a === void 0 ? "system" : _a;
                    if (!contact) {
                        throw new Error("Missing contact from Paperless Parts");
                    }
                    if (!contact.account) return [3 /*break*/, 9];
                    paperlessPartsCustomerId = (_b = contact.account) === null || _b === void 0 ? void 0 : _b.id;
                    return [4 /*yield*/, lookupEntityByPaperlessId(carbon, "customer", "paperlessPartsId", String(paperlessPartsCustomerId), company.id)];
                case 1:
                    existingCustomerId = _d.sent();
                    if (!existingCustomerId) return [3 /*break*/, 2];
                    customerId = existingCustomerId;
                    return [3 /*break*/, 8];
                case 2:
                    customerName = (_c = contact.account) === null || _c === void 0 ? void 0 : _c.name;
                    return [4 /*yield*/, carbon
                            .from("customer")
                            .select("id")
                            .eq("companyId", company.id)
                            .eq("name", customerName)
                            .maybeSingle()];
                case 3:
                    existingCustomerByName = _d.sent();
                    if (!existingCustomerByName.data) return [3 /*break*/, 5];
                    customerId = existingCustomerByName.data.id;
                    // Create the mapping for the existing customer
                    return [4 /*yield*/, createPaperlessMapping(carbon, "customer", customerId, "paperlessPartsId", String(contact.account.id), company.id)];
                case 4:
                    // Create the mapping for the existing customer
                    _d.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, carbon
                        .from("customer")
                        .upsert({
                        companyId: company.id,
                        name: customerName,
                        currencyCode: company.baseCurrencyCode,
                        createdBy: createdBy
                    }, {
                        onConflict: "name, companyId"
                    })
                        .select()
                        .single()];
                case 6:
                    newCustomer = _d.sent();
                    if (newCustomer.error || !newCustomer.data) {
                        console.error("Failed to create customer in Carbon", newCustomer.error);
                        throw new Error("Failed to create customer in Carbon");
                    }
                    customerId = newCustomer.data.id;
                    // Create the mapping for the new customer
                    return [4 /*yield*/, createPaperlessMapping(carbon, "customer", customerId, "paperlessPartsId", String(contact.account.id), company.id)];
                case 7:
                    // Create the mapping for the new customer
                    _d.sent();
                    _d.label = 8;
                case 8: return [3 /*break*/, 41];
                case 9:
                    customerName_1 = "".concat(contact.first_name, " ").concat(contact.last_name).trim();
                    return [4 /*yield*/, paperless.accounts.listAccounts({
                            search: customerName_1
                        })];
                case 10:
                    existingAccountsResponse = _d.sent();
                    paperlessPartsAccountId = 0;
                    existingPaperlessAccount = undefined;
                    if (existingAccountsResponse.data &&
                        existingAccountsResponse.data.length > 0) {
                        // Look for an exact name match
                        existingPaperlessAccount = existingAccountsResponse.data.find(function (account) { var _a; return ((_a = account.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) === customerName_1.toLowerCase(); });
                    }
                    if (!existingPaperlessAccount) return [3 /*break*/, 11];
                    // Use the existing account ID
                    paperlessPartsAccountId = existingPaperlessAccount.id;
                    return [3 /*break*/, 31];
                case 11:
                    newPaperlessPartsAccount = void 0;
                    _d.label = 12;
                case 12:
                    _d.trys.push([12, 14, , 19]);
                    return [4 /*yield*/, paperless.accounts.createAccount({
                            name: customerName_1
                        })];
                case 13:
                    newPaperlessPartsAccount = _d.sent();
                    return [3 /*break*/, 19];
                case 14:
                    err_1 = _d.sent();
                    if (!(err_1 instanceof Response)) return [3 /*break*/, 18];
                    _d.label = 15;
                case 15:
                    _d.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, err_1.text()];
                case 16:
                    errorBody = _d.sent();
                    console.log("Error response body:", errorBody);
                    return [3 /*break*/, 18];
                case 17:
                    e_1 = _d.sent();
                    console.log("Could not read error body:", e_1);
                    return [3 /*break*/, 18];
                case 18:
                    // Set to an error state to trigger the fallback logic
                    newPaperlessPartsAccount = { error: err_1, data: null };
                    return [3 /*break*/, 19];
                case 19:
                    if (!newPaperlessPartsAccount.error) return [3 /*break*/, 30];
                    // If we get an error creating the account (e.g., "An account with this name already exists"),
                    // search again more thoroughly to find the existing account
                    console.log("Account creation failed in Paperless Parts, searching more thoroughly for: ".concat(customerName_1));
                    if (!(newPaperlessPartsAccount.error instanceof Response)) return [3 /*break*/, 23];
                    _d.label = 20;
                case 20:
                    _d.trys.push([20, 22, , 23]);
                    return [4 /*yield*/, newPaperlessPartsAccount.error.text()];
                case 21:
                    errorBody = _d.sent();
                    console.log("Error response body:", errorBody);
                    return [3 /*break*/, 23];
                case 22:
                    e_2 = _d.sent();
                    console.log("Could not read error body:", e_2);
                    return [3 /*break*/, 23];
                case 23:
                    searchStrategies = [
                        customerName_1.split(" ")[0], // First name only
                        customerName_1.split(" ").pop() || customerName_1, // Last name only
                        customerName_1 // Full name again (in case initial search had timing issues)
                    ];
                    _i = 0, searchStrategies_1 = searchStrategies;
                    _d.label = 24;
                case 24:
                    if (!(_i < searchStrategies_1.length)) return [3 /*break*/, 27];
                    searchTerm = searchStrategies_1[_i];
                    return [4 /*yield*/, paperless.accounts.listAccounts({
                            search: searchTerm
                        })];
                case 25:
                    searchResponse = _d.sent();
                    if (searchResponse.data && searchResponse.data.length > 0) {
                        // Look for an exact or close match
                        existingPaperlessAccount = searchResponse.data.find(function (account) {
                            var _a;
                            var accountNameLower = ((_a = account.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) || "";
                            var customerNameLower = customerName_1.toLowerCase();
                            return (accountNameLower === customerNameLower ||
                                accountNameLower.includes(customerNameLower) ||
                                customerNameLower.includes(accountNameLower));
                        });
                        if (existingPaperlessAccount) {
                            return [3 /*break*/, 27];
                        }
                    }
                    _d.label = 26;
                case 26:
                    _i++;
                    return [3 /*break*/, 24];
                case 27:
                    if (!!existingPaperlessAccount) return [3 /*break*/, 29];
                    return [4 /*yield*/, paperless.accounts.listAccounts({})];
                case 28:
                    allAccountsResponse = _d.sent();
                    if (allAccountsResponse.data && allAccountsResponse.data.length > 0) {
                        // Look for exact name match
                        existingPaperlessAccount = allAccountsResponse.data.find(function (account) {
                            var _a;
                            return ((_a = account.name) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase()) ===
                                customerName_1.toLowerCase();
                        });
                    }
                    _d.label = 29;
                case 29:
                    if (existingPaperlessAccount) {
                        paperlessPartsAccountId = existingPaperlessAccount.id;
                    }
                    // If we still haven't found an account, log the error but continue without throwing
                    if (!existingPaperlessAccount) {
                        console.error("Could not create or find account in Paperless Parts for: ".concat(customerName_1, ". Error:"), newPaperlessPartsAccount.error);
                        // Use a fallback approach - we'll create the customer in Carbon without a Paperless Parts account ID
                        paperlessPartsAccountId = 0; // Use 0 as a fallback to indicate no Paperless Parts account
                    }
                    return [3 /*break*/, 31];
                case 30:
                    if (!newPaperlessPartsAccount.data) {
                        console.error("Failed to create account in Paperless Parts - no data returned");
                        paperlessPartsAccountId = 0; // Use 0 as a fallback
                    }
                    else {
                        paperlessPartsAccountId = newPaperlessPartsAccount.data.id;
                    }
                    _d.label = 31;
                case 31:
                    existingCustomerIdByPaperless = null;
                    if (!(paperlessPartsAccountId > 0)) return [3 /*break*/, 33];
                    return [4 /*yield*/, lookupEntityByPaperlessId(carbon, "customer", "paperlessPartsId", String(paperlessPartsAccountId), company.id)];
                case 32:
                    existingCustomerIdByPaperless = _d.sent();
                    _d.label = 33;
                case 33:
                    if (!existingCustomerIdByPaperless) return [3 /*break*/, 34];
                    customerId = existingCustomerIdByPaperless;
                    return [3 /*break*/, 41];
                case 34: return [4 /*yield*/, carbon
                        .from("customer")
                        .select("id")
                        .eq("companyId", company.id)
                        .eq("name", customerName_1)
                        .maybeSingle()];
                case 35:
                    existingCustomerByName = _d.sent();
                    if (!existingCustomerByName.data) return [3 /*break*/, 38];
                    customerId = existingCustomerByName.data.id;
                    if (!(paperlessPartsAccountId > 0)) return [3 /*break*/, 37];
                    return [4 /*yield*/, createPaperlessMapping(carbon, "customer", customerId, "paperlessPartsId", String(paperlessPartsAccountId), company.id)];
                case 36:
                    _d.sent();
                    _d.label = 37;
                case 37: return [3 /*break*/, 41];
                case 38:
                    customerData = {
                        companyId: company.id,
                        name: customerName_1,
                        currencyCode: company.baseCurrencyCode,
                        createdBy: createdBy
                    };
                    return [4 /*yield*/, carbon
                            .from("customer")
                            .upsert(customerData, {
                            onConflict: "name, companyId"
                        })
                            .select()
                            .single()];
                case 39:
                    newCustomer = _d.sent();
                    if (newCustomer.error || !newCustomer.data) {
                        console.error("Failed to create customer in Carbon", newCustomer.error);
                        throw new Error("Failed to create customer in Carbon");
                    }
                    customerId = newCustomer.data.id;
                    if (!(paperlessPartsAccountId > 0)) return [3 /*break*/, 41];
                    return [4 /*yield*/, createPaperlessMapping(carbon, "customer", customerId, "paperlessPartsId", String(paperlessPartsAccountId), company.id)];
                case 40:
                    _d.sent();
                    _d.label = 41;
                case 41:
                    paperlessPartsContactId = contact.id;
                    return [4 /*yield*/, lookupEntityByPaperlessId(carbon, "contact", "paperlessPartsId", String(paperlessPartsContactId), company.id)];
                case 42:
                    existingContactId = _d.sent();
                    if (!existingContactId) return [3 /*break*/, 44];
                    return [4 /*yield*/, carbon
                            .from("customerContact")
                            .select("id")
                            .eq("contactId", existingContactId)
                            .maybeSingle()];
                case 43:
                    existingCustomerContact = _d.sent();
                    if (existingCustomerContact.data) {
                        customerContactId = existingCustomerContact.data.id;
                    }
                    _d.label = 44;
                case 44:
                    if (!!customerContactId) return [3 /*break*/, 55];
                    return [4 /*yield*/, carbon
                            .from("contact")
                            .select("id")
                            .eq("companyId", company.id)
                            .eq("email", contact.email)
                            .eq("isCustomer", true)
                            .maybeSingle()];
                case 45:
                    existingContactByEmail = _d.sent();
                    contactId = void 0;
                    if (!existingContactByEmail.data) return [3 /*break*/, 48];
                    return [4 /*yield*/, carbon
                            .from("contact")
                            .update({
                            firstName: contact.first_name,
                            lastName: contact.last_name
                        })
                            .eq("id", existingContactByEmail.data.id)
                            .select()
                            .single()];
                case 46:
                    updatedContact = _d.sent();
                    if (updatedContact.error || !updatedContact.data) {
                        console.error("Failed to update contact in Carbon", updatedContact);
                        return [2 /*return*/, {
                                customerContactId: null,
                                customerId: customerId
                            }];
                    }
                    contactId = updatedContact.data.id;
                    // Create the mapping for the existing contact
                    return [4 /*yield*/, createPaperlessMapping(carbon, "contact", contactId, "paperlessPartsId", String(contact.id), company.id)];
                case 47:
                    // Create the mapping for the existing contact
                    _d.sent();
                    return [3 /*break*/, 51];
                case 48: return [4 /*yield*/, carbon
                        .from("contact")
                        .insert({
                        companyId: company.id,
                        firstName: contact.first_name,
                        lastName: contact.last_name,
                        email: contact.email,
                        isCustomer: true
                    })
                        .select()
                        .single()];
                case 49:
                    newContact = _d.sent();
                    if (newContact.error || !newContact.data) {
                        console.error("Failed to create contact in Carbon", newContact);
                        return [2 /*return*/, {
                                customerContactId: null,
                                customerId: customerId
                            }];
                    }
                    contactId = newContact.data.id;
                    // Create the mapping for the new contact
                    return [4 /*yield*/, createPaperlessMapping(carbon, "contact", contactId, "paperlessPartsId", String(contact.id), company.id)];
                case 50:
                    // Create the mapping for the new contact
                    _d.sent();
                    _d.label = 51;
                case 51: return [4 /*yield*/, carbon
                        .from("customerContact")
                        .select("id")
                        .eq("customerId", customerId)
                        .eq("contactId", contactId)
                        .maybeSingle()];
                case 52:
                    existingCustomerContactLink = _d.sent();
                    if (!existingCustomerContactLink.data) return [3 /*break*/, 53];
                    customerContactId = existingCustomerContactLink.data.id;
                    return [3 /*break*/, 55];
                case 53: return [4 /*yield*/, carbon
                        .from("customerContact")
                        .insert({
                        customerId: customerId,
                        contactId: contactId
                    })
                        .select()
                        .single()];
                case 54:
                    newCustomerContact = _d.sent();
                    if (newCustomerContact.error || !newCustomerContact.data) {
                        console.error("Failed to create customerContact", newCustomerContact);
                        return [2 /*return*/, {
                                customerContactId: null,
                                customerId: customerId
                            }];
                    }
                    customerContactId = newCustomerContact.data.id;
                    _d.label = 55;
                case 55: return [2 /*return*/, {
                        customerId: customerId,
                        customerContactId: customerContactId
                    }];
            }
        });
    });
}
function getCustomerLocationIds(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var invoiceLocationId, shipmentLocationId, customerId, company, billingInfo, shippingInfo, paperlessPartsBillingId, existingInvoiceLocationId, existingAddress, addressId, existingCustomerLocation, countryCode, country, newAddress, newCustomerLocation, paperlessPartsShippingId, existingShipmentLocationId, existingAddress, addressId, existingCustomerLocation, countryCode, country, newAddress, name_1, newCustomerLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    invoiceLocationId = null;
                    shipmentLocationId = null;
                    customerId = args.customerId, company = args.company, billingInfo = args.billingInfo, shippingInfo = args.shippingInfo;
                    if (!billingInfo) return [3 /*break*/, 12];
                    paperlessPartsBillingId = billingInfo.id;
                    return [4 /*yield*/, lookupEntityByPaperlessId(carbon, "customerLocation", "paperlessPartsId", String(paperlessPartsBillingId), company.id)];
                case 1:
                    existingInvoiceLocationId = _a.sent();
                    if (!existingInvoiceLocationId) return [3 /*break*/, 2];
                    invoiceLocationId = existingInvoiceLocationId;
                    return [3 /*break*/, 12];
                case 2: return [4 /*yield*/, carbon
                        .from("address")
                        .select("id")
                        .eq("companyId", company.id)
                        .ilike("addressLine1", billingInfo.address1)
                        .ilike("city", billingInfo.city)
                        .maybeSingle()];
                case 3:
                    existingAddress = _a.sent();
                    addressId = null;
                    if (!existingAddress.data) return [3 /*break*/, 5];
                    return [4 /*yield*/, carbon
                            .from("customerLocation")
                            .select("id")
                            .eq("customerId", customerId)
                            .eq("addressId", existingAddress.data.id)
                            .maybeSingle()];
                case 4:
                    existingCustomerLocation = _a.sent();
                    if (existingCustomerLocation.data) {
                        invoiceLocationId = existingCustomerLocation.data.id;
                    }
                    else {
                        addressId = existingAddress.data.id;
                    }
                    _a.label = 5;
                case 5:
                    if (!!invoiceLocationId) return [3 /*break*/, 12];
                    if (!!addressId) return [3 /*break*/, 9];
                    countryCode = billingInfo.country;
                    if (!(countryCode && countryCode.length == 3)) return [3 /*break*/, 7];
                    return [4 /*yield*/, carbon
                            .from("country")
                            .select("alpha2")
                            .eq("alpha3", countryCode)
                            .maybeSingle()];
                case 6:
                    country = _a.sent();
                    if (country.data) {
                        countryCode = country.data.alpha2;
                    }
                    _a.label = 7;
                case 7:
                    if (countryCode && countryCode.length > 3) {
                        countryCode = countryCode.slice(0, 2);
                    }
                    return [4 /*yield*/, carbon
                            .from("address")
                            .insert({
                            companyId: company.id,
                            addressLine1: billingInfo.address1,
                            addressLine2: billingInfo.address2 || null,
                            city: billingInfo.city,
                            stateProvince: billingInfo.state,
                            postalCode: billingInfo.postal_code,
                            countryCode: countryCode
                        })
                            .select()
                            .single()];
                case 8:
                    newAddress = _a.sent();
                    if (newAddress.error || !newAddress.data) {
                        console.error("Failed to create billing address in Carbon", newAddress.error);
                        throw new Error("Failed to create billing address in Carbon");
                    }
                    addressId = newAddress.data.id;
                    _a.label = 9;
                case 9: return [4 /*yield*/, carbon
                        .from("customerLocation")
                        .insert({
                        name: billingInfo.city && billingInfo.state
                            ? "".concat(billingInfo.city, ", ").concat(billingInfo.state)
                            : billingInfo.city || billingInfo.state || "",
                        customerId: customerId,
                        addressId: addressId
                    })
                        .select()
                        .single()];
                case 10:
                    newCustomerLocation = _a.sent();
                    if (newCustomerLocation.error || !newCustomerLocation.data) {
                        throw new Error("Failed to create customer billing location in Carbon");
                    }
                    invoiceLocationId = newCustomerLocation.data.id;
                    // Create the mapping for the new billing location
                    return [4 /*yield*/, createPaperlessMapping(carbon, "customerLocation", invoiceLocationId, "paperlessPartsId", String(billingInfo.id), company.id)];
                case 11:
                    // Create the mapping for the new billing location
                    _a.sent();
                    _a.label = 12;
                case 12:
                    if (!shippingInfo) return [3 /*break*/, 24];
                    paperlessPartsShippingId = shippingInfo.id;
                    return [4 /*yield*/, lookupEntityByPaperlessId(carbon, "customerLocation", "paperlessPartsId", String(paperlessPartsShippingId), company.id)];
                case 13:
                    existingShipmentLocationId = _a.sent();
                    if (!existingShipmentLocationId) return [3 /*break*/, 14];
                    shipmentLocationId = existingShipmentLocationId;
                    return [3 /*break*/, 24];
                case 14: return [4 /*yield*/, carbon
                        .from("address")
                        .select("id")
                        .eq("companyId", company.id)
                        .ilike("addressLine1", shippingInfo.address1)
                        .ilike("city", shippingInfo.city)
                        .maybeSingle()];
                case 15:
                    existingAddress = _a.sent();
                    addressId = null;
                    if (!existingAddress.data) return [3 /*break*/, 17];
                    return [4 /*yield*/, carbon
                            .from("customerLocation")
                            .select("id")
                            .eq("customerId", customerId)
                            .eq("addressId", existingAddress.data.id)
                            .maybeSingle()];
                case 16:
                    existingCustomerLocation = _a.sent();
                    if (existingCustomerLocation.data) {
                        shipmentLocationId = existingCustomerLocation.data.id;
                    }
                    else {
                        addressId = existingAddress.data.id;
                    }
                    _a.label = 17;
                case 17:
                    if (!!shipmentLocationId) return [3 /*break*/, 24];
                    if (!!addressId) return [3 /*break*/, 21];
                    countryCode = shippingInfo.country;
                    if (!(countryCode && countryCode.length == 3)) return [3 /*break*/, 19];
                    return [4 /*yield*/, carbon
                            .from("country")
                            .select("alpha2")
                            .eq("alpha3", countryCode)
                            .maybeSingle()];
                case 18:
                    country = _a.sent();
                    if (country.data) {
                        countryCode = country.data.alpha2;
                    }
                    _a.label = 19;
                case 19:
                    if (countryCode && countryCode.length > 3) {
                        countryCode = countryCode.slice(0, 2);
                    }
                    return [4 /*yield*/, carbon
                            .from("address")
                            .insert({
                            companyId: company.id,
                            addressLine1: shippingInfo.address1,
                            addressLine2: shippingInfo.address2 || null,
                            city: shippingInfo.city,
                            stateProvince: shippingInfo.state,
                            postalCode: shippingInfo.postal_code,
                            countryCode: countryCode
                        })
                            .select()
                            .single()];
                case 20:
                    newAddress = _a.sent();
                    if (newAddress.error || !newAddress.data) {
                        console.error("Failed to create shipping address in Carbon", newAddress.error);
                        throw new Error("Failed to create shipping address in Carbon");
                    }
                    addressId = newAddress.data.id;
                    _a.label = 21;
                case 21:
                    name_1 = shippingInfo.facility_name || shippingInfo.business_name;
                    if (!name_1) {
                        name_1 = shippingInfo.city || shippingInfo.state || "";
                    }
                    return [4 /*yield*/, carbon
                            .from("customerLocation")
                            .insert({
                            name: name_1,
                            customerId: customerId,
                            addressId: addressId
                        })
                            .select()
                            .single()];
                case 22:
                    newCustomerLocation = _a.sent();
                    if (newCustomerLocation.error || !newCustomerLocation.data) {
                        throw new Error("Failed to create customer shipping location in Carbon");
                    }
                    shipmentLocationId = newCustomerLocation.data.id;
                    // Create the mapping for the new shipping location
                    return [4 /*yield*/, createPaperlessMapping(carbon, "customerLocation", shipmentLocationId, "paperlessPartsId", String(shippingInfo.id), company.id)];
                case 23:
                    // Create the mapping for the new shipping location
                    _a.sent();
                    _a.label = 24;
                case 24: return [2 /*return*/, {
                        invoiceLocationId: invoiceLocationId,
                        shipmentLocationId: shipmentLocationId
                    }];
            }
        });
    });
}
function getEmployeeAndSalesPersonId(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var company, estimator, salesPerson, _a, createdBy, employees, salesPersonId, estimatorId;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    company = args.company, estimator = args.estimator, salesPerson = args.salesPerson, _a = args.createdBy, createdBy = _a === void 0 ? "system" : _a;
                    return [4 /*yield*/, carbon
                            .from("employees")
                            .select("id, email")
                            .or("email.eq.".concat(estimator === null || estimator === void 0 ? void 0 : estimator.email, ",email.eq.").concat(salesPerson === null || salesPerson === void 0 ? void 0 : salesPerson.email))
                            .eq("companyId", company.id)];
                case 1:
                    employees = _f.sent();
                    if (employees.error) {
                        console.error("Failed to fetch employees", employees.error);
                        return [2 /*return*/, {
                                salesPersonId: null,
                                estimatorId: null,
                                createdBy: createdBy
                            }];
                    }
                    salesPersonId = (_c = (_b = employees.data) === null || _b === void 0 ? void 0 : _b.find(function (employee) { return employee.email === (salesPerson === null || salesPerson === void 0 ? void 0 : salesPerson.email); })) === null || _c === void 0 ? void 0 : _c.id;
                    estimatorId = (_e = (_d = employees.data) === null || _d === void 0 ? void 0 : _d.find(function (employee) { return employee.email === (estimator === null || estimator === void 0 ? void 0 : estimator.email); })) === null || _e === void 0 ? void 0 : _e.id;
                    return [2 /*return*/, {
                            salesPersonId: salesPersonId,
                            estimatorId: estimatorId,
                            createdBy: estimatorId !== null && estimatorId !== void 0 ? estimatorId : createdBy
                        }];
            }
        });
    });
}
function getOrderLocationId(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var company, sendFrom, locations, location_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    company = args.company, sendFrom = args.sendFrom;
                    return [4 /*yield*/, carbon
                            .from("location")
                            .select("id, name")
                            .eq("companyId", company.id)
                            .order("createdAt", { ascending: true })];
                case 1:
                    locations = _c.sent();
                    if (sendFrom) {
                        location_1 = (_a = locations.data) === null || _a === void 0 ? void 0 : _a.find(function (location) { var _a, _b; return ((_a = location.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === ((_b = sendFrom.name) === null || _b === void 0 ? void 0 : _b.toLowerCase()); });
                        if (location_1) {
                            return [2 /*return*/, location_1.id];
                        }
                    }
                    // Fallback to the first created location
                    if (locations.data && locations.data.length > 0 && ((_b = locations.data[0]) === null || _b === void 0 ? void 0 : _b.id)) {
                        return [2 /*return*/, locations.data[0].id];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
function getCarbonOrderStatus(status) {
    switch (status) {
        case "confirmed":
            return "Confirmed";
        case "pending":
        case "on_hold":
            return "Needs Approval";
        case "in_process":
            return "Confirmed";
        case "completed":
            return "Completed";
        case "cancelled":
            return "Cancelled";
        default:
            return "Draft";
    }
}
/**
 * Find existing part by Paperless Parts external ID
 */
function getPaperlessPart(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, paperlessPartsId, paperlessPartNumber, paperlessPartRevision, paperlessPartName, existingItemId, existingItem, existingPart;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    companyId = args.companyId, paperlessPartsId = args.paperlessPartsId, paperlessPartNumber = args.paperlessPartNumber, paperlessPartRevision = args.paperlessPartRevision, paperlessPartName = args.paperlessPartName;
                    return [4 /*yield*/, lookupEntityByPaperlessId(carbon, "item", "paperlessPartsId", String(paperlessPartsId), companyId)];
                case 1:
                    existingItemId = _a.sent();
                    if (!existingItemId) return [3 /*break*/, 3];
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("id, readableId, revision")
                            .eq("id", existingItemId)
                            .single()];
                case 2:
                    existingItem = _a.sent();
                    if (existingItem.data) {
                        return [2 /*return*/, {
                                itemId: existingItem.data.id,
                                partId: existingItem.data.readableId,
                                revision: existingItem.data.revision
                            }];
                    }
                    _a.label = 3;
                case 3:
                    if (!(paperlessPartNumber && paperlessPartRevision && paperlessPartName)) return [3 /*break*/, 5];
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("id, readableId, revision, name")
                            .eq("companyId", companyId)
                            .eq("readableId", paperlessPartNumber)
                            .eq("revision", paperlessPartRevision)
                            .eq("name", paperlessPartName)
                            .maybeSingle()];
                case 4:
                    existingPart = _a.sent();
                    if (existingPart.data) {
                        return [2 /*return*/, {
                                itemId: existingPart.data.id,
                                partId: existingPart.data.readableId,
                                revision: existingPart.data.revision
                            }];
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
/**
 * Download and process thumbnail from URL, upload to Carbon storage
 */
function downloadAndUploadThumbnail(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var thumbnailUrl, companyId, itemId, response, imageBuffer, blob, formData, supabaseUrl, resizerResponse, contentType, isJpg, fileExtension, processedImageBuffer, processedBlob, fileName, thumbnailFile, storagePath, _a, data, error, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    thumbnailUrl = args.thumbnailUrl, companyId = args.companyId, itemId = args.itemId;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch(thumbnailUrl)];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        console.error("Failed to download thumbnail: ".concat(response.statusText));
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.arrayBuffer()];
                case 3:
                    imageBuffer = _b.sent();
                    blob = new Blob([imageBuffer]);
                    formData = new FormData();
                    formData.append("file", blob);
                    formData.append("contained", "true");
                    supabaseUrl = process.env.SUPABASE_URL;
                    if (!supabaseUrl) {
                        console.error("SUPABASE_URL environment variable not found");
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, fetch("".concat(supabaseUrl, "/functions/v1/image-resizer"), {
                            method: "POST",
                            body: formData
                        })];
                case 4:
                    resizerResponse = _b.sent();
                    if (!resizerResponse.ok) {
                        console.error("Image resizer failed: ".concat(resizerResponse.statusText));
                        return [2 /*return*/, null];
                    }
                    contentType = resizerResponse.headers.get("Content-Type") || "image/png";
                    isJpg = contentType.includes("image/jpeg");
                    fileExtension = isJpg ? "jpg" : "png";
                    return [4 /*yield*/, resizerResponse.arrayBuffer()];
                case 5:
                    processedImageBuffer = _b.sent();
                    processedBlob = new Blob([processedImageBuffer], {
                        type: contentType
                    });
                    fileName = "".concat((0, nanoid_1.nanoid)(), ".").concat(fileExtension);
                    thumbnailFile = new File([processedBlob], fileName, {
                        type: contentType
                    });
                    storagePath = "".concat(companyId, "/thumbnails/").concat(itemId, "/").concat(fileName);
                    return [4 /*yield*/, carbon.storage
                            .from("private")
                            .upload(storagePath, thumbnailFile, {
                            upsert: true
                        })];
                case 6:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("Failed to upload thumbnail to storage:", error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, (data === null || data === void 0 ? void 0 : data.path) || null];
                case 7:
                    error_7 = _b.sent();
                    console.error("Error processing thumbnail:", error_7);
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/**
 * Create new item and part from Paperless Parts component data
 */
function createPartFromComponent(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, createdBy, component, defaultMethodType, defaultTrackingType, _a, billOfProcessBlackList, operations, materials, material, _loop_1, _b, _c, _d, e_3_1, index, _e, _f, _g, childRef, childComponent, childItemId, childIsPurchased, methodType, materialMakeMethodId, materialMakeMethod, err_2, e_4_1, isPurchased, partId, revision, rawName, name, existingItem, unitCost, itemCostUpdate, itemInsert, itemId, unitCost, itemCostUpdate, thumbnailPath, thumbnailUpdate, partInsert, makeMethod, makeMethodId, operationInsert, materialInsert;
        var _h, e_3, _j, _k, _l, e_4, _m, _o;
        var _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        return __generator(this, function (_4) {
            switch (_4.label) {
                case 0:
                    companyId = args.companyId, createdBy = args.createdBy, component = args.component, defaultMethodType = args.defaultMethodType, defaultTrackingType = args.defaultTrackingType, _a = args.billOfProcessBlackList, billOfProcessBlackList = _a === void 0 ? [] : _a;
                    operations = [];
                    materials = [];
                    if (!(component.material_operations || component.material)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getOrCreateMaterial(carbon, {
                            companyId: companyId,
                            createdBy: createdBy,
                            input: __assign(__assign({}, component), { description: component.description || component.part_name || "" }),
                            defaultMethodType: defaultMethodType,
                            defaultTrackingType: defaultTrackingType
                        })];
                case 1:
                    material = _4.sent();
                    if (material) {
                        materials.push({
                            itemId: material.itemId,
                            itemType: "Material",
                            quantity: material.quantity,
                            methodType: defaultMethodType,
                            companyId: companyId,
                            createdBy: createdBy,
                            unitOfMeasureCode: "EA"
                        });
                    }
                    _4.label = 2;
                case 2:
                    if (!component.shop_operations) return [3 /*break*/, 15];
                    _4.label = 3;
                case 3:
                    _4.trys.push([3, 9, 10, 15]);
                    _loop_1 = function () {
                        var index, operation, operationName_1, isBlacklisted, process;
                        return __generator(this, function (_5) {
                            switch (_5.label) {
                                case 0:
                                    _k = _d.value;
                                    _b = false;
                                    index = _k[0], operation = _k[1];
                                    if (!(operation.category === "operation")) return [3 /*break*/, 2];
                                    operationName_1 = (_p = operation.operation_definition_name) !== null && _p !== void 0 ? _p : operation.name;
                                    if (billOfProcessBlackList.length > 0 && operationName_1) {
                                        isBlacklisted = billOfProcessBlackList.some(function (blacklistedName) {
                                            return operationName_1.toLowerCase().includes(blacklistedName.toLowerCase());
                                        });
                                        if (isBlacklisted) {
                                            console.log("Skipping blacklisted operation: ".concat(operationName_1));
                                            return [2 /*return*/, "continue"];
                                        }
                                    }
                                    return [4 /*yield*/, getOrCreateProcess(carbon, operation, companyId, createdBy)];
                                case 1:
                                    process = _5.sent();
                                    if (process) {
                                        operations.push({
                                            order: (_q = operation.position) !== null && _q !== void 0 ? _q : index + 1,
                                            operationOrder: "After Previous",
                                            operationType: process.processType === "Inside" ? "Inside" : "Outside",
                                            description: (_s = (_r = operation.operation_definition_name) !== null && _r !== void 0 ? _r : operation.name) !== null && _s !== void 0 ? _s : "Operation ".concat((_t = operation.position) !== null && _t !== void 0 ? _t : index + 1),
                                            processId: process.id,
                                            companyId: companyId,
                                            createdBy: createdBy,
                                            setupTime: ((_u = operation.setup_time) !== null && _u !== void 0 ? _u : 0) * 60,
                                            setupUnit: "Total Minutes",
                                            // laborTime: // TODO: we'd have to standardize on a costing variable to use for this
                                            machineTime: ((_v = operation.runtime) !== null && _v !== void 0 ? _v : 0) * 60,
                                            machineUnit: "Minutes/Piece",
                                            workInstruction: operation.notes
                                                ? (0, utils_1.textToTiptap)(operation.notes)
                                                : {}
                                        });
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    console.error("operation.category is not operation", operation);
                                    _5.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _b = true, _c = __asyncValues(component.shop_operations.entries());
                    _4.label = 4;
                case 4: return [4 /*yield*/, _c.next()];
                case 5:
                    if (!(_d = _4.sent(), _h = _d.done, !_h)) return [3 /*break*/, 8];
                    return [5 /*yield**/, _loop_1()];
                case 6:
                    _4.sent();
                    _4.label = 7;
                case 7:
                    _b = true;
                    return [3 /*break*/, 4];
                case 8: return [3 /*break*/, 15];
                case 9:
                    e_3_1 = _4.sent();
                    e_3 = { error: e_3_1 };
                    return [3 /*break*/, 15];
                case 10:
                    _4.trys.push([10, , 13, 14]);
                    if (!(!_b && !_h && (_j = _c.return))) return [3 /*break*/, 12];
                    return [4 /*yield*/, _j.call(_c)];
                case 11:
                    _4.sent();
                    _4.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    if (e_3) throw e_3.error;
                    return [7 /*endfinally*/];
                case 14: return [7 /*endfinally*/];
                case 15:
                    if (!(Array.isArray(component.children) && component.children.length > 0)) return [3 /*break*/, 32];
                    index = args.componentsIndex;
                    _4.label = 16;
                case 16:
                    _4.trys.push([16, 26, 27, 32]);
                    _e = true, _f = __asyncValues(component.children);
                    _4.label = 17;
                case 17: return [4 /*yield*/, _f.next()];
                case 18:
                    if (!(_g = _4.sent(), _l = _g.done, !_l)) return [3 /*break*/, 25];
                    _o = _g.value;
                    _e = false;
                    childRef = _o;
                    if (!(childRef === null || childRef === void 0 ? void 0 : childRef.child_id) || !index)
                        return [3 /*break*/, 24];
                    childComponent = index.get(childRef.child_id);
                    if (!childComponent)
                        return [3 /*break*/, 24];
                    _4.label = 19;
                case 19:
                    _4.trys.push([19, 23, , 24]);
                    return [4 /*yield*/, getOrCreatePart(carbon, {
                            companyId: companyId,
                            createdBy: createdBy,
                            component: childComponent,
                            componentsIndex: index,
                            defaultMethodType: defaultMethodType,
                            defaultTrackingType: defaultTrackingType,
                            billOfProcessBlackList: billOfProcessBlackList
                        })];
                case 20:
                    childItemId = (_4.sent()).itemId;
                    childIsPurchased = (childComponent === null || childComponent === void 0 ? void 0 : childComponent.obtain_method) === "purchased";
                    methodType = childIsPurchased
                        ? "Purchase to Order"
                        : "Make to Order";
                    materialMakeMethodId = void 0;
                    if (!(methodType === "Make to Order")) return [3 /*break*/, 22];
                    return [4 /*yield*/, carbon
                            .from("makeMethod")
                            .select("id")
                            .eq("itemId", childItemId)
                            .single()];
                case 21:
                    materialMakeMethod = _4.sent();
                    materialMakeMethodId = (_w = materialMakeMethod.data) === null || _w === void 0 ? void 0 : _w.id;
                    _4.label = 22;
                case 22:
                    materials.push({
                        itemId: childItemId,
                        itemType: "Part",
                        methodType: methodType !== null && methodType !== void 0 ? methodType : "Pull from Inventory",
                        materialMakeMethodId: materialMakeMethodId,
                        quantity: (_y = (_x = childRef.quantity) !== null && _x !== void 0 ? _x : childComponent === null || childComponent === void 0 ? void 0 : childComponent.innate_quantity) !== null && _y !== void 0 ? _y : 1,
                        companyId: companyId,
                        createdBy: createdBy,
                        unitOfMeasureCode: "EA"
                    });
                    return [3 /*break*/, 24];
                case 23:
                    err_2 = _4.sent();
                    console.error("Failed to add child component as method material:", childRef, err_2);
                    return [3 /*break*/, 24];
                case 24:
                    _e = true;
                    return [3 /*break*/, 17];
                case 25: return [3 /*break*/, 32];
                case 26:
                    e_4_1 = _4.sent();
                    e_4 = { error: e_4_1 };
                    return [3 /*break*/, 32];
                case 27:
                    _4.trys.push([27, , 30, 31]);
                    if (!(!_e && !_l && (_m = _f.return))) return [3 /*break*/, 29];
                    return [4 /*yield*/, _m.call(_f)];
                case 28:
                    _4.sent();
                    _4.label = 29;
                case 29: return [3 /*break*/, 31];
                case 30:
                    if (e_4) throw e_4.error;
                    return [7 /*endfinally*/];
                case 31: return [7 /*endfinally*/];
                case 32:
                    isPurchased = component.obtain_method === "purchased" ||
                        ((_z = component.process) === null || _z === void 0 ? void 0 : _z.name) === "Purchased Components" ||
                        ((_0 = component.process) === null || _0 === void 0 ? void 0 : _0.external_name) === "Purchased Components";
                    partId = String(component.part_number || component.part_name || "PP-".concat(component.id)).trim();
                    revision = component.revision && /[a-zA-Z0-9]/.test(component.revision)
                        ? component.revision
                        : "0";
                    rawName = component.part_number ||
                        (component.part_name
                            ? component.part_name
                                .replace(/:[^/\\]*$/g, "")
                                .replace(/\.(step|stp|sldprt|iges|igs|dxf|dwg)$/i, "")
                            : undefined) ||
                        component.description ||
                        "Part ".concat(component.id);
                    name = stripSpecialCharacters(String(rawName).trim());
                    return [4 /*yield*/, carbon
                            .from("item")
                            .select("id")
                            .eq("companyId", companyId)
                            .eq("readableId", partId)
                            .eq("revision", revision)
                            .maybeSingle()];
                case 33:
                    existingItem = _4.sent();
                    if (!existingItem.data) return [3 /*break*/, 36];
                    if (!(isPurchased && ((_1 = component.purchased_component) === null || _1 === void 0 ? void 0 : _1.piece_price))) return [3 /*break*/, 35];
                    unitCost = parseFloat(String(component.purchased_component.piece_price));
                    if (!(unitCost > 0)) return [3 /*break*/, 35];
                    console.log("Updating itemCost for existing purchased component ".concat(partId, " with unitCost: ").concat(unitCost));
                    return [4 /*yield*/, carbon
                            .from("itemCost")
                            .update({
                            unitCost: unitCost
                        })
                            .eq("itemId", existingItem.data.id)
                            .eq("companyId", companyId)
                            .single()];
                case 34:
                    itemCostUpdate = _4.sent();
                    if (itemCostUpdate.error) {
                        console.error("Failed to update itemCost for existing ".concat(partId, ":"), itemCostUpdate.error);
                        // Don't throw here, just log the error and continue
                    }
                    else {
                        console.log("Successfully updated itemCost for existing ".concat(partId));
                    }
                    _4.label = 35;
                case 35: return [2 /*return*/, {
                        itemId: existingItem.data.id,
                        partId: partId
                    }];
                case 36: return [4 /*yield*/, carbon
                        .from("item")
                        .insert({
                        readableId: partId,
                        revision: revision,
                        name: name,
                        description: component.description,
                        type: "Part",
                        replenishmentSystem: isPurchased ? "Buy" : "Make",
                        defaultMethodType: isPurchased ? "Purchase to Order" : "Make to Order",
                        itemTrackingType: "Non-Inventory",
                        unitOfMeasureCode: "EA",
                        active: true,
                        companyId: companyId,
                        createdBy: createdBy
                    })
                        .select("id")
                        .single()];
                case 37:
                    itemInsert = _4.sent();
                    if (itemInsert.error) {
                        console.error("Failed to create item:", itemInsert.error);
                        throw new Error("Failed to create item: ".concat(itemInsert.error.message));
                    }
                    itemId = itemInsert.data.id;
                    // Create the mapping for the new item
                    return [4 /*yield*/, createPaperlessMapping(carbon, "item", itemId, "paperlessPartsId", String(component.part_uuid), companyId)];
                case 38:
                    // Create the mapping for the new item
                    _4.sent();
                    if (!(isPurchased && ((_2 = component.purchased_component) === null || _2 === void 0 ? void 0 : _2.piece_price))) return [3 /*break*/, 40];
                    unitCost = parseFloat(String(component.purchased_component.piece_price));
                    if (!(unitCost > 0)) return [3 /*break*/, 40];
                    console.log("Updating itemCost for purchased component ".concat(partId, " with unitCost: ").concat(unitCost));
                    return [4 /*yield*/, carbon
                            .from("itemCost")
                            .update({
                            unitCost: unitCost
                        })
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .select("itemId")
                            .single()];
                case 39:
                    itemCostUpdate = _4.sent();
                    if (itemCostUpdate.error) {
                        console.error("Failed to update itemCost for ".concat(partId, ":"), itemCostUpdate.error);
                        // Don't throw here, just log the error and continue
                    }
                    else {
                        console.log("Successfully updated itemCost for ".concat(partId));
                    }
                    _4.label = 40;
                case 40:
                    thumbnailPath = null;
                    if (!(!component.export_controlled && component.thumbnail_url)) return [3 /*break*/, 43];
                    return [4 /*yield*/, downloadAndUploadThumbnail(carbon, {
                            thumbnailUrl: component.thumbnail_url,
                            companyId: companyId,
                            itemId: itemId
                        })];
                case 41:
                    thumbnailPath = _4.sent();
                    if (!thumbnailPath) return [3 /*break*/, 43];
                    return [4 /*yield*/, carbon
                            .from("item")
                            .update({ thumbnailPath: thumbnailPath })
                            .eq("id", itemId)];
                case 42:
                    thumbnailUpdate = _4.sent();
                    if (thumbnailUpdate.error) {
                        console.error("Failed to update item with thumbnail path:", thumbnailUpdate.error);
                        // Don't throw here, just log the error and continue
                    }
                    _4.label = 43;
                case 43: return [4 /*yield*/, carbon.from("part").upsert({
                        id: partId,
                        companyId: companyId,
                        createdBy: createdBy
                    })];
                case 44:
                    partInsert = _4.sent();
                    // Create the mapping for the part
                    return [4 /*yield*/, createPaperlessMapping(carbon, "part", partId, "paperlessPartsId", String(component.part_uuid), companyId)];
                case 45:
                    // Create the mapping for the part
                    _4.sent();
                    makeMethod = {
                        data: null
                    };
                    if (!!isPurchased) return [3 /*break*/, 47];
                    return [4 /*yield*/, carbon
                            .from("makeMethod")
                            .select("id")
                            .eq("itemId", itemId)
                            .single()];
                case 46:
                    makeMethod = _4.sent();
                    _4.label = 47;
                case 47:
                    if (partInsert.error) {
                        console.error("Failed to create part:", partInsert.error);
                    }
                    if (makeMethod.error) {
                        console.error("Failed to create make method:", makeMethod.error);
                    }
                    makeMethodId = (_3 = makeMethod.data) === null || _3 === void 0 ? void 0 : _3.id;
                    if (!makeMethodId) return [3 /*break*/, 51];
                    if (!operations.length) return [3 /*break*/, 49];
                    return [4 /*yield*/, carbon.from("methodOperation").insert(operations.map(function (operation) { return (__assign(__assign({}, operation), { makeMethodId: makeMethodId })); }))];
                case 48:
                    operationInsert = _4.sent();
                    if (operationInsert.error) {
                        console.error("Failed to create method operations:", operationInsert.error);
                    }
                    _4.label = 49;
                case 49:
                    if (!materials.length) return [3 /*break*/, 51];
                    return [4 /*yield*/, carbon.from("methodMaterial").insert(materials.map(function (material) { return (__assign(__assign({}, material), { makeMethodId: makeMethodId })); }))];
                case 50:
                    materialInsert = _4.sent();
                    if (materialInsert.error) {
                        console.error("Failed to create method materials:", materialInsert.error);
                    }
                    _4.label = 51;
                case 51: return [2 /*return*/, { itemId: itemId, partId: partId }];
            }
        });
    });
}
/**
 * Get or create part from Paperless Parts component
 */
function getOrCreatePart(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var companyId, component, 
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        defaultMethodType, 
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        defaultTrackingType, _a, 
        // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
        billOfProcessBlackList, existingPart, isPurchased, unitCost, itemCostUpdate;
        var _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    companyId = args.companyId, component = args.component, defaultMethodType = args.defaultMethodType, defaultTrackingType = args.defaultTrackingType, _a = args.billOfProcessBlackList, billOfProcessBlackList = _a === void 0 ? [] : _a;
                    if (!component.part_uuid) {
                        throw new Error("Component part_uuid is required");
                    }
                    return [4 /*yield*/, getPaperlessPart(carbon, {
                            companyId: companyId,
                            paperlessPartsId: component.part_uuid,
                            paperlessPartNumber: component.part_number,
                            paperlessPartRevision: component.revision,
                            paperlessPartName: component.part_name
                        })];
                case 1:
                    existingPart = _e.sent();
                    if (!existingPart) return [3 /*break*/, 4];
                    isPurchased = component.obtain_method === "purchased" ||
                        ((_b = component.process) === null || _b === void 0 ? void 0 : _b.name) === "Purchased Components" ||
                        ((_c = component.process) === null || _c === void 0 ? void 0 : _c.external_name) === "Purchased Components";
                    if (!(isPurchased && ((_d = component.purchased_component) === null || _d === void 0 ? void 0 : _d.piece_price))) return [3 /*break*/, 3];
                    unitCost = parseFloat(String(component.purchased_component.piece_price));
                    if (!(unitCost > 0)) return [3 /*break*/, 3];
                    console.log("Updating itemCost for existing purchased component (external ID) ".concat(existingPart.partId, " with unitCost: ").concat(unitCost));
                    return [4 /*yield*/, carbon
                            .from("itemCost")
                            .update({
                            unitCost: unitCost
                        })
                            .eq("itemId", existingPart.itemId)
                            .eq("companyId", companyId)
                            .select("itemId")
                            .single()];
                case 2:
                    itemCostUpdate = _e.sent();
                    if (itemCostUpdate.error) {
                        console.error("Failed to update itemCost for existing (external ID) ".concat(existingPart.partId, ":"), itemCostUpdate.error);
                        // Don't throw here, just log the error and continue
                    }
                    else {
                        console.log("Successfully updated itemCost for existing (external ID) ".concat(existingPart.partId));
                    }
                    _e.label = 3;
                case 3: return [2 /*return*/, existingPart];
                case 4: 
                // If not found, create new part
                return [2 /*return*/, createPartFromComponent(carbon, args)];
            }
        });
    });
}
var servicePrefix = "Service: ";
function getOrCreateProcess(carbon, operation, companyId, createdBy) {
    return __awaiter(this, void 0, void 0, function () {
        var operationName, process, processInsert;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    operationName = operation.name;
                    if ((_a = operation.name) === null || _a === void 0 ? void 0 : _a.startsWith(servicePrefix)) {
                        operationName = operation.name.substring(servicePrefix.length);
                    }
                    return [4 /*yield*/, carbon
                            .from("process")
                            .select("id, processType")
                            .eq("name", operationName)
                            .eq("companyId", companyId)
                            .single()];
                case 1:
                    process = _c.sent();
                    if (process.data) {
                        return [2 /*return*/, process.data];
                    }
                    return [4 /*yield*/, carbon
                            .from("process")
                            .insert({
                            name: operationName,
                            processType: operation.is_outside_service === true ? "Outside" : "Inside",
                            companyId: companyId,
                            createdBy: createdBy,
                            defaultStandardFactor: "Minutes/Piece"
                        })
                            .select("id, processType")
                            .single()];
                case 2:
                    processInsert = _c.sent();
                    if (processInsert.error) {
                        console.error("Failed to create process:", processInsert.error);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, (_b = processInsert.data) !== null && _b !== void 0 ? _b : null];
            }
        });
    });
}
/**
 * Insert sales order lines from Paperless Parts order items
 */
function insertOrderLines(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        var salesOrderId, locationId, companyId, createdBy, orderItems, defaultMethodType, defaultTrackingType, _a, billOfProcessBlackList, maxPromisedDate, insertedLinesCount, holidays, _i, orderItems_1, orderItem, commentLine, result, componentsIndex, _b, _c, c, rootComponents, _d, rootComponents_1, component, itemId, leadTime, updateLeadTime, promisedDate, saleQuantity, unitPrice, addOnCost, salesOrderLine, lineResult, lineId, supportingFiles, validSupportingFiles, supportingFilesArray, error_8, error_9;
        var _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    salesOrderId = args.salesOrderId, locationId = args.locationId, companyId = args.companyId, createdBy = args.createdBy, orderItems = args.orderItems, defaultMethodType = args.defaultMethodType, defaultTrackingType = args.defaultTrackingType, _a = args.billOfProcessBlackList, billOfProcessBlackList = _a === void 0 ? [] : _a;
                    if (!(orderItems === null || orderItems === void 0 ? void 0 : orderItems.length)) {
                        return [2 /*return*/];
                    }
                    maxPromisedDate = null;
                    insertedLinesCount = 0;
                    return [4 /*yield*/, carbon
                            .from("holiday")
                            .select("*")
                            .eq("companyId", companyId)
                            .gte("date", new Date().toISOString())
                            .lte("date", new Date(new Date().setDate(new Date().getDate() + 30)).toISOString())];
                case 1:
                    holidays = _h.sent();
                    _i = 0, orderItems_1 = orderItems;
                    _h.label = 2;
                case 2:
                    if (!(_i < orderItems_1.length)) return [3 /*break*/, 18];
                    orderItem = orderItems_1[_i];
                    if (!!((_e = orderItem.components) === null || _e === void 0 ? void 0 : _e.length)) return [3 /*break*/, 5];
                    if (!(orderItem.description || orderItem.public_notes)) return [3 /*break*/, 4];
                    commentLine = {
                        salesOrderId: salesOrderId,
                        salesOrderLineType: "Comment",
                        description: orderItem.description || orderItem.public_notes || "",
                        companyId: companyId,
                        createdBy: createdBy
                    };
                    return [4 /*yield*/, carbon
                            .from("salesOrderLine")
                            .insert(commentLine)
                            .select("id")
                            .single()];
                case 3:
                    result = _h.sent();
                    if (result.error) {
                        console.error("Failed to insert comment line:", result.error);
                        return [3 /*break*/, 17];
                    }
                    insertedLinesCount++;
                    _h.label = 4;
                case 4: return [3 /*break*/, 17];
                case 5:
                    componentsIndex = new Map();
                    for (_b = 0, _c = orderItem.components; _b < _c.length; _b++) {
                        c = _c[_b];
                        if (typeof c.id === "number")
                            componentsIndex.set(c.id, c);
                    }
                    rootComponents = orderItem.components.filter(function (c) { var _a; return c.is_root_component === true || !((_a = c.parent_ids) === null || _a === void 0 ? void 0 : _a.length); });
                    _d = 0, rootComponents_1 = rootComponents;
                    _h.label = 6;
                case 6:
                    if (!(_d < rootComponents_1.length)) return [3 /*break*/, 17];
                    component = rootComponents_1[_d];
                    _h.label = 7;
                case 7:
                    _h.trys.push([7, 15, , 16]);
                    return [4 /*yield*/, getOrCreatePart(carbon, {
                            companyId: companyId,
                            createdBy: createdBy,
                            component: component,
                            componentsIndex: componentsIndex,
                            defaultMethodType: defaultMethodType,
                            defaultTrackingType: defaultTrackingType,
                            billOfProcessBlackList: billOfProcessBlackList
                        })];
                case 8:
                    itemId = (_h.sent()).itemId;
                    leadTime = (_f = orderItem.lead_days) !== null && _f !== void 0 ? _f : 7;
                    return [4 /*yield*/, carbon
                            .from("itemReplenishment")
                            .update({
                            leadTime: leadTime
                        })
                            .eq("itemId", itemId)];
                case 9:
                    updateLeadTime = _h.sent();
                    if (updateLeadTime.error) {
                        console.error("Failed to update lead time:", updateLeadTime.error);
                    }
                    promisedDate = (0, utils_2.calculatePromisedDate)(leadTime, (_g = holidays.data) !== null && _g !== void 0 ? _g : []);
                    // Update max promised date if this one is later
                    if (!maxPromisedDate ||
                        (promisedDate && promisedDate > maxPromisedDate)) {
                        maxPromisedDate = promisedDate;
                    }
                    saleQuantity = component.deliver_quantity || orderItem.quantity || 1;
                    unitPrice = orderItem.unit_price
                        ? parseFloat(orderItem.unit_price)
                        : 0;
                    addOnCost = orderItem.add_on_fees
                        ? parseFloat(String(orderItem.add_on_fees))
                        : 0;
                    salesOrderLine = {
                        salesOrderId: salesOrderId,
                        salesOrderLineType: "Part",
                        itemId: itemId,
                        locationId: locationId,
                        unitOfMeasureCode: "EA",
                        description: component.description || orderItem.description,
                        saleQuantity: saleQuantity,
                        unitPrice: unitPrice,
                        addOnCost: addOnCost,
                        companyId: companyId,
                        createdBy: createdBy,
                        quantitySent: component.deliver_quantity,
                        promisedDate: (promisedDate !== null && promisedDate !== void 0 ? promisedDate : orderItem.ships_on)
                            ? new Date(promisedDate !== null && promisedDate !== void 0 ? promisedDate : orderItem.ships_on).toISOString()
                            : null,
                        internalNotes: orderItem.private_notes
                            ? (0, utils_1.textToTiptap)(orderItem.private_notes)
                            : null,
                        externalNotes: orderItem.public_notes
                            ? (0, utils_1.textToTiptap)(orderItem.public_notes)
                            : null
                    };
                    return [4 /*yield*/, carbon
                            .from("salesOrderLine")
                            .insert(salesOrderLine)
                            .select("id")
                            .single()];
                case 10:
                    lineResult = _h.sent();
                    if (lineResult.error) {
                        console.error("Failed to insert sales order line for component ".concat(component.part_uuid, ":"), lineResult.error);
                        return [3 /*break*/, 16];
                    }
                    lineId = lineResult.data.id;
                    insertedLinesCount++;
                    if (!!orderItem.export_controlled) return [3 /*break*/, 14];
                    _h.label = 11;
                case 11:
                    _h.trys.push([11, 13, , 14]);
                    supportingFiles = [
                        {
                            filename: orderItem.filename,
                            url: component.part_url
                        }
                    ];
                    if (component.supporting_files) {
                        validSupportingFiles = component.supporting_files.filter(function (file) {
                            return Boolean(file.filename && file.url);
                        });
                        supportingFiles.push.apply(supportingFiles, validSupportingFiles);
                    }
                    supportingFilesArray = supportingFiles.filter(function (file) {
                        return Boolean(file.filename && file.url);
                    });
                    return [4 /*yield*/, processSupportingFiles(carbon, {
                            supportingFiles: supportingFilesArray,
                            companyId: companyId,
                            itemId: itemId,
                            lineId: lineId, // Use the actual line ID
                            sourceDocumentType: "Sales Order",
                            sourceDocumentId: salesOrderId,
                            createdBy: createdBy
                        })];
                case 12:
                    _h.sent();
                    return [3 /*break*/, 14];
                case 13:
                    error_8 = _h.sent();
                    console.error("Failed to process supporting files for component ".concat(component.part_uuid, ":"), error_8);
                    return [3 /*break*/, 14];
                case 14: return [3 /*break*/, 16];
                case 15:
                    error_9 = _h.sent();
                    console.error("Failed to process component ".concat(component.part_uuid, ":"), error_9);
                    // Continue with other components instead of failing the entire order
                    return [3 /*break*/, 16];
                case 16:
                    _d++;
                    return [3 /*break*/, 6];
                case 17:
                    _i++;
                    return [3 /*break*/, 2];
                case 18:
                    if (!maxPromisedDate) return [3 /*break*/, 20];
                    return [4 /*yield*/, carbon
                            .from("salesOrderShipment")
                            .update({ receiptPromisedDate: maxPromisedDate })
                            .eq("id", salesOrderId)];
                case 19:
                    _h.sent();
                    _h.label = 20;
                case 20:
                    if (insertedLinesCount === 0) {
                        console.warn("No valid order lines were inserted");
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Insert quote lines from Paperless Parts quote items
 */
function insertQuoteLines(carbon, args) {
    return __awaiter(this, void 0, void 0, function () {
        /**
         * Get labor and overhead rates for an operation based on its process.
         * If a specific workCenterId is provided, uses that work center's rates.
         * Otherwise, calculates blended (average) rates from all work centers
         * that have the process assigned to them.
         */
        function getOperationRates(processId, workCenterId) {
            var _a, _b, _c;
            if (workCenterId === void 0) { workCenterId = null; }
            if (!workCenters) {
                return { laborRate: 0, overheadRate: 0, machineRate: 0 };
            }
            // If a specific work center is provided, use its rates
            if (workCenterId) {
                var workCenter = workCenters.find(function (wc) { return wc.id === workCenterId && wc.active; });
                if (workCenter) {
                    return {
                        laborRate: (_a = workCenter.laborRate) !== null && _a !== void 0 ? _a : 0,
                        overheadRate: (_b = workCenter.overheadRate) !== null && _b !== void 0 ? _b : 0,
                        machineRate: (_c = workCenter.machineRate) !== null && _c !== void 0 ? _c : 0
                    };
                }
            }
            // Find all active work centers that have this process assigned
            var relatedWorkCenters = workCenters.filter(function (wc) {
                var _a;
                var processes = (_a = wc.processes) !== null && _a !== void 0 ? _a : [];
                return wc.active && processes.some(function (p) { return p === processId; });
            });
            // Calculate blended (average) rates from related work centers
            if (relatedWorkCenters.length > 0) {
                var laborRate = relatedWorkCenters.reduce(function (acc, wc) { var _a; return acc + ((_a = wc.laborRate) !== null && _a !== void 0 ? _a : 0); }, 0) /
                    relatedWorkCenters.length;
                var overheadRate = relatedWorkCenters.reduce(function (acc, wc) { var _a; return acc + ((_a = wc.overheadRate) !== null && _a !== void 0 ? _a : 0); }, 0) / relatedWorkCenters.length;
                var machineRate = relatedWorkCenters.reduce(function (acc, wc) { var _a; return acc + ((_a = wc.machineRate) !== null && _a !== void 0 ? _a : 0); }, 0) /
                    relatedWorkCenters.length;
                return { laborRate: laborRate, overheadRate: overheadRate, machineRate: machineRate };
            }
            return { laborRate: 0, overheadRate: 0, machineRate: 0 };
        }
        var quoteId, locationId, companyId, createdBy, quoteItems, defaultMethodType, defaultTrackingType, _a, billOfProcessBlackList, workCentersResult, workCenters, insertedLinesCount, _loop_2, _i, quoteItems_1, quoteItem;
        var _b, _c, _d, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    quoteId = args.quoteId, locationId = args.locationId, companyId = args.companyId, createdBy = args.createdBy, quoteItems = args.quoteItems, defaultMethodType = args.defaultMethodType, defaultTrackingType = args.defaultTrackingType, _a = args.billOfProcessBlackList, billOfProcessBlackList = _a === void 0 ? [] : _a;
                    if (!(quoteItems === null || quoteItems === void 0 ? void 0 : quoteItems.length)) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, carbon
                            .from("workCenters")
                            .select("*")
                            .eq("companyId", companyId)];
                case 1:
                    workCentersResult = _j.sent();
                    workCenters = workCentersResult.data;
                    insertedLinesCount = 0;
                    _loop_2 = function (quoteItem) {
                        var componentsIndex, _k, _l, c, rootComponents, _loop_3, _m, rootComponents_2, component;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    // Skip manual quote items (no actual part)
                                    if (quoteItem.type === "manual") {
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (!((_b = quoteItem.components) === null || _b === void 0 ? void 0 : _b.length)) {
                                        return [2 /*return*/, "continue"];
                                    }
                                    componentsIndex = new Map();
                                    for (_k = 0, _l = quoteItem.components; _k < _l.length; _k++) {
                                        c = _l[_k];
                                        if (typeof c.id === "number") {
                                            componentsIndex.set(c.id, c);
                                        }
                                        else if (typeof c.id === "string") {
                                            componentsIndex.set(parseInt(c.id), c);
                                        }
                                    }
                                    rootComponents = quoteItem.components.filter(function (c) { var _a; return c.is_root_component === true || !((_a = c.parent_ids) === null || _a === void 0 ? void 0 : _a.length); });
                                    _loop_3 = function (component) {
                                        // Recursive function to traverse component tree and add operations/materials
                                        function traverseComponent(comp, quoteMakeMethodId) {
                                            return __awaiter(this, void 0, void 0, function () {
                                                var materialOrder, operationOrder, _loop_4, _i, _a, operation, materialResult, materialItemResult, quoteMaterial, error_12, madeChildren, pickedOrBoughtChildren, _b, _c, childRef, childComponent, childItemId, childMethodType, err_3, madeMaterialInserts, _loop_5, _d, madeChildren_1, _e, childComponent, childItemId, madeMaterialResult, childQuoteMakeMethods, materialIdToQuoteMakeMethodId, _f, _g, qmm, _h, _j, _k, index, childComponent, materialId, childQuoteMakeMethodId, _l, pickedOrBoughtChildren_1, _m, childRef, childComponent, childItemId, childItemResult, childMaterial;
                                                var _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11;
                                                return __generator(this, function (_12) {
                                                    switch (_12.label) {
                                                        case 0:
                                                            materialOrder = 1;
                                                            if (!(Array.isArray(comp.shop_operations) &&
                                                                comp.shop_operations.length > 0)) return [3 /*break*/, 4];
                                                            operationOrder = 1;
                                                            _loop_4 = function (operation) {
                                                                var operationName, isBlacklisted, process, operationRates, quoteOperation, opResult;
                                                                return __generator(this, function (_13) {
                                                                    switch (_13.label) {
                                                                        case 0:
                                                                            if (operation.category !== "operation")
                                                                                return [2 /*return*/, "continue"];
                                                                            operationName = (_o = operation.operation_definition_name) !== null && _o !== void 0 ? _o : operation.name;
                                                                            // Check blacklist
                                                                            if (operationName && billOfProcessBlackList.length > 0) {
                                                                                isBlacklisted = billOfProcessBlackList.some(function (bl) {
                                                                                    return operationName.toLowerCase().includes(bl.toLowerCase());
                                                                                });
                                                                                if (isBlacklisted)
                                                                                    return [2 /*return*/, "continue"];
                                                                            }
                                                                            return [4 /*yield*/, getOrCreateProcess(carbon, operation, companyId, createdBy)];
                                                                        case 1:
                                                                            process = _13.sent();
                                                                            if (!process)
                                                                                return [2 /*return*/, "continue"];
                                                                            operationRates = getOperationRates(process.id);
                                                                            quoteOperation = {
                                                                                quoteId: quoteId,
                                                                                quoteLineId: quoteLineId_1,
                                                                                quoteMakeMethodId: quoteMakeMethodId,
                                                                                processId: process.id,
                                                                                order: (_p = operation.position) !== null && _p !== void 0 ? _p : operationOrder++,
                                                                                operationType: process.processType === "Inside" ? "Inside" : "Outside",
                                                                                description: operationName !== null && operationName !== void 0 ? operationName : "Operation ".concat(operationOrder),
                                                                                setupTime: ((_q = operation.setup_time) !== null && _q !== void 0 ? _q : 0) * 60,
                                                                                setupUnit: "Total Minutes",
                                                                                laborTime: 0,
                                                                                laborUnit: "Minutes/Piece",
                                                                                machineTime: ((_r = operation.runtime) !== null && _r !== void 0 ? _r : 0) * 60,
                                                                                machineUnit: "Minutes/Piece",
                                                                                laborRate: operationRates.laborRate,
                                                                                overheadRate: operationRates.overheadRate,
                                                                                machineRate: operationRates.machineRate,
                                                                                workInstruction: operation.notes
                                                                                    ? (0, utils_1.textToTiptap)(operation.notes)
                                                                                    : {},
                                                                                companyId: companyId,
                                                                                createdBy: createdBy
                                                                            };
                                                                            return [4 /*yield*/, carbon
                                                                                    .from("quoteOperation")
                                                                                    .insert(quoteOperation)];
                                                                        case 2:
                                                                            opResult = _13.sent();
                                                                            if (opResult.error) {
                                                                                console.error("Failed to insert quote operation ".concat(operationName, ":"), opResult.error);
                                                                            }
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            };
                                                            _i = 0, _a = comp.shop_operations;
                                                            _12.label = 1;
                                                        case 1:
                                                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                                                            operation = _a[_i];
                                                            return [5 /*yield**/, _loop_4(operation)];
                                                        case 2:
                                                            _12.sent();
                                                            _12.label = 3;
                                                        case 3:
                                                            _i++;
                                                            return [3 /*break*/, 1];
                                                        case 4:
                                                            if (!(((_s = comp.material) === null || _s === void 0 ? void 0 : _s.display_name) || ((_t = comp.material) === null || _t === void 0 ? void 0 : _t.name))) return [3 /*break*/, 11];
                                                            _12.label = 5;
                                                        case 5:
                                                            _12.trys.push([5, 10, , 11]);
                                                            return [4 /*yield*/, getOrCreateMaterial(carbon, {
                                                                    input: comp,
                                                                    createdBy: createdBy,
                                                                    companyId: companyId,
                                                                    defaultMethodType: defaultMethodType,
                                                                    defaultTrackingType: defaultTrackingType
                                                                })];
                                                        case 6:
                                                            materialResult = _12.sent();
                                                            if (!materialResult) return [3 /*break*/, 9];
                                                            return [4 /*yield*/, carbon
                                                                    .from("item")
                                                                    .select("readableId, name")
                                                                    .eq("id", materialResult.itemId)
                                                                    .single()];
                                                        case 7:
                                                            materialItemResult = _12.sent();
                                                            quoteMaterial = {
                                                                quoteId: quoteId,
                                                                quoteLineId: quoteLineId_1,
                                                                quoteMakeMethodId: quoteMakeMethodId,
                                                                itemId: materialResult.itemId,
                                                                itemType: "Material",
                                                                methodType: defaultMethodType,
                                                                description: (_z = (_x = (_v = (_u = materialItemResult.data) === null || _u === void 0 ? void 0 : _u.name) !== null && _v !== void 0 ? _v : (_w = comp.material) === null || _w === void 0 ? void 0 : _w.display_name) !== null && _x !== void 0 ? _x : (_y = comp.material) === null || _y === void 0 ? void 0 : _y.name) !== null && _z !== void 0 ? _z : "",
                                                                quantity: materialResult.quantity,
                                                                unitCost: 0,
                                                                unitOfMeasureCode: materialResult.unitOfMeasureCode,
                                                                order: materialOrder++,
                                                                companyId: companyId,
                                                                createdBy: createdBy
                                                            };
                                                            return [4 /*yield*/, carbon.from("quoteMaterial").insert(quoteMaterial)];
                                                        case 8:
                                                            _12.sent();
                                                            _12.label = 9;
                                                        case 9: return [3 /*break*/, 11];
                                                        case 10:
                                                            error_12 = _12.sent();
                                                            console.error("Failed to create quote material for component ".concat(comp.part_uuid, ":"), error_12);
                                                            return [3 /*break*/, 11];
                                                        case 11:
                                                            if (!(Array.isArray(comp.children) && comp.children.length > 0)) return [3 /*break*/, 33];
                                                            madeChildren = [];
                                                            pickedOrBoughtChildren = [];
                                                            _b = 0, _c = comp.children;
                                                            _12.label = 12;
                                                        case 12:
                                                            if (!(_b < _c.length)) return [3 /*break*/, 17];
                                                            childRef = _c[_b];
                                                            if (!(childRef === null || childRef === void 0 ? void 0 : childRef.child_id))
                                                                return [3 /*break*/, 16];
                                                            childComponent = componentsIndex.get(childRef.child_id);
                                                            if (!childComponent)
                                                                return [3 /*break*/, 16];
                                                            _12.label = 13;
                                                        case 13:
                                                            _12.trys.push([13, 15, , 16]);
                                                            return [4 /*yield*/, getOrCreatePart(carbon, {
                                                                    companyId: companyId,
                                                                    createdBy: createdBy,
                                                                    component: childComponent,
                                                                    componentsIndex: componentsIndex,
                                                                    defaultMethodType: defaultMethodType,
                                                                    defaultTrackingType: defaultTrackingType,
                                                                    billOfProcessBlackList: billOfProcessBlackList
                                                                })];
                                                        case 14:
                                                            childItemId = (_12.sent()).itemId;
                                                            childMethodType = (childComponent === null || childComponent === void 0 ? void 0 : childComponent.obtain_method) === "purchased" ||
                                                                (childComponent === null || childComponent === void 0 ? void 0 : childComponent.type) === "purchased"
                                                                ? "Purchase to Order"
                                                                : "Make to Order";
                                                            if (childMethodType === "Make to Order") {
                                                                madeChildren.push({
                                                                    childRef: childRef,
                                                                    childComponent: childComponent,
                                                                    childItemId: childItemId
                                                                });
                                                            }
                                                            else {
                                                                pickedOrBoughtChildren.push({
                                                                    childRef: childRef,
                                                                    childComponent: childComponent,
                                                                    childItemId: childItemId
                                                                });
                                                            }
                                                            return [3 /*break*/, 16];
                                                        case 15:
                                                            err_3 = _12.sent();
                                                            console.error("Failed to get or create part for child component:", childRef, err_3);
                                                            return [3 /*break*/, 16];
                                                        case 16:
                                                            _b++;
                                                            return [3 /*break*/, 12];
                                                        case 17:
                                                            if (!(madeChildren.length > 0)) return [3 /*break*/, 28];
                                                            madeMaterialInserts = [];
                                                            _loop_5 = function (childComponent, childItemId) {
                                                                var childItemResult;
                                                                return __generator(this, function (_14) {
                                                                    switch (_14.label) {
                                                                        case 0: return [4 /*yield*/, carbon
                                                                                .from("item")
                                                                                .select("readableId, name")
                                                                                .eq("id", childItemId)
                                                                                .single()];
                                                                        case 1:
                                                                            childItemResult = _14.sent();
                                                                            madeMaterialInserts.push({
                                                                                quoteId: quoteId,
                                                                                quoteLineId: quoteLineId_1,
                                                                                quoteMakeMethodId: quoteMakeMethodId,
                                                                                itemId: childItemId,
                                                                                itemType: "Part",
                                                                                methodType: "Make to Order",
                                                                                description: (_2 = (_1 = (_0 = childItemResult.data) === null || _0 === void 0 ? void 0 : _0.name) !== null && _1 !== void 0 ? _1 : childComponent.description) !== null && _2 !== void 0 ? _2 : "",
                                                                                quantity: (_5 = (_4 = (_3 = madeChildren.find(function (c) { return c.childItemId === childItemId; })) === null || _3 === void 0 ? void 0 : _3.childRef.quantity) !== null && _4 !== void 0 ? _4 : childComponent === null || childComponent === void 0 ? void 0 : childComponent.innate_quantity) !== null && _5 !== void 0 ? _5 : 1,
                                                                                unitCost: 0,
                                                                                unitOfMeasureCode: "EA",
                                                                                order: materialOrder++,
                                                                                companyId: companyId,
                                                                                createdBy: createdBy
                                                                            });
                                                                            return [2 /*return*/];
                                                                    }
                                                                });
                                                            };
                                                            _d = 0, madeChildren_1 = madeChildren;
                                                            _12.label = 18;
                                                        case 18:
                                                            if (!(_d < madeChildren_1.length)) return [3 /*break*/, 21];
                                                            _e = madeChildren_1[_d], childComponent = _e.childComponent, childItemId = _e.childItemId;
                                                            return [5 /*yield**/, _loop_5(childComponent, childItemId)];
                                                        case 19:
                                                            _12.sent();
                                                            _12.label = 20;
                                                        case 20:
                                                            _d++;
                                                            return [3 /*break*/, 18];
                                                        case 21: return [4 /*yield*/, carbon
                                                                .from("quoteMaterial")
                                                                .insert(madeMaterialInserts)
                                                                .select("id")];
                                                        case 22:
                                                            madeMaterialResult = _12.sent();
                                                            if (!madeMaterialResult.error) return [3 /*break*/, 23];
                                                            console.error("Failed to insert made materials:", madeMaterialResult.error);
                                                            return [3 /*break*/, 28];
                                                        case 23:
                                                            if (!madeMaterialResult.data) return [3 /*break*/, 28];
                                                            return [4 /*yield*/, carbon
                                                                    .from("quoteMakeMethod")
                                                                    .select("id, parentMaterialId")
                                                                    .in("parentMaterialId", madeMaterialResult.data.map(function (m) { return m.id; }))];
                                                        case 24:
                                                            childQuoteMakeMethods = _12.sent();
                                                            if (!childQuoteMakeMethods.data) return [3 /*break*/, 28];
                                                            materialIdToQuoteMakeMethodId = {};
                                                            for (_f = 0, _g = childQuoteMakeMethods.data; _f < _g.length; _f++) {
                                                                qmm = _g[_f];
                                                                if (qmm.parentMaterialId && qmm.id) {
                                                                    materialIdToQuoteMakeMethodId[qmm.parentMaterialId] =
                                                                        qmm.id;
                                                                }
                                                            }
                                                            _h = 0, _j = madeChildren.entries();
                                                            _12.label = 25;
                                                        case 25:
                                                            if (!(_h < _j.length)) return [3 /*break*/, 28];
                                                            _k = _j[_h], index = _k[0], childComponent = _k[1].childComponent;
                                                            materialId = (_6 = madeMaterialResult.data[index]) === null || _6 === void 0 ? void 0 : _6.id;
                                                            childQuoteMakeMethodId = materialId
                                                                ? materialIdToQuoteMakeMethodId[materialId]
                                                                : null;
                                                            if (!childQuoteMakeMethodId) return [3 /*break*/, 27];
                                                            return [4 /*yield*/, traverseComponent(childComponent, childQuoteMakeMethodId)];
                                                        case 26:
                                                            _12.sent();
                                                            _12.label = 27;
                                                        case 27:
                                                            _h++;
                                                            return [3 /*break*/, 25];
                                                        case 28:
                                                            if (!(pickedOrBoughtChildren.length > 0)) return [3 /*break*/, 33];
                                                            _l = 0, pickedOrBoughtChildren_1 = pickedOrBoughtChildren;
                                                            _12.label = 29;
                                                        case 29:
                                                            if (!(_l < pickedOrBoughtChildren_1.length)) return [3 /*break*/, 33];
                                                            _m = pickedOrBoughtChildren_1[_l], childRef = _m.childRef, childComponent = _m.childComponent, childItemId = _m.childItemId;
                                                            return [4 /*yield*/, carbon
                                                                    .from("item")
                                                                    .select("readableId, name")
                                                                    .eq("id", childItemId)
                                                                    .single()];
                                                        case 30:
                                                            childItemResult = _12.sent();
                                                            childMaterial = {
                                                                quoteId: quoteId,
                                                                quoteLineId: quoteLineId_1,
                                                                quoteMakeMethodId: quoteMakeMethodId,
                                                                itemId: childItemId,
                                                                itemType: "Part",
                                                                methodType: "Pull from Inventory",
                                                                description: (_9 = (_8 = (_7 = childItemResult.data) === null || _7 === void 0 ? void 0 : _7.name) !== null && _8 !== void 0 ? _8 : childComponent.description) !== null && _9 !== void 0 ? _9 : "",
                                                                quantity: (_11 = (_10 = childRef.quantity) !== null && _10 !== void 0 ? _10 : childComponent === null || childComponent === void 0 ? void 0 : childComponent.innate_quantity) !== null && _11 !== void 0 ? _11 : 1,
                                                                unitCost: 0,
                                                                unitOfMeasureCode: "EA",
                                                                order: materialOrder++,
                                                                companyId: companyId,
                                                                createdBy: createdBy
                                                            };
                                                            return [4 /*yield*/, carbon.from("quoteMaterial").insert(childMaterial)];
                                                        case 31:
                                                            _12.sent();
                                                            _12.label = 32;
                                                        case 32:
                                                            _l++;
                                                            return [3 /*break*/, 29];
                                                        case 33: return [2 /*return*/];
                                                    }
                                                });
                                            });
                                        }
                                        var itemId, quantities, isPurchased, rootMethodType, quoteLine, lineResult, quoteLineId_1, quoteLinePrices, priceResult, makeMethodResult, rootQuoteMakeMethodId, supportingFiles, validSupportingFiles, error_10, error_11;
                                        return __generator(this, function (_p) {
                                            switch (_p.label) {
                                                case 0:
                                                    _p.trys.push([0, 12, , 13]);
                                                    return [4 /*yield*/, getOrCreatePart(carbon, {
                                                            companyId: companyId,
                                                            createdBy: createdBy,
                                                            component: component,
                                                            componentsIndex: componentsIndex,
                                                            defaultMethodType: defaultMethodType,
                                                            defaultTrackingType: defaultTrackingType,
                                                            billOfProcessBlackList: billOfProcessBlackList
                                                        })];
                                                case 1:
                                                    itemId = (_p.sent()).itemId;
                                                    quantities = (_d = (_c = component.quantities) === null || _c === void 0 ? void 0 : _c.map(function (q) { var _a; return (_a = q.quantity) !== null && _a !== void 0 ? _a : 1; })) !== null && _d !== void 0 ? _d : [];
                                                    isPurchased = component.obtain_method === "purchased" ||
                                                        component.type === "purchased" ||
                                                        ((_e = component.process) === null || _e === void 0 ? void 0 : _e.name) === "Purchased Components";
                                                    rootMethodType = isPurchased
                                                        ? "Purchase to Order"
                                                        : "Make to Order";
                                                    quoteLine = {
                                                        quoteId: quoteId,
                                                        itemId: itemId,
                                                        description: component.description || component.part_name || "",
                                                        methodType: rootMethodType,
                                                        quantity: quantities.length > 0 ? quantities : null,
                                                        unitOfMeasureCode: "EA",
                                                        status: "Not Started",
                                                        locationId: locationId,
                                                        companyId: companyId,
                                                        createdBy: createdBy,
                                                        internalNotes: quoteItem.private_notes
                                                            ? (0, utils_1.textToTiptap)(quoteItem.private_notes)
                                                            : null,
                                                        externalNotes: quoteItem.public_notes
                                                            ? (0, utils_1.textToTiptap)(quoteItem.public_notes)
                                                            : null
                                                    };
                                                    return [4 /*yield*/, carbon
                                                            .from("quoteLine")
                                                            .insert(quoteLine)
                                                            .select("id")
                                                            .single()];
                                                case 2:
                                                    lineResult = _p.sent();
                                                    if (lineResult.error) {
                                                        console.error("Failed to insert quote line for component ".concat(component.part_uuid, ":"), lineResult.error);
                                                        return [2 /*return*/, "continue"];
                                                    }
                                                    quoteLineId_1 = lineResult.data.id;
                                                    insertedLinesCount++;
                                                    if (!((_f = component.quantities) === null || _f === void 0 ? void 0 : _f.length)) return [3 /*break*/, 4];
                                                    quoteLinePrices = component.quantities.map(function (qp) {
                                                        var _a, _b, _c;
                                                        return ({
                                                            quoteId: quoteId,
                                                            quoteLineId: quoteLineId_1,
                                                            quantity: (_a = qp.quantity) !== null && _a !== void 0 ? _a : 1,
                                                            unitPrice: (_b = qp.unit_price) !== null && _b !== void 0 ? _b : 0,
                                                            leadTime: (_c = qp.lead_time) !== null && _c !== void 0 ? _c : 0,
                                                            discountPercent: 0,
                                                            createdBy: createdBy
                                                        });
                                                    });
                                                    return [4 /*yield*/, carbon
                                                            .from("quoteLinePrice")
                                                            .insert(quoteLinePrices)];
                                                case 3:
                                                    priceResult = _p.sent();
                                                    if (priceResult.error) {
                                                        console.error("Failed to insert quote line prices for component ".concat(component.part_uuid, ":"), priceResult.error);
                                                    }
                                                    _p.label = 4;
                                                case 4:
                                                    if (!(rootMethodType === "Make to Order")) return [3 /*break*/, 7];
                                                    return [4 /*yield*/, carbon
                                                            .from("quoteMakeMethod")
                                                            .select("id")
                                                            .eq("quoteLineId", quoteLineId_1)
                                                            .is("parentMaterialId", null)
                                                            .single()];
                                                case 5:
                                                    makeMethodResult = _p.sent();
                                                    rootQuoteMakeMethodId = (_g = makeMethodResult.data) === null || _g === void 0 ? void 0 : _g.id;
                                                    if (!rootQuoteMakeMethodId) return [3 /*break*/, 7];
                                                    // Start traversing from the root component
                                                    return [4 /*yield*/, traverseComponent(component, rootQuoteMakeMethodId)];
                                                case 6:
                                                    // Start traversing from the root component
                                                    _p.sent();
                                                    _p.label = 7;
                                                case 7:
                                                    if (!(!quoteItem.export_controlled && !component.export_controlled)) return [3 /*break*/, 11];
                                                    _p.label = 8;
                                                case 8:
                                                    _p.trys.push([8, 10, , 11]);
                                                    supportingFiles = [
                                                        {
                                                            filename: (_h = component.part_name) !== null && _h !== void 0 ? _h : "",
                                                            url: component.part_url
                                                        }
                                                    ];
                                                    if (component.supporting_files) {
                                                        validSupportingFiles = component.supporting_files.filter(function (file) {
                                                            return Boolean(file.filename && file.url);
                                                        });
                                                        supportingFiles.push.apply(supportingFiles, validSupportingFiles);
                                                    }
                                                    return [4 /*yield*/, processSupportingFiles(carbon, {
                                                            supportingFiles: supportingFiles,
                                                            companyId: companyId,
                                                            itemId: itemId,
                                                            lineId: quoteLineId_1,
                                                            sourceDocumentType: "Quote",
                                                            sourceDocumentId: quoteId,
                                                            createdBy: createdBy
                                                        })];
                                                case 9:
                                                    _p.sent();
                                                    return [3 /*break*/, 11];
                                                case 10:
                                                    error_10 = _p.sent();
                                                    console.error("Failed to process supporting files for component ".concat(component.part_uuid, ":"), error_10);
                                                    return [3 /*break*/, 11];
                                                case 11: return [3 /*break*/, 13];
                                                case 12:
                                                    error_11 = _p.sent();
                                                    console.error("Failed to process component ".concat(component.part_uuid, ":"), error_11);
                                                    return [2 /*return*/, "continue"];
                                                case 13: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    _m = 0, rootComponents_2 = rootComponents;
                                    _o.label = 1;
                                case 1:
                                    if (!(_m < rootComponents_2.length)) return [3 /*break*/, 4];
                                    component = rootComponents_2[_m];
                                    return [5 /*yield**/, _loop_3(component)];
                                case 2:
                                    _o.sent();
                                    _o.label = 3;
                                case 3:
                                    _m++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, quoteItems_1 = quoteItems;
                    _j.label = 2;
                case 2:
                    if (!(_i < quoteItems_1.length)) return [3 /*break*/, 5];
                    quoteItem = quoteItems_1[_i];
                    return [5 /*yield**/, _loop_2(quoteItem)];
                case 3:
                    _j.sent();
                    _j.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (insertedLinesCount === 0) {
                        console.warn("No valid quote lines were inserted");
                        return [2 /*return*/];
                    }
                    console.log("\u2705 Successfully inserted ".concat(insertedLinesCount, " quote lines"));
                    return [2 /*return*/];
            }
        });
    });
}
