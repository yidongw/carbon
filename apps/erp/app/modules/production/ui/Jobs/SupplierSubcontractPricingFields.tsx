import { VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useEffect, useRef, useState } from "react";
import { Hidden, NumberControlled } from "~/components/Form";
import { useCurrencyFormatter } from "~/hooks";
import type { SubcontractPricingPreview } from "~/modules/production/jobOperationSupplierQuantityReport.service";
import { path } from "~/utils/path";

export function SupplierSubcontractPricingFields({
  jobOperationId,
  supplierProcessId,
  isDisabled
}: {
  jobOperationId: string;
  supplierProcessId: string;
  isDisabled?: boolean;
}) {
  const { t } = useLingui();
  const currencyFormatter = useCurrencyFormatter();
  const baseCurrency = currencyFormatter.resolvedOptions().currency ?? "USD";

  const [pricing, setPricing] = useState<SubcontractPricingPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);
  const loadIdRef = useRef(0);

  const [operationUnitCost, setOperationUnitCost] = useState(0);
  const [operationMinimumCost, setOperationMinimumCost] = useState(0);

  useEffect(() => {
    if (!jobOperationId || !supplierProcessId) {
      setPricing(null);
      setEdited(false);
      return;
    }

    const loadId = ++loadIdRef.current;
    setLoading(true);
    setError(null);
    setEdited(false);

    void fetch(
      path.to.api.operationSubcontractPricing(
        jobOperationId,
        supplierProcessId
      )
    )
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? "Failed to load pricing");
        }
        return res.json() as Promise<{ pricing: SubcontractPricingPreview }>;
      })
      .then((data) => {
        if (loadId !== loadIdRef.current) return;
        const next = data.pricing;
        setPricing(next);
        setOperationUnitCost(next.operationUnitCost);
        setOperationMinimumCost(next.operationMinimumCost);
      })
      .catch((err: Error) => {
        if (loadId !== loadIdRef.current) return;
        setError(err.message);
        setPricing(null);
      })
      .finally(() => {
        if (loadId === loadIdRef.current) {
          setLoading(false);
        }
      });
  }, [jobOperationId, supplierProcessId]);

  if (!supplierProcessId) {
    return null;
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        <Trans>Loading subcontract pricing…</Trans>
      </p>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (!pricing) {
    return null;
  }

  const markEdited = () => setEdited(true);

  return (
    <VStack spacing={3} className="w-full rounded-lg border border-border/70 p-3">
      <p className="text-xs text-muted-foreground">
        {pricing.source === "snapshot" ? (
          <Trans>
            Using saved subcontract pricing for this supplier on this job.
          </Trans>
        ) : (
          <Trans>Pricing from the supplier process (first quantity on this job).</Trans>
        )}
      </p>
      <div className="grid w-full grid-cols-2 gap-x-8 gap-y-4 items-start">
        <div className="min-w-0">
          <NumberControlled
            name="operationUnitCost"
            label={t`Unit Price`}
            isOptional={false}
            minValue={0}
            value={operationUnitCost}
            isDisabled={isDisabled}
            formatOptions={{
              style: "currency",
              currency: baseCurrency
            }}
            onChange={(value) => {
              markEdited();
              setOperationUnitCost(value);
            }}
          />
        </div>
        <div className="min-w-0">
          <NumberControlled
            name="operationMinimumCost"
            label={t`Minimum Cost`}
            isOptional={false}
            minValue={0}
            value={operationMinimumCost}
            isDisabled={isDisabled}
            formatOptions={{
              style: "currency",
              currency: baseCurrency
            }}
            onChange={(value) => {
              markEdited();
              setOperationMinimumCost(value);
            }}
          />
        </div>
      </div>
      <Hidden name="snapshotPricingEdited" value={edited ? "1" : "0"} />
    </VStack>
  );
}
