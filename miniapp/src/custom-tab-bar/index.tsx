import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import './index.scss'

const TABS = [
  { key: 'workstation', text: '工作台', icon: '🏠', path: '/pages/workstation/index' },
  { key: 'tasks', text: '我的任务', icon: '📋', path: '/pages/tasks/index' },
  { key: 'profile', text: '我的', icon: '👤', path: '/pages/profile/index' },
]

export default function CustomTabBar() {
  const [selected, setSelected] = useState('workstation')

  useDidShow(() => {
    const pages = Taro.getCurrentPages()
    const route = pages[pages.length - 1]?.route ?? ''
    const hit = TABS.find((t) => `/${route}`.startsWith(t.path))
    if (hit) setSelected(hit.key)
  })

  const switchTo = (path: string) => {
    Taro.switchTab({ url: path })
  }

  const onScan = async () => {
    try {
      const r = await Taro.scanCode({ onlyFromCamera: false })
      // TODO: 解析工单/工序 → 进入报工。先提示扫描内容。
      Taro.showModal({
        title: '扫描结果',
        content: r.result || '(空)',
        showCancel: false,
      })
    } catch {
      // 用户取消扫码,忽略
    }
  }

  const renderTab = (t: (typeof TABS)[number]) => (
    <View
      key={t.key}
      className={`tabbar__item ${selected === t.key ? 'tabbar__item--active' : ''}`}
      onClick={() => switchTo(t.path)}
    >
      <Text className='tabbar__icon'>{t.icon}</Text>
      <Text className='tabbar__text'>{t.text}</Text>
    </View>
  )

  return (
    <View className='tabbar'>
      {renderTab(TABS[0])}
      {renderTab(TABS[1])}
      <View className='tabbar__scan-slot'>
        <View className='tabbar__scan' hoverClass='tabbar__scan--hover' onClick={onScan}>
          <Text className='tabbar__scan-icon'>⛶</Text>
        </View>
        <Text className='tabbar__scan-text'>扫码</Text>
      </View>
      {renderTab(TABS[2])}
    </View>
  )
}
