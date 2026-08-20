import { useCarbon } from "@carbon/auth";
import type { ComboboxProps } from "@carbon/form";
import { useControlField, useField } from "@carbon/form";
import {
  Button,
  CreatableCombobox,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useDisclosure,
  useMount
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuFilter } from "react-icons/lu";
import { useFetcher } from "react-router";
import { useUser } from "~/hooks";
import ConsumableForm from "~/modules/items/ui/Consumables/ConsumableForm";
import MaterialForm from "~/modules/items/ui/Materials/MaterialForm";
import PartForm from "~/modules/items/ui/Parts/PartForm";
import StyleForm from "~/modules/items/ui/Styles/StyleForm";
import ToolForm from "~/modules/items/ui/Tools/ToolForm";
import type { MethodItemType } from "~/modules/shared";
import { methodItemType } from "~/modules/shared";
import { useItems } from "~/stores";
import { path } from "~/utils/path";
import { MethodItemTypeIcon } from "../Icons";

type ItemSelectProps = Omit<ComboboxProps, "options" | "type" | "inline"> & {
  isReadOnly?: boolean;
  blacklist?: string[];
  includeInactive?: boolean;
  inline?: boolean;
  isConfigured?: boolean;
  locationId?: string;
  replenishmentSystem?: "Buy" | "Make";
  type: MethodItemType | "Item";
  typeFieldName?: string;
  validItemTypes?: MethodItemType[];
  /**
   * BOM component picker mode. Default pickers list variant PARENTS; when set,
   * this picker instead lists the leaf variant SKUs (labeled "parent · color")
   * and hides any item that is a variant parent — you consume a concrete SKU,
   * not the abstract template. Scoped to the BOM material picker; other pickers
   * keep browsing parents.
   */
  variantSKUs?: boolean;
  whitelist?: string[];
  onConfigure?: () => void;
  onTypeChange?: (type: MethodItemType | "Item") => void;
};

const ItemPreview = (
  value: string,
  options: { value: string; label: string | JSX.Element }[]
) => {
  const item = options.find((o) => o.value === value);
  if (!item) return null;
  return <span>{item.label}</span>;
};

