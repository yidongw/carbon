"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StorageRuleForm;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var utils_1 = require("@carbon/utils");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var storageRules_models_1 = require("../storageRules.models");
var ItemFilterSelector_1 = require("./ItemFilterSelector");
var MessageWithTokens_1 = require("./MessageWithTokens");
var RuleBuilder_1 = require("./RuleBuilder");
var SeveritySelect_1 = require("./SeveritySelect");
var SurfacesField_1 = require("./SurfacesField");
function StorageRuleForm(_a) {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    var initialValues = _a.initialValues, _q = _a.open, open = _q === void 0 ? true : _q, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = !!initialValues.id;
    var isDisabled = isEditing
        ? !permissions.can("update", "inventory")
        : !permissions.can("create", "inventory");
    var conditionAstInitial = (_b = initialValues.conditionAst) !== null && _b !== void 0 ? _b : {
        kind: "all",
        conditions: []
    };
    // Live mirror of the AST conditions, kept in sync via RuleBuilder's
    // callback. MessageWithTokens reads it to offer per-condition tokens
    // (`{condition[0].value}`, etc.) that resolve to the rule's required
    // value at eval time — independent of the runtime ctx.
    var _r = (0, react_2.useState)(conditionAstInitial.conditions), liveConditions = _r[0], setLiveConditions = _r[1];
    var targetType = ((_c = initialValues.targetType) !== null && _c !== void 0 ? _c : "item");
    // Default new rules to all surfaces of the chosen targetType. Editing keeps
    // whatever was saved.
    var defaultSurfaces = ((_d = initialValues.surfaces) !== null && _d !== void 0 ? _d : utils_1.TRANSACTION_SURFACES.filter(function (s) {
        return utils_1.SURFACES_BY_TARGET_TYPE[targetType].includes(s);
    }));
    // Live mirror of the rule's selected surfaces. RuleBuilder forwards this to
    // each ConditionRow so the per-surface notes panel filters to only the
    // surfaces this rule actually fires on.
    var _s = (0, react_2.useState)(defaultSurfaces), liveSurfaces = _s[0], setLiveSurfaces = _s[1];
    // ValidatedForm wants defaultValues; we hand it the scalar fields.
    // conditionAst gets driven by RuleBuilder via Hidden field.
    var defaults = {
        id: (_e = initialValues.id) !== null && _e !== void 0 ? _e : undefined,
        name: (_f = initialValues.name) !== null && _f !== void 0 ? _f : "",
        description: (_g = initialValues.description) !== null && _g !== void 0 ? _g : "",
        message: (_h = initialValues.message) !== null && _h !== void 0 ? _h : "",
        severity: (_j = initialValues.severity) !== null && _j !== void 0 ? _j : "error",
        targetType: targetType,
        appliesToAll: (_k = initialValues.appliesToAll) !== null && _k !== void 0 ? _k : false,
        filteredItemTypes: (_l = initialValues.filteredItemTypes) !== null && _l !== void 0 ? _l : [],
        filteredItemGroupIds: (_m = initialValues.filteredItemGroupIds) !== null && _m !== void 0 ? _m : [],
        filteredItemMatchAll: (_o = initialValues.filteredItemMatchAll) !== null && _o !== void 0 ? _o : false,
        active: (_p = initialValues.active) !== null && _p !== void 0 ? _p : true,
        surfaces: defaultSurfaces
    };
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open={open} onOpenChange={function (o) {
            if (!o)
                onClose();
        }}>
        <react_1.ModalDrawerContent size="lg">
          <form_1.ValidatedForm validator={storageRules_models_1.storageRuleValidator} method="post" action={isEditing
            ? path_1.path.to.storageRule(initialValues.id)
            : path_1.path.to.newStorageRule} defaultValues={defaults} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? <macro_1.Trans>Edit rule</macro_1.Trans> : <macro_1.Trans>New rule</macro_1.Trans>}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>
            <react_1.ModalDrawerBody>
              <Form_1.Hidden name="id"/>
              <Form_1.Hidden name="targetType"/>
              <react_1.VStack spacing={4}>
                <react_1.HStack className="w-full gap-x-4">
                  <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>

                  <div className="shrink-0 pb-2">
                    <form_1.Boolean variant="large" name="active" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Active"], ["Active"])))}/>
                  </div>
                </react_1.HStack>
                <Form_1.TextArea name="description" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Description"], ["Description"])))} placeholder={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Optional context for this rule"], ["Optional context for this rule"])))}/>
                <SeveritySelect_1.default name="severity"/>
                {targetType === "item" ? (<ItemFilterSelector_1.default />) : (<form_1.Boolean name="appliesToAll" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Applies to all work centers"], ["Applies to all work centers"])))} description={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["When on, this rule fires for every target of its type. Assignment rows are ignored but preserved."], ["When on, this rule fires for every target of its type. Assignment rows are ignored but preserved."])))}/>)}
                <SurfacesField_1.default name="surfaces" targetType={targetType} onSurfacesChange={setLiveSurfaces}/>
                <RuleBuilder_1.default name="conditionAst" initial={conditionAstInitial} onConditionsChange={setLiveConditions} targetType={targetType} surfaces={liveSurfaces}/>
                <MessageWithTokens_1.default name="message" conditions={liveConditions} targetType={targetType}/>
                <Form_1.CustomFormFields table="storageRule"/>
              </react_1.VStack>
            </react_1.ModalDrawerBody>
            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button variant="solid" onClick={function () { return onClose(); }}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
