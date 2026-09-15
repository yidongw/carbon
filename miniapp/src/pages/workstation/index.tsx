import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// TODO: 占位数据,后续接 /api/miniapp/dashboard + 当前工序接口。
const MOCK = {
  worker: { name: '王师傅', initial: '王', workCenter: '华东制衣一厂 · 3号缝纫线', onDuty: true },
  earnToday: 186.5,
  rank: 3,
  current: {
    jobReadableId: 'WO-2043',
    process: '男款外套 · 分包 #B12',
    done: 128,
    target: 200,
    estIncome: 240.0,
    elapsed: '2h 15m',
  },
  todos: [
    { key: 'new', icon: '📋', title: '领口锁边 · 工单 JOB-2048', sub: '已分配给我 · 待开工', badge: '待开工', danger: true },
    { key: 'reject', icon: '⚠️', title: '袖口缝合被驳回', sub: '经理退回,请复查', badge: '1', danger: true },
    { key: 'done', icon: '✅', title: '今日已完成 6 单', sub: '查看明细', badge: '', danger: false },
  ],
}

export default function Workstation() {
  const c = MOCK.current
  const pct = Math.min(100, Math.round((c.done / c.target) * 100))

  // 自定义导航栏:按右上角胶囊按钮位置留出顶部安全区,避免身份栏和胶囊重叠。
  const [topPad, setTopPad] = useState(64)
  useEffect(() => {
    try {
      const r = Taro.getMenuButtonBoundingClientRect()
      if (r?.bottom) setTopPad(r.bottom + 10)
    } catch {
      /* 忽略 */
    }
  }, [])

  const onReport = async () => {
    try {
      const r = await Taro.scanCode({ onlyFromCamera: false })
      Taro.showModal({ title: '扫描结果', content: r.result || '(空)', showCancel: false })
    } catch {
      /* 取消扫码 */
    }
  }

  return (
    <View className='ws' style={{ paddingTop: `${topPad}px` }}>
      {/* 身份区 */}
      <View className='ws__id'>
        <View className='ws__avatar'>
          <Text className='ws__avatar-text'>{MOCK.worker.initial}</Text>
        </View>
        <View className='ws__id-info'>
          <Text className='ws__id-name'>{MOCK.worker.name}</Text>
          <View className='ws__id-sub'>
            <View className='ws__dot' />
            <Text className='ws__id-sub-text'>
              {MOCK.worker.workCenter} · {MOCK.worker.onDuty ? '已上工' : '未上工'}
            </Text>
          </View>
        </View>
        <View className='ws__clock'>
          <Text className='ws__clock-text'>下工打卡</Text>
        </View>
      </View>

      {/* 计件激励条 */}
      <View className='ws__earn'>
        <View>
          <Text className='ws__earn-label'>今日已赚</Text>
          <Text className='ws__earn-num'>¥{MOCK.earnToday.toFixed(2)}</Text>
        </View>
        <View className='ws__rank'>
          <Text className='ws__rank-text'>本月排名</Text>
          <Text className='ws__rank-num'>#{MOCK.rank}</Text>
        </View>
      </View>

      {/* 当前工序大卡 */}
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
          <Text className='ws__current-est'>预计 ¥{c.estIncome.toFixed(2)} · {c.elapsed}</Text>
        </View>

        <View className='ws__report' hoverClass='ws__report--hover' onClick={onReport}>
          <Text className='ws__report-text'>扫码报工</Text>
        </View>
      </View>

      {/* 待办流 */}
      <Text className='ws__sec'>待办</Text>
      <View className='ws__list'>
        {MOCK.todos.map((t) => (
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
    </View>
  )
}
