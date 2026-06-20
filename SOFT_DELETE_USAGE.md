# Soft Delete Usage Guide

This implementation uses a **simple, explicit** approach to soft delete:
- Filter deleted records at query layer (not database layer)
- Block deleted items at route layer
- Relationships work naturally

## Quick Start

### 1. List Queries (filter deleted records)

Use `fromActive()` to automatically filter all soft-delete tables:

```typescript
import { fromActive } from "@carbon/database";

export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "items" });
  
  // One-line opt-in for automatic filtering
  const activeFrom = fromActive(client);
  
  // Automatically filters WHERE deletedAt IS NULL
  const items = await activeFrom("item")
    .select("*")
    .eq("companyId", companyId);
  
  return json({ items: items.data });
}
```

### 2. Detail Pages (block deleted records)

Use `assertNotDeleted()` in loaders:

```typescript
import { assertNotDeleted } from "~/utils/loader";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "items" });
  
  const item = await client
    .from("item")
    .select("*")
    .eq("id", params.itemId)
    .single();
  
  // Redirects to /x/deleted if item.deletedAt is set
  assertNotDeleted(item.data);
  
  return json({ item: item.data });
}
```

### 3. Historical Reads (include deleted records)

Just use the base client - don't use `fromActive()`:

```typescript
export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "quotes" });
  
  // Quote might reference deleted items - that's OK!
  const quote = await client
    .from("quote")
    .select(`
      *,
      quoteLine (
        *,
        item (*)  -- item might be deleted, we still want to show it
      )
    `)
    .eq("id", params.quoteId)
    .single();
  
  assertNotDeleted(quote.data);  // Block deleted quote, but not deleted items
  
  return json({ quote: quote.data });
}
```

### 4. Deleting Records

Use `softDelete()` for audit trail:

```typescript
import { softDelete } from "@carbon/database";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client, userId } = await requirePermissions(request, {
    delete: "items"
  });
  
  // Sets deletedAt = NOW() and deletedBy = userId
  await softDelete(client, "item", { id: params.itemId }, userId);
  
  return redirect("/x/item");
}
```

## Architecture Benefits

### ✅ Simple & Explicit
- See exactly where deleted records are filtered
- No magic, no hidden behavior
- Easy to audit and debug

### ✅ Relationships Work Naturally
- Documents can reference deleted items
- No need for `withIncludeDeleted()` gymnastics
- No separate `*.historical.server.ts` files

### ✅ Performance
- No AsyncLocalStorage overhead
- No client wrapping complexity
- Database does what it's good at (filtering)

### ✅ Flexible
- Easy to opt-in to filtering (`fromActive`)
- Easy to opt-out (use base `client`)
- Easy to customize per use case

## Common Patterns

### Pattern: Filter lists, allow deleted references

```typescript
const activeFrom = fromActive(client);

// List only active jobs
const jobs = await activeFrom("job").select("*, item(*)");
// ✅ Only returns jobs WHERE deletedAt IS NULL
// ✅ But job.item can still be deleted (historical reference)
```

### Pattern: Search/autocomplete

```typescript
const activeFrom = fromActive(client);

const items = await activeFrom("item")
  .select("id, name")
  .ilike("name", `%${search}%`)
  .limit(10);
// ✅ Automatically filters deleted items from search
```

### Pattern: Mixed filtering

```typescript
const activeFrom = fromActive(client);

const data = await Promise.all([
  activeFrom("job").select("*"),        // Filtered
  client.from("productionEvent").select("*"),  // Not filtered (no deletedAt)
  activeFrom("item").select("*")        // Filtered
]);
```

## Migration Guide

### Before (old client wrapper approach):
```typescript
const serviceRole = getCarbonServiceRole(userId);  // Always passed userId
const items = await serviceRole.from("item").select("*");  // Auto-filtered

// Need historical?
const allItems = await withIncludeDeleted(() => 
  serviceRole.from("item").select("*")
);
```

### After (new explicit approach):
```typescript
const client = getCarbonServiceRole();  // No userId needed for reads
const activeFrom = fromActive(client);

const items = await activeFrom("item").select("*");  // Explicit filter

// Need historical?
const allItems = await client.from("item").select("*");  // Explicit no-filter
```

## Supported Tables

All tables with `deletedAt`/`deletedBy` columns automatically work with `fromActive()`.

See `SOFT_DELETE_TABLES` in `packages/database/src/soft-delete.ts` for the full list (100+ tables).
