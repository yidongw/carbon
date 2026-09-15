import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

const SEGS = ['已分配', '进行中', '最近'] as const

// TODO: 接 /api/miniapp/operations/assigned|active|recent。
const MOCK = [
  { id: '1', title: '领口锁边 · JOB-2048', sub: '3号缝纫线 · 待开工', tag: '待开工' },
  { id: '2', title: '袖口缝合 · JOB-2043', sub: '目标 200 / 已报 128', tag: '进行中' },
  { id: '3', title: '门襟压线 · JOB-2039', sub: '今日完成', tag: '已完成' },
]

export default function Tasks() {
  const [seg, setSeg] = useState<(typeof SEGS)[number]>('已分配')

  return (
    <View className='tasks'>
      <View className='tasks__segs'>
        {SEGS.map((s) => (
          <View
            key={s}
            className={`tasks__seg ${seg === s ? 'tasks__seg--active' : ''}`}
            onClick={() => setSeg(s)}
          >
            <Text className='tasks__seg-text'>{s}</Text>
          </View>
        ))}
      </View>

      <View className='tasks__list'>
        {MOCK.map((t) => (
          <View key={t.id} className='tasks__row'>
            <View className='tasks__row-mid'>
              <Text className='tasks__row-title'>{t.title}</Text>
              <Text className='tasks__row-sub'>{t.sub}</Text>
            </View>
            <View className='tasks__tag'>
              <Text className='tasks__tag-text'>{t.tag}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
