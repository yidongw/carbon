import { useCallback, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import {
  getMaintenanceDetail,
  maintenanceEvent,
  maintenanceItem,
} from '../../services/tools'
import type { MaintenanceDetail } from '../../services/tools'
import './detail.scss'

const OEE_ZH: Record<string, string> = {
  Down: '停机',
  Planned: '已计划',
  Impact: '影响',
  'No Impact': '无影响',
}

const SEV_ZH: Record<string, string> = {
  Preventive: '预防性',
  'Operator Performed': '操作员执行',
  'Support Required': '需要支持',
  'OEM Required': '需要 OEM',
}

const STATUS_ZH: Record<string, string> = {
  Open: 'OPEN',
  Assigned: 'ASSIGNED',
  'In Progress': 'IN PROGRESS',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function fmtTime(iso: string) {
  if (!iso) return ''
  return iso.slice(5, 16).replace('T', ' ')
}

export default function MaintenanceDetailPage() {
  const router = useRouter()
  const id = router.params.id || ''

  const [d, setD] = useState<MaintenanceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [addOpen, setAddOpen] = useState(false)

  const load = useCallback(() => {
    if (!id) {
      setLoading(false)
      return
    }
    setLoading(true)
    getMaintenanceDetail(id)
      .then((r) => setD(r.found ? r : null))
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  useDidShow(load)

  const isWorking = !!d?.myActiveEventId
  const isCompleted = d?.status === 'Completed'

  const onToggle = async () => {
    if (!d || busy) return
    setBusy(true)
    try {
      const r = await maintenanceEvent(d.id, {
        action: isWorking ? 'End' : 'Start',
        workCenterId: d.workCenterId,
        eventId: d.myActiveEventId,
      })
      if (!r.success) {
        Taro.showToast({ title: r.message || '操作失败', icon: 'none' })
      } else {
        Taro.showToast({ title: r.message || '成功', icon: 'success' })
        load()
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '操作失败', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  const onComplete = async () => {
    if (!d || busy) return
    const ok = await Taro.showModal({
      title: '完成维护',
      content: '确定将此维护工单标记为已完成？',
    })
    if (!ok.confirm) return
    setBusy(true)
    try {
      const r = await maintenanceEvent(d.id, {
        action: 'Complete',
        eventId: d.myActiveEventId,
      })
      if (!r.success) {
        Taro.showToast({ title: r.message || '操作失败', icon: 'none' })
      } else {
        Taro.showToast({ title: r.message || '已完成', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 500)
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '操作失败', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  const onDeletePart = async (itemId: string, name: string) => {
    if (!d || busy) return
    const ok = await Taro.showModal({
      title: '移除备件',
      content: `移除 ${name}？`,
    })
    if (!ok.confirm) return
    setBusy(true)
    try {
      const r = await maintenanceItem(d.id, { action: 'delete', itemId })
      if (!r.success) {
        Taro.showToast({ title: r.message || '移除失败', icon: 'none' })
      } else {
        load()
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '移除失败', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  const onAddPart = async (part: MaintenanceDetail['replacementParts'][0]) => {
    if (!d || busy) return
    setBusy(true)
    setAddOpen(false)
    try {
      const r = await maintenanceItem(d.id, {
        action: 'add',
        itemId: part.itemId,
        quantity: part.quantity || 1,
        unitOfMeasureCode: part.unitOfMeasureCode || 'EA',
      })
      if (!r.success) {
        Taro.showToast({ title: r.message || '添加失败', icon: 'none' })
      } else {
        Taro.showToast({ title: '已添加', icon: 'success' })
        load()
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '添加失败', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  const title = d?.maintenanceDispatchId || '维护详情'

  return (
    <View className='md'>
      <NavBar title={title} back />

      {d ? (
        <View className='md__body'>
          <View className='md__head-row'>
            <Text className='md__readable'>{d.maintenanceDispatchId}</Text>
            <View className={`md__status md__status--${(d.status || '').replace(/\s/g, '').toLowerCase()}`}>
              <Text className='md__status-t'>
                {STATUS_ZH[d.status] || d.status}
              </Text>
            </View>
          </View>

          {/* 工作中心 */}
          <View className='md__card'>
            <View className='md__card-h'>
              <Text className='md__card-ht'>工作中心</Text>
            </View>
            <View className='md__card-b'>
              <Text className='md__wc'>{d.workCenterName || '—'}</Text>
              <View className='md__badges'>
                <View className='md__badge'>
                  <Text className='md__badge-t'>
                    {OEE_ZH[d.oeeImpact] || d.oeeImpact}
                  </Text>
                </View>
                <View className='md__badge md__badge--outline'>
                  <Text className='md__badge-t'>
                    {SEV_ZH[d.severity] || d.severity}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {d.description ? (
            <View className='md__card'>
              <View className='md__card-h'>
                <Text className='md__card-ht'>描述</Text>
              </View>
              <View className='md__card-b'>
                <Text className='md__desc'>{d.description}</Text>
              </View>
            </View>
          ) : null}

          {/* 工作时间 */}
          {!isCompleted ? (
            <View className='md__card'>
              <View className='md__card-h'>
                <Text className='md__card-ht'>
                  工作时间: {formatDuration(d.totalDuration || 0)}
                </Text>
              </View>
              <View className='md__card-b md__controls'>
                <View
                  className={`md__round ${isWorking ? 'md__round--pause' : 'md__round--play'}`}
                  onClick={onToggle}
                >
                  <Text className='md__round-ic'>
                    {isWorking ? '❚❚' : '▶'}
                  </Text>
                </View>
                <View className='md__round md__round--check' onClick={onComplete}>
                  <Text className='md__round-ic md__round-ic--dark'>✓</Text>
                </View>
              </View>
            </View>
          ) : (
            <View className='md__done'>
              <Text className='md__done-ic'>✓</Text>
              <Text className='md__done-t'>已完成</Text>
              <Text className='md__done-sub'>
                总工时 {formatDuration(d.totalDuration || 0)}
              </Text>
            </View>
          )}

          {/* 工时记录 */}
          {d.events.length > 0 ? (
            <View className='md__card'>
              <View className='md__card-h'>
                <Text className='md__card-ht'>工时记录</Text>
              </View>
              <View className='md__card-b'>
                {d.events.map((e) => (
                  <View key={e.id} className='md__event'>
                    <View className='md__event-l'>
                      <Text className='md__event-time'>
                        {fmtTime(e.startTime)}
                        {e.endTime ? ` – ${fmtTime(e.endTime).slice(6)}` : ''}
                      </Text>
                    </View>
                    <Text className='md__event-dur'>
                      {e.duration ? formatDuration(e.duration) : '进行中'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {/* 备件 */}
          <View className='md__card'>
            <View className='md__card-h md__card-h--row'>
              <Text className='md__card-ht'>
                {isCompleted ? '已用备件' : '备件'}
              </Text>
              {!isCompleted ? (
                <View
                  className='md__add'
                  onClick={() => {
                    if (!(d.replacementParts?.length > 0)) {
                      Taro.showToast({
                        title: '无可添加的备件清单',
                        icon: 'none',
                      })
                      return
                    }
                    setAddOpen(true)
                  }}
                >
                  <Text className='md__add-t'>+ 添加</Text>
                </View>
              ) : null}
            </View>
            <View className='md__card-b'>
              {d.items.length > 0 ? (
                d.items.map((it) => (
                  <View key={it.id} className='md__part'>
                    <View className='md__part-l'>
                      <Text className='md__part-name'>{it.name || '—'}</Text>
                      <Text className='md__part-qty'>
                        {it.quantity} {it.unitOfMeasureCode}
                      </Text>
                    </View>
                    {!isCompleted ? (
                      <View
                        className='md__part-x'
                        onClick={() => onDeletePart(it.id, it.name)}
                      >
                        <Text className='md__part-xt'>×</Text>
                      </View>
                    ) : null}
                  </View>
                ))
              ) : (
                <Text className='md__empty'>暂无备件</Text>
              )}
            </View>
          </View>

          {d.procedureText || d.procedureName ? (
            <View className='md__card'>
              <View className='md__card-h'>
                <Text className='md__card-ht'>
                  规程{d.procedureName ? ` · ${d.procedureName}` : ''}
                </Text>
              </View>
              <View className='md__card-b'>
                <Text className='md__desc'>{d.procedureText || '—'}</Text>
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <View className='md__empty-page'>
          <Text className='md__empty'>
            {loading ? '加载中…' : '维护工单不存在'}
          </Text>
        </View>
      )}

      {addOpen && d ? (
        <View className='md__sheet'>
          <View className='md__sheet-mask' onClick={() => setAddOpen(false)} />
          <View className='md__sheet-panel'>
            <Text className='md__sheet-title'>添加备件</Text>
            {d.replacementParts.map((p) => (
              <View
                key={p.id}
                className='md__sheet-row'
                onClick={() => onAddPart(p)}
              >
                <Text className='md__sheet-name'>{p.name}</Text>
                <Text className='md__sheet-qty'>
                  {p.quantity} {p.unitOfMeasureCode}
                </Text>
              </View>
            ))}
            <View className='md__sheet-cancel' onClick={() => setAddOpen(false)}>
              <Text className='md__sheet-cancel-t'>取消</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}
