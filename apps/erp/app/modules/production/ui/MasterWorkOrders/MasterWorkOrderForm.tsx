import { useCarbon } from "@carbon/auth";
import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";
import type { z } from "zod";
import { Hidden, Item, Submit } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { usePermissions, useUser } from "~/hooks";
import type { ConfigurationParameter } from "~/modules/items/types";
import { masterWorkOrderValidator } from "~/modules/production";
import {
  toConfigTableValue,
  useConfigTableModal
} from "~/modules/production/ui/Jobs/ConfigParamsTableModal";
import type { Row } from "~/modules/production/ui/Jobs/configTableShared";
import { QuantityWithConfigTable } from "~/modules/production/ui/Jobs/QuantityWithConfigTable";
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
  const { company } = useUser();
  const { carbon } = useCarbon();
  const { t } = useLingui();
  const configModal = useConfigTableModal();

  const isDisabled = !permissions.can("create", "production");

  const [itemId, setItemId] = useState(initialValues.itemId ?? "");
  const [quantity, setQuantity] = useState(initialValues.quantity ?? 0);
  const [configurationParameters, setConfigurationParameters] = useState<{
    parameters: ConfigurationParameter[];
    groups: unknown[];
  } | null>(null);
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
    setConfigurationParameters(null);
    if (!nextItemId || !carbon || !company.id) return;

    const manufacturing = await carbon
      .from("itemReplenishment")
      .select("requiresConfiguration")
      .eq("itemId", nextItemId)
      .single();

    if (manufacturing.data?.requiresConfiguration) {
      const [parameters, groups] = await Promise.all([
        carbon
          .from("configurationParameter")
          .select("*")
          .eq("itemId", nextItemId)
          .eq("companyId", company.id),
        carbon
          .from("configurationParameterGroup")
          .select("*")
          .eq("itemId", nextItemId)
          .eq("companyId", company.id)
      ]);
      if (parameters.error || groups.error) {
        toast.error(t`Failed to load configuration parameters`);
        return;
      }
      setConfigurationParameters({
        parameters: (parameters.data ?? []) as ConfigurationParameter[],
        groups: groups.data ?? []
      });
    }
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
        defaultValues={initialValues}
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
              hasConfigurationParameters={!!configurationParameters}
              onOpenConfigTable={openConfigTable}
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
