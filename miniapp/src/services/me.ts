import { request } from './request'

export interface Me {
  name: string
  initial: string
  avatarUrl: string | null
  companyName: string | null
  workCenter: string | null
}

export function getMe(): Promise<Me> {
  return request<Me>({ url: '/api/miniapp/me', method: 'GET' })
}
