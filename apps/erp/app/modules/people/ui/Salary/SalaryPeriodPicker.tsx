import {
  Button,
  HStack,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useLocale } from "@react-aria/i18n";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { formatMonthName } from "./salaryDetail.utils";

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
  const { t } = useLingui();
  const { locale } = useLocale();
  const prevMonth = () =>
    month === 1 ? onChange(year - 1, 12) : onChange(year, month - 1);
  const nextMonth = () =>
    month === 12 ? onChange(year + 1, 1) : onChange(year, month + 1);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <HStack spacing={2}>
      <Button
        size="sm"
        variant="ghost"
        onClick={prevMonth}
        aria-label={t`Previous month`}
      >
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
          {Array.from({ length: 12 }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1)}>
              {formatMonthName(i + 1, locale)}
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
      <Button
        size="sm"
        variant="ghost"
        onClick={nextMonth}
        aria-label={t`Next month`}
      >
        <LuChevronRight className="size-4" />
      </Button>
    </HStack>
  );
}
