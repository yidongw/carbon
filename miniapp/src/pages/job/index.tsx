import { useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, MovableArea, MovableView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getJobDag } from '../../services/workOrders'
import type { JobDagDep, JobDagOp } from '../../services/workOrders'
import './index.scss'

type Dir = 'LR' | 'TB'

// Layout units are rpx (designWidth 750) so inline styles match scss px→rpx.
const NODE_W = 400
const NODE_H = 180
const NODE_SEP = 160
const RANK_SEP = 240
const MARGIN = 80

const STATUS_BORDER: Record<string, string> = {
  Done: '#22c55e',
  'In Progress': '#3b82f6',
  Ready: '#14b8a6',
  Waiting: '#9ca3af',
  Todo: '#d1d5db',
  Paused: '#f59e0b',
  Canceled: '#ef4444',
}

type LaidNode = JobDagOp & { x: number; y: number }
type LaidEdge = {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
  quantity: number
  labelX: number
  labelY: number
  length: number
  angle: number
}

function computeLayout(
  operations: JobDagOp[],
  dependencies: JobDagDep[],
  direction: Dir,
): { nodes: LaidNode[]; edges: LaidEdge[]; width: number; height: number } {
  const ids = new Set(operations.map((o) => o.id))
  const deps = dependencies.filter(
    (d) => ids.has(d.operationId) && ids.has(d.dependsOnId),
  )
  const indeg = new Map<string, number>()
  const children = new Map<string, string[]>()
  for (const o of operations) {
    indeg.set(o.id, 0)
    children.set(o.id, [])
  }
  for (const d of deps) {
    indeg.set(d.operationId, (indeg.get(d.operationId) ?? 0) + 1)
    children.get(d.dependsOnId)!.push(d.operationId)
  }

  const rank = new Map<string, number>()
  const queue = operations.filter((o) => (indeg.get(o.id) ?? 0) === 0).map((o) => o.id)
  for (const id of queue) rank.set(id, 0)
  let qi = 0
  while (qi < queue.length) {
    const id = queue[qi++]
    const r = rank.get(id) ?? 0
    for (const c of children.get(id) ?? []) {
      rank.set(c, Math.max(rank.get(c) ?? 0, r + 1))
      indeg.set(c, (indeg.get(c) ?? 1) - 1)
      if ((indeg.get(c) ?? 0) === 0) queue.push(c)
    }
  }
  for (const o of operations) {
    if (!rank.has(o.id)) rank.set(o.id, 0)
  }

  const byRank = new Map<number, string[]>()
  for (const o of operations) {
    const r = rank.get(o.id) ?? 0
    if (!byRank.has(r)) byRank.set(r, [])
    byRank.get(r)!.push(o.id)
  }

  const pos = new Map<string, { x: number; y: number }>()
  const isLR = direction === 'LR'
  let maxX = 0
  let maxY = 0

  const ranks = [...byRank.keys()].sort((a, b) => a - b)
  for (const r of ranks) {
    const list = byRank.get(r) ?? []
    list.forEach((id, i) => {
      const along = MARGIN + r * (isLR ? NODE_W + RANK_SEP : NODE_H + RANK_SEP)
      const across = MARGIN + i * (isLR ? NODE_H + NODE_SEP : NODE_W + NODE_SEP)
      const x = isLR ? along : across
      const y = isLR ? across : along
      pos.set(id, { x, y })
      maxX = Math.max(maxX, x + NODE_W)
      maxY = Math.max(maxY, y + NODE_H)
    })
  }

  const opsById = new Map(operations.map((o) => [o.id, o]))
  const nodes: LaidNode[] = operations.map((o) => {
    const p = pos.get(o.id) ?? { x: MARGIN, y: MARGIN }
    return { ...o, x: p.x, y: p.y }
  })

  const edges: LaidEdge[] = deps.map((d) => {
    const s = pos.get(d.dependsOnId)!
    const t = pos.get(d.operationId)!
    const x1 = isLR ? s.x + NODE_W : s.x + NODE_W / 2
    const y1 = isLR ? s.y + NODE_H / 2 : s.y + NODE_H
    const x2 = isLR ? t.x : t.x + NODE_W / 2
    const y2 = isLR ? t.y + NODE_H / 2 : t.y
    const dx = x2 - x1
    const dy = y2 - y1
    const length = Math.max(1, Math.hypot(dx, dy))
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI
    const upstream = opsById.get(d.dependsOnId)
    return {
      id: `${d.dependsOnId}-${d.operationId}`,
      x1,
      y1,
      x2,
      y2,
      quantity: Number(upstream?.quantityComplete ?? 0),
      labelX: (x1 + x2) / 2,
      labelY: (y1 + y2) / 2,
      length,
      angle,
    }
  })

  return {
    nodes,
    edges,
    width: maxX + MARGIN,
    height: maxY + MARGIN,
  }
}

