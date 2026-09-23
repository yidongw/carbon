import Taro from '@tarojs/taro'
import { request } from './request'
import { operationAction } from './operation'

export type ScanIntent = 'view' | 'pickup' | 'report'

export interface ResolveScanResult {
  success: boolean
  message?: string
  kind?: 'bundle' | 'operation' | 'job'
  operationId?: string | null
  jobId?: string | null
  isMine?: boolean | null
  intent?: ScanIntent
}

export const resolveScan = (code: string, intent: ScanIntent = 'view') =>
  request<ResolveScanResult>({
    url: '/api/miniapp/resolve-scan',
    method: 'POST',
    data: { code, intent },
  })

/**
 * 扫码闭环：对齐 MES 分包票扫码（领活 / 报工 / 查看）。
 * TabBar 默认 view；工作台「领工单」pickup；「报工」report。
 */
export async function handleShopFloorScan(intent: ScanIntent = 'view') {
  let raw = ''
  try {
    const r = await Taro.scanCode({ onlyFromCamera: false })
    raw = (r.result || '').trim()
  } catch {
    return // cancelled
  }
  if (!raw) {
    Taro.showToast({ title: '扫码内容为空', icon: 'none' })
    return
  }

  Taro.showLoading({ title: '解析中…', mask: true })
  try {
    const res = await resolveScan(raw, intent)
    Taro.hideLoading()

    if (!res.success) {
      Taro.showToast({ title: res.message || '无法识别', icon: 'none' })
      return
    }

    // All ops done → job DAG
    if (res.kind === 'job' && res.jobId) {
      Taro.showToast({
        title: res.message || '暂无未完成工序',
        icon: 'none',
      })
      Taro.navigateTo({ url: `/pages/job/index?id=${res.jobId}` })
      return
    }

    const opId = res.operationId
    if (!opId) {
      Taro.showToast({ title: '未找到工序', icon: 'none' })
      return
    }

    if (intent === 'pickup' && res.isMine === false) {
      Taro.showLoading({ title: '领取中…', mask: true })
      try {
        const pick = await operationAction(opId, 'pickup')
        Taro.hideLoading()
        if (!pick.success) {
          Taro.showToast({ title: pick.message || '领取失败', icon: 'none' })
          // still open the op so worker can retry / take over
        }
      } catch (e: any) {
        Taro.hideLoading()
        Taro.showToast({ title: e?.message || '领取失败', icon: 'none' })
      }
    }

    const qs =
      intent === 'report'
        ? `?id=${opId}&report=1`
        : intent === 'pickup'
          ? `?id=${opId}`
          : `?id=${opId}`
    Taro.navigateTo({ url: `/pages/operation/index${qs}` })
  } catch (e: any) {
    Taro.hideLoading()
    if (e?.statusCode !== 401) {
      Taro.showToast({ title: e?.message || '扫码失败', icon: 'none' })
    }
  }
}
