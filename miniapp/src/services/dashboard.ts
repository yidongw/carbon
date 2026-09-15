import { request } from './request'

export interface DashboardTodo {
  key: string
  icon: string
  title: string
  sub: string
  badge: string
  danger: boolean
}

export interface Dashboard {
  hasCompany: boolean
  worker: { name: string; initial: string; workCenter: string | null; onDuty: boolean }
  todayPieces: number
  todayEarn: number
  monthEarn: number
  assignedCount: number
  activeCount: number
  current: null | {
    jobReadableId: string
    process: string
    done: number
    target: number
    status: string
  }
  todos: DashboardTodo[]
}

export function getDashboard(): Promise<Dashboard> {
  return request<Dashboard>({ url: '/api/miniapp/dashboard', method: 'GET' })
}
