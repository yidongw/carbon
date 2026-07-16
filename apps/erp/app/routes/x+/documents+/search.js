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
exports.default = DocumentsAllRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var react_router_1 = require("react-router");
var documents_1 = require("~/modules/documents");
var path_1 = require("~/utils/path");
var query_1 = require("~/utils/query");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, url, searchParams, search, filter, createdBy, favorite, recent, active, _d, limit, offset, sorts, filters, _e, documents, labels, extensions, _f, _g;
        var _h, _j, _k, _l, _m;
        var request = _b.request;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "documents"
                    })];
                case 1:
                    _c = _o.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    url = new URL(request.url);
                    searchParams = new URLSearchParams(url.search);
                    search = searchParams.get("search");
                    filter = searchParams.get("q");
                    createdBy = filter === "my" ? userId : undefined;
                    favorite = filter === "starred" ? true : undefined;
                    recent = filter === "recent" ? true : undefined;
                    active = filter === "trash" ? false : true;
                    _d = (0, query_1.getGenericQueryFilters)(searchParams), limit = _d.limit, offset = _d.offset, sorts = _d.sorts, filters = _d.filters;
                    return [4 /*yield*/, Promise.all([
                            (0, documents_1.getDocuments)(client, companyId, {
                                search: search,
                                favorite: favorite,
                                recent: recent,
                                createdBy: createdBy,
                                active: active,
                                limit: limit,
                                offset: offset,
                                sorts: sorts,
                                filters: filters
                            }),
                            (0, documents_1.getDocumentLabels)(client, userId),
                            (0, documents_1.getDocumentExtensions)(client)
                        ])];
                case 2:
                    _e = _o.sent(), documents = _e[0], labels = _e[1], extensions = _e[2];
                    if (!documents.error) return [3 /*break*/, 4];
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.authenticatedRoot];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(documents.error, "Failed to fetch documents"))];
                case 3:
                    _f.apply(void 0, _g.concat([_o.sent()]));
                    _o.label = 4;
                case 4: return [2 /*return*/, {
                        count: (_h = documents.count) !== null && _h !== void 0 ? _h : 0,
                        documents: ((_j = documents.data) !== null && _j !== void 0 ? _j : []),
                        labels: (_k = labels.data) !== null && _k !== void 0 ? _k : [],
                        extensions: (_m = (_l = extensions.data) === null || _l === void 0 ? void 0 : _l.map(function (_a) {
                            var extension = _a.extension;
                            return extension;
                        })) !== null && _m !== void 0 ? _m : []
                    }];
            }
        });
    });
}
function DocumentsAllRoute() {
    var _a = (0, react_router_1.useLoaderData)(), count = _a.count, documents = _a.documents, labels = _a.labels, extensions = _a.extensions;
    return (<react_1.VStack spacing={0} className="h-full ">
      <react_1.ResizablePanelGroup direction="horizontal">
        <react_1.ResizablePanel>
          <documents_1.DocumentsTable data={documents} count={count} labels={labels} extensions={extensions}/>
        </react_1.ResizablePanel>
        <react_router_1.Outlet />
      </react_1.ResizablePanelGroup>
    </react_1.VStack>);
}
