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
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var bs_1 = require("react-icons/bs");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var DeleteSupplierQuoteLine_1 = require("./DeleteSupplierQuoteLine");
var SupplierQuoteLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var initialValues = _a.initialValues, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var id = (0, react_router_1.useParams)().id;
    var fetcher = (0, react_router_1.useFetcher)();
    if (!id)
        throw new Error("id not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplierQuote(id));
    var isLocked = (0, purchasing_models_1.isSupplierQuoteLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.status);
    var isEditing = initialValues.id !== undefined;
    var isGLAccount = initialValues.supplierQuoteLineType === "G/L Account";
    var _q = (0, react_2.useState)(isGLAccount ? "indirect" : "direct"), activeTab = _q[0], setActiveTab = _q[1];
    var _r = (0, react_2.useState)({
        accountId: (_c = initialValues.accountId) !== null && _c !== void 0 ? _c : "",
        costCenterId: (_d = initialValues.costCenterId) !== null && _d !== void 0 ? _d : "",
        description: (_e = initialValues.description) !== null && _e !== void 0 ? _e : "",
        requiredDate: (_f = initialValues.requiredDate) !== null && _f !== void 0 ? _f : null
    }), indirectData = _r[0], setIndirectData = _r[1];
    var _s = (0, react_2.useState)(initialValues.itemType), itemType = _s[0], setItemType = _s[1];
    var _t = (0, react_2.useState)({
        supplierPartId: (_g = initialValues.supplierPartId) !== null && _g !== void 0 ? _g : "",
        itemId: (_h = initialValues.itemId) !== null && _h !== void 0 ? _h : "",
        description: (_j = initialValues.description) !== null && _j !== void 0 ? _j : "",
        inventoryUom: (_k = initialValues.inventoryUnitOfMeasureCode) !== null && _k !== void 0 ? _k : "",
        purchaseUom: (_l = initialValues.purchaseUnitOfMeasureCode) !== null && _l !== void 0 ? _l : "",
        conversionFactor: (_m = initialValues.conversionFactor) !== null && _m !== void 0 ? _m : 1
    }), itemData = _t[0], setItemData = _t[1];
    var onSupplierPartChange = function (supplierPartId) { return __awaiter(void 0, void 0, void 0, function () {
        var supplierPart;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!carbon || !((_a = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _a === void 0 ? void 0 : _a.supplierId))
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("supplierPart")
                            .select("supplierPartId, itemId")
                            .eq("supplierPartId", supplierPartId)
                            .eq("supplierId", (_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.supplierId)
                            .maybeSingle()];
                case 1:
                    supplierPart = _c.sent();
                    if (supplierPart.error) {
                        react_1.toast.error(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Failed to load supplier part details"], ["Failed to load supplier part details"]))));
                        return [2 /*return*/];
                    }
                    if (supplierPart.data && supplierPart.data.itemId && !itemData.itemId) {
                        onItemChange(supplierPart.data.itemId);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var onItemChange = function (itemId) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, item, supplierPart, newItemData;
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        return __generator(this, function (_s) {
            switch (_s.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, readableIdWithRevision, type, unitOfMeasureCode")
                                .eq("id", itemId)
                                .eq("companyId", company.id)
                                .single(),
                            carbon
                                .from("supplierPart")
                                .select("supplierPartId, supplierUnitOfMeasureCode, conversionFactor")
                                .eq("itemId", itemId)
                                .eq("supplierId", (_b = routeData === null || routeData === void 0 ? void 0 : routeData.quote) === null || _b === void 0 ? void 0 : _b.supplierId)
                                .maybeSingle()
                        ])];
                case 1:
                    _a = _s.sent(), item = _a[0], supplierPart = _a[1];
                    if (item.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    newItemData = __assign(__assign({}, itemData), { itemId: itemId, itemReadableId: (_d = (_c = item.data) === null || _c === void 0 ? void 0 : _c.readableIdWithRevision) !== null && _d !== void 0 ? _d : "", description: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.name) !== null && _f !== void 0 ? _f : "", inventoryUom: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.unitOfMeasureCode) !== null && _h !== void 0 ? _h : "EA", purchaseUom: (_m = (_k = (_j = supplierPart.data) === null || _j === void 0 ? void 0 : _j.supplierUnitOfMeasureCode) !== null && _k !== void 0 ? _k : (_l = item.data) === null || _l === void 0 ? void 0 : _l.unitOfMeasureCode) !== null && _m !== void 0 ? _m : "EA", conversionFactor: (_p = (_o = supplierPart.data) === null || _o === void 0 ? void 0 : _o.conversionFactor) !== null && _p !== void 0 ? _p : 1 });
                    if (supplierPart.data && !itemData.supplierPartId) {
                        newItemData.supplierPartId = (_q = supplierPart.data.supplierPartId) !== null && _q !== void 0 ? _q : "";
                    }
                    setItemData(newItemData);
                    if ((_r = item.data) === null || _r === void 0 ? void 0 : _r.type) {
                        setItemType(item.data.type);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var deleteDisclosure = (0, react_1.useDisclosure)();
    return (<>
      <react_1.Tabs value={activeTab} onValueChange={function (v) { return setActiveTab(v); }} className="w-full">
        <react_1.ModalCardProvider type={type}>
          <react_1.ModalCard onClose={onClose} defaultCollapsed={false} isCollapsible={isEditing}>
            <react_1.ModalCardContent size="xxlarge">
              <form_1.ValidatedForm defaultValues={initialValues} validator={purchasing_models_1.supplierQuoteLineValidator} method="post" action={isEditing
            ? path_1.path.to.supplierQuoteLine(id, initialValues.id)
            : path_1.path.to.newSupplierQuoteLine(id)} className="w-full" fetcher={fetcher} isDisabled={isEditing && isLocked} onSuccess={type === "modal" ? onClose : undefined}>
                <react_1.HStack className={(0, react_1.cn)("w-full justify-between items-start", type === "modal" && "pr-16", type !== "modal" && isEditing && "pr-6")}>
                  <react_1.ModalCardHeader className="flex flex-1">
                    <react_1.ModalCardTitle>
                      {isEditing
            ? "Supplier Quote Line"
            : "New Supplier Quote Line"}
                    </react_1.ModalCardTitle>
                    <react_1.ModalCardDescription>
                      {isEditing ? (<div className="flex flex-col items-start gap-1">
                          <span>{itemData === null || itemData === void 0 ? void 0 : itemData.description}</span>
                          <div className="flex items-center gap-2">
                            <react_1.Badge variant="outline">
                              {initialValues === null || initialValues === void 0 ? void 0 : initialValues.quantity.join(", ")}
                            </react_1.Badge>
                          </div>
                        </div>) : ("A quote line contains pricing and lead times for a particular part")}
                    </react_1.ModalCardDescription>
                  </react_1.ModalCardHeader>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!isEditing && (<react_1.TabsList>
                        <react_1.TabsTrigger value="direct">
                          <lu_1.LuBox className="mr-1"/>
                          <macro_1.Trans>Direct</macro_1.Trans>
                        </react_1.TabsTrigger>
                        <react_1.TabsTrigger value="indirect">
                          <lu_1.LuReceipt className="mr-1"/>
                          <macro_1.Trans>Indirect</macro_1.Trans>
                        </react_1.TabsTrigger>
                      </react_1.TabsList>)}
                    {isEditing &&
            !isLocked &&
            permissions.can("update", "purchasing") && (<react_1.CardAction>
                          <react_1.DropdownMenu>
                            <react_1.DropdownMenuTrigger asChild>
                              <react_1.IconButton icon={<bs_1.BsThreeDotsVertical />} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["More"], ["More"])))} variant="ghost"/>
                            </react_1.DropdownMenuTrigger>
                            <react_1.DropdownMenuContent align="end">
                              <react_1.DropdownMenuItem destructive onClick={deleteDisclosure.onOpen}>
                                <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                                <macro_1.Trans>Delete Line</macro_1.Trans>
                              </react_1.DropdownMenuItem>
                            </react_1.DropdownMenuContent>
                          </react_1.DropdownMenu>
                        </react_1.CardAction>)}
                  </div>
                </react_1.HStack>
                <react_1.ModalCardBody>
                  <Form_1.Hidden name="id"/>
                  <Form_1.Hidden name="supplierQuoteId"/>

                  <react_1.TabsContent value="direct">
                    <Form_1.Hidden name="supplierQuoteLineType" value={itemType}/>
                    <Form_1.Hidden name="inventoryUnitOfMeasureCode" value={itemData === null || itemData === void 0 ? void 0 : itemData.inventoryUom}/>
                    <react_1.VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        <div className="col-span-2 grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 auto-rows-min">
                          <Form_1.Item autoFocus name="itemId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Part"], ["Part"])))} type={itemType} value={itemData.itemId} includeInactive onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} onTypeChange={function (type) {
            setItemType(type);
            setItemData(__assign(__assign({}, itemData), { itemId: "", description: "", inventoryUom: "", purchaseUom: "", conversionFactor: 1, supplierPartId: "" }));
        }}/>

                          <Form_1.InputControlled name="description" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Short Description"], ["Short Description"])))} value={itemData.description}/>

                          <Form_1.InputControlled name="supplierPartId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Supplier Part Number"], ["Supplier Part Number"])))} value={itemData.supplierPartId} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { supplierPartId: newValue })); });
        }} onBlur={function (e) { return onSupplierPartChange(e.target.value); }}/>
                          <Form_1.UnitOfMeasure name="purchaseUnitOfMeasureCode" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Purchase Unit of Measure"], ["Purchase Unit of Measure"])))} value={itemData.purchaseUom} onChange={function (newValue) {
            if (newValue) {
                setItemData(function (d) { return (__assign(__assign({}, d), { purchaseUom: newValue === null || newValue === void 0 ? void 0 : newValue.value })); });
            }
        }}/>
                          <Form_1.ConversionFactor name="conversionFactor" purchasingCode={itemData.purchaseUom} inventoryCode={itemData.inventoryUom} value={itemData.conversionFactor} onChange={function (value) {
            setItemData(function (d) { return (__assign(__assign({}, d), { conversionFactor: value })); });
        }}/>

                          <Form_1.CustomFormFields table="supplierQuoteLine"/>
                        </div>
                        <div className="flex gap-y-4">
                          <Form_1.ArrayNumeric name="quantity" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Quantity"], ["Quantity"])))} defaults={[1, 25, 50, 100]} isDisabled={isLocked}/>
                        </div>
                      </div>
                    </react_1.VStack>
                  </react_1.TabsContent>

                  <react_1.TabsContent value="indirect">
                    <Form_1.Hidden name="supplierQuoteLineType" value="G/L Account"/>
                    <react_1.VStack>
                      <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                        <div className="col-span-2 grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 auto-rows-min">
                          <Form_1.Account name="accountId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["GL Account"], ["GL Account"])))} classes={["Asset", "Expense"]} isOptional={false}/>

                          <Form_1.InputControlled label={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Description"], ["Description"])))} name="description" value={indirectData.description} isOptional={false} onChange={function (newValue) {
            return setIndirectData(function (d) { return (__assign(__assign({}, d), { description: newValue })); });
        }}/>
                          <Form_1.CostCenter name="costCenterId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Cost Center"], ["Cost Center"])))} isOptional/>
                          <form_1.DatePicker name="requiredDate" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Required Date"], ["Required Date"])))} value={(_o = indirectData.requiredDate) !== null && _o !== void 0 ? _o : undefined} onChange={function (date) {
            setIndirectData(function (d) { return (__assign(__assign({}, d), { requiredDate: date })); });
        }}/>
                          <Form_1.CustomFormFields table="supplierQuoteLine"/>
                        </div>
                        <div className="flex gap-y-4">
                          <Form_1.ArrayNumeric name="quantity" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Quantity"], ["Quantity"])))} defaults={[1, 25, 50, 100]} isDisabled={isLocked}/>
                        </div>
                      </div>
                    </react_1.VStack>
                  </react_1.TabsContent>
                </react_1.ModalCardBody>
                <react_1.ModalCardFooter>
                  <Form_1.Submit isDisabled={isLocked ||
            (isEditing
                ? !permissions.can("update", "purchasing")
                : !permissions.can("create", "purchasing"))}>
                    <macro_1.Trans>Save</macro_1.Trans>
                  </Form_1.Submit>
                </react_1.ModalCardFooter>
              </form_1.ValidatedForm>
            </react_1.ModalCardContent>
          </react_1.ModalCard>
        </react_1.ModalCardProvider>
      </react_1.Tabs>
      {isEditing && deleteDisclosure.isOpen && initialValues.id && (<DeleteSupplierQuoteLine_1.default line={{
                itemId: (_p = itemData.itemId) !== null && _p !== void 0 ? _p : "",
                id: initialValues.id
            }} onCancel={deleteDisclosure.onClose}/>)}
    </>);
};
exports.default = SupplierQuoteLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
