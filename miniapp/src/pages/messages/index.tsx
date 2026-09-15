import { View, Text } from '@tarojs/components'
import TabBar from '../../components/TabBar'
import NavBar from '../../components/NavBar'
import './index.scss'

export default function Messages() {
  return (
    <View className='msg'>
      <NavBar title='消息' />
      <View className='msg__empty'>
        <Text className='msg__empty-title'>暂无消息</Text>
        <Text className='msg__empty-sub'>新工单、报工审批结果会在这里通知你</Text>
      </View>
      <TabBar active='messages' />
    </View>
  )
}
