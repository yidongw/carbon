# ERP Pickup Hints Testing Guide

## Feature Summary

Modified the production quantity form's configuration table to show **pickup-based hints** when an employee is selected, instead of job-target-based hints.

### What Changed

**Before:**
- Hints showed: `Job Target Quantity - Already Produced`
- Example: Job needs 698 total, 400 produced → hint shows **298**

**After:**
- **When employee is selected**: Hints show `Employee Pickups - Employee Produced`  
- Example: Employee A picked up 50 XL, produced 20 XL → hint shows **30**
- **When no employee selected**: Falls back to original behavior (job target hints)

## Files Modified

1. `apps/erp/app/modules/production/configParamsTableColumns.ts`
   - Added `pickupsByEmployee` to `ConfigReferenceSource` type
   - Added `employeeId` and pickup data to `ConfigTableReferenceContext`
   - Modified hint calculation logic in `buildConfigTableEditorState`

2. `apps/erp/app/modules/production/configTableOverlay.server.ts`
   - Fetch pickups grouped by employee in `getConfigReferenceSourceForOperation`

3. `apps/erp/app/modules/production/ui/Jobs/ProductionQuantityForm.tsx`
   - Pass selected employeeId to reference context when opening config table

## Testing Steps

### Prerequisites
You need:
- A job with an item that has configuration parameters (e.g., "Size" with options: S, M, L, XL, 2XL)
- A job operation for that job
- An employee user account

### Test Scenario 1: Pickup-Based Hints

**Setup:**
1. Navigate to the job
2. Go to the "Pickups" tab
3. Create pickups for Employee A:
   - Operation: (select an operation)
   - Employee: Employee A
   - Open config table and enter:
     - S: 10
     - M: 20
     - L: 30
     - XL: 40
   - Save pickup

**Test:**
1. Go to job "Operations" tab
2. Click "Record Quantity" on an operation
3. Select Actor: **Employee** (not Supplier)
4. Select Employee: **Employee A** (the one with pickups)
5. Click the **table icon (栅格)** next to the "数量" field
6. **Verify**: Hints should show:
   - S: **10** (pickup quantity, since nothing produced yet)
   - M: **20**
   - L: **30**
   - XL: **40**

**Record Production:**
1. In the config table, enter:
   - S: 5
   - M: 10
2. Confirm and save the production quantity

**Test Again:**
1. Open "Record Quantity" again
2. Select same employee (Employee A)
3. Open config table
4. **Verify**: Hints should now show:
   - S: **5** (10 picked up - 5 produced = 5 remaining)
   - M: **10** (20 - 10 = 10)
   - L: **30** (30 - 0 = 30, nothing produced yet)
   - XL: **40** (40 - 0 = 40)

### Test Scenario 2: Different Employee

**Setup:**
1. Create pickups for Employee B:
   - S: 15
   - L: 25

**Test:**
1. Open "Record Quantity"
2. Select Employee: **Employee B**
3. Open config table
4. **Verify**: Hints should show:
   - S: **15** (Employee B's pickups)
   - M: **0** (Employee B has no M pickups)
   - L: **25**
   - XL: **0**

### Test Scenario 3: No Employee Selected (Fallback)

**Test:**
1. Open "Record Quantity"
2. Select Actor: **Supplier** (or leave employee blank)
3. Open config table
4. **Verify**: Hints should show **job target minus total produced**
   - This is the original behavior
   - Not pickup-based

## Implementation Details

### Hint Calculation Logic

Located in `buildConfigTableEditorState` function:

```typescript
// If employee is selected and has pickups
if (referenceContext.employeeId && referenceContext.pickupsByEmployee) {
  const employeePickups = referenceContext.pickupsByEmployee[referenceContext.employeeId] ?? [];
  
  // Find pickup quantity for this config row
  let pickupQty = 0;
  for (const pickup of employeePickups) {
    const pickupRow = getConfigTableRows(pickup.configuration)[0];
    if (pickupRow && getMergeKey(pickupRow, columns) === key) {
      pickupQty += Number(pickupRow[col.key]) || 0;
    }
  }
  
  // Calculate produced quantity for this employee
  const producedQty = Number(otherByKey.get(key)?.[col.key]) || 0;
  
  // Hint = pickup - produced
  refs[col.key] = Math.max(0, pickupQty - producedQty);
}
```

### Data Flow

1. **User opens production quantity form** → `ProductionQuantityForm` loads
2. **Form loads config reference source** → `getConfigReferenceSourceForOperation` fetches:
   - Job configuration
   - Reported configurations
   - **NEW**: Pickups grouped by employee
3. **User selects employee** → employeeId stored in form state
4. **User clicks table icon** → `openConfigTable()` called
5. **Reference context built** → `buildJobRemainingReferenceContext` receives:
   - Config source (including pickups)
   - Selected employeeId
6. **Config table renders** → `buildConfigTableEditorState` calculates hints:
   - If employeeId present: use pickup-based calculation
   - Otherwise: use job-target-based calculation

## Visual Example

### Configuration Table UI

```
配置参数
698

L        XL       2XL      3XL      4XL
┌────┐   ┌────┐   ┌────┐   ┌────┐   ┌────┐
│ 0  │28 │ 0  │131│ 0  │302│ 0  │284│ 0  │103 🗑️
└────┘   └────┘   └────┘   └────┘   └────┘
```

The numbers to the right (28, 131, 302, 284, 103) are the **hints**.

**Before this change:**
- Always showed: Job Target - Total Produced (all employees combined)

**After this change:**
- When Employee A selected: Employee A Pickups - Employee A Produced
- When Employee B selected: Employee B Pickups - Employee B Produced
- When no employee: Job Target - Total Produced (original behavior)

## Edge Cases Handled

1. **No pickups for employee**: Hints show 0
2. **Produced more than picked up**: Hints show 0 (using `Math.max(0, ...)`)
3. **Multiple pickups for same employee/config**: Quantities are summed
4. **Null/undefined configurations**: Treated as empty string for consistent matching
5. **Supplier actor type**: Falls back to job-target hints (no employee selected)

## Success Criteria

- ✅ When employee selected with pickups, hints reflect pickup quantities
- ✅ Hints update correctly after production is recorded
- ✅ Different employees see different hints based on their pickups
- ✅ Fallback to original behavior when no employee selected
- ✅ No TypeScript errors
- ✅ No runtime errors in browser console

## Deployment

- **Branch**: `discord/show-pickup-hints-and-adjusted-progress-923180`
- **Commit**: `699e2a2ac` - feat(erp): use pickup-based hints when employee selected
- **Preview URL**: https://erp-pr-106.foxhole.bot
- **PR**: #106 - https://github.com/yidongw/carbon/pull/106
