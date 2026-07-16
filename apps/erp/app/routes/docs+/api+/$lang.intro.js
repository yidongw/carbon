"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Route;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var api_1 = require("~/modules/api");
var path_1 = require("~/utils/path");
var _a = (0, auth_1.getBrowserEnv)(), CARBON_API_URL = _a.CARBON_API_URL, ERP_URL = _a.ERP_URL;
function Route() {
    var selectedLang = (0, api_1.useSelectedLang)();
    var config = (0, api_1.useApiDocsConfig)();
    var apiUrl = config.apiUrl || CARBON_API_URL;
    var apiKey = config.apiKey || "<your-api-key>";
    return (<>
      <h2 className="doc-heading">Authentication</h2>
      <div className="doc-section">
        <article className="code-column text-foreground">
          <p>Carbon uses API token authentication for the public API.</p>
          <p>
            First you'll need an <react_router_1.Link to={path_1.path.to.apiKeys}>API Key</react_router_1.Link>.
          </p>
          <react_1.Alert variant="destructive">
            <lu_1.LuTriangleAlert className="h-4 w-4 my-1"/>
            <react_1.AlertTitle className="!my-0 font-bold text-base">
              You should never expose the API key in the client
            </react_1.AlertTitle>
            <react_1.AlertDescription>
              Your API key gives full access to your database. Never expose it
              in a public-facing client.
            </react_1.AlertDescription>
          </react_1.Alert>
        </article>
      </div>
      <h2 className="doc-heading">MCP</h2>
      <div className="doc-section">
        <article className="code-column text-foreground">
          <p>
            Carbon provides an MCP server that you can connect to from any MCP
            client, such as Claude Code or Claude Desktop.
          </p>
          <p>To connect, run the following command with your API token:</p>
          <article>
            <api_1.CodeSnippet selectedLang={selectedLang} snippet={{
            bash: {
                language: "bash",
                code: "claude mcp add --transport http \\\n  carbon ".concat(ERP_URL, "/api/mcp \\\n  --header \"Authorization: Bearer ").concat(apiKey, "\"")
            },
            js: {
                language: "bash",
                code: "claude mcp add --transport http \\\n  carbon ".concat(ERP_URL, "/api/mcp \\\n  --header \"Authorization: Bearer ").concat(apiKey, "\"")
            }
        }}/>
          </article>
        </article>
      </div>
      {selectedLang == "js" ? (<>
          <h2 className="doc-heading">Client Library SDK</h2>
          <div className="doc-section">
            <article className="code-column text-foreground">
              <p>
                The easiest way to interact with the public API is via the
                JavaScript Client Library SDK.
              </p>
              <p>Save the API Key as an Environment Variable.</p>
              <article>
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.env({ apiUrl: apiUrl, apiKey: apiKey })}/>
              </article>
              <p>
                The API Key is provided via the <code>Authorization</code>{" "}
                header when making requests to the API.
              </p>
              <p>
                As with your API Key, we recommend setting your Client Key as an
                Environment Variable.
              </p>
              <p>Initialize the client as follows:</p>
              <div className="doc-section doc-section--client-libraries">
                <article className="code">
                  <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.init(apiUrl)}/>
                </article>
              </div>
              <p>
                You can now make requests to the API using the client. See the
                specific tables and views for more details.
              </p>
            </article>
          </div>
        </>) : null}
    </>);
}
