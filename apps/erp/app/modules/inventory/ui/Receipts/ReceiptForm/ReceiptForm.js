"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var AuditLog_1 = require("~/components/AuditLog");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var path_1 = require("~/utils/path");
var useReceiptForm_1 = require("./useReceiptForm");
var formId = "receipt-form";
var ReceiptForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    var initialValues = _a.initialValues, status = _a.status, receiptLines = _a.receiptLines;
    var receiptId = (0, react_router_1.useParams)().receiptId;
    if (!receiptId)
        throw new Error("receiptId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.receipt(receiptId));
    var company = (0, hooks_1.useUser)().company;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var _u = (0, useReceiptForm_1.default)({ status: status, initialValues: initialValues }), locationId = _u.locationId, sourceDocuments = _u.sourceDocuments, supplierId = _u.supplierId, setLocationId = _u.setLocationId, setSourceDocument = _u.setSourceDocument;
    var postModal = (0, react_1.useDisclosure)();
    var voidModal = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _v = (0, AuditLog_1.useAuditLog)({
        entityType: "receipt",
        entityId: receiptId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _v.trigger, auditLogDrawer = _v.drawer;
    var isPosted = status === "Posted";
    var isVoided = status === "Voided";
    var isInvoiced = ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _b === void 0 ? void 0 : _b.invoiced) === true;
    var isEditing = initialValues.id !== undefined;
    var hasReceivableFaLines = ((_c = routeData === null || routeData === void 0 ? void 0 : routeData.fixedAssetLines) !== null && _c !== void 0 ? _c : []).some(function (line) { return line.received; });
    var canPost = (receiptLines.length > 0 &&
        receiptLines.some(function (line) { var _a; return ((_a = line.receivedQuantity) !== null && _a !== void 0 ? _a : 0) !== 0; })) ||
        hasReceivableFaLines;
    var receiptLineTracking = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.receiptLineTracking) !== null && _d !== void 0 ? _d : [];
    var canInvoice = isPosted &&
        !isInvoiced &&
        ((_e = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _e === void 0 ? void 0 : _e.sourceDocument) === "Purchase Order" &&
        ((_f = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _f === void 0 ? void 0 : _f.sourceDocumentId) &&
        permissions.can("create", "invoicing");
    return (<>
      <react_1.Card>
        <form_1.ValidatedForm id={formId} validator={inventory_1.receiptValidator} method="post" action={path_1.path.to.receiptDetails(initialValues.id)} defaultValues={initialValues} style={{ width: "100%" }}>
          <components_1.DocumentHeader title={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _g === void 0 ? void 0 : _g.receiptId) !== null && _h !== void 0 ? _h : ""} status={<inventory_1.ReceiptStatus status={status}/>} menuItems={<>
                {auditLogTrigger}
                {isPosted && (<>
                    <react_1.DropdownMenuSeparator />
                    <react_1.DropdownMenuItem disabled={isVoided ||
                    isInvoiced ||
                    !permissions.can("update", "inventory")} destructive onClick={voidModal.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTicketX />}/>
                      <macro_1.Trans>Void</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                  </>)}
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={!permissions.can("delete", "inventory") ||
                !permissions.is("employee")} destructive onClick={deleteDisclosure.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </>} actions={<>
                {receiptLineTracking.length > 0 && (<components_1.PrintButton sourceDocument="Receipt" sourceDocumentId={receiptId} locationId={locationId !== null && locationId !== void 0 ? locationId : undefined} context="receiving" fileRoutes={{
                    pdf: path_1.path.to.file.receiptLabelsPdf,
                    zpl: path_1.path.to.file.receiptLabelsZpl
                }}/>)}
                <SourceDocumentLink sourceDocument={(_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _j === void 0 ? void 0 : _j.sourceDocument) !== null && _k !== void 0 ? _k : undefined} sourceDocumentId={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _l === void 0 ? void 0 : _l.sourceDocumentId) !== null && _m !== void 0 ? _m : undefined} sourceDocumentReadableId={(_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _o === void 0 ? void 0 : _o.sourceDocumentReadableId) !== null && _p !== void 0 ? _p : undefined}/>
                <react_1.Button variant={canInvoice ? "primary" : "secondary"} isDisabled={!canInvoice} leftIcon={<lu_1.LuCreditCard />} asChild>
                  <react_router_1.Link to={"".concat(path_1.path.to.newPurchaseInvoice, "?sourceDocument=Purchase Order&sourceDocumentId=").concat((_q = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _q === void 0 ? void 0 : _q.sourceDocumentId)}>
                    <macro_1.Trans>Invoice</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>
                <react_1.Button variant={canPost && !isPosted ? "primary" : "secondary"} onClick={postModal.onOpen} isDisabled={!canPost || isPosted || !permissions.is("employee")} leftIcon={<lu_1.LuCheckCheck />}>
                  <macro_1.Trans>Post</macro_1.Trans>
                </react_1.Button>
              </>}/>

          <react_1.CardContent>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="supplierId" value={supplierId !== null && supplierId !== void 0 ? supplierId : ""}/>
            <react_1.VStack spacing={4} className="min-h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
                <Form_1.Input name="receiptId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Receipt ID"], ["Receipt ID"])))} isReadOnly/>
                <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"])))} value={locationId !== null && locationId !== void 0 ? locationId : undefined} onChange={function (newValue) {
            if (newValue)
                setLocationId(newValue.value);
        }} isReadOnly={isPosted}/>
                <Form_1.Select name="sourceDocument" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Source Document"], ["Source Document"])))} options={inventory_1.receiptSourceDocumentType.map(function (v) { return ({
            label: v,
            value: v
        }); })} onChange={function (newValue) {
            if (newValue) {
                setSourceDocument(newValue.value);
            }
        }} isReadOnly={isPosted}/>
                <Form_1.Combobox name="sourceDocumentId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Source Document ID"], ["Source Document ID"])))} options={sourceDocuments.map(function (d) { return ({
            label: d.name,
            value: d.id
        }); })} isReadOnly={isPosted}/>
                <Form_1.Input name="externalDocumentId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["External Reference"], ["External Reference"])))} isDisabled={isPosted}/>
                <Form_1.CustomFormFields table="receipt"/>
              </div>
            </react_1.VStack>
          </react_1.CardContent>
          <react_1.CardFooter>
            <form_1.DefaultDisabledSubmit formId={formId} isDisabled={isEditing
            ? !permissions.can("update", "inventory")
            : !permissions.can("create", "inventory")}>
              <macro_1.Trans>Save</macro_1.Trans>
            </form_1.DefaultDisabledSubmit>
          </react_1.CardFooter>
        </form_1.ValidatedForm>
      </react_1.Card>

      {postModal.isOpen && <inventory_1.ReceiptPostModal onClose={postModal.onClose}/>}
      {voidModal.isOpen && <inventory_1.ReceiptVoidModal onClose={voidModal.onClose}/>}
      {deleteDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteReceipt(receiptId)} isOpen={deleteDisclosure.isOpen} name={(_s = (_r = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _r === void 0 ? void 0 : _r.receiptId) !== null && _s !== void 0 ? _s : "receipt"} text={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_t = routeData === null || routeData === void 0 ? void 0 : routeData.receipt) === null || _t === void 0 ? void 0 : _t.receiptId)} onCancel={function () {
                deleteDisclosure.onClose();
            }} onSubmit={function () {
                deleteDisclosure.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
};
function SourceDocumentLink(_a) {
    var sourceDocument = _a.sourceDocument, sourceDocumentId = _a.sourceDocumentId, sourceDocumentReadableId = _a.sourceDocumentReadableId;
    var permissions = (0, hooks_1.usePermissions)();
    if (!sourceDocument || !sourceDocumentId || !sourceDocumentReadableId)
        return null;
    switch (sourceDocument) {
        case "Purchase Order":
            if (!permissions.can("view", "purchasing"))
                return null;
            return (<react_1.Button variant="secondary" leftIcon={<lu_1.LuShoppingCart />} asChild>
          <react_router_1.Link to={path_1.path.to.purchaseOrderDetails(sourceDocumentId)}>
            <macro_1.Trans>Purchase Order</macro_1.Trans>
          </react_router_1.Link>
        </react_1.Button>);
        case "Purchase Invoice":
            if (!permissions.can("view", "invoicing"))
                return null;
            return (<react_1.Button variant="secondary" leftIcon={<lu_1.LuCreditCard />} asChild>
          <react_router_1.Link to={path_1.path.to.purchaseInvoice(sourceDocumentId)}>
            <macro_1.Trans>Purchase Invoice</macro_1.Trans>
          </react_router_1.Link>
        </react_1.Button>);
        case "Inbound Transfer":
            if (!permissions.can("view", "inventory"))
                return null;
            return (<react_1.Button variant="secondary" leftIcon={<lu_1.LuTruck />} asChild>
          <react_router_1.Link to={path_1.path.to.warehouseTransferDetails(sourceDocumentId)}>
            <macro_1.Trans>Warehouse Transfer</macro_1.Trans>
          </react_router_1.Link>
        </react_1.Button>);
        default:
            return null;
    }
}
exports.default = ReceiptForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
