import { request } from './request'

// 工单模块三张列表(对齐 MES 网页 /x/jobs、/x/master-work-orders、/x/bundle-work-orders)。
// 后端复用同样的数据库视图,字段与网页版一致。

export interface JobRow {
  id: string
  jobId: string
  item: string
  name: string
  quantity: number
  quantityComplete: number
  dueDate: string | null
  assignee: string
  status: string
}

export interface MasterRow {
  id: string
  wo: string
  style: string
  itemName: string
  quantity: number
  reported: number
  remaining: number
  bundleCount: number
  processCount: number
  assignee: string
  dueDate: string | null
  status: string
}

export interface BundleRow {
  id: string
  bundle: string
  masterWo: string
  style: string
  itemName: string
  attributes: string
  quantity: number
  processCount: number
  assignee: string
  status: string
}

export const getJobs = () =>
  request<{ rows: JobRow[] }>({ url: '/api/miniapp/jobs', method: 'GET' })

export const getMasterWorkOrders = () =>
  request<{ rows: MasterRow[] }>({ url: '/api/miniapp/master-work-orders', method: 'GET' })

export const getBundleWorkOrders = () =>
  request<{ rows: BundleRow[] }>({ url: '/api/miniapp/bundle-work-orders', method: 'GET' })

/** 任务工序 DAG，对齐 MES `/x/job/:jobId`。 */
export interface JobDagOp {
  id: string
  description: string
  status: string
  quantityComplete: number
  targetQuantity: number
  quantityReworked: number
  quantityScrapped: number
  isRework: boolean
  itemId: string | null
}

export interface JobDagDep {
  operationId: string
  dependsOnId: string
}

export interface JobDagData {
  found: boolean
  readableId?: string
  operations?: JobDagOp[]
  dependencies?: JobDagDep[]
}

export const getJobDag = (jobId: string) =>
  request<JobDagData>({ url: `/api/miniapp/job/${jobId}`, method: 'GET' })
