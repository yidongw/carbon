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
var Form_1 = require("~/components/Form");
var hooks_1 = require("~/hooks");
var settings_1 = require("~/modules/settings");
var shared_1 = require("~/modules/shared");
var path_1 = require("~/utils/path");
var CustomFieldForm = function (_a) {
    var _b, _c;
    var initialValues = _a.initialValues, dataTypes = _a.dataTypes, onClose = _a.onClose;
    var t = (0, macro_1.useLingui)().t;
    var permissions = (0, hooks_1.usePermissions)();
    var table = (0, react_router_1.useParams)().table;
    if (!table)
        throw new Error("table is not found");
    var routeData = (0, hooks_1.useRouteData)(path_1.path.to.customFieldsTable(table));
    var options = (_b = dataTypes === null || dataTypes === void 0 ? void 0 : dataTypes.map(function (dt) { return ({
        value: dt.id.toString(),
        label: (<react_1.HStack className="w-full">
          <CustomFieldDataTypeIcon type={dt.id} className="mr-2"/>
          {dt.label}
        </react_1.HStack>)
    }); })) !== null && _b !== void 0 ? _b : [];
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "resources")
        : !permissions.can("create", "resources");
    var _d = (0, react_2.useState)(initialValues.dataTypeId.toString()), dataType = _d[0], setDataType = _d[1];
    var isList = Number(dataType) === shared_1.DataType.List;
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={settings_1.customFieldValidator} method="post" action={isEditing
            ? path_1.path.to.customField(table, initialValues.table)
            : path_1.path.to.newCustomField(table)} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>
              {isEditing ? (<macro_1.Trans>Edit Custom Field</macro_1.Trans>) : (<macro_1.Trans>New Custom Field</macro_1.Trans>)}
            </react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label={t(templateObject_1 || (templateObject_1 = __makeTemplateObject(["Name"], ["Name"])))}/>
              <Form_1.Hidden name="table"/>

              <form_1.SelectControlled name="dataTypeId" label={t(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Data Type"], ["Data Type"])))} isReadOnly={isEditing} helperText={isEditing ? t(templateObject_3 || (templateObject_3 = __makeTemplateObject(["Data type cannot be changed"], ["Data type cannot be changed"]))) : undefined} options={options} value={dataType.toString()} onChange={function (option) {
            if (option) {
                setDataType(option.value);
            }
        }}/>
              {isList && <Form_1.Array name="listOptions" label={t(templateObject_4 || (templateObject_4 = __makeTemplateObject(["List Options"], ["List Options"])))}/>}

              {shared_1.tablesWithTags.includes(table) && (<Form_1.Tags table={table} name="tags" availableTags={(_c = routeData === null || routeData === void 0 ? void 0 : routeData.tags) !== null && _c !== void 0 ? _c : []} helperText={t(templateObject_5 || (templateObject_5 = __makeTemplateObject(["These custom fields will only be available for entities with the same tags"], ["These custom fields will only be available for entities with the same tags"])))}/>)}

              <Form_1.Boolean name="required" label={t(templateObject_6 || (templateObject_6 = __makeTemplateObject(["Required"], ["Required"])))}/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit withBlocker={false} isDisabled={isDisabled}>
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
exports.default = CustomFieldForm;
function CustomFieldDataTypeIcon(_a) {
    var type = _a.type, className = _a.className;
    switch (type) {
        case shared_1.DataType.Numeric:
            return <lu_1.LuHash className={(0, react_1.cn)("w-4 h-4 text-blue-600", className)}/>;
        case shared_1.DataType.Text:
            return <lu_1.LuType className={(0, react_1.cn)("w-4 h-4 text-emerald-600", className)}/>;
        case shared_1.DataType.Boolean:
            return (<lu_1.LuToggleLeft className={(0, react_1.cn)("w-4 h-4 text-purple-600", className)}/>);
        case shared_1.DataType.List:
            return <lu_1.LuList className={(0, react_1.cn)("w-4 h-4 text-orange-600", className)}/>;
        case shared_1.DataType.Date:
            return <lu_1.LuCalendar className={(0, react_1.cn)("w-4 h-4 text-red-600", className)}/>;
        case shared_1.DataType.User:
            return <lu_1.LuUser className={(0, react_1.cn)("w-4 h-4 text-yellow-600", className)}/>;
        case shared_1.DataType.Customer:
            return (<lu_1.LuSquareUser className={(0, react_1.cn)("w-4 h-4 text-foreground", className)}/>);
        case shared_1.DataType.Supplier:
            return (<lu_1.LuContainer className={(0, react_1.cn)("w-4 h-4 text-emerald-600", className)}/>);
        case shared_1.DataType.File:
            return <lu_1.LuFile className={(0, react_1.cn)("w-4 h-4 text-indigo-600", className)}/>;
        default:
            return null;
    }
}
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
