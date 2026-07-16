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
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var Carousel_1 = require("@carbon/react/Carousel");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var Editable_1 = require("~/components/Editable");
var Form_1 = require("~/components/Form");
var Grid_1 = require("~/components/Grid");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var items_models_1 = require("../../items.models");
var SupplierPartForm = function (_a) {
    var _b, _c, _d;
    var initialValues = _a.initialValues, type = _a.type, unitOfMeasureCode = _a.unitOfMeasureCode, _e = _a.priceBreaks, initialPriceBreaks = _e === void 0 ? [] : _e, _f = _a.purchasingHistory, purchasingHistory = _f === void 0 ? [] : _f, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var company = (0, hooks_1.useUser)().company;
    var baseCurrency = (_b = company === null || company === void 0 ? void 0 : company.baseCurrencyCode) !== null && _b !== void 0 ? _b : "USD";
    var itemId = (0, react_router_1.useParams)().itemId;
    if (!itemId) {
        itemId = initialValues.itemId;
    }
    var _g = (0, react_2.useState)(initialValues.supplierUnitOfMeasureCode), purchaseUnitOfMeasure = _g[0], setPurchaseUnitOfMeasure = _g[1];
    var _h = (0, react_2.useState)(initialPriceBreaks.map(function (pb) { return ({
        quantity: pb.quantity,
        unitPrice: pb.unitPrice
    }); })), priceBreaks = _h[0], setPriceBreaks = _h[1];
    var hasInvalidPriceBreaks = priceBreaks.some(function (pb) { return pb.quantity <= 0 || pb.unitPrice <= 0; });
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "parts")
        : !permissions.can("create", "parts");
    var action = getAction(isEditing, type, itemId, initialValues.id);
    var fetcher = (0, react_router_1.useFetcher)();
    // biome-ignore lint/correctness/useExhaustiveDependencies: onClose must be excluded — it is a new ref each render in route components, which would cause an infinite re-fire loop
    (0, react_2.useEffect)(function () {
        var _a, _b, _c;
        if ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) {
            if ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.message)
                react_1.toast.success(fetcher.data.message);
            onClose();
        }
        else if ((_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.message) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_c = fetcher.data) === null || _c === void 0 ? void 0 : _c.success, (_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.message]);
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent size="md">
        <form_1.ValidatedForm defaultValues={initialValues} validator={items_models_1.supplierPartValidator} method="post" action={action} className="flex flex-col h-full" fetcher={fetcher}>
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Supplier Part"], ["Edit Supplier Part"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Supplier Part"], ["New Supplier Part"])))}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="itemId"/>
            <Form_1.Hidden name="priceBreaks" value={JSON.stringify(priceBreaks)}/>

            <react_1.VStack spacing={4}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                <Form_1.Supplier name="supplierId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier"], ["Supplier"])))}/>
                <Form_1.Input name="supplierPartId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Supplier Part ID"], ["Supplier Part ID"])))}/>
                <Form_1.Number name="unitPrice" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Unit Price"], ["Unit Price"])))} minValue={0} formatOptions={{
            style: "currency",
            currency: baseCurrency
        }}/>
                <Form_1.UnitOfMeasure name="supplierUnitOfMeasureCode" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Unit of Measure"], ["Unit of Measure"])))} onChange={function (value) {
            if (value)
                setPurchaseUnitOfMeasure(value.value);
        }}/>
                <Form_1.ConversionFactor name="conversionFactor" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Conversion Factor"], ["Conversion Factor"])))} inventoryCode={unitOfMeasureCode !== null && unitOfMeasureCode !== void 0 ? unitOfMeasureCode : undefined} purchasingCode={purchaseUnitOfMeasure}/>
                <Form_1.Number name="minimumOrderQuantity" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Minimum Order Quantity"], ["Minimum Order Quantity"])))} minValue={0}/>
                <Form_1.Number name="orderMultiple" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Order Multiple"], ["Order Multiple"])))} minValue={1}/>
                <Form_1.CustomFormFields table="partSupplier"/>
              </div>
              <PriceBreaks priceBreaks={priceBreaks} onChange={setPriceBreaks} baseCurrency={baseCurrency} isDisabled={isDisabled}/>
              <PurchaseHistory history={purchasingHistory} baseCurrency={baseCurrency}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled ||
            hasInvalidPriceBreaks ||
            fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} withBlocker={false}>
                Save
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                Cancel
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
function PurchaseHistory(_a) {
    var history = _a.history, baseCurrency = _a.baseCurrency;
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    if (history.length === 0)
        return null;
    return (<react_1.Card>
      <react_1.CardHeader>
        <react_1.CardTitle>
          <macro_1.Trans>Purchase History</macro_1.Trans>
        </react_1.CardTitle>
        <react_1.CardDescription>
          <span className="text-sm text-muted-foreground">
            {t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["", " orders"], ["", " orders"])), history.length)}
          </span>
        </react_1.CardDescription>
      </react_1.CardHeader>
      <react_1.CardContent>
        <Carousel_1.Carousel className="w-full">
          <Carousel_1.CarouselContent className="-ml-4">
            {history.map(function (line) {
            var _a;
            return (<Carousel_1.CarouselItem key={line.id} className="pl-4 basis-full lg:basis-1/2">
                <react_1.Card className="w-full p-0">
                  <react_1.CardContent className="p-4">
                    <react_1.HStack className="flex justify-between">
                      <react_router_1.Link to={path_1.path.to.purchaseOrder(line.purchaseOrderId)} className="text-sm font-medium hover:underline">
                        {line.purchaseOrder.purchaseOrderId}
                      </react_router_1.Link>
                      <span className="text-xs text-muted-foreground">
                        {line.purchaseOrder.orderDate
                    ? formatDate(line.purchaseOrder.orderDate)
                    : "—"}
                      </span>
                    </react_1.HStack>
                    <div className="my-4">
                      <react_1.Table>
                        <react_1.Thead>
                          <react_1.Tr className="border-b border-border">
                            <react_1.Th>
                              <span className="font-medium">Quantity</span>
                            </react_1.Th>
                            <react_1.Th>
                              <span className="font-medium">Price</span>
                            </react_1.Th>
                          </react_1.Tr>
                        </react_1.Thead>
                        <react_1.Tbody>
                          <react_1.Tr>
                            <react_1.Td>{line.purchaseQuantity}</react_1.Td>
                            <react_1.Td>
                              {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: baseCurrency
                }).format((_a = line.unitPrice) !== null && _a !== void 0 ? _a : 0)}
                            </react_1.Td>
                          </react_1.Tr>
                        </react_1.Tbody>
                      </react_1.Table>
                    </div>
                  </react_1.CardContent>
                </react_1.Card>
              </Carousel_1.CarouselItem>);
        })}
          </Carousel_1.CarouselContent>
          {history.length > 1 && (<div className="flex justify-between mt-4">
              <Carousel_1.CarouselPrevious />
              <Carousel_1.CarouselNext />
            </div>)}
        </Carousel_1.Carousel>
      </react_1.CardContent>
    </react_1.Card>);
}
function PriceBreaks(_a) {
    var _this = this;
    var priceBreaks = _a.priceBreaks, onChange = _a.onChange, baseCurrency = _a.baseCurrency, isDisabled = _a.isDisabled;
    var t = (0, macro_1.useLingui)().t;
    var formatter = (0, hooks_1.useCurrencyFormatter)();
    var removeRow = (0, react_2.useCallback)(function (index) {
        onChange(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    }, [onChange]);
    var addRow = (0, react_2.useCallback)(function () {
        onChange(function (prev) { return __spreadArray(__spreadArray([], prev, true), [{ quantity: 0, unitPrice: 0 }], false); });
    }, [onChange]);
    var noOpMutation = (0, react_2.useCallback)(function (_accessorKey, _newValue, _row) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ({
                    data: null,
                    error: null,
                    count: null,
                    status: 200,
                    statusText: "OK"
                })];
        });
    }); }, []);
    var editableComponents = (0, react_2.useMemo)(function () { return ({
        quantity: (0, Editable_1.EditableNumber)(noOpMutation),
        unitPrice: (0, Editable_1.EditableNumber)(noOpMutation, {
            formatOptions: { style: "currency", currency: baseCurrency }
        })
    }); }, [noOpMutation, baseCurrency]);
    var columns = (0, react_2.useMemo)(function () { return [
        {
            accessorKey: "quantity",
            header: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Quantity"], ["Quantity"]))),
            cell: function (_a) {
                var row = _a.row;
                return (<react_1.HStack className="justify-between min-w-[80px]">
            <span>{row.original.quantity}</span>
            {!isDisabled && (<div className="relative w-6 h-5">
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Price break actions"], ["Price break actions"])))} icon={<lu_1.LuEllipsisVertical />} size="md" className="absolute right-[-1px] top-[-6px]" variant="ghost" onClick={function (e) { return e.stopPropagation(); }}/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    <react_1.DropdownMenuItem onClick={function () { return removeRow(row.index); }} destructive>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                      Delete Price Break
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </div>)}
          </react_1.HStack>);
            }
        },
        {
            accessorKey: "unitPrice",
            header: t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Unit Price"], ["Unit Price"]))),
            cell: function (_a) {
                var row = _a.row;
                return formatter.format(row.original.unitPrice);
            }
        }
    ]; }, [isDisabled, removeRow, formatter, t]);
    return (<div className="space-y-3 w-full">
      <span className="font-medium text-sm">Price Breaks</span>
      <Grid_1.default data={priceBreaks} columns={columns} canEdit={!isDisabled} editableComponents={editableComponents} onDataChange={onChange} onNewRow={!isDisabled ? addRow : undefined} contained={false}/>
    </div>);
}
exports.default = SupplierPartForm;
function getAction(isEditing, type, itemId, id) {
    if (type === "Part") {
        if (isEditing) {
            return path_1.path.to.partSupplier(itemId, id);
        }
        else {
            return path_1.path.to.newPartSupplier(itemId);
        }
    }
    if (type === "Service") {
        if (isEditing) {
            return path_1.path.to.serviceSupplier(itemId, id);
        }
        else {
            return path_1.path.to.newServiceSupplier(itemId);
        }
    }
    if (type === "Tool") {
        if (isEditing) {
            return path_1.path.to.toolSupplier(itemId, id);
        }
        else {
            return path_1.path.to.newToolSupplier(itemId);
        }
    }
    if (type === "Consumable") {
        if (isEditing) {
            return path_1.path.to.consumableSupplier(itemId, id);
        }
        else {
            return path_1.path.to.newConsumableSupplier(itemId);
        }
    }
    if (type === "Material") {
        if (isEditing) {
            return path_1.path.to.materialSupplier(itemId, id);
        }
        else {
            return path_1.path.to.newMaterialSupplier(itemId);
        }
    }
    throw new Error("Invalid type");
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
