import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  IconButton,
  VStack
} from "@carbon/react";
import { convertKbToString } from "@carbon/utils";
import { Trans, useLingui } from "@lingui/react/macro";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuEllipsisVertical } from "react-icons/lu";
import { Link } from "react-router";
import DocumentIcon from "~/components/DocumentIcon";
import type { documentTypes } from "~/modules/shared";
import { path } from "~/utils/path";

export type FilesGalleryItem<T = unknown> = {
  id: string;
  name: string;
  documentType: (typeof documentTypes)[number];
  pathToFile?: string;
  createdAt?: string | null;
  sizeBytes?: number | null;
  isModel?: boolean;
  modelViewUrl?: string;
  previewType?: "PDF" | "Image";
  raw?: T;
};

type FilesGalleryViewProps = {
  items: FilesGalleryItem[];
  formatDate: (date: string) => string;
  onDownload: (item: FilesGalleryItem) => void;
  onDelete?: (item: FilesGalleryItem) => void;
  canDelete?: boolean;
  emptyMessage?: React.ReactNode;
};

const FilesGalleryView = ({
  items,
  formatDate,
  onDownload,
  onDelete,
  canDelete = false,
  emptyMessage
}: FilesGalleryViewProps) => {
  const { t } = useLingui();
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const stripRef = useRef<HTMLDivElement>(null);

  const selectedIndex = items.findIndex((item) => item.id === selectedId);
  const selectedItem = items[selectedIndex >= 0 ? selectedIndex : 0];

  useEffect(() => {
    if (items.length === 0) return;
    if (!items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0].id);
    }
  }, [items, selectedId]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || selectedIndex < 0) return;
    const thumb = strip.children[selectedIndex] as HTMLElement | undefined;
    thumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedIndex]);

  const selectByOffset = useCallback(
    (offset: number) => {
      if (items.length === 0) return;
      const currentIndex = items.findIndex((item) => item.id === selectedId);
      const nextIndex =
        currentIndex < 0
          ? 0
          : (currentIndex + offset + items.length) % items.length;
      setSelectedId(items[nextIndex].id);
    },
    [items, selectedId]
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        selectByOffset(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        selectByOffset(1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectByOffset]);

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        {emptyMessage ?? <Trans>No files</Trans>}
      </div>
    );
  }

  if (!selectedItem) return null;

  return (
    <VStack spacing={0} className="gap-0">
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
        <GalleryPreview item={selectedItem} />
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                aria-label={t`More`}
                icon={<LuEllipsisVertical />}
                variant="secondary"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {selectedItem.isModel && selectedItem.modelViewUrl && (
                <DropdownMenuItem asChild>
                  <Link to={selectedItem.modelViewUrl}>
                    <Trans>View</Trans>
                  </Link>
                </DropdownMenuItem>
              )}
              {selectedItem.previewType && selectedItem.pathToFile && (
                <DropdownMenuItem
                  onClick={() =>
                    window.open(
                      path.to.file.previewFile(
                        `private/${selectedItem.pathToFile}`
                      ),
                      "_blank"
                    )
                  }
                >
                  <Trans>View</Trans>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDownload(selectedItem)}>
                <Trans>Download</Trans>
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  destructive
                  disabled={!canDelete}
                  onClick={() => onDelete(selectedItem)}
                >
                  <Trans>Delete</Trans>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        ref={stripRef}
        className="flex gap-2 overflow-x-auto px-1 py-3 [scrollbar-width:thin]"
      >
        {items.map((item) => {
          const isSelected = item.id === selectedItem.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.name}
              aria-current={isSelected}
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background transition-shadow",
                isSelected
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:border-muted-foreground/30"
              )}
            >
              <GalleryThumbnail item={item} />
            </button>
          );
        })}
      </div>

      <HStack className="items-start justify-between gap-4 border-t px-1 pt-3">
        <VStack spacing={0} className="min-w-0 gap-0.5">
          <p className="truncate font-medium">{selectedItem.name}</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {selectedItem.sizeBytes
              ? convertKbToString(Math.floor(selectedItem.sizeBytes / 1024))
              : "--"}
            {selectedItem.createdAt && (
              <>
                {" · "}
                {formatDate(selectedItem.createdAt)}
              </>
            )}
          </p>
        </VStack>
      </HStack>
    </VStack>
  );
};

const GalleryPreview = ({ item }: { item: FilesGalleryItem }) => {
  if (item.isModel) {
    return (
      <VStack className="items-center gap-3 p-8 text-muted-foreground">
        <DocumentIcon type="Model" className="h-24 w-24" />
        <p className="max-w-md truncate text-sm font-medium text-foreground">
          {item.name}
        </p>
      </VStack>
    );
  }

  if (item.previewType === "Image" && item.pathToFile) {
    return (
      <img
        alt={item.name}
        className="max-h-[320px] max-w-full object-contain p-4"
        src={path.to.file.previewImage("private", item.pathToFile)}
      />
    );
  }

  if (item.previewType === "PDF" && item.pathToFile) {
    return (
      <iframe
        className="h-[320px] w-full border-0"
        title={item.name}
        src={path.to.file.previewFile(`private/${item.pathToFile}`)}
      />
    );
  }

  return (
    <VStack className="items-center gap-3 p-8 text-muted-foreground">
      <DocumentIcon type={item.documentType} className="h-24 w-24" />
      <p className="max-w-md truncate text-sm font-medium text-foreground">
        {item.name}
      </p>
    </VStack>
  );
};

const GalleryThumbnail = ({ item }: { item: FilesGalleryItem }) => {
  if (item.previewType === "Image" && item.pathToFile) {
    return (
      <img
        alt=""
        className="h-full w-full object-cover"
        src={path.to.file.previewImage("private", item.pathToFile)}
      />
    );
  }

  return <DocumentIcon type={item.documentType} className="h-8 w-8" />;
};

export default FilesGalleryView;
