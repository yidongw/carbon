"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeBlock = void 0;
var react_1 = require("react");
var core_1 = require("react-shiki/core");
var Button_1 = require("./Button");
// ─── Highlighter Setup ───────────────────────────────────────────────────────
var highlighter = await (0, core_1.createHighlighterCore)({
    themes: [Promise.resolve().then(function () { return require("@shikijs/themes/github-dark-default"); })],
    langs: [
        Promise.resolve().then(function () { return require("@shikijs/langs/bash"); }),
        Promise.resolve().then(function () { return require("@shikijs/langs/javascript"); }),
        Promise.resolve().then(function () { return require("@shikijs/langs/tsx"); })
    ],
    engine: (0, core_1.createJavaScriptRegexEngine)()
});
var removeItalics = {
    name: "remove-italics",
    span: function (node) {
        var _a;
        var style = (_a = node.properties) === null || _a === void 0 ? void 0 : _a.style;
        if (typeof style === "string" && style.includes("font-style")) {
            node.properties.style = style.replace(/font-style:\s*italic;?/g, "");
        }
    }
};
var CodeBlock = function (_a) {
    var _b;
    var children = _a.children, parentClassName = _a.parentClassName, languageClassName = _a.className, _c = _a.showCopy, showCopy = _c === void 0 ? true : _c;
    var _d = (0, react_1.useState)(false), showCopied = _d[0], setShowCopied = _d[1];
    (0, react_1.useEffect)(function () {
        if (!showCopied)
            return;
        var timer = setTimeout(function () { return setShowCopied(false); }, 2000);
        return function () { return clearTimeout(timer); };
    }, [showCopied]);
    var language = (languageClassName === null || languageClassName === void 0 ? void 0 : languageClassName.replace(/language-/, "")) || "typescript";
    var code = (_b = children === null || children === void 0 ? void 0 : children.trim()) !== null && _b !== void 0 ? _b : "";
    var handleCopyCode = function () {
        window.navigator.clipboard.writeText(code);
        setShowCopied(true);
    };
    return (<div className={"Code codeBlockWrapper group ".concat(parentClassName !== null && parentClassName !== void 0 ? parentClassName : "")}>
      <core_1.default highlighter={highlighter} language={language} theme={"github-dark-default"} showLanguage={false} addDefaultStyles={true} className="codeBlock" transformers={[removeItalics]}>
        {code}
      </core_1.default>

      {showCopy && (<div className="invisible absolute right-0 top-0 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
          <Button_1.Button size="sm" onClick={handleCopyCode}>
            {showCopied ? "Copied" : "Copy"}
          </Button_1.Button>
        </div>)}
    </div>);
};
exports.CodeBlock = CodeBlock;
