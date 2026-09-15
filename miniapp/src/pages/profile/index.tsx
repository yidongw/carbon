import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { logout } from '../../services/auth'
import TabBar from '../../components/TabBar'
import './index.scss'

const ITEMS = [
  { key: 'salary', icon: '💰', text: '我的工资' },
  { key: 'reports', icon: '✅', text: '报工审批' },
  { key: 'all', icon: '⋯', text: '全部功能' },
]

export default function Profile() {
  const onItem = (key: string) => {
    if (key === 'all') {
      Taro.navigateTo({ url: '/pages/functions/index' })
      return
    }
    Taro.showToast({ title: `TODO: ${key}`, icon: 'none' })
  }

  return (
    <View className='me'>
      <View className='me__head'>
        <View className='me__avatar'>
          <Text className='me__avatar-text'>王</Text>
        </View>
        <View className='me__info'>
          <Text className='me__name'>王师傅</Text>
          <Text className='me__sub'>华东制衣一厂 · 3号缝纫线</Text>
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
