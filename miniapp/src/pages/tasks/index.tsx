import { useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getOperations } from '../../services/operations'
import type { OpItem } from '../../services/operations'
import { opStatusCls, opStatusLabel } from '../../utils/opStatus'
import TabBar from '../../components/TabBar'
import NavBar from '../../components/NavBar'
import './index.scss'

const SEGS = [
  { key: 'active', text: '进行中' },
  { key: 'ready', text: '就绪' },
  { key: 'todo', text: '待处理' },
  { key: 'assigned', text: '已分配' },
] as const

type SegKey = (typeof SEGS)[number]['key']

function filterBySeg(rows: OpItem[], seg: SegKey): OpItem[] {
  if (seg === 'assigned') return rows
  if (seg === 'active') {
    return rows.filter(
      (r) => r.status === 'In Progress' || r.status === 'Paused',
    )
  }
  if (seg === 'ready') return rows.filter((r) => r.status === 'Ready')
  if (seg === 'todo') return rows.filter((r) => r.status === 'Todo')
  return rows
}

export default function Tasks() {
  const [seg, setSeg] = useState<SegKey>('active')
  const [rows, setRows] = useState<OpItem[]>([])
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    getOperations()
      .then((d) => setRows(d.assigned ?? []))
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  })

  const list = useMemo(() => filterBySeg(rows, seg), [rows, seg])

  return (
    <View className='tasks'>
      <NavBar title='我的任务' />
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
          {list.map((item) => (
            <View
              key={item.id}
              className='tasks__row'
              hoverClass='tasks__row--hover'
              onClick={() =>
                Taro.navigateTo({ url: `/pages/operation/index?id=${item.id}` })
              }
            >
              <View className='tasks__row-mid'>
                <Text className='tasks__row-title'>{item.title}</Text>
                <Text className='tasks__row-sub'>{item.sub}</Text>
              </View>
              <View
                className={`tasks__badge tasks__badge--${opStatusCls(item.status)}`}
              >
                <Text className='tasks__badge-text'>
                  {opStatusLabel(item.status)}
                </Text>
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
