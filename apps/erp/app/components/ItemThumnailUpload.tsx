import { useCarbon } from "@carbon/auth";
import { Button, File as FileUpload, HStack, toast } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { nanoid } from "nanoid";
import type { ChangeEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "~/hooks";
import { getPrivateUrl } from "~/utils/path";
import { createUploadToast, resizeImageWithProgress } from "~/utils/upload";
export function ItemThumbnailUpload({
  path,
  itemId,
  modelId
}: {
  path?: string | null;
  itemId: string;
  modelId?: string | null;
}) {
  const { t } = useLingui();
  const { company } = useUser();
  const { carbon } = useCarbon();

  const [thumbnailPath, setThumbnailPath] = useState<string | null>(() => {
    if (path) {
      return getPrivateUrl(path);
    }
    return null;
  });

  useEffect(() => {
    setThumbnailPath(path ? getPrivateUrl(path) : null);
  }, [path]);

  const onFileRemove = useCallback(async () => {
    if (!carbon) {
      toast.error(t`Carbon client not found`);
      return;
    }

    setThumbnailPath(null);

    const itemResult = await carbon
      .from("item")
      .update({
        thumbnailPath: null
      })
      .eq("id", itemId);

    if (itemResult.error) {
      toast.error(t`Failed to remove thumbnail`);
      return;
    }

    if (modelId) {
      const modelResult = await carbon
        .from("modelUpload")
        .update({
          thumbnailPath: null
        })
        .eq("id", modelId);

      if (modelResult.error) {
        toast.error(t`Failed to remove model thumbnail`);
        return;
      }
    }

    toast.success(t`Thumbnail removed`);
  }, [carbon, itemId, modelId, t]);

  const onFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!carbon) {
        toast.error(t`Carbon client not found`);
        return;
      }
      const file = e.target.files?.[0];
      if (file) {
        const uploadToast = createUploadToast({
          id: `thumbnail-upload-${itemId}`,
          label: (pct) => `${t`Uploading ${file.name}`} (${pct}%)`
        });

        try {
          const { status, blob, contentType } = await resizeImageWithProgress(
            file,
            {},
            uploadToast.onProgress
          );

          if (status < 200 || status >= 300) {
            let errorMessage = "Failed to resize image";
            if (contentType?.includes("application/json")) {
              try {
                const errorData = JSON.parse(await blob.text());
                if (errorData.error) errorMessage = errorData.error;
              } catch {
                // keep the generic message
              }
            }
            throw new Error(errorMessage);
          }

          const resolvedType = contentType || "image/png";
          const fileExtension = resolvedType.includes("image/jpeg")
            ? "jpg"
            : "png";

          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              const base64String = event.target.result as string;
              setThumbnailPath(base64String);
            }
          };
          reader.readAsDataURL(blob);

          const fileName = `${nanoid()}.${fileExtension}`;
          const thumbnailFile = new File([blob], fileName, {
            type: resolvedType
          });

          const { data, error } = await carbon.storage
            .from("private")
            .upload(
              `${company.id}/thumbnails/${itemId}/${fileName}`,
              thumbnailFile,
              {
                upsert: true
              }
            );

          if (error) {
            console.error("Failed to upload thumbnail to storage:", error);
            uploadToast.error(t`Failed to upload thumbnail`);
            return;
          }

          const result = await carbon
            .from("item")
            .update({
              thumbnailPath: data?.path
            })
            .eq("id", itemId);

          if (result.error) {
            uploadToast.error(t`Failed to update thumbnail path`);
            return;
          }

          if (modelId) {
            const modelResult = await carbon
              .from("modelUpload")
              .update({
                thumbnailPath: data?.path
              })
              .eq("id", modelId);

            if (modelResult.error) {
              console.error(
                "Failed to update model thumbnail path:",
                modelResult.error
              );
            }
          }

          if (data) {
            setThumbnailPath(getPrivateUrl(data.path));
          }
          uploadToast.dismiss();
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("Image processing error:", error);
          uploadToast.error(t`Failed to resize image: ${errorMessage}`);
        }
      }
    },
    [carbon, company.id, itemId, modelId, t]
  );

  return (
    <div className="relative w-full aspect-square">
      {thumbnailPath ? (
        <img
          alt="thumbnail"
          src={thumbnailPath}
          className="w-full h-full object-cover bg-gradient-to-bl from-muted to-muted/40 rounded-lg border border-border"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-bl from-muted to-muted/40 rounded-lg border border-border flex items-center justify-center">
          <span className="text-muted-foreground">
            <Trans>No image</Trans>
          </span>
        </div>
      )}
      <HStack className="absolute bottom-2 right-2">
        {thumbnailPath && (
          <Button
            variant="secondary"
            className="bg-card opacity-100"
            size="sm"
            onClick={onFileRemove}
          >
            <Trans>Remove</Trans>
          </Button>
        )}
        <FileUpload
          accept="image/*"
          variant="secondary"
          size="sm"
          className="bg-card opacity-100"
          onChange={onFileChange}
        >
          <Trans>Upload</Trans>
        </FileUpload>
      </HStack>
    </div>
  );
}
