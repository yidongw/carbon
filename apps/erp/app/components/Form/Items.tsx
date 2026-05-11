import type { CreatableMultiSelectProps } from "@carbon/form";
import { CreatableMultiSelect } from "@carbon/form";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  useDisclosure
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useMemo, useRef, useState } from "react";
import { EntityFormModal } from "~/components/NewEntityModal";
import { ConsumableForm } from "~/modules/items/ui/Consumables";
import { MaterialForm } from "~/modules/items/ui/Materials";
import { PartForm } from "~/modules/items/ui/Parts";
import { ToolForm } from "~/modules/items/ui/Tools";
import type { MethodItemType } from "~/modules/shared";
import { methodItemType } from "~/modules/shared";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import { MethodItemTypeIcon } from "../Icons";

type ItemsSelectProps = Omit<CreatableMultiSelectProps, "options">;

const Items = (props: ItemsSelectProps) => {
  const { t } = useLingui();
  const translateType = (type: MethodItemType) => {
    switch (type) {
      case "Part":
        return t`Part`;
      case "Material":
        return t`Material`;
      case "Tool":
        return t`Tool`;
      case "Consumable":
        return t`Consumable`;
      default:
        return type;
    }
  };
  const [items] = useItems();
  const selectTypeModal = useDisclosure();
  const newItemsModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const [type, setType] = useState<MethodItemType>("Part");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const options = useMemo(
    () =>
      items
        .filter((item) => item.active)
        .map((item) => ({
          value: item.id,
          label: item.readableIdWithRevision,
          helper: item.name
        })),
    [items]
  );

  const handleCreateClose = () => {
    setCreated("");
    newItemsModal.onClose();
    triggerRef.current?.click();
  };

  return (
    <>
      <CreatableMultiSelect
        ref={triggerRef}
        options={options}
        {...props}
        label={props?.label ?? "Items"}
        createLabel={t`Item`}
        onCreateOption={(value) => {
          setCreated(value);
          selectTypeModal.onOpen();
        }}
      />

      {selectTypeModal.isOpen && (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) selectTypeModal.onClose();
          }}
        >
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <Trans>Select Item Type</Trans>
              </ModalTitle>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-4">
                {Object.values(methodItemType).map((itemType) => (
                  <Button
                    key={itemType}
                    leftIcon={<MethodItemTypeIcon type={itemType} />}
                    className="flex w-full"
                    variant={type === itemType ? "primary" : "secondary"}
                    size="lg"
                    onClick={() => setType(itemType)}
                  >
                    {translateType(itemType)}
                  </Button>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => selectTypeModal.onClose()}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                onClick={() => {
                  selectTypeModal.onClose();
                  newItemsModal.onOpen();
                }}
              >
                <Trans>Create</Trans>
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {type === "Part" && newItemsModal.isOpen && (
        <EntityFormModal entity="part" onClose={handleCreateClose}>
          <PartForm
            action={`${path.to.newPart}`}
            initialValues={{
              id: "",
              revision: "0",
              name: created,
              description: "",
              itemTrackingType: "Inventory",
              replenishmentSystem: "Make",
              unitOfMeasureCode: "EA",
              defaultMethodType: "Make to Order",
              unitCost: 0,
              lotSize: 0,
              shelfLifeCalculateFromBom: false,
              tags: []
            }}
          />
        </EntityFormModal>
      )}
      {type === "Material" && newItemsModal.isOpen && (
        <EntityFormModal entity="material" onClose={handleCreateClose}>
          <MaterialForm
            action={`${path.to.newMaterial}`}
            initialValues={{
              id: "",
              name: created,
              description: "",
              materialFormId: "",
              materialSubstanceId: "",
              itemTrackingType: "Inventory",
              unitOfMeasureCode: "EA",
              replenishmentSystem: "Buy",
              defaultMethodType: "Pull from Inventory",
              unitCost: 0,
              shelfLifeCalculateFromBom: false,
              tags: []
            }}
          />
        </EntityFormModal>
      )}
      {type === "Tool" && newItemsModal.isOpen && (
        <EntityFormModal entity="tool" onClose={handleCreateClose}>
          <ToolForm
            action={`${path.to.newTool}`}
            initialValues={{
              id: "",
              revision: "0",
              name: created,
              description: "",
              itemTrackingType: "Inventory",
              unitOfMeasureCode: "EA",
              replenishmentSystem: "Buy",
              defaultMethodType: "Pull from Inventory",
              unitCost: 0,
              shelfLifeCalculateFromBom: false,
              tags: []
            }}
          />
        </EntityFormModal>
      )}
      {type === "Consumable" && newItemsModal.isOpen && (
        <EntityFormModal entity="consumable" onClose={handleCreateClose}>
          <ConsumableForm
            action={`${path.to.newConsumable}`}
            initialValues={{
              id: "",
              name: created,
              description: "",
              itemTrackingType: "Non-Inventory",
              unitOfMeasureCode: "EA",
              replenishmentSystem: "Buy",
              defaultMethodType: "Pull from Inventory",
              unitCost: 0,
              shelfLifeCalculateFromBom: false,
              tags: []
            }}
          />
        </EntityFormModal>
      )}
    </>
  );
};

Items.displayName = "Items";

export default Items;
