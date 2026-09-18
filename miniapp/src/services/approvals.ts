import { request } from './request'

// 报工审批(对齐网页 /x/production-reports)。
export interface PendingReport {
  id: string
  reportId: string
  jobOperationId: string
  quantity: number
  rework: number
  scrap: number
  employee: string
  employeeId: string
  process: string
  job: string
  item: string
  date: string
}

export const getPendingReports = () =>
  request<{ rows: PendingReport[]; canApprove: boolean }>({
    url: '/api/miniapp/production-reports',
    method: 'GET',
  })

export const approveReport = (id: string, quantity?: number) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/production-reports',
    method: 'POST',
    data: { intent: 'approve', id, quantity },
  })

export interface DisapprovePayload {
  id: string
  jobOperationId: string
  reportId: string
  employeeId: string
  completed: number
  rework: number
  scrap: number
}

export const disapproveReport = (payload: DisapprovePayload) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/production-reports',
    method: 'POST',
    data: { intent: 'disapprove', ...payload },
  })
