// 工序状态(jobOperationStatus)本地化 + 配色,与 MES 网页「分配给我」措辞一致。
export const OP_STATUS: Record<string, { label: string; cls: string }> = {
  Todo: { label: '待处理', cls: 'gray' },
  Ready: { label: '就绪', cls: 'blue' },
  'In Progress': { label: '进行中', cls: 'green' },
  Paused: { label: '已暂停', cls: 'orange' },
  Waiting: { label: '等待中', cls: 'yellow' },
  Done: { label: '已完成', cls: 'green' },
  Canceled: { label: '已取消', cls: 'red' },
}

export const opStatusLabel = (s?: string | null) =>
  (s && OP_STATUS[s]?.label) || s || ''

export const opStatusCls = (s?: string | null) => (s && OP_STATUS[s]?.cls) || 'gray'
