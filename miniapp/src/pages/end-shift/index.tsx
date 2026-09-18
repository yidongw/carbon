import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import { endShift, getActiveOpsForEndShift } from '../../services/tools'
import type { ActiveOpRow } from '../../services/tools'
import './index.scss'

export default function EndShiftPage() {
  const [rows, setRows] = useState<ActiveOpRow[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getActiveOpsForEndShift()
      .then((d) => setRows(d.rows ?? []))
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const onConfirm = async () => {
    if (busy) return
    setBusy(true)
    try {
      const tz =
        (typeof Intl !== 'undefined' &&
          Intl.DateTimeFormat().resolvedOptions().timeZone) ||
        'Asia/Shanghai'
      const r = await endShift(tz)
      if (r.success) {
        Taro.showToast({ title: r.message || '已结束工序', icon: 'success' })
        setTimeout(() => Taro.navigateBack(), 600)
      } else {
        Taro.showToast({ title: r.message || '操作失败', icon: 'none' })
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '操作失败', icon: 'none' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <View className='es'>
      <NavBar title='结束班次' back />

      <View className='es__card'>
        <Text className='es__title'>结束工序</Text>
        <Text className='es__desc'>
          确定要结束所有生产事件吗？这将结束所有进行中的工序，但不会完成或完结它们。
        </Text>

        {loading ? (
          <View className='es__empty'>
            <Text className='es__empty-t'>加载中…</Text>
          </View>
        ) : rows.length === 0 ? (
          <View className='es__empty'>
            <Text className='es__empty-t'>暂无进行中工序</Text>
          </View>
        ) : (
          <View className='es__list'>
            {rows.map((o) => (
              <View key={o.id} className='es__row'>
                <View className='es__mid'>
                  <Text className='es__job'>{o.jobReadableId || '—'}</Text>
                  <Text className='es__op'>{o.description || '—'}</Text>
                </View>
                <Text className='es__item'>{o.itemReadableId || ''}</Text>
              </View>
            ))}
          </View>
        )}

        <View className='es__actions'>
          <View className='es__btn es__btn--ghost' onClick={() => Taro.navigateBack()}>
            <Text className='es__btn-t'>取消</Text>
          </View>
          <View
            className={`es__btn es__btn--danger ${busy ? 'es__btn--disabled' : ''}`}
            onClick={onConfirm}
          >
            <Text className='es__btn-t es__btn-t--w'>
              {busy ? '处理中…' : '结束工序'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
