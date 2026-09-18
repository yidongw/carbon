import { getCarbonServiceRole } from "@carbon/auth/client.server";
import type { LoaderFunctionArgs } from "react-router";
import { requireMiniappUser } from "~/utils/miniapp-auth.server";
import { jsonResponse } from "~/utils/miniapp-response";

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
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  csv: "text/csv",
  zip: "application/zip"
};

/**
 * 小程序文件下载/预览：对齐网页 `/file/preview/private/...`，
 * 但用 Bearer token（微信 downloadFile 不能带 cookie）。
 * Query: `?path={companyId}/{bucket}/{id}/{name}`（private bucket）。
 */
export async function loader({ request }: LoaderFunctionArgs) {
  const { companyId } = await requireMiniappUser(request);
  if (!companyId) {
    return jsonResponse({ message: "未选择公司" }, { status: 400 });
  }

  const url = new URL(request.url);
  const path = url.searchParams.get("path") ?? "";
  if (!path) {
    return jsonResponse({ message: "缺少 path" }, { status: 400 });
  }

  const decodedPath = decodeURIComponent(path);
  if (!decodedPath.includes(companyId)) {
    return new Response(null, { status: 403 });
  }

  const fileType = decodedPath.split(".").pop()?.toLowerCase();
  if (!fileType) {
    return new Response(null, { status: 400 });
  }
  const contentType = supportedFileTypes[fileType];

  const serviceRole = getCarbonServiceRole();

  async function downloadFile() {
    const result = await serviceRole.storage
      .from("private")
      .download(decodedPath);
    if (result.error) {
      console.error(result.error);
      return null;
    }
    return result.data;
  }

  let fileData = await downloadFile();
  if (!fileData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    fileData = await downloadFile();
    if (!fileData) {
      return jsonResponse({ message: "文件下载失败" }, { status: 404 });
    }
  }

  const headers = new Headers({
    "Cache-Control": "private, max-age=3600"
  });
  if (contentType) headers.set("Content-Type", contentType);
  const name = decodedPath.split("/").pop() ?? "file";
  headers.set(
    "Content-Disposition",
    `inline; filename*=UTF-8''${encodeURIComponent(name)}`
  );

  return new Response(fileData, { status: 200, headers });
}
