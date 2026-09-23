import Taro from '@tarojs/taro'
import { resolveBundleScan } from '../services/scan'

// 分包工单码解析,和 MES 网页 parseBundleScan 完全一致:
// 二维码里是完整链接 {MES_URL}/x/bundle/{bwo_…},也接受裸 bwo_… id。
export function parseBundleScan(text: string): string | null {
  const trimmed = (text || '').trim()
  const urlMatch = trimmed.match(/\/x\/bundle\/([^/?#\s]+)/)
  if (urlMatch?.[1]) return decodeURIComponent(urlMatch[1])
  if (/^bwo_[A-Za-z0-9]+$/.test(trimmed)) return trimmed
  return null
}

export type ScanIntent = 'report' | 'pickup' | 'view'

// 扫码 → 解析 bwo_ → 后端解析当前工序 → 跳工序执行页(带 auto=intent 自动打开对应操作)。
// intent:report=打开报工弹层,pickup=领取/接手,view=只看。对齐 MES 的扫码报工/领活链路。
export async function scanToOperation(intent: ScanIntent = 'report') {
  let scan: Taro.scanCode.SuccessCallbackResult
  try {
    scan = await Taro.scanCode({ onlyFromCamera: false })
  } catch {
    return // 用户取消扫码
  }
  const raw = scan?.result || ''
  const bwoId = parseBundleScan(raw)
  if (!bwoId) {
    Taro.showModal({
      title: '无法识别',
      content: `这不是有效的分包工单二维码:\n${raw || '(空)'}`,
      showCancel: false,
    })
    return
  }

  Taro.showLoading({ title: '解析中…', mask: true })
  try {
    const r = await resolveBundleScan(bwoId)
    Taro.hideLoading()
    if (!r.found) {
      Taro.showToast({ title: '未找到该工单', icon: 'none' })
      return
    }
    if (r.allDone || !r.operationId) {
      Taro.showToast({ title: '该工单工序已全部完成', icon: 'none' })
      return
    }
    Taro.navigateTo({
      url: `/pages/operation/index?id=${r.operationId}&auto=${intent}`,
    })
  } catch (e: any) {
    Taro.hideLoading()
    if (e?.statusCode !== 401) {
      Taro.showToast({ title: e?.message || '解析失败', icon: 'none' })
    }
  }
}
