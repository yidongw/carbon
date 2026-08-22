import { SUPABASE_URL } from "@carbon/auth";
import { requirePermissions } from "@carbon/auth/auth.server";
import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";

// Raster image types the image-resizer handles reliably. SVG (vector), GIF
// (animation), and webp/avif are served as-is.
const resizableImageTypes = new Set(["jpg", "jpeg", "png"]);

const supportedFileTypes: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  webp: "image/webp",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  wmv: "video/x-ms-wmv",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  dxf: "application/dxf",
  dwg: "application/dxf",
  stl: "application/stl",
  obj: "application/obj",
  glb: "application/glb",
  gltf: "application/gltf",
  fbx: "application/fbx",
  ply: "application/ply",
  off: "application/off",
  step: "application/step"
};

export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { companyId } = await requirePermissions(request, {});
  const { bucket } = params;
  let path = params["*"];

  if (!bucket) throw new Error("Bucket not found");
  if (!path) throw new Error("Path not found");

  // Don't decode the path here - let Supabase handle the URL encoding
  // path = decodeURIComponent(path);

  const fileType = path.split(".").pop()?.toLowerCase();

  if (!fileType) {
    return new Response(null, { status: 400 });
  }
  const contentType = supportedFileTypes[fileType];

  // Check if the decoded path includes companyId for security
  const decodedPath = decodeURIComponent(path);
  if (!decodedPath.includes(companyId)) {
    return new Response(null, { status: 403 });
  }

  const serviceRole = await getCarbonServiceRole();

  async function downloadFile() {
    if (!path) throw new Error("Path not found");
    // Use the original encoded path for the storage API call
    const result = await serviceRole.storage.from(bucket!).download(path);
    if (result.error) {
      console.error(result.error);
      return null;
    }
    return result.data;
  }

  let fileData = await downloadFile();
  if (!fileData) {
    // Wait for a second and try again
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fileData = await downloadFile();
    if (!fileData) {
      throw new Error("Failed to download file after retry");
    }
  }

  const headers = new Headers({
    "Cache-Control": "private, max-age=31536000, immutable"
  });

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  // Optional on-the-fly downscale: `?height=N` returns a resized derivative so
  // small thumbnails (grid tiles, hover previews) don't pull the full-res
  // original. Best-effort — any failure falls through to the original bytes, and
  // the resized URL is unique so it's browser-cached like the original.
  const height = new URL(request.url).searchParams.get("height");
  if (height && fileType && resizableImageTypes.has(fileType)) {
    const parsed = Number(height);
    if (Number.isFinite(parsed) && parsed > 0) {
      try {
        const form = new FormData();
        form.append(
          "file",
          new File([fileData], `image.${fileType}`, {
            type: contentType ?? "image/png"
          }),
          `image.${fileType}`
        );
        form.append("height", String(Math.round(parsed)));

        const resized = await fetch(
          `${SUPABASE_URL}/functions/v1/image-resizer`,
          { method: "POST", body: form }
        );
        if (resized.ok) {
          const buffer = await resized.arrayBuffer();
          const resizedHeaders = new Headers({
            "Cache-Control": "private, max-age=31536000, immutable",
            "Content-Type":
              resized.headers.get("Content-Type") ?? contentType ?? "image/png"
          });
          return new Response(buffer, { status: 200, headers: resizedHeaders });
        }
      } catch (err) {
        console.error("preview resize failed, serving original", err);
      }
    }
  }

  return new Response(fileData, { status: 200, headers });
};
