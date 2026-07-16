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
var settings_1 = require("~/modules/settings");
var path_1 = require("~/utils/path");
var string_1 = require("~/utils/string");
var SequenceForm = function (_a) {
    var _b, _c, _d, _e;
    var initialValues = _a.initialValues;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var navigate = (0, react_router_1.useNavigate)();
    var onClose = function () { return navigate(-1); };
    var _f = (0, react_2.useState)((_b = initialValues.prefix) !== null && _b !== void 0 ? _b : ""), prefix = _f[0], setPrefix = _f[1];
    var _g = (0, react_2.useState)((_c = initialValues.suffix) !== null && _c !== void 0 ? _c : ""), suffix = _g[0], setSuffix = _g[1];
    var _h = (0, react_2.useState)((_d = initialValues.next) !== null && _d !== void 0 ? _d : "1"), next = _h[0], setNext = _h[1];
    var _j = (0, react_2.useState)((_e = initialValues.size) !== null && _e !== void 0 ? _e : 5), size = _j[0], setSize = _j[1];
    var makePreview = function () {
        var p = (0, string_1.interpolateSequenceDate)(prefix);
        var s = (0, string_1.interpolateSequenceDate)(suffix);
        return "".concat(p).concat(next.toString().padStart(size, "0")).concat(s);
    };
    var isDisabled = !permissions.can("update", "settings");
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={settings_1.sequenceValidator} method="post" action={path_1.path.to.tableSequence(initialValues.table)} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{"".concat(initialValues.name)} Sequence</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="table"/>
            <react_1.VStack spacing={4}>
              <react_1.Heading size="h2">{makePreview()}</react_1.Heading>

              <Form_1.Input name="prefix" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Prefix"], ["Prefix"])))} onChange={function (e) { return setPrefix(e.target.value); }}/>
              <Form_1.Number name="next" minValue={0} label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Current"], ["Current"])))} onChange={setNext}/>
              <Form_1.Number name="size" minValue={0} maxValue={30} label={t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Size"], ["Size"])))} onChange={setSize}/>
              <Form_1.Number name="step" minValue={0} maxValue={10000} label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["Step"], ["Step"])))}/>
              <Form_1.Input name="suffix" label={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["Suffix"], ["Suffix"])))} onChange={function (e) { return setSuffix(e.target.value); }}/>
              <react_1.VStack spacing={0}>
                <p className="text-muted-foreground text-sm">{"%{yyyy} = Full Year"}</p>
                <p className="text-muted-foreground text-sm">{"%{yy} = Year"}</p>
                <p className="text-muted-foreground text-sm">{"%{mm} = Month"}</p>
                <p className="text-muted-foreground text-sm">{"%{dd} = Day"}</p>
                <p className="text-muted-foreground text-sm">{"%{hh} = Hour"}</p>
                <p className="text-muted-foreground text-sm">{"%{mm} = Minute"}</p>
                <p className="text-muted-foreground text-sm">{"%{ss} = Second"}</p>
              </react_1.VStack>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>
                <macro_1.Trans>Save</macro_1.Trans>
              </Form_1.Submit>
              <react_1.Button size="md" variant="solid" onClick={onClose}>
                <macro_1.Trans>Cancel</macro_1.Trans>
              </react_1.Button>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = SequenceForm;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5;
