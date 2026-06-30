# CLAUDE.md

## Environment

- This project is a manufacturing system called Carbon. It contains apps for ERP, MES, and a training app called academy.
- Any time you want to know about the project, first use the Task tool to query the files in `llm/cache/`. Do this constantly, literally any time you want to know anything. Don't check the code first, ALWAYS check the cache.
- There are specific workflows defined in `llm/workflows/`. ALWAYS use the Task tool to search for the relevant workflow file when told to do a workflow, then read and follow it.

## Core Principles

- **Simplicity First:** Make every change as simple as possible. Minimize code impact. Do not over-engineer simple or obvious fixes.
- **No Laziness:** Identify root causes. Avoid temporary fixes. Apply senior developer standards.
- **Minimal Impact:** Touch only what is necessary. Avoid introducing new bugs.
- **Demand Elegance:** For non-trivial changes, pause and ask whether there is a more elegant solution. If a fix feels hacky, implement the solution you would choose knowing everything you now know. Critically evaluate your own work before presenting it.
- **One Fix at a Time:** Make focused, surgical changes that address one issue without introducing regressions. When changing validation logic, explicitly verify that relaxing one constraint doesn't accidentally remove another required check.

## Workflow Orchestration

### Plan First

- Enter plan mode for any non-trivial task (three or more steps, or involving architectural decisions).
- If something goes wrong, stop and re-plan immediately rather than continuing blindly.
- Use plan mode for verification steps, not just implementation.
- Write detailed specifications upfront to reduce ambiguity.

### Subagent Strategy

- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, allocate more compute via subagents.
- Assign one task per subagent to ensure focused execution.

### Verification Before Done

- Never declare a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask: "Would a staff engineer approve this?"
- Run tests, check logs, and demonstrate correctness.
- **Test your own fixes in the browser before claiming they work.** Use `agent-browser` to navigate to the affected page/form, reproduce the bug, and verify it's fixed. Do NOT make the user test for you - they will waste time confirming fixes that don't actually work. Only tell the user "it's fixed" after you've verified it yourself.
- **When UI changes don't appear:** Add a visible test string (e.g., "XYZTEST123") to verify you're editing the correct component file BEFORE debugging build/cache systems. If the test string doesn't appear after building, you're editing the wrong file - trace backwards from the actual UI to find the right component.

### Autonomous Bug Fixing

- When given a bug report, fix it without asking for unnecessary guidance.
- Review logs, errors, and failing tests, then resolve them.
- Avoid requiring context switching from the user.
- Fix failing CI tests proactively.

## Task Management

1. **Plan First:** Write the plan to `llm/tasks/todo.md` with checkable items.
2. **Verify Plan:** Review before starting implementation.
3. **Track Progress:** Mark items complete as you go.
4. **Explain Changes:** Provide a high-level summary at each step.
5. **Add Review Section:** Add a review section to `llm/tasks/todo.md`.
6. **Capture Lessons:** Update `llm/tasks/lessons.md` after corrections.

### Self-Improvement Loop

- After any correction from the user, update `llm/tasks/lessons.md` with the relevant pattern.
- Create rules for yourself that prevent repeating the same mistake.
- Iterate on these lessons rigorously until the mistake rate declines.
- Review lessons at the start of each session when relevant to the project.

## Architecture Patterns

### Overlays, not pages (MANDATORY)

**Any transient UI surface — a modal, drawer, popup, or any panel — must be a URL-addressable overlay, NOT a standalone full-page route.** This applies to everything that is either **read-only** or does a **server submit** (create/edit forms, previews, detail panels). A `.../new` or `.../$id` URL must never render as its own page; it renders as an overlay layered on top of its parent list/detail page, with the page URL carrying an `?overlay=...` token.

**Exception:** simple delete confirmations may keep using the shared `ConfirmDelete` modal rendered through the parent list's `<Outlet/>` (e.g. `tags.delete.tsx`) — it's already a modal (not a full page) and is the app-wide convention. Don't build a registry overlay just for a delete confirm.

**The convention maps to `confirmMode`:** `"server"` (the primary button POSTs) or `"none"` (read-only — the only button dismisses). Set it in the registry entry.

