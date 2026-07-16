"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourcingTypeProperty = SourcingTypeProperty;
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var macro_1 = require("@lingui/react/macro");
var zod_1 = require("zod");
var Icons_1 = require("~/components/Icons");
var shared_1 = require("~/modules/shared");
/**
 * Item-level sourcing selector shown in the Part/Tool Properties sidebar.
 * Sourcing only applies to "Buy and Make" items, so it renders nothing
 * otherwise. Shared between PartProperties and ToolProperties — keep it here
 * rather than duplicating the form block in each.
 */
function SourcingTypeProperty(_a) {
    var replenishmentSystem = _a.replenishmentSystem, value = _a.value, onChange = _a.onChange;
    var t = (0, macro_1.useLingui)().t;
    if (replenishmentSystem !== "Buy and Make")
        return null;
    return (<form_1.ValidatedForm defaultValues={{ sourcingType: value !== null && value !== void 0 ? value : undefined }} validator={zod_1.z.object({ sourcingType: zod_1.z.enum(shared_1.sourcingType) })} className="w-full">
      <form_1.Select name="sourcingType" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Sourcing"], ["Sourcing"])))} inline={function (value) { return (<react_1.Badge variant="secondary">
            <Icons_1.SourcingTypeIcon type={value} className="mr-2"/>
            <span>{value}</span>
          </react_1.Badge>); }} options={shared_1.sourcingType.map(function (type) { return ({
            value: type,
            label: (<span className="flex items-center gap-2">
              <Icons_1.SourcingTypeIcon type={type}/>
              {type}
            </span>)
        }); })} onChange={function (value) { var _a; return onChange((_a = value === null || value === void 0 ? void 0 : value.value) !== null && _a !== void 0 ? _a : null); }}/>
    </form_1.ValidatedForm>);
}
var templateObject_1;
