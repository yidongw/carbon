"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = JobRuleForm;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var react_2 = require("react");
var lu_1 = require("react-icons/lu");
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var people_models_1 = require("~/modules/people/people.models");
var path_1 = require("~/utils/path");
function JobRuleForm(_a) {
    var initialValues = _a.initialValues, groups = _a.groups, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var t = (0, macro_1.useLingui)().t;
    var isEditing = !!initialValues.id;
    var isDisabled = isEditing
        ? !permissions.can("update", "production")
        : !permissions.can("create", "production");
    // Parse initial conditions from JSON string
    var parseConditions = function () {
        try {
            var parsed = JSON.parse(initialValues.conditions || "[]");
            return Array.isArray(parsed) ? parsed : [];
        }
        catch (_a) {
            return [];
        }
    };
    var _b = (0, react_2.useState)(parseConditions), conditions = _b[0], setConditions = _b[1];
    var addCondition = function () {
        setConditions(function (prev) { return __spreadArray(__spreadArray([], prev, true), [
            { field: "customerId", operator: "eq", value: "" }
        ], false); });
    };
    var removeCondition = function (index) {
        setConditions(function (prev) { return prev.filter(function (_, i) { return i !== index; }); });
    };
    var updateCondition = function (index, key, value) {
        setConditions(function (prev) {
            return prev.map(function (c, i) {
                var _a;
                return (i === index ? __assign(__assign({}, c), (_a = {}, _a[key] = value, _a)) : c);
            });
        });
    };
    return (<react_1.ModalDrawerProvider type="drawer">
      <react_1.ModalDrawer open onOpenChange={function (open) { return !open && onClose(); }}>
        <react_1.ModalDrawerContent>
          <form_1.ValidatedForm validator={people_models_1.jobAssignmentRuleValidator} method="post" action={isEditing
            ? path_1.path.to.jobRule(initialValues.id)
            : path_1.path.to.newJobRule} defaultValues={initialValues} className="flex flex-col h-full">
            <react_1.ModalDrawerHeader>
              <react_1.ModalDrawerTitle>
                {isEditing ? (<macro_1.Trans>Edit Rule</macro_1.Trans>) : (<macro_1.Trans>New Assignment Rule</macro_1.Trans>)}
              </react_1.ModalDrawerTitle>
            </react_1.ModalDrawerHeader>

            <react_1.ModalDrawerBody>
              <react_1.VStack spacing={4}>
                <Form_1.Hidden name="id"/>
                {/* Hidden field carries serialized conditions */}
                <input type="hidden" name="conditions" value={JSON.stringify(conditions)}/>

                <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Rule Name"], ["Rule Name"])))}/>
                <Form_1.Input name="description" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Description"], ["Description"])))}/>

                <Form_1.Select name="targetGroupId" label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Assign to Group"], ["Assign to Group"])))} options={groups.map(function (g) { return ({
            label: g.name,
            value: g.id
        }); })}/>

                {/* Priority */}
                <div className="grid grid-cols-2 gap-4">
                  <Form_1.Number name="priority" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Priority"], ["Priority"])))} minValue={0} helperText={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Lower runs first"], ["Lower runs first"])))}/>
                  <Form_1.Boolean name="active" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Active"], ["Active"])))}/>
                </div>

                {/* Conditions builder */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <macro_1.Trans>Conditions</macro_1.Trans>
                      <span className="text-muted-foreground ml-1 font-normal text-xs">
                        <macro_1.Trans>(all must match)</macro_1.Trans>
                      </span>
                    </span>
                    <react_1.Button type="button" size="sm" variant="outline" onClick={addCondition}>
                      <lu_1.LuPlus className="size-3.5 mr-1"/>
                      <macro_1.Trans>Add</macro_1.Trans>
                    </react_1.Button>
                  </div>

                  {conditions.length === 0 && (<div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                      <macro_1.Trans>No conditions — rule matches all jobs</macro_1.Trans>
                    </div>)}

                  {conditions.map(function (cond, i) { return (<div key={i} className="flex items-center gap-2 rounded-md border bg-muted/30 p-2">
                      <select value={cond.field} onChange={function (e) {
                return updateCondition(i, "field", e.target.value);
            }} className="flex-1 rounded border border-input bg-background px-2 py-1.5 text-xs">
                        {people_models_1.JOB_RULE_FIELDS.map(function (o) { return (<option key={o.value} value={o.value}>
                            {o.label}
                          </option>); })}
                      </select>
                      <select value={cond.operator} onChange={function (e) {
                return updateCondition(i, "operator", e.target.value);
            }} className="w-28 rounded border border-input bg-background px-2 py-1.5 text-xs">
                        {people_models_1.JOB_RULE_OPERATORS.map(function (o) { return (<option key={o.value} value={o.value}>
                            {o.label}
                          </option>); })}
                      </select>
                      <react_1.Input value={cond.value} onChange={function (e) {
                return updateCondition(i, "value", e.target.value);
            }} placeholder={cond.operator === "in"
                ? t(templateObject_7 || (templateObject_7 = __makeTemplateObject(["comma separated IDs"], ["comma separated IDs"]))) : t(templateObject_8 || (templateObject_8 = __makeTemplateObject(["value"], ["value"])))} className="flex-1 h-8 text-xs"/>
                      <react_1.IconButton type="button" variant="ghost" size="sm" aria-label={t(templateObject_9 || (templateObject_9 = __makeTemplateObject(["Remove condition"], ["Remove condition"])))} onClick={function () { return removeCondition(i); }} icon={<lu_1.LuTrash className="size-3.5 text-destructive"/>}/>
                    </div>); })}
                </div>
              </react_1.VStack>
            </react_1.ModalDrawerBody>

            <react_1.ModalDrawerFooter>
              <react_1.HStack>
                <Form_1.Submit isDisabled={isDisabled}>
                  <macro_1.Trans>Save</macro_1.Trans>
                </Form_1.Submit>
                <react_1.Button size="md" variant="solid" onClick={onClose}>
                  <macro_1.Trans>Cancel</macro_1.Trans>
                </react_1.Button>
              </react_1.HStack>
            </react_1.ModalDrawerFooter>
          </form_1.ValidatedForm>
        </react_1.ModalDrawerContent>
      </react_1.ModalDrawer>
    </react_1.ModalDrawerProvider>);
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
