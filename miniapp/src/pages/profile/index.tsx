import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { logout } from '../../services/auth'
import { getMe } from '../../services/me'
import type { Me } from '../../services/me'
import TabBar from '../../components/TabBar'
import NavBar from '../../components/NavBar'
import './index.scss'

const ITEMS = [
  { key: 'salary', icon: '💰', text: '我的工资' },
  { key: 'reports', icon: '✅', text: '报工审批' },
  { key: 'schedule', icon: '📆', text: '排程' },
]

export default function Profile() {
  const [me, setMe] = useState<Me | null>(null)

  useDidShow(() => {
    getMe()
      .then(setMe)
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
  })

  const onItem = (key: string) => {
    if (key === 'salary') {
      Taro.navigateTo({ url: '/pages/salary/index' })
      return
    }
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const sub = [me?.companyName, me?.workCenter].filter(Boolean).join(' · ')

  return (
    <View className='me'>
      <NavBar title='我的' />
      <View className='me__head'>
        <View className='me__avatar'>
          {me?.avatarUrl ? (
            <Image className='me__avatar-img' src={me.avatarUrl} />
          ) : (
            <Text className='me__avatar-text'>{me?.initial || '·'}</Text>
          )}
        </View>
        <View className='me__info'>
          <Text className='me__name'>{me?.name || '加载中…'}</Text>
          <Text className='me__sub'>{sub || '未加入公司'}</Text>
        </View>
      </View>

      <View className='me__list'>
        {ITEMS.map((it) => (
          <View key={it.key} className='me__row' onClick={() => onItem(it.key)}>
            <Text className='me__row-ic'>{it.icon}</Text>
            <Text className='me__row-text'>{it.text}</Text>
            <Text className='me__row-arrow'>›</Text>
          </View>
        ))}
      </View>

      <View className='me__logout' hoverClass='me__logout--hover' onClick={logout}>
        <Text className='me__logout-text'>退出登录</Text>
      </View>

      <TabBar active='profile' />
    </View>
  )
}
