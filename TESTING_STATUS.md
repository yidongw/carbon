# Testing Status - Pickup Hints Feature

## Implementation Complete ✅

The pickup-based hints feature has been successfully implemented in the ERP app with the following changes:

### Files Modified:
1. `apps/erp/app/modules/production/configParamsTableColumns.ts` - Hint calculation logic
2. `apps/erp/app/modules/production/configTableOverlay.server.ts` - Pickup data fetching
3. `apps/erp/app/modules/production/ui/Jobs/ProductionQuantityForm.tsx` - Employee ID wiring

### Feature Behavior:
- **When employee is selected**: Hints show `Employee Pickups - Employee Produced`
- **When no employee selected**: Hints show `Job Target - Total Produced` (original behavior)
- **Dynamic updates**: Hints recalculate after each production quantity is recorded

### Deployment:
- Branch: `discord/show-pickup-hints-and-adjusted-progress-923180`
- Commit: `699e2a2ac` - feat(erp): use pickup-based hints when employee selected
- Preview URL: https://erp-pr-106.foxhole.bot
- PR: #106

## Testing Limitation

**Current Status**: Unable to complete end-to-end testing in browser

**Reason**: The preview environment uses bypass authentication (bypass@mail.com account), but the test data exists in the `wy.dong96@gmail.com` account. The preview environment's authentication configuration prevents switching to a different account without production-level Supabase credentials.

## Required Testing with Real Data

To fully verify the feature works correctly, please test with the `wy.dong96@gmail.com` account:

### Test Scenario 1: Pickup-Based Hints Show Correctly

1. Login as `wy.dong96@gmail.com` on https://erp-pr-106.foxhole.bot
2. Navigate to a job that has:
   - Configuration parameters (e.g., Size: S, M, L, XL)
   - Pickups recorded for an employee
   - The operation/process associated with those pickups
3. Go to job Operations tab → Click "Record Quantity" (记录数量)
4. Select **Actor Type: Employee** (not Supplier)
5. Select the employee who has pickups
6. Click the **table icon (栅格)** next to the "数量" field
7. **Expected Result**: Hints should show the employee's pickup quantities (not job targets)

Example:
```
If employee picked up:
- S: 10
- M: 20
- L: 30

And employee has produced:
- S: 5
- M: 0
- L: 10

Hints should show:
- S: 5  (10 - 5 = 5)
- M: 20 (20 - 0 = 20)
- L: 20 (30 - 10 = 20)
```

### Test Scenario 2: Different Employees See Different Hints

1. Record pickups for Employee A and Employee B with different quantities
2. When selecting Employee A: hints show Employee A's pickups
3. When selecting Employee B: hints show Employee B's pickups
4. **Expected Result**: Each employee sees hints based on their own pickups

### Test Scenario 3: Fallback Behavior

1. Open "Record Quantity"
2. Select **Actor Type: Supplier** (or leave actor type without selecting employee)
3. Open config table
4. **Expected Result**: Hints show job target minus total produced (original behavior)

### Test Scenario 4: Hints Update After Production

1. Note the current hint values for an employee
2. Record some production for that employee
3. Open "Record Quantity" again for the same employee
4. **Expected Result**: Hints should decrease by the amount just produced

## Code Verification

The implementation has been verified at the code level:

✅ Type checking passes  
✅ Pickup data grouped correctly by employee  
✅ Hint calculation uses pickup quantities when employee selected  
✅ Fallback to original hints when no employee  
✅ Math.max(0, ...) prevents negative hints  
✅ Multiple pickups for same employee/config are summed  

## Next Steps

Please test the feature with the `wy.dong96@gmail.com` account that contains real pickup and production data. If any issues are found during testing, I can quickly address them.

The implementation is functionally complete and ready for user acceptance testing.
