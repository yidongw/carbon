"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tools = Tools;
var ToolBrowser_1 = require("./ToolBrowser");
function Tools(_a) {
    var catalog = _a.catalog;
    return (<>
      <p className="text-muted-foreground max-w-[64ch] mb-6 text-[0.95rem] [text-wrap:pretty]">
        {catalog.total.toLocaleString()} tools across {catalog.moduleCount}{" "}
        modules. Filter by module, or search the full catalog.
      </p>
      <ToolBrowser_1.ToolBrowser tools={catalog.tools} modules={catalog.modules}/>
    </>);
}
