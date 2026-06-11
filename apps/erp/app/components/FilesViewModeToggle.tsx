import { ToggleGroup, ToggleGroupItem } from "@carbon/react";
import { Trans } from "@lingui/react/macro";
import { LuGalleryHorizontal, LuList } from "react-icons/lu";

export type FilesViewMode = "list" | "gallery";

const FILES_VIEW_MODE_KEY = "carbon:files-view-mode";

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
        if (next === "list" || next === "gallery") {
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
      <ToggleGroupItem value="gallery" aria-label="Gallery view">
        <LuGalleryHorizontal className="h-4 w-4" />
        <span className="sr-only">
          <Trans>Gallery</Trans>
        </span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export { FILES_VIEW_MODE_KEY };
export default FilesViewModeToggle;
