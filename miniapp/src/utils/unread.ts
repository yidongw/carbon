import Taro from '@tarojs/taro'

// 消息「已读」状态本地持久化(后端暂无已读概念):
// - READ_KEY:已读消息 key 的集合({ key: true })
// - COUNT_KEY:未读数缓存,供底部 TabBar 徽标同步读取
const READ_KEY = 'carbon_read_msgs'
const COUNT_KEY = 'carbon_unread_count'

export function getReadSet(): Record<string, true> {
  return (Taro.getStorageSync(READ_KEY) as Record<string, true>) || {}
}

export function isRead(key: string): boolean {
  return !!getReadSet()[key]
}

export function markRead(key: string) {
  const s = getReadSet()
  if (!s[key]) {
    s[key] = true
    Taro.setStorageSync(READ_KEY, s)
  }
}

export function computeUnread(keys: string[]): number {
  const s = getReadSet()
  return keys.filter((k) => !s[k]).length
}

export function setUnreadCount(n: number) {
  Taro.setStorageSync(COUNT_KEY, n)
}

export function getUnreadCount(): number {
  return (Taro.getStorageSync(COUNT_KEY) as number) || 0
}
