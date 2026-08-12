import { ValidatedForm } from "@carbon/form";
import {
  Button,
  cn,
  HStack,
  ModalCard,
  ModalCardBody,
  ModalCardContent,
  ModalCardDescription,
  ModalCardFooter,
  ModalCardHeader,
  ModalCardProvider,
  ModalCardTitle,
  toast
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { z } from "zod";
import { TrackingTypeIcon } from "~/components";
import {
  CustomFormFields,
  DefaultMethodType,
  Hidden,
  Input,
  InputControlled,
  ItemPostingGroup,
  Number,
  Select,
  Submit,
  Template,
  TextArea,
  UnitOfMeasure
} from "~/components/Form";
import ItemAttributeSelects from "~/components/Form/ItemAttributeSelects";
import { ReplenishmentSystemIcon } from "~/components/Icons";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { useNextItemId, usePermissions, useUser } from "~/hooks";
import type { AttributeSetFormOption } from "~/modules/items/itemAttribute.service";
import { path } from "~/utils/path";
import {
  itemReplenishmentSystems,
  itemTrackingTypes
} from "../../items.models";
import { styleValidator } from "../../style.models";
import ItemStorageFields from "../Item/ItemStorageFields";
import ItemThumbnailField from "../Item/ItemThumbnailField";

type StyleFormProps = {
  initialValues: z.infer<typeof styleValidator> & { tags?: string[] };
  type?: "card" | "modal" | "overlay";
  onClose?: () => void;
  /** Prefetched attribute sets from the overlay loader (skips client fetch). */
  attributeSets?: AttributeSetFormOption[];
} & Partial<Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">>;

function startsWithLetter(value: string) {
  return /^[A-Za-z]/.test(value);
}

const StyleForm = ({
  initialValues,
  type = "card",
  onClose,
  onDismiss,
  fetcher: overlayFetcher,
  action: overlayAction,
  attributeSets
}: StyleFormProps) => {
  const { t } = useLingui();
  const { company } = useUser();
  const baseCurrency = company?.baseCurrencyCode ?? "USD";

  const localFetcher = useFetcher<PostgrestResponse<{ id: string }>>();
  const isOverlay = type === "overlay";
  // Overlay host owns the submit fetcher (closes + revalidates on `{ ok: true }`).
  const fetcher = overlayFetcher ?? localFetcher;
  const dismiss = onDismiss ?? onClose;

  useEffect(() => {
    if (type !== "modal") return;

    if (localFetcher.state === "loading" && localFetcher.data?.data) {
      onClose?.();
      toast.success(t`Created style`);
    } else if (localFetcher.state === "idle" && localFetcher.data?.error) {
      toast.error(
        t`Failed to create style: ${localFetcher.data.error.message}`
      );
    }
  }, [localFetcher.data, localFetcher.state, onClose, type, t]);

  const { id, onIdChange, loading } = useNextItemId("Style");
  const permissions = usePermissions();
  const isEditing = !!initialValues.id;

  const idRef = useRef(id);
  idRef.current = id;

  const applyIdFromThumbnail = (fileName: string) => {
    if (idRef.current) return;
    const baseName = fileName.replace(/\.[^/.]+$/, "").trim();
    if (baseName) onIdChange(baseName.toUpperCase());
  };

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

  const [replenishmentSystem, setReplenishmentSystem] = useState<string>(
    initialValues.replenishmentSystem ?? "Buy"
  );
  const [defaultMethodType, setDefaultMethodType] = useState<string>(
    initialValues.defaultMethodType ?? "Pull from Inventory"
  );

  const itemReplenishmentSystemOptions =
    itemReplenishmentSystems.map((itemReplenishmentSystem) => ({
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
    })) ?? [];

  return (
    <ModalCardProvider type={type}>
      <ModalCard onClose={dismiss}>
        <ModalCardContent
          className={cn(
            isOverlay &&
              "flex min-h-0 max-h-[85vh] w-[56rem] max-w-full flex-col"
          )}
        >
          <ValidatedForm
            action={overlayAction ?? (isEditing ? undefined : path.to.newStyle)}
            method="post"
            validator={styleValidator}
            defaultValues={initialValues}
            fetcher={fetcher}
            className={cn(
              isOverlay && "flex min-h-0 max-h-[85vh] flex-1 flex-col"
            )}
          >
            <ModalCardHeader className={cn(isOverlay && "shrink-0")}>
              <ModalCardTitle>
                {isEditing ? (
                  <Trans>Style Details</Trans>
                ) : (
                  <Trans>New Style</Trans>
                )}
              </ModalCardTitle>
              {!isEditing && (
                <ModalCardDescription>
                  <Trans>Garment or footwear for cutting and production.</Trans>
                </ModalCardDescription>
              )}
            </ModalCardHeader>
            <ModalCardBody
              className={cn(isOverlay && "mb-0 min-h-0 flex-1 overflow-y-auto")}
            >
              {/* Overlay success is `{ ok: true }` via `?overlay=true`; Item
                  picker still posts `type=modal` for the 201 close path. */}
              {!isOverlay && <Hidden name="type" value={type} />}
              {!isEditing && (
                <ItemThumbnailField onUpload={applyIdFromThumbnail} />
              )}
              {!isEditing && replenishmentSystem === "Make" && (
                <Hidden name="unitCost" value={initialValues.unitCost} />
              )}
              {!isEditing && replenishmentSystem === "Buy" && (
                <Hidden name="lotSize" value={initialValues.lotSize} />
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
                  <Input name="id" label={t`Style ID`} isReadOnly />
                ) : (
                  <InputControlled
                    name="id"
                    label={t`Style ID`}
                    helperText={
                      startsWithLetter(id)
                        ? t`Use ... to get the next style ID`
                        : undefined
                    }
                    value={id}
                    onChange={onIdChange}
                    isDisabled={loading}
                    isUppercase
                  />
                )}
                <Input
                  name="revision"
                  label={t`Revision`}
                  isReadOnly={isEditing}
                />
                <Input
                  name="name"
                  label={t`Short Description`}
                  characterLimit={40}
                />
                <ItemAttributeSelects
                  itemType="Style"
                  attributeSets={attributeSets}
                />
                <Select
                  name="replenishmentSystem"
                  label={t`Replenishment System`}
                  options={itemReplenishmentSystemOptions}
                  onChange={(newValue) => {
                    setReplenishmentSystem(newValue?.value ?? "Buy");
                    if (newValue?.value === "Buy") {
                      setDefaultMethodType("Pull from Inventory");
                    } else {
                      setDefaultMethodType("Make to Order");
                    }
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
                    setDefaultMethodType(
                      newValue?.value ?? "Pull from Inventory"
                    )
                  }
                />
                <UnitOfMeasure
                  name="unitOfMeasureCode"
                  label={t`Unit of Measure`}
                />
                {!isEditing && (
                  <ItemPostingGroup
                    name="postingGroupId"
                    label={t`Item Group`}
                    isClearable
                  />
                )}
                {!isEditing && (
                  <Template name="templateId" label={t`Template`} />
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
                {!isEditing && replenishmentSystem !== "Buy" && (
                  <Number name="lotSize" label={t`Batch Size`} minValue={0} />
                )}
                <ItemStorageFields />
                <CustomFormFields table="style" tags={initialValues.tags} />
              </div>
              <div className="mt-4 w-full">
                <TextArea name="description" label={t`Long Description`} />
              </div>
            </ModalCardBody>
            <ModalCardFooter className={cn(isOverlay && "shrink-0")}>
              <HStack className="justify-end gap-2">
                {dismiss && (
                  <Button variant="ghost" onClick={dismiss}>
                    <Trans>Cancel</Trans>
                  </Button>
                )}
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
              </HStack>
            </ModalCardFooter>
          </ValidatedForm>
        </ModalCardContent>
      </ModalCard>
    </ModalCardProvider>
  );
};

export default StyleForm;
