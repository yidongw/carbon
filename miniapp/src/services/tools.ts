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
