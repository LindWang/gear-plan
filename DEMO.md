# Gear Planner — 演示版 (Cloudflare)

浏览器本地存储版,无后端、无数据库,静态部署到 Cloudflare Pages。

- Pages:  https://gear-plan-demo.pages.dev   ← 唯一线上入口

2026-09-18:同一个 build 曾同时部署到 Pages 和 Workers,后按决定删掉 Worker,
只保留 Pages(Workers 部署方式见文末,需要时可随时恢复)。

## 与原版的差别

原版是 SvelteKit + 直连 Neon Postgres(浏览器端用 `PUBLIC_NEON_DATABASE_URL` 跑 SQL)。
演示版把数据层换成浏览器 `localStorage`,其余 UI / 状态管理不动。

| 文件 | 改动 |
|---|---|
| `src/shared/api/demo-db.ts` | **新增**。localStorage 数据层,含种子数据;首次打开写入一套示例清单 |
| `src/entities/gear-list/api.ts` | `NeonGearListService` → `GearListService`,读写改为 demo-db |
| `src/entities/gear/api.ts` | 同上,保持原有方法签名与返回形状 |
| `src/shared/api/neon-client.ts` | **删除**(Neon 客户端) |
| `src/app/providers/store.ts` | 换用新 service;顺带修了清单刷新守卫的 bug(见下) |
| `svelte.config.js` | `adapter-auto` → `adapter-static`(`fallback: index.html`) |
| `src/routes/+layout.ts` | **新增**。`ssr = false` — 数据层在浏览器,关掉 SSR |
| `static/_redirects` | **新增**。Pages 的 SPA 回退(`/* /index.html 200`) |
| `wrangler.jsonc` | **新增**。Workers 静态资源配置 |
| `package.json` | 移除 `@neondatabase/serverless` / `bcrypt` / `jsonwebtoken` 及其 `@types`;adapter 换 static |

### 顺带修掉的上游 bug

`store.ts` 里 `loadUserGearLists()` 被 `hasLoadedGearLists` 守卫挡住:创建/改名/删除清单后
刷新请求被直接 return,新清单要整页刷新才出现(成功 toast 却看不到卡片)。改为带 `force`
参数,业务操作传 `true`。

## 演示版的数据行为

- 每个访客的数据存在**自己的浏览器**里,互不可见;换浏览器/清缓存 = 重置。
- 首次打开自动写入种子数据(2 个清单 / 19 件装备,合计 ~5.4kg + 一套多日清单)。
- 增删改全部可用,刷新后保留。没有账号、没有同步。
- 想清空重来:浏览器控制台执行 `localStorage.clear()` 后刷新。

## 本地开发 / 构建

```bash
npm install
npm run dev        # 本地开发
npm run build      # 产出 build/ (静态)
npm run preview    # 预览构建产物
```

## 部署

需要 `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`(本机已放在 `~/.hermes/.env`)。

```bash
set -a; . /tmp/cfenv.sh; set +a   # 或自行 export 两个变量

# Pages(项目已存在时只需 deploy 那行)
wrangler pages project create gear-plan-demo --production-branch main
wrangler pages deploy build --project-name gear-plan-demo --branch main --commit-dirty=true

# 可选:Workers 版(当前未部署,Worker 已于 2026-09-18 删除)
# 注意:_redirects 是给 Pages 用的,Workers 会判定它无限循环,必须剔除
rm -rf /tmp/gear-plan-workers-assets && cp -r build /tmp/gear-plan-workers-assets && rm -f /tmp/gear-plan-workers-assets/_redirects
wrangler deploy --assets /tmp/gear-plan-workers-assets
```

### 部署要点

- **Pages 与 Workers 用同一份 `build/`**,差别只在 `_redirects`:
  Pages 靠它做 SPA 回退;Workers 走 `wrangler.jsonc` 里的
  `not_found_handling: "single-page-application"`,带上 `_redirects` 会被
  Cloudflare 校验拒绝(`Infinite loop detected`,[code 100324])。
- 深链接已实测:`/deep/link/xyz` 在两端都返回 200 并落到 SPA。
- 换绑自定义域名:在 Pages/Workers 各自的设置里加 custom domain 即可,无需改代码。
