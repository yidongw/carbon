// 功能清单 = MES 网页侧边栏,按模块分组。工作台首页的横向模块 tab 与「全部功能」页共用。
// badge 数字由页面用真实数据(已分配/进行中数量)注入,常量里不写死。
export type FnItem = { key: string; icon: string; text: string }
export type FnGroup = { key: string; title: string; color: string; items: FnItem[] }

export const FN_GROUPS: FnGroup[] = [
  {
    key: 'op',
    title: '工序',
    color: 'blue',
    items: [
      { key: 'pickup', icon: '📥', text: '领活' },
      { key: 'report', icon: '📤', text: '报工' },
      { key: 'assigned', icon: '📋', text: '已分配' },
      { key: 'active', icon: '⏱️', text: '进行中' },
      { key: 'recent', icon: '🕘', text: '最近' },
      { key: 'schedule', icon: '📆', text: '排程' },
    ],
  },
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
    key: 'pay',
    title: '薪资·审批',
    color: 'orange',
    items: [
      { key: 'salary', icon: '💰', text: '我的工资' },
      { key: 'productionReports', icon: '✅', text: '报工审批' },
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
