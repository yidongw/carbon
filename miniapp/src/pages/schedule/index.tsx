import { useMemo, useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getSchedule } from '../../services/schedule'
import type { ScheduleColumn, ScheduleItem } from '../../services/schedule'
import { opStatusCls, opStatusLabel } from '../../utils/opStatus'
import './index.scss'

function fmtDur(ms: number) {
  if (!ms || ms <= 0) return ''
  const m = Math.round(ms / 60000)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return mm ? `${h}h ${mm}m` : `${h}h`
}

export default function SchedulePage() {
  const [columns, setColumns] = useState<ScheduleColumn[]>([])
  const [items, setItems] = useState<ScheduleItem[]>([])
  const [workCenters, setWorkCenters] = useState<{ id: string; name: string }[]>(
    [],
  )
  const [wcFilter, setWcFilter] = useState('')
  const [kw, setKw] = useState('')
  const [loading, setLoading] = useState(true)

  const load = (opts?: { workCenterId?: string; search?: string }) => {
    setLoading(true)
    getSchedule(opts)
      .then((d) => {
        setColumns(d.columns ?? [])
        setItems(d.items ?? [])
        setWorkCenters(d.workCenters ?? [])
      })
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }

  useDidShow(() => {
    load({
      workCenterId: wcFilter || undefined,
      search: kw.trim() || undefined,
    })
  })

  const byWc = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>()
    for (const it of items) {
      const list = map.get(it.workCenterId) ?? []
      list.push(it)
      map.set(it.workCenterId, list)
    }
    return map
  }, [items])

  const onSearch = () => {
    load({
      workCenterId: wcFilter || undefined,
      search: kw.trim() || undefined,
    })
  }

  const onPickWc = () => {
    const names = ['全部工作中心', ...workCenters.map((w) => w.name)]
    Taro.showActionSheet({ itemList: names })
      .then((r) => {
        if (r.tapIndex === 0) {
          setWcFilter('')
          load({ search: kw.trim() || undefined })
          return
        }
        const picked = workCenters[r.tapIndex - 1]
        if (picked) {
          setWcFilter(picked.id)
          load({ workCenterId: picked.id, search: kw.trim() || undefined })
        }
      })
      .catch(() => {})
  }

  const wcLabel =
    workCenters.find((w) => w.id === wcFilter)?.name || '全部工作中心'

  return (
    <View className='sch'>
      <NavBar title='排程' back />

      <View className='sch__filters'>
        <View className='sch__search'>
          <Text className='sch__search-ic'>🔍</Text>
          <Input
            className='sch__search-input'
            value={kw}
            placeholder='搜索工单 / 物料 / 工序'
            confirmType='search'
            onInput={(e) => setKw(e.detail.value)}
            onConfirm={onSearch}
          />
        </View>
        <View className='sch__wc' onClick={onPickWc}>
          <Text className='sch__wc-t'>{wcLabel}</Text>
          <Text className='sch__wc-arrow'>▾</Text>
        </View>
      </View>

      {columns.length > 0 ? (
        <View className='sch__list'>
          {columns.map((col) => {
            const list = byWc.get(col.id) ?? []
            return (
              <View key={col.id} className='sch__col'>
                <View
                  className='sch__col-h'
                  onClick={() => {
                    if (col.isBlocked && col.blockingDispatchId) {
                      Taro.navigateTo({
                        url: `/pages/maintenance/detail?id=${col.blockingDispatchId}`,
                      })
                    }
                  }}
                >
                  <View className='sch__col-title-row'>
                    {col.active ? <View className='sch__pulse' /> : null}
                    <Text className='sch__col-title'>{col.title}</Text>
                    <Text className='sch__col-count'>{list.length}</Text>
                  </View>
                  {col.isBlocked ? (
                    <Text className='sch__blocked'>
                      已阻塞
                      {col.blockingDispatchReadableId
                        ? ` · ${col.blockingDispatchReadableId}`
                        : ''}
                    </Text>
                  ) : null}
                </View>

                {list.length > 0 ? (
                  list.map((it) => (
                    <View
                      key={it.id}
                      className={`sch__card sch__card--${opStatusCls(it.status)}`}
                      hoverClass='sch__card--hover'
                      onClick={() =>
                        Taro.navigateTo({
                          url: `/pages/operation/index?id=${it.id}`,
                        })
                      }
                    >
                      <View className='sch__card-top'>
                        <Text className='sch__job'>{it.jobReadableId}</Text>
                        <View
                          className={`sch__badge sch__badge--${opStatusCls(it.status)}`}
                        >
                          <Text className='sch__badge-t'>
                            {opStatusLabel(it.status)}
                          </Text>
                        </View>
                      </View>
                      <Text className='sch__item'>
                        {[it.itemReadableId, it.itemDescription]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </Text>
                      {it.description ? (
                        <Text className='sch__desc'>{it.description}</Text>
                      ) : null}
                      <View className='sch__meta'>
                        <Text className='sch__meta-t'>
                          {it.quantityCompleted}/{it.targetQuantity}
                        </Text>
                        {it.quantityScrapped > 0 ? (
                          <Text className='sch__scrap'>
                            报废 {it.quantityScrapped}
                          </Text>
                        ) : null}
                        {it.reworkId ? (
                          <Text className='sch__rework'>返工</Text>
                        ) : null}
                        {fmtDur(it.durationMs) ? (
                          <Text className='sch__dur'>{fmtDur(it.durationMs)}</Text>
                        ) : null}
                      </View>
                      {(it.assignee || it.customerName || it.dueDate) && (
                        <View className='sch__foot'>
                          {it.assignee ? (
                            <Text className='sch__foot-t'>{it.assignee}</Text>
                          ) : null}
                          {it.customerName ? (
                            <Text className='sch__foot-t'>{it.customerName}</Text>
                          ) : null}
                          {it.dueDate ? (
                            <Text className='sch__foot-t'>
                              {it.dueDate.slice(0, 10)}
                            </Text>
                          ) : null}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text className='sch__empty-col'>暂无工序</Text>
                )}
              </View>
            )
          })}
        </View>
      ) : (
        <View className='sch__empty'>
          <Text className='sch__empty-t'>
            {loading ? '加载中…' : '暂无排程'}
          </Text>
        </View>
      )}
    </View>
  )
}
