import { ValidatedForm } from "@carbon/form";
import {
  Button,
  HStack,
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerFooter,
  ModalDrawerHeader,
  ModalDrawerProvider,
  ModalDrawerTitle,
  toast,
  useRouteData,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";
import { useFetcher, useNavigate, useParams } from "react-router";
import type { z } from "zod";
import {
  CustomFormFields,
  Hidden,
  Number,
  Submit,
  Supplier
} from "~/components/Form";
import Process, { useProcesses } from "~/components/Form/Process";
import { useSupplierProcessesBySupplier } from "~/components/Form/SupplierProcess";
import { usePermissions, useUser } from "~/hooks";
import type { SupplierProcess } from "~/modules/purchasing";
import { supplierProcessValidator } from "~/modules/purchasing";
import { path } from "~/utils/path";

type SupplierProcessFormProps = {
  initialValues: z.infer<typeof supplierProcessValidator>;
  type?: "drawer" | "modal";
  open?: boolean;
  onClose: () => void;
};

const SupplierProcessForm = ({
  initialValues,
  type = "drawer",
  open = true,
  onClose
}: SupplierProcessFormProps) => {
  const { t } = useLingui();
  const permissions = usePermissions();
  const fetcher = useFetcher<PostgrestResponse<SupplierProcess>>();
  const { supplierId: routeSupplierId } = useParams();
  const [supplier, setSupplier] = useState<string | undefined>(
    routeSupplierId || initialValues.supplierId || undefined
  );
  const resolvedSupplierId =
    routeSupplierId || supplier || initialValues.supplierId;
  const navigate = useNavigate();

  const { company } = useUser();
  const baseCurrency = company?.baseCurrencyCode ?? "USD";

  useEffect(() => {
    if (type !== "modal") return;

    if (fetcher.state === "idle" && fetcher.data?.data) {
      onClose?.();
      toast.success(t`Created supplier process`);
    } else if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(
        fetcher.data.error.message ?? t`Failed to create supplier process`
      );
    }
  }, [fetcher.data, fetcher.state, onClose, type, t]);

  const isEditing = initialValues.id !== undefined;
  const isDisabled = isEditing
    ? !permissions.can("update", "purchasing")
    : !permissions.can("create", "purchasing");

  const processIdPreset = !isEditing && Boolean(initialValues.processId);
  const allProcesses = useProcesses();
  const routeProcesses = useRouteData<{ processes: SupplierProcess[] }>(
    routeSupplierId ? path.to.supplierProcesses(routeSupplierId) : ""
  );
  const fetchedSupplierProcesses = useSupplierProcessesBySupplier({
    supplierId: routeSupplierId ? undefined : resolvedSupplierId || undefined
  });
  const existingSupplierProcesses =
    routeProcesses?.processes ?? fetchedSupplierProcesses;

  const assignedProcessIds = useMemo(() => {
    return new Set(
      existingSupplierProcesses
        .filter((supplierProcess) => supplierProcess.id !== initialValues.id)
        .map((supplierProcess) => supplierProcess.processId)
        .filter(Boolean)
    );
  }, [existingSupplierProcesses, initialValues.id]);

  const processOptions = useMemo(() => {
    if (!resolvedSupplierId) {
      return allProcesses;
    }

    return allProcesses.filter(
      (process) => !assignedProcessIds.has(process.value)
    );
  }, [allProcesses, assignedProcessIds, resolvedSupplierId]);

  return (
    <ModalDrawerProvider type={type}>
      <ModalDrawer
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            if (type === "modal") {
              onClose?.();
            } else {
              navigate(-1);
            }
          }
        }}
      >
        <ModalDrawerContent>
          <ValidatedForm
            validator={supplierProcessValidator}
            method="post"
            action={
              isEditing
                ? path.to.supplierProcess(resolvedSupplierId!, initialValues.id!)
                : path.to.newSupplierProcess(resolvedSupplierId!)
            }
            defaultValues={initialValues}
            fetcher={fetcher}
            className="flex flex-col h-full"
          >
            <ModalDrawerHeader>
              <ModalDrawerTitle>
                {isEditing ? "Edit" : "New"} Supplier Process
              </ModalDrawerTitle>
            </ModalDrawerHeader>
            <ModalDrawerBody>
              <Hidden name="id" />
              <Hidden name="type" value={type} />
              {routeSupplierId && (
                <Hidden name="supplierId" value={routeSupplierId} />
              )}
              <VStack spacing={4}>
                {!routeSupplierId && (
                  <Supplier
                    name="supplierId"
                    label={t`Supplier`}
                    onChange={(newValue) => setSupplier(newValue?.value)}
                  />
                )}
                {processIdPreset ? (
                  <Hidden name="processId" value={initialValues.processId} />
                ) : (
                  <Process
                    name="processId"
                    label={t`Process`}
                    options={processOptions}
                  />
                )}
                <Number
                  name="minimumCost"
                  label={t`Minimum Cost`}
                  formatOptions={{
                    style: "currency",
                    currency: baseCurrency
                  }}
                  minValue={0}
                />
                <Number
                  name="unitCost"
                  label={t`Unit Cost`}
                  formatOptions={{
                    style: "currency",
                    currency: baseCurrency
                  }}
                  minValue={0}
                />
                <Number
                  name="leadTime"
                  label={t`Standard Lead Time`}
                  minValue={0}
                />

                <CustomFormFields table="supplierProcess" />
              </VStack>
            </ModalDrawerBody>
            <ModalDrawerFooter>
              <HStack>
                <Submit isDisabled={isDisabled}>
                  <Trans>Save</Trans>
                </Submit>
                <Button size="md" variant="solid" onClick={() => onClose?.()}>
                  <Trans>Cancel</Trans>
                </Button>
              </HStack>
            </ModalDrawerFooter>
          </ValidatedForm>
        </ModalDrawerContent>
      </ModalDrawer>
    </ModalDrawerProvider>
  );
};

export default SupplierProcessForm;
