import { useEffect, useRef, useState } from 'react'
import { View, Text, Input, Image } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import NavBar from '../../components/NavBar'
import {
  getOperation,
  reportQuantity,
  operationAction,
  getScrapReasons,
  getReworkTargets,
  searchItems,
  fileDownloadUrl,
  fileAuthHeader,
} from '../../services/operation'
import type {
  OperationDetail,
  OperationActionType,
  ScrapReason,
  ReworkTarget,
  OpMaterial,
  OpFile,
  ItemHit,
} from '../../services/operation'
import { opStatusCls as statusCls, opStatusLabel as statusLabel } from '../../utils/opStatus'
import './index.scss'

// 进度环(灰色轨道 + 蓝色进度弧),按百分比生成 data-URI SVG。
const RING_C = 402 // 2πr, r=64
const ringSvg = (pct: number) => {
  const off = Math.max(0, RING_C * (1 - Math.min(100, Math.max(0, pct)) / 100))
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><circle cx="75" cy="75" r="64" fill="none" stroke="#eef0f4" stroke-width="14"/><circle cx="75" cy="75" r="64" fill="none" stroke="#2563eb" stroke-width="14" stroke-linecap="round" stroke-dasharray="${RING_C}" stroke-dashoffset="${off}" transform="rotate(-90 75 75)"/></svg>`,
  )}`
}

