import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconButton
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { LuEllipsisVertical } from "react-icons/lu";
import { Link } from "react-router";
import DocumentIcon from "~/components/DocumentIcon";
import type { documentTypes } from "~/modules/shared";
import { path } from "~/utils/path";

export type FilesIconItem<T = unknown> = {
  id: string;
  name: string;
  documentType: (typeof documentTypes)[number];
  pathToFile?: string;
  isModel?: boolean;
  modelViewUrl?: string;
  previewType?: "PDF" | "Image";
  raw?: T;
};

type FilesIconViewProps = {
  items: FilesIconItem[];
  onDownload: (item: FilesIconItem) => void;
  onDelete?: (item: FilesIconItem) => void;
  canDelete?: boolean;
  emptyMessage?: React.ReactNode;
};

const FilesIconView = ({
  items,
  onDownload,
  onDelete,
  canDelete = false,
  emptyMessage
}: FilesIconViewProps) => {
  const { t } = useLingui();

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {emptyMessage ?? <Trans>No files</Trans>}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-x-3 gap-y-4 p-1">
      {items.map((item) => (
        <IconTile
          key={item.id}
          item={item}
          canDelete={canDelete}
          onDownload={onDownload}
          onDelete={onDelete}
          t={t}
        />
      ))}
    </div>
  );
};

const IconTile = ({
  item,
  canDelete,
  onDownload,
  onDelete,
  t
}: {
  item: FilesIconItem;
  canDelete: boolean;
  onDownload: (item: FilesIconItem) => void;
  onDelete?: (item: FilesIconItem) => void;
  t: ReturnType<typeof useLingui>["t"];
}) => {
  const openItem = () => {
    if (item.isModel && item.modelViewUrl) {
      window.open(item.modelViewUrl, "_blank");
      return;
    }

    if (item.previewType && item.pathToFile) {
      window.open(
        path.to.file.previewFile(`private/${item.pathToFile}`),
        "_blank"
      );
      return;
    }

    onDownload(item);
  };

  return (
    <div className="group relative flex flex-col items-center gap-1.5 text-center">
      <button
        type="button"
        aria-label={item.name}
        onClick={openItem}
        className="flex w-full flex-col items-center gap-1.5 rounded-lg p-2 transition-colors hover:bg-muted/60"
      >
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md border bg-background">
          <IconThumbnail item={item} />
        </div>
        <span className="line-clamp-2 w-full break-all text-xs leading-tight">
          {item.name}
        </span>
      </button>

      <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton
              aria-label={t`More`}
              icon={<LuEllipsisVertical />}
              size="sm"
              variant="secondary"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {item.isModel && item.modelViewUrl && (
              <DropdownMenuItem asChild>
                <Link to={item.modelViewUrl}>
                  <Trans>View</Trans>
                </Link>
              </DropdownMenuItem>
            )}
            {item.previewType && item.pathToFile && (
              <DropdownMenuItem onClick={openItem}>
                <Trans>View</Trans>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDownload(item)}>
              <Trans>Download</Trans>
            </DropdownMenuItem>
            {onDelete && (
              <DropdownMenuItem
                destructive
                disabled={!canDelete}
                onClick={() => onDelete(item)}
              >
                <Trans>Delete</Trans>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const IconThumbnail = ({ item }: { item: FilesIconItem }) => {
  if (item.previewType === "Image" && item.pathToFile) {
    return (
      <iframe
        className="pointer-events-none h-full w-full border-0"
        title={item.name}
        src={path.to.file.previewImage("private", item.pathToFile)}
      />
    );
  }

  return <DocumentIcon type={item.documentType} className="h-10 w-10" />;
};

export default FilesIconView;
