"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Route;
var auth_1 = require("@carbon/auth");
var react_router_1 = require("react-router");
var api_1 = require("~/modules/api");
var CARBON_API_URL = (0, auth_1.getBrowserEnv)().CARBON_API_URL;
function Route() {
    var selectedLang = (0, api_1.useSelectedLang)();
    var config = (0, api_1.useApiDocsConfig)();
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Table id not found");
    var endpoint = config.apiUrl || CARBON_API_URL;
    var apiKey = config.apiKey || undefined;
    return (<api_1.TableDocs endpoint={endpoint} selectedLang={selectedLang} resourceId={id} apiKey={apiKey}/>);
}