// 毫秒 → 人类可读工时。
const fmtMs = (ms: number) => {
  if (!ms || ms <= 0) return '0'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}秒`
  const m = Math.floor(s / 60)
  const ss = s % 60
  if (m < 60) return ss ? `${m}分${ss}秒` : `${m}分`
  const h = Math.floor(m / 60)
  const mm = m % 60
  return mm ? `${h}时${mm}分` : `${h}时`
}

// 报工日期 ISO → "MM-DD HH:mm"。
const fmtDate = (iso: string) => (iso ? iso.slice(5, 16).replace('T', ' ') : '')

// 报工类型 → 中文 + 色板 key。
const LOG_META: Record<string, { label: string; cls: string }> = {
  Production: { label: '合格', cls: 'green' },
  Rework: { label: '返工', cls: 'amber' },
  Scrap: { label: '报废', cls: 'red' },
}

function openOpFile(file: OpFile) {
  const url = fileDownloadUrl(file.path)
  Taro.showLoading({ title: '打开中…', mask: true })
  Taro.downloadFile({
    url,
    header: fileAuthHeader(),
    success: (res) => {
      Taro.hideLoading()
      if (res.statusCode !== 200 || !res.tempFilePath) {
        Taro.showToast({ title: '下载失败', icon: 'none' })
        return
      }
      if (file.type === 'Image') {
        Taro.previewImage({ urls: [res.tempFilePath], current: res.tempFilePath })
        return
      }
      Taro.openDocument({
        filePath: res.tempFilePath,
        showMenu: true,
        fail: () => {
          Taro.showToast({ title: '无法预览，已下载到临时文件', icon: 'none' })
        },
      })
    },
    fail: () => {
      Taro.hideLoading()
      Taro.showToast({ title: '下载失败', icon: 'none' })
    },
  })
}

function onFileMore(file: OpFile) {
  Taro.showActionSheet({
    itemList: ['下载 / 打开'],
    success: (res) => {
      if (res.tapIndex === 0) openOpFile(file)
    },
  }).catch(() => {
    /* 用户取消 */
  })
}

export default function Operation() {
  const router = useRouter()
  const id = (router.params.id as string) || ''
  // 扫码进来时带的意图:report=自动打开报工弹层,pickup=自动领取/接手。
  const auto = (router.params.auto as string) || ''
  const autoHandled = useRef(false)

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

  // 报废弹层
  const [scrapOpen, setScrapOpen] = useState(false)
  const [scrapQty, setScrapQty] = useState(0)
  const [scrapReasons, setScrapReasons] = useState<ScrapReason[]>([])
  const [scrapReason, setScrapReason] = useState<ScrapReason | null>(null)

  // 返工弹层
  const [reworkOpen, setReworkOpen] = useState(false)
  const [reworkQty, setReworkQty] = useState(0)
  const [reworkTargets, setReworkTargets] = useState<ReworkTarget[]>([])
  const [reworkTarget, setReworkTarget] = useState<ReworkTarget | null>(null)
  const [reworkReason, setReworkReason] = useState('')

  // 发放材料弹层
  const [issueOpen, setIssueOpen] = useState(false)
  const [issueMat, setIssueMat] = useState<OpMaterial | null>(null)
  const [issueQty, setIssueQty] = useState(0)
  const [issueQuery, setIssueQuery] = useState('')
  const [issueHits, setIssueHits] = useState<ItemHit[]>([])
  const [issueSearching, setIssueSearching] = useState(false)

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

  // 报废
  const openScrap = () => {
    setScrapQty(0)
    setScrapReason(null)
    setScrapOpen(true)
    setMore(false)
    getScrapReasons()
      .then((r) => setScrapReasons(r.rows))
      .catch(() => {})
  }
  const chooseScrapReason = () => {
    if (!scrapReasons.length) {
      Taro.showToast({ title: '暂无报废原因', icon: 'none' })
      return
    }
    Taro.showActionSheet({ itemList: scrapReasons.map((x) => x.name) })
      .then((r) => setScrapReason(scrapReasons[r.tapIndex] || null))
      .catch(() => {})
  }
  const submitScrap = async () => {
    if (!d || acting) return
    if (scrapQty <= 0) {
      Taro.showToast({ title: '请输入报废数量', icon: 'none' })
      return
    }
    if (!scrapReason) {
      Taro.showToast({ title: '请选择报废原因', icon: 'none' })
      return
    }
    setActing(true)
    try {
      const res = await operationAction(d.id, 'scrap', {
        quantity: scrapQty,
        scrapReasonId: scrapReason.id,
      })
      if (res.success) {
        setScrapOpen(false)
        Taro.showToast({ title: '已报废', icon: 'success' })
        setLoading(true)
        load()
      } else {
        Taro.showToast({ title: res.message || '报废失败', icon: 'none' })
      }
    } finally {
      setActing(false)
    }
  }

  // 返工
  const openRework = () => {
    if (!d) return
    setReworkQty(0)
    setReworkTarget(null)
    setReworkReason('')
    setReworkTargets([])
    setReworkOpen(true)
    setMore(false)
    getReworkTargets(d.id)
      .then((r) => setReworkTargets(r.rows))
      .catch(() => {})
  }
  const chooseReworkTarget = () => {
    if (!reworkTargets.length) {
      Taro.showToast({ title: '无可返回的上游工序', icon: 'none' })
      return
    }
    Taro.showActionSheet({
      itemList: reworkTargets.map((t) => t.description || t.item || '工序'),
    })
      .then((r) => setReworkTarget(reworkTargets[r.tapIndex] || null))
      .catch(() => {})
  }
  const submitRework = async () => {
    if (!d || acting) return
    if (reworkQty <= 0) {
      Taro.showToast({ title: '请输入返工数量', icon: 'none' })
      return
    }
    if (!reworkTarget) {
      Taro.showToast({ title: '请选择目标工序', icon: 'none' })
      return
    }
    if (!reworkReason.trim()) {
      Taro.showToast({ title: '请填写返工原因', icon: 'none' })
      return
    }
    setActing(true)
    try {
      const res = await operationAction(d.id, 'rework', {
        quantity: reworkQty,
        targetJobOperationId: reworkTarget.id,
        reason: reworkReason.trim(),
      })
      if (res.success) {
        setReworkOpen(false)
        Taro.showToast({ title: '已触发返工', icon: 'success' })
        setLoading(true)
        load()
      } else {
        Taro.showToast({ title: res.message || '返工失败', icon: 'none' })
      }
    } finally {
      setActing(false)
    }
  }

  // 返工「标记已修」(经理)
  const doMarkFixed = async () => {
    if (!d) return
    setMore(false)
    const r = await Taro.showModal({
      title: '标记已修',
      editable: true,
      placeholderText: `数量(可返工 ${d.rework})`,
    })
    if (!r.confirm) return
    const q = Math.floor(Number(r.content))
    if (!Number.isFinite(q) || q <= 0) {
      Taro.showToast({ title: '请输入数量', icon: 'none' })
      return
    }
    const res = await operationAction(d.id, 'markFixed', { quantity: q })
    if (res.success) {
      Taro.showToast({ title: '已标记已修', icon: 'success' })
      setLoading(true)
      load()
    } else {
      Taro.showToast({ title: res.message || '标记失败', icon: 'none' })
    }
  }

  const goApprovals = () => Taro.navigateTo({ url: '/pages/approvals/index' })

  // 发放材料（对齐 MES 网页:BOM 可为空,仍可选手动物料发放）
  const openIssue = (m: OpMaterial) => {
    if (!m?.itemId) {
      Taro.showToast({ title: '材料缺少物料信息，无法发放', icon: 'none' })
      console.warn('[issue] material missing itemId', m)
      return
    }
    setIssueMat(m)
    setIssueQty(Math.max(1, Math.round(m.toIssue || 1)))
    setIssueQuery('')
    setIssueHits([])
    setIssueOpen(true)
  }
  const loadIssueItems = async (q = '') => {
    setIssueSearching(true)
    try {
      const res = await searchItems(q)
      setIssueHits(res.rows || [])
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '加载物料失败', icon: 'none' })
    } finally {
      setIssueSearching(false)
    }
  }
  const openIssuePicker = () => {
    // 对齐网页 Combobox:打开即展示可选物料列表,搜索只是筛选。
    setIssueMat(null)
    setIssueQty(1)
    setIssueQuery('')
    setIssueHits([])
    setIssueOpen(true)
    void loadIssueItems('')
  }
  const onIssueBtn = () => {
    const list = d?.materials || []
    console.log('[issue] tap 发放材料', { count: list.length, ids: list.map((m) => m.itemId) })
    if (!list.length) {
      openIssuePicker()
      return
    }
    if (list.length === 1) {
      openIssue(list[0])
      return
    }
    Taro.showActionSheet({
      itemList: [...list.map((m) => m.name || '材料'), '其他物料…'],
    })
      .then((r) => {
        if (r.tapIndex >= list.length) {
          openIssuePicker()
          return
        }
        const m = list[r.tapIndex]
        if (m) openIssue(m)
      })
      .catch(() => {})
  }
  const onIssueSearch = (q: string) => {
    setIssueQuery(q)
    // 筛选列表(与网页 Combobox 输入过滤一致)
    void loadIssueItems(q.trim())
  }
  const pickIssueItem = (hit: ItemHit) => {
    setIssueMat({
      id: hit.id,
      materialId: '',
      itemId: hit.id,
      name: hit.name,
      desc: hit.desc,
      source: '',
      estimated: 0,
      actual: 0,
      toIssue: 1,
    })
    setIssueQty(1)
    setIssueQuery(hit.name)
  }
  const submitIssue = async () => {
    if (!d || !issueMat || acting) return
    if (!issueMat.itemId) {
      Taro.showToast({ title: '请先选择物料', icon: 'none' })
      return
    }
    if (issueQty <= 0) {
      Taro.showToast({ title: '请输入数量', icon: 'none' })
      return
    }
    setActing(true)
    try {
      const res = await operationAction(d.id, 'issue', {
        itemId: issueMat.itemId,
        materialId: issueMat.materialId || undefined,
        quantity: issueQty,
        adjustmentType: 'Negative Adjmt.',
      })
      if (res.success) {
        setIssueOpen(false)
        Taro.showToast({ title: '已发放', icon: 'success' })
        setLoading(true)
        load()
      } else {
        Taro.showToast({ title: res.message || '发放失败', icon: 'none' })
      }
    } catch (e: any) {
      Taro.showToast({ title: e?.message || '发放失败', icon: 'none' })
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

  // 扫码带 auto 意图:首次加载出工序后自动执行一次(报工弹层 / 领取)。
  useEffect(() => {
    if (autoHandled.current || !d || !d.found) return
    autoHandled.current = true
    if (auto === 'report') {
      openSheet()
    } else if (auto === 'pickup' && !d.isMine) {
      runAction('pickup')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d])

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

          {/* 进度环 Hero */}
          <View className='op__hero'>
            <View className='op__ring'>
              <Image className='op__ring-img' src={ringSvg(pct)} />
              <View className='op__ring-center'>
                <Text className='op__ring-num'>
                  {d.completed}
                  <Text className='op__ring-den'>/{d.target}</Text>
                </Text>
                <Text className='op__ring-label'>已完成</Text>
              </View>
            </View>
            <View className='op__who'>
              <View className='op__who-a'>
                <Text className='op__who-a-text'>{(d.assignee || '·').slice(0, 1)}</Text>
              </View>
              <Text className='op__who-name'>{d.assignee || '未分配'}</Text>
              {!d.isMine ? (
                <Text className='op__who-take' onClick={() => runAction('pickup')}>
                  {d.assigneeId ? '接手' : '领取'}
                </Text>
              ) : null}
            </View>
            <Text className='op__hero-time'>
              单件工时 {fmtMs(d.timePerUnitMs)} · 累计 {fmtMs(d.timeTotalMs)}
            </Text>
          </View>

          {/* 2×2 指标 */}
          <View className='op__quad'>
            <View className='op__q'>
              <Text className='op__q-label'>返工</Text>
              <Text className='op__q-value op__q-value--amber'>{d.rework}</Text>
            </View>
            <View className='op__q'>
              <Text className='op__q-label'>已报废</Text>
              <Text className='op__q-value op__q-value--red'>{d.scrap}</Text>
            </View>
            <View className='op__q'>
              <View className='op__q-head'>
                <Text className='op__q-label'>待审批</Text>
                {d.pending > 0 ? (
                  <Text className='op__q-link' onClick={goApprovals}>审核 ›</Text>
                ) : null}
              </View>
              <Text className='op__q-value'>{d.pending}</Text>
            </View>
            <View className='op__q'>
              <Text className='op__q-label'>截止日期</Text>
              <Text className='op__q-date'>
                {d.dueDate ? d.dueDate.slice(0, 10) : '无截止'}
              </Text>
            </View>
          </View>

          {/* 材料 — 用 View 包按钮，避免 Text 在真机上点按无响应 */}
          <View className='op__sec'>
            <Text className='op__sec-title'>材料</Text>
            <View
              className='op__sec-btn'
              hoverClass='op__sec-btn--hover'
              onClick={onIssueBtn}
            >
              <Text className='op__sec-btn-text'>发放材料</Text>
            </View>
          </View>
          <View className='op__card2'>
            {d.materials.length > 0 ? (
              d.materials.map((m) => (
                <View
                  key={m.id}
                  className='op__mat'
                  hoverClass='op__mat--hover'
                  onClick={() => openIssue(m)}
                >
                  <View className='op__mat-l'>
                    <Text className='op__mat-name'>{m.name || '—'}</Text>
                    {m.source ? <Text className='op__mat-src'>{m.source}</Text> : null}
                  </View>
                  <View className='op__mat-r'>
                    <Text className='op__mat-q'>
                      {m.actual} / {m.estimated}
                    </Text>
                    <Text className='op__mat-q-l'>实际 / 估计</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text className='op__empty2'>无材料</Text>
            )}
          </View>

          {/* 文件 — 对齐 MES JobOperation Files */}
          <View className='op__sec'>
            <Text className='op__sec-title'>文件</Text>
          </View>
          <Text className='op__sec-sub'>与工单和商机相关的文件。</Text>
          <View className='op__card2'>
            {(d.files ?? []).length > 0 ? (
              <>
                <View className='op__file-head'>
                  <Text className='op__file-h'>名称</Text>
                  <Text className='op__file-h op__file-h--size'>大小</Text>
                  <View className='op__file-h-spacer' />
                </View>
                {(d.files ?? []).map((f) => (
                  <View key={f.id} className='op__file'>
                    <View
                      className='op__file-main'
                      hoverClass='op__file-main--hover'
                      onClick={() => openOpFile(f)}
                    >
                      <View className='op__file-ic'>
                        <Text className='op__file-ic-t'>
                          {f.type === 'Image' ? '🖼' : f.type === 'PDF' ? 'PDF' : '📄'}
                        </Text>
                      </View>
                      <Text className='op__file-name'>{f.name}</Text>
                      <Text className='op__file-size'>{f.size}</Text>
                    </View>
                    <View
                      className='op__file-more'
                      hoverClass='op__file-more--hover'
                      onClick={() => onFileMore(f)}
                    >
                      <Text className='op__file-more-t'>⋮</Text>
                    </View>
                  </View>
                ))}
              </>
            ) : (
              <Text className='op__empty2'>无文件</Text>
            )}
          </View>

          {/* 生产日志 */}
          <View className='op__sec'>
            <Text className='op__sec-title'>生产日志</Text>
          </View>
          <View className='op__card2'>
            <View className='op__totals'>
              <View className='op__total'>
                <Text className='op__total-n op__total-n--green'>{d.completed}</Text>
                <Text className='op__total-l'>合格</Text>
              </View>
              <View className='op__total'>
                <Text className='op__total-n op__total-n--amber'>{d.rework}</Text>
                <Text className='op__total-l'>返工</Text>
              </View>
              <View className='op__total'>
                <Text className='op__total-n op__total-n--red'>{d.scrap}</Text>
                <Text className='op__total-l'>报废</Text>
              </View>
            </View>
            {d.logs.length > 0 ? (
              d.logs.map((g) => (
                <View key={g.id} className='op__log-row'>
                  <View
                    className={`op__log-badge op__log-badge--${LOG_META[g.type]?.cls || 'gray'}`}
                  >
                    <Text className='op__log-badge-t'>{LOG_META[g.type]?.label || g.type}</Text>
                  </View>
                  <View className='op__log-mid'>
                    <Text className='op__log-who'>{g.who || '—'}</Text>
                    <Text className='op__log-date'>{fmtDate(g.date)}</Text>
                  </View>
                  <Text className='op__log-qty'>{g.quantity}</Text>
                </View>
              ))
            ) : (
              <Text className='op__empty2'>暂无报工记录</Text>
            )}
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
            <MoreItem cls='amber' name='返工' hint='把数量返工到指定工序' onClick={openRework} />
            {d.rework > 0 ? (
              <MoreItem
                cls='green'
                name='标记已修'
                hint='把返工数量转回合格'
                onClick={doMarkFixed}
              />
            ) : null}
            <MoreItem cls='red' name='报废' hint='报废并选择原因' onClick={openScrap} />
            <MoreItem cls='purple' name='维护' hint='报修工作中心' onClick={soon} />
            <MoreItem cls='gray' name='质量问题' hint='提交质量异常' onClick={soon} />
          </View>
        </View>
      ) : null}

      {/* 报废弹层 */}
      {scrapOpen && d ? (
        <View className='op__sheet-wrap'>
          <View className='op__mask' onClick={() => setScrapOpen(false)} />
          <View className='op__sheet'>
            <View className='op__sheet-head'>
              <Text className='op__sheet-title'>报废</Text>
              <Text className='op__sheet-x' onClick={() => setScrapOpen(false)}>✕</Text>
            </View>
            <Stepper label='报废数量' hint='本次报废件数' cls='red' value={scrapQty} onChange={setScrapQty} />
            <View className='op__pick' onClick={chooseScrapReason}>
              <Text className='op__pick-k'>报废原因</Text>
              <Text className='op__pick-v'>{scrapReason?.name || '请选择 ›'}</Text>
            </View>
            <View
              className={`op__submit ${acting ? 'op__submit--disabled' : ''}`}
              onClick={acting ? undefined : submitScrap}
            >
              <Text className='op__submit-text'>提交报废</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* 返工弹层 */}
      {reworkOpen && d ? (
        <View className='op__sheet-wrap'>
          <View className='op__mask' onClick={() => setReworkOpen(false)} />
          <View className='op__sheet'>
            <View className='op__sheet-head'>
              <Text className='op__sheet-title'>返工</Text>
              <Text className='op__sheet-x' onClick={() => setReworkOpen(false)}>✕</Text>
            </View>
            <Stepper label='返工数量' hint='退回上游返修的件数' cls='amber' value={reworkQty} onChange={setReworkQty} />
            <View className='op__pick' onClick={chooseReworkTarget}>
              <Text className='op__pick-k'>目标工序</Text>
              <Text className='op__pick-v'>
                {reworkTarget ? reworkTarget.description || reworkTarget.item : '请选择 ›'}
              </Text>
            </View>
            <View className='op__reason'>
              <Input
                className='op__reason-input'
                value={reworkReason}
                placeholder='返工原因'
                onInput={(e) => setReworkReason(e.detail.value)}
              />
            </View>
            <View
              className={`op__submit ${acting ? 'op__submit--disabled' : ''}`}
              onClick={acting ? undefined : submitRework}
            >
              <Text className='op__submit-text'>提交返工</Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* 发放材料弹层 —— 对齐网页 IssueMaterialModal 的「选择物料」下拉 */}
      {issueOpen ? (
        <View className='op__sheet-wrap'>
          <View className='op__mask' onClick={() => setIssueOpen(false)} />
          <View className='op__sheet'>
            <View className='op__sheet-head'>
              <Text className='op__sheet-title'>发放材料</Text>
              <Text className='op__sheet-x' onClick={() => setIssueOpen(false)}>✕</Text>
            </View>
            <Text className='op__sheet-sub'>选择物料并填写发放数量</Text>

            <Text className='op__field-label'>物料</Text>
            <Input
              className='op__reason-input'
              value={issueQuery}
              placeholder='选择物料…'
              onInput={(e) => {
                // 已选中时再改输入 = 重新筛选列表
                if (issueMat) setIssueMat(null)
                onIssueSearch(e.detail.value)
              }}
              onFocus={() => {
                if (!issueHits.length && !issueSearching) void loadIssueItems(issueQuery.trim())
              }}
            />
            {!issueMat ? (
              <View className='op__pick-list'>
                {issueSearching ? (
                  <Text className='op__empty2'>加载中…</Text>
                ) : issueHits.length === 0 ? (
                  <Text className='op__empty2'>暂无可选物料</Text>
                ) : (
                  issueHits.map((h) => (
                    <View
                      key={h.id}
                      className='op__pick-row'
                      hoverClass='op__pick-row--hover'
                      onClick={() => pickIssueItem(h)}
                    >
                      <Text className='op__pick-name'>{h.name || '—'}</Text>
                      {h.desc ? <Text className='op__pick-desc'>{h.desc}</Text> : null}
                    </View>
                  ))
                )}
              </View>
            ) : (
              <View className='op__pick-selected' onClick={() => {
                setIssueMat(null)
                void loadIssueItems(issueQuery.trim())
              }}>
                <Text className='op__pick-name'>{issueMat.name}</Text>
                <Text className='op__pick-change'>更换 ›</Text>
              </View>
            )}

            {issueMat ? (
              <>
                <Stepper
                  label='发放数量'
                  hint='从库存领用到本工序的数量'
                  cls='green'
                  value={issueQty}
                  onChange={setIssueQty}
                />
                <View
                  className={`op__submit ${acting ? 'op__submit--disabled' : ''}`}
                  onClick={acting ? undefined : submitIssue}
                >
                  <Text className='op__submit-text'>确认发放</Text>
                </View>
              </>
            ) : null}
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
