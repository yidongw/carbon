import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { svgIcon } from './icons'
import './index.scss'

export type TabKey = 'workstation' | 'tasks' | 'profile'

const ACTIVE = '#2563eb'
const INACTIVE = '#9aa3b2'

const NAV: { key: TabKey; text: string; icon: string; path: string }[] = [
  { key: 'workstation', text: '工作台', icon: 'home', path: '/pages/workstation/index' },
  { key: 'tasks', text: '我的任务', icon: 'tasks', path: '/pages/tasks/index' },
  { key: 'profile', text: '我的', icon: 'user', path: '/pages/profile/index' },
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

  const item = (t: (typeof NAV)[number]) => {
    const on = active === t.key
    return (
      <View
        key={t.key}
        className={`tabbar__item ${on ? 'tabbar__item--active' : ''}`}
        onClick={() => go(t)}
      >
        <Image className='tabbar__icon' src={svgIcon(t.icon, on ? ACTIVE : INACTIVE)} />
        <Text className='tabbar__text'>{t.text}</Text>
      </View>
    )
  }

  return (
    <View className='tabbar'>
      {item(NAV[0])}
      {item(NAV[1])}
      <View className='tabbar__scan-slot'>
        <View className='tabbar__scan' hoverClass='tabbar__scan--hover' onClick={onScan}>
          <Image className='tabbar__scan-icon' src={svgIcon('scan', '#ffffff')} />
        </View>
        <Text className='tabbar__scan-text'>扫码</Text>
      </View>
      {item(NAV[2])}
    </View>
  )
}
