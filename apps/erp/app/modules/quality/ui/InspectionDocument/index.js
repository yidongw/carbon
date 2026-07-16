"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspectionDocumentTable = exports.InspectionDocumentForm = void 0;
/**
 * Do not barrel-export InspectionDocumentEditor: it depends on react-konva → Konva
 * Node build → `require("canvas")`, which breaks Vite SSR for any route that
 * only imports InspectionDocumentForm / InspectionDocumentTable from this file.
 * Import the editor only via direct path + lazy/ClientOnly (see balloon/$id).
 */
var InspectionDocumentForm_1 = require("./InspectionDocumentForm");
Object.defineProperty(exports, "InspectionDocumentForm", { enumerable: true, get: function () { return InspectionDocumentForm_1.default; } });
var InspectionDocumentTable_1 = require("./InspectionDocumentTable");
Object.defineProperty(exports, "InspectionDocumentTable", { enumerable: true, get: function () { return InspectionDocumentTable_1.default; } });