function BarProgress({
  complete,
  rework,
  scrap,
  target,
}: {
  complete: number
  rework: number
  scrap: number
  target: number
}) {
  const max = Math.max(target, 1)
  // Prefer one tick per unit (matches MES JobDag screenshot for small targets).
  const barCount = Math.min(Math.max(max, 1), 48)
  const bars: string[] = []
  let left = barCount
  const push = (n: number, cls: string) => {
    const count = Math.min(left, Math.max(0, Math.round((n / max) * barCount)))
    for (let i = 0; i < count; i++) bars.push(cls)
    left -= count
  }
  push(complete, 'emerald')
  push(rework, 'yellow')
  push(scrap, 'red')
  while (bars.length < barCount) bars.push('idle')

  return (
    <View className='jd__bar'>
      <View className='jd__bar-head'>
        <Text className='jd__bar-val'>{`${complete}/${target}`}</Text>
      </View>
      <View className='jd__bar-row'>
        {bars.map((cls, i) => (
          <View key={i} className={`jd__tick jd__tick--${cls}`} />
        ))}
      </View>
    </View>
  )
}

const LEGEND = [
  { label: 'Done', color: '#22c55e' },
  { label: 'In Progress', color: '#3b82f6' },
  { label: 'Ready', color: '#14b8a6' },
  { label: 'Waiting', color: '#9ca3af' },
  { label: 'Todo', color: '#d1d5db' },
  { label: 'Paused', color: '#f59e0b' },
  { label: 'Canceled', color: '#ef4444' },
]

