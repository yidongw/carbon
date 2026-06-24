import {
  Button,
  Calendar,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TimePicker,
  toast,
  cn
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { CalendarDateTime } from "@internationalized/date";
import {
  getLocalTimeZone,
  now,
  parseAbsolute,
  toCalendarDateTime
} from "@internationalized/date";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { formatDateTime } from "~/modules/production/productionQuantityDisplay.utils";

type EditableCreatedAtCellProps<T> = {
  createdAt: string | null | undefined;
  row: T;
  onSave: (newValue: string, row: T) => Promise<PostgrestSingleResponse<unknown>>;
  canEdit: boolean;
  className?: string;
};

function toCalendarValue(iso: string | null | undefined): CalendarDateTime {
  if (iso) {
    return toCalendarDateTime(parseAbsolute(iso, getLocalTimeZone()));
  }
  return toCalendarDateTime(now(getLocalTimeZone()));
}

function CreatedAtPickerPanel({
  value,
  onChange
}: {
  value: CalendarDateTime;
  onChange: (value: CalendarDateTime) => void;
}) {
  return (
    <div>
      <Calendar
        value={value}
        onChange={(date) => {
          onChange(
            value.set({
              year: date.year,
              month: date.month,
              day: date.day
            })
          );
        }}
      />
      <TimePicker
        label="Time"
        value={value}
        onChange={(time) => {
          if (!time) return;
          onChange(
            value.set({
              hour: time.hour,
              minute: time.minute,
              second: time.second,
              millisecond: time.millisecond
            })
          );
        }}
      />
    </div>
  );
}

export function EditableCreatedAtCell<T>({
  createdAt,
  row,
  onSave,
  canEdit,
  className
}: EditableCreatedAtCellProps<T>) {
  const { t } = useLingui();
  const [displayValue, setDisplayValue] = useState(createdAt ?? null);
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState<CalendarDateTime | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayValue(createdAt ?? null);
  }, [createdAt]);

  const display = formatDateTime(displayValue);

  const closePicker = () => {
    setOpen(false);
    setDraftValue(null);
  };

  const persistDraft = async (draft: CalendarDateTime) => {
    const iso = draft.toDate(getLocalTimeZone()).toISOString();
    if (iso === displayValue || saving) {
      closePicker();
      return;
    }

    const previous = displayValue;
    setSaving(true);

    const { error } = await onSave(iso, row);
    setSaving(false);

    if (error) {
      setDisplayValue(previous);
      toast.error(t`Failed to update time`);
      return;
    }

    setDisplayValue(iso);
    requestAnimationFrame(() => {
      closePicker();
    });
  };

  const handleSave = () => {
    if (!draftValue || saving) return;
    void persistDraft(draftValue);
  };

  const handleCancel = () => {
    if (saving) return;
    closePicker();
  };

  if (!canEdit) {
    return (
      <span
        className={cn(
          "text-sm text-muted-foreground whitespace-nowrap",
          className
        )}
      >
        {display}
      </span>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setDraftValue(toCalendarValue(displayValue));
          setOpen(true);
          return;
        }
        if (saving) return;
        handleCancel();
      }}
      modal={false}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "text-sm text-muted-foreground whitespace-nowrap text-left rounded-sm -mx-1 px-1 transition-shadow",
            "hover:underline cursor-pointer",
            open && "ring-2 ring-ring ring-inset bg-background",
            className
          )}
          data-prevent-row-nav
          onPointerDown={(event) => event.stopPropagation()}
        >
          {display}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-auto overflow-hidden p-0"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onClick={(event) => event.stopPropagation()}
        onPointerDown={(event) => event.stopPropagation()}
        onEscapeKeyDown={(event) => {
          if (saving) {
            event.preventDefault();
            return;
          }
          event.preventDefault();
          handleCancel();
        }}
        onInteractOutside={(event) => {
          if (saving) event.preventDefault();
        }}
      >
        {draftValue ? (
          <div
            className={cn("p-4 pb-3", saving && "pointer-events-none opacity-60")}
          >
            <CreatedAtPickerPanel value={draftValue} onChange={setDraftValue} />
          </div>
        ) : null}
        <div className="flex items-center justify-end gap-2 border-t border-border bg-popover px-4 py-3">
          <HStack spacing={2}>
            <Button
              type="button"
              variant="secondary"
              isDisabled={saving}
              onClick={handleCancel}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={saving}
              isDisabled={saving || !draftValue}
              onClick={handleSave}
            >
              <Trans>Save</Trans>
            </Button>
          </HStack>
        </div>
      </PopoverContent>
    </Popover>
  );
}
