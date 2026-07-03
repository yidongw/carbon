# Item Thumbnail System

## Overview

Items (Parts, Materials, Tools, Consumables) can have a thumbnail image. The
thumbnail is stored as a Supabase Storage object path (not a URL) in the
`item.thumbnailPath` TEXT column (added in
`20240630115404_model-uploads.sql`). A 3D model can also carry its own
thumbnail on `modelUpload.thumbnailPath`
(`20240719014956_model-uploads-thumbnail.sql`) which acts as a fallback —
detail RPCs COALESCE the two (item's wins), e.g. `get_part_details`.

## Storage

- Bucket: `private` (Supabase Storage).
- Path convention on the detail page: `${companyId}/thumbnails/${itemId}/<nanoid>.<ext>`
  where `itemId` is the item's UUID (`item.id`, not `readableId`).
- URLs are resolved through the app proxy via `getPrivateUrl(path)` →
  `/file/preview/private/${path}` (`apps/erp/app/utils/path.ts`), never a
  public URL.
- Uploads go through the `image-resizer` edge function
  (`resizeImageWithProgress` in `apps/erp/app/utils/upload.ts`) which returns a
  resized png/jpg blob, then `carbon.storage.from("private").upload(...)`.

## Display

- `apps/erp/app/components/ItemThumbnail.tsx` — read-only display used across
  ~30 tables/explorers. Falls back to a `MethodItemTypeIcon` placeholder when
  `thumbnailPath` is null.

## Upload / edit (detail page)

- `apps/erp/app/components/ItemThumnailUpload.tsx` (note the misspelled
  filename "Thumnail"). Rendered in the item Properties panels
  (`PartProperties.tsx`, `ToolProperties.tsx`, `MaterialProperties.tsx`,
  `ConsumableProperties.tsx`). It writes directly to the DB via the `useCarbon()`
  client (`item.thumbnailPath`, plus mirrors to `modelUpload.thumbnailPath`
  when a `modelId` is present) — NOT via a route action.
- Supports both the **Upload** file button and **drag-and-drop** (react-dropzone,
  shared `processFile`), with a "Drop image to upload" overlay while dragging.

## Upload on item creation (Part / Tool / Material / Consumable)

- Shared component **`ItemThumbnailField`**
  (`apps/erp/app/modules/items/ui/Item/ItemThumbnailField.tsx`) — a compact
  input-style row (small preview + file name + remove, drag/click). Used by
  `PartForm`, `ToolForm`, `MaterialForm`, `ConsumableForm` (all `!isEditing`).
  Because the item doesn't exist yet, it uploads to a **staging** path
  `${companyId}/thumbnails/staging/<nanoid>/<file>` and renders the hidden
  `thumbnailPath` field itself (mirrors the `modelUploadId` pattern). It takes an
  optional `onUpload(fileName)` callback; Part/Tool/Consumable use it to default
  the item ID to the image's file name (uppercased) when the ID is still empty.
  Material does not (its ID is structured/generated).
- `partValidator` / `toolValidator` / `consumableValidator` / `materialValidator`
  (`items.models.ts`) each have optional `thumbnailPath`; `upsertPart` /
  `upsertTool` / `upsertConsumable` / `upsertMaterial` (`items.service.ts`)
  persist it on the `item` insert (both material size-branches). Only the insert
  branch sets it — edits go through `ItemThumbnailUpload`.
- The staging path is **transient**: the Part/Tool/Consumable `new.tsx` actions,
  once they have the inserted item's id, move the object to
  `${companyId}/thumbnails/<itemId>/<file>` via
  `client.storage.from("private").move(...)` and update `item.thumbnailPath` to
  the final path — matching the detail-page convention. If the move fails they
  keep the staging path (still resolves). **Material intentionally skips the
  re-key**: a material with `sizes` inserts multiple item rows sharing one
  thumbnail object, so moving it would orphan the siblings — materials keep the
  staging path.
