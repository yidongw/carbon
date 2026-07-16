"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.handle = void 0;
exports.loader = loader;
exports.default = ProcedureRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var Editor_1 = require("@carbon/react/Editor");
var date_1 = require("@internationalized/date");
var macro_1 = require("@lingui/core/macro");
var nanoid_1 = require("nanoid");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var hooks_1 = require("~/hooks");
var production_1 = require("~/modules/production");
var ProcedureExplorer_1 = require("~/modules/production/ui/Procedures/ProcedureExplorer");
var ProcedureHeader_1 = require("~/modules/production/ui/Procedures/ProcedureHeader");
var ProcedureProperties_1 = require("~/modules/production/ui/Procedures/ProcedureProperties");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Procedures"], ["Procedures"]))),
    to: path_1.path.to.procedures,
    module: "production"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, id, _d, procedure, tags, _e, _f;
        var _g;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "production",
                        role: "employee",
                        bypassRls: true
                    })];
                case 1:
                    _c = _h.sent(), client = _c.client, companyId = _c.companyId;
                    id = params.id;
                    if (!id)
                        throw new Error("Could not find id");
                    return [4 /*yield*/, Promise.all([
                            (0, production_1.getProcedure)(client, id),
                            (0, shared_1.getTagsList)(client, companyId, "procedure")
                        ])];
                case 2:
                    _d = _h.sent(), procedure = _d[0], tags = _d[1];
                    if (!procedure.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.procedures];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(procedure.error, "Failed to load procedure"))];
                case 3: throw _e.apply(void 0, _f.concat([_h.sent()]));
                case 4: return [2 /*return*/, {
                        procedure: procedure.data,
                        tags: (_g = tags.data) !== null && _g !== void 0 ? _g : [],
                        versions: (0, production_1.getProcedureVersions)(client, procedure.data, companyId)
                    }];
            }
        });
    });
}
function ProcedureRoute() {
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var procedure = (0, react_router_1.useLoaderData)().procedure;
    return (<Layout_1.PanelProvider key={"".concat(id, "-").concat(procedure.version)}>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <ProcedureHeader_1.default />
        <div className="flex flex-1 min-h-0 overflow-hidden w-full">
          <div className="flex flex-1 min-h-0 h-full overflow-hidden">
            <Layout_1.ResizablePanels explorer={<ProcedureExplorer_1.default key={"explorer-".concat(id, "-").concat(procedure.version)}/>} content={<div className="bg-background h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                  <ProcedureEditor />
                  <react_router_1.Outlet />
                </div>} properties={<ProcedureProperties_1.default key={"properties-".concat(id, "-").concat(procedure.version)}/>}/>
          </div>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
function ProcedureEditor() {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("Could not find id");
    var permissions = (0, hooks_1.usePermissions)();
    var loaderData = (0, react_router_1.useLoaderData)();
    var _h = (0, react_2.useState)((_b = (_a = loaderData === null || loaderData === void 0 ? void 0 : loaderData.procedure) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : ""), procedureName = _h[0], setProcedureName = _h[1];
    var _j = (0, react_2.useState)(((_d = (_c = loaderData === null || loaderData === void 0 ? void 0 : loaderData.procedure) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : {})), content = _j[0], setContent = _j[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var _k = (0, hooks_1.useUser)(), userId = _k.id, companyId = _k.company.id;
    var updateProcedure = (0, react_1.useDebounce)(function (content) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.from("procedure").update({
                        content: content !== null && content !== void 0 ? content : {},
                        updatedAt: (0, date_1.today)((0, date_1.getLocalTimeZone)()).toString(),
                        updatedBy: userId
                    }).eq("id", id))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 500, true);
    var fetcher = (0, react_router_1.useFetcher)();
    var updateProcedureName = function (name) { return __awaiter(_this, void 0, void 0, function () {
        var formData, versions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formData = new FormData();
                    return [4 /*yield*/, Promise.resolve(loaderData === null || loaderData === void 0 ? void 0 : loaderData.versions)];
                case 1:
                    versions = _a.sent();
                    formData.append("ids", id);
                    if (Array.isArray(versions === null || versions === void 0 ? void 0 : versions.data) && versions.data.length > 0) {
                        versions.data.forEach(function (version) {
                            formData.append("ids", version.id);
                        });
                    }
                    formData.append("field", "name");
                    formData.append("value", name);
                    fetcher.submit(formData, {
                        method: "post",
                        action: path_1.path.to.bulkUpdateProcedure
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    var onUploadImage = function (file) { return __awaiter(_this, void 0, void 0, function () {
        var fileType, fileName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = file.name.split(".").pop();
                    fileName = "".concat(companyId, "/job/notes/").concat((0, nanoid_1.nanoid)(), ".").concat(fileType);
                    return [4 /*yield*/, (carbon === null || carbon === void 0 ? void 0 : carbon.storage.from("private").upload(fileName, file))];
                case 1:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.error) {
                        react_1.toast.error("Failed to upload image");
                        throw new Error(result.error.message);
                    }
                    if (!(result === null || result === void 0 ? void 0 : result.data)) {
                        throw new Error("Failed to upload image");
                    }
                    return [2 /*return*/, (0, path_1.getPrivateUrl)(result.data.path)];
            }
        });
    }); };
    return (<div className="flex flex-col gap-6 w-full h-full p-6">
      <react_1.Input className="md:text-3xl text-2xl font-semibold leading-none tracking-tight text-foreground" value={procedureName} borderless onChange={((_e = loaderData === null || loaderData === void 0 ? void 0 : loaderData.procedure) === null || _e === void 0 ? void 0 : _e.status) === "Draft"
            ? function (e) { return setProcedureName(e.target.value); }
            : undefined} onBlur={((_f = loaderData === null || loaderData === void 0 ? void 0 : loaderData.procedure) === null || _f === void 0 ? void 0 : _f.status) === "Draft"
            ? function (e) { return updateProcedureName(e.target.value); }
            : undefined}/>

      {permissions.can("update", "production") &&
            ((_g = loaderData === null || loaderData === void 0 ? void 0 : loaderData.procedure) === null || _g === void 0 ? void 0 : _g.status) === "Draft" ? (<Editor_1.Editor initialValue={content} onUpload={onUploadImage} onChange={function (value) {
                setContent(value);
                updateProcedure(value);
            }}/>) : (<div className="prose dark:prose-invert" dangerouslySetInnerHTML={{
                __html: (0, react_1.generateHTML)(content)
            }}/>)}
    </div>);
}
var templateObject_1;
