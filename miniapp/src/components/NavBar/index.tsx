import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// 自定义导航栏(navigationStyle: custom 时用):状态栏留白 + 居中标题,
// 不含微信默认的「返回首页」按钮。作为页面首个子元素,占据顶部高度即可。
export default function NavBar({
  title,
  back = false,
}: {
  title?: string
  back?: boolean
}) {
  const [statusBar, setStatusBar] = useState(20)
  const [barHeight, setBarHeight] = useState(44)

  useEffect(() => {
    try {
      const sys = Taro.getWindowInfo()
      const menu = Taro.getMenuButtonBoundingClientRect()
      const sb = sys.statusBarHeight ?? 20
      setStatusBar(sb)
      // 胶囊上下间距对称 → 导航栏高度
      setBarHeight((menu.top - sb) * 2 + menu.height)
    } catch {
      /* 忽略 */
    }
  }, [])

  return (
    <View className='navbar' style={{ paddingTop: `${statusBar}px` }}>
      <View className='navbar__bar' style={{ height: `${barHeight}px` }}>
        {back ? (
          <View className='navbar__back' onClick={() => Taro.navigateBack()}>
            <Text className='navbar__back-ic'>‹</Text>
          </View>
        ) : null}
        {title ? <Text className='navbar__title'>{title}</Text> : null}
      </View>
    </View>
  )
}
