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
exports.default = PartMakeMethodPage;
var auth_1 = require("@carbon/auth");
var auth_server_1 = require("@carbon/auth/auth.server");
var session_server_1 = require("@carbon/auth/session.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var hooks_1 = require("~/hooks");
var usePermissions_1 = require("~/hooks/usePermissions");
var items_1 = require("~/modules/items");
var Item_1 = require("~/modules/items/ui/Item");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, itemId, makeMethodId, _d, makeMethod, methodMaterials, methodOperations, tags, partManufacturing, _e, _f, _g, _h, _j, _k, configData, _l;
        var _m;
        var _o, _p, _q, _r, _s, _t;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_u) {
            switch (_u.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts"
                    })];
                case 1:
                    _c = _u.sent(), client = _c.client, companyId = _c.companyId;
                    itemId = params.itemId, makeMethodId = params.makeMethodId;
                    if (!itemId)
                        throw new Error("Could not find itemId");
                    if (!makeMethodId)
                        throw new Error("Could not find makeMethodId");
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getMakeMethodById)(client, makeMethodId, companyId),
                            (0, items_1.getMethodMaterialsByMakeMethod)(client, makeMethodId),
                            (0, items_1.getMethodOperationsByMakeMethodId)(client, makeMethodId),
                            (0, shared_1.getTagsList)(client, companyId, "operation"),
                            (0, items_1.getItemManufacturing)(client, itemId, companyId)
                        ])];
                case 2:
                    _d = _u.sent(), makeMethod = _d[0], methodMaterials = _d[1], methodOperations = _d[2], tags = _d[3], partManufacturing = _d[4];
                    if (!makeMethod.error) return [3 /*break*/, 4];
                    _e = react_router_1.redirect;
                    _f = [path_1.path.to.partDetails(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(makeMethod.error, "Failed to load make method"))];
                case 3: throw _e.apply(void 0, _f.concat([_u.sent()]));
                case 4:
                    if (!methodOperations.error) return [3 /*break*/, 6];
                    _g = react_router_1.redirect;
                    _h = [path_1.path.to.partDetails(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(methodOperations.error, "Failed to load method operations"))];
                case 5: throw _g.apply(void 0, _h.concat([_u.sent()]));
                case 6:
                    if (!methodMaterials.error) return [3 /*break*/, 8];
                    _j = react_router_1.redirect;
                    _k = [path_1.path.to.partDetails(itemId)];
                    return [4 /*yield*/, (0, session_server_1.flash)(request, (0, auth_1.error)(methodMaterials.error, "Failed to load method materials"))];
                case 7: throw _j.apply(void 0, _k.concat([_u.sent()]));
                case 8:
                    if (!((_o = partManufacturing.data) === null || _o === void 0 ? void 0 : _o.requiresConfiguration)) return [3 /*break*/, 11];
                    _m = {};
                    return [4 /*yield*/, (0, items_1.getConfigurationParameters)(client, itemId, companyId)];
                case 9:
                    _m.configurationParametersAndGroups = _u.sent();
                    return [4 /*yield*/, (0, items_1.getConfigurationRules)(client, itemId, companyId)];
                case 10:
                    _l = (_m.configurationRules = _u.sent(),
                        _m);
                    return [3 /*break*/, 12];
                case 11:
                    _l = {
                        configurationParametersAndGroups: { groups: [], parameters: [] },
                        configurationRules: []
                    };
                    _u.label = 12;
                case 12:
                    configData = _l;
                    return [2 /*return*/, __assign(__assign({ makeMethod: makeMethod.data, methodMaterials: (_q = (_p = methodMaterials.data) === null || _p === void 0 ? void 0 : _p.map(function (m) {
                                var _a, _b, _c;
                                return (__assign(__assign({}, m), { description: (_b = (_a = m.item) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : "", methodOperationId: (_c = m.methodOperationId) !== null && _c !== void 0 ? _c : undefined, methodType: m.methodType, itemType: m.itemType }));
                            })) !== null && _q !== void 0 ? _q : [], methodOperations: (_s = (_r = methodOperations.data) === null || _r === void 0 ? void 0 : _r.map(function (operation) {
                                var _a, _b, _c, _d, _e, _f, _g, _h;
                                return (__assign(__assign({}, operation), { description: (_a = operation.description) !== null && _a !== void 0 ? _a : "", procedureId: (_b = operation.procedureId) !== null && _b !== void 0 ? _b : undefined, operationSupplierProcessId: (_c = operation.operationSupplierProcessId) !== null && _c !== void 0 ? _c : undefined, operationMinimumCost: (_d = operation.operationMinimumCost) !== null && _d !== void 0 ? _d : 0, operationLeadTime: (_e = operation.operationLeadTime) !== null && _e !== void 0 ? _e : 0, operationUnitCost: (_f = operation.operationUnitCost) !== null && _f !== void 0 ? _f : 0, tags: (_g = operation.tags) !== null && _g !== void 0 ? _g : [], workCenterId: (_h = operation.workCenterId) !== null && _h !== void 0 ? _h : undefined, workInstruction: operation.workInstruction }));
                            })) !== null && _s !== void 0 ? _s : [], partManufacturing: partManufacturing.data }, configData), { model: (0, shared_1.getModelByItemId)(client, makeMethod.data.itemId), makeMethods: (0, items_1.getMakeMethods)(client, makeMethod.data.itemId, companyId), tags: (_t = tags.data) !== null && _t !== void 0 ? _t : [] })];
            }
        });
    });
}
function PartMakeMethodPage() {
    var _a;
    var t = (0, macro_1.useLingui)().t;
    var loaderData = (0, react_router_1.useLoaderData)();
    var permissions = (0, usePermissions_1.usePermissions)();
    var makeMethod = loaderData.makeMethod, makeMethods = loaderData.makeMethods, methodMaterials = loaderData.methodMaterials, methodOperations = loaderData.methodOperations, partManufacturing = loaderData.partManufacturing, configurationParametersAndGroups = loaderData.configurationParametersAndGroups, configurationRules = loaderData.configurationRules, tags = loaderData.tags;
    var _b = (0, react_router_1.useParams)(), itemId = _b.itemId, makeMethodId = _b.makeMethodId;
    if (!itemId)
        throw new Error("Could not find itemId");
    if (!makeMethodId)
        throw new Error("Could not find makeMethodId");
    var partData = (0, hooks_1.useRouteData)(path_1.path.to.part(itemId));
    return (<react_1.VStack spacing={2} className="p-2">
      <react_2.Suspense fallback={<react_1.Menubar />}>
        <react_router_1.Await resolve={makeMethods}>
          {function (makeMethods) {
            var _a;
            return (<Item_1.MakeMethodTools itemId={makeMethod.itemId} makeMethods={(_a = makeMethods.data) !== null && _a !== void 0 ? _a : []} type="Part" currentMethodId={makeMethod.id}/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>

      <Item_1.BillOfMaterial key={"bom:".concat(makeMethodId)} methodBindings={(0, items_1.methodBindings)(itemId)} configurationRuleBindings={(0, items_1.partConfigurationRuleBindings)(itemId)} makeMethod={makeMethod} 
    // @ts-expect-error TS2322 - TODO: fix type
    materials={methodMaterials} operations={methodOperations} configurable={partManufacturing === null || partManufacturing === void 0 ? void 0 : partManufacturing.requiresConfiguration} configurationRules={configurationRules} parameters={configurationParametersAndGroups.parameters} replenishmentSystem={(_a = partData === null || partData === void 0 ? void 0 : partData.partSummary) === null || _a === void 0 ? void 0 : _a.replenishmentSystem}/>
      <Item_1.BillOfProcess key={"bop:".concat(makeMethodId)} methodBindings={(0, items_1.methodBindings)(itemId)} configurationRuleBindings={(0, items_1.partConfigurationRuleBindings)(itemId)} makeMethod={makeMethod} materials={methodMaterials} 
    // @ts-expect-error
    operations={methodOperations} configurable={partManufacturing === null || partManufacturing === void 0 ? void 0 : partManufacturing.requiresConfiguration} configurationRules={configurationRules} parameters={configurationParametersAndGroups.parameters} tags={tags}/>
      <react_2.Suspense fallback={null}>
        <react_router_1.Await resolve={loaderData.model}>
          {function (model) {
            var _a, _b;
            return (<components_1.CadModel key={"cad:".concat(model.itemId)} isReadOnly={!permissions.can("update", "parts")} metadata={{
                    itemId: (_a = model === null || model === void 0 ? void 0 : model.itemId) !== null && _a !== void 0 ? _a : undefined
                }} modelPath={(_b = model === null || model === void 0 ? void 0 : model.modelPath) !== null && _b !== void 0 ? _b : null} title={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["CAD Model"], ["CAD Model"])))} uploadClassName="aspect-square min-h-[420px] max-h-[70vh]" viewerClassName="aspect-square min-h-[420px] max-h-[70vh]"/>);
        }}
        </react_router_1.Await>
      </react_2.Suspense>
    </react_1.VStack>);
}
var templateObject_1;
