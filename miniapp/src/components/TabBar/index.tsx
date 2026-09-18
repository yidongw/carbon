import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { svgIcon } from './icons'
import { getUnreadCount } from '../../utils/unread'
import { t } from '../../i18n'
import './index.scss'

export type TabKey = 'workstation' | 'tasks' | 'messages' | 'profile'

const ACTIVE = '#2563eb'
const INACTIVE = '#9aa3b2'

type TabItem = { key: TabKey; textKey: string; icon: string; path: string }

const LEFT: TabItem[] = [
  { key: 'workstation', textKey: 'nav.workstation', icon: 'grid', path: '/pages/workstation/index' },
  { key: 'tasks', textKey: 'nav.tasks', icon: 'list', path: '/pages/tasks/index' },
]
const RIGHT: TabItem[] = [
  { key: 'messages', textKey: 'nav.messages', icon: 'chat', path: '/pages/messages/index' },
  { key: 'profile', textKey: 'nav.profile', icon: 'user', path: '/pages/profile/index' },
]

export default function TabBar({ active }: { active: TabKey }) {
  const go = (item: TabItem) => {
    if (item.key === active) return
    Taro.reLaunch({ url: item.path })
  }

  const onScan = async () => {
    try {
      const r = await Taro.scanCode({ onlyFromCamera: false })
      Taro.showModal({
        title: t('common.scanResult'),
        content: r.result || '(empty)',
        showCancel: false,
      })
    } catch {
      /* cancelled */
    }
  }

  const unread = getUnreadCount()

  const renderItem = (tab: TabItem) => {
    const on = active === tab.key
    const badge = tab.key === 'messages' && unread > 0 ? unread : 0
    return (
      <View
        key={tab.key}
        className={`tabbar__item ${on ? 'tabbar__item--active' : ''}`}
        onClick={() => go(tab)}
      >
        <View className='tabbar__icon-wrap'>
          <Image className='tabbar__icon' src={svgIcon(tab.icon, on ? ACTIVE : INACTIVE)} />
          {badge ? (
            <View className='tabbar__badge'>
              <Text className='tabbar__badge-text'>{badge > 99 ? '99+' : badge}</Text>
            </View>
          ) : null}
        </View>
        <Text className='tabbar__text'>{t(tab.textKey)}</Text>
      </View>
    )
  }

  return (
    <View className='tabbar'>
      {LEFT.map(renderItem)}
      <View className='tabbar__scan-slot'>
        <View className='tabbar__scan-wrap'>
          <View className='tabbar__scan' hoverClass='tabbar__scan--hover' onClick={onScan}>
            <Image className='tabbar__scan-icon' src={svgIcon('scan', '#ffffff')} />
          </View>
        </View>
      </View>
      {RIGHT.map(renderItem)}
    </View>
  )
}
