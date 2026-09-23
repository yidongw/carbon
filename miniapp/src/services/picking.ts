import { request } from './request'

export interface PickingListRow {
  id: string
  pickingListId: string
  status: string
  locationName: string
  dueDate: string | null
  lineCount: number
  completedLineCount: number
  progress: number
}

export interface PickedLot {
  id: string
  trackedEntityId: string
  readableId: string
  quantity: number
}

export interface PickingLine {
  id: string
  itemId: string
  itemName: string
  itemDesc: string
  trackingType: string
  jobId: string
  jobOperationId: string
  processName: string
  workCenterName: string
  opOrder: number | null
  quantityToPick: number
  quantityPicked: number
  availableQuantity: number
  status: string
  fromBin: string
  toBin: string
  trackedEntities: PickedLot[]
}

export interface PickingKit {
  id: string
  jobId: string
  processName: string
  workCenterName: string
  title: string
  lines: PickingLine[]
}

export interface PickingDetail {
  found: boolean
  id?: string
  pickingListId?: string
  status?: string
  locked?: boolean
  locationName?: string
  dueDate?: string | null
  kits?: PickingKit[]
  lines?: PickingLine[]
}

export interface TrackedEntityRow {
  id: string
  readableId: string
  quantity: number
  storageUnitId: string | null
  storageUnitName: string
  expirationDate: string | null
}

export const getPickingLists = () =>
  request<{ rows: PickingListRow[] }>({
    url: '/api/miniapp/picking-lists',
    method: 'GET',
  })

export const getPickingList = (id: string) =>
  request<PickingDetail>({
    url: `/api/miniapp/picking-lists/${id}`,
    method: 'GET',
  })

export const updatePickingStatus = (id: string, status: string) =>
  request<{ success: boolean; message?: string }>({
    url: `/api/miniapp/picking-lists/${id}/status`,
    method: 'POST',
    data: { status },
  })

export const setLineQuantity = (
  pickingListId: string,
  args: { pickingListLineId: string; quantity: number; markShort?: boolean },
) =>
  request<{ success: boolean; message?: string }>({
    url: `/api/miniapp/picking-lists/${pickingListId}/line-quantity`,
    method: 'POST',
    data: args,
  })

export const getTrackedEntities = (pickingListId: string, lineId: string) =>
  request<{
    trackingType: string
    quantityRequired: number
    pickOrder: string
    rows: TrackedEntityRow[]
  }>({
    url: `/api/miniapp/picking-lists/${pickingListId}/lines/${lineId}/tracked`,
    method: 'GET',
  })

export const pickTrackedEntity = (
  pickingListId: string,
  lineId: string,
  args: {
    trackedEntityId: string
    quantity?: number
    fromStorageUnitId?: string | null
    unpick?: boolean
  },
) =>
  request<{ success: boolean; message?: string }>({
    url: `/api/miniapp/picking-lists/${pickingListId}/lines/${lineId}/tracked`,
    method: 'POST',
    data: args,
  })
