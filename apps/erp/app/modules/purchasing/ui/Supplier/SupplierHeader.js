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
var react_router_1 = require("react-router");
var zod_1 = require("zod");
var components_1 = require("~/components");
var AuditLog_1 = require("~/components/AuditLog");
var Enumerable_1 = require("~/components/Enumerable");
var Form_1 = require("~/components/Form");
var SupplierType_1 = require("~/components/Form/SupplierType");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var SupplierStatusIndicator_1 = require("~/modules/purchasing/ui/Supplier/SupplierStatusIndicator");
var path_1 = require("~/utils/path");
var SupplierApprovalModal_1 = require("./SupplierApprovalModal");
var SupplierHeader = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    var supplierId = (0, react_router_1.useParams)().supplierId;
    if (!supplierId)
        throw new Error("Could not find supplierId");
    var fetcher = (0, react_router_1.useFetcher)();
    var t = (0, macro_1.useLingui)().t;
    var formatDate = (0, hooks_1.useDateFormatter)().formatDate;
    var requestApprovalFetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var isApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    var deleteModal = (0, react_1.useDisclosure)();
    var makeInactiveModal = (0, react_1.useDisclosure)();
    var _x = (0, react_2.useState)(null), approvalDecision = _x[0], setApprovalDecision = _x[1];
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.supplier(supplierId));
    var _y = (0, AuditLog_1.useAuditLog)({
        entityType: "supplier",
        entityId: supplierId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _y.trigger, auditLogDrawer = _y.drawer;
    var supplierTypes = (0, SupplierType_1.useSupplierTypes)();
    var supplierType = (_a = supplierTypes === null || supplierTypes === void 0 ? void 0 : supplierTypes.find(function (type) { var _a; return type.value === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _a === void 0 ? void 0 : _a.supplierTypeId); })) === null || _a === void 0 ? void 0 : _a.label;
    var status = (_c = (_b = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _b === void 0 ? void 0 : _b.status) !== null && _c !== void 0 ? _c : null;
    var isPending = status === "Pending";
    var approvalRequestId = (_d = routeData === null || routeData === void 0 ? void 0 : routeData.approvalRequest) === null || _d === void 0 ? void 0 : _d.id;
    var hasApprovalRequest = !!approvalRequestId;
    var canApprove = (_e = routeData === null || routeData === void 0 ? void 0 : routeData.canApprove) !== null && _e !== void 0 ? _e : false;
    var submitRequestApproval = function () {
        var formData = new FormData();
        formData.append("intent", "request-approval");
        requestApprovalFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.supplierApproval(supplierId)
        });
    };
    var makeInactiveFetcher = (0, react_router_1.useFetcher)();
    var submitMakeInactive = function () {
        var formData = new FormData();
        formData.append("intent", "make-inactive");
        makeInactiveFetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.supplierApproval(supplierId)
        });
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: suppressed due to migration
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", supplierId);
        formData.append("table", "supplier");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [supplierId]);
    return (<>
      <react_1.VStack>
        <react_1.Card>
          <react_1.HStack className="justify-between items-start">
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <span>{(_f = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _f === void 0 ? void 0 : _f.name}</span>
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    {auditLogTrigger}
                    <react_1.DropdownMenuSeparator />
                    <react_1.DropdownMenuItem disabled={!permissions.can("delete", "purchasing")} destructive onClick={deleteModal.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                      <macro_1.Trans>Delete Supplier</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </react_1.CardTitle>
            </react_1.CardHeader>
            <react_1.CardAction className="flex h-full flex-row items-center gap-2">
              {isApprovalRequired &&
            status !== "Active" &&
            !hasApprovalRequest && (<react_1.Button leftIcon={<lu_1.LuClipboardCheck />} variant="primary" isDisabled={!permissions.can("update", "purchasing") ||
                requestApprovalFetcher.state !== "idle"} isLoading={requestApprovalFetcher.state !== "idle"} onClick={submitRequestApproval}>
                    <macro_1.Trans>Request Approval</macro_1.Trans>
                  </react_1.Button>)}
              {status === "Active" && canApprove && (<react_1.Button leftIcon={<lu_1.LuX />} variant="secondary" isLoading={makeInactiveFetcher.state !== "idle"} isDisabled={makeInactiveFetcher.state !== "idle"} onClick={makeInactiveModal.onOpen}>
                  <macro_1.Trans>Make Inactive</macro_1.Trans>
                </react_1.Button>)}
              {isPending && hasApprovalRequest && (<>
                  <react_1.Button leftIcon={<lu_1.LuCheckCheck />} variant="primary" isLoading={requestApprovalFetcher.state !== "idle"} isDisabled={!canApprove || requestApprovalFetcher.state !== "idle"} onClick={function () { return setApprovalDecision("Approved"); }}>
                    <macro_1.Trans>Approve</macro_1.Trans>
                  </react_1.Button>
                  <react_1.Button leftIcon={<lu_1.LuX />} variant="destructive" isLoading={requestApprovalFetcher.state !== "idle"} isDisabled={!canApprove || requestApprovalFetcher.state !== "idle"} onClick={function () { return setApprovalDecision("Rejected"); }}>
                    <macro_1.Trans>Reject</macro_1.Trans>
                  </react_1.Button>
                </>)}
            </react_1.CardAction>
          </react_1.HStack>
          <react_1.CardContent>
            <react_1.CardAttributes>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>
                  <macro_1.Trans>Status</macro_1.Trans>
                </react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {((_g = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _g === void 0 ? void 0 : _g.status) ? (<SupplierStatusIndicator_1.SupplierStatusIndicator status={routeData.supplier.status}/>) : ("-")}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>
                  <macro_1.Trans>Type</macro_1.Trans>
                </react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {supplierType ? <Enumerable_1.Enumerable value={supplierType}/> : "-"}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>
                  <macro_1.Trans>Account Manager</macro_1.Trans>
                </react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {((_h = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _h === void 0 ? void 0 : _h.accountManagerId) ? (<components_1.EmployeeAvatar employeeId={(_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _j === void 0 ? void 0 : _j.accountManagerId) !== null && _k !== void 0 ? _k : null}/>) : ("-")}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>Tax Status</react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {((_l = routeData === null || routeData === void 0 ? void 0 : routeData.supplierTax) === null || _l === void 0 ? void 0 : _l.taxExempt) ? (<react_1.Status color="red">Exempt</react_1.Status>) : (<react_1.Status color="green">Taxable</react_1.Status>)}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              {((_m = routeData === null || routeData === void 0 ? void 0 : routeData.decision) === null || _m === void 0 ? void 0 : _m.status) === "Approved" &&
            status === "Active" && (<>
                    <react_1.CardAttribute>
                      <react_1.CardAttributeLabel>
                        <macro_1.Trans>Approved By</macro_1.Trans>
                      </react_1.CardAttributeLabel>
                      <react_1.CardAttributeValue>
                        <components_1.EmployeeAvatar employeeId={routeData.decision.decisionBy}/>
                      </react_1.CardAttributeValue>
                    </react_1.CardAttribute>
                    <react_1.CardAttribute>
                      <react_1.CardAttributeLabel>
                        <macro_1.Trans>Approval Date</macro_1.Trans>
                      </react_1.CardAttributeLabel>
                      <react_1.CardAttributeValue>
                        {formatDate(routeData.decision.decisionAt)}
                      </react_1.CardAttributeValue>
                    </react_1.CardAttribute>
                  </>)}
              {((_o = routeData === null || routeData === void 0 ? void 0 : routeData.decision) === null || _o === void 0 ? void 0 : _o.status) === "Rejected" &&
            status === "Rejected" && (<>
                    <react_1.CardAttribute>
                      <react_1.CardAttributeLabel>
                        <macro_1.Trans>Rejected By</macro_1.Trans>
                      </react_1.CardAttributeLabel>
                      <react_1.CardAttributeValue>
                        <components_1.EmployeeAvatar employeeId={routeData.decision.decisionBy}/>
                      </react_1.CardAttributeValue>
                    </react_1.CardAttribute>
                    <react_1.CardAttribute>
                      <react_1.CardAttributeLabel>
                        <macro_1.Trans>Rejected Date</macro_1.Trans>
                      </react_1.CardAttributeLabel>
                      <react_1.CardAttributeValue>
                        {formatDate(routeData.decision.decisionAt)}
                      </react_1.CardAttributeValue>
                    </react_1.CardAttribute>
                  </>)}
              <react_1.CardAttribute>
                <react_1.CardAttributeValue>
                  <form_1.ValidatedForm defaultValues={{
            tags: (_q = (_p = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _p === void 0 ? void 0 : _p.tags) !== null && _q !== void 0 ? _q : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
                    <Form_1.Tags label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" availableTags={(_r = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _r !== void 0 ? _r : []} table="supplier" inline onChange={onUpdateTags}/>
                  </form_1.ValidatedForm>
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
            </react_1.CardAttributes>
          </react_1.CardContent>
        </react_1.Card>
      </react_1.VStack>
      {deleteModal.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteSupplier(supplierId)} isOpen={deleteModal.isOpen} name={(_s = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _s === void 0 ? void 0 : _s.name} text={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_t = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _t === void 0 ? void 0 : _t.name)} onCancel={deleteModal.onClose} onSubmit={deleteModal.onClose}/>)}
      {makeInactiveModal.isOpen && (<react_1.Modal open onOpenChange={function (open) {
                if (!open)
                    makeInactiveModal.onClose();
            }}>
          <react_1.ModalOverlay />
          <react_1.ModalContent>
            <react_1.ModalHeader>
              <react_1.ModalTitle>
                <macro_1.Trans>Deactivate Supplier</macro_1.Trans>
              </react_1.ModalTitle>
            </react_1.ModalHeader>
            <react_1.ModalBody>
              <macro_1.Trans>
                Are you sure you want to deactivate {(_u = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _u === void 0 ? void 0 : _u.name}?
              </macro_1.Trans>
            </react_1.ModalBody>
            <react_1.ModalFooter>
              <react_1.Button variant="secondary" onClick={makeInactiveModal.onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
              <react_1.Button isLoading={makeInactiveFetcher.state !== "idle"} isDisabled={makeInactiveFetcher.state !== "idle"} onClick={function () {
                submitMakeInactive();
                makeInactiveModal.onClose();
            }}>
                <macro_1.Trans>Deactivate</macro_1.Trans>
              </react_1.Button>
            </react_1.ModalFooter>
          </react_1.ModalContent>
        </react_1.Modal>)}
      {auditLogDrawer}
      {approvalDecision && approvalRequestId && (<SupplierApprovalModal_1.default supplierName={(_w = (_v = routeData === null || routeData === void 0 ? void 0 : routeData.supplier) === null || _v === void 0 ? void 0 : _v.name) !== null && _w !== void 0 ? _w : undefined} approvalRequestId={approvalRequestId} decision={approvalDecision} onClose={function () { return setApprovalDecision(null); }}/>)}
    </>);
};
exports.default = SupplierHeader;
var templateObject_1, templateObject_2, templateObject_3;
