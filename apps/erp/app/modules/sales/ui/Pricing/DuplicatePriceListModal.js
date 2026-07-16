"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicatePriceListModal = DuplicatePriceListModal;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var react_router_1 = require("react-router");
var Form_1 = require("~/components/Form");
var path_1 = require("~/utils/path");
var sales_models_1 = require("../../sales.models");
function DuplicatePriceListModal(_a) {
    var _b, _c;
    var sourceScope = _a.sourceScope, overrideIds = _a.overrideIds, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var fetcher = (0, react_router_1.useFetcher)();
    var prevState = (0, react_2.useRef)(fetcher.state);
    (0, react_2.useEffect)(function () {
        if (prevState.current === "loading" && fetcher.state === "idle") {
            onClose();
        }
        prevState.current = fetcher.state;
    }, [fetcher.state, onClose]);
    var _d = (0, react_2.useState)("customer"), scopeType = _d[0], setScopeType = _d[1];
    var _e = (0, react_2.useState)("skip"), conflictStrategy = _e[0], setConflictStrategy = _e[1];
    var isSubmitting = fetcher.state !== "idle";
    return (<react_1.Modal open onOpenChange={function (open) { return !open && onClose(); }}>
      <react_1.ModalContent>
        <react_1.ModalHeader>
          <react_1.ModalTitle>
            {overrideIds ? (<macro_1.Trans>Duplicate Item</macro_1.Trans>) : (<macro_1.Trans>Duplicate Price List</macro_1.Trans>)}
          </react_1.ModalTitle>
          <react_1.ModalDescription>
            {overrideIds ? (<macro_1.Trans>Copy this item's pricing to another scope.</macro_1.Trans>) : (<macro_1.Trans>
                Copy all items and pricing to another customer or type.
              </macro_1.Trans>)}
          </react_1.ModalDescription>
        </react_1.ModalHeader>
        <form_1.ValidatedForm validator={sales_models_1.duplicatePriceListValidator} fetcher={fetcher} action={path_1.path.to.duplicatePriceList} method="post" defaultValues={{
            sourceCustomerId: (_b = sourceScope.customerId) !== null && _b !== void 0 ? _b : "",
            sourceCustomerTypeId: (_c = sourceScope.customerTypeId) !== null && _c !== void 0 ? _c : "",
            targetCustomerId: "",
            targetCustomerTypeId: "",
            conflictStrategy: "skip",
            overrideIds: overrideIds ? JSON.stringify(overrideIds) : undefined
        }}>
          <Form_1.Hidden name="sourceCustomerId"/>
          <Form_1.Hidden name="sourceCustomerTypeId"/>
          <Form_1.Hidden name="conflictStrategy" value={conflictStrategy}/>
          {overrideIds && (<Form_1.Hidden name="overrideIds" value={JSON.stringify(overrideIds)}/>)}
          <react_1.ModalBody>
            <react_1.VStack spacing={4}>
              <react_1.ChoiceCardGroup label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Duplicate To"], ["Duplicate To"])))} value={scopeType} onChange={setScopeType} options={[
            {
                value: "customer",
                title: t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Specific Customer"], ["Specific Customer"]))),
                description: t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Copy pricing to a single customer"], ["Copy pricing to a single customer"])))
            },
            {
                value: "customerType",
                title: t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Customer Type"], ["Customer Type"]))),
                description: t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Copy pricing to all customers of a type"], ["Copy pricing to all customers of a type"])))
            }
        ]}/>

              {scopeType === "customer" && (<>
                  <Form_1.Customer name="targetCustomerId" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Customer"], ["Customer"])))} exclude={sourceScope.customerId
                ? [sourceScope.customerId]
                : undefined}/>
                  <Form_1.Hidden name="targetCustomerTypeId" value=""/>
                </>)}

              {scopeType === "customerType" && (<>
                  <Form_1.CustomerType name="targetCustomerTypeId" label={t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["Customer Type"], ["Customer Type"])))} exclude={sourceScope.customerTypeId
                ? [sourceScope.customerTypeId]
                : undefined}/>
                  <Form_1.Hidden name="targetCustomerId" value=""/>
                </>)}

              <react_1.ChoiceCardGroup label={t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["If items already exist"], ["If items already exist"])))} value={conflictStrategy} onChange={setConflictStrategy} options={[
            {
                value: "skip",
                title: t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Skip Existing"], ["Skip Existing"]))),
                description: t(templateObject_10 || (templateObject_10 = __makeTemplateObject(["Keep existing pricing, only add new items"], ["Keep existing pricing, only add new items"])))
            },
            {
                value: "overwrite",
                title: t(templateObject_11 || (templateObject_11 = __makeTemplateObject(["Overwrite Existing"], ["Overwrite Existing"]))),
                description: t(templateObject_12 || (templateObject_12 = __makeTemplateObject(["Replace existing pricing with source values"], ["Replace existing pricing with source values"])))
            }
        ]}/>
            </react_1.VStack>
          </react_1.ModalBody>
          <react_1.ModalFooter>
            <react_1.HStack>
              <react_1.Button type="submit" isLoading={isSubmitting}>
                <macro_1.Trans>Duplicate</macro_1.Trans>
              </react_1.Button>
              <react_1.Button variant="secondary" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.ModalFooter>
        </form_1.ValidatedForm>
      </react_1.ModalContent>
    </react_1.Modal>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12;
