import { useEffect, useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getDashboard } from '../../services/dashboard'
import type { Dashboard } from '../../services/dashboard'
import { FN_GROUPS } from '../../constants/functions'
import TabBar from '../../components/TabBar'
import './index.scss'

// 空闲态的扫码大图(角框 + 内部网格,品牌蓝)。
const SCAN_ILLUS = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 24V14a6 6 0 0 1 6-6h10"/><path d="M40 8h10a6 6 0 0 1 6 6v10"/><path d="M56 40v10a6 6 0 0 1-6 6H40"/><path d="M24 56H14a6 6 0 0 1-6-6V40"/><rect x="23" y="23" width="18" height="18" rx="2" stroke-width="2.4"/><path d="M29 23v18M35 23v18M23 29h18M23 35h18" stroke-width="1.6"/></svg>`,
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

  const onScan = async () => {
    try {
      const r = await Taro.scanCode({ onlyFromCamera: false })
      Taro.showModal({ title: '扫描结果', content: r.result || '(空)', showCancel: false })
    } catch {
      /* 取消扫码 */
    }
  }

  // 首页功能区:横向模块 tab + 宫格。
  const [modKey, setModKey] = useState(FN_GROUPS[0].key)
  const group = FN_GROUPS.find((g) => g.key === modKey) ?? FN_GROUPS[0]

  const badgeOf = (key: string) => {
    if (key === 'assigned' && data?.assignedCount) return String(data.assignedCount)
    if (key === 'active' && data?.activeCount) return String(data.activeCount)
    return ''
  }

  const onFn = (key: string) => {
    if (key === 'salary') {
      Taro.navigateTo({ url: '/pages/salary/index' })
      return
    }
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const w = data?.worker
  const c = data?.current
  const pct = c && c.target > 0 ? Math.min(100, Math.round((c.done / c.target) * 100)) : 0

  return (
    <View className='ws' style={{ paddingTop: `${topPad}px` }}>
      {/* 身份区 */}
      <View className='ws__id'>
        <View className='ws__avatar'>
          <Text className='ws__avatar-text'>{w?.initial || '·'}</Text>
        </View>
        <View className='ws__id-info'>
          <Text className='ws__id-name'>{w?.name || (loading ? '加载中…' : '员工')}</Text>
          <View className='ws__id-sub'>
            {w?.onDuty ? <View className='ws__dot' /> : null}
            <Text className='ws__id-sub-text'>
              {w?.workCenter ? `${w.workCenter} · ` : ''}
              {w?.onDuty ? '已上工' : '未上工'}
            </Text>
          </View>
        </View>
      </View>

      {/* 计件激励条 */}
      <View className='ws__earn'>
        <View>
          <Text className='ws__earn-label'>今日已赚</Text>
          <Text className='ws__earn-num'>¥{(data?.todayEarn ?? 0).toFixed(2)}</Text>
        </View>
        <View className='ws__rank'>
          <Text className='ws__rank-text'>本月已赚</Text>
          <Text className='ws__rank-num'>¥{(data?.monthEarn ?? 0).toFixed(2)}</Text>
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

      {/* 待办 */}
      {data && data.todos.length > 0 ? (
        <>
          <Text className='ws__sec'>待办</Text>
          <View className='ws__list'>
            {data.todos.map((t) => (
              <View key={t.key} className='ws__row'>
                <View className='ws__row-ic'>
                  <Text className='ws__row-ic-text'>{t.icon}</Text>
                </View>
                <View className='ws__row-mid'>
                  <Text className='ws__row-title'>{t.title}</Text>
                  <Text className='ws__row-sub'>{t.sub}</Text>
                </View>
                {t.badge ? (
                  <View className={`ws__chip ${t.danger ? 'ws__chip--danger' : 'ws__chip--muted'}`}>
                    <Text className='ws__chip-text'>{t.badge}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* 功能区:横向模块 tab + 宫格 */}
      <Text className='ws__sec'>功能</Text>
      <ScrollView className='ws__mods' scrollX showScrollbar={false}>
        {FN_GROUPS.map((g) => (
          <View
            key={g.key}
            className={`ws__mod ${modKey === g.key ? 'ws__mod--active' : ''}`}
            onClick={() => setModKey(g.key)}
          >
            <Text className='ws__mod-text'>{g.title}</Text>
          </View>
        ))}
      </ScrollView>
      <View className='ws__fn-grid'>
        {group.items.map((it) => (
          <View
            key={it.key}
            className='ws__fn-cell'
            hoverClass='ws__fn-cell--hover'
            onClick={() => onFn(it.key)}
          >
            <View className={`ws__fn-ic ws__fn-ic--${group.color}`}>
              <Text className='ws__fn-ic-text'>{it.icon}</Text>
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

      <TabBar active='workstation' />
    </View>
  )
}
