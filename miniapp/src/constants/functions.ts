// 工作台功能宫格 = MES 网页侧边栏里"不与别处重复"的部分,按模块分组。
// 去重:领活/报工 → 扫码键;已分配/进行中/最近 → 底部「任务」tab;我的工资/报工审批/排程 → 「我的」页。
// 方案 B:分组卡片(无横向切换,一屏看全),每个模块一张卡,内部线性图标宫格。
export type FnColor = 'purple' | 'green' | 'orange'
export type FnItem = { key: string; text: string; svg: string }
export type FnGroup = { key: string; title: string; color: FnColor; items: FnItem[] }

// 每种模块色:图标描边色(底色由 scss 的 ws__fn-ic--<color> 提供)。
export const FN_STROKE: Record<FnColor, string> = {
  purple: '#7c3aed',
  green: '#16a34a',
  orange: '#ea8a12',
}

// 把 24x24 线性图标内容包成 data-URI(小程序不支持内联 <svg>,只能用 Image)。
export function fnIcon(svg: string, color: string): string {
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`,
  )}`
}

export const FN_GROUPS: FnGroup[] = [
  {
    key: 'job',
    title: '工单',
    color: 'purple',
    items: [
      { key: 'jobs', text: '任务', svg: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4V8"/>' },
      { key: 'masterWorkOrders', text: '主工单', svg: '<path d="M12 3 3 8l9 5 9-5-9-5z"/><path d="M3 13l9 5 9-5"/>' },
      { key: 'bundleWorkOrders', text: '分包工单', svg: '<path d="M20 12l-8 8-9-9V4h7l10 8z"/><circle cx="7.5" cy="7.5" r="1.3"/>' },
    ],
  },
  {
    key: 'inv',
    title: '库存',
    color: 'green',
    items: [
      { key: 'picking', text: '拣货', svg: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>' },
      { key: 'addInventory', text: '添加库存', svg: '<path d="M12 6v12M6 12h12"/>' },
      { key: 'removeInventory', text: '移除库存', svg: '<path d="M6 12h12"/>' },
    ],
  },
  {
    key: 'tool',
    title: '工具',
    color: 'orange',
    items: [
      { key: 'maintenance', text: '维护', svg: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8 6.2 21l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.7 2.7-2.5-2.5 2.2-2.2z"/>' },
      { key: 'suggestion', text: '建议', svg: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.3 1 2.1h6c0-.8.4-1.5 1-2.1A6 6 0 0 0 12 3z"/>' },
      { key: 'endShift', text: '结束班次', svg: '<path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M10 17l5-5-5-5M15 12H3"/>' },
    ],
  },
]
