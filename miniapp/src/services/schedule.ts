import { request } from './request'

export interface ScheduleColumn {
  id: string
  title: string
  active: boolean
  isBlocked: boolean
  blockingDispatchId: string | null
  blockingDispatchReadableId: string | null
}

export interface ScheduleItem {
  id: string
  workCenterId: string
  status: string
  priority: string
  jobReadableId: string
  itemReadableId: string
  itemDescription: string
  description: string
  targetQuantity: number
  quantityCompleted: number
  quantityScrapped: number
  quantityReworked: number
  dueDate: string | null
  deadlineType: string | null
  customerName: string
  salesOrderReadableId: string
  assignee: string
  tags: string[]
  reworkId: string | null
  durationMs: number
}

export interface ScheduleData {
  columns: ScheduleColumn[]
  items: ScheduleItem[]
  workCenters: { id: string; name: string }[]
}

export const getSchedule = (opts?: { workCenterId?: string; search?: string }) => {
  const q = new URLSearchParams()
  if (opts?.workCenterId) q.set('workCenterId', opts.workCenterId)
  if (opts?.search) q.set('search', opts.search)
  const qs = q.toString()
  return request<ScheduleData>({
    url: `/api/miniapp/schedule${qs ? `?${qs}` : ''}`,
    method: 'GET',
  })
}
