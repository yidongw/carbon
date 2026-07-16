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
Object.defineProperty(exports, "__esModule", { value: true });
exports.action = action;
exports.getZodSchemaFieldsShallow = getZodSchemaFieldsShallow;
var openai_1 = require("@ai-sdk/openai");
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var ai_1 = require("ai");
var zod_1 = require("zod");
var shared_1 = require("~/modules/shared");
var inputSchema = zod_1.z.object({
    fileColumns: zod_1.z.array(zod_1.z.string())
    // firstRows: z.array(z.record(z.string())),
});
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var table, result, _c, _d, fileColumns, schema, dbFields, fileColumnsLower, mappings, matched, unmatchedFields, _i, dbFields_1, field, nameIdx, label, labelIdx, unmatchedSchema, unmatchedFileColumns, object, error_1;
        var _e;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {})];
                case 1:
                    _f.sent();
                    table = params.table;
                    if (!table) {
                        throw (0, auth_1.notFound)("No table parameter provided");
                    }
                    _d = (_c = inputSchema).safeParse;
                    return [4 /*yield*/, request.json()];
                case 2:
                    result = _d.apply(_c, [_f.sent()]);
                    if (!result.success) {
                        throw (0, auth_1.notFound)("Table not found in the list of supported tables");
                    }
                    fileColumns = result.data.fileColumns;
                    schema = shared_1.importSchemas[table].partial();
                    if (!schema) {
                        throw (0, auth_1.notFound)("Table not found in the list of supported tables");
                    }
                    dbFields = Object.keys(getZodSchemaFieldsShallow(schema));
                    fileColumnsLower = fileColumns.map(function (c) { return c.toLowerCase().trim(); });
                    mappings = shared_1.fieldMappings[table];
                    matched = {};
                    unmatchedFields = [];
                    for (_i = 0, dbFields_1 = dbFields; _i < dbFields_1.length; _i++) {
                        field = dbFields_1[_i];
                        nameIdx = fileColumnsLower.indexOf(field.toLowerCase());
                        if (nameIdx !== -1) {
                            matched[field] = fileColumns[nameIdx];
                            continue;
                        }
                        label = (_e = mappings === null || mappings === void 0 ? void 0 : mappings[field]) === null || _e === void 0 ? void 0 : _e.label;
                        if (label) {
                            labelIdx = fileColumnsLower.indexOf(label.toLowerCase());
                            if (labelIdx !== -1) {
                                matched[field] = fileColumns[labelIdx];
                                continue;
                            }
                        }
                        unmatchedFields.push(field);
                    }
                    // If all fields matched, skip AI entirely
                    if (unmatchedFields.length === 0) {
                        return [2 /*return*/, matched];
                    }
                    unmatchedSchema = schema.pick(Object.fromEntries(unmatchedFields.map(function (f) { return [f, true]; })));
                    unmatchedFileColumns = fileColumns.filter(function (c) { return !Object.values(matched).includes(c); });
                    _f.label = 3;
                case 3:
                    _f.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, ai_1.generateObject)({
                            model: (0, openai_1.openai)("gpt-4o"),
                            schema: unmatchedSchema,
                            prompt: "\n      The following columns are the headings from a CSV import file for importing a ".concat(table, ".\n      Map these column names to the correct fields in our database (").concat(unmatchedFields.join(", "), ") by providing the matching column name for each field.\n\n      If you are not sure or there is no matching column, please return \"N/A\".\n\n      Columns:\n      ").concat(unmatchedFileColumns.join(","), "\n      "),
                            temperature: 0.2
                        })];
                case 4:
                    object = (_f.sent()).object;
                    return [2 /*return*/, __assign(__assign({}, matched), object)];
                case 5:
                    error_1 = _f.sent();
                    console.error(error_1);
                    return [2 /*return*/, matched];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getZodSchemaFieldsShallow(schema) {
    var fields = {};
    var proxy = new Proxy(fields, {
        get: function (_, key) {
            if (key === "then" || typeof key !== "string") {
                return;
            }
            fields[key] = true;
        }
    });
    schema.safeParse(proxy);
    return fields;
}
