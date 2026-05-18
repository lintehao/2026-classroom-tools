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
| `classroom-irs.html` | 班級 IRS |
| `formative-quiz.html` | 形成性測驗 |
| `game-leaderboard.html` | 遊戲排行榜 |
| `math-homework.html` | Groq/Gemini Vision + Firebase 作業批改 |
| `firestore.rules` | Firestore 安全規則 |
| `firebase.json` | Firebase CLI 設定 |
| `AGENTS.md` / `CLAUDE.md` | AI 協作藍圖（Codex / Claude 視角） |

## 工作模式

- 開工：對 AI 說「開工」
- 收工：對 AI 說「收工」
- 進度與踩坑：記在母專案工作日誌 `Obsidian Vault/2026Claude一桌三櫃/工作日誌.md`
- 固定規則與專案邊界：記在 `AGENTS.md` / `CLAUDE.md`

## 安全原則

- 正式資料只用座號與班級代號，不存學生姓名
- 不把 API key、token、密碼、Firebase Admin 憑證放進 repo
- `.codex/`、`.claude/`、`.env*` 不進 Git
