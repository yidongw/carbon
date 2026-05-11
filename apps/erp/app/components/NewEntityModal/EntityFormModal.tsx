import { Spinner, toast } from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import type { PostgrestResponse } from "@supabase/supabase-js";
import type { ReactElement } from "react";
import { cloneElement, Suspense, useEffect, useRef } from "react";
import type { FetcherWithComponents } from "react-router";
import { useFetcher } from "react-router";
import { CardFormModal } from "./CardFormModal";
import type { RegisteredNewEntity } from "./registry";

type ModalFormProps = {
  action?: string;
  fetcher?: FetcherWithComponents<any>;
};

type EntityFormModalProps = {
  action?: string;
  children: ReactElement<any>;
  entity: RegisteredNewEntity;
  getCreatedName?: (
    created: Record<string, any> | null
  ) => string | null | undefined;
  onCreated?: (created: Record<string, any> | null) => void;
  onClose: () => void;
};

function getCreatedRecord<T>(response: PostgrestResponse<T>): T | null {
  const data = response.data;

  if (Array.isArray(data)) {
    return data[0] ?? null;
  }

  return data ?? null;
}

export function EntityFormModal({
  action,
  children,
  entity,
  getCreatedName,
  onCreated,
  onClose
}: EntityFormModalProps) {
  const { t } = useLingui();
  const submitFetcher = useFetcher<any>();
  const wasSubmittingRef = useRef(false);
  const entityLabels = {
    consumable: {
      errorPrefix: t`Failed to create`,
      fallback: t`Consumable`,
      name: t`consumable`,
      successPrefix: t`Created`
    },
    customer: {
      errorPrefix: t`Failed to create`,
      fallback: t`Customer`,
      name: t`customer`,
      successPrefix: t`Created`
    },
    customerAccount: {
      errorPrefix: t`Failed to create`,
      fallback: t`Customer Account`,
      name: t`customer account`,
      successPrefix: t`Created`
    },
    employee: {
      errorPrefix: t`Failed to invite`,
      fallback: t`Employee`,
      name: t`employee`,
      successPrefix: t`Invited`
    },
    issue: {
      errorPrefix: t`Failed to create`,
      fallback: t`Issue`,
      name: t`issue`,
      successPrefix: t`Created`
    },
    issueWorkflow: {
      errorPrefix: t`Failed to create`,
      fallback: t`Issue Workflow`,
      name: t`issue workflow`,
      successPrefix: t`Created`
    },
    job: {
      errorPrefix: t`Failed to create`,
      fallback: t`Job`,
      name: t`job`,
      successPrefix: t`Created`
    },
    maintenance: {
      errorPrefix: t`Failed to create`,
      fallback: t`Maintenance Dispatch`,
      name: t`maintenance dispatch`,
      successPrefix: t`Created`
    },
    material: {
      errorPrefix: t`Failed to create`,
      fallback: t`Material`,
      name: t`material`,
      successPrefix: t`Created`
    },
    part: {
      errorPrefix: t`Failed to create`,
      fallback: t`Part`,
      name: t`part`,
      successPrefix: t`Created`
    },
    purchaseInvoice: {
      errorPrefix: t`Failed to create`,
      fallback: t`Purchase Invoice`,
      name: t`purchase invoice`,
      successPrefix: t`Created`
    },
    purchaseOrder: {
      errorPrefix: t`Failed to create`,
      fallback: t`Purchase Order`,
      name: t`purchase order`,
      successPrefix: t`Created`
    },
    purchasingRFQ: {
      errorPrefix: t`Failed to create`,
      fallback: t`Purchasing RFQ`,
      name: t`purchasing RFQ`,
      successPrefix: t`Created`
    },
    quote: {
      errorPrefix: t`Failed to create`,
      fallback: t`Quote`,
      name: t`quote`,
      successPrefix: t`Created`
    },
    salesInvoice: {
      errorPrefix: t`Failed to create`,
      fallback: t`Sales Invoice`,
      name: t`sales invoice`,
      successPrefix: t`Created`
    },
    salesOrder: {
      errorPrefix: t`Failed to create`,
      fallback: t`Sales Order`,
      name: t`sales order`,
      successPrefix: t`Created`
    },
    salesRFQ: {
      errorPrefix: t`Failed to create`,
      fallback: t`Sales RFQ`,
      name: t`sales RFQ`,
      successPrefix: t`Created`
    },
    supplier: {
      errorPrefix: t`Failed to create`,
      fallback: t`Supplier`,
      name: t`supplier`,
      successPrefix: t`Created`
    },
    supplierAccount: {
      errorPrefix: t`Failed to create`,
      fallback: t`Supplier Account`,
      name: t`supplier account`,
      successPrefix: t`Created`
    },
    supplierQuote: {
      errorPrefix: t`Failed to create`,
      fallback: t`Supplier Quote`,
      name: t`supplier quote`,
      successPrefix: t`Created`
    },
    warehouseTransfer: {
      errorPrefix: t`Failed to create`,
      fallback: t`Warehouse Transfer`,
      name: t`warehouse transfer`,
      successPrefix: t`Created`
    },
    tool: {
      errorPrefix: t`Failed to create`,
      fallback: t`Tool`,
      name: t`tool`,
      successPrefix: t`Created`
    }
  } satisfies Record<
    RegisteredNewEntity,
    {
      errorPrefix: string;
      fallback: string;
      name: string;
      successPrefix: string;
    }
  >;
  const {
    errorPrefix,
    fallback: fallbackEntityName,
    name: entityName,
    successPrefix
  } = entityLabels[entity];

  useEffect(() => {
    if (
      submitFetcher.state === "submitting" ||
      submitFetcher.state === "loading"
    ) {
      wasSubmittingRef.current = true;
      return;
    }

    if (submitFetcher.state !== "idle" || !wasSubmittingRef.current) return;
    wasSubmittingRef.current = false;

    const fetcherData = submitFetcher.data as
      | { data?: unknown; error?: { message?: string }; fieldErrors?: unknown }
      | undefined;

    if (fetcherData?.fieldErrors) return;

    if (fetcherData?.error?.message) {
      toast.error(`${errorPrefix} ${entityName}: ${fetcherData.error.message}`);
      return;
    }

    const created =
      fetcherData?.data !== undefined
        ? getCreatedRecord(fetcherData as PostgrestResponse<unknown>)
        : null;
    const createdRecord = created as Record<string, any> | null;
    const createdName = getCreatedName?.(createdRecord) ?? undefined;

    if (onCreated) {
      onCreated(createdRecord);
    } else {
      onClose();
    }
    toast.success(
      `${successPrefix} ${entityName}: ${createdName ?? fallbackEntityName}`
    );
  }, [
    errorPrefix,
    entityName,
    fallbackEntityName,
    submitFetcher.data,
    submitFetcher.state,
    getCreatedName,
    onCreated,
    onClose,
    successPrefix
  ]);

  const fallback = (
    <div className="flex items-center justify-center w-full h-64">
      <Spinner />
    </div>
  );

  return (
    <CardFormModal onClose={onClose}>
      <Suspense fallback={fallback}>
        {cloneElement(children, {
          fetcher: submitFetcher,
          ...(action !== undefined ? { action } : {})
        } satisfies ModalFormProps)}
      </Suspense>
    </CardFormModal>
  );
}
