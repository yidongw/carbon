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
import StyleColors from "~/components/Form/StyleColors";
import { ReplenishmentSystemIcon } from "~/components/Icons";
import { useNextItemId, usePermissions, useUser } from "~/hooks";
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
  type?: "card" | "modal";
  onClose?: () => void;
};

function startsWithLetter(value: string) {
  return /^[A-Za-z]/.test(value);
}

const StyleForm = ({
  initialValues,
  type = "card",
  onClose
}: StyleFormProps) => {
  const { t } = useLingui();
  const { company } = useUser();
  const baseCurrency = company?.baseCurrencyCode ?? "USD";

  const fetcher = useFetcher<PostgrestResponse<{ id: string }>>();

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "loading" && fetcher.data?.data) {
      onClose?.();
      toast.success(t`Created style`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(t`Failed to create style: ${fetcher.data.error.message}`);
    }
  }, [fetcher.data, fetcher.state, onClose, type, t]);

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
      <ModalCard onClose={onClose}>
        <ModalCardContent>
          <ValidatedForm
            action={isEditing ? undefined : path.to.newStyle}
            method="post"
            validator={styleValidator}
            defaultValues={initialValues}
            fetcher={fetcher}
          >
            <ModalCardHeader>
              <ModalCardTitle>
                {isEditing ? (
                  <Trans>Style Details</Trans>
                ) : (
                  <Trans>New Style</Trans>
                )}
              </ModalCardTitle>
              {!isEditing && (
                <ModalCardDescription>
                  <Trans>
                    A style contains the information about a garment or footwear
                    item that is cut, bundled, and produced downstream.
                  </Trans>
                </ModalCardDescription>
              )}
            </ModalCardHeader>
            <ModalCardBody>
              <Hidden name="type" value={type} />
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
                <StyleColors
                  name="styleColorIds"
                  label={t`Colors`}
                  maxPreview={3}
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

export default StyleForm;
