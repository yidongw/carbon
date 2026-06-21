# Test Plan: Pickup Hints and Adjusted Progress

## Overview
This PR adds two features to the MES production quantity recording flow:
1. Pickup hints in the quantity modal
2. Adjusted progress calculation showing items in progress

## Implemented Changes

### Files Modified
- `apps/mes/app/components/JobOperation/components/QuantityModal.tsx`
- `apps/mes/app/components/JobOperation/JobOperation.tsx`
- `apps/mes/app/routes/x+/operation.$operationId.tsx`

## Test Scenarios

### Setup: Create Test Data
1. Navigate to a job operation in MES
2. Ensure the operation has a process that supports pickups
3. Have at least 2 employees (e.g., Person A, Person B)

### Test 1: Basic Pickup Hint (Simple Configuration)

**Steps:**
1. As Person A, log a pickup of 10 units (no configuration/variants)
2. Navigate to the operation and click "Complete"
3. **Verify**: Modal shows a pickup hint badge with "10"
4. Click the hint badge
5. **Verify**: Quantity input is auto-filled with "10"
6. Submit to record 5 units produced
7. Open "Complete" modal again
8. **Verify**: Hint badge now shows "5" (10 - 5 = 5 remaining)

**Expected Result:**
- Hint displays remaining pickup quantity
- Clicking hint fills the input
- Hint updates after production is recorded

### Test 2: Configuration-Based Pickup Hints

**Steps:**
1. As Person A, log pickup of 10 units with configuration: `{"size": "XL"}`
2. As Person A, log pickup of 15 units with configuration: `{"size": "L"}`
3. Click "Complete" modal
4. **Verify**: Two hint badges appear:
   - Badge 1: `{"size":"XL"}: 10`
   - Badge 2: `{"size":"L"}: 15`
5. Click the "XL" badge
6. **Verify**: Quantity input shows "10"
7. Submit to record 10 XL units
8. Reopen "Complete" modal
9. **Verify**: Only one hint remains: `{"size":"L"}: 15`

**Expected Result:**
- Multiple configurations shown as separate hints
- Hints filtered by configuration match
- Only configurations with remaining quantities shown

### Test 3: Multi-Employee Progress Calculation

**Setup:**
1. Person A: Pickup 10 XL units
2. Person B: Pickup 20 L units
3. Person A: Produce 5 XL units
4. Person C: Produce 10 L units (without pickup)

**Verification Points:**
1. Check the progress bar area at the bottom of the operation page
2. **Verify Main Progress**: Shows "15/X" (5 from A + 10 from C = 15 completed)
3. **Verify In-Progress Text**: Shows "+25 picked up, not yet produced"
   - Calculation: (A: 10-5=5) + (B: 20-0=20) = 25
4. **Verify Person C**: Their production (10 units) counts toward completion but NOT toward in-progress (since no pickup)

**Expected Result:**
- Progress bar shows correct completed count
- Secondary text shows adjusted in-progress quantity
- Only pickup-based work counts as "in progress"

### Test 4: Edge Cases

**4a. No Pickups Logged**
1. Navigate to operation with no pickups
2. Click "Complete" modal
3. **Verify**: No pickup hints displayed
4. **Verify**: Progress bar shows no in-progress text

**4b. All Pickups Consumed**
1. Person A: Pickup 10, Produce 10
2. Click "Complete" modal
3. **Verify**: No hints displayed (10 - 10 = 0)
4. **Verify**: No in-progress text shown

**4c. Scrap/Rework Modals**
1. Log a pickup
2. Open "Scrap" modal
3. **Verify**: Pickup hints appear
4. Open "Rework" modal
5. **Verify**: Pickup hints appear

**4d. Finish Modal**
1. Open "Finish" (close out) modal
2. **Verify**: NO pickup hints shown (finish modal shouldn't show hints)

## Browser Testing Notes

### Preview Deployment Issues Encountered
- ERP preview (https://erp-pr-106.foxhole.bot) has routing issues
- MES links redirect to production domains
- React app not hydrating properly on preview URLs

### Recommended Testing Approach
1. Test locally with `pnpm dev` in apps/mes
2. Use staging environment if available
3. Wait for preview deployment fix before browser testing

## Code Review Checklist

- [x] Pickup hints calculation groups by employee + configuration
- [x] Production quantities filtered to "Production" type only (excludes Scrap/Rework)
- [x] In-progress calculation uses same grouping logic
- [x] Hints only shown for complete/scrap/rework modals (not finish)
- [x] Props passed correctly through component hierarchy
- [x] TypeScript types updated for new props
- [x] Badge click handler updates quantity state
- [x] JSON.stringify used for configuration comparison (consistent serialization)

## Performance Considerations

- Both calculations use `useMemo` to avoid recalculating on every render
- Dependencies properly specified (pickups, productionQuantities, user.id, type)
- Map-based aggregation is efficient even with large datasets

## Accessibility

- Hints displayed as semantic Badge components
- Click handlers work with keyboard navigation
- Text clearly indicates these are suggestions ("Pickup suggestions:")
