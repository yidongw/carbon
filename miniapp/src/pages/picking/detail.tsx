import { useCallback, useState } from 'react'
import { View, Text, Input, ScrollView } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import {
  getPickingList,
  getTrackedEntities,
  pickTrackedEntity,
  setLineQuantity,
  updatePickingStatus,
} from '../../services/picking'
import type {
  PickingDetail,
  PickingLine,
  TrackedEntityRow,
} from '../../services/picking'
import './index.scss'

const STATUS: Record<string, { label: string; cls: string }> = {
  Draft: { label: '草稿', cls: 'gray' },
  'In Progress': { label: '进行中', cls: 'blue' },
  Completed: { label: '已完成', cls: 'green' },
  Cancelled: { label: '已取消', cls: 'red' },
  Pending: { label: '待拣', cls: 'gray' },
  Picked: { label: '已拣', cls: 'green' },
  Short: { label: '缺货', cls: 'orange' },
}

const statusLabel = (s: string) => STATUS[s]?.label ?? s
const statusCls = (s: string) => STATUS[s]?.cls ?? 'gray'

const isTracked = (line: PickingLine) =>
  line.trackingType === 'Serial' || line.trackingType === 'Batch'

const isFullyPicked = (line: PickingLine) =>
  line.quantityToPick > 0 && line.quantityPicked >= line.quantityToPick

const isResolved = (line: PickingLine) =>
  isFullyPicked(line) || line.status === 'Short' || line.status === 'Cancelled'

