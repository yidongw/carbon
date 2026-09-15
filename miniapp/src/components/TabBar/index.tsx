import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export type TabKey = 'workstation' | 'tasks' | 'profile'

const NAV: { key: TabKey; text: string; icon: string; path: string }[] = [
  { key: 'workstation', text: '工作台', icon: '🏠', path: '/pages/workstation/index' },
  { key: 'tasks', text: '我的任务', icon: '📋', path: '/pages/tasks/index' },
  { key: 'profile', text: '我的', icon: '👤', path: '/pages/profile/index' },
]

export default function TabBar({ active }: { active: TabKey }) {
  const go = (item: (typeof NAV)[number]) => {
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

  const item = (t: (typeof NAV)[number]) => (
    <View
      key={t.key}
      className={`tabbar__item ${active === t.key ? 'tabbar__item--active' : ''}`}
      onClick={() => go(t)}
    >
      <Text className='tabbar__icon'>{t.icon}</Text>
      <Text className='tabbar__text'>{t.text}</Text>
    </View>
  )

  return (
    <View className='tabbar'>
      {item(NAV[0])}
      {item(NAV[1])}
      <View className='tabbar__scan-slot'>
        <View className='tabbar__scan' hoverClass='tabbar__scan--hover' onClick={onScan}>
          <Text className='tabbar__scan-icon'>⛶</Text>
        </View>
        <Text className='tabbar__scan-text'>扫码</Text>
      </View>
      {item(NAV[2])}
    </View>
  )
}
