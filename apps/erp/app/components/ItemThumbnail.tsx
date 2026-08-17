import { cn, Modal, ModalClose, ModalContent } from "@carbon/react";
import { cva } from "class-variance-authority";
import type { MouseEvent } from "react";
import { useState } from "react";
import { LuSquareStack, LuX } from "react-icons/lu";
import type { MethodItemType } from "~/modules/shared";
import { getPrivateUrl } from "~/utils/path";
import { MethodItemTypeIcon } from "./Icons";

interface ItemThumbnailProps {
  thumbnailPath?: string | null;
  type?: MethodItemType;
  size?: "sm" | "md" | "lg" | "xl";
  /** When true (default), clicking the thumbnail opens a large preview modal. */
  enlarge?: boolean;
}

const containerVariants = cva(
  "relative flex-shrink-0 overflow-hidden rounded-lg bg-muted",
  {
    variants: {
      size: {
        sm: "size-8",
        md: "size-10",
        lg: "size-11 bg-gradient-to-bl from-muted to-muted/40",
        xl: "size-16 bg-gradient-to-bl from-muted to-muted/40"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
);

const placeholderVariants = cva("flex items-center justify-center", {
  variants: {
    size: {
      sm: "p-1",
      md: "p-1.5",
      lg: "p-2",
      xl: "p-2.5"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

const iconVariants = cva("text-[#AAAAAA] dark:text-[#444]", {
  variants: {
    size: {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8"
    }
  },
  defaultVariants: {
    size: "md"
  }
});

// Computing the cover scale is only a visual nicety (zoom letterboxed product
// photos to fill the frame), so it must be cheap. Two costs to avoid:
//  1) Scanning pixels at the image's *natural* resolution is O(w*h) in JS — a
//     1000x1000 image is ~1M iterations per call. We downscale into a tiny
//     canvas first; the fill bounding-box ratio is preserved well enough.
//  2) The same image can fire `onLoad` many times (the list table re-renders and
//     remounts thumbnail <img>s during hydration). We memoize the result per
//     src so repeated loads are a Map lookup, never another pixel scan.
const MAX_COVER_SCAN = 64;
const coverScaleCache = new Map<string, number>();

const getCoverScale = (img: HTMLImageElement) => {
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (!nw || !nh) {
    return 1;
  }

  // Downscale so the pixel loop below runs over at most MAX_COVER_SCAN^2 pixels.
  const shrink = Math.min(1, MAX_COVER_SCAN / Math.max(nw, nh));
  const width = Math.max(1, Math.round(nw * shrink));
  const height = Math.max(1, Math.round(nh * shrink));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return 1;
  }

  ctx.drawImage(img, 0, 0, width, height);
  let data: Uint8ClampedArray;
  try {
    data = ctx.getImageData(0, 0, width, height).data;
  } catch {
    // Cross-origin taint — can't read pixels; fall back to no scaling.
    return 1;
  }

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const isEmpty =
        a < 16 || (r > 235 && g > 235 && b > 235 && Math.abs(r - g) < 20);

      if (!isEmpty) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return 1;
  }

  const fillW = (maxX - minX + 1) / width;
  const fillH = (maxY - minY + 1) / height;
  const fill = Math.min(fillW, fillH);

  if (fill >= 0.98 || fill <= 0) {
    return 1;
  }

  return Math.min(1 / fill, 3);
};

const ItemThumbnail = ({
  thumbnailPath,
  type,
  size = "md",
  enlarge = true
}: ItemThumbnailProps) => {
  const url = thumbnailPath ? getPrivateUrl(thumbnailPath) : null;

  // Seed from the cache so remounts render at the right scale immediately and
  // don't need another scan/state update.
  const [coverScale, setCoverScale] = useState(
    () => (url && coverScaleCache.get(url)) || 1
  );
  const [previewOpen, setPreviewOpen] = useState(false);

  if (url) {
    const image = (
      <img
        alt="thumbnail"
        // Only fetch/decode thumbnails as they scroll into view, and decode off
        // the main thread — a long list only pays for the rows actually visible.
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover object-center"
        src={url}
        style={{
          transform: coverScale === 1 ? undefined : `scale(${coverScale})`,
          transformOrigin: "center"
        }}
        onLoad={(event) => {
          const cached = url ? coverScaleCache.get(url) : undefined;
          const scale = cached ?? getCoverScale(event.currentTarget);
          if (url && cached === undefined) {
            coverScaleCache.set(url, scale);
          }
          // Avoid a needless re-render (which would remount and reload the
          // image) when the value hasn't changed.
          setCoverScale((prev) => (prev === scale ? prev : scale));
        }}
      />
    );

    if (!enlarge) {
      return <div className={containerVariants({ size })}>{image}</div>;
    }

    return (
      <>
        <button
          type="button"
          className={cn(
            containerVariants({ size }),
            "cursor-zoom-in transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          aria-label="View full image"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            event.stopPropagation();
            event.preventDefault();
            setPreviewOpen(true);
          }}
        >
          {image}
        </button>
        <Modal open={previewOpen} onOpenChange={setPreviewOpen}>
          <ModalContent
            withCloseButton={false}
            className="w-auto max-w-[95vw] p-0 pt-0 sm:w-auto sm:max-w-[95vw] md:w-auto border-none bg-transparent shadow-none dark:shadow-none"
          >
            <div
              className="relative"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                alt="thumbnail"
                className="max-h-[90vh] max-w-[95vw] w-auto h-auto rounded-lg object-contain shadow-lg"
                src={url}
              />
              <ModalClose
                type="button"
                aria-label="Close"
                className="absolute right-2 top-2 flex items-center justify-center rounded-full bg-black/60 p-2 text-white outline-none transition-colors hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white"
              >
                <LuX className="h-4 w-4" />
              </ModalClose>
            </div>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <div
      className={cn(containerVariants({ size }), placeholderVariants({ size }))}
    >
      {type ? (
        <MethodItemTypeIcon className={iconVariants({ size })} type={type} />
      ) : (
        <LuSquareStack className={iconVariants({ size })} />
      )}
    </div>
  );
};

export default ItemThumbnail;
