import type { z } from "zod";
import { path } from "~/utils/path";
import {
  configurationParameterGroupValidator,
  configurationParameterValidator,
  templateConfigurationParameterValidator
} from "./items.models";

export type ConfigurationParametersBindings = {
  ownerId: string;
  ownerField: "itemId" | "templateId";
  parameterValidator: z.ZodTypeAny;
  parameterGroupValidator: typeof configurationParameterGroupValidator;
  urls: {
    configurationParameter: string;
    configurationParameterGroup: string;
    configurationParameterGroupOrder: string;
    configurationParameterOrder: string;
    deleteConfigurationParameter: (parameterId: string) => string;
    deleteConfigurationParameterGroup: (groupId: string) => string;
  };
};

export function partConfigurationParametersBindings(
  itemId: string
): ConfigurationParametersBindings {
  return {
    ownerId: itemId,
    ownerField: "itemId",
    parameterValidator: configurationParameterValidator,
    parameterGroupValidator: configurationParameterGroupValidator,
    urls: {
      configurationParameter: path.to.configurationParameter(itemId),
      configurationParameterGroup: path.to.configurationParameterGroup(itemId),
      configurationParameterGroupOrder:
        path.to.configurationParameterGroupOrder(itemId),
      configurationParameterOrder: path.to.configurationParameterOrder(itemId),
      deleteConfigurationParameter: (parameterId: string) =>
        path.to.deleteConfigurationParameter(itemId, parameterId),
      deleteConfigurationParameterGroup: (groupId: string) =>
        path.to.deleteConfigurationParameterGroup(itemId, groupId)
    }
  };
}

export function templateConfigurationParametersBindings(
  templateId: string
): ConfigurationParametersBindings {
  return {
    ownerId: templateId,
    ownerField: "templateId",
    parameterValidator: templateConfigurationParameterValidator,
    parameterGroupValidator: configurationParameterGroupValidator,
    urls: {
      configurationParameter:
        path.to.templateConfigurationParameter(templateId),
      configurationParameterGroup:
        path.to.templateConfigurationParameterGroup(templateId),
      configurationParameterGroupOrder:
        path.to.templateConfigurationParameterGroupOrder(templateId),
      configurationParameterOrder:
        path.to.templateConfigurationParameterOrder(templateId),
      deleteConfigurationParameter: (parameterId: string) =>
        path.to.templateDeleteConfigurationParameter(templateId, parameterId),
      deleteConfigurationParameterGroup: (groupId: string) =>
        path.to.templateDeleteConfigurationParameterGroup(templateId, groupId)
    }
  };
}
