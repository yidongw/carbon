import { ValidatedForm } from "@carbon/form";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  HStack,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import {
  type FetcherWithComponents,
  useNavigate,
  useParams
} from "react-router";
import type { z } from "zod";
import {
  Employee,
  Hidden,
  Number,
  Select,
  Submit,
  TextArea
} from "~/components/Form";
import ScrapReason from "~/components/Form/ScrapReason";
import { usePermissions } from "~/hooks";
import { path } from "~/utils/path";
import { productionQuantityValidator } from "../../production.models";

export type ProductionQuantityFormProps = {
  initialValues: z.infer<typeof productionQuantityValidator>;
  operationOptions?: {
    label: string;
    value: string;
    helperText?: string;
  }[];
  onDismiss?: () => void;
  action?: string;
  fetcher?: FetcherWithComponents<unknown>;
};

const ProductionQuantityForm = ({
  initialValues,
  operationOptions,
  onDismiss: onDismissProp,
  action: formAction,
  fetcher
}: ProductionQuantityFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isOverlay = fetcher != null;
  const onDismiss =
    onDismissProp ??
    (() => {
      if (jobId) {
        navigate(path.to.jobProductionQuantities(jobId));
        return;
      }
      navigate(-1);
    });

  const [type, setType] = useState<"Production" | "Scrap" | "Rework">(
    initialValues.type
  );
  const formBodyRef = useRef<HTMLDivElement>(null);

  const isEditing = initialValues.id !== undefined;
  const presetJobOperationIdOnCreate =
    !isEditing && Boolean(initialValues.jobOperationId);
  const isDisabled = isEditing
    ? !permissions.can("update", "production")
    : !permissions.can("create", "production");

  useEffect(() => {
    if (!isOverlay) return;

    const focusFirstField = () => {
      const root = formBodyRef.current;
      if (!root) return;

      const combobox = root.querySelector<HTMLElement>(
        'button[role="combobox"]:not([disabled])'
      );
      if (combobox) {
        combobox.focus();
        return;
      }

      root
        .querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([disabled])'
        )
        ?.focus();
    };

    const frame = requestAnimationFrame(focusFirstField);
    return () => cancelAnimationFrame(frame);
  }, [isOverlay]);

  const form = (
    <ValidatedForm
      validator={productionQuantityValidator}
      method="post"
      defaultValues={initialValues}
      className="flex flex-col h-full"
      action={formAction}
      fetcher={fetcher}
    >
      <DrawerHeader>
        <DrawerTitle>
          {isEditing ? (
            <Trans>Edit Production Quantity</Trans>
          ) : (
            <Trans>Create Production Quantity</Trans>
          )}
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <Hidden name="id" />
        <VStack ref={formBodyRef} spacing={4}>
          {isEditing || presetJobOperationIdOnCreate ? (
            <Hidden name="jobOperationId" />
          ) : (
            <Select
              name="jobOperationId"
              label={t`Operation`}
              options={operationOptions ?? []}
            />
          )}
          <Employee name="createdBy" label={t`Employee`} />
          <Number name="quantity" label={t`Quantity`} />
          <Select
            name="type"
            label={t`Quantity Type`}
            options={[
              { label: "Production", value: "Production" },
              { label: "Scrap", value: "Scrap" },
              { label: "Rework", value: "Rework" }
            ]}
            onChange={(value) =>
              setType(value?.value as "Production" | "Scrap" | "Rework")
            }
          />
          {type === "Scrap" && (
            <ScrapReason name="scrapReasonId" label={t`Scrap Reason`} />
          )}
          <TextArea name="notes" label={t`Notes`} />
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
  );

  if (isOverlay) {
    return form;
  }

  return (
    <Drawer
      open
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <DrawerContent>{form}</DrawerContent>
    </Drawer>
  );
};

export default ProductionQuantityForm;
