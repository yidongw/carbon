import Taro from '@tarojs/taro'
import { request, BASE_URL, TOKEN_KEY, COMPANY_KEY } from './request'

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
  timeTotalMs: number
  timePerUnitMs: number
  unitOfMeasureText: string
  materials: OpMaterial[]
  files: OpFile[]
  logs: OpLog[]
}

export interface OpMaterial {
  id: string
  materialId: string
  itemId: string
  name: string
  desc: string
  source: string
  estimated: number
  actual: number
  toIssue: number
}

export interface OpFile {
  id: string
  name: string
  size: string
  type: string // Image | PDF | Document | …
  path: string // private storage path under company
}

export interface OpLog {
  id: string
  type: string // Production | Rework | Scrap
  quantity: number
  who: string
  date: string
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

export type OperationActionType =
  | 'start'
  | 'pause'
  | 'finish'
  | 'pickup'
  | 'scrap'
  | 'rework'
  | 'markFixed'
  | 'issue'

export const operationAction = (
  jobOperationId: string,
  action: OperationActionType,
  extra: Record<string, unknown> = {},
) =>
  request<{ success: boolean; message?: string }>({
    url: '/api/miniapp/operation-action',
    method: 'POST',
    data: { jobOperationId, action, ...extra },
  })

export interface ScrapReason {
  id: string
  name: string
}
export const getScrapReasons = () =>
  request<{ rows: ScrapReason[] }>({ url: '/api/miniapp/scrap-reasons', method: 'GET' })

export interface ReworkTarget {
  id: string
  description: string
  item: string
  status: string
}
export const getReworkTargets = (id: string) =>
  request<{ rows: ReworkTarget[] }>({
    url: `/api/miniapp/rework-targets/${id}`,
    method: 'GET',
  })

export interface ItemHit {
  id: string
  name: string
  desc: string
}

/** 物料搜索(BOM 为空时选手动物料发放,对齐网页 IssueMaterialModal) */
export const searchItems = (q: string) =>
  request<{ rows: ItemHit[] }>({
    url: `/api/miniapp/items?q=${encodeURIComponent(q)}`,
    method: 'GET',
  })

/** 文件下载 URL（需带 Bearer；给 Taro.downloadFile 用） */
export function fileDownloadUrl(path: string) {
  return `${BASE_URL}/api/miniapp/file?path=${encodeURIComponent(path)}`
}

export function fileAuthHeader() {
  const token = Taro.getStorageSync(TOKEN_KEY) || ''
  const companyId = Taro.getStorageSync(COMPANY_KEY) || ''
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(companyId ? { 'X-Company-Id': companyId } : {}),
  }
}
