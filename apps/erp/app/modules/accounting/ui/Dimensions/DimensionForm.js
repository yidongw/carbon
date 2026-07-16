"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("@carbon/form");
var react_1 = require("@carbon/react");
var react_2 = require("react");
var Form_1 = require("~/components/Form");
var Icons_1 = require("~/components/Icons");
var hooks_1 = require("~/hooks");
var path_1 = require("~/utils/path");
var accounting_models_1 = require("../../accounting.models");
var entityTypeLabels = {
    Custom: "Custom",
    Location: "Location",
    ItemPostingGroup: "Item Group",
    SupplierType: "Supplier Type",
    CustomerType: "Customer Type",
    Department: "Department",
    Employee: "Employee",
    FixedAssetClass: "Asset Class",
    CostCenter: "Cost Center"
};
var DimensionForm = function (_a) {
    var initialValues = _a.initialValues, onClose = _a.onClose;
    var permissions = (0, hooks_1.usePermissions)();
    var isEditing = initialValues.id !== undefined;
    var isDisabled = isEditing
        ? !permissions.can("update", "accounting")
        : !permissions.can("create", "accounting");
    var _b = (0, react_2.useState)(initialValues.entityType), entityType = _b[0], setEntityType = _b[1];
    var isCustom = entityType === "Custom";
    var entityTypeOptions = accounting_models_1.dimensionEntityTypes.map(function (et) { return ({
        value: et,
        label: (<react_1.HStack className="w-full">
        <Icons_1.DimensionEntityTypeIcon entityType={et} className="w-4 h-4 mr-2"/>
        {entityTypeLabels[et]}
      </react_1.HStack>)
    }); });
    return (<react_1.Drawer open onOpenChange={function (open) {
            if (!open)
                onClose();
        }}>
      <react_1.DrawerContent>
        <form_1.ValidatedForm validator={accounting_models_1.dimensionValidator} method="post" action={isEditing
            ? path_1.path.to.dimension(initialValues.id)
            : path_1.path.to.newDimension} defaultValues={initialValues} className="flex flex-col h-full">
          <react_1.DrawerHeader>
            <react_1.DrawerTitle>{isEditing ? "Edit" : "New"} Dimension</react_1.DrawerTitle>
          </react_1.DrawerHeader>
          <react_1.DrawerBody>
            <Form_1.Hidden name="id"/>
            <react_1.VStack spacing={4}>
              <Form_1.Input name="name" label="Name"/>
              <form_1.SelectControlled name="entityType" label="Entity Type" isReadOnly={isEditing} helperText={isEditing ? "Entity type cannot be changed" : undefined} options={entityTypeOptions} value={entityType} onChange={function (option) {
            if (option) {
                setEntityType(option.value);
            }
        }}/>
              {isCustom && <Form_1.Array name="dimensionValues" label="Values"/>}
              <Form_1.Boolean name="active" label="Active"/>
            </react_1.VStack>
          </react_1.DrawerBody>
          <react_1.DrawerFooter>
            <react_1.HStack>
              <Form_1.Submit isDisabled={isDisabled}>Save</Form_1.Submit>
            </react_1.HStack>
          </react_1.DrawerFooter>
        </form_1.ValidatedForm>
      </react_1.DrawerContent>
    </react_1.Drawer>);
};
exports.default = DimensionForm;
