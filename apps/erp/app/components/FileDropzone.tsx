import { Trans } from "@lingui/react/macro";
import type React from "react";
import { useDropzone } from "react-dropzone";
import { LuCloudUpload } from "react-icons/lu";

interface FileDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onDrop,
  accept,
  multiple = true
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-4 border-2 border-dashed rounded-md p-6 text-center hover:border-primary hover:bg-primary/10 ${
        isDragActive ? "border-primary bg-primary/10" : "border-card"
      }`}
    >
      <input {...getInputProps()} />
      <LuCloudUpload className="mx-auto h-12 w-12 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">
        {multiple ? (
          <Trans>
            Drag and drop some files here, or click to select files
          </Trans>
        ) : (
          <Trans>Drag and drop a file here, or click to select a file</Trans>
        )}
      </p>
    </div>
  );
};

export default FileDropzone;
