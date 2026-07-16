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
var CustomerType_1 = require("~/components/Form/CustomerType");
var Modals_1 = require("~/components/Modals");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var CustomerHeader = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var _p = (0, macro_1.useLingui)(), i18n = _p.i18n, t = _p.t;
    var customerId = (0, react_router_1.useParams)().customerId;
    if (!customerId)
        throw new Error("Could not find customerId");
    var fetcher = (0, react_router_1.useFetcher)();
    var permissions = (0, hooks_1.usePermissions)();
    var company = (0, hooks_1.useUser)().company;
    var deleteModal = (0, react_1.useDisclosure)();
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.customer(customerId));
    var customerTypes = (0, CustomerType_1.useCustomerTypes)();
    var customerType = (_a = customerTypes === null || customerTypes === void 0 ? void 0 : customerTypes.find(function (type) { var _a; return type.value === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _a === void 0 ? void 0 : _a.customerTypeId); })) === null || _a === void 0 ? void 0 : _a.label;
    var _q = (0, AuditLog_1.useAuditLog)({
        entityType: "customer",
        entityId: customerId,
        companyId: company.id,
        variant: "dropdown"
    }), auditLogTrigger = _q.trigger, auditLogDrawer = _q.drawer;
    var sharedCustomerData = (0, hooks_1.useRouteData)(path_1.path.to.customerRoot);
    var customerStatus = (_c = (_b = sharedCustomerData === null || sharedCustomerData === void 0 ? void 0 : sharedCustomerData.customerStatuses) === null || _b === void 0 ? void 0 : _b.find(function (status) { var _a; return status.id === ((_a = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _a === void 0 ? void 0 : _a.customerStatusId); })) === null || _c === void 0 ? void 0 : _c.name;
    var onUpdateTags = (0, react_2.useCallback)(function (value) {
        var formData = new FormData();
        formData.append("ids", customerId);
        formData.append("table", "customer");
        value.forEach(function (v) {
            formData.append("value", v);
        });
        fetcher.submit(formData, {
            method: "post",
            action: path_1.path.to.tags
        });
    }, [customerId, fetcher.submit]);
    return (<>
      <react_1.VStack>
        <react_1.Card>
          <react_1.HStack className="justify-between items-start">
            <react_1.CardHeader>
              <react_1.CardTitle className="flex items-center gap-2">
                <span>{(_d = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _d === void 0 ? void 0 : _d.name}</span>
                <react_1.DropdownMenu>
                  <react_1.DropdownMenuTrigger asChild>
                    <react_1.IconButton aria-label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["More options"], ["More options"])))} icon={<lu_1.LuEllipsisVertical />} variant="secondary" size="sm"/>
                  </react_1.DropdownMenuTrigger>
                  <react_1.DropdownMenuContent>
                    {auditLogTrigger}
                    <react_1.DropdownMenuSeparator />
                    <react_1.DropdownMenuItem disabled={!permissions.can("delete", "sales")} destructive onClick={deleteModal.onOpen}>
                      <react_1.DropdownMenuIcon icon={<lu_1.LuTrash />}/>
                      <macro_1.Trans>Delete Customer</macro_1.Trans>
                    </react_1.DropdownMenuItem>
                  </react_1.DropdownMenuContent>
                </react_1.DropdownMenu>
              </react_1.CardTitle>
            </react_1.CardHeader>
          </react_1.HStack>
          <react_1.CardContent>
            <react_1.CardAttributes>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>
                  <macro_1.Trans>Status</macro_1.Trans>
                </react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {customerStatus ? (<Enumerable_1.Enumerable value={i18n._(customerStatus)}/>) : ("-")}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>
                  <macro_1.Trans>Type</macro_1.Trans>
                </react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {customerType ? <Enumerable_1.Enumerable value={customerType}/> : "-"}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>
                  <macro_1.Trans>Account Manager</macro_1.Trans>
                </react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {((_e = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _e === void 0 ? void 0 : _e.accountManagerId) ? (<components_1.EmployeeAvatar employeeId={(_g = (_f = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _f === void 0 ? void 0 : _f.accountManagerId) !== null && _g !== void 0 ? _g : null}/>) : ("-")}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeLabel>Tax Status</react_1.CardAttributeLabel>
                <react_1.CardAttributeValue>
                  {((_h = routeData === null || routeData === void 0 ? void 0 : routeData.customerTax) === null || _h === void 0 ? void 0 : _h.taxExempt) ? (<react_1.Status color="red">Exempt</react_1.Status>) : (<react_1.Status color="green">Taxable</react_1.Status>)}
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              <react_1.CardAttribute>
                <react_1.CardAttributeValue>
                  <form_1.ValidatedForm defaultValues={{
            tags: (_k = (_j = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _j === void 0 ? void 0 : _j.tags) !== null && _k !== void 0 ? _k : []
        }} validator={zod_1.z.object({
            tags: zod_1.z.array(zod_1.z.string()).optional()
        })} className="w-full">
                    <Form_1.Tags label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Tags"], ["Tags"])))} name="tags" availableTags={(_l = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _l !== void 0 ? _l : []} table="customer" inline onChange={onUpdateTags}/>
                  </form_1.ValidatedForm>
                </react_1.CardAttributeValue>
              </react_1.CardAttribute>
              {/* {permissions.is("employee") && (
        <CardAttribute>
          <CardAttributeLabel>Assignee</CardAttributeLabel>
          <CardAttributeValue>
            <Assignee
              id={customerId}
              table="customer"
              value={assignee ?? ""}
              isReadOnly={!permissions.can("update", "sales")}
            />
          </CardAttributeValue>
        </CardAttribute>
      )} */}
            </react_1.CardAttributes>
          </react_1.CardContent>
        </react_1.Card>
      </react_1.VStack>
      {deleteModal.isOpen && (<Modals_1.ConfirmDelete action={path_1.path.to.deleteCustomer(customerId)} isOpen={deleteModal.isOpen} name={(_m = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _m === void 0 ? void 0 : _m.name} text={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Are you sure you want to delete ", "? This cannot be undone."], ["Are you sure you want to delete ", "? This cannot be undone."])), (_o = routeData === null || routeData === void 0 ? void 0 : routeData.customer) === null || _o === void 0 ? void 0 : _o.name)} onCancel={deleteModal.onClose} onSubmit={deleteModal.onClose}/>)}
      {auditLogDrawer}
    </>);
};
exports.default = CustomerHeader;
var templateObject_1, templateObject_2, templateObject_3;
