import { SUPABASE_URL } from "@carbon/auth";
import { toast } from "@carbon/react";
import type { SupabaseClient } from "@supabase/supabase-js";

export type UploadProgress = (fraction: number) => void;

/**
 * A single toast that shows live 0-100% upload progress and disappears when the
 * upload finishes. Shared by every upload site so the experience is consistent.
 *
 * The percentage is appended outside the translated `label` so callers can reuse
 * the existing "Uploading {0}" catalog entry:
 *   const t = createUploadToast({ id, label: (p) => `${t`Uploading ${name}`} (${p}%)` })
 */
export function createUploadToast(opts: {
  id: string;
  label: (pct: number) => string;
}) {
  let pct = 0;
  toast.loading(opts.label(0), { id: opts.id });
  return {
    /** Feed XHR upload progress (a 0..1 fraction) straight in. */
    onProgress: (fraction: number) => {
      const next = Math.min(100, Math.max(0, Math.round(fraction * 100)));
      // Never let the bar visually go backwards across phases.
      if (next < pct) return;
      pct = next;
      toast.loading(opts.label(pct), { id: opts.id });
    },
    /** Dismiss the toast (the upload finished — nothing left to show). */
    dismiss: () => toast.dismiss(opts.id),
    /** Replace the progress toast in place with an error. */
    error: (message: string) => toast.error(message, { id: opts.id }),
  };
}

/**
 * Upload a file directly to Supabase Storage with real upload progress.
 *
 * Supabase JS `.upload()` exposes no progress events, so we mint a signed upload
 * URL with the authenticated client and PUT the file to it via XMLHttpRequest,
 * which does report `upload.onprogress`. The multipart body mirrors what
 * `uploadToSignedUrl` sends internally.
 */
export async function uploadToStorageWithProgress(
  carbon: SupabaseClient,
  opts: {
    bucket: string;
    path: string;
    file: File;
    upsert?: boolean;
    cacheControl?: string;
    onProgress?: UploadProgress;
  }
): Promise<{ data: { path: string } | null; error: Error | null }> {
  const {
    bucket,
    path,
    file,
    upsert = false,
    cacheControl = "3600",
    onProgress,
  } = opts;

  const { data: signed, error: signError } = await carbon.storage
    .from(bucket)
    .createSignedUploadUrl(path, { upsert });

  if (signError || !signed) {
    return {
      data: null,
      error: signError ?? new Error("Failed to create upload URL"),
    };
  }

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signed.signedUrl);
    xhr.setRequestHeader("x-upsert", String(upsert));
    xhr.setRequestHeader("cache-control", `max-age=${cacheControl}`);

    // Mirror uploadToSignedUrl's Blob handling: multipart with the file under
    // the empty field name. Do NOT set Content-Type — the browser adds the
    // multipart boundary.
    const body = new FormData();
    body.append("cacheControl", cacheControl);
    body.append("", file);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded / event.total);
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ data: { path: signed.path ?? path }, error: null });
        return;
      }
      let message = `Upload failed (${xhr.status})`;
      try {
        const parsed = JSON.parse(xhr.responseText);
        if (parsed?.message) message = parsed.message;
      } catch {
        // keep the generic message
      }
      resolve({ data: null, error: new Error(message) });
    };
    xhr.onerror = () =>
      resolve({ data: null, error: new Error("Network error during upload") });
    xhr.send(body);
  });
}

/**
 * Resize an image through the image-resizer edge function, reporting progress on
 * the (largest) original-file upload. Returns the resized blob.
 */
export async function resizeImageWithProgress(
  file: File,
  options: { height?: number | string; contained?: boolean } = {},
  onProgress?: UploadProgress
): Promise<{ status: number; blob: Blob; contentType: string | null }> {
  const formData = new FormData();
  formData.append("file", file);
  if (options.height != null) formData.append("height", String(options.height));
  if (options.contained) formData.append("contained", "true");

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/functions/v1/image-resizer`);
    xhr.responseType = "blob";
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded / event.total);
      }
    };
    xhr.onload = () =>
      resolve({
        status: xhr.status,
        blob: xhr.response as Blob,
        contentType: xhr.getResponseHeader("Content-Type"),
      });
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}
