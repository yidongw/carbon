#!/usr/bin/env node
// 扫码报工/领工单 端到端自动化测试。
// 针对预览后端(真实数据)验证:parseBundleScan 解析 + /api/miniapp/bundle/:id 解析当前工序。
// 用法:BASE=<tunnel> node miniapp/scripts/scan-e2e.test.mjs
const BASE =
  process.env.BASE ||
  'https://think-nearly-expectations-collection.trycloudflare.com'
const EMAIL = process.env.EMAIL || 'wy.dong96@gmail.com'

let pass = 0
let fail = 0
const ok = (name, cond, extra = '') => {
  if (cond) {
    pass++
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    console.log(`  ✗ ${name} ${extra}`)
  }
}

// ── 1. parseBundleScan 单元测试(与 miniapp/src/utils/scan.ts 完全一致) ──
function parseBundleScan(text) {
  const trimmed = (text || '').trim()
  const urlMatch = trimmed.match(/\/x\/bundle\/([^/?#\s]+)/)
  if (urlMatch?.[1]) return decodeURIComponent(urlMatch[1])
  if (/^bwo_[A-Za-z0-9]+$/.test(trimmed)) return trimmed
  return null
}

function unitTests() {
  console.log('\n[1] parseBundleScan 单元测试')
  ok('完整链接', parseBundleScan('https://mes.foo.com/x/bundle/bwo_ABC123') === 'bwo_ABC123')
  ok('裸 bwo_ id', parseBundleScan('bwo_XYZ789') === 'bwo_XYZ789')
  ok('链接带 query', parseBundleScan('https://m/x/bundle/bwo_ABC?intent=report') === 'bwo_ABC')
  ok('链接带 hash', parseBundleScan('https://m/x/bundle/bwo_ABC#x') === 'bwo_ABC')
  ok('URL 编码解码', parseBundleScan('https://m/x/bundle/bwo%5FA') === 'bwo_A')
  ok('前后空白', parseBundleScan('  bwo_TRIM  ') === 'bwo_TRIM')
  ok('普通文字 → null', parseBundleScan('hello world') === null)
  ok('工单号(非 bwo)→ null', parseBundleScan('SO0001') === null)
  ok('空 → null', parseBundleScan('') === null)
  ok('别的 URL → null', parseBundleScan('https://m/x/job/job_1') === null)
}

// ── HTTP 帮手 ──
async function req(path, { token, company, method = 'GET', body } = {}) {
  const headers = { 'content-type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (company) headers['X-Company-Id'] = company
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  let json = null
  try {
    json = await res.json()
  } catch {
    /* 非 JSON */
  }
  return { status: res.status, json }
}

async function main() {
  unitTests()

  console.log('\n[2] 鉴权')
  const noAuth = await req('/api/miniapp/bundle/bwo_whatever')
  ok('无 token → 401', noAuth.status === 401, `got ${noAuth.status}`)

  console.log('\n[3] 登录(bypass email)')
  const login = await req('/api/miniapp/auth/verify', {
    method: 'POST',
    body: { email: EMAIL },
  })
  ok('登录成功拿到 token', login.status === 200 && !!login.json?.token, `status ${login.status}`)
  const token = login.json?.token
  const company = login.json?.companyId
  if (!token) {
    console.log('\n登录失败,后续跳过。')
    return summary()
  }

  console.log('\n[4] 拉真实分包工单')
  const list = await req('/api/miniapp/bundle-work-orders', { token, company })
  const rows = list.json?.rows ?? []
  ok('有真实分包工单', rows.length > 0, `count ${rows.length}`)

  // 挑样本:进行中/就绪(应解析出工序) + 已完成(应 allDone)。
  const active = rows.filter((b) => b.status !== 'Completed' && b.status !== 'Cancelled').slice(0, 3)
  const done = rows.filter((b) => b.status === 'Completed').slice(0, 1)

  console.log('\n[5] 解析未完成分包 → 当前工序,并回查工序详情')
  for (const b of active) {
    const r = await req(`/api/miniapp/bundle/${b.id}`, { token, company })
    const j = r.json ?? {}
    ok(`[${b.bundle}/${b.status}] found`, j.found === true, JSON.stringify(j))
    if (j.found && !j.allDone) {
      ok(`[${b.bundle}] 返回 operationId`, typeof j.operationId === 'string' && j.operationId.length > 0)
      // 回查:解析出的工序应能打开,且状态不是 Done/Canceled(核心不变式)。
      const op = await req(`/api/miniapp/operation/${j.operationId}`, { token, company })
      const oj = op.json ?? {}
      ok(`[${b.bundle}] 工序详情可加载`, oj.found === true, `status ${op.status}`)
      ok(
        `[${b.bundle}] 当前工序未完成/未取消`,
        oj.found && oj.status !== 'Done' && oj.status !== 'Canceled',
        `op status=${oj.status}`,
      )
    }
  }

  console.log('\n[6] 解析已完成分包 → allDone')
  for (const b of done) {
    const r = await req(`/api/miniapp/bundle/${b.id}`, { token, company })
    const j = r.json ?? {}
    // 已完成:若该 job 全部工序 Done → allDone=true & operationId 空。
    ok(`[${b.bundle}/Completed] found`, j.found === true, JSON.stringify(j))
    ok(
      `[${b.bundle}] allDone 或指向未完成工序(自洽)`,
      j.allDone === true ? j.operationId === '' : j.operationId.length > 0,
      JSON.stringify(j),
    )
  }

  console.log('\n[7] 负例:不存在的 bwo id')
  const bogus = await req('/api/miniapp/bundle/bwo_000000000000notreal', { token, company })
  ok('伪造 id → found=false', bogus.json?.found === false, JSON.stringify(bogus.json))

  summary()
}

function summary() {
  console.log(`\n──────────────\n结果: ${pass} 通过, ${fail} 失败`)
  process.exit(fail === 0 ? 0 : 1)
}

main().catch((e) => {
  console.error('测试异常:', e)
  process.exit(2)
})
