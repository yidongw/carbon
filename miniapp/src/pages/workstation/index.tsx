import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getDashboard } from '../../services/dashboard'
import type { Dashboard } from '../../services/dashboard'
import './index.scss'

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
          <Text className='ws__idle-title'>{loading ? '加载中…' : '暂无进行中的工序'}</Text>
          <Text className='ws__idle-sub'>扫描工单/扎包标签,领取并开始工作</Text>
          <View className='ws__report' hoverClass='ws__report--hover' onClick={onScan}>
            <Text className='ws__report-text'>扫码领工单</Text>
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
    </View>
  )
}
