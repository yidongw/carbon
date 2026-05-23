import { GroupedCreatableCombobox, useField } from "@carbon/form";
import { FormErrorMessage, useDisclosure } from "@carbon/react";
import { getFaviconUrl } from "@carbon/utils";
import { useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Avatar from "~/components/Avatar";
import { Hidden } from "~/components/Form";
import { useSupplierProcesses } from "~/components/Form/SupplierProcess";
import {
  allowsSupplierQuantityActor,
  defaultActorKindFromOperationType,
  type OperationType
} from "~/modules/production/operationType";
import type { productionActorKinds } from "~/modules/production/production.models";
import { SupplierProcessForm } from "~/modules/purchasing/ui/Supplier";
import { usePeople, useSuppliers } from "~/stores";
import { path } from "~/utils/path";

type ActorKind = (typeof productionActorKinds)[number];

const EMPLOYEE_PREFIX = "employee:";
const SUPPLIER_PREFIX = "supplier:";

function encodeActorSelection(kind: ActorKind, id: string) {
  return kind === "employee"
    ? `${EMPLOYEE_PREFIX}${id}`
    : `${SUPPLIER_PREFIX}${id}`;
}

function decodeActorSelection(
  value: string | undefined
): { kind: ActorKind; id: string } | null {
  if (!value) return null;
  if (value.startsWith(EMPLOYEE_PREFIX)) {
    return { kind: "employee", id: value.slice(EMPLOYEE_PREFIX.length) };
  }
  if (value.startsWith(SUPPLIER_PREFIX)) {
    return { kind: "supplier", id: value.slice(SUPPLIER_PREFIX.length) };
  }
  return null;
}

export function selectionFromInitialValues({
  employeeId,
  supplierProcessId
}: {
  employeeId?: string;
  supplierProcessId?: string;
}) {
  if (employeeId?.trim()) {
    return encodeActorSelection("employee", employeeId.trim());
  }
  if (supplierProcessId?.trim()) {
    return encodeActorSelection("supplier", supplierProcessId.trim());
  }
  return "";
}

export function ProductionActorFields({
  processId,
  operationType,
  defaultActorKind,
  lockActorSelection,
  employeeIdValue,
  supplierProcessIdValue,
  supplierIdValue,
  onActorKindChange,
  onSupplierProcessChange
}: {
  processId?: string | null;
  operationType?: OperationType | string | null;
  defaultActorKind?: ActorKind;
  /** When true, the selected employee/supplier cannot be changed (edit flows). */
  lockActorSelection?: boolean;
  employeeIdValue?: string;
  supplierProcessIdValue?: string;
  /** Resolves supplier label before process options finish loading (edit prefill). */
  supplierIdValue?: string;
  onActorKindChange?: (kind: ActorKind) => void;
  onSupplierProcessChange?: (supplierProcessId: string) => void;
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const newSupplierProcessModal = useDisclosure();
  const triggerRef = useRef<HTMLButtonElement>(null);

  const resolvedDefault =
    defaultActorKind ??
    (operationType
      ? defaultActorKindFromOperationType(operationType)
      : "employee");

  const showSupplierActors = allowsSupplierQuantityActor(operationType);

  const initialSelection = useMemo(
    () =>
      selectionFromInitialValues({
        employeeId: employeeIdValue,
        supplierProcessId: supplierProcessIdValue
      }),
    [employeeIdValue, supplierProcessIdValue]
  );

  const [selection, setSelection] = useState(initialSelection);
  const [actorKind, setActorKind] = useState<ActorKind>(() => {
    const decoded = decodeActorSelection(initialSelection);
    return decoded?.kind ?? resolvedDefault;
  });
  const [employeeId, setEmployeeId] = useState(employeeIdValue ?? "");
  const [supplierProcessId, setSupplierProcessId] = useState(
    supplierProcessIdValue ?? ""
  );

  const { error: employeeError } = useField("employeeId");
  const { error: supplierError } = useField("supplierProcessId");
  const actorError = employeeError ?? supplierError;

  const [people] = usePeople();
  const [suppliers] = useSuppliers();
  const supplierProcesses = useSupplierProcesses({
    processId: processId ?? undefined
  });

  const openCreateSupplierProcess = useCallback(() => {
    newSupplierProcessModal.onOpen();
  }, [newSupplierProcessModal.onOpen]);

  useEffect(() => {
    setSelection(initialSelection);
    const decoded = decodeActorSelection(initialSelection);
    if (decoded) {
      setActorKind(decoded.kind);
      if (decoded.kind === "employee") {
        setEmployeeId(decoded.id);
        setSupplierProcessId("");
        onSupplierProcessChange?.("");
      } else {
        setSupplierProcessId(decoded.id);
        setEmployeeId("");
        onSupplierProcessChange?.(decoded.id);
      }
      onActorKindChange?.(decoded.kind);
      return;
    }

    setActorKind(resolvedDefault);
    setEmployeeId("");
    setSupplierProcessId("");
    onSupplierProcessChange?.("");
    onActorKindChange?.(resolvedDefault);
  }, [
    initialSelection,
    resolvedDefault,
    onActorKindChange,
    onSupplierProcessChange
  ]);

  useEffect(() => {
    if (
      lockActorSelection ||
      defaultActorKind !== undefined ||
      !operationType
    ) {
      return;
    }
    const next = defaultActorKindFromOperationType(operationType);
    if (selection) {
      const decoded = decodeActorSelection(selection);
      if (decoded?.kind === next) return;
      setSelection("");
      setEmployeeId("");
      setSupplierProcessId("");
    }
    setActorKind(next);
    onActorKindChange?.(next);
  }, [
    operationType,
    lockActorSelection,
    defaultActorKind,
    selection,
    onActorKindChange
  ]);

  useEffect(() => {
    if (lockActorSelection || showSupplierActors || !selection) {
      return;
    }
    const decoded = decodeActorSelection(selection);
    if (decoded?.kind !== "supplier") {
      return;
    }
    setSelection("");
    setEmployeeId("");
    setSupplierProcessId("");
    setActorKind("employee");
    onActorKindChange?.("employee");
  }, [lockActorSelection, onActorKindChange, selection, showSupplierActors]);

  const groups = useMemo(() => {
    const employeeOptions =
      people.map((person) => ({
        value: encodeActorSelection("employee", person.id),
        label: (
          <div className="flex flex-row items-center gap-2 flex-grow">
            <Avatar name={person.name} path={person.avatarUrl} size="xs" />
            <span>{person.name}</span>
          </div>
        )
      })) ?? [];

    const supplierOptions = supplierProcesses.map((supplierProcess) => {
      const supplier = suppliers.find(
        (s) => s.id === supplierProcess.supplierId
      );
      const imageUrl = supplier?.website
        ? getFaviconUrl(supplier.website)
        : undefined;
      return {
        label: (
          <div className="flex flex-row items-center gap-2 flex-grow">
            <Avatar name={supplier?.name ?? ""} imageUrl={imageUrl} size="xs" />
            <span>{supplier?.name ?? t`Unknown Supplier`}</span>
          </div>
        ),
        value: encodeActorSelection("supplier", supplierProcess.id!)
      };
    });

    const pinnedSupplierProcessId = supplierProcessIdValue?.trim();
    if (pinnedSupplierProcessId) {
      const pinnedValue = encodeActorSelection(
        "supplier",
        pinnedSupplierProcessId
      );
      if (!supplierOptions.some((option) => option.value === pinnedValue)) {
        const fromProcess = supplierProcesses.find(
          (sp) => sp.id === pinnedSupplierProcessId
        );
        const resolvedSupplierId = fromProcess?.supplierId ?? supplierIdValue;
        const supplier = resolvedSupplierId
          ? suppliers.find((s) => s.id === resolvedSupplierId)
          : undefined;
        const imageUrl = supplier?.website
          ? getFaviconUrl(supplier.website)
          : undefined;
        supplierOptions.unshift({
          label: (
            <div className="flex flex-row items-center gap-2 flex-grow">
              <Avatar
                name={supplier?.name ?? ""}
                imageUrl={imageUrl}
                size="xs"
              />
              <span>{supplier?.name ?? t`Unknown Supplier`}</span>
            </div>
          ),
          value: pinnedValue
        });
      }
    }

    return [
      {
        id: "employee",
        heading: t`Employees`,
        options: employeeOptions,
        createLabel: t`Create employee`,
        onCreateOption: lockActorSelection
          ? undefined
          : () => navigate(path.to.newEmployee)
      },
      ...(showSupplierActors
        ? [
            {
              id: "supplier",
              heading: t`Suppliers`,
              options: supplierOptions,
              createLabel: t`Create supplier`,
              onCreateOption:
                lockActorSelection || !processId
                  ? undefined
                  : openCreateSupplierProcess
            }
          ]
        : [])
    ].filter((group) => {
      if (!lockActorSelection) return true;
      return group.id === actorKind;
    });
  }, [
    people,
    supplierProcesses,
    suppliers,
    supplierProcessIdValue,
    supplierIdValue,
    lockActorSelection,
    actorKind,
    processId,
    navigate,
    openCreateSupplierProcess,
    showSupplierActors,
    t
  ]);

  const applySelection = (value: string) => {
    setSelection(value);
    const decoded = decodeActorSelection(value);
    if (!decoded) {
      setEmployeeId("");
      setSupplierProcessId("");
      onSupplierProcessChange?.("");
      setActorKind(resolvedDefault);
      onActorKindChange?.(resolvedDefault);
      return;
    }

    setActorKind(decoded.kind);
    onActorKindChange?.(decoded.kind);
    if (decoded.kind === "employee") {
      setEmployeeId(decoded.id);
      setSupplierProcessId("");
      onSupplierProcessChange?.("");
    } else {
      setSupplierProcessId(decoded.id);
      setEmployeeId("");
      onSupplierProcessChange?.(decoded.id);
    }
  };

  const handleChange = (
    option: { value: string; label: string | React.ReactNode } | null
  ) => {
    applySelection(option?.value ?? "");
  };

  return (
    <div className="w-full">
      <GroupedCreatableCombobox
        ref={triggerRef}
        name="productionActorSelection"
        label={t`Name`}
        placeholder={t`Select name`}
        groups={groups}
        value={selection}
        onChange={handleChange}
        isReadOnly={lockActorSelection}
      />
      {actorError ? <FormErrorMessage>{actorError}</FormErrorMessage> : null}
      <Hidden name="actorKind" value={actorKind} />
      <Hidden name="employeeId" value={employeeId} />
      <Hidden name="supplierProcessId" value={supplierProcessId} />
      {newSupplierProcessModal.isOpen && processId && (
        <SupplierProcessForm
          type="modal"
          onClose={() => {
            newSupplierProcessModal.onClose();
            triggerRef.current?.click();
          }}
          initialValues={{
            processId,
            supplierId: "",
            minimumCost: 0,
            unitCost: 0,
            leadTime: 0
          }}
        />
      )}
    </div>
  );
}
