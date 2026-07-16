"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentTypeRegistry = void 0;
exports.getDocumentTypesForSource = getDocumentTypesForSource;
exports.getDocumentType = getDocumentType;
exports.getDocumentTypeOptions = getDocumentTypeOptions;
exports.documentTypeRegistry = [
    {
        id: "productLabel",
        displayName: "Product Label",
        sourceDocuments: [
            "Receipt",
            "Shipment",
            "Operation",
            "Entity",
            "Job",
            "Split",
            "StockTransfer"
        ],
        builtInRenderer: "zpl",
        defaultFormat: "zpl",
        description: "Labels for tracked entities (serial/batch numbers)"
    },
    {
        id: "kanbanCard",
        displayName: "Kanban Card",
        sourceDocuments: ["Kanban"],
        builtInRenderer: "pdf",
        defaultFormat: "pdf",
        description: "Replenishment cards for kanban bins"
    },
    {
        id: "storageUnitLabel",
        displayName: "Storage Unit Label",
        sourceDocuments: ["StorageUnit"],
        builtInRenderer: "zpl",
        defaultFormat: "zpl",
        description: "Labels for shelves, bins, and storage locations"
    }
];
function getDocumentTypesForSource(sourceDocument) {
    return exports.documentTypeRegistry
        .filter(function (dt) {
        return dt.sourceDocuments.includes(sourceDocument);
    })
        .map(function (dt) { return dt.id; });
}
function getDocumentType(id) {
    return exports.documentTypeRegistry.find(function (dt) { return dt.id === id; });
}
function getDocumentTypeOptions() {
    return exports.documentTypeRegistry.map(function (dt) { return ({
        value: dt.id,
        label: dt.displayName
    }); });
}
