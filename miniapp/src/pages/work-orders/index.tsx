import { useMemo, useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import {
  getJobs,
  getMasterWorkOrders,
  getBundleWorkOrders,
} from '../../services/workOrders'
import type { JobRow, MasterRow, BundleRow } from '../../services/workOrders'
import './index.scss'

type WoType = 'jobs' | 'master' | 'bundle'
type AnyRow = JobRow | MasterRow | BundleRow

const TITLE: Record<WoType, string> = {
  jobs: '任务',
  master: '主工单',
  bundle: '分包工单',
}

// 状态本地化 + 配色(对齐网页 JobStatus:Ready 显示为「已下达」)。
const STATUS: Record<string, { label: string; cls: string }> = {
  Draft: { label: '草稿', cls: 'gray' },
  Planned: { label: '已计划', cls: 'yellow' },
  Ready: { label: '已下达', cls: 'blue' },
  'In Progress': { label: '进行中', cls: 'blue' },
  Paused: { label: '已暂停', cls: 'orange' },
  Completed: { label: '已完成', cls: 'green' },
  Closed: { label: '已关闭', cls: 'gray' },
  Cancelled: { label: '已取消', cls: 'red' },
}

const statusLabel = (s: string) => STATUS[s]?.label ?? s
const statusCls = (s: string) => STATUS[s]?.cls ?? 'gray'

export default function WorkOrders() {
  const router = useRouter()
  const type = ((router.params.type as WoType) || 'jobs') as WoType

  const [rows, setRows] = useState<AnyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [kw, setKw] = useState('')
  const [status, setStatus] = useState('')

  useDidShow(() => {
    const fetcher =
      type === 'master'
        ? getMasterWorkOrders
        : type === 'bundle'
          ? getBundleWorkOrders
          : getJobs
    fetcher()
      .then((r) => setRows(r.rows as AnyRow[]))
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  })

  // 出现过的状态,做筛选 chip。
  const statuses = useMemo(
    () => [...new Set(rows.map((r) => r.status).filter(Boolean))],
    [rows],
  )

  const searchText = (r: AnyRow): string => {
    if (type === 'jobs') {
      const j = r as JobRow
      return `${j.jobId} ${j.item} ${j.name}`
    }
    if (type === 'master') {
      const m = r as MasterRow
      return `${m.wo} ${m.style} ${m.itemName}`
    }
    const b = r as BundleRow
    return `${b.bundle} ${b.style} ${b.itemName} ${b.masterWo}`
  }

  const filtered = useMemo(() => {
    const k = kw.trim().toLowerCase()
    return rows.filter((r) => {
      if (status && r.status !== status) return false
      if (k && !searchText(r).toLowerCase().includes(k)) return false
      return true
    })
  }, [rows, kw, status, type])

  return (
    <View className='wo'>
      <NavBar title={TITLE[type]} back />

      <View className='wo__search'>
        <Text className='wo__search-ic'>🔍</Text>
        <Input
          className='wo__search-input'
          value={kw}
          placeholder='搜索工单 / 款号 / 名称'
          confirmType='search'
          onInput={(e) => setKw(e.detail.value)}
        />
      </View>

      {statuses.length > 0 ? (
        <View className='wo__chips'>
          <View
            className={`wo__chip ${status === '' ? 'wo__chip--on' : ''}`}
            onClick={() => setStatus('')}
          >
            <Text className='wo__chip-text'>全部</Text>
          </View>
          {statuses.map((s) => (
            <View
              key={s}
              className={`wo__chip ${status === s ? 'wo__chip--on' : ''}`}
              onClick={() => setStatus(s)}
            >
              <Text className='wo__chip-text'>{statusLabel(s)}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {filtered.length > 0 ? (
        <View className='wo__list'>
          {filtered.map((r) => (
            <View
              key={r.id}
              className='wo__card'
              hoverClass='wo__card--hover'
              onClick={() => {
                if (type === 'jobs') {
                  Taro.navigateTo({
                    url: `/pages/job/index?id=${r.id}`,
                  })
                }
              }}
            >
              {type === 'jobs' ? <JobCard row={r as JobRow} /> : null}
              {type === 'master' ? <MasterCard row={r as MasterRow} /> : null}
              {type === 'bundle' ? <BundleCard row={r as BundleRow} /> : null}
            </View>
          ))}
        </View>
      ) : (
        <View className='wo__empty'>
          <Text className='wo__empty-text'>{loading ? '加载中…' : '暂无数据'}</Text>
        </View>
      )}
    </View>
  )
}

function Badge({ status }: { status: string }) {
  return (
    <View className={`wo__badge wo__badge--${statusCls(status)}`}>
      <Text className='wo__badge-text'>{statusLabel(status)}</Text>
    </View>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View className='wo__meta'>
      <Text className='wo__meta-label'>{label}</Text>
      <Text className='wo__meta-value'>{value}</Text>
    </View>
  )
}

function JobCard({ row }: { row: JobRow }) {
  return (
    <>
      <View className='wo__head'>
        <Text className='wo__title'>{row.jobId}</Text>
        <Badge status={row.status} />
      </View>
      <Text className='wo__sub'>
        {[row.item, row.name].filter(Boolean).join(' · ') || '—'}
      </Text>
      <View className='wo__metas'>
        <Meta label='数量' value={`${row.quantityComplete} / ${row.quantity}`} />
        <Meta label='交期' value={row.dueDate ? row.dueDate.slice(0, 10) : '—'} />
        <Meta label='负责人' value={row.assignee || '未分配'} />
      </View>
    </>
  )
}

function MasterCard({ row }: { row: MasterRow }) {
  return (
    <>
      <View className='wo__head'>
        <Text className='wo__title'>{row.wo}</Text>
        <Badge status={row.status} />
      </View>
      <Text className='wo__sub'>
        {[row.style, row.itemName].filter(Boolean).join(' · ') || '—'}
      </Text>
      <View className='wo__metas'>
        <Meta label='分包数' value={String(row.bundleCount)} />
        <Meta label='工序' value={String(row.processCount)} />
        <Meta label='数量' value={String(row.quantity)} />
        <Meta label='已报' value={String(row.reported)} />
        <Meta label='剩余' value={String(row.remaining)} />
        <Meta label='负责人' value={row.assignee || '未分配'} />
      </View>
    </>
  )
}

function BundleCard({ row }: { row: BundleRow }) {
  return (
    <>
      <View className='wo__head'>
        <Text className='wo__title'>{row.bundle}</Text>
        <Badge status={row.status} />
      </View>
      <Text className='wo__sub'>
        {[row.style, row.itemName].filter(Boolean).join(' · ') || '—'}
      </Text>
      {row.attributes ? <Text className='wo__attr'>{row.attributes}</Text> : null}
      <View className='wo__metas'>
        <Meta label='主工单' value={row.masterWo || '—'} />
        <Meta label='数量' value={String(row.quantity)} />
        <Meta label='工序' value={String(row.processCount)} />
        <Meta label='负责人' value={row.assignee || '未分配'} />
      </View>
    </>
  )
}
