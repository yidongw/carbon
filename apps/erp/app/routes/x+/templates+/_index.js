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
exports.loader = loader;
exports.default = DocumentTemplatesIndexRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var template_1 = require("@carbon/documents/template");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var request = _b.request;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, { view: "settings", role: "employee" })];
                case 1:
                    _c.sent();
                    return [2 /*return*/, null];
            }
        });
    });
}
var GROUP_ORDER = [
    "Sales",
    "Purchasing",
    "Inventory",
    "Production",
    "Quality",
    "Labels"
];
function DocumentTemplatesIndexRoute() {
    var groups = GROUP_ORDER.map(function (group) { return ({
        group: group,
        docs: template_1.DOCUMENT_CATALOG.filter(function (entry) { return entry.group === group; })
    }); }).filter(function (g) { return g.docs.length > 0; });
    return (<react_1.ScrollArea className="h-full w-full">
      <react_1.VStack spacing={4} className="mx-auto h-full max-w-[60rem] gap-6 px-4 py-12">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <react_1.Heading size="h3">
              <macro_1.Trans>Document Templates</macro_1.Trans>
            </react_1.Heading>
            <p className="text-sm text-muted-foreground">
              <macro_1.Trans>
                Customize the layout of your PDF documents — reorder sections,
                hide what you don't need, and add your own blocks.
              </macro_1.Trans>
            </p>
          </div>
          <react_1.Button variant="secondary" leftIcon={<lu_1.LuLibrary />} asChild>
            <react_router_1.Link to={path_1.path.to.documentSections}>
              <macro_1.Trans>Shared Sections</macro_1.Trans>
            </react_router_1.Link>
          </react_1.Button>
        </div>

        {groups.map(function (_a) {
            var group = _a.group, docs = _a.docs;
            return (<section key={group} className="flex w-full flex-col gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {group}
            </h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {docs.map(function (doc) { return (<DocumentCard key={doc.type} doc={doc}/>); })}
            </div>
          </section>);
        })}
      </react_1.VStack>
    </react_1.ScrollArea>);
}
function DocumentCard(_a) {
    var doc = _a.doc;
    var inner = (<>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
        <lu_1.LuFileText className="size-4"/>
      </span>
      <span className="flex flex-col">
        <span className="text-sm font-medium">{doc.label}</span>
        {!doc.supported && (<span className="text-xs text-muted-foreground">
            <macro_1.Trans>Coming soon</macro_1.Trans>
          </span>)}
      </span>
      {doc.supported ? (<lu_1.LuChevronRight className="ml-auto size-4 text-muted-foreground"/>) : (<react_1.Badge variant="secondary" className="ml-auto">
          <macro_1.Trans>Soon</macro_1.Trans>
        </react_1.Badge>)}
    </>);
    var className = (0, react_1.cn)("flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors", doc.supported
        ? "hover:border-primary hover:bg-accent/30"
        : "cursor-not-allowed opacity-60");
    if (!doc.supported) {
        return (<div aria-disabled className={className}>
        {inner}
      </div>);
    }
    return (<react_router_1.Link to={path_1.path.to.documentTemplate(doc.type)} className={className}>
      {inner}
    </react_router_1.Link>);
}
