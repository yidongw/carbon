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
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { z } from "zod";
import { Hidden, Select, Submit, TextArea } from "~/components/Form";
import { ProductionActorFields } from "../Jobs/ProductionActorFields";
import { ProductionQuantityLinesEditor } from "../Jobs/ProductionQuantityLinesEditor";
import { SupplierSubcontractPricingFields } from "../Jobs/SupplierSubcontractPricingFields";
import { usePermissions } from "~/hooks";
import type { ConfigReferenceSource } from "../../configParamsTableColumns";
import type { ProductionQuantityLineInput } from "~/modules/production/productionQuantityReport.models";
import { path } from "~/utils/path";
import { productionQuantityCreateFormValidator } from "../../production.models";

type ConfigurationParameter = {
  key: string;
  label: string;
  dataType: string;
  listOptions?: string[] | null;
};

export type ProductionQuantityFormProps = {
  jobOperationId: string;
  jobOptions?: { label: string; value: string }[];
  operationOptions?: { label: string; value: string }[];
  configurationParameters?: ConfigurationParameter[] | null;
  configReferenceSource?: ConfigReferenceSource | null;
  itemId?: string | null;
  processId?: string | null;
  operationType?: string | null;
  defaultActorKind?: "employee" | "supplier";
  lockActorSelection?: boolean;
  supplierId?: string;
  seededActor?: {
    kind: "employee" | "supplier";
    employeeId?: string;
    supplierProcessId?: string;
  } | null;
  onDismiss?: () => void;
  action?: string;
  fetcher?: import("react-router").FetcherWithComponents<unknown>;
};

export const ProductionQuantityForm = ({
  jobOperationId: initialJobOperationId,
  jobOptions,
  operationOptions,
  configurationParameters,
  configReferenceSource,
  itemId,
  processId,
  operationType,
  defaultActorKind,
  lockActorSelection: lockActorSelectionProp,
  supplierId,
  seededActor,
  onDismiss: onDismissProp,
  action: formAction,
  fetcher
}: ProductionQuantityFormProps) => {
  const permissions = usePermissions();
  const { t } = useLingui();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isOverlay = fetcher != null;
  const onDismiss = onDismissProp ?? (() => navigate(path.to.productionQuantities));

  const [selectedJobId, setSelectedJobId] = useState(
    searchParams.get("jobId") ?? ""
  );
  const [lines, setLines] = useState<ProductionQuantityLineInput[]>([
    { type: "Production", quantity: 0, configuration: undefined }
  ]);

  const isDisabled = !permissions.can("create", "production");

  // Sync selectedJobId with URL params when they change
  useEffect(() => {
    const jobIdFromUrl = searchParams.get("jobId") ?? "";
    setSelectedJobId(jobIdFromUrl);
  }, [searchParams]);

  // When job changes, update URL to reload operations
  const handleJobChange = (value: string) => {
    setSelectedJobId(value);
    navigate(`?jobId=${value}`, { replace: true });
  };

  const lockActorSelection = Boolean(lockActorSelectionProp);

  const initialValues = {
    jobOperationId: initialJobOperationId,
    actorKind: defaultActorKind ?? "employee",
    employeeId: seededActor?.kind === "employee" ? seededActor.employeeId : undefined,
    supplierProcessId:
      seededActor?.kind === "supplier" ? seededActor.supplierProcessId : undefined,
    notes: undefined,
    lines: JSON.stringify(lines)
  };

  const form = (
    <ValidatedForm
      validator={productionQuantityCreateFormValidator}
      method="post"
      defaultValues={initialValues}
      className="flex flex-col h-full"
      action={formAction}
      fetcher={fetcher}
    >
      <DrawerHeader>
        <DrawerTitle>
          <Trans>Record Production Quantity</Trans>
        </DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <VStack spacing={4}>
          {jobOptions && (
            <Select
              name="jobId"
              label={t`Job`}
              options={jobOptions}
              value={selectedJobId}
              onChange={(e) => {
                const value = e?.currentTarget?.value;
                if (value) handleJobChange(value);
              }}
            />
          )}
          <Select
            name="jobOperationId"
            label={t`Operation`}
            options={operationOptions ?? []}
            isDisabled={!selectedJobId}
          />
          <ProductionActorFields
            processId={processId}
            operationType={operationType}
            defaultActorKind={defaultActorKind}
            lockActorSelection={lockActorSelection}
            employeeIdValue={initialValues.employeeId}
            supplierProcessIdValue={initialValues.supplierProcessId}
            supplierIdValue={supplierId}
          />
          {defaultActorKind === "supplier" && (
            <SupplierSubcontractPricingFields
              jobOperationId={initialJobOperationId}
              supplierProcessId={initialValues.supplierProcessId}
            />
          )}
          <ProductionQuantityLinesEditor
            lines={lines}
            onChange={setLines}
            configurationParameters={configurationParameters}
            configReferenceSource={configReferenceSource}
            itemId={itemId}
          />
          <Hidden name="lines" value={JSON.stringify(lines)} />
          <TextArea name="notes" label={t`Notes`} />
        </VStack>
      </DrawerBody>
      <DrawerFooter>
        <HStack>
          <Submit
            isDisabled={isDisabled}
            className="transition-transform active:scale-[0.96]"
          >
            <Trans>Save</Trans>
          </Submit>
          <Button
            variant="solid"
            type="button"
            onClick={onDismiss}
            className="transition-transform active:scale-[0.96]"
          >
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
