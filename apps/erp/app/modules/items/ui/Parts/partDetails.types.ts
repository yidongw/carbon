import type { JSONContent } from "@carbon/react";
import type { MakeMethod } from "~/modules/items";
import type { MethodItemType, MethodType } from "~/modules/shared";

export type PartDetailsData = {
  methodData: {
    makeMethod: MakeMethod;
    methodMaterials: {
      description: string;
      methodType: MethodType;
      itemType: MethodItemType;
      [key: string]: unknown;
    }[];
    methodOperations: {
      workCenterId?: string;
      operationSupplierProcessId?: string;
      workInstruction: JSONContent | null;
      [key: string]: unknown;
    }[];
    partManufacturing: Record<string, unknown> | null;
    configurationParametersAndGroups: {
      groups: unknown[];
      parameters: unknown[];
    };
    configurationRules: unknown[];
  } | null;
  tags: { name: string }[];
};
