import { SelectBase } from "@carbon/form";
import {
  Badge,
  Button,
  Calendar,
  Combobox,
  HStack,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
  TimePicker
} from "@carbon/react";
import type { CalendarDate, CalendarDateTime } from "@internationalized/date";
import {
  getLocalTimeZone,
  parseAbsolute,
  parseDate,
  toCalendarDateTime
} from "@internationalized/date";
import { Trans } from "@lingui/react/macro";
import type { ReactElement } from "react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import type {
  BooleanCellConfig,
  DateCellConfig,
  EditableCellConfig,
  OptionItem,
  SelectCellConfig,
  TextCellConfig
} from "./types";
import { useEntityUpdate } from "./useEntityUpdate";
import { useSynced } from "./useSynced";

function toCalendarDate(value: string | null | undefined) {
  if (!value) return undefined;
  try {
    return parseDate(value.slice(0, 10));
  } catch {
    return undefined;
  }
}

function toCalendarDateTimeValue(value: string | null | undefined) {
  if (!value) return undefined;
  try {
    return toCalendarDateTime(parseAbsolute(value, getLocalTimeZone()));
  } catch {
    return undefined;
  }
}

function SelectCell<TRow extends { id?: string | null }>({
  row,
  config
}: {
  row: TRow;
  config: SelectCellConfig<TRow>;
}) {
  const update = useEntityUpdate(config.update);
  const [value, setValue] = useSynced(config.value(row) ?? undefined);

  const options =
    typeof config.options === "function" ? config.options(row) : config.options;

  const commit = (next: string) => {
    setValue(next || undefined);
    update(row.id!, config.field, next || null);
  };

  const renderInline = (v: string, opts: OptionItem[]): ReactElement => {
    if (config.renderInline) return config.renderInline(v, opts, row);
    // Resolve the option's label; never fall back to the raw id value (that shows
    // an ugly "LOC_..." / "SMETH_..." string while options are still loading).
    const label =
      opts.find((o) => o.value === v)?.label ?? config.fallbackLabel?.(row);
    if (label == null) return <span aria-hidden />;
    return <Badge variant="secondary">{label}</Badge>;
  };

  if (config.kind === "picker") {
    return (
      <Combobox
        value={value}
        isClearable={config.clearable}
        inline={renderInline}
        options={options}
        onChange={commit}
      />
    );
  }

  return (
    <SelectBase
      value={value}
      isClearable={config.clearable}
      inline={renderInline}
      options={options}
      onChange={commit}
    />
  );
}

function BooleanCell<TRow extends { id?: string | null }>({
  row,
  config
}: {
  row: TRow;
  config: BooleanCellConfig<TRow>;
}) {
  const update = useEntityUpdate(config.update);
  const [checked, setChecked] = useSynced(config.value(row) ?? false);
  const serialize = config.serialize ?? ((c: boolean) => (c ? "on" : "off"));

  return (
    <Switch
      variant="small"
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next);
        update(row.id!, config.field, serialize(next));
      }}
    />
  );
}

function TextCell<TRow extends { id?: string | null }>({
  row,
  config
}: {
  row: TRow;
  config: TextCellConfig<TRow>;
}) {
  const update = useEntityUpdate(config.update);
  const server = config.value(row) ?? "";
  const [editing, setEditing] = useState(false);

  const commit = (next: string) => {
    setEditing(false);
    if (next !== server) update(row.id!, config.field, next || null);
  };

  if (editing) {
    return (
      <Input
        autoFocus
        defaultValue={server}
        placeholder={config.placeholder}
        size="sm"
        className="border-0 bg-transparent rounded-none w-full"
        onBlur={(e) => commit(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(e.currentTarget.value);
          if (e.key === "Escape") setEditing(false);
        }}
      />
    );
  }

  // Display state: show the value, or a "+" affordance when empty — never blank.
  return (
    <button
      type="button"
      className="flex w-full items-center text-left text-sm hover:text-foreground"
      onClick={() => setEditing(true)}
    >
      {server ? (
        <span className="truncate">{server}</span>
      ) : (
        <span className="text-muted-foreground/60">
          <LuPlus className="size-4" />
        </span>
      )}
    </button>
  );
}

function DateCell<TRow extends { id?: string | null }>({
  row,
  config
}: {
  row: TRow;
  config: DateCellConfig<TRow>;
}) {
  const withTime = config.withTime ?? false;
  const update = useEntityUpdate(config.update);
  const [value, setValue] = useSynced(config.value(row) ?? undefined);
  const [open, setOpen] = useState(false);
  // Draft the selection so the change only lands on Save (mirrors the pickups
  // "Submitted" editor); Cancel / click-away discard, Clear resets to empty.
  const [draft, setDraft] = useState<CalendarDate | CalendarDateTime | null>(
    null
  );

  const preview = value ? (config.renderInline?.(value) ?? value) : "";

  const serialize = (d: CalendarDate | CalendarDateTime) =>
    withTime
      ? (d as CalendarDateTime).toDate(getLocalTimeZone()).toISOString()
      : d.toString();

  const openPicker = () => {
    setDraft(
      (withTime ? toCalendarDateTimeValue(value) : toCalendarDate(value)) ??
        null
    );
    setOpen(true);
  };
  const close = () => {
    setOpen(false);
    setDraft(null);
  };
  const commit = (next: string | null) => {
    setValue(next ?? undefined);
    update(row.id!, config.field, next);
    close();
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => (next ? openPicker() : close())}
      modal={false}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center text-left text-sm hover:text-foreground"
          data-prevent-row-nav
          onPointerDown={(e) => e.stopPropagation()}
        >
          {preview ? (
            <span className="truncate">{preview}</span>
          ) : (
            <span className="text-muted-foreground/60">
              <LuPlus className="size-4" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-auto overflow-hidden p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 pb-2">
          <Calendar
            value={draft}
            onChange={(date) =>
              setDraft((prev) => {
                if (!withTime) return date as CalendarDate;
                return prev
                  ? (prev as CalendarDateTime).set({
                      year: date.year,
                      month: date.month,
                      day: date.day
                    })
                  : toCalendarDateTime(date as CalendarDate);
              })
            }
          />
          {withTime && (
            <TimePicker
              label="Time"
              value={draft as CalendarDateTime | null}
              onChange={(time) => {
                if (!time) return;
                setDraft((prev) =>
                  prev
                    ? (prev as CalendarDateTime).set({
                        hour: time.hour,
                        minute: time.minute,
                        second: time.second,
                        millisecond: time.millisecond
                      })
                    : prev
                );
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-border bg-popover px-3 py-2">
          <Button type="button" variant="ghost" onClick={() => commit(null)}>
            <Trans>Clear</Trans>
          </Button>
          <HStack spacing={2}>
            <Button type="button" variant="secondary" onClick={close}>
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="button"
              variant="primary"
              isDisabled={!draft}
              onClick={() => commit(draft ? serialize(draft) : null)}
            >
              <Trans>Save</Trans>
            </Button>
          </HStack>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Generic inline-edit table cell. Dispatches by `kind` to the right form-context-free
 * base editor, applies optimistic UI, and submits through the module's update action.
 */
export function InlineEditCell<TRow extends { id?: string | null }>({
  row,
  config
}: {
  row: TRow;
  config: EditableCellConfig<TRow>;
}) {
  switch (config.kind) {
    case "boolean":
      return <BooleanCell row={row} config={config} />;
    case "text":
      return <TextCell row={row} config={config} />;
    case "date":
      return <DateCell row={row} config={config} />;
    default:
      return <SelectCell row={row} config={config} />;
  }
}
