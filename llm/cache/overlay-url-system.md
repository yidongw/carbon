# Overlay URL System

## Overview

Every overlay in Carbon ERP has a shareable URL. Navigate to any URL with `?overlay={overlayId}` and the system automatically opens that overlay.

## Architecture

### Key Components

**OverlayUrlHandler** (`apps/erp/app/components/Overlay/OverlayUrlHandler.tsx`)
- Detects `?overlay={overlayId}` in URL search params
- Calls `openOverlay()` with the full URL
- Removes overlay param after triggering (prevents re-opening on refresh)
- Rendered once in main layout (`apps/erp/app/routes/x+/_layout.tsx`)

**overlay.to.*** helpers** (`apps/erp/app/components/Overlay/overlay.ts`)
- All overlay helpers add `overlay={overlayId}` to URLs via `addOverlayParam()`
- URLs are shareable and support deep linking
- Backward compatible with programmatic `openOverlay()` calls

### How It Works

```
URL: /x/job/123/pickups/new?jobOperationId=456&overlay=newJobPickup
  ↓
OverlayUrlHandler detects overlay param
  ↓
Calls openOverlay({ id: "newJobPickup", url: "..." })
  ↓
RegisteredOverlay fetches URL via fetcher
  ↓
Loader returns data, overlay renders
  ↓
URL cleaned: /x/job/123/pickups/new?jobOperationId=456
```

## Usage

### Get Shareable URL

```typescript
import { overlay } from "~/components/Overlay";

const target = overlay.to.newJobPickup(jobId, { jobOperationId: operationId });
console.log(target.url);
// /x/job/123/pickups/new?jobOperationId=456&overlay=newJobPickup

// Share full URL
const shareUrl = window.location.origin + target.url;
navigator.clipboard.writeText(shareUrl);
```

### Navigate to Overlay

```typescript
import { useNavigate } from "react-router";
import { overlay } from "~/components/Overlay";

const navigate = useNavigate();
const target = overlay.to.newJobPickup(jobId, { jobOperationId });
navigate(target.url); // Opens overlay automatically
```

### Direct Links

```tsx
const target = overlay.to.newJobPickup(jobId, { jobOperationId });
<a href={target.url}>Record Pickup</a>
```

### Programmatic (Existing Pattern Still Works)

```typescript
import { useOverlay, overlay } from "~/components/Overlay";

const { openOverlay } = useOverlay();
openOverlay(overlay.to.newJobPickup(jobId), { onSuccess: () => {} });
```

## Available Overlays

All overlays in `overlay.registry.tsx` support URL-based opening:

- `newJobPickup` - `/x/job/{jobId}/pickups/new?jobOperationId={id}&overlay=newJobPickup`
- `newJobProductionQuantity` - `/x/job/{jobId}/quantities/new?jobOperationId={id}&overlay=newJobProductionQuantity`
- `editJobProductionQuantity` - `/x/job/{jobId}/quantities/{id}?overlay=editJobProductionQuantity`
- `jobBillOfProcessPreview` - API route with overlay param
- `jobConfigTable` - API route with overlay param
- `itemConfigTable` - API route with overlay param

## Use Cases

**QR Codes**: Generate QR codes with overlay URLs for shop floor workflows
**Email Links**: Send direct links to specific forms
**External Integration**: Deep link from external MES/task systems into Carbon
**Bookmarks**: Users can bookmark overlay URLs
**Sharing**: Copy/paste overlay URLs to colleagues

## Adding New Overlays

1. Register in `overlay.registry.tsx`
2. Add helper in `overlay.ts` using `addOverlayParam()`
3. Create route with loader that returns overlay data
4. Use `overlay.to.yourOverlay()` to get shareable URL

## Implementation Details

**URL Cleanup**: Overlay param removed after opening to prevent re-triggering
**One-Time Trigger**: Uses ref to ensure overlay only opens once per page load
**Fetcher-Based**: Uses React Router fetchers for data loading (existing pattern)
**Type Safe**: OverlayId type ensures only registered overlays can be referenced
**Backward Compatible**: All existing `openOverlay()` calls continue to work

## Files

- `apps/erp/app/components/Overlay/OverlayUrlHandler.tsx` - URL detection component
- `apps/erp/app/components/Overlay/overlay.ts` - Overlay helpers with URL generation
- `apps/erp/app/components/Overlay/overlay.registry.tsx` - Overlay registration
- `apps/erp/app/components/Overlay/OverlayProvider.tsx` - Overlay state management
- `apps/erp/app/components/Overlay/RegisteredOverlay.tsx` - Overlay rendering with fetchers
- `apps/erp/app/routes/x+/_layout.tsx` - Where OverlayUrlHandler is rendered
