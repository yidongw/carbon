import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getOperation, reportQuantity } from '../../services/operation'
import type { OperationDetail } from '../../services/operation'
import './index.scss'

// 工序状态本地化 + 配色。
const STATUS: Record<string, { label: string; cls: string }> = {
  Todo: { label: '待开始', cls: 'blue' },
  Ready: { label: '待开始', cls: 'blue' },
  Waiting: { label: '等待', cls: 'gray' },
  'In Progress': { label: '进行中', cls: 'blue' },
  Paused: { label: '已暂停', cls: 'orange' },
  Done: { label: '已完成', cls: 'green' },
  Canceled: { label: '已取消', cls: 'red' },
}
const statusLabel = (s: string) => STATUS[s]?.label ?? s
const statusCls = (s: string) => STATUS[s]?.cls ?? 'gray'

export default function Operation() {
  const router = useRouter()
  const id = (router.params.id as string) || ''

  const [d, setD] = useState<OperationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  // 报工弹层
  const [sheet, setSheet] = useState(false)
  const [finished, setFinished] = useState(0)
  const [rework, setRework] = useState(0)
  const [scrap, setScrap] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    if (!id) return
    getOperation(id)
      .then((r) => setD(r))
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }

  useDidShow(load)

  const openSheet = () => {
    const remain = d ? Math.max(0, d.target - d.completed - d.scrap) : 0
    setFinished(remain)
    setRework(0)
    setScrap(0)
    setSheet(true)
  }

  const submit = async () => {
    if (!d) return
    if (finished + rework + scrap <= 0) {
      Taro.showToast({ title: '请输入大于 0 的数量', icon: 'none' })
      return
    }
    setSubmitting(true)
    try {
      const res = await reportQuantity({
        jobOperationId: d.id,
        employeeId: d.assigneeId || undefined,
        finished,
        rework,
        scrap,
      })
      if (res.success) {
        setSheet(false)
        Taro.showToast({ title: '已提交,待审批', icon: 'success' })
        setLoading(true)
        load()
      } else {
        Taro.showToast({ title: res.message || '提交失败', icon: 'none' })
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '提交失败', icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  const pct =
    d && d.target > 0 ? Math.min(100, Math.round((d.completed / d.target) * 100)) : 0

  const title = d?.readableId || (loading ? '加载中…' : '工序')

  return (
    <View className='op'>
      <NavBar title={title} back />

      {d && d.found ? (
        <View className='op__body'>
          {/* 工序卡 */}
          <View className='op__card'>
            <View className='op__card-head'>
              <Text className='op__op-name'>{d.description || '工序'}</Text>
              <View className={`op__badge op__badge--${statusCls(d.status)}`}>
                <Text className='op__badge-text'>{statusLabel(d.status)}</Text>
              </View>
            </View>
            <Text className='op__op-item'>
              {[d.itemReadableId, d.variant || d.itemDescription]
                .filter(Boolean)
                .join(' / ') || '—'}
            </Text>
            {d.workCenter ? (
              <View className='op__wc'>
                <Text className='op__wc-text'>工作中心 · {d.workCenter}</Text>
              </View>
            ) : null}
          </View>

          {/* 统计卡 */}
          <View className='op__grid'>
            <View className='op__stat'>
              <Text className='op__stat-label'>负责人</Text>
              <Text className='op__stat-name'>{d.assignee || '未分配'}</Text>
            </View>
            <View className='op__stat'>
              <Text className='op__stat-label'>已完成</Text>
              <Text className='op__stat-value'>
                {d.completed} <Text className='op__stat-sub'>/ {d.target}</Text>
              </Text>
            </View>
            <View className='op__stat'>
              <Text className='op__stat-label'>返工</Text>
              <Text className='op__stat-value'>{d.rework}</Text>
            </View>
            <View className='op__stat'>
              <Text className='op__stat-label'>已报废</Text>
              <Text className='op__stat-value'>{d.scrap}</Text>
            </View>
            <View className='op__stat'>
              <Text className='op__stat-label'>待审批</Text>
              <Text className='op__stat-value'>{d.pending}</Text>
            </View>
            <View className='op__stat'>
              <Text className='op__stat-label'>截止日期</Text>
              <Text className='op__stat-name'>
                {d.dueDate ? d.dueDate.slice(0, 10) : '无截止'}
              </Text>
            </View>
          </View>

          {/* 生产日志 */}
          <Text className='op__sec'>生产日志</Text>
          <View className='op__log'>
            <View className='op__log-meta'>
              <Text className='op__log-k'>累计完成</Text>
              <Text className='op__log-v'>
                {d.completed} / {d.target} 件
              </Text>
            </View>
            <View className='op__prog'>
              <View className='op__prog-bar' style={{ width: `${pct}%` }} />
            </View>
          </View>
        </View>
      ) : (
        <View className='op__empty'>
          <Text className='op__empty-text'>
            {loading ? '加载中…' : '工序不存在或无权限'}
          </Text>
        </View>
      )}

      {/* 底部操作栏 */}
      {d && d.found && d.status !== 'Done' && d.status !== 'Canceled' ? (
        <View className='op__bar'>
          <View className='op__report' hoverClass='op__report--hover' onClick={openSheet}>
            <Text className='op__report-text'>记录数量</Text>
          </View>
        </View>
      ) : null}

      {/* 报工弹层 */}
      {sheet ? (
        <View className='op__sheet-wrap'>
          <View className='op__mask' onClick={() => setSheet(false)} />
          <View className='op__sheet'>
            <View className='op__sheet-head'>
              <Text className='op__sheet-title'>记录数量</Text>
              <Text className='op__sheet-x' onClick={() => setSheet(false)}>
                ✕
              </Text>
            </View>
            <Text className='op__sheet-sub'>
              {[d?.description, d?.variant, `目标 ${d?.target ?? 0}`]
                .filter(Boolean)
                .join(' · ')}
            </Text>

            <Stepper label='完成' hint='合格产出' cls='green' value={finished} onChange={setFinished} />
            <Stepper label='返工' hint='需返修' cls='amber' value={rework} onChange={setRework} />
            <Stepper label='报废' hint='报废件' cls='red' value={scrap} onChange={setScrap} />

            <View className='op__emp'>
              <Text className='op__emp-k'>报工人</Text>
              <Text className='op__emp-v'>{d?.assignee || '我'}</Text>
            </View>

            <View
              className={`op__submit ${submitting ? 'op__submit--disabled' : ''}`}
              onClick={submitting ? undefined : submit}
            >
              <Text className='op__submit-text'>{submitting ? '提交中…' : '提交报工'}</Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}

function Stepper({
  label,
  hint,
  cls,
  value,
  onChange,
}: {
  label: string
  hint: string
  cls: string
  value: number
  onChange: (n: number) => void
}) {
  const dec = () => onChange(Math.max(0, value - 1))
  const inc = () => onChange(value + 1)
  return (
    <View className='op__stp'>
      <View className='op__stp-left'>
        <View className={`op__stp-dot op__stp-dot--${cls}`} />
        <View>
          <Text className='op__stp-name'>{label}</Text>
          <Text className='op__stp-hint'>{hint}</Text>
        </View>
      </View>
      <View className='op__stepper'>
        <Text className='op__stp-op' onClick={dec}>
          −
        </Text>
        <Input
          className='op__stp-num'
          type='number'
          value={String(value)}
          onInput={(e) => {
            const n = Math.floor(Number(e.detail.value))
            onChange(Number.isFinite(n) && n > 0 ? n : 0)
          }}
        />
        <Text className='op__stp-op' onClick={inc}>
          +
        </Text>
      </View>
    </View>
  )
}
