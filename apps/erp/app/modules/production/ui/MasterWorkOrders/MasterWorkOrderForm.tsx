import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import type { z } from "zod";
import {
  DatePicker,
  Hidden,
  Item,
  Location,
  Select,
  Submit
} from "~/components/Form";
import { useConfigurableItems } from "~/components/Form/Item";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions, useUser } from "~/hooks";
import { deadlineTypes, masterWorkOrderValidator } from "~/modules/production";
import { getDeadlineIcon } from "~/modules/production/ui/Jobs/Deadline";
import { useDeadlineTypeLabel } from "~/modules/production/ui/Jobs/jobLabels";
import { QuantityWithVariantsQuantity } from "~/modules/production/ui/Jobs/QuantityWithVariantsQuantity";
import {
  toVariantsQuantityValue,
  useVariantsQuantityModal
} from "~/modules/production/ui/Jobs/VariantsQuantityModal";
import type { Row } from "~/modules/production/ui/Jobs/variantsQuantityShared";
import { isVariantsQuantityOverlaySuccess } from "../../variantsQuantityOverlay";

type MasterWorkOrderFormProps = {
  initialValues: z.infer<typeof masterWorkOrderValidator>;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

const MasterWorkOrderForm = ({
  initialValues,
  onDismiss,
  fetcher,
  action
}: MasterWorkOrderFormProps) => {
  const permissions = usePermissions();
  const { defaults } = useUser();
  const { t } = useLingui();
  const variantsQuantityModal = useVariantsQuantityModal();
  const getDeadlineTypeLabel = useDeadlineTypeLabel();
  // Company-scoped attribute-backed items for the qty grid.
  const configurableItemIds = useConfigurableItems();

  const isDisabled = !permissions.can("create", "production");

  const [itemId, setItemId] = useState(initialValues.itemId ?? "");
  const [quantity, setQuantity] = useState(initialValues.quantity ?? 0);
  // Qty grid only for items with attribute selections — not legacy Part
  // configurationParameters.
  const hasVariantsQuantity = configurableItemIds.includes(itemId);
  const [variantsQuantityRows, setVariantsQuantityRows] = useState<
    Row[] | null
  >(null);
  const [variantsQuantityTotal, setVariantsQuantityTotal] = useState(0);

  const onItemChange = (nextItemId: string) => {
    setItemId(nextItemId);
    setVariantsQuantityRows(null);
    setVariantsQuantityTotal(0);
  };

  const applyConfig = (data: unknown) => {
    if (!isVariantsQuantityOverlaySuccess(data)) return;
    setVariantsQuantityRows(data.configuration.configTable);
    setVariantsQuantityTotal(data.total);
    if (data.total > 0) setQuantity(data.total);
  };

  const openVariantsQuantity = () => {
    if (!itemId) return;
    variantsQuantityModal.open({
      itemId,
      configuration: toVariantsQuantityValue(variantsQuantityRows),
      onConfirm: applyConfig
    });
  };

  return (
    <>
      <ValidatedForm
        validator={masterWorkOrderValidator}
        method="post"
        action={action}
        defaultValues={{
          ...initialValues,
          locationId: initialValues.locationId || defaults?.locationId || ""
        }}
        fetcher={fetcher}
        className="flex flex-col h-full"
      >
        <DrawerHeader>
          <DrawerTitle>
            <Trans>New Master Work Order</Trans>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <VStack spacing={4}>
            <Item
              name="itemId"
              label={t`Style`}
              type="Style"
              validItemTypes={["Style"]}
              onChange={(value) => onItemChange(value?.value ?? "")}
            />
            <QuantityWithVariantsQuantity
              name="quantity"
              label={t`Quantity`}
              value={quantity}
              minValue={0}
              isReadOnly={variantsQuantityTotal > 0}
              onChange={setQuantity}
              variantsQuantityTotal={variantsQuantityTotal}
              hasVariantsQuantity={hasVariantsQuantity}
              onOpenVariantsQuantity={openVariantsQuantity}
            />
            <Location name="locationId" label={t`Location`} />
            <DatePicker name="dueDate" label={t`Due Date`} />
            <Select
              name="deadlineType"
              label={t`Deadline Type`}
              options={deadlineTypes.map((d) => ({
                value: d,
                label: (
                  <div className="flex gap-1 items-center">
                    {getDeadlineIcon(d)}
                    <span>{getDeadlineTypeLabel(d)}</span>
                  </div>
                )
              }))}
            />
            <Hidden
              name="configuration"
              value={
                variantsQuantityRows
                  ? JSON.stringify({
                      configTable: variantsQuantityRows
                    })
                  : ""
              }
            />
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <HStack>
            <Submit isDisabled={isDisabled}>
              <Trans>Save</Trans>
            </Submit>
            <Button variant="solid" type="button" onClick={onDismiss}>
              <Trans>Cancel</Trans>
            </Button>
          </HStack>
        </DrawerFooter>
      </ValidatedForm>
      {variantsQuantityModal.node}
    </>
  );
};

export default MasterWorkOrderForm;