export default function PickingDetailPage() {
  const router = useRouter()
  const id = router.params.id || ''

  const [detail, setDetail] = useState<PickingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [shortLine, setShortLine] = useState<PickingLine | null>(null)
  const [shortQty, setShortQty] = useState('')
  const [pickerLine, setPickerLine] = useState<PickingLine | null>(null)
  const [lots, setLots] = useState<TrackedEntityRow[]>([])
  const [lotKw, setLotKw] = useState('')
  const [lotsLoading, setLotsLoading] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setLoading(true)
    getPickingList(id)
      .then((d) => {
        if (!d.found) {
          Taro.showToast({ title: '拣货单不存在', icon: 'none' })
          setDetail(null)
          return
        }
        setDetail(d)
      })
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  useDidShow(load)

  const run = async (fn: () => Promise<{ success: boolean; message?: string }>) => {
    if (busy) return
    setBusy(true)
    try {
      const r = await fn()
      if (!r.success) {
        Taro.showToast({ title: r.message || '操作失败', icon: 'none' })
        return false
      }
      load()
      return true
    } catch (e: any) {
      if (e?.statusCode !== 401) {
        Taro.showToast({ title: e?.message || '操作失败', icon: 'none' })
      }
      return false
    } finally {
      setBusy(false)
    }
  }

  const onStart = () => run(() => updatePickingStatus(id, 'In Progress'))
  const onFinish = () => run(() => updatePickingStatus(id, 'Completed'))

  const onPick = (line: PickingLine) =>
    run(() =>
      setLineQuantity(id, {
        pickingListLineId: line.id,
        quantity: line.quantityToPick,
      }),
    )

  const onUnpick = (line: PickingLine) =>
    run(() =>
      setLineQuantity(id, {
        pickingListLineId: line.id,
        quantity: 0,
      }),
    )

  const openShort = (line: PickingLine) => {
    setShortLine(line)
    setShortQty(
      String(line.quantityPicked > 0 ? line.quantityPicked : line.quantityToPick),
    )
  }

  const confirmShort = async () => {
    if (!shortLine) return
    const qty = Number(shortQty)
    if (Number.isNaN(qty) || qty < 0 || qty > shortLine.quantityToPick) {
      Taro.showToast({ title: '缺货数量无效', icon: 'none' })
      return
    }
    const ok = await run(() =>
      setLineQuantity(id, {
        pickingListLineId: shortLine.id,
        quantity: qty,
        markShort: true,
      }),
    )
    if (ok) setShortLine(null)
  }

  const openPicker = async (line: PickingLine) => {
    setPickerLine(line)
    setLotKw('')
    setLots([])
    setLotsLoading(true)
    try {
      const r = await getTrackedEntities(id, line.id)
      setLots(r.rows ?? [])
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '加载批次失败', icon: 'none' })
      setPickerLine(null)
    } finally {
      setLotsLoading(false)
    }
  }

  const scanLot = () => {
    Taro.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        const code = (res.result || '').trim()
        if (!code) return
        setLotKw(code)
        const match = lots.find(
          (l) =>
            l.readableId === code ||
            l.id === code ||
            l.readableId.toLowerCase() === code.toLowerCase(),
        )
        if (match) {
          selectLot(match)
        } else {
          Taro.showToast({ title: '未找到匹配批次', icon: 'none' })
        }
      },
    })
  }

  const selectLot = async (lot: TrackedEntityRow) => {
    if (!pickerLine) return
    const remaining = Math.max(
      0,
      pickerLine.quantityToPick - pickerLine.quantityPicked,
    )
    const qty =
      pickerLine.trackingType === 'Serial'
        ? 1
        : Math.min(lot.quantity, remaining || lot.quantity)
    const ok = await run(() =>
      pickTrackedEntity(id, pickerLine.id, {
        trackedEntityId: lot.id,
        quantity: qty,
        fromStorageUnitId: lot.storageUnitId,
      }),
    )
    if (ok) setPickerLine(null)
  }

  const unpickLot = (line: PickingLine, trackedEntityId: string) =>
    run(() =>
      pickTrackedEntity(id, line.id, {
        trackedEntityId,
        unpick: true,
      }),
    )

  if (loading && !detail) {
    return (
      <View className='pk'>
        <NavBar title='拣货单' back />
        <View className='pk__empty'>
          <Text className='pk__empty-text'>加载中…</Text>
        </View>
      </View>
    )
  }

  if (!detail?.found) {
    return (
      <View className='pk'>
        <NavBar title='拣货单' back />
        <View className='pk__empty'>
          <Text className='pk__empty-text'>拣货单不存在</Text>
        </View>
      </View>
    )
  }

  const lines = detail.lines ?? []
  const done = lines.filter(isResolved).length
  const locked = !!detail.locked
  const filteredLots = lotKw.trim()
    ? lots.filter((l) =>
        `${l.readableId} ${l.storageUnitName}`
          .toLowerCase()
          .includes(lotKw.trim().toLowerCase()),
      )
    : lots

  return (
    <View className='pk pk--detail'>
      <NavBar title={detail.pickingListId || '拣货单'} back />

      <View className='pk__detail-bar'>
        <View className='pk__detail-meta'>
          <View className={`pk__badge pk__badge--${statusCls(detail.status || '')}`}>
            <Text className='pk__badge-text'>
              {statusLabel(detail.status || '')}
            </Text>
          </View>
          <Text className='pk__detail-progress'>
            {done}/{lines.length} 行
          </Text>
          {detail.locationName ? (
            <Text className='pk__detail-loc'>{detail.locationName}</Text>
          ) : null}
        </View>
        {!locked && detail.status === 'Draft' ? (
          <View
            className='pk__btn pk__btn--primary'
            hoverClass='pk__btn--hover'
            onClick={onStart}
          >
            <Text className='pk__btn-text'>开始</Text>
          </View>
        ) : null}
        {!locked && detail.status === 'In Progress' ? (
          <View
            className='pk__btn pk__btn--secondary'
            hoverClass='pk__btn--hover'
            onClick={onFinish}
          >
            <Text className='pk__btn-text'>完成</Text>
          </View>
        ) : null}
      </View>

      <ScrollView scrollY className='pk__scroll'>
        {(detail.kits ?? []).map((kit) => {
          const toPick = kit.lines.reduce((s, l) => s + l.quantityToPick, 0)
          const picked = kit.lines.reduce(
            (s, l) => s + Math.min(l.quantityPicked, l.quantityToPick),
            0,
          )
          const pct = toPick > 0 ? Math.round((picked / toPick) * 100) : 0
          return (
            <View key={kit.id} className='pk__kit'>
              <View className='pk__kit-head'>
                <Text className='pk__kit-title'>{kit.title}</Text>
                {kit.workCenterName ? (
                  <Text className='pk__kit-sub'>{kit.workCenterName}</Text>
                ) : null}
                <View className='pk__bar'>
                  <View className='pk__bar-fill' style={{ width: `${pct}%` }} />
                </View>
              </View>
              {kit.lines.map((line) => (
                <LineCard
                  key={line.id}
                  line={line}
                  locked={locked}
                  busy={busy}
                  onPick={() => onPick(line)}
                  onUnpick={() => onUnpick(line)}
                  onShort={() => openShort(line)}
                  onScan={() => openPicker(line)}
                  onUnpickLot={(teid) => unpickLot(line, teid)}
                />
              ))}
            </View>
          )
        })}
        {(detail.kits ?? []).length === 0 ? (
          <View className='pk__empty'>
            <Text className='pk__empty-text'>暂无拣货行</Text>
          </View>
        ) : null}
      </ScrollView>

      {shortLine ? (
        <View className='pk__mask' onClick={() => setShortLine(null)}>
          <View className='pk__modal' onClick={(e) => e.stopPropagation()}>
            <Text className='pk__modal-title'>缺货拣货</Text>
            <Text className='pk__modal-sub'>
              {shortLine.itemDesc || shortLine.itemName} · 应拣{' '}
              {shortLine.quantityToPick}
            </Text>
            <Input
              className='pk__modal-input'
              type='digit'
              value={shortQty}
              placeholder='实际拣到数量'
              onInput={(e) => setShortQty(e.detail.value)}
            />
            <View className='pk__modal-actions'>
              <View
                className='pk__btn pk__btn--ghost'
                onClick={() => setShortLine(null)}
              >
                <Text className='pk__btn-text'>取消</Text>
              </View>
              <View
                className='pk__btn pk__btn--primary'
                onClick={confirmShort}
              >
                <Text className='pk__btn-text'>确认缺货</Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {pickerLine ? (
        <View className='pk__mask' onClick={() => setPickerLine(null)}>
          <View
            className='pk__modal pk__modal--sheet'
            onClick={(e) => e.stopPropagation()}
          >
            <View className='pk__modal-head'>
              <Text className='pk__modal-title'>
                选择{pickerLine.trackingType === 'Serial' ? '序列号' : '批次'}
              </Text>
              <View className='pk__btn pk__btn--ghost pk__btn--sm' onClick={scanLot}>
                <Text className='pk__btn-text'>扫码</Text>
              </View>
            </View>
            <Text className='pk__modal-sub'>
              {pickerLine.itemDesc || pickerLine.itemName} · 还需{' '}
              {Math.max(0, pickerLine.quantityToPick - pickerLine.quantityPicked)}
            </Text>
            <View className='pk__search pk__search--modal'>
              <Input
                className='pk__search-input'
                value={lotKw}
                placeholder='搜索 / 粘贴条码'
                onInput={(e) => setLotKw(e.detail.value)}
              />
            </View>
            <ScrollView scrollY className='pk__lot-list'>
              {lotsLoading ? (
                <Text className='pk__empty-text'>加载中…</Text>
              ) : filteredLots.length === 0 ? (
                <Text className='pk__empty-text'>无可拣批次</Text>
              ) : (
                filteredLots.map((lot) => (
                  <View
                    key={lot.id}
                    className='pk__lot'
                    hoverClass='pk__lot--hover'
                    onClick={() => selectLot(lot)}
                  >
                    <Text className='pk__lot-id'>{lot.readableId}</Text>
                    <Text className='pk__lot-meta'>
                      {[
                        lot.storageUnitName,
                        `库存 ${lot.quantity}`,
                        lot.expirationDate
                          ? `效期 ${lot.expirationDate.slice(0, 10)}`
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
            <View
              className='pk__btn pk__btn--ghost pk__btn--block'
              onClick={() => setPickerLine(null)}
            >
              <Text className='pk__btn-text'>关闭</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}

function LineCard({
  line,
  locked,
  busy,
  onPick,
  onUnpick,
  onShort,
  onScan,
  onUnpickLot,
}: {
  line: PickingLine
  locked: boolean
  busy: boolean
  onPick: () => void
  onUnpick: () => void
  onShort: () => void
  onScan: () => void
  onUnpickLot: (trackedEntityId: string) => void
}) {
  const tracked = isTracked(line)
  const full = isFullyPicked(line)
  const short = line.status === 'Short'
  const cancelled = line.status === 'Cancelled'
  const resolved = isResolved(line)
  const noStock = line.availableQuantity <= 0

  return (
    <View className={`pk__line ${resolved ? 'pk__line--done' : ''}`}>
      <View className='pk__line-top'>
        <View className='pk__line-info'>
          <Text className='pk__line-name'>
            {line.itemDesc || line.itemName || '—'}
          </Text>
          <Text className='pk__line-sku'>{line.itemName}</Text>
          {line.fromBin ? (
            <Text className='pk__line-bin'>库位 {line.fromBin}</Text>
          ) : noStock && !full ? (
            <Text className='pk__line-warn'>无库存记录</Text>
          ) : null}
        </View>
        <View
          className={`pk__qty pk__qty--${
            full ? 'green' : short ? 'orange' : 'red'
          }`}
        >
          <Text className='pk__qty-text'>
            {line.quantityPicked}/{line.quantityToPick}
          </Text>
        </View>
      </View>

      {locked || cancelled ? (
        cancelled ? (
          <View className='pk__badge pk__badge--red'>
            <Text className='pk__badge-text'>已取消</Text>
          </View>
        ) : null
      ) : tracked ? (
        <View className='pk__actions'>
          {line.trackedEntities.map((te) => (
            <View
              key={te.trackedEntityId}
              className='pk__btn pk__btn--secondary pk__btn--sm'
              hoverClass='pk__btn--hover'
              onClick={() => !busy && onUnpickLot(te.trackedEntityId)}
            >
              <Text className='pk__btn-text'>撤销 {te.readableId || ''}</Text>
            </View>
          ))}
          {!full ? (
            <View
              className='pk__btn pk__btn--primary pk__btn--sm'
              hoverClass='pk__btn--hover'
              onClick={() => !busy && onScan()}
            >
              <Text className='pk__btn-text'>扫码/选批</Text>
            </View>
          ) : null}
        </View>
      ) : full ? (
        <View className='pk__actions'>
          <View
            className='pk__btn pk__btn--secondary pk__btn--sm'
            hoverClass='pk__btn--hover'
            onClick={() => !busy && onUnpick()}
          >
            <Text className='pk__btn-text'>撤销</Text>
          </View>
        </View>
      ) : (
        <View className='pk__actions'>
          <View
            className='pk__btn pk__btn--secondary pk__btn--sm'
            hoverClass='pk__btn--hover'
            onClick={() => !busy && onShort()}
          >
            <Text className='pk__btn-text'>缺货</Text>
          </View>
          <View
            className='pk__btn pk__btn--primary pk__btn--sm'
            hoverClass='pk__btn--hover'
            onClick={() => !busy && onPick()}
          >
            <Text className='pk__btn-text'>拣货</Text>
          </View>
        </View>
      )}
    </View>
  )
}
