import Taro from '@tarojs/taro'
import { request, TOKEN_KEY } from './request'

export interface LoginResponse {
  token: string
  refreshToken: string
  userId: string
  companyId: string
  expiresAt: number
  hasCompany: boolean
}

export const COMPANY_KEY = 'carbon_miniapp_company'

export type LoginChannel = 'phone' | 'email'

// 手机号/邮箱验证码登录 —— 与 MES 网页登录同源(短信 / 邮件 6 位码)。

/** 发送验证码。手机号走短信,邮箱走邮件。 */
export async function sendCode(
  channel: LoginChannel,
  value: string,
): Promise<void> {
  await request({
    url: '/api/miniapp/auth/send-code',
    method: 'POST',
    auth: false,
    data: channel === 'phone' ? { phone: value } : { email: value },
  })
}

/** 校验验证码并登录,成功后存 token。 */
export async function verifyCode(
  channel: LoginChannel,
  value: string,
  code: string,
): Promise<LoginResponse> {
  const res = await request<LoginResponse>({
    url: '/api/miniapp/auth/verify',
    method: 'POST',
    auth: false,
    data: channel === 'phone' ? { phone: value, code } : { email: value, code },
  })

  Taro.setStorageSync(TOKEN_KEY, res.token)
  Taro.setStorageSync(COMPANY_KEY, res.companyId || '')
  return res
}

export function logout() {
  Taro.removeStorageSync(TOKEN_KEY)
  Taro.reLaunch({ url: '/pages/login/login' })
}

export function isLoggedIn(): boolean {
  return !!Taro.getStorageSync(TOKEN_KEY)
}
