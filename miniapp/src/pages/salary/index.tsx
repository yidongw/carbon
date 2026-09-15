import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { getSalary } from '../../services/salary'
import type { Salary } from '../../services/salary'
import NavBar from '../../components/NavBar'
import './index.scss'

const money = (n: number) => `¥${(n ?? 0).toFixed(2)}`

export default function SalaryPage() {
  const [data, setData] = useState<Salary | null>(null)
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    getSalary()
      .then(setData)
      .catch((e: any) => {
        if (e?.statusCode !== 401) {
          Taro.showToast({ title: e?.message || '加载失败', icon: 'none' })
        }
      })
      .finally(() => setLoading(false))
  })

  const comps = data?.completions ?? []

  return (
    <View className='sal'>
      <NavBar title='我的工资' back />

      {/* 汇总卡 */}
      <View className='sal__card'>
        <Text className='sal__month'>{data?.month || ''}</Text>
        <Text className='sal__earned'>{money(data?.totalEarned ?? 0)}</Text>
        <Text className='sal__earned-label'>本月计件已赚</Text>
        <View className='sal__split'>
          <View className='sal__split-item'>
            <Text className='sal__split-num'>{money(data?.totalPaid ?? 0)}</Text>
            <Text className='sal__split-label'>已发</Text>
          </View>
          <View className='sal__split-divider' />
          <View className='sal__split-item'>
            <Text className='sal__split-num'>{money(data?.amountOwed ?? 0)}</Text>
            <Text className='sal__split-label'>待发</Text>
          </View>
        </View>
      </View>

      <Text className='sal__sec'>本月计件明细</Text>
      {comps.length > 0 ? (
        <View className='sal__list'>
          {comps.map((c) => (
            <View key={c.id} className='sal__row'>
              <View className='sal__row-mid'>
                <Text className='sal__row-title'>{c.process}</Text>
                <Text className='sal__row-sub'>
                  {c.job ? `${c.job} · ` : ''}
                  {c.quantity} 件 × ¥{(c.unitCost ?? 0).toFixed(2)}
                </Text>
              </View>
              <Text className='sal__row-earned'>+{money(c.earned)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View className='sal__empty'>
          <Text className='sal__empty-text'>
            {loading ? '加载中…' : '本月暂无计件记录'}
          </Text>
        </View>
      )}
    </View>
  )
}
