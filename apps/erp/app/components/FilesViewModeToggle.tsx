import { ToggleGroup, ToggleGroupItem, useLocalStorage } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { useCallback } from "react";
import { LuLayoutGrid, LuList } from "react-icons/lu";

export type FilesViewMode = "list" | "icons";

const FILES_VIEW_MODE_KEY = "carbon:files-view-mode";

export function normalizeFilesViewMode(value: string | undefined): FilesViewMode {
  if (value === "icons" || value === "gallery") return "icons";
  return "list";
}

export function useFilesViewMode(): [
  FilesViewMode,
  (value: FilesViewMode) => void
] {
  const [stored, setStored] = useLocalStorage<string>(
    FILES_VIEW_MODE_KEY,
    "list"
  );
  const viewMode = normalizeFilesViewMode(stored);
  const setViewMode = useCallback(
    (mode: FilesViewMode) => setStored(mode),
    [setStored]
  );

  return [viewMode, setViewMode];
}

type FilesViewModeToggleProps = {
  value: FilesViewMode;
  onChange: (value: FilesViewMode) => void;
};

const FilesViewModeToggle = ({ value, onChange }: FilesViewModeToggleProps) => {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next === "list" || next === "icons") {
          onChange(next);
        }
      }}
      size="sm"
    >
      <ToggleGroupItem value="list" aria-label="List view">
        <LuList className="h-4 w-4" />
        <span className="sr-only">
          <Trans>List</Trans>
        </span>
      </ToggleGroupItem>
      <ToggleGroupItem value="icons" aria-label="Icon view">
        <LuLayoutGrid className="h-4 w-4" />
        <span className="sr-only">
          <Trans>Icons</Trans>
        </span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export { FILES_VIEW_MODE_KEY };
export default FilesViewModeToggle;
