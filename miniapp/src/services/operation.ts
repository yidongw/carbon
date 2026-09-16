import { request } from './request'

// 工序执行详情(对齐 MES /x/operation/:id)。
export interface OperationDetail {
  found: boolean
  id: string
  readableId: string
  description: string
  itemReadableId: string
  itemDescription: string
  variant: string
  unitOfMeasure: string
  status: string
  assignee: string
  assigneeId: string
  isMine: boolean
  completed: number
  target: number
  rework: number
  scrap: number
  pending: number
  deadlineType: string | null
  dueDate: string | null
  workCenter: string
  active: boolean
}

export const getOperation = (id: string) =>
  request<OperationDetail>({ url: `/api/miniapp/operation/${id}`, method: 'GET' })

export interface ReportPayload {
  jobOperationId: string
  employeeId?: string
  finished: number
  rework: number
  scrap: number
}

export const reportQuantity = (payload: ReportPayload) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/operation-report',
    method: 'POST',
    data: payload,
  })
