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
var purchasing_1 = require("~/modules/purchasing");
var path_1 = require("~/utils/path");
var SupplierForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues, _c = _a.type, type = _c === void 0 ? "card" : _c, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var companySettings = (0, hooks_1.useCompanySettings)();
    var showSupplierReadableId = (_b = companySettings === null || companySettings === void 0 ? void 0 : companySettings.showSupplierReadableId) !== null && _b !== void 0 ? _b : false;
    var fetcher = (0, react_router_1.useFetcher)();
    var supplierApprovalRequired = (0, hooks_1.useSupplierApprovalRequired)();
    (0, react_2.useEffect)(function () {
        var _a, _b;
        if (type !== "modal")
            return;
        if (fetcher.state === "loading" && ((_a = fetcher.data) === null || _a === void 0 ? void 0 : _a.data)) {
            onClose === null || onClose === void 0 ? void 0 : onClose();
            // @ts-ignore
            react_1.toast.success(t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Created supplier: ", ""], ["Created supplier: ", ""])), fetcher.data.data.name));
        }
        else if (fetcher.state === "idle" && ((_b = fetcher.data) === null || _b === void 0 ? void 0 : _b.error)) {
            react_1.toast.error(t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Failed to create supplier: ", ""], ["Failed to create supplier: ", ""])), fetcher.data.error.message));
        }
    }, [fetcher.data, fetcher.state, onClose, t, type]);
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "purchasing")
        : !permissions.can("create", "purchasing");
    return (<div>
      <react_1.ModalCardProvider type={type}>
        <react_1.ModalCard onClose={onClose}>
          <react_1.ModalCardContent size="medium">
            <form_1.ValidatedForm key={initialValues.supplierStatus} method="post" action={isEditing ? undefined : path_1.path.to.newSupplier} validator={supplierApprovalRequired
            ? purchasing_1.supplierApprovalValidator
            : purchasing_1.supplierValidator} defaultValues={initialValues} fetcher={fetcher}>
              <react_1.ModalCardHeader>
                <react_1.ModalCardTitle>
                  {isEditing ? (<macro_1.Trans>Supplier Overview</macro_1.Trans>) : (<macro_1.Trans>New Supplier</macro_1.Trans>)}
                </react_1.ModalCardTitle>
                {!isEditing && (<react_1.ModalCardDescription>
                    <macro_1.Trans>
                      {" "}
                      A supplier is a business or person who sells you parts or
                      services.
                    </macro_1.Trans>
                  </react_1.ModalCardDescription>)}
              </react_1.ModalCardHeader>
              <react_1.ModalCardBody>
                <Form_1.Hidden name="id"/>
                <Form_1.Hidden name="type" value={type}/>
                <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", type === "modal"
            ? "grid-cols-1"
            : isEditing
                ? "grid-cols-1 lg:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2")}>
                  {showSupplierReadableId &&
            (isEditing ? (<Form_1.Input name="readableId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Supplier ID"], ["Supplier ID"])))} isReadOnly helperText={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Supplier ID cannot be changed after creation"], ["Supplier ID cannot be changed after creation"])))}/>) : (<Form_1.SequenceOrCustomId name="readableId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Supplier ID"], ["Supplier ID"])))} table="supplier"/>))}
                  <Form_1.Input autoFocus={!isEditing} name="name" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Name"], ["Name"])))}/>
                  <Form_1.SupplierStatus name="supplierStatus" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Supplier Status"], ["Supplier Status"])))} placeholder={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["Select Supplier Status"], ["Select Supplier Status"])))} disabled={supplierApprovalRequired}/>
                  <Form_1.SupplierType name="supplierTypeId" label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Supplier Type"], ["Supplier Type"])))} placeholder={t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Select Supplier Type"], ["Select Supplier Type"])))}/>
                  <Form_1.Employee name="accountManagerId" label={t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Account Manager"], ["Account Manager"])))}/>
                  {isEditing && (<>
                      <Form_1.SupplierContact supplier={initialValues.id} name="purchasingContactId" label={t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Purchasing Contact"], ["Purchasing Contact"])))}/>
                    </>)}
                  <Form_1.Currency name="currencyCode" label={t(templateObject_13 || (templateObject_13 = __makeTemplateObject(["Currency"], ["Currency"])))}/>
                  <Form_1.Input name="website" label={t(templateObject_14 || (templateObject_14 = __makeTemplateObject(["Website"], ["Website"])))}/>

                  {/* <EmailRecipients name="defaultCc" label={t`Default CC`} /> */}
                  <Form_1.CustomFormFields table="supplier"/>
                </div>
              </react_1.ModalCardBody>
              <react_1.ModalCardFooter>
                <react_1.HStack>
                  <Form_1.Submit isDisabled={isDisabled}>
                    <macro_1.Trans>Save</macro_1.Trans>
                  </Form_1.Submit>
                </react_1.HStack>
              </react_1.ModalCardFooter>
            </form_1.ValidatedForm>
          </react_1.ModalCardContent>
        </react_1.ModalCard>
      </react_1.ModalCardProvider>
    </div>);
};
exports.default = SupplierForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14;
