"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("@carbon/react");
var CodeSnippet = function (_a) {
    var _b, _c;
    var selectedLang = _a.selectedLang, snippet = _a.snippet;
    var hydrated = (0, react_1.useHydrated)();
    if (!hydrated || !snippet[selectedLang])
        return null;
    return (<div className="codeblock-container">
      <h4>{snippet.title}</h4>
      <react_1.CodeBlock className={(_b = snippet[selectedLang]) === null || _b === void 0 ? void 0 : _b.language}>
        {(_c = snippet[selectedLang]) === null || _c === void 0 ? void 0 : _c.code}
      </react_1.CodeBlock>
    </div>);
};
exports.default = CodeSnippet;
