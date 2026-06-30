import { useCarbon } from "@carbon/auth";
import { File } from "@carbon/react";
import { Trans, useLingui } from "@lingui/react/macro";
import { nanoid } from "nanoid";
import type { ChangeEvent } from "react";
import { LuUpload } from "react-icons/lu";
import { useSubmit } from "react-router";
import { useUser } from "~/hooks";
import { path } from "~/utils/path";
import {
  createUploadToast,
  uploadToStorageWithProgress
} from "~/utils/upload";

const DocumentCreateForm = () => {
  const { t } = useLingui();
  const submit = useSubmit();
  const { carbon } = useCarbon();
  const {
    company: { id: companyId }
  } = useUser();

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && carbon) {
      const file = e.target.files[0];
      const fileExtension = file.name.substring(file.name.lastIndexOf(".") + 1);
      const fileName = `${companyId}/${nanoid()}.${fileExtension}`;

      const uploadToast = createUploadToast({
        id: `document-${fileName}-${file.name}`,
        label: (pct) => `${t`Uploading ${file.name}`} (${pct}%)`
      });
      const fileUpload = await uploadToStorageWithProgress(carbon, {
        bucket: "private",
        path: fileName,
        file,
        upsert: true,
        cacheControl: `${12 * 60 * 60}`,
        onProgress: uploadToast.onProgress
      });

      if (fileUpload.error) {
        console.error(fileUpload.error);
        uploadToast.error(t`Failed to upload file`);
        return;
      }

      uploadToast.dismiss();

      if (fileUpload.data?.path) {
        submitFileData({
          path: fileUpload.data.path,
          name: file.name,
          size: file.size
        });
      }
    }
  };

  const submitFileData = ({
    path: filePath,
    name,
    size
  }: {
    path: string;
    name: string;
    size: number;
  }) => {
    const formData = new FormData();
    formData.append("path", filePath);
    formData.append("name", name);
    formData.append("size", Math.round(size / 1024).toString());
    submit(formData, {
      method: "post",
      action: path.to.newDocument,
      navigate: false
    });
  };

  return (
    <File leftIcon={<LuUpload />} onChange={uploadFile}>
      <Trans>Upload</Trans>
    </File>
  );
};

export default DocumentCreateForm;
