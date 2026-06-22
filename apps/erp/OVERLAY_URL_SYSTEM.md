# Universal Overlay URL System

## Overview

Every overlay in the Carbon ERP system now has a shareable URL. When you navigate to a URL with an `overlay` parameter, the system automatically opens the corresponding overlay.

## How It Works

1. **URL Format**: Any route with `?overlay={overlayId}` will auto-open that overlay
2. **Auto-detection**: `OverlayUrlHandler` component watches the URL and opens overlays automatically
3. **Clean URLs**: After opening, the `overlay` parameter is removed to prevent re-opening on refresh
4. **Backward Compatible**: Existing programmatic `openOverlay()` calls continue to work

## Architecture

### Components

- **`OverlayUrlHandler`** (`app/components/Overlay/OverlayUrlHandler.tsx`)
  - Detects `?overlay={overlayId}` in URL
  - Calls `openOverlay()` with the full URL
  - Removes `overlay` param after triggering
  - Rendered in main layout (`routes/x+/_layout.tsx`)

- **`overlay.to.*`** helpers (`app/components/Overlay/overlay.ts`)
  - All helpers now add `overlay={overlayId}` parameter
  - URLs are shareable and can be used for deep linking

### Flow

```
User navigates to URL with ?overlay=newJobPickup
  ↓
OverlayUrlHandler detects the parameter
  ↓
Calls openOverlay({ id: "newJobPickup", url: "/x/job/123/pickups/new?overlay=newJobPickup&jobOperationId=456" })
  ↓
RegisteredOverlay fetches the URL via fetcher
  ↓
Loader returns data, overlay renders
  ↓
URL is cleaned: /x/job/123/pickups/new?jobOperationId=456
```

## Usage

### Get a Shareable URL

```typescript
import { overlay } from "~/components/Overlay";

// Get the overlay target (has shareable URL)
const target = overlay.to.newJobPickup(jobId, { jobOperationId: operationId });

// Share the URL
console.log(target.url);
// Output: /x/job/123/pickups/new?jobOperationId=456&overlay=newJobPickup

// Copy to clipboard
navigator.clipboard.writeText(window.location.origin + target.url);
```

### Navigate to Overlay URL

```typescript
import { useNavigate } from "react-router";
import { overlay } from "~/components/Overlay";

function MyComponent() {
  const navigate = useNavigate();

  const openPickupForm = (jobId: string, operationId: string) => {
    const target = overlay.to.newJobPickup(jobId, { jobOperationId: operationId });
    navigate(target.url); // Navigates AND opens overlay automatically
  };

  return <button onClick={() => openPickupForm("123", "456")}>Record Pickup</button>;
}
```

### Direct Link Elements

```tsx
import { overlay } from "~/components/Overlay";

function Actions({ jobId, operationId }) {
  const pickupUrl = overlay.to.newJobPickup(jobId, { jobOperationId: operationId }).url;
  const quantityUrl = overlay.to.newJobProductionQuantity(jobId, { jobOperationId: operationId }).url;

  return (
    <div>
      <a href={pickupUrl}>Record Pickup</a>
      <a href={quantityUrl}>Record Production</a>
    </div>
  );
}
```

### Programmatic Opening (Existing Pattern)

```typescript
import { useOverlay, overlay } from "~/components/Overlay";

function MyComponent() {
  const { openOverlay } = useOverlay();

  const handleClick = () => {
    // This still works! The URL now includes overlay param automatically
    openOverlay(
      overlay.to.newJobPickup(jobId, { jobOperationId: operationId }),
      {
        onSuccess: () => {
          console.log("Overlay closed successfully");
        }
      }
    );
  };

  return <button onClick={handleClick}>Open Overlay</button>;
}
```

## Available Overlays

All registered overlays support URL-based opening:

### Production

1. **newJobPickup**
   ```
   /x/job/{jobId}/pickups/new?jobOperationId={opId}&overlay=newJobPickup
   ```

2. **newJobProductionQuantity**
   ```
   /x/job/{jobId}/quantities/new?jobOperationId={opId}&overlay=newJobProductionQuantity
   ```

3. **editJobProductionQuantity**
   ```
   /x/job/{jobId}/quantities/{quantityId}?overlay=editJobProductionQuantity
   ```

4. **jobBillOfProcessPreview**
   ```
   /api/production/jobs/{jobId}/bill-of-process?overlay=jobBillOfProcessPreview
   ```

5. **jobConfigTable**
   ```
   /api/production/jobs/{jobId}/config-table?overlay=jobConfigTable
   ```

6. **itemConfigTable**
   ```
   /api/items/{itemId}/config-table?overlay=itemConfigTable
   ```

## Use Cases

### 1. QR Codes for Shop Floor

Generate QR codes that open specific forms:

```typescript
function generatePickupQRCode(jobId: string, operationId: string) {
  const target = overlay.to.newJobPickup(jobId, { jobOperationId: operationId });
  const fullUrl = `${window.location.origin}${target.url}`;

  // Generate QR code from fullUrl
  return createQRCode(fullUrl);
}
```

### 2. Email Notifications

Send links that open specific overlays:

