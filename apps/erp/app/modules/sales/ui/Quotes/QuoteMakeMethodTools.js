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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var ConfiguratorForm_1 = require("~/components/Configurator/ConfiguratorForm");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_1 = require("~/modules/items");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var MakeMethodVersionStatus_1 = require("~/modules/items/ui/Item/MakeMethodVersionStatus");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var QuoteLineMethodForm_1 = require("./QuoteLineMethodForm");
var QuoteMakeMethodTools = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var _z = (0, react_router_1.useParams)(), quoteId = _z.quoteId, lineId = _z.lineId, methodId = _z.methodId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var fetcher = (0, react_router_1.useFetcher)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var materialRouteData = (0, hooks_1.useRouteData)(path_1.path.to.quoteLineMakeMethod(quoteId, lineId, methodId));
    var itemId = (_b = (_a = materialRouteData === null || materialRouteData === void 0 ? void 0 : materialRouteData.makeMethod) === null || _a === void 0 ? void 0 : _a.itemId) !== null && _b !== void 0 ? _b : (_c = routeData === null || routeData === void 0 ? void 0 : routeData.lines.find(function (line) { return line.id === lineId; })) === null || _c === void 0 ? void 0 : _c.itemId;
    var itemType = (_e = (_d = materialRouteData === null || materialRouteData === void 0 ? void 0 : materialRouteData.makeMethod) === null || _d === void 0 ? void 0 : _d.itemType) !== null && _e !== void 0 ? _e : (_f = routeData === null || routeData === void 0 ? void 0 : routeData.lines.find(function (line) { return line.id === lineId; })) === null || _f === void 0 ? void 0 : _f.itemType;
    var itemLink = itemType && itemId
        ? (0, ItemForm_1.getLinkToItemDetails)(itemType, itemId)
        : null;
    var line = routeData === null || routeData === void 0 ? void 0 : routeData.lines.find(function (line) { return line.id === lineId; });
    var pathname = (0, react_router_1.useLocation)().pathname;
    var methodTree = Array.isArray(routeData === null || routeData === void 0 ? void 0 : routeData.methods)
        ? routeData === null || routeData === void 0 ? void 0 : routeData.methods.find(function (m) { return m.data.quoteLineId === (line === null || line === void 0 ? void 0 : line.id); })
        : undefined;
    var hasMethods = (methodTree === null || methodTree === void 0 ? void 0 : methodTree.children) && methodTree.children.length > 0;
    var isGetMethodLoading = fetcher.state !== "idle" &&
        fetcher.formAction === path_1.path.to.quoteMethodGet &&
        !((_g = fetcher.formData) === null || _g === void 0 ? void 0 : _g.get("configuration"));
    var isConfigureLoading = fetcher.state !== "idle" &&
        fetcher.formAction === path_1.path.to.quoteMethodGet &&
        !!((_h = fetcher.formData) === null || _h === void 0 ? void 0 : _h.get("configuration"));
    var isSaveMethodLoading = fetcher.state !== "idle" && fetcher.formAction === path_1.path.to.quoteMethodSave;
    (0, react_2.useEffect)(function () {
        var _a;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.error) {
            react_1.toast.error(fetcher.data.error);
        }
    }, [(_j = fetcher.data) === null || _j === void 0 ? void 0 : _j.error]);
    var _0 = (0, react_2.useState)(true), includeInactive = _0[0], setIncludeInactive = _0[1];
    var getMethodModal = (0, react_1.useDisclosure)();
    var saveMethodModal = (0, react_1.useDisclosure)();
    var _1 = (0, react_2.useState)(true), hasMethodParts = _1[0], setHasMethodParts = _1[1];
    var isQuoteLineDetails = lineId && pathname === path_1.path.to.quoteLine(quoteId, lineId);
    var isQuoteLineMethod = isQuoteLineDetails ||
        pathname === path_1.path.to.quoteLineMethod(quoteId, lineId, methodId);
    var isQuoteMakeMethod = methodId &&
        pathname === path_1.path.to.quoteLineMakeMethod(quoteId, lineId, methodId);
    var carbon = (0, auth_1.useCarbon)().carbon;
    var configureSelectModal = (0, react_1.useDisclosure)();
    var configuratorModal = (0, react_1.useDisclosure)();
    // State for configurable items
    var configurableItemIds = (0, Form_1.useConfigurableItems)();
    var _2 = (0, react_2.useState)(null), selectedConfigureItemId = _2[0], setSelectedConfigureItemId = _2[1];
    var _3 = (0, react_2.useState)({ groups: [], parameters: [] }), configurationParameters = _3[0], setConfigurationParameters = _3[1];
    var handleConfigureItemSelect = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!itemId || !carbon)
                        return [2 /*return*/];
                    setSelectedConfigureItemId(itemId);
                    return [4 /*yield*/, (0, items_1.getConfigurationParameters)(carbon, itemId, companyId)];
                case 1:
                    params = _a.sent();
                    setConfigurationParameters(params);
                    configureSelectModal.onClose();
                    configuratorModal.onOpen();
                    return [2 /*return*/];
            }
        });
    }); };
    var saveConfiguration = function (configuration) { return __awaiter(void 0, void 0, void 0, function () {
        var sourceId;
        return __generator(this, function (_a) {
            configuratorModal.onClose();
            sourceId = selectedConfigureItemId;
            setSelectedConfigureItemId(null);
            setConfigurationParameters({ groups: [], parameters: [] });
            fetcher.submit({
                type: "item",
                targetId: "".concat(quoteId, ":").concat(lineId),
                sourceId: sourceId,
                configuration: JSON.stringify(configuration),
                billOfMaterial: "on",
                billOfProcess: "on",
                parameters: "on",
                tools: "on",
                steps: "on",
                workInstructions: "on"
            }, {
                method: "post",
                action: path_1.path.to.quoteMethodGet
            });
            return [2 /*return*/];
        });
    }); };
    var companyId = (0, hooks_1.useUser)().company.id;
    var _4 = (0, react_2.useState)([]), makeMethods = _4[0], setMakeMethods = _4[1];
    var _5 = (0, react_2.useState)(null), selectedMakeMethod = _5[0], setSelectedMakeMethod = _5[1];
    var getMakeMethods = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, data, error, availableVersions;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    setMakeMethods([]);
                    setSelectedMakeMethod(null);
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("makeMethod")
                            .select("id, version, status")
                            .eq("itemId", itemId)
                            .eq("companyId", companyId)
                            .order("version", { ascending: false })];
                case 1:
                    _a = _c.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        react_1.toast.error(error.message);
                    }
                    availableVersions = (_b = data === null || data === void 0 ? void 0 : data.filter(function (_a) {
                        var status = _a.status;
                        return status === "Draft";
                    })) !== null && _b !== void 0 ? _b : [];
                    setMakeMethods(availableVersions.map(function (_a) {
                        var id = _a.id, version = _a.version, status = _a.status;
                        return ({
                            label: (<div className="flex items-center gap-2">
            <react_1.Badge variant="outline">V{version}</react_1.Badge>{" "}
            <MakeMethodVersionStatus_1.default status={status}/>
          </div>),
                            value: id
                        });
                    }));
                    if (availableVersions.length === 1) {
                        setSelectedMakeMethod(availableVersions[0].id);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    (0, react_1.useMount)(function () {
        if (isQuoteLineMethod && (line === null || line === void 0 ? void 0 : line.itemId)) {
            getMakeMethods(line.itemId);
        }
    });
    return (<react_2.Fragment key={lineId}>
      {line &&
            permissions.can("update", "sales") &&
            (isQuoteLineMethod || isQuoteMakeMethod) && (<react_1.Menubar>
            <react_1.HStack className="w-full justify-start">
              <react_1.HStack spacing={0}>
                <react_1.MenubarItem isLoading={isGetMethodLoading} isDisabled={isGetMethodLoading} leftIcon={<lu_1.LuGitBranch />} onClick={getMethodModal.onOpen}>
                  Get Method
                </react_1.MenubarItem>
                <react_1.MenubarItem isDisabled={!permissions.can("update", "parts") || isSaveMethodLoading} isLoading={isSaveMethodLoading} leftIcon={<lu_1.LuGitMerge />} onClick={saveMethodModal.onOpen}>
                  Save Method
                </react_1.MenubarItem>
                {configurableItemIds.length > 0 && isQuoteLineMethod && (<react_1.MenubarItem leftIcon={<lu_1.LuSettings />} isDisabled={!permissions.can("update", "sales") || isConfigureLoading} isLoading={isConfigureLoading} onClick={function () {
                    var _a;
                    setSelectedConfigureItemId((_a = line === null || line === void 0 ? void 0 : line.itemId) !== null && _a !== void 0 ? _a : null);
                    configureSelectModal.onOpen();
                }}>
                    Configure
                  </react_1.MenubarItem>)}
                {itemLink && (<react_1.MenubarItem leftIcon={<lu_1.LuGitFork />} asChild>
                    <react_router_1.Link prefetch="intent" to={itemLink}>
                      <macro_1.Trans>Item Master</macro_1.Trans>
                    </react_router_1.Link>
                  </react_1.MenubarItem>)}
              </react_1.HStack>
            </react_1.HStack>
          </react_1.Menubar>)}
      {getMethodModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    getMethodModal.onClose();
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" fetcher={fetcher} action={path_1.path.to.quoteMethodGet} validator={sales_models_1.getMethodValidator} onSuccess={getMethodModal.onClose}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Get Method</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>
                    Overwrite the quote method with the source method
                  </macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                {isQuoteLineMethod ? (<react_1.Tabs defaultValue="item" className="w-full">
                    <react_1.TabsList className="grid w-full grid-cols-2 mb-4">
                      <react_1.TabsTrigger value="item">
                        <lu_1.LuSquareStack className="mr-2"/> Item
                      </react_1.TabsTrigger>
                      <react_1.TabsTrigger value="quote">
                        <ri_1.RiProgress4Line className="mr-2"/>
                        Quote
                      </react_1.TabsTrigger>
                    </react_1.TabsList>
                    <react_1.TabsContent value="item">
                      <Form_1.Hidden name="type" value="item"/>
                      <Form_1.Hidden name="targetId" value={"".concat(quoteId, ":").concat(lineId)}/>
                      <react_1.VStack spacing={4}>
                        {hasMethods && (<react_1.Alert variant="destructive">
                            <lu_1.LuTriangleAlert className="h-4 w-4"/>
                            <react_1.AlertTitle>
                              <macro_1.Trans>
                                This will overwrite the existing quote method
                              </macro_1.Trans>
                            </react_1.AlertTitle>
                          </react_1.Alert>)}
                        <Form_1.Item name="sourceId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Source Method"], ["Source Method"])))} type={((_k = line === null || line === void 0 ? void 0 : line.itemType) !== null && _k !== void 0 ? _k : "Part")} blacklist={configurableItemIds} includeInactive={includeInactive === true} locationId={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _l === void 0 ? void 0 : _l.locationId) !== null && _m !== void 0 ? _m : undefined} replenishmentSystem="Make"/>
                        <div className="flex items-center space-x-2">
                          <react_1.Checkbox id="include-inactive" checked={includeInactive} onCheckedChange={setIncludeInactive}/>
                          <label htmlFor="include-inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Include Inactive
                          </label>
                        </div>

                        <AdvancedSection onChange={setHasMethodParts}/>
                      </react_1.VStack>
                    </react_1.TabsContent>
                    <react_1.TabsContent value="quote">
                      <Form_1.Hidden name="type" value="quoteLine"/>
                      <Form_1.Hidden name="targetId" value={"".concat(quoteId, ":").concat(lineId)}/>
                      <QuoteLineMethodForm_1.QuoteLineMethodForm />
                    </react_1.TabsContent>
                  </react_1.Tabs>) : (<>
                    <Form_1.Hidden name="type" value="method"/>
                    <Form_1.Hidden name="targetId" value={methodId}/>
                    <react_1.VStack spacing={4}>
                      {hasMethods && (<react_1.Alert variant="destructive">
                          <lu_1.LuTriangleAlert className="h-4 w-4"/>
                          <react_1.AlertTitle>
                            <macro_1.Trans>
                              This will overwrite the existing quote method
                            </macro_1.Trans>
                          </react_1.AlertTitle>
                        </react_1.Alert>)}
                      <Form_1.Item name="sourceId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Source Method"], ["Source Method"])))} type={((_o = line === null || line === void 0 ? void 0 : line.itemType) !== null && _o !== void 0 ? _o : "Part")} blacklist={configurableItemIds} includeInactive={includeInactive === true} locationId={(_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _p === void 0 ? void 0 : _p.locationId) !== null && _q !== void 0 ? _q : undefined} replenishmentSystem="Make"/>
                      <div className="flex items-center space-x-2">
                        <react_1.Checkbox id="include-inactive" checked={includeInactive} onCheckedChange={setIncludeInactive}/>
                        <label htmlFor="include-inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Include Inactive
                        </label>
                      </div>

                      <AdvancedSection onChange={setHasMethodParts}/>
                    </react_1.VStack>
                  </>)}
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={getMethodModal.onClose} variant="secondary">
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <Form_1.Submit isDisabled={!hasMethodParts} variant={hasMethods ? "destructive" : "primary"}>
                  <macro_1.Trans>Confirm</macro_1.Trans>
                </Form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
      {saveMethodModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    saveMethodModal.onClose();
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm method="post" fetcher={fetcher} action={path_1.path.to.quoteMethodSave} validator={sales_models_1.getMethodValidator} defaultValues={{
                sourceId: isQuoteLineMethod
                    ? ((_r = line === null || line === void 0 ? void 0 : line.itemId) !== null && _r !== void 0 ? _r : undefined)
                    : undefined,
                // @ts-expect-error
                itemId: isQuoteLineMethod
                    ? ((_s = line === null || line === void 0 ? void 0 : line.itemId) !== null && _s !== void 0 ? _s : undefined)
                    : undefined
            }} onSuccess={saveMethodModal.onClose}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Save Method</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>
                    Overwrite the target manufacturing method with the quote
                    method
                  </macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                {isQuoteLineMethod ? (<>
                    <Form_1.Hidden name="type" value="item"/>
                    <Form_1.Hidden name="sourceId" value={"".concat(quoteId, ":").concat(lineId)}/>
                  </>) : (<>
                    <Form_1.Hidden name="type" value="method"/>
                    <Form_1.Hidden name="sourceId" value={methodId}/>
                  </>)}

                <react_1.VStack spacing={4}>
                  <react_1.Alert variant="destructive">
                    <lu_1.LuTriangleAlert className="h-4 w-4"/>
                    <react_1.AlertTitle>
                      <macro_1.Trans>
                        This will overwrite the existing manufacturing method
                        and the latest versions of all subassemblies.
                      </macro_1.Trans>
                    </react_1.AlertTitle>
                  </react_1.Alert>
                  <Form_1.Item name="itemId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Target Method"], ["Target Method"])))} type={((_t = line === null || line === void 0 ? void 0 : line.itemType) !== null && _t !== void 0 ? _t : "Part")} blacklist={configurableItemIds} locationId={(_v = (_u = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _u === void 0 ? void 0 : _u.locationId) !== null && _v !== void 0 ? _v : undefined} onChange={function (value) {
                if (value) {
                    getMakeMethods(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setMakeMethods([]);
                    setSelectedMakeMethod(null);
                }
            }} includeInactive={includeInactive === true} replenishmentSystem="Make"/>
                  <form_1.SelectControlled name="targetId" options={makeMethods} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Version"], ["Version"])))} value={selectedMakeMethod !== null && selectedMakeMethod !== void 0 ? selectedMakeMethod : undefined} onChange={function (value) {
                if (value) {
                    setSelectedMakeMethod(value === null || value === void 0 ? void 0 : value.value);
                }
                else {
                    setSelectedMakeMethod(null);
                }
            }} placeholder={makeMethods.length === 0
                ? t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["No draft versions available"], ["No draft versions available"]))) : undefined}/>
                  <div className="flex items-center space-x-2">
                    <react_1.Checkbox id="include-inactive" checked={includeInactive} onCheckedChange={setIncludeInactive}/>
                    <label htmlFor="include-inactive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Include Inactive
                    </label>
                  </div>
                  <AdvancedSection onChange={setHasMethodParts}/>
                </react_1.VStack>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={saveMethodModal.onClose} variant="secondary">
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <Form_1.Submit isDisabled={!selectedMakeMethod || !hasMethodParts} variant={hasMethods ? "destructive" : "primary"}>
                  <macro_1.Trans>Confirm</macro_1.Trans>
                </Form_1.Submit>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
      {configureSelectModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open) {
                    configureSelectModal.onClose();
                }
            }}>
          <react_1.ModalContent>
            <form_1.ValidatedForm validator={sales_models_1.getMethodValidator}>
              <react_1.ModalHeader>
                <react_1.ModalTitle>
                  <macro_1.Trans>Configure Item</macro_1.Trans>
                </react_1.ModalTitle>
                <react_1.ModalDescription>
                  <macro_1.Trans>Select an item to configure</macro_1.Trans>
                </react_1.ModalDescription>
              </react_1.ModalHeader>
              <react_1.ModalBody>
                <Form_1.Item name="sourceId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Item"], ["Item"])))} value={selectedConfigureItemId !== null && selectedConfigureItemId !== void 0 ? selectedConfigureItemId : undefined} type={((_w = line === null || line === void 0 ? void 0 : line.itemType) !== null && _w !== void 0 ? _w : "Part")} includeInactive={includeInactive === true} whitelist={configurableItemIds} locationId={(_y = (_x = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _x === void 0 ? void 0 : _x.locationId) !== null && _y !== void 0 ? _y : undefined} replenishmentSystem="Make" onChange={function (value) {
                var _a;
                setSelectedConfigureItemId((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null);
            }}/>
              </react_1.ModalBody>
              <react_1.ModalFooter>
                <react_1.Button onClick={configureSelectModal.onClose} variant="secondary">
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
                <react_1.Button isDisabled={!selectedConfigureItemId} onClick={function () {
                return handleConfigureItemSelect(selectedConfigureItemId);
            }}>
                  <macro_1.Trans>Next</macro_1.Trans>
                </react_1.Button>
              </react_1.ModalFooter>
            </form_1.ValidatedForm>
          </react_1.ModalContent>
        </react_1.Modal>)}
      {configuratorModal.isOpen && (<ConfiguratorForm_1.ConfiguratorModal open destructive initialValues={(line === null || line === void 0 ? void 0 : line.configuration)
                ? line.configuration
                : {}} groups={configurationParameters.groups} parameters={configurationParameters.parameters} onClose={function () {
                configuratorModal.onClose();
                setSelectedConfigureItemId(null);
                setConfigurationParameters({ groups: [], parameters: [] });
            }} onSubmit={function (config) {
                saveConfiguration(config);
            }}/>)}
    </react_2.Fragment>);
};
function AdvancedSection(_a) {
    var onChange = _a.onChange;
    var _b = (0, react_2.useState)(false), open = _b[0], setOpen = _b[1];
    var _c = (0, react_2.useState)(true), billOfMaterial = _c[0], setBillOfMaterial = _c[1];
    var _d = (0, react_2.useState)(true), billOfProcess = _d[0], setBillOfProcess = _d[1];
    var _e = (0, react_2.useState)(true), parameters = _e[0], setParameters = _e[1];
    var _f = (0, react_2.useState)(true), tools = _f[0], setTools = _f[1];
    var _g = (0, react_2.useState)(true), steps = _g[0], setSteps = _g[1];
    var _h = (0, react_2.useState)(true), workInstructions = _h[0], setWorkInstructions = _h[1];
    var hasSelection = billOfMaterial ||
        (billOfProcess && (parameters || tools || steps || workInstructions));
    (0, react_2.useEffect)(function () {
        onChange === null || onChange === void 0 ? void 0 : onChange(hasSelection);
    }, [hasSelection, onChange]);
    var processChildren = [
        {
            name: "parameters",
            label: "Parameters",
            checked: parameters,
            onChange: setParameters
        },
        { name: "tools", label: "Tools", checked: tools, onChange: setTools },
        { name: "steps", label: "Steps", checked: steps, onChange: setSteps },
        {
            name: "workInstructions",
            label: "Work Instructions",
            checked: workInstructions,
            onChange: setWorkInstructions
        }
    ];
    return (<react_1.Collapsible className="w-full" open={open} onOpenChange={setOpen}>
      <react_1.CollapsibleTrigger asChild>
        <react_1.Button variant="ghost" className="w-full justify-start gap-2 px-0">
          <lu_1.LuChevronRight className={(0, react_1.cn)("h-4 w-4 transition-transform", open && "rotate-90")}/>
          Advanced
        </react_1.Button>
      </react_1.CollapsibleTrigger>
      <react_1.CollapsibleContent forceMount className={(0, react_1.cn)(!open && "hidden")}>
        <react_1.VStack spacing={2} className="pt-2">
          <div className="flex items-center space-x-2">
            <react_1.Checkbox id="billOfMaterial" name="billOfMaterial" checked={billOfMaterial} onCheckedChange={function (checked) { return setBillOfMaterial(!!checked); }}/>
            <label htmlFor="billOfMaterial" className="text-sm font-medium leading-none">
              Bill of Material
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <react_1.Checkbox id="billOfProcess" name="billOfProcess" checked={billOfProcess} onCheckedChange={function (checked) { return setBillOfProcess(!!checked); }}/>
            <label htmlFor="billOfProcess" className="text-sm font-medium leading-none">
              Bill of Process
            </label>
          </div>
          <react_1.VStack spacing={2} className="pl-6">
            {processChildren.map(function (_a) {
            var name = _a.name, label = _a.label, checked = _a.checked, onChange = _a.onChange;
            return (<div key={name} className="flex items-center space-x-2">
                <react_1.Checkbox id={name} name={name} disabled={!billOfProcess} checked={billOfProcess ? checked : false} onCheckedChange={function (val) { return onChange(!!val); }}/>
                <label htmlFor={name} className={(0, react_1.cn)("text-sm font-medium leading-none", !billOfProcess && "text-muted-foreground")}>
                  {label}
                </label>
              </div>);
        })}
          </react_1.VStack>
        </react_1.VStack>
      </react_1.CollapsibleContent>
    </react_1.Collapsible>);
}
exports.default = QuoteMakeMethodTools;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
