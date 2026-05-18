# 2026database

Codex 基本功 EP09 / EP09.5 / EP11 / EP12 的教學實作專案。

## 專案用途

這個資料夾用來示範老師如何用 Codex 串接資料庫、建立班級互動工具，包含：

- EP09：Supabase 成績記錄本與文字雲
- EP09.5：Firebase 即時文字雲
- EP11：一人一碼教學駕駛艙的 Firestore 規則
- EP12：本地 AI 與免費 API 的數學作業批改工具

## 主要檔案

| 檔案 | 用途 |
|------|------|
| `index.html` | Supabase 成績記錄本 |
| `wordcloud.html` | Supabase 文字雲 |
| `wordcloud-firebase.html` | Firebase 文字雲 |
| `math-homework.html` | Groq Vision + Firebase 作業批改 |
| `firestore.rules` | Firestore 安全規則 |
| `firebase.json` | Firebase CLI 設定 |
| `AGENTS.md` | Codex 專案入口與固定規則 |

## 工作模式

- 開工：對 Codex 說「開工」
- 收工：對 Codex 說「收工」
- 進度與踩坑：記在 Obsidian `2026database/專案工作流程.md`
- 固定規則與專案邊界：記在 `AGENTS.md`

## 安全原則

- 正式資料只用座號與班級代號，不存學生姓名
- 不把 API key、token、密碼、Firebase Admin 憑證放進 repo
- `.codex/`、`.claude/`、`.env*` 不進 Git