**How to build one (mirror the production quantity/pickup overlays from PRs #131 / #144):**
1. **Registry** — add an entry to `apps/erp/app/components/Overlay/overlay.registry.tsx` with `type: "drawer" | "modal"`, optional `confirmMode`, and a `renderLazyOverlay(selectProps, () => import("...Form"))` that maps loader data → component props.
2. **Builder** — add an `overlay.to.<id>()` builder in `apps/erp/app/components/Overlay/overlay.ts` returning `{ id, url: \`${path.to.new...}?overlay=true\`, params? }`. `params` are mirrored into the page URL so the overlay is restorable from a deep link; the builder must accept those same params back.
3. **Form = content component** — the form renders the drawer/modal *body only* (`DrawerHeader/Body/Footer`), never its own `Drawer`/`Modal` wrapper (the host provides it). Its props are the `selectProps` output plus `Pick<OverlayFormInjectedProps, "onDismiss" | "fetcher" | "action">`; wire `<ValidatedForm action={action} fetcher={fetcher} method="post">`, a `<Submit>`, and a Cancel button calling `onDismiss`.
4. **Route = overlay-only** — the `.new`/`.$id` route loader redirects bare URLs (`overlay !== "true"`) to the list with the overlay token, and returns minimal loader data when `overlay === "true"`; its default component returns `null`. The action returns `data({ ok: true }, flash(success))` when `isOverlay` (the host closes + revalidates on `ok: true`), otherwise `redirect(...)`.
5. **Open it** — from a table/list, open via `const { openOverlay } = useOverlay(); openOverlay(overlay.to.<id>(), { onCreated: () => revalidator.revalidate() })`. Do not link to the `/new` page with `<New to=... />`.

The older "relative route + `<Outlet/>` + `<ModalDrawer>` self-wrapper" pattern (e.g. item posting groups) is legacy — do not copy it for new work; use the registry overlay above.

### Overlay vs Route Data Flow

**Critical:** Overlays and routes have different data flow patterns. Understanding this prevents state initialization bugs.

**How overlays work:**
1. Overlay opens with a URL like `/x/job/123/quantities/new?jobOperationId=xxx&overlay=true`
2. Route loader runs and extracts data from `request.url.searchParams` (HAS the params)
3. Loader data flows through overlay registry which transforms it into component props
4. Component receives data via `initialValues` prop
5. **BUT** `window.location.search` (what `useSearchParams()` reads) remains at the parent page URL (NO params)

**When initializing component state from URL params:**

❌ **Wrong** (checks URL first, fails for overlays):
```typescript
const [state] = useState(() => {
  const fromUrl = searchParams.get("key") ?? "";
  if (fromUrl) return fromUrl;  // Returns empty for overlays!
  return initialValues.key;      // Never reached
});
```

✅ **Correct** (checks initialValues first):
```typescript
const [state] = useState(() => {
  // Get from initialValues (works for both overlays and routes)
  const initial = initialValues.key;
  // Let URL params override (for route navigation)
  const fromUrl = searchParams.get("key") ?? "";
  return fromUrl || initial;
});
```

**When debugging state/prop issues:**
1. Trace the full flow: trigger → URL construction → loader → overlay registry → component initialization
2. Don't fix symptoms - understand where data is lost in the chain
3. Remember: overlay loaders see params, but overlay components' `useSearchParams()` don't

## Tool Rules

### General

- ALWAYS prefer your default tools over resorting to the Bash tool. You historically have a bad habit of doing `find ... | xargs ... grep` where you could just use your Grep tool. Avoid this! Just use the simple Grep tool.

### Grep

- ALWAYS try spawning a subtask to search the cache first if you are looking for something you aren't 100% confident exists.
- NEVER assume something exists with too specific a pattern. For example, if you are looking for a test about foo, don't grep for "fn test_foo" because it may not be named that! Think broader and more general.
- ALWAYS filter out the results from the `**/node_modules/**`, `**/.vercel/**` and `**/.turbo/**` directories which fill up with trash you don't want to search.
- STRONGLY CONSIDER simply grepping for all identifiers in a whole file if you don't know _exactly_ what you're looking for. Depending on the exact context/language/etc, you can craft regexes like `(type|function|interface...etc) .*[{;]$` or be more or less sophisticated as needed. Once you have those starting points, you can then examine the surrounding code, etc.
- STRONGLY CONSIDER using the Task tool to have a sub-agent run the grep if the results are of unknown size, such as dumping all the identifiers in a file. Have it return just the relevant stuff.

### TodoWrite

- ALWAYS append this to every item: "Spawn subtasks to query the cache folder any time I need to learn something about the codebase. NEVER update the cache with plans or information about code that is not yet committed." This is very important even though it seems silly.
- NEVER create an explicit todo item for updating the cache.

### Cache (`llm/cache/`)

- ALWAYS update the cache if you learn something about the codebase that was not in the cache and is not from a current change you're making (i.e. is committed).
- ALWAYS update the cache after a commit.
- NEVER update the cache about staged/uncommitted code.
- NEVER rebuild the database to test changes. Wait for the user to do that.

## Git Workflow

- **Always commit and push your work.** After completing a task, create a PR unless the user explicitly asks not to or the work is not meant to be merged.
- **NEVER create PRs to `crbnos/carbon`.** This repo is a fork of that upstream. Always open PRs to `yidongw/carbon` targeting `dev`.
- Always use `gh pr create --repo yidongw/carbon --base dev` — never omit `--repo`, as `gh` will otherwise default to the upstream (`crbnos/carbon`).

## Browser Automation

Use `agent-browser` for web automation. Run `agent-browser --help` for all commands.

Core workflow:

1. `agent-browser open <url>` - Navigate to page
2. `agent-browser snapshot -i` - Get interactive elements with refs (@e1, @e2)
3. `agent-browser click @e1` / `fill @e2 "text"` - Interact using refs
4. Re-snapshot after page changes