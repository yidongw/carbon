# URL-Based Overlay Form Opening

## Overview

The job details page supports opening overlay forms (pickup and production quantity) directly via URL parameters, enabling deep linking, QR code workflows, and external system integration.

## URL Patterns

### Open Pickup Form
```
/x/job/{jobId}/details?openPickup=true&jobOperationId={operationId}
```

### Open Production Quantity Form
```
/x/job/{jobId}/details?openQuantity=true&jobOperationId={operationId}
```

## Implementation

### Path Helpers (`app/utils/path.ts`)

Two new helper functions generate these URLs:

```typescript
path.to.jobDetailsWithPickupOverlay(jobId: string, jobOperationId: string)
// Returns: /x/job/{jobId}/details?openPickup=true&jobOperationId={operationId}

path.to.jobDetailsWithQuantityOverlay(jobId: string, jobOperationId: string)
// Returns: /x/job/{jobId}/details?openQuantity=true&jobOperationId={operationId}
```

### JobBillOfProcess Component

The `JobBillOfProcess` component (`app/modules/production/ui/Jobs/JobBillOfProcess.tsx`) detects URL parameters and auto-opens overlays:

1. Reads `openPickup`, `openQuantity`, and `jobOperationId` from URL params
2. If `openPickup=true` and `jobOperationId` exists, calls `onAddPickup(jobOperationId)`
3. If `openQuantity=true` and `jobOperationId` exists, calls `onAddProductionQuantity(jobOperationId)`
4. Removes URL parameters after triggering to prevent re-opening on refresh
5. Uses existing overlay infrastructure (`useOverlay`, `overlay.to.*`)

## Usage Examples

### Navigation with Auto-Open
```typescript
import { path } from "~/utils/path";
import { useNavigate } from "react-router";

const navigate = useNavigate();

// Open job with pickup form
navigate(path.to.jobDetailsWithPickupOverlay(jobId, operationId));

// Open job with quantity form
navigate(path.to.jobDetailsWithQuantityOverlay(jobId, operationId));
```

### Direct Links
```tsx
<a href={path.to.jobDetailsWithPickupOverlay(jobId, operationId)}>
  Record Pickup
</a>
```

### External Integration
```typescript
// Generate URL for QR code or external system
const url = `${window.location.origin}${path.to.jobDetailsWithPickupOverlay(jobId, operationId)}`;
```

## Use Cases

1. **QR Code Workflows**: Print QR codes on job travelers that open specific forms
2. **Email Notifications**: Send direct links to operators for specific actions
3. **External MES Integration**: Deep link from external systems into Carbon
4. **Mobile First**: Simplify mobile workflows with direct navigation
5. **Task Management**: Link from task lists directly to action forms

## Behavior

- Overlay opens automatically on page load if parameters are present
- Parameters are cleaned from URL immediately after triggering
- Refreshing the page does not re-open the overlay (params removed)
- If both `openPickup` and `openQuantity` are present, only pickup opens
- Invalid operation ID shows validation error in the form
- Requires valid permissions to open forms
- Works with all existing overlay callbacks and validation

## Related Files

- `apps/erp/app/utils/path.ts` — Path helper functions
- `apps/erp/app/modules/production/ui/Jobs/JobBillOfProcess.tsx` — URL detection and overlay triggering
- `apps/erp/app/components/Overlay/overlay.ts` — Overlay infrastructure
- `apps/erp/app/routes/x+/job+/$jobId.pickups.new.tsx` — Pickup form route
- `apps/erp/app/routes/x+/job+/$jobId.quantities.new.tsx` — Quantity form route

## Comparison to Programmatic Opening

### URL-based (for navigation/deep-linking)
```typescript
navigate(path.to.jobDetailsWithPickupOverlay(jobId, operationId));
```

### Programmatic (for in-page actions)
```typescript
const { openOverlay } = useOverlay();
openOverlay(
  overlay.to.newJobPickup(jobId, { jobOperationId: operationId }),
  { onSuccess: () => { /* ... */ } }
);
```

Both methods work and use the same underlying overlay system.
