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
var sales_models_1 = require("../../sales.models");
var DeleteSalesRFQLine_1 = require("./DeleteSalesRFQLine");
var SalesRFQLineForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    var initialValues = _a.initialValues, type = _a.type, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var carbon = (0, auth_1.useCarbon)().carbon;
    var rfqId = (0, react_router_1.useParams)().rfqId;
    var fetcher = (0, react_router_1.useFetcher)();
    if (!rfqId)
        throw new Error("rfqId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.salesRfq(rfqId));
    var isLocked = (0, sales_models_1.isSalesRfqLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.status);
    var isEditing = initialValues.id !== undefined;
    var _m = (0, react_2.useState)({
        customerPartId: (_c = initialValues.customerPartId) !== null && _c !== void 0 ? _c : "",
        customerPartRevision: (_d = initialValues.customerPartRevision) !== null && _d !== void 0 ? _d : "",
        itemId: (_e = initialValues.itemId) !== null && _e !== void 0 ? _e : "",
        description: (_f = initialValues.description) !== null && _f !== void 0 ? _f : "",
        unitOfMeasureCode: (_g = initialValues.unitOfMeasureCode) !== null && _g !== void 0 ? _g : "EA",
        modelUploadId: (_h = initialValues.modelUploadId) !== null && _h !== void 0 ? _h : null
    }), itemData = _m[0], setItemData = _m[1];
    var onCustomerPartChange = function (customerPartId) { return __awaiter(void 0, void 0, void 0, function () {
        var customerPart;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!carbon || !((_a = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _a === void 0 ? void 0 : _a.customerId))
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("customerPartToItem")
                            .select("itemId")
                            .eq("customerPartId", customerPartId)
                            .eq("customerPartRevision", (_b = itemData.customerPartRevision) !== null && _b !== void 0 ? _b : "")
                            .eq("customerId", (_c = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _c === void 0 ? void 0 : _c.customerId)
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
                    if (!carbon ||
                        !((_a = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _a === void 0 ? void 0 : _a.customerId) ||
                        !itemData.customerPartId)
                        return [2 /*return*/];
                    return [4 /*yield*/, carbon
                            .from("customerPartToItem")
                            .select("itemId")
                            .eq("customerPartId", itemData.customerPartId)
                            .eq("customerPartRevision", customerPartRevision !== null && customerPartRevision !== void 0 ? customerPartRevision : "")
                            .eq("customerId", (_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.customerId)
                            .maybeSingle()];
                case 1:
                    customerPart = _c.sent();
                    if (customerPart.error) {
                        react_1.toast.error("Failed to load customer part details");
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
        var _a, item, customerPart, newItemData;
        var _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    if (!carbon)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("item")
                                .select("name, unitOfMeasureCode, modelUploadId")
                                .eq("id", itemId)
                                .eq("companyId", company.id)
                                .single(),
                            carbon
                                .from("customerPartToItem")
                                .select("customerPartId, customerPartRevision")
                                .eq("itemId", itemId)
                                .eq("customerId", (_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.customerId)
                                .maybeSingle()
                        ])];
                case 1:
                    _a = _k.sent(), item = _a[0], customerPart = _a[1];
                    if (item.error) {
                        react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to load item details"], ["Failed to load item details"]))));
                        return [2 /*return*/];
                    }
                    newItemData = __assign(__assign({}, itemData), { itemId: itemId, description: (_d = (_c = item.data) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : "", unitOfMeasureCode: (_f = (_e = item.data) === null || _e === void 0 ? void 0 : _e.unitOfMeasureCode) !== null && _f !== void 0 ? _f : "EA", modelUploadId: (_h = (_g = item.data) === null || _g === void 0 ? void 0 : _g.modelUploadId) !== null && _h !== void 0 ? _h : null });
                    if (customerPart.data && !itemData.customerPartId) {
                        newItemData.customerPartId = customerPart.data.customerPartId;
                        newItemData.customerPartRevision =
                            (_j = customerPart.data.customerPartRevision) !== null && _j !== void 0 ? _j : "";
                    }
                    setItemData(newItemData);
                    return [2 /*return*/];
            }
        });
    }); };
    var deleteDisclosure = (0, react_1.useDisclosure)();
    return (<>
      <react_1.ModalCardProvider type={type}>
        <react_1.ModalCard onClose={onClose} isCollapsible={isEditing} defaultCollapsed={false}>
          <react_1.ModalCardContent>
            <form_1.ValidatedForm defaultValues={initialValues} validator={sales_models_1.salesRfqLineValidator} method="post" action={isEditing
            ? path_1.path.to.salesRfqLine(rfqId, initialValues.id)
            : path_1.path.to.newSalesRFQLine(rfqId)} className="w-full" fetcher={fetcher} isDisabled={isEditing && isLocked} onSuccess={type === "modal" ? onClose : undefined}>
              <react_1.HStack className="w-full justify-between items-start">
                <react_1.ModalCardHeader>
                  <react_1.ModalCardTitle>
                    {isEditing
            ? "".concat(itemData === null || itemData === void 0 ? void 0 : itemData.customerPartId).concat((itemData === null || itemData === void 0 ? void 0 : itemData.customerPartRevision)
                ? ".".concat(itemData === null || itemData === void 0 ? void 0 : itemData.customerPartRevision)
                : "")
            : "New RFQ Line"}
                  </react_1.ModalCardTitle>
                  <react_1.ModalCardDescription>
                    {isEditing ? (<div className="flex flex-col items-start gap-1">
                        <span>{itemData === null || itemData === void 0 ? void 0 : itemData.description}</span>
                        <div className="flex items-center gap-2">
                          <react_1.Badge variant="outline">
                            {initialValues === null || initialValues === void 0 ? void 0 : initialValues.quantity.join(", ")}
                          </react_1.Badge>
                        </div>
                      </div>) : ("An RFQ line contains part and quantity information about the requested item")}
                  </react_1.ModalCardDescription>
                </react_1.ModalCardHeader>
                {isEditing &&
            permissions.can("update", "sales") &&
            !isLocked && (<react_1.CardAction className="pr-12">
                      <react_1.DropdownMenu>
                        <react_1.DropdownMenuTrigger asChild>
                          <react_1.IconButton icon={<bs_1.BsThreeDotsVertical />} aria-label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["More"], ["More"])))} variant="ghost"/>
                        </react_1.DropdownMenuTrigger>
                        <react_1.DropdownMenuContent align="end">
                          <react_1.DropdownMenuItem onClick={deleteDisclosure.onOpen}>
                            <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                            Delete Line
                          </react_1.DropdownMenuItem>
                        </react_1.DropdownMenuContent>
                      </react_1.DropdownMenu>
                    </react_1.CardAction>)}
              </react_1.HStack>
              <react_1.ModalCardBody>
                <Form_1.Hidden name="id"/>
                <Form_1.Hidden name="salesRfqId"/>
                <Form_1.Hidden name="order"/>
                <Form_1.Hidden name="modelUploadId" value={(_j = itemData.modelUploadId) !== null && _j !== void 0 ? _j : undefined}/>
                <react_1.VStack>
                  <div className="grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-3">
                    <div className="col-span-2 grid w-full gap-x-8 gap-y-4 grid-cols-1 lg:grid-cols-2 auto-rows-min">
                      <Form_1.InputControlled name="customerPartId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer Part Number"], ["Customer Part Number"])))} value={itemData.customerPartId} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { customerPartId: newValue })); });
        }} onBlur={function (e) { return onCustomerPartChange(e.target.value); }} autoFocus/>
                      <Form_1.InputControlled name="customerPartRevision" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Customer Part Revision"], ["Customer Part Revision"])))} value={itemData.customerPartRevision} onChange={function (newValue) {
            setItemData(function (d) { return (__assign(__assign({}, d), { customerPartRevision: newValue })); });
        }} onBlur={function (e) {
            return onCustomerPartRevisionChange(e.target.value);
        }}/>
                      <Form_1.Item name="itemId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Part"], ["Part"])))} type="Part" value={itemData.itemId} includeInactive locationId={(_l = (_k = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _k === void 0 ? void 0 : _k.locationId) !== null && _l !== void 0 ? _l : undefined} onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }}/>
                      <Form_1.InputControlled name="description" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Description"], ["Description"])))} value={itemData.description} isReadOnly={!!itemData.itemId}/>
                      <Form_1.UnitOfMeasure name="unitOfMeasureCode" value={itemData.unitOfMeasureCode} onChange={function (newValue) {
            return setItemData(function (d) {
                var _a;
                return (__assign(__assign({}, d), { unitOfMeasureCode: (_a = newValue === null || newValue === void 0 ? void 0 : newValue.value) !== null && _a !== void 0 ? _a : "EA" }));
            });
        }}/>

                      <Form_1.CustomFormFields table="salesRfqLine"/>
                    </div>
                    <div className="flex gap-y-4">
                      <Form_1.ArrayNumeric name="quantity" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Quantity"], ["Quantity"])))} defaults={[1, 25, 50, 100]}/>
                    </div>
                  </div>
                </react_1.VStack>
              </react_1.ModalCardBody>
              <react_1.ModalCardFooter>
                <Form_1.Submit isDisabled={isLocked ||
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
      {isEditing && deleteDisclosure.isOpen && (<DeleteSalesRFQLine_1.default line={initialValues} onCancel={deleteDisclosure.onClose}/>)}
    </>);
};
exports.default = SalesRFQLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
