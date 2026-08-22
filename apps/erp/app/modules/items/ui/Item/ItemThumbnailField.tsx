import { useCarbon } from "@carbon/auth";
import { Button, cn, toast, VStack } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { nanoid } from "nanoid";
import { useId, useState } from "react";
import { flushSync } from "react-dom";
import { useDropzone } from "react-dropzone";
import { LuImage, LuX } from "react-icons/lu";
import { Hidden } from "~/components/Form";
import { useUser } from "~/hooks";
import { getPrivateUrl } from "~/utils/path";
import { stripSpecialCharacters } from "~/utils/string";
import { createUploadToast, resizeImageWithProgress } from "~/utils/upload";

/**
 * Compact, input-styled thumbnail uploader for the item create forms
 * (Part/Tool/Material/Consumable). The image is uploaded to a staging path
 * before the item exists; the create action re-keys it under the item's own
 * folder after insert. Renders the hidden `thumbnailPath` field, so it must
 * live inside the form.
 *
 * `onUpload` is called with the original file name after a successful upload so
 * the caller can, e.g., default the item ID to the image name.
 */
export function ItemThumbnailField({
  onUpload,
  defaultPath
}: {
  onUpload?: (fileName: string) => void;
  defaultPath?: string | null;
}) {
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const {
    company: { id: companyId }
  } = useUser();
  const inputId = useId();

  const [thumbnailPath, setThumbnailPath] = useState<string | null>(
    defaultPath ?? null
  );
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    defaultPath ? getPrivateUrl(defaultPath) : null
  );
  const [thumbnailName, setThumbnailName] = useState<string | null>(null);
  // Staging path of the full-resolution original, moved into the item's Files by
  // the create action (independent of the resized thumbnail).
  const [originalPath, setOriginalPath] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    if (!carbon) return;
    flushSync(() => {
      setIsUploading(true);
    });

    const uploadToast = createUploadToast({
      id: `thumbnail-${file.name}`,
      label: (pct) => `${t`Uploading ${file.name}`} (${pct}%)`
    });

    try {
      const { status, blob, contentType } = await resizeImageWithProgress(
        file,
        {},
        uploadToast.onProgress
      );

      if (status < 200 || status >= 300) {
        throw new Error("Failed to resize image");
      }

      const resolvedType = contentType || "image/png";
      const fileExtension = resolvedType.includes("image/jpeg") ? "jpg" : "png";
      const fileName = `${nanoid()}.${fileExtension}`;
      const thumbnailFile = new File([blob], fileName, { type: resolvedType });

      const { data, error } = await carbon.storage
        .from("private")
        .upload(
          `${companyId}/thumbnails/staging/${nanoid()}/${fileName}`,
          thumbnailFile,
          { upsert: true }
        );

      if (error || !data) {
        uploadToast.error(t`Failed to upload thumbnail`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setThumbnailPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(blob);

      setThumbnailPath(data.path);
      setThumbnailName(file.name);

      // Also stage the full-resolution original so the create action can drop it
      // into the item's Files (the resized thumbnail is not the original).
      const originalUpload = await carbon.storage
        .from("private")
        .upload(
          `${companyId}/parts/staging/${nanoid()}/${stripSpecialCharacters(
            file.name
          )}`,
          file,
          { upsert: true }
        );
      if (!originalUpload.error && originalUpload.data) {
        setOriginalPath(originalUpload.data.path);
      }

      uploadToast.dismiss();

      onUpload?.(file.name);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      uploadToast.error(t`Failed to upload thumbnail: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const remove = () => {
    setThumbnailPath(null);
    setThumbnailPreview(null);
    setThumbnailName(null);
    setOriginalPath(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { "image/*": [] },
    onDropAccepted: async (acceptedFiles) => {
      await upload(acceptedFiles[0]);
    },
    onDropRejected: () => {
      toast.error(t`File type not supported`);
    }
  });

  return (
    <VStack spacing={1} className="mb-6 w-full">
      <Hidden name="thumbnailPath" value={thumbnailPath ?? ""} />
      <Hidden name="thumbnailName" value={thumbnailName ?? ""} />
      <Hidden name="thumbnailFilePath" value={originalPath ?? ""} />
      <label
        htmlFor={inputId}
        className="flex w-full items-center justify-between"
      >
        <span className="text-xs font-medium text-muted-foreground">
          <Trans>Thumbnail</Trans>
        </span>
        <span className="text-muted-foreground text-xxs">
          <Trans>Optional</Trans>
        </span>
      </label>
      <div
        {...getRootProps()}
        className={cn(
          "flex items-center gap-3 w-full rounded-md border bg-transparent px-2 py-2 text-sm cursor-pointer transition-colors hover:border-primary",
          isDragActive ? "border-primary bg-primary/10" : "border-input"
        )}
      >
        <input id={inputId} {...getInputProps()} />
        {thumbnailPreview ? (
          <img
            alt="thumbnail"
            src={thumbnailPreview}
            className="size-9 shrink-0 rounded object-cover border border-border"
          />
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded bg-muted">
            <LuImage className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {thumbnailName ? (
            <p className="truncate text-foreground">{thumbnailName}</p>
          ) : (
            <p className="text-muted-foreground">
              {isUploading ? (
                <Trans>Uploading…</Trans>
              ) : (
                <Trans>Drag and drop or click to upload</Trans>
              )}
            </p>
          )}
        </div>
        {thumbnailPreview && (
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              remove();
            }}
          >
            <LuX />
          </Button>
        )}
      </div>
    </VStack>
  );
}

export default ItemThumbnailField;
