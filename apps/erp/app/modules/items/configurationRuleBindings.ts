import { path } from "~/utils/path";

export type ConfigurationRuleBindings = {
  save: string;
  delete: (field: string) => string;
};

export function partConfigurationRuleBindings(
  itemId: string
): ConfigurationRuleBindings {
  return {
    save: path.to.configurationRule(itemId),
    delete: (field: string) => path.to.deleteConfigurationRule(itemId, field)
  };
}

export function templateConfigurationRuleBindings(
  templateId: string
): ConfigurationRuleBindings {
  return {
    save: path.to.templateConfigurationRule(templateId),
    delete: (field: string) =>
      path.to.templateDeleteConfigurationRule(templateId, field)
  };
}
