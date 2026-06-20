import {
  Button,
  HStack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@carbon/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MONTH_NAMES } from "./salaryDetail.utils";

type SalaryPeriodPickerProps = {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
};

export default function SalaryPeriodPicker({
  year,
  month,
  onChange
}: SalaryPeriodPickerProps) {
  const prevMonth = () =>
    month === 1 ? onChange(year - 1, 12) : onChange(year, month - 1);
  const nextMonth = () =>
    month === 12 ? onChange(year + 1, 1) : onChange(year, month + 1);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => currentYear - 2 + i
  );

  return (
    <HStack spacing={2}>
      <Button size="sm" variant="ghost" onClick={prevMonth} aria-label="Previous month">
        <LuChevronLeft className="size-4" />
      </Button>
      <Select
        value={String(month)}
        onValueChange={(v) => onChange(year, Number(v))}
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MONTH_NAMES.map((name, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={String(year)}
        onValueChange={(v) => onChange(Number(v), month)}
      >
        <SelectTrigger className="w-24">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="ghost" onClick={nextMonth} aria-label="Next month">
        <LuChevronRight className="size-4" />
      </Button>
    </HStack>
  );
}
