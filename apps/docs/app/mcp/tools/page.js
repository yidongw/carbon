"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = McpToolsPage;
var doc_1 = require("@/components/api/doc");
exports.metadata = {
    title: "MCP Tools — Carbon",
    description: "Carbon's MCP server exposes 1,200+ tools through a lean discovery pattern."
};
var MODULES = [
    ["Sales", 181],
    ["Items", 147],
    ["Production", 132],
    ["Inventory", 113],
    ["Purchasing", 109],
    ["Resources", 96],
    ["Quality", 85],
    ["Settings", 83],
    ["Accounting", 81],
    ["Shared", 50],
    ["People", 46],
    ["Invoicing", 34],
    ["Users", 26],
    ["Documents", 14],
    ["Account", 10]
];
function McpToolsPage() {
    return (<doc_1.DocPage>
      <doc_1.DocEyebrow>MCP</doc_1.DocEyebrow>
      <doc_1.DocTitle>Tools</doc_1.DocTitle>
      <doc_1.Lead>
        Carbon's MCP server exposes more than 1,200 tools across 15 modules —
        without flooding the assistant's context with all of them at once.
      </doc_1.Lead>

      <doc_1.H2 id="discovery">Tool discovery</doc_1.H2>
      <doc_1.P>
        Rather than list every tool, the server presents three meta-tools. The
        model uses them to find and load only the tools a task needs:
      </doc_1.P>
      <doc_1.Table>
        <doc_1.Row head cols="150px 1fr" cells={["Meta-tool", "What it does"]}/>
        <doc_1.Row cols="150px 1fr" cells={[
            <doc_1.Code key="s">search_tools</doc_1.Code>,
            "Find tools by query, module, or classification."
        ]}/>
        <doc_1.Row cols="150px 1fr" cells={[
            <doc_1.Code key="d">describe_tool</doc_1.Code>,
            "Get a tool's input schema and description."
        ]}/>
        <doc_1.Row cols="150px 1fr" cells={[
            <doc_1.Code key="c">call_tool</doc_1.Code>,
            "Invoke a tool by name with its arguments."
        ]}/>
      </doc_1.Table>
      <doc_1.P>
        A typical flow is <doc_1.Code>search_tools</doc_1.Code> → <doc_1.Code>describe_tool</doc_1.Code>{" "}
        → <doc_1.Code>call_tool</doc_1.Code>, which keeps the model's context lean no matter
        how large the catalog grows.
      </doc_1.P>

      <doc_1.H2 id="classification">Classification</doc_1.H2>
      <doc_1.P>Every tool is classified, so a client can gate actions by risk:</doc_1.P>
      <doc_1.Table>
        <doc_1.Row head cols="130px 1fr 72px" cells={["Class", "Grants", "Count"]}/>
        <doc_1.Row cols="130px 1fr 72px" cells={[<doc_1.Code key="r">READ</doc_1.Code>, "Read rows", "617"]}/>
        <doc_1.Row cols="130px 1fr 72px" cells={[<doc_1.Code key="w">WRITE</doc_1.Code>, "Create & update rows", "438"]}/>
        <doc_1.Row cols="130px 1fr 72px" cells={[<doc_1.Code key="x">DESTRUCTIVE</doc_1.Code>, "Delete rows", "152"]}/>
      </doc_1.Table>

      <doc_1.H2 id="modules">Modules</doc_1.H2>
      <doc_1.P>
        The catalog is grouped into 15 modules — browse them in the sidebar:
      </doc_1.P>
      <doc_1.Table>
        <doc_1.Row head cols="1fr 72px" cells={["Module", "Tools"]}/>
        {MODULES.map(function (_a) {
            var name = _a[0], count = _a[1];
            return (<doc_1.Row key={name} cols="1fr 72px" cells={[name, String(count)]}/>);
        })}
      </doc_1.Table>
    </doc_1.DocPage>);
}
