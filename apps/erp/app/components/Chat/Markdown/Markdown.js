"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markdown = void 0;
var auth_1 = require("@carbon/auth");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var react_markdown_1 = require("react-markdown");
var react_router_1 = require("react-router");
var utils_1 = require("./utils");
exports.Markdown = (0, react_2.memo)(function (_a) {
    var children = _a.children, _b = _a.html, html = _b === void 0 ? false : _b, _c = _a.limitedMarkdown, limitedMarkdown = _c === void 0 ? false : _c;
    var components = (0, react_2.useMemo)(function () {
        return {
            a: function (props) {
                // biome-ignore lint/correctness/noUnusedVariables: suppressed due to migration
                var children = props.children, node = props.node, href = props.href, rest = __rest(props, ["children", "node", "href"]);
                if (href === null || href === void 0 ? void 0 : href.startsWith("/")) {
                    return (<react_router_1.Link {...rest} to={href} className="text-blue-700 dark:text-blue-400 font-bold underline">
                {children}
              </react_router_1.Link>);
                }
                if (href === null || href === void 0 ? void 0 : href.startsWith((0, auth_1.getAppUrl)())) {
                    return (<react_router_1.Link {...rest} to={href === null || href === void 0 ? void 0 : href.replace((0, auth_1.getAppUrl)(), "")} className="text-blue-700 dark:text-blue-400 font-bold underline">
                {children}
              </react_router_1.Link>);
                }
                return (<a {...rest} className="text-blue-700 dark:text-blue-400 font-bold underline">
              {children}
            </a>);
            },
            pre: function (props) {
                var _a, _b, _c, _d;
                var children = props.children, node = props.node, rest = __rest(props, ["children", "node"]);
                var firstChild = ((_a = node === null || node === void 0 ? void 0 : node.children) !== null && _a !== void 0 ? _a : [])[0];
                if (firstChild &&
                    firstChild.type === "element" &&
                    firstChild.tagName === "code" &&
                    ((_c = (_b = firstChild.children) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.type) === "text") {
                    // @ts-ignore
                    var className = firstChild.properties.className;
                    var _e = (_d = /language-(\w+)/.exec(String(className) || "")) !== null && _d !== void 0 ? _d : [], _f = _e[1], language = _f === void 0 ? "plaintext" : _f;
                    return <react_1.CodeBlock className={language}>{children}</react_1.CodeBlock>;
                }
                return <pre {...rest}>{children}</pre>;
            }
        };
    }, []);
    return (<react_markdown_1.default allowedElements={utils_1.allowedHTMLElements} components={components} remarkPlugins={(0, utils_1.remarkPlugins)(limitedMarkdown)} rehypePlugins={(0, utils_1.rehypePlugins)(html)}>
        {children}
      </react_markdown_1.default>);
});
exports.Markdown.displayName = "Markdown";
