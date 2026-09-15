import Taro from '@tarojs/taro'

// 后端 API 宿主 —— 直连本预览机 mes-pr-607(5607)的临时 cloudflared 隧道。
// (foxhole.bot 当前指向旧源站、无新路由,故走这条 https 直连隧道。)
// 真机要求 https 且该域名已在小程序后台「request 合法域名」白名单中。
// 注意:trycloudflare 域名是临时的,重启隧道会变,需同步更新此处 + 后台白名单。
export const BASE_URL = 'https://just-nicholas-owns-textiles.trycloudflare.com'

export const TOKEN_KEY = 'carbon_miniapp_token'

export interface ApiError {
  statusCode: number
  message: string
  data?: unknown
}

/**
 * 统一请求封装:自动带 Bearer token,统一错误处理。
 * 后端所有 /api/miniapp/* 接口都走 Authorization: Bearer <token>。
 */
export async function request<T = unknown>(
  options: Taro.request.Option & { auth?: boolean },
): Promise<T> {
  const { auth = true, header, url, ...rest } = options
  const token = auth ? Taro.getStorageSync(TOKEN_KEY) : ''

  const res = await Taro.request({
    ...rest,
    url: url.startsWith('http') ? url : `${BASE_URL}${url}`,
    header: {
      'content-type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(header || {}),
    },
  })

  if (res.statusCode === 401) {
    Taro.removeStorageSync(TOKEN_KEY)
    Taro.reLaunch({ url: '/pages/login/login' })
    throw { statusCode: 401, message: '登录已过期' } as ApiError
  }

  if (res.statusCode >= 200 && res.statusCode < 300) {
    return res.data as T
  }

  throw {
    statusCode: res.statusCode,
    message: (res.data as { message?: string })?.message || '请求失败',
    data: res.data,
  } as ApiError
}
