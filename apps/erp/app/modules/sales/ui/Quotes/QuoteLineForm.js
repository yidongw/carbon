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
var auth_1 = require("@carbon/auth");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var ConfiguratorForm_1 = require("~/components/Configurator/ConfiguratorForm");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var ItemForm_1 = require("~/modules/items/ui/Item/ItemForm");
var shared_1 = require("~/modules/shared");
var stores_1 = require("~/stores");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
var DeleteQuoteLine_1 = require("./DeleteQuoteLine");
var QuoteLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var initialValues = _a.initialValues, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var quoteId = (0, react_router_1.useParams)().quoteId;
    if (!quoteId)
        throw new Error("quoteId not found");
    var items = (0, stores_1.useItems)()[0];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.quote(quoteId));
    var isLocked = (0, sales_models_1.isQuoteLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.status);
    var isEditable = !isLocked;
    var isEditing = initialValues.id !== undefined;
    var _s = (0, react_2.useState)({
        customerPartId: (_c = initialValues.customerPartId) !== null && _c !== void 0 ? _c : "",
        customerPartRevision: (_d = initialValues.customerPartRevision) !== null && _d !== void 0 ? _d : "",
        itemId: (_e = initialValues.itemId) !== null && _e !== void 0 ? _e : "",
        description: (_f = initialValues.description) !== null && _f !== void 0 ? _f : "",
        methodType: (_g = initialValues.methodType) !== null && _g !== void 0 ? _g : "",
        uom: (_h = initialValues.unitOfMeasureCode) !== null && _h !== void 0 ? _h : "",
        modelUploadId: (_j = initialValues.modelUploadId) !== null && _j !== void 0 ? _j : null
    }), itemData = _s[0], setItemData = _s[1];
    var configurationDisclosure = (0, react_1.useDisclosure)();
    var _t = (0, react_2.useState)(false), requiresConfiguration = _t[0], setRequiresConfiguration = _t[1];
    var _u = (0, react_2.useState)(false), isConfigured = _u[0], setIsConfigured = _u[1];
    var _v = (0, react_2.useState)(null), configurationParameters = _v[0], setConfigurationParameters = _v[1];
    var _w = (0, react_2.useState)(""), configurationValues = _w[0], setConfigurationValues = _w[1];
    var percentFormatter = (0, hooks_1.usePercentFormatter)();
    var onCustomerPartChange = function (customerPartId) { return __awaiter(void 0, void 0, void 0, function () {
        var customerPart;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!carbon || !((_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.customerId))
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("customerPartToItem")
                            .select("itemId")
                            .eq("customerPartId", customerPartId)
                            .eq("customerPartRevision", (_b = itemData.customerPartRevision) !== null && _b !== void 0 ? _b : "")
                            .eq("customerId", (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.customerId)
                            .maybeSingle()];
                case 1:
                    customerPart = _d.sent();
                    if (customerPart.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load customer part details"], ["Failed to load customer part details"]))));
                        return [2 /*return*/];
                    }
                    if (customerPart.data && customerPart.data.itemId && !itemData.itemId) {
                        onItemChange(customerPart.data.itemId);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onCustomerPartRevisionChange = function (customerPartRevision) { return __awaiter(void 0, void 0, void 0, function () {
        var customerPart;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon || !((_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.customerId) || !itemData.customerPartId)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("customerPartToItem")
                            .select("itemId")
                            .eq("customerPartId", itemData.customerPartId)
                            .eq("customerPartRevision", customerPartRevision !== null && customerPartRevision !== void 0 ? customerPartRevision : "")
                            .eq("customerId", (_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.customerId)
                            .maybeSingle()];
                case 1:
                    customerPart = _c.sent();
                    if (customerPart.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to load customer part details"], ["Failed to load customer part details"]))));
                        return [2 /*return*/];
                    }
                    if (customerPart.data && customerPart.data.itemId && !itemData.itemId) {
                        onItemChange(customerPart.data.itemId);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, customerPart, itemReplenishment, newItemData, _b, parameters, groups;
        var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, readableIdWithRevision, defaultMethodType, unitOfMeasureCode, modelUploadId")
                                .eq("id", itemId)
                                .eq("companyId", company.id)
                                .single(),
                            carbon
                                .from("customerPartToItem")
                                .select("customerPartId, customerPartRevision")
                                .eq("itemId", itemId)
                                .eq("customerId", (_c = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _c === void 0 ? void 0 : _c.customerId)
                                .maybeSingle(),
                            carbon
                                .from("itemReplenishment")
                                .select("requiresConfiguration")
                                .eq("itemId", itemId)
                                .maybeSingle()
                        ])];
                case 1:
                    _a = _r.sent(), item = _a[0], customerPart = _a[1], itemReplenishment = _a[2];
                    if (item.error) {
                        react_1.toast.error(t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    newItemData = __assign(__assign({}, itemData), { itemId: itemId, description: (_e = (_d = item.data) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : "", methodType: (_g = (_f = item.data) === null || _f === void 0 ? void 0 : _f.defaultMethodType) !== null && _g !== void 0 ? _g : "", uom: (_j = (_h = item.data) === null || _h === void 0 ? void 0 : _h.unitOfMeasureCode) !== null && _j !== void 0 ? _j : "", modelUploadId: (_l = (_k = item.data) === null || _k === void 0 ? void 0 : _k.modelUploadId) !== null && _l !== void 0 ? _l : null });
                    if (customerPart.data && !itemData.customerPartId) {
                        newItemData.customerPartId = customerPart.data.customerPartId;
                        newItemData.customerPartRevision =
                            (_m = customerPart.data.customerPartRevision) !== null && _m !== void 0 ? _m : "";
                    }
                    setItemData(newItemData);
                    if (!((_o = itemReplenishment.data) === null || _o === void 0 ? void 0 : _o.requiresConfiguration)) return [3 /*break*/, 3];
                    setRequiresConfiguration(true);
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("configurationParameter")
                                .select("*")
                                .eq("itemId", itemId)
                                .eq("companyId", company.id),
                            carbon
                                .from("configurationParameterGroup")
                                .select("*")
                                .eq("itemId", itemId)
                                .eq("companyId", company.id)
                        ])];
                case 2:
                    _b = _r.sent(), parameters = _b[0], groups = _b[1];
                    if (parameters.error || groups.error) {
                        react_1.toast.error(t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Failed to load configuration parameters"], ["Failed to load configuration parameters"]))));
                        return [2 /*return*/];
                    }
                    setConfigurationParameters({
                        parameters: (_p = parameters.data) !== null && _p !== void 0 ? _p : [],
                        groups: (_q = groups.data) !== null && _q !== void 0 ? _q : []
                    });
                    return [3 /*break*/, 4];
                case 3:
                    setRequiresConfiguration(false);
                    setConfigurationParameters(null);
                    _r.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var deleteDisclosure = (0, react_1.useDisclosure)();
    return (<>
      <react_1.ModalCardProvider type={type}>
        <react_1.ModalCard onClose={onClose} defaultCollapsed={false} isCollapsible={isEditing}>
          <react_1.ModalCardContent size="xxlarge">
            <form_1.ValidatedForm fetcher={fetcher} defaultValues={initialValues} validator={sales_models_1.quoteLineValidator} method="post" action={isEditing
            ? path_1.path.to.quoteLine(quoteId, initialValues.id)
            : path_1.path.to.newQuoteLine(quoteId)} className="w-full" isDisabled={isEditing && isLocked} onSuccess={type === "modal" ? onClose : undefined}>
              <react_1.HStack className="w-full justify-between items-start">
                <react_1.ModalCardHeader>
                  <react_1.ModalCardTitle>
                    {isEditing ? (((_k = (0, utils_1.getItemReadableId)(items, itemData === null || itemData === void 0 ? void 0 : itemData.itemId)) !== null && _k !== void 0 ? _k : (<macro_1.Trans>Quote Line</macro_1.Trans>))) : (<macro_1.Trans>New Quote Line</macro_1.Trans>)}
                  </react_1.ModalCardTitle>
                  <react_1.ModalCardDescription>
                    {isEditing ? (<div className="flex flex-col items-start gap-1">
                        <span>{itemData === null || itemData === void 0 ? void 0 : itemData.description}</span>
                        <div className="flex items-center gap-2">
                          <react_1.Badge variant="outline" className="flex items-center gap-2">
                            <components_1.MethodIcon type={itemData.methodType}/>
                            {initialValues === null || initialValues === void 0 ? void 0 : initialValues.quantity.join(", ")}
                          </react_1.Badge>
                          {(initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent) > 0 ? (<react_1.Badge variant="red">
                              {percentFormatter.format(initialValues === null || initialValues === void 0 ? void 0 : initialValues.taxPercent)}{" "}
                              <macro_1.Trans>Tax</macro_1.Trans>
                            </react_1.Badge>) : null}
                        </div>
                      </div>) : (<macro_1.Trans>
                        A quote line contains pricing and lead times for a
                        particular part
                      </macro_1.Trans>)}
                  </react_1.ModalCardDescription>
                </react_1.ModalCardHeader>
                {isEditing && permissions.can("update", "sales") && (<react_1.CardAction className="pr-12">
                    <react_1.DropdownMenu>
                      <react_1.DropdownMenuTrigger asChild>
                        <react_1.IconButton icon={<bs_1.BsThreeDotsVertical />} aria-label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["More"], ["More"])))} variant="ghost"/>
                      </react_1.DropdownMenuTrigger>
                      <react_1.DropdownMenuContent align="end">
                        {!isLocked && (<react_1.DropdownMenuItem destructive onClick={deleteDisclosure.onOpen}>
                            <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                            <macro_1.Trans>Delete Line</macro_1.Trans>
                          </react_1.DropdownMenuItem>)}
                        <react_1.DropdownMenuItem asChild>
                          <react_router_1.Link to={(0, ItemForm_1.getLinkToItemDetails)("Part", itemData.itemId)}>
                            <react_1.DropdownMenuIcon icon={<components_1.MethodItemTypeIcon type="Part"/>}/>
                            <macro_1.Trans>View Item Master</macro_1.Trans>
                          </react_router_1.Link>
                        </react_1.DropdownMenuItem>
                      </react_1.DropdownMenuContent>
                    </react_1.DropdownMenu>
                  </react_1.CardAction>)}
              </react_1.HStack>
              <react_1.ModalCardBody>
                <Form_1.Hidden name="id"/>
                <Form_1.Hidden name="quoteId"/>
                <Form_1.Hidden name="unitOfMeasureCode" value={itemData === null || itemData === void 0 ? void 0 : itemData.uom}/>
                <Form_1.Hidden name="modelUploadId" value={(_l = itemData === null || itemData === void 0 ? void 0 : itemData.modelUploadId) !== null && _l !== void 0 ? _l : undefined}/>
                {!isEditing && requiresConfiguration && (<Form_1.Hidden name="configuration" value={JSON.stringify(configurationValues)}/>)}
                <react_1.VStack>
                  <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                    <div className="col-span-2 grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 auto-rows-min">
                      <Form_1.Item autoFocus name="itemId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Part"], ["Part"])))} type="Part" value={itemData.itemId} includeInactive locationId={(_o = (_m = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _m === void 0 ? void 0 : _m.locationId) !== null && _o !== void 0 ? _o : undefined} onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }}/>

                      <Form_1.InputControlled name="description" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Short Description"], ["Short Description"])))} value={itemData.description}/>

                      <Form_1.SelectControlled name="methodType" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Method"], ["Method"])))} options={(_p = shared_1.methodType.map(function (m) { return ({
            label: (<span className="flex items-center gap-2">
                                <components_1.MethodIcon type={m}/>
                                {m}
                              </span>),
            value: m
        }); })) !== null && _p !== void 0 ? _p : []} value={itemData.methodType} onChange={function (newValue) {
            if (newValue)
                setItemData(function (d) { return (__assign(__assign({}, d), { methodType: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
        }}/>

                      <Form_1.Select name="status" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Line Status"], ["Line Status"])))} options={sales_models_1.quoteLineStatusType.map(function (s) { return ({
            label: (<span className="flex items-center gap-2">
                              <Icons_1.QuoteLineStatusIcon status={s}/>
                              {s}
                            </span>),
            value: s
        }); })}/>

                      <Form_1.InputControlled name="customerPartId" label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Customer Part Number"], ["Customer Part Number"])))} value={itemData.customerPartId} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { customerPartId: newValue })); });
        }} onBlur={function (e) { return onCustomerPartChange(e.target.value); }}/>
                      <Form_1.InputControlled name="customerPartRevision" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Customer Part Revision"], ["Customer Part Revision"])))} value={itemData.customerPartRevision} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { customerPartRevision: newValue })); });
        }} onBlur={function (e) {
            return onCustomerPartRevisionChange(e.target.value);
        }}/>
                      <Form_1.Number name="taxPercent" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Tax Percent"], ["Tax Percent"])))} minValue={0} maxValue={1} step={0.0001} formatOptions={{
            style: "percent",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }}/>

                      <Form_1.CustomFormFields table="quoteLine"/>
                      {initialValues.status === "No Quote" && (<form_1.TextArea name="noQuoteReason" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["No Quote Reason"], ["No Quote Reason"])))}/>)}
                    </div>
                    <div className="flex gap-y-4">
                      <Form_1.ArrayNumeric name="quantity" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Quantity"], ["Quantity"])))} defaults={[1, 25, 50, 100]} isDisabled={!isEditable}/>
                    </div>
                  </div>
                </react_1.VStack>
              </react_1.ModalCardBody>
              <react_1.ModalCardFooter>
                {!isEditing && (<react_1.Button variant="secondary" onClick={onClose}>
                    <macro_1.Trans>Cancel</macro_1.Trans>
                  </react_1.Button>)}
                {!isEditing && requiresConfiguration && (<react_1.Button variant={isConfigured ? "secondary" : "primary"} isLoading={fetcher.state !== "idle"} type="button" isDisabled={!isEditable ||
                (isEditing
                    ? !permissions.can("update", "sales")
                    : !permissions.can("create", "sales"))} onClick={function () {
                configurationDisclosure.onOpen();
            }}>
                    <macro_1.Trans>Configure</macro_1.Trans>
                  </react_1.Button>)}

                <Form_1.Submit isLoading={fetcher.state !== "idle"} isDisabled={(requiresConfiguration && !isConfigured) ||
            !isEditable ||
            (isEditing
                ? !permissions.can("update", "sales")
                : !permissions.can("create", "sales"))}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.ModalCardFooter>
            </form_1.ValidatedForm>
          </react_1.ModalCardContent>
        </react_1.ModalCard>
      </react_1.ModalCardProvider>
      {isEditing && deleteDisclosure.isOpen && (<DeleteQuoteLine_1.default line={initialValues} onCancel={deleteDisclosure.onClose}/>)}
      {requiresConfiguration &&
            configurationDisclosure.isOpen &&
            configurationParameters && (<ConfiguratorForm_1.ConfiguratorModal open initialValues={configurationValues || {}} groups={(_q = configurationParameters.groups) !== null && _q !== void 0 ? _q : []} parameters={(_r = configurationParameters.parameters) !== null && _r !== void 0 ? _r : []} onClose={configurationDisclosure.onClose} onSubmit={function (config) {
                setConfigurationValues(config);
                setIsConfigured(true);
                configurationDisclosure.onClose();
            }}/>)}
    </>);
};
exports.default = QuoteLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
