"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodBindings = methodBindings;
exports.templateMethodBindings = templateMethodBindings;
var path_1 = require("~/utils/path");
function methodBindings(itemId) {
    return {
        bomItemBlacklistId: itemId,
        urls: {
            newMethodMaterial: path_1.path.to.newMethodMaterial,
            methodMaterial: path_1.path.to.methodMaterial,
            deleteMethodMaterial: path_1.path.to.deleteMethodMaterial,
            methodMaterialsOrder: path_1.path.to.methodMaterialsOrder,
            newMethodOperation: path_1.path.to.newMethodOperation,
            methodOperation: path_1.path.to.methodOperation,
            methodOperationsOrder: path_1.path.to.methodOperationsOrder,
            methodOperationsDelete: path_1.path.to.methodOperationsDelete,
            newMethodOperationStep: path_1.path.to.newMethodOperationStep,
            methodOperationStepOrder: path_1.path.to.methodOperationStepOrder,
            methodOperationStep: path_1.path.to.methodOperationStep,
            deleteMethodOperationStep: path_1.path.to.deleteMethodOperationStep,
            newMethodOperationParameter: path_1.path.to.newMethodOperationParameter,
            methodOperationParameter: path_1.path.to.methodOperationParameter,
            deleteMethodOperationParameter: path_1.path.to.deleteMethodOperationParameter,
            newMethodOperationTool: path_1.path.to.newMethodOperationTool,
            methodOperationTool: path_1.path.to.methodOperationTool,
            deleteMethodOperationTool: path_1.path.to.deleteMethodOperationTool
        }
    };
}
function templateMethodBindings() {
    return {
        bomItemBlacklistId: undefined,
        urls: {
            newMethodMaterial: path_1.path.to.templateNewMethodMaterial,
            methodMaterial: path_1.path.to.templateMethodMaterial,
            deleteMethodMaterial: path_1.path.to.templateDeleteMethodMaterial,
            methodMaterialsOrder: path_1.path.to.templateMethodMaterialsOrder,
            newMethodOperation: path_1.path.to.templateNewMethodOperation,
            methodOperation: path_1.path.to.templateMethodOperation,
            methodOperationsOrder: path_1.path.to.templateMethodOperationsOrder,
            methodOperationsDelete: path_1.path.to.templateMethodOperationsDelete,
            newMethodOperationStep: path_1.path.to.templateNewMethodOperationStep,
            methodOperationStepOrder: path_1.path.to.templateMethodOperationStepOrder,
            methodOperationStep: path_1.path.to.templateMethodOperationStep,
            deleteMethodOperationStep: path_1.path.to.templateDeleteMethodOperationStep,
            newMethodOperationParameter: path_1.path.to.templateNewMethodOperationParameter,
            methodOperationParameter: path_1.path.to.templateMethodOperationParameter,
            deleteMethodOperationParameter: path_1.path.to.templateDeleteMethodOperationParameter,
            newMethodOperationTool: path_1.path.to.templateNewMethodOperationTool,
            methodOperationTool: path_1.path.to.templateMethodOperationTool,
            deleteMethodOperationTool: path_1.path.to.templateDeleteMethodOperationTool
        }
    };
}
