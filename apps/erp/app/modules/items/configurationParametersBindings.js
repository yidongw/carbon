"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partConfigurationParametersBindings = partConfigurationParametersBindings;
exports.templateConfigurationParametersBindings = templateConfigurationParametersBindings;
var path_1 = require("~/utils/path");
var items_models_1 = require("./items.models");
function partConfigurationParametersBindings(itemId) {
    return {
        ownerId: itemId,
        ownerField: "itemId",
        parameterValidator: items_models_1.configurationParameterValidator,
        parameterGroupValidator: items_models_1.configurationParameterGroupValidator,
        urls: {
            configurationParameter: path_1.path.to.configurationParameter(itemId),
            configurationParameterGroup: path_1.path.to.configurationParameterGroup(itemId),
            configurationParameterGroupOrder: path_1.path.to.configurationParameterGroupOrder(itemId),
            configurationParameterOrder: path_1.path.to.configurationParameterOrder(itemId),
            deleteConfigurationParameter: function (parameterId) {
                return path_1.path.to.deleteConfigurationParameter(itemId, parameterId);
            },
            deleteConfigurationParameterGroup: function (groupId) {
                return path_1.path.to.deleteConfigurationParameterGroup(itemId, groupId);
            }
        }
    };
}
function templateConfigurationParametersBindings(templateId) {
    return {
        ownerId: templateId,
        ownerField: "templateId",
        parameterValidator: items_models_1.templateConfigurationParameterValidator,
        parameterGroupValidator: items_models_1.configurationParameterGroupValidator,
        urls: {
            configurationParameter: path_1.path.to.templateConfigurationParameter(templateId),
            configurationParameterGroup: path_1.path.to.templateConfigurationParameterGroup(templateId),
            configurationParameterGroupOrder: path_1.path.to.templateConfigurationParameterGroupOrder(templateId),
            configurationParameterOrder: path_1.path.to.templateConfigurationParameterOrder(templateId),
            deleteConfigurationParameter: function (parameterId) {
                return path_1.path.to.templateDeleteConfigurationParameter(templateId, parameterId);
            },
            deleteConfigurationParameterGroup: function (groupId) {
                return path_1.path.to.templateDeleteConfigurationParameterGroup(templateId, groupId);
            }
        }
    };
}
