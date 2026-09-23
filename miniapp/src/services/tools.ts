import { request } from './request'

export interface MaintenanceRow {
  id: string
  maintenanceDispatchId: string
  workCenterName: string
  severity: string
  status: string
  priority: string
  oeeImpact: string
  assignee: string | null
  plannedStartTime: string | null
}

export const getMaintenance = () =>
  request<{ rows: MaintenanceRow[]; assigned: MaintenanceRow[] }>({
    url: '/api/miniapp/maintenance',
    method: 'GET',
  })

export interface MaintenanceDetail {
  found: boolean
  id: string
  maintenanceDispatchId: string
  status: string
  priority: string
  severity: string
  oeeImpact: string
  workCenterId: string
  workCenterName: string
  description: string
  procedureName: string
  procedureText: string
  myActiveEventId: string | null
  totalDuration: number
  events: {
    id: string
    employeeId: string
    startTime: string
    endTime: string | null
    duration: number
  }[]
  items: {
    id: string
    itemId: string
    name: string
    quantity: number
    unitOfMeasureCode: string
  }[]
  replacementParts: {
    id: string
    itemId: string
    name: string
    quantity: number
    unitOfMeasureCode: string
  }[]
}

export const getMaintenanceDetail = (id: string) =>
  request<MaintenanceDetail>({
    url: `/api/miniapp/maintenance/${id}`,
    method: 'GET',
  })

export const maintenanceEvent = (
  id: string,
  payload: {
    action: 'Start' | 'End' | 'Complete'
    workCenterId?: string
    eventId?: string | null
  },
) =>
  request<{
    success: boolean
    message?: string
    completed?: boolean
    eventId?: string
  }>({
    url: `/api/miniapp/maintenance/${id}/event`,
    method: 'POST',
    data: payload,
  })

export const maintenanceItem = (
  id: string,
  payload: {
    action: 'add' | 'delete'
    itemId: string
    quantity?: number
    unitOfMeasureCode?: string
  },
) =>
  request<{ success: boolean; message?: string }>({
    url: `/api/miniapp/maintenance/${id}/item`,
    method: 'POST',
    data: payload,
  })

export const submitSuggestion = (payload: {
  suggestion: string
  emoji?: string
  anonymous?: boolean
  attachmentPath?: string
  path?: string
}) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/suggestion',
    method: 'POST',
    data: payload,
  })

export interface ActiveOpRow {
  id: string
  jobReadableId: string
  description: string
  itemReadableId: string
}

export const getActiveOpsForEndShift = () =>
  request<{ rows: ActiveOpRow[] }>({
    url: '/api/miniapp/end-shift',
    method: 'GET',
  })

export const endShift = (timezone?: string) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/end-shift',
    method: 'POST',
    data: { timezone: timezone || 'Asia/Shanghai' },
  })
