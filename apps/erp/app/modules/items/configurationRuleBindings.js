"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partConfigurationRuleBindings = partConfigurationRuleBindings;
exports.templateConfigurationRuleBindings = templateConfigurationRuleBindings;
var path_1 = require("~/utils/path");
function partConfigurationRuleBindings(itemId) {
    return {
        save: path_1.path.to.configurationRule(itemId),
        delete: function (field) { return path_1.path.to.deleteConfigurationRule(itemId, field); }
    };
}
function templateConfigurationRuleBindings(templateId) {
    return {
        save: path_1.path.to.templateConfigurationRule(templateId),
        delete: function (field) {
            return path_1.path.to.templateDeleteConfigurationRule(templateId, field);
        }
    };
}