const useTranslatedItemType = () => {
  const { t } = useLingui();
  return (type: MethodItemType | "Item") => {
    switch (type) {
      case "Item":
        return t`Item`;
      case "Style":
        return t`Style`;
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
};

const Item = ({
  name,
  label,
  helperText,
  isConfigured = false,
  isOptional,
  type = "Part",
  typeFieldName = "itemType",
  validItemTypes,
  onConfigure,
  onTypeChange,
  isReadOnly = false,
  variantSKUs = false,
  ...props
}: ItemSelectProps) => {
  const { t } = useLingui();
  const translateItemType = useTranslatedItemType();
  const [items] = useItems();
  const { carbon } = useCarbon();
  const { company } = useUser();
  // Variant SKU children are excluded from the items store (parents only in
  // pickers). After SO/PO/BOM expand the selected value is a child — keep a
  // display option so the combobox isn't blank.
  const [orphanOption, setOrphanOption] = useState<{
    value: string;
    label: string;
    helper: string;
    helperRight: string | undefined;
  } | null>(null);

  // BOM component picker: pull the leaf variant SKUs (parents are hidden). Each
  // row carries its parentItemId (to drop the parent) and a display combo; the
  // parent's name/readableId come from the items store below.
  const variantFetcher = useFetcher<{
    data:
      | { variantItemId: string; parentItemId: string; attributes: string }[]
      | null;
  }>();
  const requestedVariants = useRef(false);
  useEffect(() => {
    if (variantSKUs && !requestedVariants.current) {
      requestedVariants.current = true;
      variantFetcher.load(path.to.api.itemBomVariants);
    }
  }, [variantSKUs, variantFetcher]);
  const variantSkuRows = variantFetcher.data?.data;

  const options = useMemo(() => {
    // BOM mode: any item that is a variant parent is excluded from the picker;
    // its leaf SKUs are appended below instead.
    const variantParentIds = variantSKUs
      ? new Set((variantSkuRows ?? []).map((r) => r.parentItemId))
      : null;

    let results = items
      .filter((item) => {
        // Hide variant parents in BOM mode — consume the SKU, not the template.
        if (variantParentIds?.has(item.id)) return false;

        // Filter by type
        // @ts-expect-error
        if (validItemTypes && !validItemTypes.includes(item.type)) return false;

        if (type !== "Item" && type !== item.type) return false;

        // Filter by active status
        // Filter by active status
        if (!props.includeInactive && !item.active) return false;

        // Filter by replenishment system
        if (props.replenishmentSystem) {
          const systemMatches =
            item.replenishmentSystem === props.replenishmentSystem ||
            item.replenishmentSystem === "Buy and Make" ||
            props.replenishmentSystem === item.replenishmentSystem;

          if (!systemMatches) return false;
        }

        return true;
      })
      .map((item) => {
        const scopedQuantity = props.locationId
          ? item.quantityByLocation?.[props.locationId]
          : item.quantityOnHand;
        return {
          value: item.id,
          label: item.readableIdWithRevision,
          helper: item.name,
          helperRight:
            scopedQuantity !== undefined
              ? `${scopedQuantity} ${item.unitOfMeasureCode}`
              : undefined
        };
      });

    // Append leaf variant SKUs, displayed as "parent name · attributes" (the
    // parent's own name/readableId come from the store; the variant's own
    // name/readableId are intentionally not used).
    if (variantSKUs && variantSkuRows?.length) {
      const parentsById = new Map(items.map((item) => [item.id, item]));
      const variantOptions = variantSkuRows
        .map((row) => {
          const parent = parentsById.get(row.parentItemId);
          if (!parent) return null;

          // @ts-expect-error
          if (validItemTypes && !validItemTypes.includes(parent.type))
            return null;
          if (type !== "Item" && type !== parent.type) return null;
          if (!props.includeInactive && !parent.active) return null;

          const combo = row.attributes
            ? ` · ${row.attributes.replaceAll("|", " · ")}`
            : "";
          return {
            value: row.variantItemId,
            label: `${parent.name}${combo}`,
            helper: parent.readableIdWithRevision,
            helperRight: undefined
          };
        })
        .filter((o): o is NonNullable<typeof o> => o !== null)
        .sort((a, b) => a.label.localeCompare(b.label));
      results = [...results, ...variantOptions];
    }

    if (props.whitelist) {
      results = results.filter((item) => props.whitelist?.includes(item.value));
    }

    if (props.blacklist) {
      results = results.filter(
        (item) => !props.blacklist?.includes(item.value)
      );
    }

    if (
      orphanOption &&
      !results.some((item) => item.value === orphanOption.value)
    ) {
      results = [orphanOption, ...results];
    }

    return results;
  }, [
    items,
    orphanOption,
    props?.includeInactive,
    props.blacklist,
    props.locationId,
    props.replenishmentSystem,
    props.whitelist,
    type,
    validItemTypes,
    variantSKUs,
    variantSkuRows
  ]);

  const selectTypeModal = useDisclosure();
  const newItemsModal = useDisclosure();
  const [created, setCreated] = useState<string>("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    getInputProps,
    error,
    validate,
    clearError,
    isOptional: fieldIsOptional
  } = useField(name);
  const [value, setValue] = useControlField<string | undefined>(name);
  const resolvedIsOptional = isOptional ?? fieldIsOptional ?? false;
  const hasMounted = useRef(false);

  useEffect(() => {
    if (props.value !== null && props.value !== undefined)
      setValue(props.value);
  }, [props.value, setValue]);

  // Parent-driven picks (controlled `value`) update the store without going
  // through the combobox onChange — clear a stale required error when a real
  // value lands (same pattern as SelectControlled).
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (props.value) {
      clearError();
    }
  }, [props.value, clearError]);

  useEffect(() => {
    if (!value) {
      setOrphanOption(null);
      return;
    }
    if (items.some((item) => item.id === value)) {
      // Present in the store but maybe filtered out of options (type / active).
      const storeItem = items.find((item) => item.id === value);
      if (storeItem) {
        setOrphanOption({
          value: storeItem.id,
          label: storeItem.readableIdWithRevision,
          helper: storeItem.name,
          helperRight: undefined
        });
      }
      return;
    }
    if (!carbon || !company.id) return;

    let cancelled = false;
    void (async () => {
      const result = await carbon
        .from("item")
        .select("id, name, readableIdWithRevision")
        .eq("id", value)
        .eq("companyId", company.id)
        .maybeSingle();
      if (cancelled || !result.data) return;
      setOrphanOption({
        value: result.data.id,
        label: result.data.readableIdWithRevision ?? result.data.id,
        helper: result.data.name,
        helperRight: undefined
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [value, items, carbon, company.id]);

  const onChange = (value: string) => {
    if (value) {
      props?.onChange?.(options.find((o) => o.value === value) ?? null);
    } else {
      props?.onChange?.(null);
    }
  };

  const canSwitchItemType = typeof onTypeChange === "function";
  const submitRef = useRef<HTMLButtonElement>(null);
  const handleCreateClose = () => {
    setCreated("");
    newItemsModal.onClose();
    triggerRef.current?.click();
  };

  return (
    <>
      <FormControl isInvalid={!!error} className="w-full">
        {type && (
          <FormLabel
            htmlFor={name}
            isConfigured={isConfigured}
            isOptional={resolvedIsOptional}
            onConfigure={onConfigure}
          >
            {translateItemType(type)}
          </FormLabel>
        )}
        <input
          {...getInputProps({
            id: name
          })}
          type="hidden"
          name={name}
          id={name}
          value={value}
        />
        <input
          type="hidden"
          name={typeFieldName}
          id={typeFieldName}
          value={type}
        />
        <div className="flex flex-grow items-start min-w-0 relative">
          <CreatableCombobox
            className={cn("flex-grow min-w-0")}
            ref={triggerRef}
            options={options}
            {...props}
            inline={props.inline ? ItemPreview : undefined}
            value={value?.replace(/"/g, '\\"')}
            onChange={(newValue) => {
              setValue(newValue?.replace(/"/g, '\\"') ?? "");
              onChange(newValue?.replace(/"/g, '\\"') ?? "");
              // Value lands via useControlField, not the hidden input's onChange
              // — revalidate or a submitted "Part is required" stays after pick.
              validate();
            }}
            label={
              label === "Item"
                ? t`Item`
                : label === "Style"
                  ? t`Style`
                  : label === "Part"
                    ? t`Part`
                    : label === "Material"
                      ? t`Material`
                      : label === "Tool"
                        ? t`Tool`
                        : label === "Consumable"
                          ? t`Consumable`
                          : undefined
            }
            itemHeight={44}
            onCreateOption={(option) => {
              if (type === "Item") {
                selectTypeModal.onOpen();
                setCreated(option);
              } else {
                newItemsModal.onOpen();
                setCreated(option);
              }
            }}
          />
          {canSwitchItemType && !props.inline && (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger>
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      type="button"
                      aria-label={t`Change Type`}
                      className={cn(
                        "absolute right-0 top-0 bg-card dark:bg-card flex-shrink-0 h-10 w-10 px-3 rounded-l-none before:rounded-l-none border -ml-px shadow-none hover:shadow-button-base"
                      )}
                      variant="secondary"
                      size={props.inline ? "sm" : "md"}
                      icon={
                        type === "Item" ? (
                          <LuFilter className="size-3" />
                        ) : (
                          <MethodItemTypeIcon type={type} />
                        )
                      }
                    />
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <Trans>
                    Change the item type (e.g. Part, Material, Tool, etc.)
                  </Trans>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={type}
                  // @ts-expect-error
                  onValueChange={onTypeChange}
                >
                  <DropdownMenuRadioItem
                    value="Item"
                    className="flex items-center gap-2"
                  >
                    <LuFilter className="h-4 w-4" />
                    <span>
                      <Trans>All Items</Trans>
                    </span>
                  </DropdownMenuRadioItem>
                  {Object.values(methodItemType)
                    .filter(
                      (itemType) =>
                        validItemTypes === undefined ||
                        (Array.isArray(validItemTypes) &&
                          validItemTypes.includes(itemType))
                    )
                    .map((itemType) => (
                      <DropdownMenuRadioItem
                        key={itemType}
                        value={itemType}
                        className="flex items-center gap-2"
                      >
                        <MethodItemTypeIcon type={itemType} />
                        <span>{translateItemType(itemType)}</span>
                      </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {error ? (
          <FormErrorMessage>{error}</FormErrorMessage>
        ) : (
          helperText && <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
      {selectTypeModal.isOpen && (
        <Modal
          open
          onOpenChange={(open) => {
            if (!open) {
              selectTypeModal.onClose();
            }
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
                    onClick={() => {
                      onTypeChange?.(itemType);
                      setTimeout(() => {
                        submitRef.current?.focus();
                      }, 0);
                    }}
                  >
                    {translateItemType(itemType)}
                  </Button>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  selectTypeModal.onClose();
                }}
              >
                <Trans>Cancel</Trans>
              </Button>
              <Button
                ref={submitRef}
                isDisabled={type === "Item"}
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
        <PartForm
          type="modal"
          onClose={() => {
            setCreated("");
            newItemsModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            id: "",
            revision: "0",
            name: created,
            description: "",
            itemTrackingType: "Inventory",
            replenishmentSystem: props?.replenishmentSystem ?? "Make",
            unitOfMeasureCode: "EA",
            defaultMethodType:
              props?.replenishmentSystem === "Buy"
                ? "Pull from Inventory"
                : "Make to Order",
            unitCost: 0,
            lotSize: 0,
            shelfLifeCalculateFromBom: false,
            tags: []
          }}
        />
      )}
      {type === "Style" && newItemsModal.isOpen && (
        <StyleForm
          type="modal"
          onClose={handleCreateClose}
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
      )}
      {type === "Consumable" && newItemsModal.isOpen && (
        <ConsumableForm
          type="modal"
          onClose={() => {
            setCreated("");
            newItemsModal.onClose();
            triggerRef.current?.click();
          }}
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
      )}
      {type === "Material" && newItemsModal.isOpen && (
        <MaterialForm
          type="modal"
          onClose={() => {
            setCreated("");
            newItemsModal.onClose();
            triggerRef.current?.click();
          }}
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
      )}
      {/* TODO: Add service */}
      {type === "Tool" && newItemsModal.isOpen && (
        <ToolForm
          type="modal"
          onClose={() => {
            setCreated("");
            newItemsModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            id: "",
            revision: "0",
            name: created,
            description: "",
            itemTrackingType: "Inventory",
            unitOfMeasureCode: "EA",
            replenishmentSystem: props?.replenishmentSystem ?? "Buy",
            defaultMethodType:
              props?.replenishmentSystem === "Buy"
                ? "Pull from Inventory"
                : "Make to Order",
            unitCost: 0,
            shelfLifeCalculateFromBom: false,
            tags: []
          }}
        />
      )}
    </>
  );
};

Item.displayName = "Item";

export default Item;

/** @param forMethods — legacy configurationParameter items (Make Method tools). */
export const useConfigurableItems = (forMethods: boolean = false) => {
  const configurableItemsLoader = useFetcher<{
    data: { itemId: string }[] | null;
  }>();

  useMount(() => {
    const url = forMethods
      ? `${path.to.api.itemConfigurable}?for=methods`
      : path.to.api.itemConfigurable;
    configurableItemsLoader.load(url);
  });

  const configurableItemIds = useMemo(() => {
    return (configurableItemsLoader.data?.data ?? []).map((c) => c.itemId);
  }, [configurableItemsLoader.data?.data]);

  return configurableItemIds;
};
