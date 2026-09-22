import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getDashboard } from '../../services/dashboard'
import type { DashboardTodo } from '../../services/dashboard'
import { computeUnread, getReadSet, markRead, setUnreadCount } from '../../utils/unread'
import { opStatusCls, opStatusLabel } from '../../utils/opStatus'
import TabBar from '../../components/TabBar'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function Messages() {
  const [todos, setTodos] = useState<DashboardTodo[]>([])
  const [loading, setLoading] = useState(true)
  // 已读集合的本地快照,用来触发重渲染(点击后小红点消失)。
  const [read, setRead] = useState<Record<string, true>>(getReadSet())

  const load = () => {
    getDashboard()
      .then((d) => {
        setTodos(d.todos || [])
        setUnreadCount(computeUnread((d.todos || []).map((t) => t.key)))
      })
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }

  useDidShow(() => {
    setRead(getReadSet())
    load()
  })

  const onTap = (t: DashboardTodo) => {
    markRead(t.key)
    const next = { ...getReadSet() }
    setRead(next)
    setUnreadCount(computeUnread(todos.map((x) => x.key)))
    // pending = 报工待审批 → 审批页；其余 key 是工序 id → 工序执行页。
    if (t.key === 'pending') {
      Taro.navigateTo({ url: '/pages/approvals/index' })
      return
    }
    Taro.navigateTo({ url: `/pages/operation/index?id=${t.key}` })
  }

  return (
    <View className='msg'>
      <NavBar title='消息' />

      {todos.length > 0 ? (
        <View className='msg__list'>
          {todos.map((t) => {
            const unread = !read[t.key]
            return (
              <View
                key={t.key}
                className='msg__row'
                hoverClass='msg__row--hover'
                onClick={() => onTap(t)}
              >
                <View className='msg__ic'>
                  <Text className='msg__ic-text'>{t.icon}</Text>
                  {unread ? <View className='msg__dot' /> : null}
                </View>
                <View className='msg__mid'>
                  <Text className='msg__title'>{t.title}</Text>
                  <Text className='msg__sub'>{t.sub}</Text>
                </View>
                {t.status ? (
                  <View className={`msg__badge msg__badge--${opStatusCls(t.status)}`}>
                    <Text className='msg__badge-text'>{opStatusLabel(t.status)}</Text>
                  </View>
                ) : t.badge ? (
                  <View className={`msg__chip ${t.danger ? 'msg__chip--danger' : 'msg__chip--muted'}`}>
                    <Text className='msg__chip-text'>{t.badge}</Text>
                  </View>
                ) : (
                  <Text className='msg__arrow'>›</Text>
                )}
              </View>
            )
          })}
        </View>
      ) : (
        <View className='msg__empty'>
          <Text className='msg__empty-title'>{loading ? '加载中…' : '暂无消息'}</Text>
          <Text className='msg__empty-sub'>新工单、报工审批结果会在这里通知你</Text>
        </View>
      )}

      <TabBar active='messages' />
    </View>
  )
}
