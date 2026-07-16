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
var lu_1 = require("react-icons/lu");
var ri_1 = require("react-icons/ri");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var AuditLog_1 = require("~/components/AuditLog");
var Form_1 = require("~/components/Form");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var inventory_1 = require("~/modules/inventory");
var SalesInvoiceStatus_1 = require("~/modules/invoicing/ui/SalesInvoice/SalesInvoiceStatus");
var path_1 = require("~/utils/path");
var ShipmentPostModal_1 = require("../ShipmentPostModal");
var ShipmentStatus_1 = require("../ShipmentStatus");
var ShipmentVoidModal_1 = require("../ShipmentVoidModal");
var useShipmentForm_1 = require("./useShipmentForm");
var formId = "shipment-form";
var ShipmentForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var initialValues = _a.initialValues, status = _a.status, shipmentLines = _a.shipmentLines;
    var shipmentId = (0, react_router_1.useParams)().shipmentId;
    if (!shipmentId)
        throw new Error("shipmentId not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.shipment(shipmentId));
    var company = (0, hooks_1.useUser)().company;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var t = (0, macro_1.useLingui)().t;
    var _r = (0, useShipmentForm_1.default)({ status: status, initialValues: initialValues }), locationId = _r.locationId, sourceDocuments = _r.sourceDocuments, customerId = _r.customerId, setLocationId = _r.setLocationId, setSourceDocument = _r.setSourceDocument;
    var postModal = (0, react_1.useDisclosure)();
    var voidModal = (0, react_1.useDisclosure)();
    var deleteDisclosure = (0, react_1.useDisclosure)();
    var _s = (0, AuditLog_1.useAuditLog)({
        entityType: "shipment",
        entityId: shipmentId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _s.trigger, auditLogDrawer = _s.drawer;
    var isPosted = status === "Posted";
    var isVoided = status === "Voided";
    var isEditing = initialValues.id !== undefined;
    var hasShippableFaLines = ((_b = routeData === null || routeData === void 0 ? void 0 : routeData.fixedAssetLines) !== null && _b !== void 0 ? _b : []).some(function (line) { return line.shipped; });
    var canPost = (shipmentLines.length > 0 &&
        shipmentLines.some(function (line) { var _a; return ((_a = line.shippedQuantity) !== null && _a !== void 0 ? _a : 0) !== 0; })) ||
        hasShippableFaLines;
    var shipmentLineTracking = (_c = routeData === null || routeData === void 0 ? void 0 : routeData.shipmentLineTracking) !== null && _c !== void 0 ? _c : [];
    var hasTrackingLabels = shipmentLineTracking.length > 0;
    var createInvoice = function (shipment) {
        if (!shipment)
            return;
        navigate("".concat(path_1.path.to.newSalesInvoice, "?sourceDocument=Shipment&sourceDocumentId=").concat(shipmentId));
    };
    return (<>
      <react_1.Card>
        <form_1.ValidatedForm id={formId} validator={inventory_1.shipmentValidator} method="post" action={path_1.path.to.shipmentDetails(initialValues.id)} defaultValues={initialValues} style={{ width: "100%" }}>
          <components_1.DocumentHeader title={(_e = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _d === void 0 ? void 0 : _d.shipmentId) !== null && _e !== void 0 ? _e : ""} status={<ShipmentStatus_1.default status={status} invoiced={(_f = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _f === void 0 ? void 0 : _f.invoiced}/>} menuItems={<>
                {auditLogTrigger}
                {(isPosted || isVoided) && (<>
                    <react_1.DropdownMenuSeparator />
                    <react_1.DropdownMenuItem disabled={isVoided || !permissions.is("employee")} destructive onClick={voidModal.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTicketX />}/>
                      <macro_1.Trans>Void</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                  </>)}
                <react_1.DropdownMenuSeparator />
                <react_1.DropdownMenuItem disabled={!permissions.can("delete", "inventory") ||
                !permissions.is("employee")} destructive onClick={deleteDisclosure.onOpen}>
                  <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                  <macro_1.Trans>Delete Shipment</macro_1.Trans>
                </react_1.DropdownMenuItem>
              </>} actions={<>
                {hasTrackingLabels && (<components_1.PrintButton sourceDocument="Shipment" sourceDocumentId={shipmentId} locationId={locationId !== null && locationId !== void 0 ? locationId : undefined} context="shipping" fileRoutes={{
                    pdf: path_1.path.to.file.shipmentLabelsPdf,
                    zpl: path_1.path.to.file.shipmentLabelsZpl
                }}/>)}
                <react_1.Button variant="secondary" leftIcon={<lu_1.LuBarcode />} asChild>
                  <a target="_blank" href={path_1.path.to.file.shipment(shipmentId)} rel="noreferrer">
                    <macro_1.Trans>Packing Slip</macro_1.Trans>
                  </a>
                </react_1.Button>
                <SourceDocumentLink sourceDocument={(_h = (_g = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _g === void 0 ? void 0 : _g.sourceDocument) !== null && _h !== void 0 ? _h : undefined} sourceDocumentId={(_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _j === void 0 ? void 0 : _j.sourceDocumentId) !== null && _k !== void 0 ? _k : undefined} sourceDocumentReadableId={(_m = (_l = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _l === void 0 ? void 0 : _l.sourceDocumentReadableId) !== null && _m !== void 0 ? _m : undefined}/>
                {permissions.can("view", "invoicing") && (<InvoiceButtons shipment={routeData === null || routeData === void 0 ? void 0 : routeData.shipment} relatedItems={routeData === null || routeData === void 0 ? void 0 : routeData.relatedItems} shipmentId={shipmentId} isPosted={isPosted} isVoided={isVoided} onCreateInvoice={createInvoice}/>)}
                <react_1.Button variant={!isPosted && !isVoided ? "primary" : "secondary"} onClick={postModal.onOpen} isDisabled={!canPost ||
                isPosted ||
                isVoided ||
                !permissions.is("employee")} leftIcon={<lu_1.LuCheckCheck />}>
                  <macro_1.Trans>Post</macro_1.Trans>
                </react_1.Button>
              </>}/>

          <react_1.CardContent>
            <Form_1.Hidden name="id"/>
            <Form_1.Hidden name="customerId" value={customerId !== null && customerId !== void 0 ? customerId : ""}/>
            <react_1.VStack spacing={4} className="min-h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
                <Form_1.Input name="shipmentId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Shipment ID"], ["Shipment ID"])))} isReadOnly/>
                <Form_1.Location name="locationId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Location"], ["Location"])))} value={locationId !== null && locationId !== void 0 ? locationId : undefined} onChange={function (newValue) {
            if (newValue)
                setLocationId(newValue.value);
        }} isReadOnly={isPosted}/>
                <Form_1.Select name="sourceDocument" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Source Document"], ["Source Document"])))} options={inventory_1.shipmentSourceDocumentType.map(function (v) { return ({
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
                <Form_1.Input name="trackingNumber" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Tracking Number"], ["Tracking Number"])))}/>
                <Form_1.ShippingMethod name="shippingMethodId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Shipping Method"], ["Shipping Method"])))}/>
                <Form_1.CustomFormFields table="shipment"/>
              </div>
            </react_1.VStack>
          </react_1.CardContent>
          <react_1.CardFooter>
            <Form_1.DefaultDisabledSubmit formId={formId} isDisabled={isEditing
            ? !permissions.can("update", "inventory")
            : !permissions.can("create", "inventory")}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.DefaultDisabledSubmit>
          </react_1.CardFooter>
        </form_1.ValidatedForm>
      </react_1.Card>

      {postModal.isOpen && <ShipmentPostModal_1.default onClose={postModal.onClose}/>}
      {voidModal.isOpen && <ShipmentVoidModal_1.default onClose={voidModal.onClose}/>}
      {deleteDisclosure.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteShipment(shipmentId)} isOpen={deleteDisclosure.isOpen} name={(_p = (_o = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _o === void 0 ? void 0 : _o.shipmentId) !== null && _p !== void 0 ? _p : "shipment"} text={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_q = routeData === null || routeData === void 0 ? void 0 : routeData.shipment) === null || _q === void 0 ? void 0 : _q.shipmentId)} onCancel={function () {
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
        case "Sales Order":
            if (!permissions.can("view", "sales"))
                return null;
            return (<react_1.Button variant="secondary" leftIcon={<ri_1.RiProgress8Line />} asChild>
          <react_router_1.Link to={path_1.path.to.salesOrderDetails(sourceDocumentId)}>
            <macro_1.Trans>Sales Order</macro_1.Trans>
          </react_router_1.Link>
        </react_1.Button>);
        case "Purchase Order":
            if (!permissions.can("view", "purchasing"))
                return null;
            return (<react_1.Button variant="secondary" leftIcon={<lu_1.LuShoppingCart />} asChild>
          <react_router_1.Link to={path_1.path.to.purchaseOrderDetails(sourceDocumentId)}>
            <macro_1.Trans>Purchase Order</macro_1.Trans>
          </react_router_1.Link>
        </react_1.Button>);
        case "Outbound Transfer":
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
function InvoiceButtons(_a) {
    var shipment = _a.shipment, relatedItems = _a.relatedItems, shipmentId = _a.shipmentId, isPosted = _a.isPosted, isVoided = _a.isVoided, onCreateInvoice = _a.onCreateInvoice;
    if (!shipment)
        return null;
    if (shipment.sourceDocument === "Sales Order") {
        return (<react_2.Suspense fallback={<react_1.Button leftIcon={<lu_1.LuCreditCard />} variant="secondary" isLoading>
            Loading...
          </react_1.Button>}>
        <react_router_1.Await resolve={relatedItems}>
          {function (resolved) {
                var invoices = (resolved === null || resolved === void 0 ? void 0 : resolved.invoices) || [];
                return invoices.length > 0 ? (invoices.length === 1 && invoices[0].shipmentId === shipmentId ? (<react_1.Button leftIcon={<lu_1.LuCreditCard />} variant="secondary" isDisabled={!isPosted} asChild>
                  <react_router_1.Link to={path_1.path.to.salesInvoice(invoices[0].id)}>
                    <macro_1.Trans>Invoice</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>) : (<react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.Button leftIcon={<lu_1.LuCreditCard />} rightIcon={<lu_1.LuChevronDown />} variant="secondary">
                      <macro_1.Trans>Invoice</macro_1.Trans>
                    </react_1.Button>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent align="end">
                    <react_1.DropdownMenuItem disabled={!isPosted} onClick={function () { return onCreateInvoice(shipment); }}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                      <macro_1.Trans>New Invoice</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                    <react_1.DropdownMenuSeparator />
                    {invoices.map(function (inv) { return (<react_1.DropdownMenuItem key={inv.id} asChild>
                        <react_router_1.Link to={path_1.path.to.salesInvoice(inv.id)}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuCreditCard />}/>
                          <react_1.HStack spacing={8}>
                            <span>{inv.invoiceId}</span>
                            <SalesInvoiceStatus_1.default status={inv.status}/>
                          </react_1.HStack>
                        </react_router_1.Link>
                      </react_1.DropdownMenuItem>); })}
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>)) : (<react_1.Button leftIcon={<lu_1.LuCreditCard />} variant={isPosted && !isVoided ? "primary" : "secondary"} isDisabled={!isPosted} onClick={function () { return onCreateInvoice(shipment); }}>
                <macro_1.Trans>Invoice</macro_1.Trans>
              </react_1.Button>);
            }}
        </react_router_1.Await>
      </react_2.Suspense>);
    }
    if (shipment.sourceDocument === "Sales Invoice") {
        return (<react_2.Suspense fallback={<react_1.Button leftIcon={<lu_1.LuCreditCard />} variant="secondary" isLoading>
            Loading...
          </react_1.Button>}>
        <react_router_1.Await resolve={relatedItems}>
          {function (resolved) {
                var invoices = (resolved === null || resolved === void 0 ? void 0 : resolved.invoices) || [];
                if (invoices.length === 0) {
                    return (<react_1.Button variant="secondary" leftIcon={<lu_1.LuCreditCard />} asChild>
                  <react_router_1.Link to={path_1.path.to.salesInvoice(shipment.sourceDocumentId)}>
                    <macro_1.Trans>Invoice</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>);
                }
                else if (invoices.length === 1) {
                    return (<react_1.Button variant="secondary" leftIcon={<lu_1.LuCreditCard />} asChild>
                  <react_router_1.Link to={path_1.path.to.salesInvoice(invoices[0].id)}>
                    <macro_1.Trans>Invoice</macro_1.Trans>
                  </react_router_1.Link>
                </react_1.Button>);
                }
                else {
                    return (<react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.Button leftIcon={<lu_1.LuCreditCard />} rightIcon={<lu_1.LuChevronDown />} variant="secondary">
                      <macro_1.Trans>Invoices</macro_1.Trans>
                    </react_1.Button>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent align="end">
                    {invoices.map(function (inv) { return (<react_1.DropdownMenuItem key={inv.id} asChild>
                        <react_router_1.Link to={path_1.path.to.salesInvoice(inv.id)}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuCreditCard />}/>
                          <react_1.HStack spacing={8}>
                            <span>{inv.invoiceId}</span>
                            <SalesInvoiceStatus_1.default status={inv.status}/>
                          </react_1.HStack>
                        </react_router_1.Link>
                      </react_1.DropdownMenuItem>); })}
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>);
                }
            }}
        </react_router_1.Await>
      </react_2.Suspense>);
    }
    return null;
}
exports.default = ShipmentForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7;
