import { serve } from "https://deno.land/std@0.175.0/http/server.ts";
import {
  Gravity,
  ImageMagick,
  initializeImageMagick,
  MagickColor,
  MagickFormat,
  MagickGeometry,
  MagickReadSettings,
} from "npm:@imagemagick/magick-wasm@0.0.30";

const wasmBytes = await Deno.readFile(
  new URL(
    "magick.wasm",
    import.meta.resolve("npm:@imagemagick/magick-wasm@0.0.30")
  )
);
await initializeImageMagick(wasmBytes);

import { corsHeaders } from "../lib/headers.ts";

// Target maximum dimension for processing. Large JPEGs are decoded at or below
// this size via shrink-on-load; larger non-JPEG images are downscaled to it
// after decode. The 10MB file-size gate bounds the rest.
const MAX_SAFE_DIMENSION = 2000;

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log({
      function: "image-resizer",
    });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const targetHeight = formData.get("height") as string | null;
    const contained = !!(formData.get("contained") as string | null);

    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Log file info for debugging
    console.log({
      fileName: file.name,
      fileType: file.type,
      fileSize: bytes.length,
      targetHeight,
      contained,
    });

    // For extremely large files, reject immediately
    if (bytes.length > 10 * 1024 * 1024) {
      // 10MB limit
      const fileSizeMB = (bytes.length / (1024 * 1024)).toFixed(2);
      throw new Error(
        `File is ${fileSizeMB}MB, but maximum allowed size is 10MB`
      );
    }

    // Enhanced JPG detection - check both file extension and MIME type
    const isJpgFile =
      file.name.toLowerCase().endsWith(".jpg") ||
      file.name.toLowerCase().endsWith(".jpeg") ||
      file.type === "image/jpg" ||
      file.type === "image/jpeg";

    let result: Uint8Array;
    let outputFormat: MagickFormat = MagickFormat.Png;

    // Decode large JPEGs at reduced resolution (shrink-on-load) so a
    // multi-megapixel photo never expands to its full raw size in WASM memory —
    // that previously exhausted the function (WORKER_RESOURCE_LIMIT). This is
    // libjpeg DCT downscaling (`-define jpeg:size=NxN`): the decode lands in
    // [N, 2N) px on the constrained side, so even a 24MP photo decodes to
    // ~1.5MP — far more than enough for the <=300px thumbnails we output.
    // Shared by the primary and fallback read paths.
    const DECODE_HINT = 1000;
    const readSettings = new MagickReadSettings();
    readSettings.setDefine(
      MagickFormat.Jpeg,
      "size",
      `${DECODE_HINT}x${DECODE_HINT}`
    );

    try {
      result = await new Promise<Uint8Array>((resolve, reject) => {
        try {
          const data = ImageMagick.read(bytes, readSettings, (img) => {
            console.log({
              originalFormat: img.format,
              loadedWidth: img.width,
              loadedHeight: img.height,
              originalDepth: img.depth,
              originalColorSpace: img.colorSpace,
              isJpgFile,
            });

            // Bake the EXIF orientation into the pixels before we strip metadata
            // below — otherwise a portrait phone photo (stored landscape + an
            // orientation flag) uploads sideways once the flag is discarded.
            img.autoOrient();

            // Shrink-on-load only applies to JPEG; clamp anything still larger
            // than MAX_SAFE_DIMENSION (e.g. a PNG decoded at full size) down so
            // downstream processing stays cheap.
            const loadedMax = Math.max(img.width, img.height);
            if (loadedMax > MAX_SAFE_DIMENSION) {
              const scale = MAX_SAFE_DIMENSION / loadedMax;
              const newWidth = Math.floor(img.width * scale);
              const newHeight = Math.floor(img.height * scale);
              console.log(`Pre-scaling loaded image to ${newWidth}x${newHeight}`);
              img.resize(newWidth, newHeight);
            }

            // Enhanced JPG handling
            if (isJpgFile) {
              console.log("Enhanced handling for JPG/JPEG file");
              // First ensure it's in a consistent format
              img.format = MagickFormat.Jpeg;
              // Apply quality settings for JPEG
              img.quality = 95;
              // Then convert to PNG for further processing
              img.format = MagickFormat.Png;
            } else {
              // For non-JPG images, just convert to PNG
              img.format = MagickFormat.Png;
            }

            const width = img.width;
            const height = img.height;

            if (targetHeight) {
              console.log("Processing with targetHeight:", targetHeight);
              const targetHeightInt = parseInt(targetHeight, 10);

              // Ensure we have valid dimensions
              if (isNaN(targetHeightInt) || targetHeightInt <= 0) {
                throw new Error("Invalid target height");
              }

              const ratio = width / height;
              const targetWidthInt = Math.round(targetHeightInt * ratio);

              console.log(`Resizing to ${targetWidthInt}x${targetHeightInt}`);
              img.resize(targetWidthInt, targetHeightInt);
              img.quality = 90;
            } else if (contained) {
              console.log("Processing with contained mode");

              // For contained mode, use a more efficient approach
              // First resize to a reasonable size while maintaining aspect ratio
              const targetSize = 500; // Target size for the longer dimension
              let newWidth, newHeight;

              if (width > height) {
                newWidth = targetSize;
                newHeight = Math.round(targetSize * (height / width));
              } else {
                newHeight = targetSize;
                newWidth = Math.round(targetSize * (width / height));
              }

              console.log(
                `Resizing to ${newWidth}x${newHeight} before containment`
              );
              img.resize(newWidth, newHeight);

              // Calculate size with 10% padding
              const padding = 0.1; // 10% padding
              const maxDimension = Math.max(newWidth, newHeight);
              const sizeWithPadding = Math.ceil(
                maxDimension * (1 + 2 * padding)
              );

              console.log(`Extending to ${sizeWithPadding}x${sizeWithPadding}`);
              // Create geometry for the centered image with padding
              const containedGeometry = new MagickGeometry(
                0,
                0,
                sizeWithPadding,
                sizeWithPadding
              );
              containedGeometry.ignoreAspectRatio = true;

              // Use white background for JPG files, transparent for others
              const backgroundColor = isJpgFile
                ? new MagickColor("white")
                : new MagickColor("transparent");

              img.extent(containedGeometry, Gravity.Center, backgroundColor);

              console.log("Resizing to 300x300");
              const resizeGeometry = new MagickGeometry(300, 300);
              resizeGeometry.ignoreAspectRatio = true;
              img.resize(resizeGeometry);
              img.quality = 90;
            } else {
              console.log("Processing with default square crop mode");

              // For square crop, first resize to a reasonable size to reduce CPU usage
              const maxDimension = Math.max(width, height);
              if (maxDimension > 600) {
                const scaleFactor = 600 / maxDimension;
                const newWidth = Math.floor(width * scaleFactor);
                const newHeight = Math.floor(height * scaleFactor);
                console.log(
                  `Pre-scaling to ${newWidth}x${newHeight} before cropping`
                );
                img.resize(newWidth, newHeight);
              }

              // Now perform the square crop
              const size = Math.min(img.width, img.height);
              const x = Math.floor((img.width - size) / 2);
              const y = Math.floor((img.height - size) / 2);

              console.log(
                `Cropping to ${size}x${size} from position ${x},${y}`
              );
              const cropGeometry = new MagickGeometry(x, y, size, size);
              cropGeometry.ignoreAspectRatio = true;
              img.crop(cropGeometry);

              console.log("Resizing to 300x300");
              img.resize(300, 300);
              img.quality = 90;
            }

            // Strip metadata to reduce size
            img.strip();

            // Set the output format
            if (isJpgFile) {
              img.format = MagickFormat.Jpeg;
              outputFormat = MagickFormat.Jpeg;
            } else {
              img.format = MagickFormat.Png;
              outputFormat = MagickFormat.Png;
            }

            console.log(`Final processing complete, format: ${img.format}`);
            return img.write((data) => {
              console.log("Image data generated, size:", data.length);
              return data;
            });
          });

          if (!data) {
            throw new Error("Failed to process image: No data returned");
          }

          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    } catch (imgError) {
      console.error("ImageMagick processing error:", imgError);

      // Enhanced fallback for problematic images, especially JPGs
      result = await new Promise<Uint8Array>((resolve, reject) => {
        try {
          const data = ImageMagick.read(bytes, readSettings, (img) => {
            console.log("Using enhanced fallback processing method");

            // Honor EXIF orientation before stripping metadata (see primary path)
            img.autoOrient();

            // Special handling for JPG files in fallback
            if (isJpgFile) {
              console.log("Fallback: Enhanced handling for JPG/JPEG file");
              // Force conversion to JPEG with high quality
              img.format = MagickFormat.Jpeg;
              img.quality = 100;
              outputFormat = MagickFormat.Jpeg;

              // Apply a blur to help with problematic JPGs
              img.blur(0, 0.5);
            } else {
              outputFormat = MagickFormat.Png;
            }

            // Aggressively downscale first
            const scaleFactor = 800 / Math.max(img.width, img.height);
            const newWidth = Math.floor(img.width * scaleFactor);
            const newHeight = Math.floor(img.height * scaleFactor);

            console.log(`Fallback: downscaling to ${newWidth}x${newHeight}`);
            img.resize(newWidth, newHeight);

            if (!isJpgFile) {
              // Convert to PNG to maintain transparency for non-JPG images
              img.format = MagickFormat.Png;
            }

            if (contained) {
              // Simple contained mode for fallback
              const size = 300;
              const canvas = new MagickGeometry(0, 0, size, size);

              // Use white background for JPG files, transparent for others
              const backgroundColor = isJpgFile
                ? new MagickColor("white")
                : new MagickColor("transparent");

              img.extent(canvas, Gravity.Center, backgroundColor);
            } else {
              // Simple resize to 300x300
              img.resize(300, 300);
            }

            img.strip();
            img.quality = 90;

            return img.write((data) => data);
          });

          if (!data) {
            throw new Error(
              "Failed to process image in fallback: No data returned"
            );
          }

          resolve(data);
        } catch (err) {
          reject(err);
        }
      });
    }

    if (!result || result.length === 0) {
      throw new Error("Failed to generate image data");
    }

    // Determine the correct content type based on the output format
    const contentType = isJpgFile ? "image/jpeg" : "image/png";

    console.log(`Returning processed image with content type: ${contentType}`);
    return new Response(result, {
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Length": result.length.toString(),
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    console.error("Image processing error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
