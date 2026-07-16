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
var storage_rules_1 = require("@carbon/ee/storage-rules");
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var react_router_1 = require("react-router");
var components_1 = require("~/components");
var AuditLog_1 = require("~/components/AuditLog");
var Form_1 = require("~/components/Form");
var ConfirmDelete_1 = require("~/components/Modals/ConfirmDelete");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var inventory_models_1 = require("../../inventory.models");
var Receipts_1 = require("../Receipts");
var Shipments_1 = require("../Shipments");
var WarehouseTransferStatus_1 = require("./WarehouseTransferStatus");
var WarehouseTransferForm = function (_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    var initialValues = _a.initialValues, warehouseTransfer = _a.warehouseTransfer;
    var company = (0, hooks_1.useUser)().company;
    var permissions = (0, hooks_1.usePermissions)();
    // Item rules eval at every "go" status transition (Confirm/Ship/Receive/
    // Complete). Surface violations through the hook's modal rather than the
    // plain navigation path.
    var statusRules = (0, storage_rules_1.useStorageRuleViolations)({
        action: (warehouseTransfer === null || warehouseTransfer === void 0 ? void 0 : warehouseTransfer.id)
            ? path_1.path.to.warehouseTransferStatus(warehouseTransfer.id)
            : ""
    });
    var statusFetcher = statusRules.fetcher;
    var deleteModal = (0, react_1.useDisclosure)();
    var _r = (0, AuditLog_1.useAuditLog)({
        entityType: "warehouseTransfer",
        entityId: (_b = warehouseTransfer === null || warehouseTransfer === void 0 ? void 0 : warehouseTransfer.id) !== null && _b !== void 0 ? _b : "",
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _r.trigger, auditLogDrawer = _r.drawer;
    var t = (0, macro_1.useLingui)().t;
    var isEditing = !!initialValues.id;
    var isLocked = (0, inventory_models_1.isWarehouseTransferLocked)(warehouseTransfer === null || warehouseTransfer === void 0 ? void 0 : warehouseTransfer.status);
    var canEdit = isEditing
        ? permissions.can("update", "inventory") &&
            ["Draft"].includes((_c = warehouseTransfer === null || warehouseTransfer === void 0 ? void 0 : warehouseTransfer.status) !== null && _c !== void 0 ? _c : "")
        : permissions.can("create", "inventory");
    var _s = useWarehouseTransferRelatedDocuments(warehouseTransfer === null || warehouseTransfer === void 0 ? void 0 : warehouseTransfer.id), receipts = _s.receipts, shipments = _s.shipments, ship = _s.ship, receive = _s.receive, hasShippedItems = _s.hasShippedItems;
    return (<>
      <form_1.ValidatedForm validator={inventory_models_1.warehouseTransferValidator} method="post" defaultValues={initialValues} className="w-full" isDisabled={isEditing && isLocked}>
        <react_1.Card className="w-full">
          {isEditing && warehouseTransfer ? (<components_1.DocumentHeader title={(_d = warehouseTransfer.transferId) !== null && _d !== void 0 ? _d : ""} status={<WarehouseTransferStatus_1.default status={warehouseTransfer.status}/>} menuItems={<>
                  {auditLogTrigger}
                  <react_1.DropdownMenuSeparator />
                  <react_1.DropdownMenuItem disabled={["Draft"].includes((_e = warehouseTransfer.status) !== null && _e !== void 0 ? _e : "") ||
                    statusFetcher.state !== "idle" ||
                    !permissions.can("update", "inventory")} onClick={function () {
                    statusFetcher.submit({ status: "Draft" }, {
                        method: "post",
                        action: path_1.path.to.warehouseTransferStatus(warehouseTransfer.id)
                    });
                }}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuLoaderCircle />}/>
                    <macro_1.Trans>Reopen</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                  <react_1.DropdownMenuSeparator />
                  <react_1.DropdownMenuItem disabled={isLocked ||
                    !permissions.can("delete", "inventory") ||
                    !permissions.is("employee")} destructive onClick={deleteModal.onOpen}>
                    <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                    <macro_1.Trans>Delete Warehouse Transfer</macro_1.Trans>
                  </react_1.DropdownMenuItem>
                </>} actions={<>
                  <react_1.Button type="button" leftIcon={<lu_1.LuCheckCheck />} variant={warehouseTransfer.status === "Draft"
                    ? "primary"
                    : "secondary"} isDisabled={!["Draft"].includes(warehouseTransfer.status) ||
                    statusFetcher.state !== "idle" ||
                    !permissions.can("update", "inventory")} isLoading={statusFetcher.state !== "idle" &&
                    ((_f = statusFetcher.formData) === null || _f === void 0 ? void 0 : _f.get("status")) ===
                        "To Ship and Receive"} onClick={function () {
                    var fd = new FormData();
                    fd.set("status", "To Ship and Receive");
                    statusRules.submit(fd);
                }}>
                    <macro_1.Trans>Confirm</macro_1.Trans>
                  </react_1.Button>

                  <react_1.Button type="button" variant="secondary" leftIcon={<lu_1.LuCircleStop />} isDisabled={["Cancelled", "Completed"].includes(warehouseTransfer.status) ||
                    statusFetcher.state !== "idle" ||
                    !permissions.can("update", "inventory")} isLoading={statusFetcher.state !== "idle" &&
                    ((_g = statusFetcher.formData) === null || _g === void 0 ? void 0 : _g.get("status")) === "Cancelled"} onClick={function () {
                    var fd = new FormData();
                    fd.set("status", "Cancelled");
                    statusRules.submit(fd);
                }}>
                    <macro_1.Trans>Cancel</macro_1.Trans>
                  </react_1.Button>

                  {shipments.length > 0 ? (<react_1.DropdownMenu>
                      <react_1.DropdownMenuTrigger asChild>
                        <react_1.Button leftIcon={<lu_1.LuTruck />} variant="secondary" rightIcon={<lu_1.LuChevronDown />}>
                          <macro_1.Trans>Shipments</macro_1.Trans>
                        </react_1.Button>
                      </react_1.DropdownMenuTrigger>
                      <react_1.DropdownMenuContent>
                        <react_1.DropdownMenuItem disabled={!["To Ship", "To Ship and Receive"].includes((_h = warehouseTransfer.status) !== null && _h !== void 0 ? _h : "")} onClick={function () { return ship(warehouseTransfer); }}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                          <macro_1.Trans>New Shipment</macro_1.Trans>
                        </react_1.DropdownMenuItem>
                        <react_1.DropdownMenuSeparator />
                        {shipments.map(function (shipment) { return (<react_1.DropdownMenuItem key={shipment.id} asChild>
                            <react_router_1.Link to={path_1.path.to.shipment(shipment.id)}>
                              <react_1.DropdownMenuIcon icon={<lu_1.LuTruck />}/>
                              <react_1.HStack spacing={8}>
                                <span>{shipment.shipmentId}</span>
                                <Shipments_1.ShipmentStatus status={shipment.status}/>
                              </react_1.HStack>
                            </react_router_1.Link>
                          </react_1.DropdownMenuItem>); })}
                      </react_1.DropdownMenuContent>
                    </react_1.DropdownMenu>) : (<react_1.Button leftIcon={<lu_1.LuTruck />} isDisabled={!["To Ship", "To Ship and Receive"].includes((_j = warehouseTransfer.status) !== null && _j !== void 0 ? _j : "")} variant={["To Ship", "To Ship and Receive"].includes((_k = warehouseTransfer.status) !== null && _k !== void 0 ? _k : "")
                        ? "primary"
                        : "secondary"} onClick={function () { return ship(warehouseTransfer); }}>
                      <macro_1.Trans>Ship</macro_1.Trans>
                    </react_1.Button>)}

                  {receipts.length > 0 ? (<react_1.DropdownMenu>
                      <react_1.DropdownMenuTrigger asChild>
                        <react_1.Button leftIcon={<lu_1.LuHandCoins />} variant={["To Receive", "To Ship and Receive"].includes((_l = warehouseTransfer.status) !== null && _l !== void 0 ? _l : "")
                        ? "primary"
                        : "secondary"} rightIcon={<lu_1.LuChevronDown />}>
                          <macro_1.Trans>Receipts</macro_1.Trans>
                        </react_1.Button>
                      </react_1.DropdownMenuTrigger>
                      <react_1.DropdownMenuContent>
                        <react_1.DropdownMenuItem disabled={!["To Receive", "To Ship and Receive"].includes((_m = warehouseTransfer.status) !== null && _m !== void 0 ? _m : "") || !hasShippedItems} onClick={function () { return receive(warehouseTransfer); }}>
                          <react_1.DropdownMenuIcon icon={<lu_1.LuCirclePlus />}/>
                          <macro_1.Trans>New Receipt</macro_1.Trans>
                        </react_1.DropdownMenuItem>
                        <react_1.DropdownMenuSeparator />
                        {receipts.map(function (receipt) { return (<react_1.DropdownMenuItem key={receipt.id} asChild>
                            <react_router_1.Link to={path_1.path.to.receipt(receipt.id)}>
                              <react_1.DropdownMenuIcon icon={<lu_1.LuHandCoins />}/>
                              <react_1.HStack spacing={8}>
                                <span>{receipt.receiptId}</span>
                                <Receipts_1.ReceiptStatus status={receipt.status}/>
                              </react_1.HStack>
                            </react_router_1.Link>
                          </react_1.DropdownMenuItem>); })}
                      </react_1.DropdownMenuContent>
                    </react_1.DropdownMenu>) : (<react_1.Button leftIcon={<lu_1.LuHandCoins />} isDisabled={!["To Receive", "To Ship and Receive"].includes((_o = warehouseTransfer.status) !== null && _o !== void 0 ? _o : "") || !hasShippedItems} variant={["To Receive", "To Ship and Receive"].includes((_p = warehouseTransfer.status) !== null && _p !== void 0 ? _p : "") && hasShippedItems
                        ? "primary"
                        : "secondary"} onClick={function () { return receive(warehouseTransfer); }}>
                      <macro_1.Trans>Receive</macro_1.Trans>
                    </react_1.Button>)}
                </>}/>) : (<react_1.CardHeader>
              <react_1.Heading as="h1" size="h3">
                <macro_1.Trans>New Warehouse Transfer</macro_1.Trans>
              </react_1.Heading>
            </react_1.CardHeader>)}

          <react_1.CardContent>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
                {isEditing ? (<form_1.InputControlled name="transferId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Transfer ID"], ["Transfer ID"])))} isReadOnly value={initialValues.transferId}/>) : (<Form_1.SequenceOrCustomId name="transferId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Transfer ID"], ["Transfer ID"])))} table="warehouseTransfer"/>)}
                <Form_1.Input name="reference" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Reference"], ["Reference"])))}/>
                <Form_1.Location name="fromLocationId" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["From Location"], ["From Location"])))}/>
                <Form_1.Location name="toLocationId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["To Location"], ["To Location"])))}/>
                {isEditing && (<>
                    <Form_1.DatePicker name="transferDate" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Transfer Date"], ["Transfer Date"])))}/>
                    <Form_1.DatePicker name="expectedReceiptDate" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Expected Receipt Date"], ["Expected Receipt Date"])))}/>
                  </>)}
              </div>
              <Form_1.TextArea name="notes" label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Notes"], ["Notes"])))}/>
            </react_1.VStack>
          </react_1.CardContent>

          <react_1.CardFooter>
            <Form_1.Submit disabled={!canEdit}>
              <macro_1.Trans>Save</macro_1.Trans>
            </Form_1.Submit>
          </react_1.CardFooter>
        </react_1.Card>
      </form_1.ValidatedForm>

      <statusRules.ViolationModal />
      {deleteModal.isOpen && warehouseTransfer && (<ConfirmDelete_1.default action={path_1.path.to.deleteWarehouseTransfer(warehouseTransfer.id)} isOpen={deleteModal.isOpen} name={(_q = warehouseTransfer.transferId) !== null && _q !== void 0 ? _q : "warehouse transfer"} text={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), warehouseTransfer.transferId)} onCancel={function () {
                deleteModal.onClose();
            }} onSubmit={function () {
                deleteModal.onClose();
            }}/>)}
      {auditLogDrawer}
    </>);
};
var useWarehouseTransferRelatedDocuments = function (warehouseTransferId) {
    var _a = (0, react_2.useState)([]), receipts = _a[0], setReceipts = _a[1];
    var _b = (0, react_2.useState)([]), shipments = _b[0], setShipments = _b[1];
    var _c = (0, react_2.useState)(false), hasShippedItems = _c[0], setHasShippedItems = _c[1];
    var carbon = (0, auth_1.useCarbon)().carbon;
    var submitForm = (0, react_router_1.useSubmit)();
    var ship = (0, react_2.useCallback)(function (warehouseTransfer) {
        var formData = new FormData();
        formData.set("sourceDocument", "Outbound Transfer");
        formData.set("sourceDocumentId", warehouseTransfer.id);
        submitForm(formData, { method: "post", action: path_1.path.to.newShipment });
    }, [submitForm]);
    var receive = (0, react_2.useCallback)(function (warehouseTransfer) {
        var formData = new FormData();
        formData.set("sourceDocument", "Inbound Transfer");
        formData.set("sourceDocumentId", warehouseTransfer.id);
        submitForm(formData, { method: "post", action: path_1.path.to.newReceipt });
    }, [submitForm]);
    var getRelatedDocuments = (0, react_2.useCallback)(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, r, s, lines;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!carbon || !id)
                        return [2 /*return*/];
                    return [4 /*yield*/, Promise.all([
                            carbon
                                .from("receipt")
                                .select("id, receiptId, status")
                                .eq("sourceDocument", "Inbound Transfer")
                                .eq("sourceDocumentId", id),
                            carbon
                                .from("shipment")
                                .select("id, shipmentId, status")
                                .eq("sourceDocument", "Outbound Transfer")
                                .eq("sourceDocumentId", id),
                            carbon
                                .from("warehouseTransferLine")
                                .select("shippedQuantity")
                                .eq("transferId", id)
                        ])];
                case 1:
                    _a = _b.sent(), r = _a[0], s = _a[1], lines = _a[2];
                    if (r.error) {
                        react_1.toast.error("Failed to load receipts");
                    }
                    else {
                        setReceipts(r.data);
                    }
                    if (s.error) {
                        react_1.toast.error("Failed to load shipments");
                    }
                    else {
                        setShipments(s.data);
                    }
                    if (!lines.error) {
                        setHasShippedItems(lines.data.some(function (line) { var _a; return ((_a = line.shippedQuantity) !== null && _a !== void 0 ? _a : 0) > 0; }));
                    }
                    return [2 /*return*/];
            }
        });
    }); }, [carbon]);
    (0, react_2.useEffect)(function () {
        if (!warehouseTransferId)
            return;
        getRelatedDocuments(warehouseTransferId);
    }, [getRelatedDocuments, warehouseTransferId]);
    return { receipts: receipts, shipments: shipments, ship: ship, receive: receive, hasShippedItems: hasShippedItems };
};
exports.default = WarehouseTransferForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
