/**
 * 微信小程序 CI 上传/预览脚本(headless,无需开发者工具 GUI)。
 *
 *   node scripts/ci.cjs preview [version]   → 生成预览二维码 preview-qr.png
 *   node scripts/ci.cjs upload  [version]   → 上传开发版(后台可设为体验版)
 *
 * 依赖:
 *   - private.wxe59e36518822d18c.key(上传密钥,gitignored)
 *   - 服务器公网 IP 已加入小程序后台 IP 白名单
 *   - dist/ 已由 `pnpm build:weapp` 生成
 */
const path = require('path')
const ci = require('miniprogram-ci')

const APPID = 'wxe59e36518822d18c'
const ROOT = path.resolve(__dirname, '..')
const KEY_PATH = path.join(ROOT, `private.${APPID}.key`)

const mode = process.argv[2] || 'preview'
const version = process.argv[3] || '0.0.1'

const project = new ci.Project({
  appid: APPID,
  type: 'miniProgram',
  projectPath: ROOT,
  privateKeyPath: KEY_PATH,
  ignores: ['node_modules/**/*'],
})

const setting = {
  es6: false,
  es7: false,
  minify: true,
  autoPrefixWXSS: true,
}

async function main() {
  if (mode === 'upload') {
    const res = await ci.upload({
      project,
      version,
      desc: `Carbon MES 小程序 v${version}`,
      setting,
      robot: 1,
      onProgressUpdate: () => {},
    })
    console.log('UPLOAD_DONE', JSON.stringify(res))
  } else {
    const qr = path.join(ROOT, 'preview-qr.png')
    const res = await ci.preview({
      project,
      version,
      desc: `Carbon MES 小程序预览 v${version}`,
      setting,
      qrcodeFormat: 'image',
      qrcodeOutputDest: qr,
      robot: 1,
      onProgressUpdate: () => {},
    })
    console.log('PREVIEW_DONE', qr, JSON.stringify(res))
  }
}

main().catch((err) => {
  console.error('CI_ERROR:', err && err.message ? err.message : err)
  process.exit(1)
})