export default function JobDagPage() {
  const router = useRouter()
  const jobId = router.params.id ?? ''

  const [title, setTitle] = useState('任务')
  const [ops, setOps] = useState<JobDagOp[]>([])
  const [deps, setDeps] = useState<JobDagDep[]>([])
  const [loading, setLoading] = useState(true)
  const [direction, setDirection] = useState<Dir>('LR')
  const [scale, setScale] = useState(1)
  const [legendOpen, setLegendOpen] = useState(false)
  const [areaSize, setAreaSize] = useState({ w: 375, h: 600 })

  useEffect(() => {
    const info = Taro.getSystemInfoSync()
    setAreaSize({
      w: info.windowWidth,
      h: Math.max(320, info.windowHeight - 120),
    })
  }, [])

  useEffect(() => {
    if (!jobId) {
      setLoading(false)
      return
    }
    setLoading(true)
    getJobDag(jobId)
      .then((d) => {
        if (!d.found) {
          Taro.showToast({ title: '任务不存在', icon: 'none' })
          return
        }
        setTitle(d.readableId ?? '任务')
        setOps(d.operations ?? [])
        setDeps(d.dependencies ?? [])
      })
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }, [jobId])

  const layout = useMemo(
    () => computeLayout(ops, deps, direction),
    [ops, deps, direction],
  )

  const rpxRatio = areaSize.w / 750

  const fit = useCallback(() => {
    const pad = 0.1
    const layoutPxW = layout.width * rpxRatio
    const layoutPxH = layout.height * rpxRatio
    const sx = areaSize.w / Math.max(layoutPxW, 1)
    const sy = areaSize.h / Math.max(layoutPxH, 1)
    const next = Math.min(Math.max(Math.min(sx, sy) * (1 - pad), 0.35), 1.6)
    setScale(Number(next.toFixed(2)))
  }, [areaSize, layout.height, layout.width, rpxRatio])

  useEffect(() => {
    if (ops.length) fit()
  }, [ops.length, direction]) // eslint-disable-line react-hooks/exhaustive-deps

  const openOp = (id: string) => {
    Taro.navigateTo({ url: `/pages/operation/index?id=${id}` })
  }

  const canvasW = Math.max(layout.width, areaSize.w / rpxRatio / Math.max(scale, 0.3))
  const canvasH = Math.max(layout.height, areaSize.h / rpxRatio / Math.max(scale, 0.3))

  return (
    <View className='jd'>
      <NavBar title={title} back />

      <View className='jd__toolbar'>
        <View
          className='jd__btn'
          onClick={() => setDirection((d) => (d === 'LR' ? 'TB' : 'LR'))}
        >
          <Text className='jd__btn-text'>
            {direction === 'LR' ? '→ Left to Right' : '↓ Top to Bottom'}
          </Text>
        </View>
        <View className='jd__btn' onClick={fit}>
          <Text className='jd__btn-text'>⛶ Fit</Text>
        </View>
      </View>

      {loading ? (
        <View className='jd__empty'>
          <Text className='jd__empty-text'>加载中…</Text>
        </View>
      ) : ops.length === 0 ? (
        <View className='jd__empty'>
          <Text className='jd__empty-text'>暂无工序</Text>
        </View>
      ) : (
        <View className='jd__stage' style={{ height: `${areaSize.h}px` }}>
          <View className='jd__dots' />
          <MovableArea
            className='jd__area'
            style={{ width: '100%', height: `${areaSize.h}px` }}
          >
            <MovableView
              className='jd__move'
              direction='all'
              scale
              scaleMin={0.35}
              scaleMax={2}
              scaleValue={scale}
              onScale={(e) => setScale(e.detail.scale)}
              style={{
                width: `${canvasW}rpx`,
                height: `${canvasH}rpx`,
              }}
            >
              <View
                className='jd__canvas'
                style={{
                  width: `${layout.width}rpx`,
                  height: `${layout.height}rpx`,
                }}
              >
                {layout.edges.map((e) => (
                  <View key={e.id}>
                    <View
                      className='jd__edge'
                      style={{
                        left: `${e.x1}rpx`,
                        top: `${e.y1}rpx`,
                        width: `${e.length}rpx`,
                        transform: `rotate(${e.angle}deg)`,
                      }}
                    />
                    <View
                      className={`jd__chip ${e.quantity === 0 ? 'jd__chip--dim' : ''}`}
                      style={{
                        left: `${e.labelX}rpx`,
                        top: `${e.labelY}rpx`,
                      }}
                    >
                      <Text className='jd__chip-text'>{e.quantity}</Text>
                    </View>
                  </View>
                ))}

                {layout.nodes.map((n) => (
                  <View
                    key={n.id}
                    className='jd__node'
                    style={{
                      left: `${n.x}rpx`,
                      top: `${n.y}rpx`,
                      borderColor: STATUS_BORDER[n.status] ?? STATUS_BORDER.Todo,
                    }}
                    onClick={() => openOp(n.id)}
                  >
                    {n.itemId ? (
                      <Text className='jd__node-id'>{n.itemId}</Text>
                    ) : null}
                    <View className='jd__node-title-row'>
                      <Text className='jd__node-title'>
                        {n.description || 'Untitled'}
                      </Text>
                      {n.isRework ? (
                        <Text className='jd__rework'>Rework</Text>
                      ) : null}
                    </View>
                    <BarProgress
                      complete={n.quantityComplete}
                      rework={n.quantityReworked}
                      scrap={n.quantityScrapped}
                      target={n.targetQuantity}
                    />
                    {n.quantityScrapped > 0 ? (
                      <Text className='jd__scrap'>
                        {n.quantityScrapped} scrapped
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </MovableView>
          </MovableArea>

          <View className='jd__legend-wrap'>
            <View
              className='jd__legend-btn'
              onClick={() => setLegendOpen((v) => !v)}
            >
              <Text className='jd__legend-btn-text'>ℹ</Text>
            </View>
            {legendOpen ? (
              <View className='jd__legend'>
                <Text className='jd__legend-title'>Operation Status</Text>
                {LEGEND.map((e) => (
                  <View key={e.label} className='jd__legend-row'>
                    <View
                      className='jd__legend-swatch'
                      style={{ borderColor: e.color, background: e.color }}
                    />
                    <Text className='jd__legend-label'>{e.label}</Text>
                  </View>
                ))}
              </View>
            ) : null}
          </View>
        </View>
      )}
    </View>
  )
}
