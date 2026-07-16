"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.action = action;
exports.default = SharedSectionsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var template_1 = require("@carbon/documents/template");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var SectionFormModal_1 = require("~/components/DocumentTemplateEditor/SectionFormModal");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var PLACEMENT_LABELS = {
    body: "Body section",
    header: "Page header",
    footer: "Page footer"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, sections;
        var _d;
        var request = _b.request;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "settings",
                        role: "employee"
                    })];
                case 1:
                    _c = _e.sent(), client = _c.client, companyId = _c.companyId;
                    return [4 /*yield*/, (0, settings_1.getDocumentSections)(client, companyId)];
                case 2:
                    sections = _e.sent();
                    return [2 /*return*/, {
                            sections: (0, template_1.withBuiltInSections)(((_d = sections.data) !== null && _d !== void 0 ? _d : []))
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, userId, formData, id_1, result_1, _d, _e, _f, _g, validation, _h, id, name, placement, content, config, result, _j, _k, _l, _m;
        var _o;
        var request = _b.request;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "settings"
                        })];
                case 1:
                    _c = _p.sent(), client = _c.client, companyId = _c.companyId, userId = _c.userId;
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _p.sent();
                    if (!(formData.get("intent") === "delete")) return [3 /*break*/, 7];
                    id_1 = String((_o = formData.get("id")) !== null && _o !== void 0 ? _o : "");
                    return [4 /*yield*/, (0, settings_1.deleteDocumentSection)(client, id_1, companyId)];
                case 3:
                    result_1 = _p.sent();
                    if (!result_1.error) return [3 /*break*/, 5];
                    _d = react_router_1.data;
                    _e = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result_1.error, "Failed to delete section"))];
                case 4: return [2 /*return*/, _d.apply(void 0, _e.concat([_p.sent()]))];
                case 5:
                    _f = react_router_1.data;
                    _g = [{ success: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Section deleted"))];
                case 6: return [2 /*return*/, _f.apply(void 0, _g.concat([_p.sent()]))];
                case 7: return [4 /*yield*/, (0, form_1.validator)(settings_1.documentSectionValidator).validate(formData)];
                case 8:
                    validation = _p.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    _h = validation.data, id = _h.id, name = _h.name, placement = _h.placement, content = _h.content, config = _h.config;
                    return [4 /*yield*/, (0, settings_1.upsertDocumentSection)(client, __assign({ id: id, companyId: companyId, name: name, placement: placement, content: content, config: config }, (id ? { updatedBy: userId } : { createdBy: userId })))];
                case 9:
                    result = _p.sent();
                    if (!result.error) return [3 /*break*/, 11];
                    _j = react_router_1.data;
                    _k = [{ success: false }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(result.error, "Failed to save section"))];
                case 10: return [2 /*return*/, _j.apply(void 0, _k.concat([_p.sent()]))];
                case 11:
                    _l = react_router_1.data;
                    _m = [{ success: true }];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Section saved"))];
                case 12: return [2 /*return*/, _l.apply(void 0, _m.concat([_p.sent()]))];
            }
        });
    });
}
function SharedSectionsRoute() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var sections = (0, react_router_1.useLoaderData)().sections;
    var permissions = (0, hooks_1.usePermissions)();
    var canEdit = permissions.can("update", "settings");
    var _b = (0, react_2.useState)(null), editing = _b[0], setEditing = _b[1];
    var disclosure = (0, react_1.useDisclosure)();
    var deleteFetcher = (0, react_router_1.useFetcher)();
    var openNew = function () {
        setEditing(null);
        disclosure.onOpen();
    };
    var openEdit = function (section) {
        setEditing(section);
        disclosure.onOpen();
    };
    return (<react_1.ScrollArea className="h-full w-full">
      <react_1.VStack spacing={4} className="mx-auto h-full max-w-[60rem] gap-6 px-4 py-12">
        <div className="flex w-full items-start justify-between">
          <div className="flex items-center gap-3">
            <react_router_1.Link to={path_1.path.to.documentTemplates} aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Back to templates"], ["Back to templates"])))} className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <lu_1.LuArrowLeft className="size-4"/>
            </react_router_1.Link>
            <div className="flex flex-col gap-1">
              <react_1.Heading size="h3">Shared Sections</react_1.Heading>
              <p className="text-sm text-muted-foreground">
                Reusable rich-text blocks referenced across your documents. Edit
                once — every document updates.
              </p>
            </div>
          </div>
          {canEdit && (<react_1.Button leftIcon={<lu_1.LuPlus />} onClick={openNew}>
              New section
            </react_1.Button>)}
        </div>

        <div className="flex w-full flex-col gap-2">
          {sections.length === 0 && (<div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              No shared sections yet.
            </div>)}
          {sections.map(function (section) { return (<div key={section.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">{section.name}</span>
              </div>
              {section.builtIn && <react_1.Badge>System</react_1.Badge>}
              <react_1.Badge variant="secondary">
                {PLACEMENT_LABELS[section.placement]}
              </react_1.Badge>
              {canEdit && (<>
                  <react_1.IconButton size="sm" variant="ghost" aria-label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Edit section"], ["Edit section"])))} icon={<lu_1.LuPencil />} onClick={function () { return openEdit(section); }}/>
                  {!section.builtIn && (<deleteFetcher.Form method="post">
                      <input type="hidden" name="intent" value="delete"/>
                      <input type="hidden" name="id" value={section.id}/>
                      <react_1.IconButton size="sm" variant="ghost" type="submit" aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Delete section"], ["Delete section"])))} icon={<lu_1.LuTrash2 />}/>
                    </deleteFetcher.Form>)}
                </>)}
            </div>); })}
        </div>
      </react_1.VStack>

      {disclosure.isOpen && (<SectionFormModal_1.SectionFormModal key={(_a = editing === null || editing === void 0 ? void 0 : editing.id) !== null && _a !== void 0 ? _a : "new"} section={editing} onClose={disclosure.onClose}/>)}
    </react_1.ScrollArea>);
}
var templateObject_1, templateObject_2, templateObject_3;
