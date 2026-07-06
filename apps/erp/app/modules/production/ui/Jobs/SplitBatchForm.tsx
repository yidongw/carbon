import { ValidatedForm } from "@carbon/form";
import {
  Button,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { ArrayNumeric, Hidden, Submit, TextArea } from "~/components/Form";
import type { OverlayFormInjectedProps } from "~/components/Overlay/renderLazyOverlay";
import { splitBatchConfirmValidator } from "../../splitBatch.models";

export type SplitBatchInitialValues = {
  jobId: string;
  itemId: string;
  styleCode: string;
  colorCode: string;
  colorName: string;
  sizeCode: string | null;
  shadeLot: string | null;
  configurationKey: string;
  notes?: string;
  bundleQuantities: number[];
};

export type SplitBatchFormProps = {
  initialValues: SplitBatchInitialValues;
  pendingQuantity: number;
} & Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">;

export default function SplitBatchForm({
  initialValues,
  pendingQuantity,
  onDismiss,
  fetcher,
  action
}: SplitBatchFormProps) {
  const { t } = useLingui();

  return (
    <ValidatedForm
      method="post"
      fetcher={fetcher}
      action={action}
      validator={splitBatchConfirmValidator}
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>Confirm Split Batch</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          <div className="space-y-1 text-sm">
            <div>
              <strong>{t`Style`}:</strong> {initialValues.styleCode}
            </div>
            <div>
              <strong>{t`Color`}:</strong> {initialValues.colorCode} /{" "}
              {initialValues.colorName}
            </div>
            {initialValues.sizeCode ? (
              <div>
                <strong>{t`Size`}:</strong> {initialValues.sizeCode}
              </div>
            ) : null}
            {initialValues.shadeLot ? (
              <div>
                <strong>{t`Shade Lot`}:</strong> {initialValues.shadeLot}
              </div>
            ) : null}
            <div>
              <strong>{t`Pending Quantity`}:</strong> {pendingQuantity}
            </div>
          </div>

          <Hidden name="jobId" value={initialValues.jobId} />
          <Hidden name="itemId" value={initialValues.itemId} />
          <Hidden name="styleCode" value={initialValues.styleCode} />
          <Hidden name="colorCode" value={initialValues.colorCode} />
          <Hidden name="colorName" value={initialValues.colorName} />
          <Hidden name="sizeCode" value={initialValues.sizeCode ?? ""} />
          <Hidden name="shadeLot" value={initialValues.shadeLot ?? ""} />
          <Hidden
            name="configurationKey"
            value={initialValues.configurationKey}
          />

          <ArrayNumeric
            name="bundleQuantities"
            label={t`Bundle Quantities`}
            defaults={initialValues.bundleQuantities}
          />

          <TextArea name="notes" label={t`Notes`} />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <Button variant="secondary" onClick={onDismiss}>
          <Trans>Cancel</Trans>
        </Button>
        <Submit>
          <Trans>Confirm Split</Trans>
        </Submit>
      </DrawerFooter>
    </ValidatedForm>
  );
}
