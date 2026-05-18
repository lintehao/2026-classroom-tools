# 2026database — Claude基本功 EP09 / EP09.5 / EP11 / EP12 實作專案

> ## 📌 本檔定位
>
> 本檔（`CLAUDE.md`）只負責**藍圖**：架構決策、技術細節、檔案對應、Do/Don't。
> **進度、最近更動、下一步、踩坑筆記** 一律看母專案 Obsidian 工作日誌：
> `Obsidian Vault/2026Claude一桌三櫃/工作日誌.md`
>
> 為避免雙寫漂移，本檔不維護進度資訊。母專案總指引看上一層的 `CLAUDE.md`。

## 專案簡介
Claude基本功 EP09 / EP09.5 / EP11 / EP12 的實作工作目錄：
- **EP09**：Supabase 資料庫懶人包，示範班級成績記錄本
- **EP09.5**：Firebase 串接免費資料庫，示範即時文字雲
- **EP11**：一人一碼教學駕駛艙（Firebase 版）— 程式碼在另一個 repo `mathruffian-dot/math-cockpit`，本 repo 只負責 `firestore.rules`
- **EP12**：本地 AI 與免費 API（Ollama / Groq / Gemini）— `math-homework.html`

從建資料庫、做前端、到上線，全程對話完成。

## 關鍵時程
- 影片規劃建立：2026-04-04
- 專案初始化：2026-04-12
- EP09 第二台電腦彩排完成：2026-04-12
- EP09.5 Firebase 彩排完成：2026-04-14
- **EP09 正式錄影 + 發布：2026-04-13** → https://youtu.be/aRpZL-CyS7k

## 語言與風格
- 所有回應、文件皆使用**繁體中文**
- 修改前先確認計畫，優先保留原有資料結構

## Obsidian 關聯資料
以下 Obsidian 筆記可作為佐證素材，路徑相對於 vault 根目錄：
- `創作庫/Claude基本功EP09 - Supabase資料庫懶人包.md` — EP09 腳本（已發布）
- `創作庫/Claude基本功EP09.5 - Firebase串接免費資料庫.md` — EP09.5 腳本
- `創作庫/Claude基本功EP12 - 本地AI與免費API懶人包.md` — EP12 腳本（含 Groq + Vision）
- `Claude Code 懶人包/04-連接 Supabase 資料庫.md` — Supabase 懶人包 v0.4
- `Claude Code 懶人包/05-連接 Firebase 資料庫.md` — Firebase 懶人包 v0.7

## 附屬 GDrive 工作目錄

本邏輯專案除了本資料夾之外，還會動到下列 GDrive 路徑：

