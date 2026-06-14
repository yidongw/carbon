import { path } from "~/utils/path";

export type MethodBindings = {
  /** When set, BOM line item picker excludes this item id (the part being edited). */
  bomItemBlacklistId: string | undefined;
  urls: {
    newMethodMaterial: string;
    methodMaterial: (id: string) => string;
    deleteMethodMaterial: (id: string) => string;
    methodMaterialsOrder: string;
    newMethodOperation: string;
    methodOperation: (id: string) => string;
    methodOperationsOrder: string;
    methodOperationsDelete: string;
    newMethodOperationStep: string;
    methodOperationStepOrder: (operationId: string) => string;
    methodOperationStep: (id: string) => string;
    deleteMethodOperationStep: (id: string) => string;
    newMethodOperationParameter: string;
    methodOperationParameter: (id: string) => string;
    deleteMethodOperationParameter: (id: string) => string;
    newMethodOperationTool: string;
    methodOperationTool: (id: string) => string;
    deleteMethodOperationTool: (id: string) => string;
  };
};

export function methodBindings(itemId: string): MethodBindings {
  return {
    bomItemBlacklistId: itemId,
    urls: {
      newMethodMaterial: path.to.newMethodMaterial,
      methodMaterial: path.to.methodMaterial,
      deleteMethodMaterial: path.to.deleteMethodMaterial,
      methodMaterialsOrder: path.to.methodMaterialsOrder,
      newMethodOperation: path.to.newMethodOperation,
      methodOperation: path.to.methodOperation,
      methodOperationsOrder: path.to.methodOperationsOrder,
      methodOperationsDelete: path.to.methodOperationsDelete,
      newMethodOperationStep: path.to.newMethodOperationStep,
      methodOperationStepOrder: path.to.methodOperationStepOrder,
      methodOperationStep: path.to.methodOperationStep,
      deleteMethodOperationStep: path.to.deleteMethodOperationStep,
      newMethodOperationParameter: path.to.newMethodOperationParameter,
      methodOperationParameter: path.to.methodOperationParameter,
      deleteMethodOperationParameter: path.to.deleteMethodOperationParameter,
      newMethodOperationTool: path.to.newMethodOperationTool,
      methodOperationTool: path.to.methodOperationTool,
      deleteMethodOperationTool: path.to.deleteMethodOperationTool
    }
  };
}

export function templateMethodBindings(): MethodBindings {
  return {
    bomItemBlacklistId: undefined,
    urls: {
      newMethodMaterial: path.to.templateNewMethodMaterial,
      methodMaterial: path.to.templateMethodMaterial,
      deleteMethodMaterial: path.to.templateDeleteMethodMaterial,
      methodMaterialsOrder: path.to.templateMethodMaterialsOrder,
      newMethodOperation: path.to.templateNewMethodOperation,
      methodOperation: path.to.templateMethodOperation,
      methodOperationsOrder: path.to.templateMethodOperationsOrder,
      methodOperationsDelete: path.to.templateMethodOperationsDelete,
      newMethodOperationStep: path.to.templateNewMethodOperationStep,
      methodOperationStepOrder: path.to.templateMethodOperationStepOrder,
      methodOperationStep: path.to.templateMethodOperationStep,
      deleteMethodOperationStep: path.to.templateDeleteMethodOperationStep,
      newMethodOperationParameter: path.to.templateNewMethodOperationParameter,
      methodOperationParameter: path.to.templateMethodOperationParameter,
      deleteMethodOperationParameter:
        path.to.templateDeleteMethodOperationParameter,
      newMethodOperationTool: path.to.templateNewMethodOperationTool,
      methodOperationTool: path.to.templateMethodOperationTool,
      deleteMethodOperationTool: path.to.templateDeleteMethodOperationTool
    }
  };
}
