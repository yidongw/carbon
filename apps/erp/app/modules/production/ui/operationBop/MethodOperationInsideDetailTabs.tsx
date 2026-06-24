import { Trans, useLingui } from "@lingui/react/macro";
import { type Dispatch, type SetStateAction, useMemo } from "react";
import { LuListChecks } from "react-icons/lu";
import { TimeTypeIcon } from "~/components";
import type { Configuration } from "~/components/Configurator/types";
import { NumberControlled, StandardFactor, UnitHint } from "~/components/Form";
import Procedure from "~/components/Form/Procedure";
import { standardFactorType } from "~/modules/shared";
import {
  formatOperationTabSummary,
  type OperationDetailSection,
  OperationDetailTabs
} from "./index";

export type MethodOperationInsideProcessData = {
  processId: string;
  procedureId: string;
  setupTime: number;
  setupUnit: string;
  setupUnitHint: string;
  laborTime: number;
  laborUnit: string;
  laborUnitHint: string;
  machineTime: number;
  machineUnit: string;
  machineUnitHint: string;
};

export function MethodOperationInsideDetailTabs<
  T extends MethodOperationInsideProcessData
>({
  processData,
  setProcessData,
  fieldKey,
  configurable = false,
  isTemporary = false,
  rulesByField,
  onConfigure
}: {
  processData: T;
  setProcessData: Dispatch<SetStateAction<T>>;
  fieldKey: (field: string) => string;
  configurable?: boolean;
  isTemporary?: boolean;
  rulesByField: Map<string, { code?: string }>;
  onConfigure?: (config: Configuration) => void;
}) {
  const { t } = useLingui();

  const configureField = (
    field: string,
    label: string,
    defaultValue: Configuration["defaultValue"],
    returnType: Configuration["returnType"]
  ) => {
    if (!configurable || isTemporary || !onConfigure) return undefined;
    const key = fieldKey(field);
    return () =>
      onConfigure({
        label,
        field: key,
        code: rulesByField.get(key)?.code,
        defaultValue,
        returnType
      });
  };

  const sections = useMemo((): OperationDetailSection[] => {
    const key = fieldKey;
    return [
      {
        id: "setup",
        label: <Trans>Setup</Trans>,
        accessibilityLabel: t`Setup`,
        icon: <TimeTypeIcon type="Setup" />,
        summary:
          (processData.setupTime ?? 0) > 0
            ? formatOperationTabSummary(
                processData.setupTime,
                processData.setupUnit
              )
            : undefined,
        summaryTitle:
          (processData.setupTime ?? 0) > 0
            ? `${processData.setupTime} ${processData.setupUnit}`
            : undefined,
        content: (
          <>
            <UnitHint
              name="setupHint"
              label={t`Setup`}
              value={processData.setupUnitHint}
              onChange={(hint) => {
                setProcessData((d) => ({
                  ...d,
                  setupUnitHint: hint,
                  setupUnit:
                    hint === "Fixed" ? "Total Minutes" : "Minutes/Piece"
                }));
              }}
            />
            <NumberControlled
              name="setupTime"
              label={t`Setup Time`}
              isOptional={false}
              minValue={0}
              value={processData.setupTime}
              onChange={(newValue) =>
                setProcessData((d) => ({ ...d, setupTime: newValue }))
              }
              isConfigured={rulesByField.has(key("setupTime"))}
              onConfigure={configureField(
                "setupTime",
                t`Setup Time`,
                processData.setupTime,
                { type: "numeric" }
              )}
            />
            <StandardFactor
              name="setupUnit"
              label={t`Setup Unit`}
              isOptional={false}
              hint={processData.setupUnitHint}
              value={processData.setupUnit}
              onChange={(newValue) => {
                setProcessData((d) => ({
                  ...d,
                  setupUnit: newValue?.value ?? "Total Minutes"
                }));
              }}
              isConfigured={rulesByField.has(key("setupUnit"))}
              onConfigure={configureField(
                "setupUnit",
                t`Setup Unit`,
                processData.setupUnit,
                { type: "enum", listOptions: [...standardFactorType] }
              )}
            />
          </>
        )
      },
      {
        id: "labor",
        label: <Trans>Labor</Trans>,
        accessibilityLabel: t`Labor`,
        icon: <TimeTypeIcon type="Labor" />,
        summary:
          (processData.laborTime ?? 0) > 0
            ? formatOperationTabSummary(
                processData.laborTime,
                processData.laborUnit
              )
            : undefined,
        summaryTitle:
          (processData.laborTime ?? 0) > 0
            ? `${processData.laborTime} ${processData.laborUnit}`
            : undefined,
        content: (
          <>
            <UnitHint
              name="laborHint"
              label={t`Labor`}
              value={processData.laborUnitHint}
              onChange={(hint) => {
                setProcessData((d) => ({
                  ...d,
                  laborUnitHint: hint,
                  laborUnit:
                    hint === "Fixed" ? "Total Minutes" : "Minutes/Piece"
                }));
              }}
            />
            <NumberControlled
              name="laborTime"
              label={t`Labor Time`}
              isOptional={false}
              minValue={0}
              value={processData.laborTime}
              onChange={(newValue) =>
                setProcessData((d) => ({ ...d, laborTime: newValue }))
              }
              isConfigured={rulesByField.has(key("laborTime"))}
              onConfigure={configureField(
                "laborTime",
                t`Labor Time`,
                processData.laborTime,
                { type: "numeric" }
              )}
            />
            <StandardFactor
              name="laborUnit"
              label={t`Labor Unit`}
              isOptional={false}
              hint={processData.laborUnitHint}
              value={processData.laborUnit}
              onChange={(newValue) => {
                setProcessData((d) => ({
                  ...d,
                  laborUnit: newValue?.value ?? "Total Minutes"
                }));
              }}
              isConfigured={rulesByField.has(key("laborUnit"))}
              onConfigure={configureField(
                "laborUnit",
                t`Labor Unit`,
                processData.laborUnit,
                { type: "enum", listOptions: [...standardFactorType] }
              )}
            />
          </>
        )
      },
      {
        id: "machine",
        label: <Trans>Machine</Trans>,
        accessibilityLabel: t`Machine`,
        icon: <TimeTypeIcon type="Machine" />,
        summary:
          (processData.machineTime ?? 0) > 0
            ? formatOperationTabSummary(
                processData.machineTime,
                processData.machineUnit
              )
            : undefined,
        summaryTitle:
          (processData.machineTime ?? 0) > 0
            ? `${processData.machineTime} ${processData.machineUnit}`
            : undefined,
        content: (
          <>
            <UnitHint
              name="machineHint"
              label={t`Machine`}
              value={processData.machineUnitHint}
              onChange={(hint) => {
                setProcessData((d) => ({
                  ...d,
                  machineUnitHint: hint,
                  machineUnit:
                    hint === "Fixed" ? "Total Minutes" : "Minutes/Piece"
                }));
              }}
            />
            <NumberControlled
              name="machineTime"
              label={t`Machine Time`}
              isOptional={false}
              minValue={0}
              value={processData.machineTime}
              onChange={(newValue) =>
                setProcessData((d) => ({ ...d, machineTime: newValue }))
              }
              isConfigured={rulesByField.has(key("machineTime"))}
              onConfigure={configureField(
                "machineTime",
                t`Machine Time`,
                processData.machineTime,
                { type: "numeric" }
              )}
            />
            <StandardFactor
              name="machineUnit"
              label={t`Machine Unit`}
              isOptional={false}
              hint={processData.machineUnitHint}
              value={processData.machineUnit}
              onChange={(newValue) => {
                setProcessData((d) => ({
                  ...d,
                  machineUnit: newValue?.value ?? "Total Minutes"
                }));
              }}
              isConfigured={rulesByField.has(key("machineUnit"))}
              onConfigure={configureField(
                "machineUnit",
                t`Machine Unit`,
                processData.machineUnit,
                { type: "enum", listOptions: [...standardFactorType] }
              )}
            />
          </>
        )
      },
      {
        id: "procedure",
        label: <Trans>Procedure</Trans>,
        accessibilityLabel: t`Procedure`,
        icon: <LuListChecks className="h-4 w-4" />,
        summary: processData.procedureId ? t`Procedure` : undefined,
        contentClassName:
          "grid w-full grid-cols-1 gap-x-8 gap-y-4 px-4 pb-4 pt-4",
        content: (
          <Procedure
            name="procedureId"
            label={t`Procedure`}
            processId={processData.processId}
            value={processData.procedureId}
            isConfigured={rulesByField.has(key("procedureId"))}
            onConfigure={configureField(
              "procedureId",
              t`Procedure`,
              processData.procedureId,
              {
                type: "text",
                helperText:
                  "the unique identifier for the procedure. you can get this from the URL when editing a procedure"
              }
            )}
            onChange={(value) => {
              setProcessData((d) => ({
                ...d,
                procedureId: value?.value as string
              }));
            }}
          />
        )
      }
    ];
  }, [fieldKey, processData, rulesByField, setProcessData, t]);

  return <OperationDetailTabs sections={sections} />;
}