| 路徑 | 角色 | Git |
|------|------|-----|
| `G:\我的雲端硬碟\2026數學715\` | 教材 PDF 儲存 + 班上實際使用版本（去識別化、不上 git） | ❌ |

> 完整關係圖請看母專案 Obsidian 工作日誌。

## Supabase 專案資訊

### my-teaching-tools（成績記錄本）
- 專案 ID：`xxbjykdheracbfmwpxwm`
- Region：`ap-northeast-2`
- 資料表：`students`（座號、國英數、總分、平均）
- 去識別化：統一使用「座號」，不存學生姓名
- 網頁：https://mathruffian-dot.github.io/2026database/

### teacherstudy（教學互動工具）
- 專案 ID：`pwfhkdkkobzkmsbmzldj`
- Region：`ap-southeast-2`
- 資料表：`wordcloud_words`（word, created_at）
- RLS：anon 可讀取 + 可新增，老師用 MCP 管理刪除
- 網頁：https://mathruffian-dot.github.io/2026database/wordcloud.html

## Firebase 專案資訊

### teacherstudy-109ef（教學互動工具總庫，EP09.5 / EP11 / EP12）
- 專案 ID：`teacherstudy-109ef`（與 `.firebaserc` 一致，所有 HTML 工具的 `firebaseConfig` 統一指向此專案）
- Web App ID：`1:196599230156:web:cfe55d364df3ae1b9d5c69`
- 集合（與對應工具）：
  - `wordcloud_words` — Firebase 文字雲（EP09.5）
  - `math_homework` — 數學作業批改（EP12）
  - `game_scores` — 遊戲排行榜
  - `irs_session` / `irs_responses` — 班級 IRS
  - `formative_responses` — 形成性測驗
  - `student_tokens` / `quiz_assignments` / `quiz_responses` — EP11 一人一碼
- Security Rules：白名單模式（白名單以外的集合全部 `allow: if false`），完整規則看 `firestore.rules`

> 早期 EP09.5 彩排時使用過 `my-teaching-tools` 專案，**已棄用**；2026 年起 7 個工具統一收斂到 `teacherstudy-109ef`。

## 架構決策（彩排後確定）

### 三種頁面模式
| 頁面 | 功能 | 權限 | 需要登入 |
|------|------|------|---------|
| 學生提交頁 | 交作業、答題、輸入文字 | 只能寫入 | 不需要 |
| 公開展示頁 | 排行榜、文字雲、統計圖 | 只能讀取統計 | 不需要 |
| 老師管理 | Claude + MCP 直接查詢分析 | 完整權限 | 不需要（本機操作） |

### 關鍵決策
- **不使用 Google 登入**：對一般老師太複雜，改由 Claude + MCP 直接管理資料
- **去識別化**：資料庫只存座號，不存學生真名，避免個資經過 AI 服務
- **RLS 依表設定**：不同資料表可設不同權限（學生只能寫、展示頁只能讀統計）

## 平台分工指引（Supabase vs Firebase）

**🔥 預設選 Firebase**（2026-04-14 決定）。

- **絕大多數老師（班級工具 / 千人研習 / 即時互動）→ Firebase**
  不暫停、無限免費專案、Realtime DB 並發 100 萬 / Firestore Spark 50k reads/天
- **重度 SQL 統計（成績匯總、跨單元交叉分析）→ Supabase**
- **已在用 Supabase 的舊專案** → 繼續用，不主動遷移

> 完整場景對照、Firebase vs Supabase 決策辯論詳述 → 看創作庫 `Claude基本功EP09.5 - Firebase串接免費資料庫.md`

## 進度與最近更動紀錄

> 🔥 **不在本檔**。請開母專案 Obsidian 工作日誌：
> `Obsidian Vault/2026Claude一桌三櫃/工作日誌.md`
>
> 為了避免雙寫漂移，本檔不再維護進度資訊。

## 資料夾結構
```
tools/2026database/
├── CLAUDE.md                   # 本檔：藍圖
├── README.md                   # 工具說明（給觀眾 / GitHub 訪客）
├── AGENTS.md                   # AI 協作守則
├── .gitignore
│
├── firebase.json               # Firebase CLI 設定
├── firestore.rules             # Firestore 白名單規則
├── .firebaserc                 # → teacherstudy-109ef
│
├── index.html                  # 班級成績記錄本（EP09，Supabase）
├── wordcloud.html              # 文字雲（EP09，Supabase）
├── wordcloud-firebase.html     # 文字雲（EP09.5，Firebase）
├── classroom-irs.html          # 班級 IRS（Firebase）
├── formative-quiz.html         # 形成性測驗（Firebase）
├── game-leaderboard.html       # 遊戲排行榜（Firebase）
├── math-homework.html          # 數學作業 AI 批改（EP12，Groq/Gemini Vision + Firebase）
├── nav.js                      # 共用導覽列
│
├── 老師建專案指南.md            # 給觀眾的建專案手冊
├── EP10-老師建專案指南懶人包.md  # 可客製化範本
└── EP10-跟著影片做.md           # EP10 影片同步教學
```

## 重要檔案速查表（給 AI 快速 onboarding 用）

| 檔案 | 一句話用途 | 改動頻率 | 對應集數／工作 |
|------|----------|---------|--------------|
| `CLAUDE.md`（本檔） | **藍圖**：架構決策、技術細節、Do/Don't | 慢（變動會破 prompt cache） | 全系列 |
| `firestore.rules` | Firestore 白名單規則（9 個 collection） | 中（新工具上線時加） | EP09.5 + EP11 + 衍生工具 |
| `index.html` | 班級成績本前端 | 低（已上線） | EP09 |
| `wordcloud.html` | 文字雲（Supabase 版） | 低（已上線） | EP09 |
| `wordcloud-firebase.html` | 文字雲（Firebase 版，**對外推薦**） | 低（已上線） | EP09.5 |
| `classroom-irs.html` | 班級 IRS（老師發題、學生即時作答） | 中 | 非 EP（衍生工具） |
| `formative-quiz.html` | 形成性測驗（含老師儀表板） | 中 | 非 EP（衍生工具） |
| `game-leaderboard.html` | 速算遊戲排行榜 | 低 | 非 EP（衍生工具） |
| `math-homework.html` | 拍照→Groq/Gemini Vision→Firebase | 中（EP12 開發中） | EP12 |
| `老師建專案指南.md` | 給觀眾的建專案完整手冊 | 中（持續補強） | EP10 |
| `EP10-老師建專案指南懶人包.md` | 可自客製化範本（內含 meta-prompt） | 低 | EP10 |

**EP11 主要程式碼不在本 repo**，在 [`mathruffian-dot/math-cockpit`](https://github.com/mathruffian-dot/math-cockpit)（`2-2-linear-equation-graph/index.html`、`qr-generator.html`、`teacher-dashboard.html`）。本 repo 只負責 EP11 對應的 `firestore.rules` 段落。

> 💡 **想知道某檔案最近改了什麼？** 看母專案 Obsidian 工作日誌 `Obsidian Vault/2026Claude一桌三櫃/工作日誌.md`，或 `git log -- <file>`。

## 檔案對應集數

| 集數 | 主題 | 示範檔案 |
|------|------|---------|
| EP09 | Supabase 資料庫懶人包 | `index.html`、`wordcloud.html` |
| EP09.5 | Firebase 串接免費資料庫 | `wordcloud-firebase.html`、`firestore.rules`、`firebase.json` |
| EP11 | 一人一碼教學駕駛艙（Firebase 版）| 在另一個 repo `mathruffian-dot/math-cockpit`：`2-2-linear-equation-graph/index.html`（改造）、`qr-generator.html`、`teacher-dashboard.html`；本 repo 只負責 `firestore.rules` 對應段落 |
| EP12 | 本地 AI 與免費 API（Ollama/Groq/Gemini） | `math-homework.html` |

> 📌 **彩排筆記與 EP09.5 Firebase 彩排重點兩段已歸檔**（2026-04-19 瘦身）：
> 內容已內化進對應的創作庫腳本（EP09 / EP09.5）+ 駕駛艙踩坑筆記（`2026database/專案工作流程.md` 「🕳️ 踩坑筆記」段第 1-16 條）+ 三份 EP10 配套。在本檔重複保留會稀釋藍圖密度。

> 📦 **同步策略、工作注意事項、跨裝置工作流程** 全部交給母專案 `CLAUDE.md`（上一層）統一管理，本檔不再重複維護。
