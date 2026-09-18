# Carbon MES 微信小程序 (Taro + React + TS)

MES 车间操作端的微信小程序客户端。UI 用 Taro 重建,业务逻辑通过后端
`/api/miniapp/*` JSON 接口复用 `apps/mes` 的 service 层(接口新增到已部署的
MES 应用上,小程序 `BASE_URL` 指向其 https 域名)。

## 目录

- `src/app.config.ts` — 页面注册 & 全局窗口配置
- `src/pages/login` — 微信登录页
- `src/pages/index` — 首页导航网格(对齐网页版 MES sections)
- `src/services/request.ts` — 统一请求封装(Bearer token)
- `src/services/auth.ts` — 微信登录流程(`wx.login` → 后端换 token)
- `config/` — Taro 构建配置(vite 编译器,weapp 平台)
- `project.config.json` — 微信开发者工具项目配置

## 开发

```bash
# 在本目录下(独立于 monorepo 的 pnpm workspace)
pnpm install --ignore-workspace
pnpm build:weapp      # 生成 dist/,用微信开发者工具打开
pnpm dev:weapp        # 监听模式
```

用**微信开发者工具**导入本目录,即可预览 `dist/`。

## AppID

`project.config.json` 目前用 `touristappid`(游客/占位),可在开发者工具里预览但
无法真机调试、无法登录。拿到正式小程序 AppID 后替换该字段,并在小程序后台:

1. 配置 `request` 合法域名(指向后端 API,须 https)。
2. 后端补齐 `/api/miniapp/auth/login`:用 `jscode2session` +
   小程序 AppID/Secret 换 openid/unionid,复用 `findOrCreateWeChatUser` 关联用户,
   签发 token。

## 待办(依赖 AppID / 后端)

- [ ] 后端小程序登录接口(阶段 1)
- [ ] 后端 `/api/miniapp/*` 读写接口(阶段 2)
- [ ] 各功能页面:扫码领活/报工、报工弹层、精简工序详情、列表、工资、审批
