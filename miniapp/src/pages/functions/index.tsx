import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

type Item = { key: string; icon: string; text: string; badge?: string }
type Group = { title: string; color: string; items: Item[] }

// 完整功能清单 = 网页版侧边栏。最终由 hiddenMesSections + 权限过滤。
const GROUPS: Group[] = [
  {
    title: '工序',
    color: 'blue',
    items: [
      { key: 'pickup', icon: '📥', text: '领活' },
      { key: 'report', icon: '📤', text: '报工' },
      { key: 'assigned', icon: '📋', text: '已分配', badge: '5' },
      { key: 'active', icon: '⏱️', text: '进行中', badge: '1' },
      { key: 'recent', icon: '🕘', text: '最近' },
      { key: 'schedule', icon: '📆', text: '排程' },
    ],
  },
  {
    title: '工单',
    color: 'purple',
    items: [
      { key: 'jobs', icon: '📄', text: '工单' },
      { key: 'masterWorkOrders', icon: '🧵', text: '主工单' },
      { key: 'bundleWorkOrders', icon: '🎫', text: '分包工单' },
    ],
  },
  {
    title: '库存',
    color: 'green',
    items: [
      { key: 'picking', icon: '📦', text: '拣货' },
      { key: 'addInventory', icon: '➕', text: '添加库存' },
      { key: 'removeInventory', icon: '➖', text: '移除库存' },
    ],
  },
  {
    title: '薪资 · 审批',
    color: 'orange',
    items: [
      { key: 'salary', icon: '💰', text: '我的薪水' },
      { key: 'productionReports', icon: '✅', text: '报工审批' },
    ],
  },
  {
    title: '工具',
    color: 'gray',
    items: [
      { key: 'maintenance', icon: '🛠️', text: '维护' },
      { key: 'suggestion', icon: '💡', text: '建议' },
      { key: 'endShift', icon: '🚪', text: '结束班次' },
    ],
  },
]

export default function Functions() {
  const FN_ROUTE: Record<string, string> = {
    jobs: '/pages/work-orders/index?type=jobs',
    masterWorkOrders: '/pages/work-orders/index?type=master',
    bundleWorkOrders: '/pages/work-orders/index?type=bundle',
    salary: '/pages/salary/index',
    picking: '/pages/picking/index',
    addInventory: '/pages/inventory/adjust?mode=add',
    removeInventory: '/pages/inventory/adjust?mode=remove',
  }

  const onItem = (key: string) => {
    const url = FN_ROUTE[key]
    if (url) {
      Taro.navigateTo({ url })
      return
    }
    Taro.showToast({ title: `TODO: ${key}`, icon: 'none' })
  }

  return (
    <View className='fn'>
      {GROUPS.map((g) => (
        <View key={g.title} className='fn__group'>
          <Text className='fn__title'>{g.title}</Text>
          <View className='fn__grid'>
            {g.items.map((it) => (
              <View key={it.key} className='fn__cell' hoverClass='fn__cell--hover' onClick={() => onItem(it.key)}>
                <View className={`fn__ic fn__ic--${g.color}`}>
                  <Text className='fn__ic-text'>{it.icon}</Text>
                  {it.badge ? (
                    <View className='fn__badge'>
                      <Text className='fn__badge-text'>{it.badge}</Text>
                    </View>
                  ) : null}
                </View>
                <Text className='fn__label'>{it.text}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}
