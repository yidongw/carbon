import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner
} from "@carbon/react";
import { useLingui } from "@lingui/react/macro";
import { useMemo, useState } from "react";
import { LuCheck, LuChevronsUpDown } from "react-icons/lu";
import { useFetcher, useNavigate } from "react-router";

export type SiblingOption = {
  /** The sibling entity id — used to mark the current entity as active. */
  value: string;
  /** Primary line (e.g. readable id). */
  label: string;
  /** Optional secondary line (e.g. name). */
  helper?: string;
  /** Detail URL to navigate to when selected. */
  to: string;
};

type DetailTopbarIdSelectorProps = {
  /** The current entity's readable id, shown in the trigger. */
  readableId: string;
  /** The current entity's id, to highlight the active row. */
  activeId: string;
  /** Resource route that returns the sibling list (fetched lazily on open). */
  listPath: string;
  /** Maps the raw loader payload into sibling options. */
  getOptions: (data: unknown) => SiblingOption[];
  /** Singular noun used in the aria label / placeholders (e.g. "style"). */
  entityLabel: string;
};

/** Cap rendered rows so a large list can't flood the DOM; search narrows first. */
const MAX_VISIBLE = 50;

/** Max width leaves room for status badges, copy, and overflow menu. */
const DETAIL_ID_MAX_WIDTH = "max-w-[calc(100%-7rem)]";

/**
 * Detail-page ID rendered as a searchable selector of sibling entities of the
 * same type. Clicking the ID opens a popover to search siblings and navigate to
 * the selected one. Drop-in replacement for `<DetailTopbarId>` in a header.
 */
export function DetailTopbarIdSelector({
  readableId,
  activeId,
  listPath,
  getOptions,
  entityLabel
}: DetailTopbarIdSelectorProps) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const fetcher = useFetcher<unknown>();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      // Lazy-load the sibling list the first time the selector opens.
      if (fetcher.state === "idle" && fetcher.data === undefined) {
        fetcher.load(listPath);
      }
    } else {
      setSearch("");
    }
  };

  const options = useMemo(
    () => (fetcher.data === undefined ? [] : getOptions(fetcher.data)),
    [fetcher.data, getOptions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const matches = q
      ? options.filter((option) =>
          `${option.label} ${option.helper ?? ""}`.toLowerCase().includes(q)
        )
      : options;
    return matches.slice(0, MAX_VISIBLE);
  }, [options, search]);

  const isLoading = fetcher.state === "loading";

  return (
    <div
      className={cn(
        "flex min-w-0 shrink items-center overflow-hidden",
        DETAIL_ID_MAX_WIDTH
      )}
    >
      <span
        aria-hidden
        className="hidden md:inline shrink-0 px-1.5 text-accent-foreground"
      >
        /
      </span>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={t`Switch ${entityLabel}`}
            className="flex min-w-0 items-center gap-1 rounded-sm outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="min-w-0 truncate font-semibold text-foreground">
              {readableId}
            </span>
            <LuChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          // The popover portals outside any modal subtree; stop wheel/touch from
          // being swallowed by a scroll-lock so the list scrolls (see Combobox).
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="w-[min(360px,calc(100vw-2rem))] p-0"
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={t`Search ${entityLabel}...`}
              className="h-9"
            />
            <CommandList>
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Spinner className="size-4" />
                </div>
              ) : (
                <>
                  <CommandEmpty>{t`No results found.`}</CommandEmpty>
                  <CommandGroup>
                    {filtered.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          setOpen(false);
                          setSearch("");
                          navigate(option.to);
                        }}
                      >
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate">{option.label}</span>
                          {option.helper && (
                            <span className="truncate text-xs text-muted-foreground">
                              {option.helper}
                            </span>
                          )}
                        </div>
                        <LuCheck
                          className={cn(
                            "ml-auto size-4",
                            option.value === activeId
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
