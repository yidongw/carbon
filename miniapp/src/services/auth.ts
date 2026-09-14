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

/**
 * 微信小程序登录。
 *
 * 流程:wx.login 拿临时 code → 后端用 jscode2session(需小程序 AppID/Secret)
 * 换取 openid/unionid → 关联 Carbon user(复用 findOrCreateWeChatUser)→
 * 签发 token 返回。token 存本地,后续请求走 Bearer。
 *
 * 后端登录接口尚未实现(需 AppID),这里先打通前端链路。
 */
/**
 * 微信登录。首次登录后端会返回 409 { needPhone: true },前端据此弹「授权手机号」
 * 按钮,拿到 phoneCode 后再带上重试。老用户(已绑定 wechat 身份)不需要手机号。
 * 注意:每次调用都重新 wx.login 取新鲜 code(code 单次有效、易过期)。
 */
export async function login(phoneCode?: string): Promise<LoginResponse> {
  const { code } = await Taro.login()

  const res = await request<LoginResponse>({
    url: '/api/miniapp/auth/login',
    method: 'POST',
    auth: false,
    data: phoneCode ? { code, phoneCode } : { code },
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
