import { Checkbox, Table, Tbody, Td, Th, Thead, Tr } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { UsePermissionMatrixReturn } from "~/hooks/usePermissionMatrix";
import { capitalize } from "~/utils/string";

type PermissionMatrixProps = {
  /** The return value from usePermissionMatrix */
  matrix: UsePermissionMatrixReturn;
  /** Optional section label (default: "Permissions") */
  label?: string;
  /** When true, renders checkboxes as read-only (no interaction) */
  isDisabled?: boolean;
};

const PermissionMatrix = ({
  matrix,
  label,
  isDisabled
}: PermissionMatrixProps) => {
  const { t } = useLingui();
  const resolvedLabel = label ?? t`Permissions`;

  // Translated display names for permission modules. `parts` is surfaced as
  // "Items" — its claim (`parts_*`) gates the whole item domain, and the app
  // labels it "Items" everywhere else (nav, /x/items/* routes). Case-insensitive
  // lookup: keys arrive lowercase (claims / api-key modules) or PascalCase
  // (employeeTypePermission). Falls back to a capitalized key for anything new.
  const moduleLabels: Record<string, string> = {
    accounting: t`Accounting`,
    documents: t`Documents`,
    inventory: t`Inventory`,
    invoicing: t`Invoicing`,
    parts: t`Items`,
    people: t`People`,
    printing: t`Printing`,
    production: t`Production`,
    purchasing: t`Purchasing`,
    quality: t`Quality`,
    resources: t`Resources`,
    sales: t`Sales`,
    settings: t`Settings`,
    users: t`Users`
  };
  const moduleLabel = (mod: string) =>
    moduleLabels[mod.toLowerCase()] ?? capitalize(mod);

  const actionLabels: Record<string, string> = {
    view: t`View`,
    create: t`Create`,
    update: t`Update`,
    delete: t`Delete`
  };
  const actionLabel = (action: string) =>
    actionLabels[action.toLowerCase()] ?? capitalize(action);

  const {
    modules,
    actions,
    isChecked,
    toggleCell,
    toggleRow,
    toggleAll,
    allChecked,
    someChecked,
    isRowAllChecked,
    isRowIndeterminate,
    hasAction
  } = matrix;

  return (
    <div
      className={`w-full${isDisabled ? " opacity-50 pointer-events-none select-none" : ""}`}
    >
      {resolvedLabel && (
        <label className="block text-sm font-medium leading-none mb-2">
          {resolvedLabel}
        </label>
      )}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <Thead>
            <Tr>
              <Th className="w-[140px]">
                <div className="flex items-center gap-2">
                  <Checkbox
                    isChecked={allChecked}
                    isIndeterminate={someChecked && !allChecked}
                    onCheckedChange={() => toggleAll()}
                  />
                  <span>
                    <Trans>Module</Trans>
                  </span>
                </div>
              </Th>
              {actions.map((action) => (
                <Th key={action} className="w-[80px] text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span>{actionLabel(action)}</span>
                  </div>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {modules.map(([mod]) => (
              <Tr key={mod}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      isChecked={isRowAllChecked(mod)}
                      isIndeterminate={isRowIndeterminate(mod)}
                      onCheckedChange={() => toggleRow(mod)}
                    />
                    <span className="text-sm font-medium">
                      {moduleLabel(mod)}
                    </span>
                  </div>
                </Td>
                {actions.map((action) => (
                  <Td key={action} className="text-center">
                    {hasAction(mod, action) ? (
                      <Checkbox
                        isChecked={isChecked(mod, action)}
                        onCheckedChange={() => toggleCell(mod, action)}
                      />
                    ) : (
                      <span className="text-muted-foreground pl-6 block">
                        --
                      </span>
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

export default PermissionMatrix;
