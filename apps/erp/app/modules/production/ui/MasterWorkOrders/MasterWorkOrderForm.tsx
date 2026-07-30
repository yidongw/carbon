import { useCarbon } from "@carbon/auth";
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
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions, useUser } from "~/hooks";
import { deadlineTypes, masterWorkOrderValidator } from "~/modules/production";
import {
  toConfigTableValue,
  useConfigTableModal
} from "~/modules/production/ui/Jobs/ConfigParamsTableModal";
import type { Row } from "~/modules/production/ui/Jobs/configTableShared";
import { getDeadlineIcon } from "~/modules/production/ui/Jobs/Deadline";
import { useDeadlineTypeLabel } from "~/modules/production/ui/Jobs/jobLabels";
import { QuantityWithConfigTable } from "~/modules/production/ui/Jobs/QuantityWithConfigTable";
import { useItems } from "~/stores";
import { isConfigTableOverlaySuccess } from "../../configTableOverlay";

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
  const { carbon } = useCarbon();
  const { t } = useLingui();
  const configModal = useConfigTableModal();
  const getDeadlineTypeLabel = useDeadlineTypeLabel();
  const [items] = useItems();

  const isDisabled = !permissions.can("create", "production");

  const [itemId, setItemId] = useState(initialValues.itemId ?? "");
  const [quantity, setQuantity] = useState(initialValues.quantity ?? 0);
  // Whether the selected style needs a config table. Seeded from the preloaded
  // items store so the quantity's config trigger shows instantly on selection.
  const [hasConfigurationParameters, setHasConfigurationParameters] = useState(
    () =>
      items.find((i) => i.id === (initialValues.itemId ?? ""))
        ?.requiresConfiguration ?? false
  );
  const [configTableRows, setConfigTableRows] = useState<Row[] | null>(null);
  const [configTablePrimaryKeys, setConfigTablePrimaryKeys] = useState<
    string[]
  >([]);
  const [configTableTotal, setConfigTableTotal] = useState(0);

  const onItemChange = async (nextItemId: string) => {
    setItemId(nextItemId);
    setConfigTableRows(null);
    setConfigTablePrimaryKeys([]);
    setConfigTableTotal(0);
    if (!nextItemId) {
      setHasConfigurationParameters(false);
      return;
    }

    // Preloaded flag from the items store — instant, no round-trip.
    setHasConfigurationParameters(
      items.find((i) => i.id === nextItemId)?.requiresConfiguration ?? false
    );

    // Correct against the source of truth: covers items missing from the store
    // (e.g. created this session) and config toggled on since hydration.
    if (!carbon) return;
    const manufacturing = await carbon
      .from("itemReplenishment")
      .select("requiresConfiguration")
      .eq("itemId", nextItemId)
      .single();
    setHasConfigurationParameters(!!manufacturing.data?.requiresConfiguration);
  };

  const applyConfig = (data: unknown) => {
    if (!isConfigTableOverlaySuccess(data)) return;
    setConfigTableRows(data.configuration.configTable);
    setConfigTablePrimaryKeys(data.primaryKeys);
    setConfigTableTotal(data.total);
    if (data.total > 0) setQuantity(data.total);
  };

  const openConfigTable = () => {
    if (!itemId) return;
    configModal.open({
      itemId,
      configuration: toConfigTableValue(
        configTableRows,
        configTablePrimaryKeys
      ),
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
            <QuantityWithConfigTable
              name="quantity"
              label={t`Quantity`}
              value={quantity}
              minValue={0}
              isReadOnly={configTableTotal > 0}
              onChange={setQuantity}
              configTableTotal={configTableTotal}
              hasConfigurationParameters={hasConfigurationParameters}
              onOpenConfigTable={openConfigTable}
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
                configTableRows
                  ? JSON.stringify({
                      configTable: configTableRows,
                      configTablePrimaryKeys
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
      {configModal.node}
    </>
  );
};

export default MasterWorkOrderForm;
