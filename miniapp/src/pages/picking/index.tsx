import { useMemo, useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getPickingLists } from '../../services/picking'
import type { PickingListRow } from '../../services/picking'
import './index.scss'

const STATUS: Record<string, { label: string; cls: string }> = {
  Draft: { label: '草稿', cls: 'gray' },
  'In Progress': { label: '进行中', cls: 'blue' },
  Completed: { label: '已完成', cls: 'green' },
  Cancelled: { label: '已取消', cls: 'red' },
}

const statusLabel = (s: string) => STATUS[s]?.label ?? s
const statusCls = (s: string) => STATUS[s]?.cls ?? 'gray'

export default function PickingListPage() {
  const [rows, setRows] = useState<PickingListRow[]>([])
  const [loading, setLoading] = useState(true)
  const [kw, setKw] = useState('')

  const load = () => {
    setLoading(true)
    getPickingLists()
      .then((r) => setRows(r.rows ?? []))
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }

  useDidShow(load)

  const filtered = useMemo(() => {
    const k = kw.trim().toLowerCase()
    if (!k) return rows
    return rows.filter((r) =>
      `${r.pickingListId} ${r.locationName}`.toLowerCase().includes(k),
    )
  }, [rows, kw])

  const openDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/picking/detail?id=${id}` })
  }

  return (
    <View className='pk'>
      <NavBar title='拣货' back />

      <View className='pk__search'>
        <Text className='pk__search-ic'>🔍</Text>
        <Input
          className='pk__search-input'
          value={kw}
          placeholder='搜索拣货单 / 库位'
          confirmType='search'
          onInput={(e) => setKw(e.detail.value)}
        />
      </View>

      {filtered.length > 0 ? (
        <View className='pk__list'>
          {filtered.map((r) => (
            <View
              key={r.id}
              className='pk__card'
              hoverClass='pk__card--hover'
              onClick={() => openDetail(r.id)}
            >
              <View className='pk__head'>
                <Text className='pk__title'>{r.pickingListId || '—'}</Text>
                <View className={`pk__badge pk__badge--${statusCls(r.status)}`}>
                  <Text className='pk__badge-text'>{statusLabel(r.status)}</Text>
                </View>
              </View>
              <Text className='pk__sub'>{r.locationName || '—'}</Text>
              <View className='pk__metas'>
                <View className='pk__meta'>
                  <Text className='pk__meta-label'>进度</Text>
                  <Text className='pk__meta-value'>
                    {r.completedLineCount}/{r.lineCount}
                  </Text>
                </View>
                <View className='pk__meta'>
                  <Text className='pk__meta-label'>交期</Text>
                  <Text className='pk__meta-value'>
                    {r.dueDate ? r.dueDate.slice(0, 10) : '—'}
                  </Text>
                </View>
                <View className='pk__meta'>
                  <Text className='pk__meta-label'>完成率</Text>
                  <Text className='pk__meta-value'>{r.progress}%</Text>
                </View>
              </View>
              <View className='pk__bar'>
                <View
                  className='pk__bar-fill'
                  style={{ width: `${Math.min(100, r.progress)}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className='pk__empty'>
          <Text className='pk__empty-text'>
            {loading ? '加载中…' : '暂无分配给你的拣货单'}
          </Text>
        </View>
      )}
    </View>
  )
}
