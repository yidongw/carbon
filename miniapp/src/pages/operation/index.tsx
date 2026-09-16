import { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getOperation, reportQuantity, operationAction } from '../../services/operation'
import type { OperationDetail, OperationActionType } from '../../services/operation'
import { opStatusCls as statusCls, opStatusLabel as statusLabel } from '../../utils/opStatus'
import './index.scss'

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
  // 更多操作弹层 + 动作进行中
  const [more, setMore] = useState(false)
  const [acting, setActing] = useState(false)

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

  const soon = () => Taro.showToast({ title: '功能开发中', icon: 'none' })

  const runAction = async (action: OperationActionType, confirm?: string) => {
    if (!d || acting) return
    if (confirm) {
      const r = await Taro.showModal({ title: '确认', content: confirm })
      if (!r.confirm) return
    }
    setActing(true)
    try {
      const res = await operationAction(d.id, action)
      if (res.success) {
        setMore(false)
        Taro.showToast({ title: '操作成功', icon: 'success' })
        setLoading(true)
        load()
      } else {
        Taro.showToast({ title: res.message || '操作失败', icon: 'none' })
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '操作失败', icon: 'none' })
    } finally {
      setActing(false)
    }
  }

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
              <View className='op__stat-head'>
                <Text className='op__stat-label'>待审批</Text>
                {d.pending > 0 ? (
                  <Text className='op__stat-link' onClick={soon}>审核 ›</Text>
                ) : null}
              </View>
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

      {/* 底部操作栏(随状态变化) */}
      {d && d.found && d.status !== 'Done' && d.status !== 'Canceled' ? (
        <View className='op__bar'>
          <View
            className={`op__act ${d.active ? 'op__act--pause' : 'op__act--start'}`}
            onClick={() => runAction(d.active ? 'pause' : 'start')}
          >
            <Text className='op__act-text'>
              {d.active ? '暂停' : d.status === 'Paused' ? '继续' : '开始'}
            </Text>
          </View>
          <View className='op__act op__act--report' onClick={openSheet}>
            <Text className='op__act-text'>记录数量</Text>
          </View>
          <View className='op__act op__act--more' onClick={() => setMore(true)}>
            <Text className='op__act-more'>⋯</Text>
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

      {/* 更多操作弹层 */}
      {more && d ? (
        <View className='op__sheet-wrap'>
          <View className='op__mask' onClick={() => setMore(false)} />
          <View className='op__sheet'>
            <View className='op__sheet-head'>
              <Text className='op__sheet-title'>更多操作</Text>
              <Text className='op__sheet-x' onClick={() => setMore(false)}>✕</Text>
            </View>
            <MoreItem
              cls='green'
              name='完成工序'
              hint='标记该工序为已完成'
              onClick={() => runAction('finish', '确认完成该工序?')}
            />
            {!d.isMine ? (
              <MoreItem
                cls='blue'
                name='领取 / 接手工序'
                hint='把该工序分配给自己'
                onClick={() => runAction('pickup')}
              />
            ) : null}
            <MoreItem cls='amber' name='返工' hint='把数量返工到指定工序' onClick={soon} />
            <MoreItem cls='red' name='报废' hint='报废并选择原因' onClick={soon} />
            <MoreItem cls='purple' name='维护' hint='报修工作中心' onClick={soon} />
            <MoreItem cls='gray' name='质量问题' hint='提交质量异常' onClick={soon} />
          </View>
        </View>
      ) : null}
    </View>
  )
}

function MoreItem({
  cls,
  name,
  hint,
  onClick,
}: {
  cls: string
  name: string
  hint: string
  onClick: () => void
}) {
  return (
    <View className='op__mi' hoverClass='op__mi--hover' onClick={onClick}>
      <View className={`op__mi-ic op__mi-ic--${cls}`} />
      <View className='op__mi-mid'>
        <Text className='op__mi-name'>{name}</Text>
        <Text className='op__mi-hint'>{hint}</Text>
      </View>
      <Text className='op__mi-arrow'>›</Text>
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
