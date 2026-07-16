"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var purchasing_models_1 = require("../../purchasing.models");
var PurchasingRFQForm = function (_a) {
    var _b;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var rfqId = (0, react_router_1.useParams)().rfqId;
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.purchasingRfq(rfqId));
    var isEditing = initialValues.id !== undefined;
    var isLocked = (0, purchasing_models_1.isRfqLocked)((_b = routeData === null || routeData === void 0 ? void 0 : routeData.rfqSummary) === null || _b === void 0 ? void 0 : _b.status);
    return (<react_1.Card>
      <form_1.ValidatedForm method="post" validator={purchasing_models_1.purchasingRfqValidator} defaultValues={initialValues} isDisabled={isEditing && isLocked}>
        <react_1.CardHeader>
          <react_1.CardTitle>
            {isEditing ? "Purchasing RFQ" : "New Purchasing RFQ"}
          </react_1.CardTitle>
          {!isEditing && (<react_1.CardDescription>
              A purchasing request for quote (RFQ) is sent to suppliers to
              request pricing on a set of items and quantities.
            </react_1.CardDescription>)}
        </react_1.CardHeader>
        <react_1.CardContent>
          {isEditing && <Form_1.Hidden name="rfqId"/>}
          <react_1.VStack>
            <div className={(0, react_1.cn)("grid w-full gap-x-8 gap-y-4", isEditing
            ? "grid-cols-1 lg:grid-cols-3"
            : "grid-cols-1 md:grid-cols-2")}>
              {!isEditing && (<Form_1.SequenceOrCustomId name="rfqId" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["RFQ ID"], ["RFQ ID"])))} table="purchasingRfq"/>)}
              <Form_1.Suppliers name="supplierIds" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Suppliers"], ["Suppliers"])))}/>
              <Form_1.DatePicker name="rfqDate" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["RFQ Date"], ["RFQ Date"])))}/>
              <Form_1.DatePicker name="expirationDate" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Due Date"], ["Due Date"])))}/>
              <Form_1.Location name="locationId" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Receiving Location"], ["Receiving Location"])))}/>
              <Form_1.Employee name="employeeId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Buyer"], ["Buyer"])))} isOptional/>
              <Form_1.CustomFormFields table="purchasingRfq"/>
            </div>
          </react_1.VStack>
        </react_1.CardContent>
        <react_1.CardFooter>
          <Form_1.Submit isDisabled={isLocked ||
            (isEditing
                ? !permissions.can("update", "purchasing")
                : !permissions.can("create", "purchasing"))}>
            <macro_1.Trans>Save</macro_1.Trans>
          </Form_1.Submit>
        </react_1.CardFooter>
      </form_1.ValidatedForm>
    </react_1.Card>);
};
exports.default = PurchasingRFQForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
