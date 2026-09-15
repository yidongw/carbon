import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getOperations } from '../../services/operations'
import type { OpsData, OpItem } from '../../services/operations'
import TabBar from '../../components/TabBar'
import './index.scss'

const SEGS = [
  { key: 'assigned', text: '已分配' },
  { key: 'active', text: '进行中' },
  { key: 'recent', text: '最近' },
] as const

export default function Tasks() {
  const [seg, setSeg] = useState<(typeof SEGS)[number]['key']>('assigned')
  const [data, setData] = useState<OpsData | null>(null)
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    getOperations()
      .then(setData)
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  })

  const list: OpItem[] = data ? data[seg] : []

  return (
    <View className='tasks'>
      <View className='tasks__segs'>
        {SEGS.map((s) => (
          <View
            key={s.key}
            className={`tasks__seg ${seg === s.key ? 'tasks__seg--active' : ''}`}
            onClick={() => setSeg(s.key)}
          >
            <Text className='tasks__seg-text'>{s.text}</Text>
          </View>
        ))}
      </View>

      {list.length > 0 ? (
        <View className='tasks__list'>
          {list.map((t) => (
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
      ) : (
        <View className='tasks__empty'>
          <Text className='tasks__empty-text'>
            {loading ? '加载中…' : '暂无任务'}
          </Text>
        </View>
      )}

      <TabBar active='tasks' />
    </View>
  )
}
