import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

// MES 首页导航区块 —— 与网页版 apps/mes 的 sections 对齐。
// 后续每个卡片跳转到对应页面;可见性最终由后端 hiddenMesSections 控制。
const SECTIONS: { key: string; title: string; desc: string }[] = [
  { key: 'pickup', title: '领活', desc: '扫码接工序' },
  { key: 'report', title: '报工', desc: '扫码报数量' },
  { key: 'assigned', title: '已分配', desc: '分配给我的工序' },
  { key: 'active', title: '进行中', desc: '我正在计时的工序' },
  { key: 'recent', title: '最近', desc: '最近完成的工作' },
  { key: 'jobs', title: '工单', desc: '车间已下达工单' },
  { key: 'salary', title: '工资', desc: '我的计件/工时收入' },
  { key: 'productionReports', title: '报工审批', desc: '经理审批报工' },
]

export default function Index() {
  const onCardTap = (key: string) => {
    // TODO: 接入各功能页面路由
    Taro.showToast({ title: `TODO: ${key}`, icon: 'none' })
  }

  return (
    <View className='home'>
      <View className='home__header'>
        <Text className='home__title'>Carbon MES</Text>
        <Text className='home__subtitle'>车间操作端</Text>
      </View>
      <View className='home__grid'>
        {SECTIONS.map((s) => (
          <View
            key={s.key}
            className='card'
            hoverClass='card--hover'
            onClick={() => onCardTap(s.key)}
          >
            <Text className='card__title'>{s.title}</Text>
            <Text className='card__desc'>{s.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
