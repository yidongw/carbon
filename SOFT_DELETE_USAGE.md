# Soft Delete Usage Guide

This implementation uses a **safe-by-default** approach to soft delete:
- All clients auto-filter deleted records by default
- Opt-in to include deleted records when needed
- Block deleted items at route layer
- Relationships work naturally

## Quick Start

### 1. List Queries (auto-filtered by default)

**The client automatically filters deleted records** - no code changes needed!

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, { view: "items" });
  
  // Automatically filters WHERE deletedAt IS NULL - nothing to do!
  const items = await client
    .from("item")
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

Pass `includeDeleted: true` to `requirePermissions()`:

```typescript
export async function loader({ params, request }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "quotes",
    includeDeleted: true  // ← Include deleted records
  });
  
  // Quote might reference deleted items - now we can see them!
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
  
  assertNotDeleted(quote.data);  // Block deleted quote, but allow deleted items
  
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

### Pattern: Default filtering with historical references

```typescript
// By default, client filters deleted records
const { client } = await requirePermissions(request, { view: "jobs" });

// List only active jobs
const jobs = await client.from("job").select("*, item(*)");
// ✅ Only returns jobs WHERE deletedAt IS NULL
// ✅ But to see deleted items in the references, use includeDeleted:

const { client } = await requirePermissions(request, {
  view: "jobs",
  includeDeleted: true
});
const jobs = await client.from("job").select("*, item(*)");
// ✅ Now job.item can be deleted (historical reference)
```

### Pattern: Search/autocomplete

```typescript
// Default client auto-filters
const { client } = await requirePermissions(request, { view: "items" });

const items = await client
  .from("item")
  .select("id, name")
  .ilike("name", `%${search}%`)
  .limit(10);
// ✅ Automatically filters deleted items from search
```

### Pattern: Mixed queries

```typescript
const { client } = await requirePermissions(request, { view: "production" });

const data = await Promise.all([
  client.from("job").select("*"),             // Auto-filtered
  client.from("productionEvent").select("*"), // No deletedAt, not affected
  client.from("item").select("*")             // Auto-filtered
]);
// All soft-delete tables automatically filtered
```

## Migration Guide

### Before (old soft-delete-v1):
```typescript
const serviceRole = getCarbonServiceRole(userId);
const items = await serviceRole.from("item").select("*");  // Auto-filtered

// Need historical?
const allItems = await withIncludeDeleted(() => 
  serviceRole.from("item").select("*")
);
```

### After (soft-delete-v2):
```typescript
// Default: auto-filtered (no changes needed!)
const { client } = await requirePermissions(request, { view: "items" });
const items = await client.from("item").select("*");

// Need historical?
const { client } = await requirePermissions(request, {
  view: "items",
  includeDeleted: true  // ← Simple opt-in
});
const allItems = await client.from("item").select("*");
```

## Supported Tables

All tables with `deletedAt`/`deletedBy` columns automatically work with `fromActive()`.

See `SOFT_DELETE_TABLES` in `packages/database/src/soft-delete.ts` for the full list (100+ tables).
