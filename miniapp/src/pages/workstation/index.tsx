import { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getDashboard } from '../../services/dashboard'
import type { Dashboard } from '../../services/dashboard'
import { COMPANY_KEY } from '../../services/request'
import { computeUnread, setUnreadCount } from '../../utils/unread'
import { FN_GROUPS, FN_STROKE, fnIcon } from '../../constants/functions'
import TabBar from '../../components/TabBar'
import './index.scss'

// 空闲态的扫码大图(角框 + 内部网格,品牌蓝)。
const SCAN_ILLUS = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24V14a6 6 0 0 1 6-6h10"/><path d="M40 8h10a6 6 0 0 1 6 6v10"/><path d="M56 40v10a6 6 0 0 1-6 6H40"/><path d="M24 56H14a6 6 0 0 1-6-6V40"/><rect x="23" y="23" width="18" height="18" rx="2" stroke-width="2.4"/><path d="M29 23v18M35 23v18M23 29h18M23 35h18" stroke-width="1.6"/></svg>`,
)}`

// 公司切换胶囊里的下拉箭头(灰)。
const CHEVRON = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5b6472" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
)}`

export default function Workstation() {
  const [data, setData] = useState<Dashboard | null>(null)
  const [loading, setLoading] = useState(true)

  // 自定义导航栏:按右上角胶囊按钮位置留出顶部安全区。
  const [topPad, setTopPad] = useState(64)
  useEffect(() => {
    try {
      const r = Taro.getMenuButtonBoundingClientRect()
      if (r?.bottom) setTopPad(r.bottom + 10)
    } catch {
      /* 忽略 */
    }
  }, [])

  const load = async () => {
    try {
      const d = await getDashboard()
      setData(d)
      // 待办改到「消息」tab 展示,这里只据此更新底部未读徽标数。
      setUnreadCount(computeUnread((d.todos || []).map((t) => t.key)))
    } catch (e: any) {
      if (e?.statusCode !== 401) {
        Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
      }
    } finally {
      setLoading(false)
    }
  }

  // 每次回到工作台都刷新(报工/领活后数据会变)。
  useDidShow(() => {
    load()
  })

  // 切换公司:列出用户归属的公司,选中后写入本地并按新公司重新取数
  // (X-Company-Id 请求头随后带上,所有接口都按新公司返回)。
  const onSwitchCompany = () => {
    const list = data?.companies ?? []
    if (list.length <= 1) {
      Taro.showToast({ title: '当前仅归属一家公司', icon: 'none' })
      return
    }
    Taro.showActionSheet({ itemList: list.map((c) => c.name || '未命名公司') })
      .then((r) => {
        const picked = list[r.tapIndex]
        if (picked && picked.id !== data?.company?.id) {
          Taro.setStorageSync(COMPANY_KEY, picked.id)
          Taro.showToast({ title: `已切换到 ${picked.name}`, icon: 'none' })
          setLoading(true)
          load()
        }
      })
      .catch(() => {
        /* 取消 */
      })
  }

  const onScan = async () => {
    try {
      const r = await Taro.scanCode({ onlyFromCamera: false })
      Taro.showModal({ title: '扫描结果', content: r.result || '(空)', showCancel: false })
    } catch {
      /* 取消扫码 */
    }
  }

  const badgeOf = (key: string) => {
    if (key === 'assigned' && data?.assignedCount) return String(data.assignedCount)
    if (key === 'active' && data?.activeCount) return String(data.activeCount)
    return ''
  }

  // 功能宫格 → 对应真实页面。工单模块直连 MES 视图列表。
  const FN_ROUTE: Record<string, string> = {
    jobs: '/pages/work-orders/index?type=jobs',
    masterWorkOrders: '/pages/work-orders/index?type=master',
    bundleWorkOrders: '/pages/work-orders/index?type=bundle',
    salary: '/pages/salary/index',
  }

  const onFn = (key: string) => {
    const url = FN_ROUTE[key]
    if (url) {
      Taro.navigateTo({ url })
      return
    }
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const c = data?.current
  const pct = c && c.target > 0 ? Math.min(100, Math.round((c.done / c.target) * 100)) : 0

  return (
    <View className='ws' style={{ paddingTop: `${topPad}px` }}>
      {/* 顶部:当前公司 + 切换(门店切换条样式,只展示公司) */}
      <View className='ws__topbar'>
        <View className='ws__company' hoverClass='ws__company--hover' onClick={onSwitchCompany}>
          <Text className='ws__company-name'>{data?.company?.name || '选择公司'}</Text>
          <View className='ws__company-ch'>
            <Image className='ws__company-ch-ic' src={CHEVRON} />
          </View>
        </View>
      </View>

      {/* 当前工序 / 空闲 */}
      {c ? (
        <View className='ws__current'>
          <View className='ws__current-head'>
            <Text className='ws__current-job'>{c.jobReadableId}</Text>
            <View className='ws__current-tag'>
              <Text className='ws__current-tag-text'>进行中</Text>
            </View>
          </View>
          <Text className='ws__current-process'>{c.process}</Text>

          <View className='ws__progress'>
            <View className='ws__progress-bar' style={{ width: `${pct}%` }} />
          </View>
          <View className='ws__current-meta'>
            <Text className='ws__current-qty'>
              {c.done} / {c.target} 件
            </Text>
            <Text className='ws__current-est'>今日已报 {data?.todayPieces ?? 0} 件</Text>
          </View>

          <View className='ws__report' hoverClass='ws__report--hover' onClick={onScan}>
            <Text className='ws__report-text'>扫码报工</Text>
          </View>
        </View>
      ) : (
        <View className='ws__idle'>
          <View className='ws__scan-card'>
            <Image className='ws__scan-illus' src={SCAN_ILLUS} />
          </View>
          <Text className='ws__idle-title'>
            {loading ? '加载中…' : '扫码开始工作'}
          </Text>
          <Text className='ws__idle-sub'>扫描分包标签即可自动领取工单</Text>
          <Text className='ws__idle-sub'>或进入报工,无需手动查找</Text>

          <View className='ws__idle-primary' hoverClass='ws__idle-primary--hover' onClick={onScan}>
            <Text className='ws__idle-primary-text'>扫码领工单</Text>
          </View>
          <View
            className='ws__idle-secondary'
            hoverClass='ws__idle-secondary--hover'
            onClick={() => Taro.showToast({ title: '手动选择工单(开发中)', icon: 'none' })}
          >
            <Text className='ws__idle-secondary-text'>手动选择工单</Text>
          </View>
        </View>
      )}

      {/* 功能区:分组卡片(一屏看全,每模块一张卡) */}
      <Text className='ws__sec'>功能</Text>
      {FN_GROUPS.map((g) => (
        <View key={g.key} className='ws__fn-group'>
          <Text className='ws__fn-group-title'>{g.title}</Text>
          <View className='ws__fn-grid'>
            {g.items.map((it) => (
              <View
                key={it.key}
                className='ws__fn-cell'
                hoverClass='ws__fn-cell--hover'
                onClick={() => onFn(it.key)}
              >
                <View className={`ws__fn-ic ws__fn-ic--${g.color}`}>
                  <Image className='ws__fn-ic-img' src={fnIcon(it.svg, FN_STROKE[g.color])} />
                  {badgeOf(it.key) ? (
                    <View className='ws__fn-badge'>
                      <Text className='ws__fn-badge-text'>{badgeOf(it.key)}</Text>
                    </View>
                  ) : null}
                </View>
                <Text className='ws__fn-label'>{it.text}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <TabBar active='workstation' />
    </View>
  )
}
