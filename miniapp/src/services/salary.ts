import { request } from './request'

export interface SalaryCompletion {
  id: string
  process: string
  job: string
  quantity: number
  unitCost: number
  earned: number
}

export interface Salary {
  month: string
  totalEarned: number
  totalPaid: number
  amountOwed: number
  status: string | null
  completions: SalaryCompletion[]
}

export function getSalary(): Promise<Salary> {
  return request<Salary>({ url: '/api/miniapp/salary', method: 'GET' })
}
