import { request } from './request'

export interface OpItem {
  id: string
  title: string
  sub: string
  status: string
}

export interface OpsData {
  assigned: OpItem[]
}

export function getOperations(): Promise<OpsData> {
  return request<OpsData>({ url: '/api/miniapp/operations', method: 'GET' })
}
