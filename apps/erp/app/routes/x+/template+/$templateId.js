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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
exports.loader = loader;
exports.default = TemplateLayoutRoute;
var auth_server_1 = require("@carbon/auth/auth.server");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/core/macro");
var macro_2 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Layout_1 = require("~/components/Layout");
var items_1 = require("~/modules/items");
var template_service_1 = require("~/modules/items/template.service");
var Item_1 = require("~/modules/items/ui/Item");
var Templates_1 = require("~/modules/items/ui/Templates");
var TemplateProperties_1 = require("~/modules/items/ui/Templates/TemplateProperties");
var path_1 = require("~/utils/path");
exports.handle = {
    breadcrumb: (0, macro_1.msg)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Templates"], ["Templates"]))),
    to: path_1.path.to.templates,
    module: "items"
};
function loader(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var _c, client, companyId, templateId, _d, template, makeMethods, requestedMethodId, selectedMethod, explorerNodes, materials, itemIds, items, _e, itemById_1, rootId_1, rootData, childNodes;
        var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        var request = _b.request, params = _b.params;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, (0, auth_server_1.requirePermissions)(request, {
                        view: "parts",
                        bypassRls: true
                    })];
                case 1:
                    _c = _r.sent(), client = _c.client, companyId = _c.companyId;
                    templateId = params.templateId;
                    if (!templateId)
                        throw new Error("Could not find templateId");
                    return [4 /*yield*/, Promise.all([
                            (0, items_1.getTemplate)(client, templateId, companyId),
                            (0, template_service_1.getTemplateMakeMethods)(client, templateId, companyId)
                        ])];
                case 2:
                    _d = _r.sent(), template = _d[0], makeMethods = _d[1];
                    if (template.error || !template.data) {
                        throw new Response("Not found", { status: 404 });
                    }
                    requestedMethodId = new URL(request.url).searchParams.get("methodId");
                    selectedMethod = (_j = (_g = (_f = makeMethods.data) === null || _f === void 0 ? void 0 : _f.find(function (m) { return m.id === requestedMethodId; })) !== null && _g !== void 0 ? _g : (_h = makeMethods.data) === null || _h === void 0 ? void 0 : _h.find(function (m) { return m.status === "Draft"; })) !== null && _j !== void 0 ? _j : (_k = makeMethods.data) === null || _k === void 0 ? void 0 : _k[0];
                    explorerNodes = [];
                    if (!(selectedMethod === null || selectedMethod === void 0 ? void 0 : selectedMethod.id)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, template_service_1.getTemplateMethodMaterialsByMakeMethod)(client, selectedMethod.id)];
                case 3:
                    materials = _r.sent();
                    itemIds = ((_l = materials.data) !== null && _l !== void 0 ? _l : []).map(function (m) { return m.itemId; });
                    if (!(itemIds.length > 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, client
                            .from("item")
                            .select("id, name, readableIdWithRevision")
                            .in("id", itemIds)];
                case 4:
                    _e = _r.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _e = {
                        data: []
                    };
                    _r.label = 6;
                case 6:
                    items = _e;
                    itemById_1 = new Map(((_m = items.data) !== null && _m !== void 0 ? _m : []).map(function (item) { return [
                        item.id,
                        {
                            name: item.name,
                            readableIdWithRevision: item.readableIdWithRevision
                        }
                    ]; }));
                    rootId_1 = "template-root-".concat(template.data.id);
                    rootData = {
                        methodMaterialId: selectedMethod.id,
                        makeMethodId: selectedMethod.id,
                        materialMakeMethodId: selectedMethod.id,
                        itemId: template.data.id,
                        itemReadableId: template.data.id,
                        itemType: "Part",
                        description: template.data.name,
                        unitOfMeasureCode: "",
                        unitCost: 0,
                        quantity: 1,
                        methodType: "Make to Order",
                        itemTrackingType: "Inventory",
                        parentMaterialId: null,
                        order: 1,
                        operationId: null,
                        isRoot: true,
                        kit: false,
                        revision: "",
                        externalId: {},
                        version: selectedMethod.version,
                        replenishmentSystem: "Make"
                    };
                    childNodes = ((_o = materials.data) !== null && _o !== void 0 ? _o : []).map(function (material, index) {
                        var _a, _b, _c, _d, _e, _f, _g;
                        var item = itemById_1.get(material.itemId);
                        var methodType = material.methodType;
                        var replenishmentSystem = methodType === "Purchase to Order"
                            ? "Buy"
                            : methodType === "Make to Order"
                                ? "Make"
                                : "Buy and Make";
                        return {
                            id: material.id,
                            parentId: rootId_1,
                            children: [],
                            hasChildren: false,
                            level: 1,
                            data: {
                                methodMaterialId: material.id,
                                makeMethodId: selectedMethod.id,
                                materialMakeMethodId: (_a = material.materialMakeMethodId) !== null && _a !== void 0 ? _a : selectedMethod.id,
                                itemId: material.itemId,
                                itemReadableId: (_b = item === null || item === void 0 ? void 0 : item.readableIdWithRevision) !== null && _b !== void 0 ? _b : material.itemId,
                                itemType: "Part",
                                description: (_c = item === null || item === void 0 ? void 0 : item.name) !== null && _c !== void 0 ? _c : "",
                                unitOfMeasureCode: material.unitOfMeasureCode,
                                unitCost: 0,
                                quantity: Number((_d = material.quantity) !== null && _d !== void 0 ? _d : 0),
                                methodType: methodType,
                                itemTrackingType: "Inventory",
                                parentMaterialId: selectedMethod.id,
                                order: (_e = material.order) !== null && _e !== void 0 ? _e : index + 1,
                                operationId: (_f = material.methodOperationId) !== null && _f !== void 0 ? _f : null,
                                isRoot: false,
                                kit: (_g = material.kit) !== null && _g !== void 0 ? _g : false,
                                revision: "",
                                externalId: {},
                                version: selectedMethod.version,
                                replenishmentSystem: replenishmentSystem
                            }
                        };
                    });
                    explorerNodes = __spreadArray([
                        {
                            id: rootId_1,
                            parentId: undefined,
                            children: childNodes.map(function (node) { return node.id; }),
                            hasChildren: childNodes.length > 0,
                            level: 0,
                            data: rootData
                        }
                    ], childNodes, true);
                    _r.label = 7;
                case 7: return [2 /*return*/, {
                        template: template.data,
                        selectedMakeMethodId: (_p = selectedMethod === null || selectedMethod === void 0 ? void 0 : selectedMethod.id) !== null && _p !== void 0 ? _p : null,
                        selectedMakeMethod: (_q = selectedMethod) !== null && _q !== void 0 ? _q : null,
                        explorerNodes: explorerNodes
                    }];
            }
        });
    });
}
function TemplateLayoutRoute() {
    var _a, _b, _c, _d;
    var t = (0, macro_2.useLingui)().t;
    var _e = (0, react_router_1.useLoaderData)(), template = _e.template, selectedMakeMethodId = _e.selectedMakeMethodId, selectedMakeMethod = _e.selectedMakeMethod, explorerNodes = _e.explorerNodes;
    var _f = (0, react_2.useState)(""), filterText = _f[0], setFilterText = _f[1];
    var adaptedMakeMethod = {
        id: (_b = (_a = selectedMakeMethod === null || selectedMakeMethod === void 0 ? void 0 : selectedMakeMethod.id) !== null && _a !== void 0 ? _a : selectedMakeMethodId) !== null && _b !== void 0 ? _b : template.id,
        itemId: template.id,
        version: (_c = selectedMakeMethod === null || selectedMakeMethod === void 0 ? void 0 : selectedMakeMethod.version) !== null && _c !== void 0 ? _c : 1,
        status: (_d = selectedMakeMethod === null || selectedMakeMethod === void 0 ? void 0 : selectedMakeMethod.status) !== null && _d !== void 0 ? _d : "Draft"
    };
    return (<Layout_1.PanelProvider key={template.id}>
      <div className="flex flex-col h-[calc(100dvh-49px)] overflow-hidden w-full">
        <Templates_1.TemplateHeader template={template}/>
        <div className="flex h-[calc(100dvh-99px)] overflow-hidden w-full">
          <Layout_1.ResizablePanels explorer={<div className="flex flex-col h-full">
                <react_1.HStack className="w-full justify-between px-2 pt-2">
                  <h3 className="text-xxs text-foreground/70 uppercase font-light tracking-wide">
                    {t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Manufacturing"], ["Manufacturing"])))}
                  </h3>
                </react_1.HStack>
                <react_1.HStack className="w-full justify-between flex-shrink-0 p-2">
                  <react_1.InputGroup size="sm" className="flex flex-grow">
                    <react_1.InputLeftElement>
                      <lu_1.LuSearch className="h-4 w-4"/>
                    </react_1.InputLeftElement>
                    <react_1.Input placeholder={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Search..."], ["Search..."])))} value={filterText} onChange={function (e) { return setFilterText(e.target.value); }}/>
                  </react_1.InputGroup>
                </react_1.HStack>
                <div className="flex-1 min-h-0 px-2 pb-2">
                  <Item_1.BoMExplorer itemType="Part" itemIdOverride={template.id} makeMethod={adaptedMakeMethod} methodId={adaptedMakeMethod.id} methods={explorerNodes} filterText={filterText} hideSearch disableNavigation disableOnshapeSync hideRootPreview/>
                </div>
              </div>} content={<div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent w-full">
                <div className="p-2">
                  <TemplateProperties_1.default template={template}/>
                </div>
                <react_router_1.Outlet />
              </div>}/>
        </div>
      </div>
    </Layout_1.PanelProvider>);
}
var templateObject_1, templateObject_2, templateObject_3;
