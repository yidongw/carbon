import { useCarbon } from "@carbon/auth";
import {
  Badge,
  Button,
  File as FileUpload,
  toast,
  VStack
} from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import type { ChangeEvent } from "react";
import { useSubmit } from "react-router";
import { Avatar } from "~/components";
import { path } from "~/utils/path";
import { createUploadToast, resizeImageWithProgress } from "~/utils/upload";
import type { Account } from "../../types";

const maxSizeMB = 10;

type ProfilePhotoFormProps = {
  user: Account;
};

const ProfilePhotoForm = ({ user }: ProfilePhotoFormProps) => {
  const { t } = useLingui();
  const { carbon } = useCarbon();
  const submit = useSubmit();

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && carbon) {
      let avatarFile = e.target.files[0];

      // Fail fast before hitting the resizer, which rejects files over 10MB.
      if (avatarFile.size > maxSizeMB * 1024 * 1024) {
        toast.error(
          t`File size exceeds ${maxSizeMB}MB limit. Current size: ${(
            avatarFile.size /
            1024 /
            1024
          ).toFixed(2)}MB`
        );
        return;
      }

      // One toast updated in place: a 0–100% progress bar that disappears when
      // the upload finishes. Percentage is appended outside the translated
      // string so it reuses the existing "Uploading {0}" translation.
      const fileName = avatarFile.name;
      const uploadToast = createUploadToast({
        id: `avatar-upload-${user.id}`,
        label: (pct) => `${t`Uploading ${fileName}`} (${pct}%)`
      });

      const fileExtension = avatarFile.name.substring(
        avatarFile.name.lastIndexOf(".") + 1
      );

      try {
        const { status, blob, contentType } = await resizeImageWithProgress(
          avatarFile,
          {},
          uploadToast.onProgress
        );

        if (status < 200 || status >= 300) {
          let errorMessage = "Failed to resize image";

          // Try to parse error response if it's JSON
          if (contentType?.includes("application/json")) {
            try {
              const errorData = JSON.parse(await blob.text());
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch {
              // If JSON parsing fails, use generic message
            }
          }

          throw new Error(errorMessage);
        }

        // Use the response content type to determine if it's JPG or PNG
        const resolvedType = contentType || "image/png";
        const outputExtension = resolvedType.includes("image/jpeg")
          ? "jpg"
          : "png";

        avatarFile = new File([blob], `${user.id}.${outputExtension}`, {
          type: resolvedType
        });
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to resize image";
        uploadToast.error(errorMessage);
        return;
      }

      const imageUpload = await carbon.storage
        .from("avatars")
        .upload(`${user.id}.${fileExtension}`, avatarFile, {
          cacheControl: "0",
          upsert: true
        });

      if (imageUpload.error) {
        console.error(imageUpload.error);
        const errorMessage =
          imageUpload.error.message || "Failed to upload image to storage";
        uploadToast.error(errorMessage);
        return;
      }

      if (imageUpload.data?.path) {
        uploadToast.dismiss();
        submitAvatarUrl(imageUpload.data.path);
      } else {
        uploadToast.error(t`Upload completed but no file path returned`);
      }
    }
  };

  const deleteImage = async () => {
    if (carbon && user?.avatarUrl) {
      const imageDelete = await carbon.storage
        .from("avatars")
        .remove([user.avatarUrl]);

      if (imageDelete.error) {
        const errorMessage =
          imageDelete.error.message || "Failed to remove image";
        toast.error(errorMessage);
        return;
      }

      toast.success(t`Photo removed successfully`);
      submitAvatarUrl(null);
    }
  };

  const submitAvatarUrl = (avatarPath: string | null) => {
    const formData = new FormData();
    formData.append("intent", "photo");
    if (avatarPath) formData.append("path", avatarPath);
    submit(formData, {
      method: "post",
      action: path.to.profile,
      replace: true
    });
  };

  return (
    <VStack className="px-8 items-center">
      <Avatar
        size="2xl"
        path={user?.avatarUrl}
        name={user?.fullName ?? undefined}
      />
      <FileUpload accept="image/*" onChange={uploadImage}>
        {user.avatarUrl ? t`Change` : t`Upload`}
      </FileUpload>

      {user.avatarUrl && (
        <Button variant="secondary" onClick={deleteImage}>
          <Trans>Remove</Trans>
        </Button>
      )}
      <Badge variant="outline">{t`${maxSizeMB}MB limit`}</Badge>
    </VStack>
  );
};

export default ProfilePhotoForm;
