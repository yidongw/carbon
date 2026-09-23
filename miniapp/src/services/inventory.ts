import { request } from './request'

export interface ItemHit {
  id: string
  name: string
  desc: string
}

export interface StorageUnitRow {
  id: string
  name: string
}

export const searchAdjustmentItems = (q = '') =>
  request<{ rows: ItemHit[] }>({
    url: `/api/miniapp/items?adjustment=1&q=${encodeURIComponent(q)}`,
    method: 'GET',
  })

export const getStorageUnits = (itemId?: string) => {
  const q = itemId ? `?itemId=${encodeURIComponent(itemId)}` : ''
  return request<{
    locationId: string | null
    defaultStorageUnitId: string | null
    rows: StorageUnitRow[]
  }>({
    url: `/api/miniapp/storage-units${q}`,
    method: 'GET',
  })
}

export const submitInventoryAdjustment = (args: {
  itemId: string
  quantity: number
  storageUnitId?: string | null
  entryType: 'Positive Adjmt.' | 'Negative Adjmt.'
}) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/inventory-adjustment',
    method: 'POST',
    data: args,
  })
