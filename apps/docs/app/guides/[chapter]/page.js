"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStaticParams = generateStaticParams;
exports.generateMetadata = generateMetadata;
exports.default = GuidePage;
var navigation_1 = require("next/navigation");
var guide_context_1 = require("@/components/editorial/guide-context");
var guide_subnav_1 = require("@/components/editorial/guide-subnav");
var how_to_layout_1 = require("@/components/editorial/how-to-layout");
var mdx_1 = require("@/components/editorial/mdx");
var main_header_1 = require("@/components/main-header");
var source_1 = require("@/lib/source");
// Fumadocs' toc item `title` is a ReactNode (often a React element, not a string),
// so pull the plain text out of it — otherwise the rail renders "[object Object]".
function tocText(node) {
    var _a;
    if (node == null || typeof node === "boolean")
        return "";
    if (typeof node === "string" || typeof node === "number")
        return String(node);
    if (Array.isArray(node))
        return node.map(tocText).join("");
    if (typeof node === "object" && "props" in node) {
        return tocText((_a = node.props) === null || _a === void 0 ? void 0 : _a.children);
    }
    return "";
}
// Chapters in reading order: flows are ordered by `flowIndex`, chapters within a
// flow by `index`. This keeps each flow's chapters contiguous in the flat list.
function orderedPages() {
    return source_1.guideSource
        .getPages()
        .slice()
        .sort(function (a, b) {
        var _a, _b, _c, _d;
        return ((_a = a.data.flowIndex) !== null && _a !== void 0 ? _a : 0) - ((_b = b.data.flowIndex) !== null && _b !== void 0 ? _b : 0) ||
            ((_c = a.data.index) !== null && _c !== void 0 ? _c : 0) - ((_d = b.data.index) !== null && _d !== void 0 ? _d : 0);
    });
}
function generateStaticParams() {
    return orderedPages().map(function (p) { return ({ chapter: p.slugs[0] }); });
}
function generateMetadata(props) {
    return __awaiter(this, void 0, void 0, function () {
        var chapter, page;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, props.params];
                case 1:
                    chapter = (_a.sent()).chapter;
                    page = orderedPages().find(function (p) { return p.slugs[0] === chapter; });
                    return [2 /*return*/, {
                            title: page ? "".concat(page.data.title, " \u2014 Carbon") : "Carbon Docs",
                            description: page === null || page === void 0 ? void 0 : page.data.description
                        }];
            }
        });
    });
}
function GuidePage(props) {
    return __awaiter(this, void 0, void 0, function () {
        var chapter, pages, chapters, bodies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, props.params];
                case 1:
                    chapter = (_a.sent()).chapter;
                    pages = orderedPages();
                    if (!pages.some(function (p) { return p.slugs[0] === chapter; }))
                        (0, navigation_1.notFound)();
                    chapters = pages.map(function (p) { return ({
                        slug: p.slugs[0],
                        index: p.data.index,
                        title: p.data.title,
                        description: p.data.description,
                        label: p.data.label,
                        flow: p.data.flow,
                        flowName: p.data.flowName,
                        flowIndex: p.data.flowIndex,
                        items: p.data.toc
                            .filter(function (t) { return t.depth === 2; })
                            .map(function (t) { return ({
                            title: tocText(t.title),
                            id: t.url.replace(/^#/, "")
                        }); })
                    }); });
                    bodies = pages.map(function (p) {
                        var MDX = p.data.body;
                        return <MDX key={p.slugs[0]} components={mdx_1.editorialMdxComponents}/>;
                    });
                    return [2 /*return*/, (<guide_context_1.GuideProvider chapters={chapters} initialSlug={chapter}>
      <main_header_1.MainHeader active="guides"/>
      <guide_subnav_1.GuideSubnav />
      <how_to_layout_1.HowToLayout bodies={bodies}/>
    </guide_context_1.GuideProvider>)];
            }
        });
    });
}
