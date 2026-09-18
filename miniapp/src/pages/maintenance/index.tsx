import { useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getMaintenance } from '../../services/tools'
import type { MaintenanceRow } from '../../services/tools'
import './index.scss'

type Tab = 'all' | 'today' | 'assigned' | 'blocking'

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'today', label: '今日' },
  { key: 'assigned', label: '已分配给我' },
  { key: 'blocking', label: '阻塞' },
]

function statusDot(status: string) {
  if (status === 'Open') return 'blue'
  if (status === 'Assigned') return 'yellow'
  if (status === 'In Progress') return 'green'
  return 'gray'
}

function priorityMark(p: string) {
  if (p === 'Critical' || p === 'High') return '!!!'
  if (p === 'Medium') return '!!'
  return '!'
}

function isToday(iso: string | null) {
  if (!iso) return false
  const d = new Date(iso)
  const t = new Date()
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  )
}

function isBlocking(d: MaintenanceRow) {
  if (d.oeeImpact === 'Down') return true
  if (d.oeeImpact === 'Planned' && d.status === 'In Progress') return true
  return false
}

function oeeCls(oee: string) {
  if (oee === 'Down') return 'down'
  if (oee === 'Planned') return 'planned'
  if (oee === 'Impact') return 'impact'
  return 'none'
}

export default function MaintenancePage() {
  const [tab, setTab] = useState<Tab>('all')
  const [rows, setRows] = useState<MaintenanceRow[]>([])
  const [assigned, setAssigned] = useState<MaintenanceRow[]>([])
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    setLoading(true)
    getMaintenance()
      .then((d) => {
        setRows(d.rows ?? [])
        setAssigned(d.assigned ?? [])
      })
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  })

  const blocking = useMemo(() => rows.filter(isBlocking), [rows])
  const today = useMemo(
    () => rows.filter((r) => isToday(r.plannedStartTime)),
    [rows],
  )

  const list = useMemo(() => {
    if (tab === 'assigned') return assigned
    if (tab === 'blocking') return blocking
    if (tab === 'today') return today
    return rows
  }, [tab, rows, assigned, blocking, today])

  const count = (k: Tab) => {
    if (k === 'all') return rows.length
    if (k === 'today') return today.length
    if (k === 'assigned') return assigned.length
    if (k === 'blocking') return blocking.length
    return 0
  }

  return (
    <View className='mnt'>
      <NavBar title='维护' back />

      <View className='mnt__tabs'>
        {TABS.map((t) => (
          <View
            key={t.key}
            className={`mnt__tab ${tab === t.key ? 'mnt__tab--on' : ''}`}
            onClick={() => setTab(t.key)}
          >
            <Text className='mnt__tab-t'>{t.label}</Text>
            {count(t.key) > 0 ? (
              <View
                className={`mnt__badge ${t.key === 'blocking' ? 'mnt__badge--red' : ''}`}
              >
                <Text className='mnt__badge-t'>{count(t.key)}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      {list.length > 0 ? (
        <View className='mnt__list'>
          {list.map((d) => (
            <View key={d.id} className='mnt__card'>
              <View className='mnt__head'>
                <View className='mnt__id-row'>
                  <Text className='mnt__id'>{d.maintenanceDispatchId}</Text>
                  <View className={`mnt__dot mnt__dot--${statusDot(d.status)}`} />
                </View>
                <Text className='mnt__pri'>{priorityMark(d.priority)}</Text>
              </View>
              <Text className='mnt__wc'>{d.workCenterName || '—'}</Text>
              <Text className='mnt__sev'>{d.severity || '—'}</Text>
              <View className='mnt__foot'>
                <View className={`mnt__oee mnt__oee--${oeeCls(d.oeeImpact)}`}>
                  <Text className='mnt__oee-t'>{d.oeeImpact || 'No Impact'}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className='mnt__empty'>
          <Text className='mnt__empty-t'>
            {loading ? '加载中…' : '暂无维护工单'}
          </Text>
        </View>
      )}
    </View>
  )
}
