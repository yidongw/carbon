import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { getPendingReports, approveReport, disapproveReport } from '../../services/approvals'
import type { PendingReport } from '../../services/approvals'
import './index.scss'

const fmtDate = (iso: string) => (iso ? iso.slice(5, 16).replace('T', ' ') : '')

export default function Approvals() {
  const [rows, setRows] = useState<PendingReport[]>([])
  const [canApprove, setCanApprove] = useState(true)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  const load = () => {
    getPendingReports()
      .then((r) => {
        setRows(r.rows)
        setCanApprove(r.canApprove)
      })
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }

  useDidShow(load)

  const approve = async (r: PendingReport) => {
    if (busy) return
    setBusy(true)
    try {
      const res = await approveReport(r.id)
      if (res.success) {
        Taro.showToast({ title: '已通过', icon: 'success' })
        load()
      } else {
        Taro.showToast({ title: res.message || '操作失败', icon: 'none' })
      }
    } finally {
      setBusy(false)
    }
  }

  const disapprove = async (r: PendingReport) => {
    if (busy) return
    const c = await Taro.showModal({ title: '驳回', content: '确认驳回该条报工?' })
    if (!c.confirm) return
    setBusy(true)
    try {
      const res = await disapproveReport({
        id: r.id,
        jobOperationId: r.jobOperationId,
        reportId: r.reportId,
        employeeId: r.employeeId,
        completed: 0,
        rework: r.rework,
        scrap: r.scrap,
      })
      if (res.success) {
        Taro.showToast({ title: '已驳回', icon: 'success' })
        load()
      } else {
        Taro.showToast({ title: res.message || '操作失败', icon: 'none' })
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <View className='ap'>
      <NavBar title='报工审批' back />

      {!canApprove ? (
        <View className='ap__note'>
          <Text className='ap__note-text'>你的账号仅可查看,审批需经理权限</Text>
        </View>
      ) : null}

      {rows.length > 0 ? (
        <View className='ap__list'>
          {rows.map((r) => (
            <View key={r.id} className='ap__card'>
              <View className='ap__head'>
                <Text className='ap__title'>{r.process || '工序'}</Text>
                <Text className='ap__date'>{fmtDate(r.date)}</Text>
              </View>
              <Text className='ap__sub'>
                {[r.job, r.item].filter(Boolean).join(' · ') || '—'}
              </Text>
              <View className='ap__metas'>
                <View className='ap__meta'>
                  <Text className='ap__meta-l'>报工人</Text>
                  <Text className='ap__meta-v'>{r.employee || '—'}</Text>
                </View>
                <View className='ap__meta'>
                  <Text className='ap__meta-l'>合格</Text>
                  <Text className='ap__meta-v ap__meta-v--green'>{r.quantity}</Text>
                </View>
                <View className='ap__meta'>
                  <Text className='ap__meta-l'>返工</Text>
                  <Text className='ap__meta-v ap__meta-v--amber'>{r.rework}</Text>
                </View>
                <View className='ap__meta'>
                  <Text className='ap__meta-l'>报废</Text>
                  <Text className='ap__meta-v ap__meta-v--red'>{r.scrap}</Text>
                </View>
              </View>
              {canApprove ? (
                <View className='ap__acts'>
                  <View className='ap__btn ap__btn--reject' onClick={() => disapprove(r)}>
                    <Text className='ap__btn-text ap__btn-text--reject'>驳回</Text>
                  </View>
                  <View className='ap__btn ap__btn--pass' onClick={() => approve(r)}>
                    <Text className='ap__btn-text ap__btn-text--pass'>通过</Text>
                  </View>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : (
        <View className='ap__empty'>
          <Text className='ap__empty-text'>{loading ? '加载中…' : '暂无待审批'}</Text>
        </View>
      )}
    </View>
  )
}
