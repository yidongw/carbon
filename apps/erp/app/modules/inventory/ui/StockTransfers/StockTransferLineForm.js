"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var StockTransferLineForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, locationId = _a.locationId, _d = _a.open, open = _d === void 0 ? true : _d, _e = _a.type, type = _e === void 0 ? "drawer" : _e, onClose = _a.onClose;
    var id = (0, react_router_1.useParams)().id;
    if (!id)
        throw new Error("id not found");
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.stockTransfer(id));
    var fetcher = (0, react_router_1.useFetcher)();
    var items = (0, items_1.useItems)()[0];
    var _f = (0, react_2.useState)((_b = initialValues.itemId) !== null && _b !== void 0 ? _b : null), itemId = _f[0], setItemId = _f[1];
    var _g = (0, react_2.useState)(function () {
        var _a, _b;
        if (initialValues.itemId) {
            return ((_b = (_a = items.find(function (item) { return item.id === initialValues.itemId; })) === null || _a === void 0 ? void 0 : _a.type) !== null && _b !== void 0 ? _b : "Item");
        }
        return "Item";
    }), itemType = _g[0], setItemType = _g[1];
    var _h = (0, react_2.useState)(function () {
        var _a, _b;
        if (initialValues.itemId) {
            return ((_b = (_a = items.find(function (item) { return item.id === initialValues.itemId; })) === null || _a === void 0 ? void 0 : _a.itemTrackingType) !== null && _b !== void 0 ? _b : null);
        }
        return null;
    }), itemTrackingType = _h[0], setItemTrackingType = _h[1];
    var onTypeChange = function (t) {
        setItemType(t);
        setItemId(null);
    };
    var onItemChange = function (itemId) {
        var _a, _b;
        setItemId(itemId);
        var item = items.find(function (item) { return item.id === itemId; });
        var itemType = (_a = item === null || item === void 0 ? void 0 : item.type) !== null && _a !== void 0 ? _a : "Item";
        var trackingType = (_b = item === null || item === void 0 ? void 0 : item.itemTrackingType) !== null && _b !== void 0 ? _b : null;
        setItemType(itemType);
        setItemTrackingType(trackingType);
    };
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created stock transfer line"], ["Created stock transfer line"]))));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create stock transfer line: ", ""], ["Failed to create stock transfer line: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, type, t]);
    var isEditing = initialValues.id !== undefined;
    var isLocked = (0, inventory_1.isStockTransferLocked)((_c = routeData === null || routeData === void 0 ? void 0 : routeData.stockTransfer) === null || _c === void 0 ? void 0 : _c.status);
    var isDisabled = isLocked ||
        (isEditing
            ? !permissions.can("update", "inventory")
            : !permissions.can("create", "inventory"));
    return (<react_1.ModalDrawerProvider type={type}>
      <react_1.ModalDrawer open={open} onOpenChange={function (open) {
            if (!open)
                onClose === null || onClose === void 0 ? void 0 : onClose();
        }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={inventory_1.stockTransferLineValidator} method="post" action={isEditing
            ? path_1.path.to.stockTransferLine(id, initialValues.id)
            : path_1.path.to.newStockTransferLine(id)} defaultValues={initialValues} fetcher={fetcher} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Edit Line"], ["Edit Line"]))) : t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["New Line"], ["New Line"])))}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="stockTransferId"/>
              <Form_1.Hidden name="requiresSerialTracking" value={itemTrackingType === "Serial" ? "true" : "false"}/>
              <Form_1.Hidden name="requiresBatchTracking" value={itemTrackingType === "Batch" ? "true" : "false"}/>
              <react_1.VStack spacing={4}>
                <Form_1.Item name="itemId" label={itemType} 
    // @ts-ignore
    type={itemType} locationId={locationId} onTypeChange={onTypeChange} onChange={function (value) {
            onItemChange(value === null || value === void 0 ? void 0 : value.value);
        }} value={itemId !== null && itemId !== void 0 ? itemId : undefined}/>
                <Form_1.Number name="quantity" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Quantity"], ["Quantity"])))} minValue={itemTrackingType === "Serial" ? 1 : 0} maxValue={itemTrackingType === "Serial" ? 1 : undefined} defaultValue={itemTrackingType === "Serial" ? 1 : undefined}/>
                <Form_1.StorageUnit name="fromStorageUnitId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["From Storage Unit"], ["From Storage Unit"])))} locationId={locationId} itemId={itemId !== null && itemId !== void 0 ? itemId : undefined}/>
                <Form_1.StorageUnit name="toStorageUnitId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["To Storage Unit"], ["To Storage Unit"])))} locationId={locationId} itemId={itemId !== null && itemId !== void 0 ? itemId : undefined}/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
};
exports.default = StockTransferLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
