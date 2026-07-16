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
exports.default = ToolDetailsRoute;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var ItemManufacturingForm_1 = require("~/modules/items/ui/Item/ItemManufacturingForm");
var shared_1 = require("~/modules/shared");
var form_2 = require("~/utils/form");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, url, requestedMethodId, makeMethods, makeMethod, fullMethod, _d, methodMaterials, methodOperations, tags, toolManufacturing;
        var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        bypassRls: true
                    })];
                case 1:
                    _c = _t.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    url = new URL(request.url);
                    requestedMethodId = url.searchParams.get("methodId");
                    return [4 /*yield*/, (0, items_1.getMakeMethods)(client, itemId, companyId)];
                case 2:
                    makeMethods = _t.sent();
                    makeMethod = requestedMethodId
                        ? ((_h = (_f = (_e = makeMethods.data) === null || _e === void 0 ? void 0 : _e.find(function (m) { return m.id === requestedMethodId; })) !== null && _f !== void 0 ? _f : (_g = makeMethods.data) === null || _g === void 0 ? void 0 : _g.find(function (m) { return m.status === "Active"; })) !== null && _h !== void 0 ? _h : (_j = makeMethods.data) === null || _j === void 0 ? void 0 : _j[0])
                        : ((_l = (_k = makeMethods.data) === null || _k === void 0 ? void 0 : _k.find(function (m) { return m.status === "Active"; })) !== null && _l !== void 0 ? _l : (_m = makeMethods.data) === null || _m === void 0 ? void 0 : _m[0]);
                    if (!makeMethod) {
                        return [2 /*return*/, { methodData: null, tags: [] }];
                    }
                    return [4 /*yield*/, (0, items_1.getMakeMethodById)(client, makeMethod.id, companyId)];
                case 3:
                    fullMethod = _t.sent();
                    if (fullMethod.error || !fullMethod.data) {
                        return [2 /*return*/, { methodData: null, tags: [] }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getMethodMaterialsByMakeMethod)(client, fullMethod.data.id),
                            (0, items_1.getMethodOperationsByMakeMethodId)(client, fullMethod.data.id),
                            (0, shared_1.getTagsList)(client, companyId, "operation"),
                            (0, items_1.getItemManufacturing)(client, itemId, companyId)
                        ])];
                case 4:
                    _d = _t.sent(), methodMaterials = _d[0], methodOperations = _d[1], tags = _d[2], toolManufacturing = _d[3];
                    return [2 /*return*/, {
                            methodData: {
                                makeMethod: fullMethod.data,
                                methodMaterials: (_p = (_o = methodMaterials.data) === null || _o === void 0 ? void 0 : _o.map(function (m) {
                                    var _a, _b;
                                    return (__assign(__assign({}, m), { description: (_b = (_a = m.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", methodType: m.methodType, itemType: m.itemType }));
                                })) !== null && _p !== void 0 ? _p : [],
                                methodOperations: (_r = (_q = methodOperations.data) === null || _q === void 0 ? void 0 : _q.map(function (operation) {
                                    var _a, _b;
                                    return (__assign(__assign({}, operation), { workCenterId: (_a = operation.workCenterId) !== null && _a !== void 0 ? _a : undefined, operationSupplierProcessId: (_b = operation.operationSupplierProcessId) !== null && _b !== void 0 ? _b : undefined, workInstruction: operation.workInstruction }));
                                })) !== null && _r !== void 0 ? _r : [],
                                toolManufacturing: toolManufacturing.data
                            },
                            tags: (_s = tags.data) !== null && _s !== void 0 ? _s : []
                        }];
            }
        });
    });
}
function action(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, userId, itemId, formData, intent, validation_1, updateToolManufacturing, _d, _e, _f, _g, validation, updateTool, _h, _j, _k, _l;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    (0, auth_1.assertIsPost)(request);
                    return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                            update: "parts"
                        })];
                case 1:
                    _c = _m.sent(), client = _c.client, userId = _c.userId;
                    itemId = params.itemId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    return [4 /*yield*/, request.formData()];
                case 2:
                    formData = _m.sent();
                    intent = formData.get("intent");
                    if (!(intent === "manufacturing")) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, form_1.validator)(items_1.itemManufacturingValidator).validate(formData)];
                case 3:
                    validation_1 = _m.sent();
                    if (validation_1.error) {
                        console.error(validation_1.error);
                        return [2 /*return*/, (0, form_1.validationError)(validation_1.error)];
                    }
                    return [4 /*yield*/, (0, items_1.upsertItemManufacturing)(client, __assign(__assign({}, validation_1.data), { itemId: itemId, updatedBy: userId, customFields: (0, form_2.setCustomFields)(formData) }))];
                case 4:
                    updateToolManufacturing = _m.sent();
                    if (!updateToolManufacturing.error) return [3 /*break*/, 6];
                    _d = react_router_1.redirect;
                    _e = [path_1.path.to.tool(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateToolManufacturing.error, "Failed to update tool manufacturing"))];
                case 5: throw _d.apply(void 0, _e.concat([_m.sent()]));
                case 6:
                    _f = react_router_1.redirect;
                    _g = [path_1.path.to.toolDetails(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated tool manufacturing"))];
                case 7: throw _f.apply(void 0, _g.concat([_m.sent()]));
                case 8: return [4 /*yield*/, (0, form_1.validator)(items_1.toolValidator).validate(formData)];
                case 9:
                    validation = _m.sent();
                    if (validation.error) {
                        return [2 /*return*/, (0, form_1.validationError)(validation.error)];
                    }
                    return [4 /*yield*/, (0, items_1.upsertTool)(client, __assign(__assign({}, validation.data), { id: itemId, customFields: (0, form_2.setCustomFields)(formData), updatedBy: userId }))];
                case 10:
                    updateTool = _m.sent();
                    if (!updateTool.error) return [3 /*break*/, 12];
                    _h = react_router_1.redirect;
                    _j = [path_1.path.to.tool(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(updateTool.error, "Failed to update tool"))];
                case 11: throw _h.apply(void 0, _j.concat([_m.sent()]));
                case 12:
                    _k = react_router_1.redirect;
                    _l = [path_1.path.to.tool(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.success)("Updated tool"))];
                case 13: throw _k.apply(void 0, _l.concat([_m.sent()]));
            }
        });
    });
}
function ToolDetailsRoute() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var t = (0, macro_1.useLingui)().t;
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId)
        throw new Error("Could not find itemId");
    var permissions = (0, hooks_1.usePermissions)();
    var _r = (0, react_router_1.useLoaderData)(), methodData = _r.methodData, tags = _r.tags;
    var toolData = (0, hooks_1.useRouteData)(path_1.path.to.tool(itemId));
    if (!toolData)
        throw new Error("Could not find tool data");
    var manufacturingInitialValues = (methodData === null || methodData === void 0 ? void 0 : methodData.toolManufacturing)
        ? __assign(__assign(__assign({}, methodData.toolManufacturing), { lotSize: (_a = methodData.toolManufacturing.lotSize) !== null && _a !== void 0 ? _a : 0 }), (0, form_2.getCustomFields)(methodData.toolManufacturing.customFields)) : null;
    return (<react_1.VStack spacing={2} className="p-2">
      {permissions.is("employee") && methodData && (<>
          <react_2.Suspense fallback={<react_1.Menubar />}>
            <react_router_1.Await resolve={toolData === null || toolData === void 0 ? void 0 : toolData.makeMethods}>
              {function (makeMethods) {
                var _a;
                return (<Item_1.MakeMethodTools itemId={methodData.makeMethod.itemId} makeMethods={(_a = makeMethods === null || makeMethods === void 0 ? void 0 : makeMethods.data) !== null && _a !== void 0 ? _a : []} type="Tool" currentMethodId={methodData.makeMethod.id}/>);
            }}
            </react_router_1.Await>
          </react_2.Suspense>

          {manufacturingInitialValues && (<ItemManufacturingForm_1.default key={itemId} 
            // @ts-ignore
            initialValues={manufacturingInitialValues} withConfiguration={false}/>)}
          <Item_1.ItemNotes id={(_c = (_b = toolData.toolSummary) === null || _b === void 0 ? void 0 : _b.id) !== null && _c !== void 0 ? _c : null} title={(_e = (_d = toolData.toolSummary) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : ""} subTitle={(_g = (_f = toolData.toolSummary) === null || _f === void 0 ? void 0 : _f.readableIdWithRevision) !== null && _g !== void 0 ? _g : ""} notes={(_h = toolData.toolSummary) === null || _h === void 0 ? void 0 : _h.notes}/>
          {["Make", "Buy and Make"].includes((_k = (_j = toolData.toolSummary) === null || _j === void 0 ? void 0 : _j.replenishmentSystem) !== null && _k !== void 0 ? _k : "") && (<>
              <Item_1.BillOfMaterial key={"bom:".concat(itemId)} methodBindings={(0, items_1.methodBindings)(itemId)} configurationRuleBindings={(0, items_1.partConfigurationRuleBindings)(itemId)} makeMethod={methodData.makeMethod} 
            // @ts-ignore
            materials={(_l = methodData.methodMaterials) !== null && _l !== void 0 ? _l : []} 
            // @ts-ignore
            operations={methodData.methodOperations} replenishmentSystem={(_m = toolData.toolSummary) === null || _m === void 0 ? void 0 : _m.replenishmentSystem}/>
              <Item_1.BillOfProcess key={"bop:".concat(itemId)} methodBindings={(0, items_1.methodBindings)(itemId)} configurationRuleBindings={(0, items_1.partConfigurationRuleBindings)(itemId)} makeMethod={methodData.makeMethod} 
            // @ts-ignore
            operations={(_o = methodData.methodOperations) !== null && _o !== void 0 ? _o : []} tags={tags}/>
            </>)}
        </>)}
      {permissions.is("employee") && (<>
          <components_1.DeferredFiles resolve={toolData === null || toolData === void 0 ? void 0 : toolData.files}>
            {function (resolvedFiles) {
                var _a;
                return (<Item_1.ItemDocuments files={resolvedFiles} itemId={itemId} modelUpload={(_a = toolData.toolSummary) !== null && _a !== void 0 ? _a : undefined} type="Tool"/>);
            }}
          </components_1.DeferredFiles>

          <components_1.CadModel isReadOnly={!permissions.can("update", "parts")} metadata={{ itemId: itemId }} modelPath={(_q = (_p = toolData === null || toolData === void 0 ? void 0 : toolData.toolSummary) === null || _p === void 0 ? void 0 : _p.modelPath) !== null && _q !== void 0 ? _q : null} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))}/>

          <Item_1.ItemRiskRegister itemId={itemId}/>
        </>)}
    </react_1.VStack>);
}
var templateObject_1;
