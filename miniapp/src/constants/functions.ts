// 工作台功能宫格 = MES 网页侧边栏里"不与别处重复"的部分,按模块分组。
// 去重:领活/报工 → 扫码键;已分配/进行中/最近 → 底部「任务」tab;我的工资/报工审批/排程 → 「我的」页。
export type FnItem = { key: string; icon: string; text: string }
export type FnGroup = { key: string; title: string; color: string; items: FnItem[] }

export const FN_GROUPS: FnGroup[] = [
  {
    key: 'job',
    title: '工单',
    color: 'purple',
    items: [
      { key: 'jobs', icon: '📄', text: '工单' },
      { key: 'masterWorkOrders', icon: '🧵', text: '主工单' },
      { key: 'bundleWorkOrders', icon: '🎫', text: '分包工单' },
    ],
  },
  {
    key: 'inv',
    title: '库存',
    color: 'green',
    items: [
      { key: 'picking', icon: '📦', text: '拣货' },
      { key: 'addInventory', icon: '➕', text: '添加库存' },
      { key: 'removeInventory', icon: '➖', text: '移除库存' },
    ],
  },
  {
    key: 'tool',
    title: '工具',
    color: 'gray',
    items: [
      { key: 'maintenance', icon: '🛠️', text: '维护' },
      { key: 'suggestion', icon: '💡', text: '建议' },
      { key: 'endShift', icon: '🚪', text: '结束班次' },
    ],
  },
]
