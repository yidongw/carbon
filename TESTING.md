# Testing Guide for Production Pickups and Quantities Routes

## Overview
This document outlines the manual testing steps for the new production pickups and quantities routes.

## Prerequisites
- Development server running (`pnpm run dev` or `crbn up`)
- Logged in user with production permissions
- Existing jobs with operations in the database

## Test Cases

### Production Pickups

#### 1. List View
**Route**: `/x/production/pickups`

**Steps**:
1. Navigate to `/x/production/pickups`
2. Verify table displays with columns:
   - Job (with link to job detail)
   - Operation
   - Employee
   - Quantity
   - Notes
   - Created At
3. Verify "New Pickup" button is visible
4. Verify pagination works if there are many records
5. Verify search/filter functionality

**Expected**:
- Table renders without errors
- Links navigate correctly
- Data displays properly formatted

#### 2. Create New Pickup
**Route**: `/x/production/pickups/new`

**Steps**:
1. Click "New Pickup" button
2. Verify drawer opens from right side
3. Select a job from dropdown
   - Verify URL updates with `?jobId=...`
   - Verify page reloads
   - Verify operation dropdown populates
4. Select an operation from dropdown
   - Verify actor fields appear (Employee or Supplier)
5. Select an employee
6. Enter a quantity (e.g., 10)
7. Add notes (optional)
8. Click "Save"

**Expected**:
- Form validates all required fields
- If item has configuration parameters, quantity field shows config table button
- On successful save, redirects to `/x/production/pickups`
- Success toast message appears
- New pickup appears in table

**Error Cases**:
- Try to submit without selecting operation → validation error
- Try to submit without selecting employee → validation error
- Try to submit with quantity 0 or negative → validation error

#### 3. Pickup with Configuration Table
**Requirements**: Job's item must have configuration parameters

**Steps**:
1. Open new pickup form
2. Select a job whose item has configuration parameters
3. Select an operation
4. Click the config table button next to quantity field
5. Add configuration rows in the modal
6. Save the config table
7. Verify quantity auto-fills from config table total
8. Submit the form

**Expected**:
- Config table modal opens
- Can add/edit rows
- Total quantity updates based on config rows
- Configuration saves with the pickup

### Production Quantities

#### 1. List View
**Route**: `/x/production/quantities`

**Steps**:
1. Navigate to `/x/production/quantities`
2. Verify table displays with columns:
   - Job (with link to job detail)
   - Operation
   - Employee
   - Quantity (originalQuantity)
   - Notes
   - Created At
3. Verify "New Production Quantity" button is visible

**Expected**:
- Table renders without errors
- All data displays correctly

#### 2. Create New Production Quantity
**Route**: `/x/production/quantities/new`

**Steps**:
1. Click "New Production Quantity" button
2. Verify drawer opens
3. Select a job from dropdown
   - Verify URL updates and operations load
4. Select an operation
5. Select an employee
6. In the quantity lines editor:
   - Click "Add Line"
   - Select type: Production
   - Enter quantity: 10
   - (Optional) Add more lines with Scrap/Rework types
7. Add notes
8. Click "Save"

**Expected**:
- Form validates properly
- Quantity lines editor allows multiple lines
- Can add Production, Scrap, and Rework lines
- Scrap lines show scrap reason selector
- On save, redirects to `/x/production/quantities`
- New quantity report appears in table

**Scrap Line Test**:
1. Add a new line
2. Select type: Scrap
3. Verify scrap reason dropdown appears
4. Select a scrap reason
5. Enter quantity
6. Save

**Expected**:
- Scrap reason is required for Scrap type
- Form validates scrap reason presence

#### 3. Supplier Quantity
**Requirements**: Operation must support supplier routing

**Steps**:
1. Open new quantity form
2. Select a job with supplier operations
3. Select a supplier operation
4. Verify actor switches to "Supplier"
5. Select a supplier process
6. Verify supplier pricing fields appear (Unit Cost, Minimum Cost)
7. Add quantity lines
8. Save

**Expected**:
- Supplier-specific fields show/hide based on actorKind
- Supplier pricing fields allow input
- Form validates supplier process selection

## Known Limitations

1. **Database in Worktree**: The development server may fail to start in a git worktree due to database migration issues. Testing should be done in the main checkout.

2. **TypeScript Compilation**: If TypeScript errors appear, check:
   - All imports are correct
   - Component props match the expected types
   - Service functions are properly exported

## Verification Checklist

- [ ] Pickups list page loads
- [ ] Can create a new pickup with employee
- [ ] Can create a pickup with supplier
- [ ] Pickups table shows correct data
- [ ] Production quantities list page loads
- [ ] Can create production quantity with employee
- [ ] Can create production quantity with supplier
- [ ] Can add multiple quantity lines (Production/Scrap/Rework)
- [ ] Scrap reason is required for Scrap lines
- [ ] Configuration table works for items with config params
- [ ] All forms validate correctly
- [ ] Navigation and redirects work as expected
- [ ] No console errors in browser
- [ ] No TypeScript compilation errors

## Debugging Tips

1. **Form not loading operations**: Check browser console for errors, verify jobId is in URL params
2. **Validation errors**: Check browser network tab for API response
3. **Database errors**: Verify migrations are up to date
4. **Component not found**: Check imports and module exports

## Performance Considerations

- Large job lists may need pagination in the job selector
- Consider adding search/filter to job dropdown for better UX
- Table pagination should handle large datasets

## Future Enhancements

1. Add edit functionality for existing pickups/quantities
2. Add delete functionality with confirmation
3. Add filters for date ranges, employees, jobs
4. Add bulk import/export
5. Add approval workflow for quantities
6. Add real-time updates when new records are created
