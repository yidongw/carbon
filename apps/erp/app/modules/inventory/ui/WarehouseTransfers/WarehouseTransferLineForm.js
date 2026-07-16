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
var zod_1 = require("zod");
var zod_form_data_1 = require("zod-form-data");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var items_1 = require("~/stores/items");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var warehouseTransferLineFormValidator = zod_1.z.discriminatedUnion("type", [
    zod_1.z.object({
        id: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        type: zod_1.z.literal("create"),
        transferId: zod_1.z.string().min(1),
        fromLocationId: zod_1.z.string().min(1),
        toLocationId: zod_1.z.string().min(1),
        itemId: zod_1.z.string().min(1),
        quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001)),
        fromStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        toStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    }),
    zod_1.z.object({
        type: zod_1.z.literal("update"),
        id: zod_1.z.string().min(1),
        transferId: zod_1.z.string().min(1),
        itemId: zod_1.z.string().min(1),
        fromLocationId: zod_1.z.string().min(1),
        toLocationId: zod_1.z.string().min(1),
        quantity: zod_form_data_1.zfd.numeric(zod_1.z.number().min(0.0001)),
        fromStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        toStorageUnitId: zod_form_data_1.zfd.text(zod_1.z.string().optional()),
        notes: zod_form_data_1.zfd.text(zod_1.z.string().optional())
    })
]);
var WarehouseTransferLineForm = function (_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues, warehouseTransfer = _a.warehouseTransfer, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var transferId = (0, react_router_1.useParams)().transferId;
    if (!transferId) {
        throw new Error("transferId is required");
    }
    var _f = (0, react_2.useState)(initialValues.type === "update" ? initialValues.itemId : ""), itemId = _f[0], setItemId = _f[1];
    var items = (0, items_1.useItems)()[0];
    var _g = (0, react_2.useState)(
    // @ts-expect-error - Service
    (_c = (_b = items.find(function (item) { return item.id === initialValues.itemId; })) === null || _b === void 0 ? void 0 : _b.type) !== null && _c !== void 0 ? _c : "Item"), itemType = _g[0], setItemType = _g[1];
    var isEditing = initialValues.id !== undefined;
    var isLocked = (0, inventory_models_1.isWarehouseTransferLocked)(warehouseTransfer.status);
    var isDisabled = isLocked ||
        (isEditing
            ? !permissions.can("update", "inventory")
            : !permissions.can("create", "inventory"));
    var action = initialValues.id
        ? path_1.path.to.warehouseTransferLine(transferId, initialValues.id)
        : path_1.path.to.newWarehouseTransferLine(transferId);
    var fetcher = (0, react_router_1.useFetcher)();
    (0, react_2.useEffect)(function () {
        var _a;
        if (((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.success) === false) {
            react_1.toast.error(fetcher.data.message);
        }
    }, [(_d = fetcher.data) === null || _d === void 0 ? void 0 : _d.success, (_e = fetcher.data) === null || _e === void 0 ? void 0 : _e.message]);
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm defaultValues={initialValues} validator={warehouseTransferLineFormValidator} method="post" action={action} className="flex flex-col h-full" fetcher={fetcher} isDisabled={isDisabled}>
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Edit Transfer Line"], ["Edit Transfer Line"]))) : t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["New Transfer Line"], ["New Transfer Line"])))}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="transferId"/>
            <Form_1.Hidden name="fromLocationId"/>
            <Form_1.Hidden name="toLocationId"/>
            <Form_1.Hidden name="type" value={isEditing ? "update" : "create"}/>

            <react_1.VStack spacing={4}>
              <Form_1.Item name="itemId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Item"], ["Item"])))} type={itemType} locationId={warehouseTransfer.fromLocationId} onTypeChange={function (t) { return setItemType(t); }} value={itemId} onChange={function (value) {
            setItemId(value === null || value === void 0 ? void 0 : value.value);
        }}/>
              <Form_1.Number name="quantity" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Quantity"], ["Quantity"])))} minValue={0.0001} step={0.0001}/>
              <Form_1.StorageUnit name="fromStorageUnitId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["From Storage Unit"], ["From Storage Unit"])))} itemId={itemId !== null && itemId !== void 0 ? itemId : undefined} locationId={warehouseTransfer.fromLocationId}/>
              <Form_1.StorageUnit name="toStorageUnitId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["To Storage Unit"], ["To Storage Unit"])))} itemId={itemId !== null && itemId !== void 0 ? itemId : undefined} locationId={warehouseTransfer.toLocationId}/>
              <Form_1.TextArea name="notes" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Notes"], ["Notes"])))} rows={3}/>
              <Form_1.CustomFormFields table="warehouseTransferLine"/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled || fetcher.state !== "idle"} isLoading={fetcher.state !== "idle"} withBlocker={false}>
                Save
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = WarehouseTransferLineForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
