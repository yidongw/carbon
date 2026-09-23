import { request } from './request'

// 扫码解析结果:分包工单码 → 当前工序(对齐 MES /x/bundle/:id 重定向)。
export interface BundleScanResolve {
  found: boolean
  operationId: string
  jobId: string
  jobReadableId: string
  allDone: boolean
  isMine: boolean
}

export const resolveBundleScan = (bwoId: string) =>
  request<BundleScanResolve>({
    url: `/api/miniapp/bundle/${bwoId}`,
    method: 'GET',
  })
