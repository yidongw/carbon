# Job BOP Scroll and Drag Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the Get Method / Save Method bar pinned at the top of job details, place Bill of Process directly beneath it, and make Bill of Process cards reorderable by the top-right drag handle with edge auto-scroll during drag.

**Architecture:** Keep the existing shared `SortableList` pattern, but move the drag-edge scrolling logic into a small helper so it can be tested in isolation. Adjust the job details route layout so the top action row stays outside the scrollable content while the Bill of Process section lives immediately below it.

**Tech Stack:** React, TypeScript, framer-motion, Vitest, Tailwind CSS.

## Global Constraints

- Get Method / Save Method must remain visible at the top of the job details page.
- Bill of Process must render directly below the Get/Save row.
- Reordering must use the top-right drag handle only on each process card.
- Dragging near the top and bottom edges of the scroll container must auto-scroll in that direction.

---

### Task 1: Add a focused auto-scroll unit test

**Files:**
- Create: `apps/erp/app/components/sortableDragAutoScroll.test.ts`

**Interfaces:**
- Consumes: `getAutoScrollDirection` from `apps/erp/app/components/sortableDragAutoScroll.ts`
- Produces: a failing test that describes top-edge, bottom-edge, and middle-zone behavior

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { getAutoScrollDirection } from "./sortableDragAutoScroll";

describe("getAutoScrollDirection", () => {
  it("scrolls up near the top edge", () => {
    expect(
      getAutoScrollDirection({
        pointerY: 12,
        containerTop: 0,
        containerBottom: 600,
        threshold: 40
      })
    ).toBe(-1);
  });

  it("scrolls down near the bottom edge", () => {
    expect(
      getAutoScrollDirection({
        pointerY: 588,
        containerTop: 0,
        containerBottom: 600,
        threshold: 40
      })
    ).toBe(1);
  });

  it("does not scroll in the middle", () => {
    expect(
      getAutoScrollDirection({
        pointerY: 300,
        containerTop: 0,
        containerBottom: 600,
        threshold: 40
      })
    ).toBe(0);
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run: `pnpm exec vitest run app/components/sortableDragAutoScroll.test.ts`
Expected: FAIL because `sortableDragAutoScroll.ts` does not exist yet.

- [ ] **Step 3: Add the helper**

Create `apps/erp/app/components/sortableDragAutoScroll.ts` with the exported helper:

```ts
export function getAutoScrollDirection({
  pointerY,
  containerTop,
  containerBottom,
  threshold
}: {
  pointerY: number;
  containerTop: number;
  containerBottom: number;
  threshold: number;
}): -1 | 0 | 1 {
  if (pointerY < containerTop + threshold) return -1;
  if (pointerY > containerBottom - threshold) return 1;
  return 0;
}
```

- [ ] **Step 4: Run the test and confirm it passes**

Run: `pnpm exec vitest run app/components/sortableDragAutoScroll.test.ts`
Expected: PASS

### Task 2: Wire drag-handle auto-scroll into SortableList

**Files:**
- Modify: `apps/erp/app/components/SortableList.tsx`
- Modify: `apps/erp/app/components/sortableDragAutoScroll.ts`

**Interfaces:**
- Consumes: `getAutoScrollDirection`
- Produces: handle-only dragging that auto-scrolls the nearest scroll container while dragging near its edges

- [ ] **Step 1: Extend the helper if needed**
- [ ] **Step 2: Update `SortableListItem` to start a drag-edge loop on pointer down**
- [ ] **Step 3: Stop the loop on drag end / unmount**
- [ ] **Step 4: Verify the existing handle-only drag behavior still works**

### Task 3: Reorder job details layout

**Files:**
- Modify: `apps/erp/app/routes/x+/job+/$jobId.details.tsx`
- Modify: `apps/erp/app/modules/production/ui/Jobs/JobMakeMethodTools.tsx`
- Modify: `apps/erp/app/modules/production/ui/Jobs/JobBillOfProcess.tsx`

**Interfaces:**
- Consumes: existing `JobMakeMethodTools` and `JobBillOfProcess`
- Produces: pinned Get/Save row, Bill of Process immediately below it, scrollable content region beneath

- [ ] **Step 1: Move Bill of Process directly below the tools row**
- [ ] **Step 2: Make the tools row sticky at the top of the page scroll area**
- [ ] **Step 3: Keep the Bill of Process header and list inside the scrollable content area**
- [ ] **Step 4: Verify the existing overlay / make-method flows still render**

### Task 4: Verify the feature end-to-end

**Files:**
- None

**Interfaces:**
- Consumes: the modified job details page
- Produces: confidence that the page layout and reordering behavior work together

- [ ] **Step 1: Run the focused Vitest test**
- [ ] **Step 2: Run typecheck**
- [ ] **Step 3: Open the job details page in browser and verify sticky tools + reorder handle behavior**
