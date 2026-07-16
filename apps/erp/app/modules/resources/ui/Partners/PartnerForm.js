"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PartnerForm = function (_a) {
    // const permissions = usePermissions();
    // const navigate = useNavigate();
    // const onClose = () => navigate(-1);
    // const [supplier, setSupplier] = useState<string | null>(
    //   initialValues.supplierId ?? null
    // );
    var initialValues = _a.initialValues;
    // const isEditing = initialValues.id !== "";
    // const isDisabled = isEditing
    //   ? !permissions.can("update", "resources")
    //   : !permissions.can("create", "resources");
    // const onSupplierChange = (newValue: { value: string } | null) => {
    //   if (newValue) setSupplier(newValue?.value ?? null);
    // };
    return null;
    // return (
    //   <Drawer
    //     open
    //     onOpenChange={(open) => {
    //       if (!open) onClose();
    //     }}
    //   >
    //     <DrawerContent>
    //       <ValidatedForm
    //         validator={partnerValidator}
    //         method="post"
    //         action={
    //           isEditing
    //             ? path.to.partner(initialValues.id, initialValues.abilityId)
    //             : path.to.newPartner
    //         }
    //         defaultValues={initialValues}
    //         className="flex flex-col h-full"
    //       >
    //         <DrawerHeader>
    //           <DrawerTitle>{isEditing ? "Edit" : "New"} Partner</DrawerTitle>
    //           <DrawerDescription>
    //             A partner is combination of a supplier location and and an ability
    //             with a certain amount of time available
    //           </DrawerDescription>
    //         </DrawerHeader>
    //         <DrawerBody>
    //           <VStack spacing={4}>
    //             <Supplier
    //               name="supplierId"
    //               label="Supplier"
    //               disabled={isEditing}
    //               onChange={onSupplierChange}
    //             />
    //             <SupplierLocation
    //               name="id"
    //               supplier={supplier ?? undefined}
    //               disabled={isEditing}
    //             />
    //             {/* <Ability name="abilityId" label="Ability" /> */}
    //             <Number
    //               name="hoursPerWeek"
    //               label="Hours per Week"
    //               helperText="The number of hours per week the supplier is available to work."
    //               minValue={0}
    //               maxValue={10000}
    //             />
    //             <CustomFormFields table="partner" />
    //           </VStack>
    //         </DrawerBody>
    //         <DrawerFooter>
    //           <HStack>
    //             <Submit isDisabled={isDisabled}>Save</Submit>
    //             <Button size="md" variant="solid" onClick={onClose}>
    //               Cancel
    //             </Button>
    //           </HStack>
    //         </DrawerFooter>
    //       </ValidatedForm>
    //     </DrawerContent>
    //   </Drawer>
    // );
};
exports.default = PartnerForm;
