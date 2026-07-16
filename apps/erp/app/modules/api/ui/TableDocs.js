"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var useSwaggerDocs_1 = require("~/hooks/useSwaggerDocs");
var api_1 = require("~/modules/api");
var string_1 = require("~/utils/string");
var functionPath = "rpc/";
var TableDocs = function (_a) {
    var _b, _c, _d;
    var endpoint = _a.endpoint, selectedLang = _a.selectedLang, resourceId = _a.resourceId, apiKey = _a.apiKey;
    var swaggerDocsSchema = (0, useSwaggerDocs_1.useSwaggerDocs)();
    var resources = Object.entries((swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.paths) || {}).reduce(function (a, _a) {
        var _b;
        var name = _a[0];
        var trimmedName = name.slice(1);
        var id = trimmedName.replace(functionPath, "");
        var displayName = id.replace(/_/g, " ");
        var camelCase = (0, string_1.snakeToCamel)(id);
        var enriched = { id: id, displayName: displayName, camelCase: camelCase };
        if (!trimmedName.length) {
            return a;
        }
        return {
            resources: __assign(__assign({}, a.resources), (!trimmedName.includes(functionPath)
                ? (_b = {},
                    _b[id] = enriched,
                    _b) : {}))
        };
    }, { resources: {} }).resources;
    var resourcePaths = (_b = swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.paths) === null || _b === void 0 ? void 0 : _b["/".concat(resourceId)];
    var resourceDefinition = (_c = swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.definitions) === null || _c === void 0 ? void 0 : _c[resourceId];
    // @ts-ignore
    var resourceMeta = resources === null || resources === void 0 ? void 0 : resources[resourceId];
    var realtimeEnabled = true; // TODO: realtime is not available for a lot of tables (unless we enable it)
    var methods = Object.keys(resourcePaths !== null && resourcePaths !== void 0 ? resourcePaths : {}).map(function (x) { return x.toUpperCase(); });
    var properties = Object.entries((_d = resourceDefinition === null || resourceDefinition === void 0 ? void 0 : resourceDefinition.properties) !== null && _d !== void 0 ? _d : []).map(function (_a) {
        var _b;
        var id = _a[0], val = _a[1];
        return (__assign(__assign({}, val), { id: id, required: (_b = resourceDefinition === null || resourceDefinition === void 0 ? void 0 : resourceDefinition.required) === null || _b === void 0 ? void 0 : _b.includes(id) }));
    });
    if (!(swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.paths) ||
        !(swaggerDocsSchema === null || swaggerDocsSchema === void 0 ? void 0 : swaggerDocsSchema.definitions) ||
        !swaggerDocsSchema)
        return null;
    return (<>
      <h2 className="doc-section__table-name text-foreground mt-0 flex items-center px-6 gap-2">
        <span className="bg-muted p-2 rounded-lg">
          <lu_1.LuTable2 size={18}/>
        </span>
        <span className="text-2xl font-bold">{resourceId}</span>
      </h2>

      <div className="doc-section">
        <article className="code"></article>
      </div>
      {properties.length > 0 && (<div>
          {properties.map(function (x) { return (<div className="doc-section py-4" key={x.id}>
              <div className="code-column text-foreground">
                <Param key={x.id} name={x.id} type={x.type} format={x.format} isOptional={!x.required} metadata={{
                    table: resourceId,
                    column: x.id
                }}/>
              </div>
              <div className="code">
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.readColumns({
                    title: "Select ".concat(x.id),
                    resourceId: resourceId,
                    endpoint: endpoint,
                    columnName: x.id,
                    apiKey: apiKey
                })}/>
              </div>
            </div>); })}
        </div>)}
      {methods.includes("GET") && (<>
          <h3 className="text-foreground mt-4 px-6">
            <macro_1.Trans>Read rows</macro_1.Trans>
          </h3>
          <div className="doc-section">
            <article className="code-column text-foreground">
              <p>
                <macro_1.Trans>
                  To read rows in <code>{resourceId}</code>, use the{" "}
                  <code>select</code> method.
                </macro_1.Trans>
              </p>
              <p>
                <a href="https://supabase.com/docs/reference/javascript/select" target="_blank" rel="noreferrer">
                  <macro_1.Trans>Learn more</macro_1.Trans>
                </a>
              </p>
            </article>
            <article className="code">
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.readAll(resourceId, endpoint, apiKey)}/>
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.readColumns({
                resourceId: resourceId,
                endpoint: endpoint,
                apiKey: apiKey
            })}/>
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.readForeignTables(resourceId, endpoint, apiKey)}/>
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.readRange(resourceId, endpoint, apiKey)}/>
            </article>
          </div>
          <div className="doc-section">
            <article className="code-column text-foreground">
              <h4 className="mt-0 text-white">
                <macro_1.Trans>Filtering</macro_1.Trans>
              </h4>
              <p>
                <macro_1.Trans>Supabase provides a wide range of filters.</macro_1.Trans>
              </p>
              <p>
                <a href="https://supabase.com/docs/reference/javascript/using-filters" target="_blank" rel="noreferrer">
                  <macro_1.Trans>Learn more</macro_1.Trans>
                </a>
              </p>
            </article>
            <article className="code">
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.readFilters(resourceId, endpoint, apiKey)}/>
            </article>
          </div>
        </>)}
      {methods.includes("POST") && (<>
          <h3 className="text-foreground mt-4 px-6">
            <macro_1.Trans>Insert rows</macro_1.Trans>
          </h3>
          <div className="doc-section">
            <article className="code-column text-foreground">
              <p>
                <macro_1.Trans>
                  <code>insert</code> lets you insert into your tables. You can
                  also insert in bulk and do UPSERT.
                </macro_1.Trans>
              </p>
              <p>
                <macro_1.Trans>
                  <code>insert</code> will also return the replaced values for
                  UPSERT.
                </macro_1.Trans>
              </p>
              <p>
                <a href="https://supabase.com/docs/reference/javascript/insert" target="_blank" rel="noreferrer">
                  <macro_1.Trans>Learn more</macro_1.Trans>
                </a>
              </p>
            </article>
            <article className="code">
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.insertSingle(resourceId, endpoint, apiKey)}/>
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.insertMany(resourceId, endpoint, apiKey)}/>
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.upsert(resourceId, endpoint, apiKey)}/>
            </article>
          </div>
        </>)}
      {methods.includes("PATCH") && (<>
          <h3 className="text-foreground mt-4 px-6">
            <macro_1.Trans>Update rows</macro_1.Trans>
          </h3>
          <div className="doc-section">
            <article className="code-column text-foreground">
              <p>
                <macro_1.Trans>
                  <code>update</code> lets you update rows. <code>update</code>{" "}
                  will match all rows by default. You can update specific rows
                  using horizontal filters, e.g. <code>eq</code>,{" "}
                  <code>lt</code>, and <code>is</code>.
                </macro_1.Trans>
              </p>
              <p>
                <macro_1.Trans>
                  <code>update</code> will also return the replaced values for
                  UPDATE.
                </macro_1.Trans>
              </p>
              <p>
                <a href="https://supabase.com/docs/reference/javascript/update" target="_blank" rel="noreferrer">
                  <macro_1.Trans>Learn more</macro_1.Trans>
                </a>
              </p>
            </article>
            <article className="code">
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.update(resourceId, endpoint, apiKey)}/>
            </article>
          </div>
        </>)}
      {methods.includes("DELETE") && (<>
          <h3 className="text-foreground mt-4 px-6">
            <macro_1.Trans>Delete rows</macro_1.Trans>
          </h3>
          <div className="doc-section">
            <article className="code-column text-foreground">
              <p>
                <macro_1.Trans>
                  <code>delete</code> lets you delete rows. <code>delete</code>{" "}
                  will match all rows by default, so remember to specify your
                  filters!
                </macro_1.Trans>
              </p>
              <p>
                <a href="https://supabase.com/docs/reference/javascript/delete" target="_blank" rel="noreferrer">
                  <macro_1.Trans>Learn more</macro_1.Trans>
                </a>
              </p>
            </article>
            <article className="code">
              <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.delete(resourceId, endpoint, apiKey)}/>
            </article>
          </div>
        </>)}
      {realtimeEnabled &&
            (methods.includes("DELETE") ||
                methods.includes("POST") ||
                methods.includes("PATCH")) && (<>
            <h3 className="text-foreground mt-4 px-6">
              <macro_1.Trans>Subscribe to changes</macro_1.Trans>
            </h3>
            <div className="doc-section">
              <article className="code-column text-foreground">
                <p>
                  <macro_1.Trans>
                    Supabase provides realtime functionality and broadcasts
                    database changes to authorized users depending on Row Level
                    Security (RLS) policies.
                  </macro_1.Trans>
                </p>
                <p>
                  <a href="https://supabase.com/docs/reference/javascript/subscribe" target="_blank" rel="noreferrer">
                    <macro_1.Trans>Learn more</macro_1.Trans>
                  </a>
                </p>
              </article>
              <article className="code">
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.subscribeAll(resourceMeta.camelCase, resourceId)}/>
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.subscribeInserts(resourceMeta.camelCase, resourceId)}/>
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.subscribeUpdates(resourceMeta.camelCase, resourceId)}/>
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.subscribeDeletes(resourceMeta.camelCase, resourceId)}/>
                <api_1.CodeSnippet selectedLang={selectedLang} snippet={api_1.Snippets.subscribeEq(resourceMeta.camelCase, resourceId, "column_name", "someValue")}/>
              </article>
            </div>
          </>)}
    </>);
};
var Param = function (_a) {
    var name = _a.name, isOptional = _a.isOptional, type = _a.type, format = _a.format, children = _a.children, isPrimitive = _a.isPrimitive;
    return (<>
      <div className="mb-4 flex items-center justify-between ">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-2">
            <label className="font-mono text-xs uppercase text-foreground-lighter  min-w-[55px]">
              <macro_1.Trans>Column</macro_1.Trans>
            </label>
            <div className="flex items-center gap-4">
              <span className="text-md text-foreground pb-0.5">{name}</span>
            </div>
          </div>
        </div>
        <div className={(0, react_1.cn)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs", !isOptional && "border-amber-700 bg-amber-300 text-amber-900 ")}>
          {isOptional ? <macro_1.Trans>Optional</macro_1.Trans> : <macro_1.Trans>Required</macro_1.Trans>}
        </div>
      </div>
      <div className="grid gap-2 mt-6">
        <div className="mb-4 flex items-center gap-2">
          <label className="font-mono text-xs uppercase text-foreground-lighter min-w-[55px]">
            <macro_1.Trans>Type</macro_1.Trans>
          </label>
          <div>
            <span className="flex grow-0 bg-muted px-2 py-0.5 rounded-md text-foreground-light">
              <span className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span>{type}</span>
              </span>
            </span>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <label className="font-mono text-xs uppercase text-foreground-lighter min-w-[55px]">
            <macro_1.Trans>Format</macro_1.Trans>
          </label>
          <div>
            <span className="flex grow-0 bg-muted px-2 py-0.5 rounded-md text-foreground-light">
              <span className="flex items-center gap-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
                <span>{format}</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </>);
};
exports.default = TableDocs;