```html
<a href="https://app.carbon.com/x/job/JOB-001/pickups/new?jobOperationId=OP-10&overlay=newJobPickup">
  Click here to record pickup for Operation 10
</a>
```

### 3. External System Integration

Deep link from external MES or task management systems:

```typescript
// External system generates a link
const carbonUrl = `https://app.carbon.com/x/job/${jobId}/quantities/new?jobOperationId=${opId}&overlay=newJobProductionQuantity`;

sendNotification(operatorId, {
  message: "Production ready for recording",
  link: carbonUrl
});
```

### 4. Shareable Links

Users can copy and share overlay links:

```typescript
function ShareButton({ jobId, operationId }) {
  const handleShare = () => {
    const target = overlay.to.newJobPickup(jobId, { jobOperationId: operationId });
    const fullUrl = `${window.location.origin}${target.url}`;

    navigator.clipboard.writeText(fullUrl);
    toast.success("Link copied to clipboard!");
  };

  return <button onClick={handleShare}>Share Pickup Form</button>;
}
```

### 5. Bookmarks & Browser History

Overlay URLs appear in browser history and can be bookmarked. When revisited, they open the overlay automatically.

## Implementation Details

### URL Parameter Cleanup

After the overlay opens, the `overlay` parameter is removed from the URL:

```
Before: /x/job/123/details?overlay=newJobPickup&jobOperationId=456
After:  /x/job/123/details?jobOperationId=456
```

This prevents:
- Re-opening the overlay on page refresh
- Cluttering the URL in browser history
- Confusion when sharing the URL after the overlay closes

### One-Time Trigger

The `OverlayUrlHandler` uses a ref to ensure it only triggers once per page load:

```typescript
const hasTriggered = useRef(false);

useEffect(() => {
  if (hasTriggered.current) return;
  // ... open overlay logic
  hasTriggered.current = true;
}, [searchParams]);
```

### Fetcher-Based Data Loading

Overlays use React Router fetchers to load their data:

```typescript
// In RegisteredOverlay.tsx
const loadFetcher = useFetcher({ key: `overlay-load-${instance.id}` });

useEffect(() => {
  void loadOverlay.current(instance.url); // Fetches the overlay route
}, [instance.url]);
```

The route's loader returns the data needed by the overlay component.

## Adding New Overlays

To add a new overlay with URL support:

1. **Register in `overlay.registry.tsx`:**
   ```typescript
   export const overlayRegistry = {
     // ... existing overlays
     myNewOverlay: {
       type: "drawer", // or "modal"
       render: renderLazyOverlay(
         (ctx) => ctx.loaderData,
         () => import("~/path/to/MyOverlayComponent")
       )
     }
   } as const satisfies Record<string, OverlayRegistryEntry>;
   ```

2. **Add helper in `overlay.ts`:**
   ```typescript
   export const overlay = {
     to: {
       // ... existing helpers
       myNewOverlay(someId: string): OverlayTarget {
         const base = path.to.myRoute(someId);
         return {
           id: "myNewOverlay",
           url: addOverlayParam(base, "myNewOverlay")
         };
       }
     }
   };
   ```

3. **Create the route with loader:**
   ```typescript
   // app/routes/my-route.tsx
   export async function loader({ request }: LoaderFunctionArgs) {
     // Return data needed by overlay
     return { someData: "..." };
   }
   ```

4. **Use it:**
   ```typescript
   const target = overlay.to.myNewOverlay(someId);
   openOverlay(target); // Programmatic
   navigate(target.url); // URL-based
   ```

## Migration Notes

### Existing Code

No changes required! All existing `openOverlay()` calls continue to work. The overlay URLs now include the `overlay` parameter automatically, but this doesn't affect functionality.

### Before (still works)

```typescript
openOverlay(overlay.to.newJobPickup(jobId));
```

### After (also works, plus shareable URL)

```typescript
const target = overlay.to.newJobPickup(jobId);
navigate(target.url); // Now you can navigate directly
```

## Benefits

1. **Deep Linking**: Link directly to any overlay from anywhere
2. **Shareable URLs**: Users can share links to specific forms
3. **External Integration**: Other systems can link into Carbon
4. **QR Code Workflows**: Perfect for shop floor operations
5. **Browser History**: Overlays appear in history and can be bookmarked
6. **No Code Changes**: Existing code continues to work
7. **Type Safe**: TypeScript ensures overlay IDs are valid
8. **Flexible**: Works with navigation, links, programmatic opening, etc.

## Technical Considerations

### Why Not Route-Based Overlays?

We considered making overlays full routes (e.g., `/x/overlays/newJobPickup/...`), but chose URL parameters because:

1. **Context Preservation**: Overlays often need the context of the current page
2. **Simpler URLs**: No need for special overlay routes
3. **Backward Compatible**: Works with existing route structure
4. **Flexible**: Same route can show different overlays
5. **Clean History**: Overlay param removal keeps history clean

### Performance

- Fetchers are cached by React Router
- Lazy loading keeps initial bundle small
- URL parameter detection is O(1)
- No additional network requests beyond existing fetcher pattern
