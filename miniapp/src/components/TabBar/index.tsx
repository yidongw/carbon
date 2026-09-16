import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { svgIcon } from './icons'
import { getUnreadCount } from '../../utils/unread'
import './index.scss'

export type TabKey = 'workstation' | 'tasks' | 'messages' | 'profile'

const ACTIVE = '#2563eb'
const INACTIVE = '#9aa3b2'

const LEFT: { key: TabKey; text: string; icon: string; path: string }[] = [
  { key: 'workstation', text: '工作台', icon: 'grid', path: '/pages/workstation/index' },
  { key: 'tasks', text: '任务', icon: 'list', path: '/pages/tasks/index' },
]
const RIGHT: { key: TabKey; text: string; icon: string; path: string }[] = [
  { key: 'messages', text: '消息', icon: 'chat', path: '/pages/messages/index' },
  { key: 'profile', text: '我的', icon: 'user', path: '/pages/profile/index' },
]

export default function TabBar({ active }: { active: TabKey }) {
  const go = (item: { key: TabKey; path: string }) => {
    if (item.key === active) return
    Taro.reLaunch({ url: item.path })
  }

  const onScan = async () => {
    try {
      const r = await Taro.scanCode({ onlyFromCamera: false })
      Taro.showModal({ title: '扫描结果', content: r.result || '(空)', showCancel: false })
    } catch {
      /* 取消扫码 */
    }
  }

  const unread = getUnreadCount()

  const item = (t: (typeof LEFT)[number]) => {
    const on = active === t.key
    const badge = t.key === 'messages' && unread > 0 ? unread : 0
    return (
      <View
        key={t.key}
        className={`tabbar__item ${on ? 'tabbar__item--active' : ''}`}
        onClick={() => go(t)}
      >
        <View className='tabbar__icon-wrap'>
          <Image className='tabbar__icon' src={svgIcon(t.icon, on ? ACTIVE : INACTIVE)} />
          {badge ? (
            <View className='tabbar__badge'>
              <Text className='tabbar__badge-text'>{badge > 99 ? '99+' : badge}</Text>
            </View>
          ) : null}
        </View>
        <Text className='tabbar__text'>{t.text}</Text>
      </View>
    )
  }

  return (
    <View className='tabbar'>
      {LEFT.map(item)}
      <View className='tabbar__scan-slot'>
        <View className='tabbar__scan-wrap'>
          <View className='tabbar__scan' hoverClass='tabbar__scan--hover' onClick={onScan}>
            <Image className='tabbar__scan-icon' src={svgIcon('scan', '#ffffff')} />
          </View>
        </View>
      </View>
      {RIGHT.map(item)}
    </View>
  )
}
