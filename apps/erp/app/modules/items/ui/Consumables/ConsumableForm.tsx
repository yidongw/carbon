import { localizeStyleColorName } from "@carbon/database/style-reference";
import { ValidatedForm } from "@carbon/form";
import {
  cn,
  ModalCard,
  ModalCardBody,
  ModalCardContent,
  ModalCardDescription,
  ModalCardFooter,
  ModalCardHeader,
  ModalCardProvider,
  ModalCardTitle,
  toast,
  useMount
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { z } from "zod";
import {
  CustomFormFields,
  DefaultMethodType,
  Hidden,
  Input,
  InputControlled,
  ItemPostingGroup,
  MultiSelect,
  Number,
  Select,
  Submit,
  TextArea,
  UnitOfMeasure
} from "~/components/Form";
import { ReplenishmentSystemIcon, TrackingTypeIcon } from "~/components/Icons";
import { useNextItemId, usePermissions, useUser } from "~/hooks";
import { useFormatValidationError } from "~/utils/formatValidationError";
import { path } from "~/utils/path";
import type { AttributeSetFormOption } from "../../itemAttribute.service";
import { translateItemAttributeCatalogName } from "../../itemAttributeDisplayName";
import {
  consumableValidator,
  itemReplenishmentSystems,
  itemTrackingTypes
} from "../../items.models";
import AttributeSelectionValidator from "../AttributeSelectionValidator";
import ItemStorageFields from "../Item/ItemStorageFields";
import ItemThumbnailField from "../Item/ItemThumbnailField";

type ConsumableFormProps = {
  initialValues: z.infer<typeof consumableValidator> & { tags: string[] };
  /** Optional seed from route loader; form also loads via API for modals. */
  attributeSetOptions?: Array<{ label: string; value: string }>;
  type?: "card" | "modal";
  onClose?: () => void;
};

function startsWithLetter(value: string) {
  return /^[A-Za-z]/.test(value);
}

const ConsumableForm = ({
  initialValues,
  attributeSetOptions: attributeSetOptionsProp = [],
  type = "card",
  onClose
}: ConsumableFormProps) => {
  const { company } = useUser();
  const baseCurrency = company?.baseCurrencyCode ?? "USD";

  const fetcher = useFetcher<PostgrestResponse<{ id: string }>>();
  const attributeSetsFetcher = useFetcher<{
    data: AttributeSetFormOption[];
    error: Error | null;
  }>();
  const { t, i18n } = useLingui();
  const formatError = useFormatValidationError();

  useMount(() => {
    attributeSetsFetcher.load(path.to.api.attributeSetsForType("Consumable"));
  });

  const attributeSets = attributeSetsFetcher.data?.data ?? [];

  const attributeSetOptions = useMemo(() => {
    if (attributeSets.length > 0) {
      return attributeSets.map((s) => ({
        label: translateItemAttributeCatalogName(s.name || s.code, i18n),
        value: s.id
      }));
    }
    return attributeSetOptionsProp;
  }, [attributeSets, attributeSetOptionsProp, i18n]);

  const [attributeSetId, setAttributeSetId] = useState<string>(
    initialValues.attributeSetId ??
      (attributeSetOptionsProp.length === 1
        ? attributeSetOptionsProp[0].value
        : "")
  );

  useEffect(() => {
    if (attributeSetId) return;
    if (attributeSetOptions.length === 1) {
      setAttributeSetId(attributeSetOptions[0].value);
    }
  }, [attributeSetId, attributeSetOptions]);

  const selectedSet = useMemo(() => {
    const effectiveSetId =
      attributeSetId ||
      (attributeSetOptions.length === 1 ? attributeSetOptions[0].value : "");
    return attributeSets.find((s) => s.id === effectiveSetId);
  }, [attributeSets, attributeSetId, attributeSetOptions]);

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "loading" && fetcher.data?.data) {
      onClose?.();
      toast.success(t`Created consumable`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(
        t`Failed to create consumable: ${fetcher.data.error.message}`
      );
    }
  }, [fetcher.data, fetcher.state, onClose, type, t]);

  const { id, onIdChange, loading } = useNextItemId("Consumable");
  const permissions = usePermissions();
  const isEditing = !!initialValues.id;

  // Keep the latest id readable inside async callbacks without re-creating them.
  const idRef = useRef(id);
  idRef.current = id;

  // The uploaded image name becomes the default Consumable ID when unset.
  const applyIdFromThumbnail = (fileName: string) => {
    if (idRef.current) return;
    const baseName = fileName.replace(/\.[^/.]+$/, "").trim();
    if (baseName) onIdChange(baseName.toUpperCase());
  };

  const [defaultMethodType, setDefaultMethodType] = useState<string>(
    initialValues.defaultMethodType ?? "Purchase to Order"
  );
  const [replenishmentSystem, setReplenishmentSystem] = useState<string>(
    initialValues.replenishmentSystem ?? "Buy"
  );
  const itemReplenishmentSystemOptions = itemReplenishmentSystems.map(
    (itemReplenishmentSystem) => ({
      label: (
        <span className="flex items-center gap-2">
          <ReplenishmentSystemIcon type={itemReplenishmentSystem} />
          {itemReplenishmentSystem === "Buy"
            ? t`Buy`
            : itemReplenishmentSystem === "Make"
              ? t`Make`
              : t`Buy and Make`}
        </span>
      ),
      value: itemReplenishmentSystem
    })
  );

  const translateItemTrackingType = (v: string) =>
    v === "Inventory"
      ? t`Inventory`
      : v === "Non-Inventory"
        ? t`Non-Inventory`
        : v === "Serial"
          ? t`Serial`
          : t`Batch`;

  const itemTrackingTypeOptions = itemTrackingTypes.map((itemTrackingType) => ({
    label: (
      <span className="flex items-center gap-2">
        <TrackingTypeIcon type={itemTrackingType} />
        {translateItemTrackingType(itemTrackingType)}
      </span>
    ),
    value: itemTrackingType
  }));

  return (
    <ModalCardProvider type={type}>
      <ModalCard onClose={onClose}>
        <ModalCardContent>
          <ValidatedForm
            action={isEditing ? undefined : path.to.newConsumable}
            method="post"
            validator={consumableValidator}
            defaultValues={initialValues}
            fetcher={fetcher}
          >
            <ModalCardHeader>
              <ModalCardTitle>
                {isEditing ? t`Consumable Details` : t`New Consumable`}
              </ModalCardTitle>
              {!isEditing && (
                <ModalCardDescription>
                  {t`A consumable is a physical item used to make a part that can be used across multiple jobs`}
                </ModalCardDescription>
              )}
            </ModalCardHeader>
            <ModalCardBody>
              <Hidden name="type" value={type} />
              {!isEditing && replenishmentSystem === "Make" && (
                <Hidden name="unitCost" value={initialValues.unitCost} />
              )}
              {!isEditing && (
                <ItemThumbnailField onUpload={applyIdFromThumbnail} />
              )}
              <div
                className={cn(
                  "grid w-full gap-x-8 gap-y-4",
                  isEditing
                    ? "grid-cols-1 md:grid-cols-3"
                    : "grid-cols-1 md:grid-cols-2"
                )}
              >
                {isEditing ? (
                  <Input name="id" label={t`Consumable ID`} isReadOnly />
                ) : (
                  <InputControlled
                    name="id"
                    label={t`Consumable ID`}
                    helperText={
                      startsWithLetter(id)
                        ? t`Use ... to get the next consumable ID`
                        : undefined
                    }
                    value={id}
                    onChange={onIdChange}
                    isDisabled={loading}
                    isUppercase
                    autoFocus
                  />
                )}

                <Input
                  name="name"
                  label={t`Short Description`}
                  characterLimit={40}
                />
                <Select
                  name="replenishmentSystem"
                  label={t`Replenishment System`}
                  options={itemReplenishmentSystemOptions}
                  onChange={(newValue) => {
                    const next = newValue?.value ?? "Buy";
                    setReplenishmentSystem(next);
                    setDefaultMethodType(
                      next === "Buy" ? "Purchase to Order" : "Make to Order"
                    );
                  }}
                />
                <Select
                  name="itemTrackingType"
                  label={t`Tracking Type`}
                  options={itemTrackingTypeOptions}
                />

                <DefaultMethodType
                  name="defaultMethodType"
                  label={t`Default Method Type`}
                  replenishmentSystem={replenishmentSystem}
                  value={defaultMethodType}
                  onChange={(newValue) =>
                    setDefaultMethodType(newValue?.value ?? "Purchase to Order")
                  }
                />
                <UnitOfMeasure
                  name="unitOfMeasureCode"
                  label={t`Unit of Measure`}
                />
                {!isEditing && (
                  <AttributeSelectionValidator
                    id="consumable-attribute-selects"
                    setChosen={!!selectedSet}
                    requiredAttributeIds={
                      selectedSet?.attributes.map((a) => a.id) ?? []
                    }
                  />
                )}
                {!isEditing && attributeSetOptions.length === 1 ? (
                  <Hidden
                    name="attributeSetId"
                    value={attributeSetOptions[0].value}
                  />
                ) : null}
                {!isEditing && attributeSetOptions.length > 1 ? (
                  <Select
                    name="attributeSetId"
                    label={t`Attribute Set`}
                    options={attributeSetOptions}
                    onChange={(option) =>
                      setAttributeSetId(option?.value ?? "")
                    }
                    helperText={t`Fabric, Trim, etc. — drives which variant options this item can have`}
                    formatError={formatError}
                  />
                ) : null}
                {!isEditing &&
                  selectedSet?.attributes.map((attr) => (
                    <MultiSelect
                      key={attr.id}
                      name={`av__${attr.id}`}
                      label={translateItemAttributeCatalogName(attr.name, i18n)}
                      options={attr.options.map((o) => ({
                        value: o.id,
                        label:
                          localizeStyleColorName(o.code, i18n.locale) ||
                          o.name ||
                          o.code,
                        helper: o.code
                      }))}
                      helperText={t`Selected values become variant SKUs`}
                      formatError={formatError}
                    />
                  ))}
                {!isEditing && (
                  <ItemPostingGroup
                    name="postingGroupId"
                    label={t`Item Group`}
                    isClearable
                  />
                )}
                {!isEditing && replenishmentSystem !== "Make" && (
                  <Number
                    name="unitCost"
                    label={t`Unit Cost`}
                    formatOptions={{
                      style: "currency",
                      currency: baseCurrency
                    }}
                    minValue={0}
                  />
                )}

                <ItemStorageFields />

                <CustomFormFields
                  table="consumable"
                  tags={initialValues.tags}
                />
              </div>
              <div className="mt-4 w-full">
                <TextArea name="description" label={t`Long Description`} />
              </div>
            </ModalCardBody>
            <ModalCardFooter>
              <Submit
                isLoading={fetcher.state !== "idle"}
                isDisabled={
                  isEditing
                    ? !permissions.can("update", "parts")
                    : !permissions.can("create", "parts")
                }
              >
                <Trans>Save</Trans>
              </Submit>
            </ModalCardFooter>
          </ValidatedForm>
        </ModalCardContent>
      </ModalCard>
    </ModalCardProvider>
  );
};

export default ConsumableForm;
