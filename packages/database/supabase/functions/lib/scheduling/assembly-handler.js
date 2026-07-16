"use strict";
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
exports.AssemblyHandler = void 0;
exports.buildMakeMethodDependencies = buildMakeMethodDependencies;
var methods_ts_1 = require("../methods.ts");
/**
 * Assembly Handler
 * Manages assembly hierarchy and transforms job method trees into scheduling structures
 */
var AssemblyHandler = /** @class */ (function () {
    function AssemblyHandler(client, db, companyId) {
        this.client = client;
        this.db = db;
        this.companyId = companyId;
    }
    /**
     * Build assembly tree for a job
     */
    AssemblyHandler.prototype.buildAssemblyTree = function (jobId) {
        return __awaiter(this, void 0, void 0, function () {
            var rootMethod, treeResult, operations, operationsByMethod, _i, operations_1, op, rootItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .selectFrom("jobMakeMethod")
                            .select(["id", "itemId"])
                            .where("jobId", "=", jobId)
                            .where("parentMaterialId", "is", null)
                            .executeTakeFirst()];
                    case 1:
                        rootMethod = _a.sent();
                        if (!(rootMethod === null || rootMethod === void 0 ? void 0 : rootMethod.id)) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, (0, methods_ts_1.getJobMethodTree)(this.client, rootMethod.id)];
                    case 2:
                        treeResult = _a.sent();
                        if (treeResult.error || !treeResult.data || treeResult.data.length === 0) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.db
                                .selectFrom("jobOperation")
                                .selectAll()
                                .where("jobId", "=", jobId)
                                .where("status", "not in", ["Done", "Canceled"])
                                .orderBy("order")
                                .execute()];
                    case 3:
                        operations = _a.sent();
                        operationsByMethod = new Map();
                        for (_i = 0, operations_1 = operations; _i < operations_1.length; _i++) {
                            op = operations_1[_i];
                            if (op.jobMakeMethodId) {
                                if (!operationsByMethod.has(op.jobMakeMethodId)) {
                                    operationsByMethod.set(op.jobMakeMethodId, []);
                                }
                                operationsByMethod.get(op.jobMakeMethodId).push(op);
                            }
                        }
                        rootItem = treeResult.data[0];
                        return [2 /*return*/, this.transformTreeItem(rootItem, operationsByMethod)];
                }
            });
        });
    };
    /**
     * Transform a JobMethodTreeItem to AssemblyNode
     */
    AssemblyHandler.prototype.transformTreeItem = function (item, operationsByMethod) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var jobMakeMethodId = ((_a = item.data) === null || _a === void 0 ? void 0 : _a.jobMaterialMakeMethodId) || item.id;
        return {
            id: item.id,
            jobMakeMethodId: jobMakeMethodId,
            parentMaterialId: (_c = (_b = item.data) === null || _b === void 0 ? void 0 : _b.parentMaterialId) !== null && _c !== void 0 ? _c : null,
            itemId: (_e = (_d = item.data) === null || _d === void 0 ? void 0 : _d.itemId) !== null && _e !== void 0 ? _e : null,
            operations: (_f = operationsByMethod.get(jobMakeMethodId)) !== null && _f !== void 0 ? _f : [],
            children: item.children.map(function (child) {
                return _this.transformTreeItem(child, operationsByMethod);
            }),
        };
    };
    /**
     * Get assembly nodes in post-order traversal (children before parents)
     * This is the order in which assemblies should be scheduled for backward scheduling
     */
    AssemblyHandler.prototype.getPostOrderTraversal = function (root) {
        var result = [];
        function traverse(node) {
            // Process children first
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                traverse(child);
            }
            // Then process current node
            result.push(node);
        }
        traverse(root);
        return result;
    };
    /**
     * Get assembly nodes in pre-order traversal (parents before children)
     * This is the order in which assemblies should be scheduled for forward scheduling
     */
    AssemblyHandler.prototype.getPreOrderTraversal = function (root) {
        var result = [];
        function traverse(node) {
            // Process current node first
            result.push(node);
            // Then process children
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                traverse(child);
            }
        }
        traverse(root);
        return result;
    };
    /**
     * Get all operations from the assembly tree in scheduling order
     * For backward scheduling: children operations come first
     */
    AssemblyHandler.prototype.getAllOperationsForBackwardScheduling = function (root) {
        var operations = [];
        var traversal = this.getPostOrderTraversal(root);
        for (var _i = 0, traversal_1 = traversal; _i < traversal_1.length; _i++) {
            var node = traversal_1[_i];
            operations.push.apply(operations, node.operations);
        }
        return operations;
    };
    /**
     * Get all operations from the assembly tree in scheduling order
     * For forward scheduling: parent operations come first
     */
    AssemblyHandler.prototype.getAllOperationsForForwardScheduling = function (root) {
        var operations = [];
        var traversal = this.getPreOrderTraversal(root);
        for (var _i = 0, traversal_2 = traversal; _i < traversal_2.length; _i++) {
            var node = traversal_2[_i];
            operations.push.apply(operations, node.operations);
        }
        return operations;
    };
    /**
     * Calculate the maximum depth of the assembly tree
     */
    AssemblyHandler.prototype.getAssemblyDepth = function (root) {
        function getDepth(node) {
            if (node.children.length === 0) {
                return 1;
            }
            return 1 + Math.max.apply(Math, node.children.map(getDepth));
        }
        return getDepth(root);
    };
    /**
     * Get all jobMakeMethodIds in the assembly tree
     */
    AssemblyHandler.prototype.getAllJobMakeMethodIds = function (root) {
        var ids = [];
        function traverse(node) {
            ids.push(node.jobMakeMethodId);
            for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
                var child = _a[_i];
                traverse(child);
            }
        }
        traverse(root);
        return ids;
    };
    return AssemblyHandler;
}());
exports.AssemblyHandler = AssemblyHandler;
/**
 * Build make method dependencies for dependency creation
 * Returns tuples of [childMethodId, parentMethodId]
 */
function buildMakeMethodDependencies(root) {
    var dependencies = [];
    function traverse(node, parentMethodId) {
        dependencies.push({
            id: node.jobMakeMethodId,
            parentId: parentMethodId,
        });
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            traverse(child, node.jobMakeMethodId);
        }
    }
    traverse(root, null);
    return dependencies;
}
