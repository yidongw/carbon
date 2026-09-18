# Miniapp picking (MES parity)

Committed on `discord/keep-pr-open-new-thread-995187`.

## MES APIs (`apps/mes/app/routes/api+/`)

- `GET /api/miniapp/picking-lists` — assigned Draft/In Progress lists
- `GET /api/miniapp/picking-lists/:id` — execution detail + kits by jobOperation
- `POST /api/miniapp/picking-lists/:id/status` — Start (In Progress) / Finish (Completed)
- `POST /api/miniapp/picking-lists/:id/line-quantity` — pick / unpick / short (non-tracked)
- `GET|POST /api/miniapp/picking-lists/:id/lines/:lineId/tracked` — available lots + pick/unpick tracked

Reuse `picking.service.ts` / `inventory.service.ts` same as web `/x/picking`.

## Miniapp UI

- List: `miniapp/src/pages/picking/index.tsx` + `index.config.ts` (`navigationStyle: 'custom'`)
- Detail: `miniapp/src/pages/picking/detail.tsx` + `detail.config.ts` (`navigationStyle: 'custom'`)
- Entry: workstation `FN_ROUTE.picking` + functions tab → `/pages/picking/index`
- Client: `miniapp/src/services/picking.ts`
- **Required:** any page with `<NavBar>` must set `navigationStyle: 'custom'` or WeChat shows a double header (Carbon MES + page title).

Live preview MES for miniapp tunnel: pr-607 on `:5607`.
