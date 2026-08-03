import type { MultiSelectProps } from "@carbon/form";
import { MultiSelect } from "@carbon/form";
import { useMemo } from "react";
import { usePeople } from "~/stores";

export type EmployeesMultiSelectProps = Omit<MultiSelectProps, "options">;

/**
 * Multi-select of company employees sourced from the people store — the same
 * source as the single `Employee` select and the report-quantity actor list.
 * Prefer this over the group-based `Employees` (UserSelect) when you just need
 * to pick individual employees, not employee groups.
 */
const EmployeesMultiSelect = (props: EmployeesMultiSelectProps) => {
  const [people] = usePeople();

  const options = useMemo(
    () =>
      people.map((person) => ({
        value: person.id,
        label: person.name
      })),
    [people]
  );

  return (
    <MultiSelect
      options={options}
      {...props}
      label={props.label ?? "Employees"}
    />
  );
};

EmployeesMultiSelect.displayName = "EmployeesMultiSelect";

export default EmployeesMultiSelect;
