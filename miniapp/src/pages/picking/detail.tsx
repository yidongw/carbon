import { useCallback, useState, type ReactNode } from 'react'
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
  Short: { label: '短缺', cls: 'orange' },
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

  const run = async (
    fn: () => Promise<{ success: boolean; message?: string }>,
  ) => {
    if (busy) return false
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
    // 没有库存时默认 0；已有拣数则回填；否则与网页一致回填应拣数
    const noStock = !line.fromBin && line.availableQuantity <= 0
    const initial = line.quantityPicked > 0
      ? line.quantityPicked
      : noStock
        ? 0
        : line.quantityToPick
    setShortQty(String(initial))
  }

  const confirmShort = async () => {
    if (!shortLine) return
    const qty = Number(shortQty)
    if (Number.isNaN(qty) || qty < 0 || qty > shortLine.quantityToPick) {
      Taro.showToast({ title: '短缺数量无效', icon: 'none' })
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
        if (match) selectLot(match)
        else Taro.showToast({ title: '未找到匹配批次', icon: 'none' })
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
        <NavBar title='拣货' back />
        <View className='pk__empty'>
          <Text className='pk__empty-text'>加载中…</Text>
        </View>
      </View>
    )
  }

  if (!detail?.found) {
    return (
      <View className='pk'>
        <NavBar title='拣货' back />
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
      <NavBar title={detail.pickingListId || '拣货'} back />

      {/* 对齐网页 sticky header: 状态 + 进度 + 开始/完成 */}
      <View className='pk__toolbar'>
        <View className='pk__toolbar-left'>
          <View className={`pk__badge pk__badge--${statusCls(detail.status || '')}`}>
            <Text className='pk__badge-text'>
              {statusLabel(detail.status || '')}
            </Text>
          </View>
          <Text className='pk__toolbar-count'>
            {done}/{lines.length}
          </Text>
          {detail.locationName ? (
            <Text className='pk__toolbar-loc'>{detail.locationName}</Text>
          ) : null}
        </View>
        {!locked && detail.status === 'Draft' ? (
          <View className='pk__act pk__act--dark' onClick={onStart}>
            <Text className='pk__act-text'>开始</Text>
          </View>
        ) : null}
        {!locked && detail.status === 'In Progress' ? (
          <View className='pk__act pk__act--ghost' onClick={onFinish}>
            <Text className='pk__act-text pk__act-text--dark'>完成</Text>
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
          const pct = toPick > 0 ? (picked / toPick) * 100 : 0
          return (
            <View key={kit.id} className='pk__kit'>
              <View className='pk__kit-head'>
                <Text className='pk__kit-title'>{kit.title}</Text>
                {kit.workCenterName ? (
                  <Text className='pk__kit-sub'>{kit.workCenterName}</Text>
                ) : null}
                <BarProgress progress={pct} />
              </View>
              <View className='pk__kit-body'>
                {kit.lines.map((line, i) => (
                  <LineCard
                    key={line.id}
                    line={line}
                    locked={locked}
                    busy={busy}
                    isLast={i === kit.lines.length - 1}
                    onPick={() => onPick(line)}
                    onUnpick={() => onUnpick(line)}
                    onShort={() => openShort(line)}
                    onScan={() => openPicker(line)}
                    onUnpickLot={(teid) => unpickLot(line, teid)}
                  />
                ))}
              </View>
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
            <Text className='pk__modal-title'>
              {(shortLine.itemDesc || shortLine.itemName) + '短缺领料'}
            </Text>
            <Text className='pk__modal-sub'>实际拣了几个？应拣 {shortLine.quantityToPick}</Text>
            <Input
              className='pk__modal-input'
              type='digit'
              value={shortQty}
              placeholder='实际拣到数量'
              onInput={(e) => setShortQty(e.detail.value)}
            />
            <View className='pk__modal-actions'>
              <View className='pk__act pk__act--ghost' onClick={() => setShortLine(null)}>
                <Text className='pk__act-text pk__act-text--dark'>取消</Text>
              </View>
              <View className='pk__act pk__act--dark' onClick={confirmShort}>
                <Text className='pk__act-text'>标记短缺</Text>
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
              <View className='pk__act pk__act--ghost pk__act--sm' onClick={scanLot}>
                <Text className='pk__act-text pk__act-text--dark'>扫描</Text>
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
              className='pk__act pk__act--ghost pk__act--block'
              onClick={() => setPickerLine(null)}
            >
              <Text className='pk__act-text pk__act-text--dark'>关闭</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}

/** 对齐网页 BarProgress：一排细竖条进度 */
function BarProgress({ progress }: { progress: number }) {
  const total = 36
  const active = Math.round((Math.min(100, Math.max(0, progress)) / 100) * total)
  return (
    <View className='pk__bars'>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          className={`pk__bar-tick ${i < active ? 'pk__bar-tick--on' : ''}`}
        />
      ))}
    </View>
  )
}

function LineCard({
  line,
  locked,
  busy,
  isLast,
  onPick,
  onUnpick,
  onShort,
  onScan,
  onUnpickLot,
}: {
  line: PickingLine
  locked: boolean
  busy: boolean
  isLast: boolean
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
  const noStock = !line.fromBin && line.availableQuantity <= 0 && !full

  const qtyCls = full
    ? 'green'
    : short || (tracked && line.quantityPicked > 0)
      ? 'orange'
      : 'red'
  const qtyText = tracked
    ? `${line.quantityPicked}/${line.quantityToPick}`
    : String(short ? line.quantityPicked : line.quantityToPick)

  const showNoStockTip = () => {
    Taro.showModal({
      title: '没有库存',
      content:
        '此项目没有记录仓库库存。您仍然可以领用——实际库存会暂时为负，直到完成盘点。',
      showCancel: false,
      confirmText: '知道了',
    })
  }

  let actions: ReactNode = null
  if (locked || cancelled) {
    actions = cancelled ? (
      <View className='pk__badge pk__badge--red'>
        <Text className='pk__badge-text'>已取消</Text>
      </View>
    ) : null
  } else if (tracked) {
    actions = (
      <>
        {line.trackedEntities.map((te) => (
          <View
            key={te.trackedEntityId}
            className='pk__btn pk__btn--outline'
            onClick={() => !busy && onUnpickLot(te.trackedEntityId)}
          >
            <Text className='pk__btn-t'>撤销 {te.readableId || ''}</Text>
          </View>
        ))}
        {!full ? (
          <View
            className='pk__btn pk__btn--outline'
            onClick={() => !busy && onScan()}
          >
            <Text className='pk__btn-t'>扫描</Text>
          </View>
        ) : null}
      </>
    )
  } else if (full) {
    actions = (
      <View
        className='pk__btn pk__btn--outline'
        onClick={() => !busy && onUnpick()}
      >
        <Text className='pk__btn-t'>撤销</Text>
      </View>
    )
  } else {
    actions = (
      <>
        <View
          className='pk__btn pk__btn--outline'
          onClick={() => !busy && onShort()}
        >
          <Text className='pk__btn-t'>短缺</Text>
        </View>
        <View
          className='pk__btn pk__btn--solid'
          onClick={() => !busy && onPick()}
        >
          <Text className='pk__btn-plus'>⊕</Text>
          <Text className='pk__btn-t pk__btn-t--w'>选择</Text>
        </View>
      </>
    )
  }

  // 对齐网页桌面行：缩略图 | 名称/编码 | 没有库存 | 数量 | 短缺 | +选择
  return (
    <View
      className={`pk__row ${resolved ? 'pk__row--done' : ''} ${
        isLast ? 'pk__row--last' : ''
      }`}
    >
      <View className='pk__thumb'>
        <Text className='pk__thumb-ic'>◈</Text>
      </View>

      <View className='pk__ident'>
        <Text className='pk__name' numberOfLines={1}>
          {line.itemDesc || line.itemName || '—'}
        </Text>
        <Text className='pk__sku' numberOfLines={1}>
          {line.itemName}
        </Text>
      </View>

      <View className='pk__right'>
        {line.fromBin ? (
          <Text className='pk__bin'>{line.fromBin}</Text>
        ) : noStock ? (
          <View className='pk__nostock' onClick={showNoStockTip}>
            <Text className='pk__nostock-ic'>△</Text>
            <Text className='pk__nostock-text'>没有库存</Text>
          </View>
        ) : null}

        <View className={`pk__count pk__count--${qtyCls}`}>
          <Text className='pk__count-text'>{qtyText}</Text>
        </View>

        <View className='pk__actions'>{actions}</View>
      </View>
    </View>
  )
}
