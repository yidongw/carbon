import { ValidatedForm } from "@carbon/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  cn
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useState } from "react";
import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import type { z } from "zod";
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
  TextArea,
  UnitOfMeasure
} from "~/components/Form";
import { TrackingTypeIcon } from "~/components/Icons";
import { useNewEntityForm } from "~/components/NewEntityModal";
import { useNextItemId, usePermissions, useUser } from "~/hooks";
import { path } from "~/utils/path";
import { consumableValidator, itemTrackingTypes } from "../../items.models";
import ItemStorageFields from "../Item/ItemStorageFields";

type ConsumableFormProps = {
  initialValues?: Partial<
    z.infer<typeof consumableValidator> & { tags: string[] }
  >;
  fetcher?: FetcherWithComponents<PostgrestResponse<{ id: string }>>;
};

function startsWithLetter(value: string) {
  return /^[A-Za-z]/.test(value);
}

const ConsumableForm = ({
  initialValues: initialValuesProp,
  fetcher
}: ConsumableFormProps) => {
  const { company } = useUser();
  const baseCurrency = company?.baseCurrencyCode ?? "USD";
  const initialValues = {
    id: "",
    name: "",
    description: "",
    itemTrackingType: "Non-Inventory" as const,
    replenishmentSystem: "Buy" as const,
    defaultMethodType: "Purchase to Order" as const,
    unitOfMeasureCode: "EA",
    unitCost: 0,
    shelfLifeCalculateFromBom: false,
    tags: [],
    ...initialValuesProp
  };

  const modalFetcher = useNewEntityForm<{ id: string }>(path.to.newConsumable);
  const internalFetcher = useFetcher<PostgrestResponse<{ id: string }>>();
  const submitFetcher = fetcher ?? modalFetcher ?? internalFetcher;
  const { t } = useLingui();

  const { id, onIdChange, loading } = useNextItemId("Consumable");
  const permissions = usePermissions();
  const isEditing = !!initialValues.id;

  const [defaultMethodType, setDefaultMethodType] = useState<string>(
    initialValues.defaultMethodType ?? "Purchase to Order"
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
    <Card>
      <ValidatedForm
        action={isEditing ? undefined : path.to.newConsumable}
        method="post"
        validator={consumableValidator}
        defaultValues={initialValues}
        fetcher={submitFetcher}
      >
        <CardHeader className="pr-14 sm:pr-16">
          <CardTitle>
            {isEditing ? t`Consumable Details` : t`New Consumable`}
          </CardTitle>
          {!isEditing && (
            <CardDescription>
              {t`A consumable is a physical item used to make a part that can be used across multiple jobs`}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Hidden name="replenishmentSystem" value="Buy" />
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

            <Input name="name" label={t`Short Description`} />
            <Select
              name="itemTrackingType"
              label={t`Tracking Type`}
              options={itemTrackingTypeOptions}
            />
            {isEditing && (
              <TextArea name="description" label={t`Long Description`} />
            )}

            <DefaultMethodType
              name="defaultMethodType"
              label={t`Default Method Type`}
              replenishmentSystem="Buy"
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
              <ItemPostingGroup
                name="postingGroupId"
                label={t`Item Group`}
                isClearable
              />
            )}
            {!isEditing && (
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

            <CustomFormFields table="consumable" tags={initialValues.tags} />
          </div>
        </CardContent>
        <CardFooter>
          <Submit
            isLoading={submitFetcher.state !== "idle"}
            isDisabled={
              isEditing
                ? !permissions.can("update", "parts")
                : !permissions.can("create", "parts")
            }
          >
            <Trans>Save</Trans>
          </Submit>
        </CardFooter>
      </ValidatedForm>
    </Card>
  );
};

export default ConsumableForm;
