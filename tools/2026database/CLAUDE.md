# 2026database — Claude基本功 EP09 / EP09.5 / EP11 / EP12 實作專案

> ## 📌 對話開始時請先讀這份「駕駛艙」
>
> **進度、最近更動、下一步、踩坑筆記** 全部維護在 Obsidian：
> `2026database/專案工作流程.md`（vault 根的同名資料夾）
>
> 透過 `mcp__obsidian__read_note` 讀取，路徑：`2026database/專案工作流程.md`
>
> 本檔（`CLAUDE.md`）只負責**藍圖**：架構決策、技術細節、檔案對應、Do/Don't。
> 進度類資訊**不要寫進本檔**，避免雙寫漂移。

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

> 完整關係圖請看 Obsidian 駕駛艙的「🛠️ 此邏輯專案會動到的東西」區塊。

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

### my-teaching-tools（Firebase 文字雲，EP09.5）
- 專案 ID：`my-teaching-tools`
- Region：`asia-east1` (Taiwan)
- 集合：`wordcloud_words`（word, created_at）
- Security Rules：白名單模式，wordcloud_words 公開可讀寫，其他禁止
- Web App：`1:257256401647:web:9db61fe50e7f22274cc91a`
- 網頁：https://mathruffian-dot.github.io/2026database/wordcloud-firebase.html

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

> 🔥 **不在本檔**。請開 Obsidian `2026database/專案工作流程.md`（駕駛艙）查看：
> - 上次做到哪
> - 下一步要做什麼
> - 待辦 / 卡點
> - 最近更動紀錄
> - 踩坑筆記
>
> 為了避免雙寫漂移，本檔不再維護進度資訊。

## 資料夾結構
```
2026database/
├── CLAUDE.md                   # 專案說明（藍圖）
├── .gitignore                  # Git 忽略規則
│
├── firebase.json               # Firebase CLI 設定（EP09.5）
├── firestore.rules             # Firestore 安全規則（EP09.5 + EP11）
├── .firebaserc                 # Firebase 專案設定（EP09.5）
│
├── index.html                  # 班級成績記錄本（EP09，Supabase）
├── wordcloud.html              # 文字雲互動網頁（EP09，Supabase）
├── wordcloud-firebase.html     # 文字雲互動網頁（EP09.5，Firebase）
├── math-homework.html          # 數學作業 AI 批改（EP12，Groq Vision + Firebase）
│
├── 老師建專案指南.md            # 給觀眾的初學者建專案手冊（v2.1, 948 行）
├── EP10-老師建專案指南懶人包.md     # 可自客製化範本（內含 meta-prompt）
│
└── .claude/
    └── launch.json             # 本地預覽伺服器設定
```

## 重要檔案速查表（給 AI 快速 onboarding 用）

| 檔案 | 一句話用途 | 改動頻率 | 對應集數／工作 |
|------|----------|---------|--------------|
| `CLAUDE.md`（本檔） | **藍圖**：架構決策、技術細節、Do/Don't | 慢（變動會破 prompt cache） | 全系列 |
| `firestore.rules` | Firestore 三 collection 白名單規則 | 中（新工具上線時加） | EP09.5 + EP11 |
| `index.html` | 班級成績本前端 | 低（已上線） | EP09 |
| `wordcloud.html` | 文字雲（Supabase 版） | 低（已上線） | EP09 |
| `wordcloud-firebase.html` | 文字雲（Firebase 版，**對外推薦**） | 低（已上線） | EP09.5 |
| `math-homework.html` | 拍照→Groq Vision→Firebase | 中（EP12 開發中） | EP12 |
| `老師建專案指南.md` | 給觀眾的建專案完整手冊 | 中（持續補強） | EP10 |
| `EP10-老師建專案指南懶人包.md` | 可自客製化範本（內含 meta-prompt） | 低 | EP10 |

**EP11 主要程式碼不在本 repo**，在 [`mathruffian-dot/math-cockpit`](https://github.com/mathruffian-dot/math-cockpit)（`2-2-linear-equation-graph/index.html`、`qr-generator.html`、`teacher-dashboard.html`）。本 repo 只負責 EP11 對應的 `firestore.rules` 段落。

> 💡 **想知道某檔案最近改了什麼？** 看 Obsidian 駕駛艙 `2026database/專案工作流程.md` 的「最近更動紀錄」表格。

## 檔案對應集數

| 集數 | 主題 | 示範檔案 |
|------|------|---------|
| EP09 | Supabase 資料庫懶人包 | `index.html`、`wordcloud.html` |
| EP09.5 | Firebase 串接免費資料庫 | `wordcloud-firebase.html`、`firestore.rules`、`firebase.json` |
| EP11 | 一人一碼教學駕駛艙（Firebase 版）| 在另一個 repo `mathruffian-dot/math-cockpit`：`2-2-linear-equation-graph/index.html`（改造）、`qr-generator.html`、`teacher-dashboard.html`；本 repo 只負責 `firestore.rules` 對應段落 |
| EP12 | 本地 AI 與免費 API（Ollama/Groq/Gemini） | `math-homework.html` |

> 📌 **彩排筆記與 EP09.5 Firebase 彩排重點兩段已歸檔**（2026-04-19 瘦身）：
> 內容已內化進對應的創作庫腳本（EP09 / EP09.5）+ 駕駛艙踩坑筆記（`2026database/專案工作流程.md` 「🕳️ 踩坑筆記」段第 1-16 條）+ 三份 EP10 配套。在本檔重複保留會稀釋藍圖密度。

## 三處同步指引

| 平台 | 路徑 / 位置 | 用途 |
|------|-------------|------|
| Google Drive | `G:\我的雲端硬碟\2026database\` | 主要工作目錄，Claude Code 直接讀寫 |
| Obsidian | `2026database/` | 第二大腦，佐證素材與草稿撰寫 |
| GitHub | `mathruffian-dot/2026database` | 版本控制與備份（公開 repo） |

## 工作注意事項
- 此資料夾位於 Google 雲端硬碟
- 跨裝置作業，每次開始前應先瀏覽現有檔案確認最新狀態
- 新增或修改檔案後，更新「資料夾結構」與「最近更動紀錄」
- 每次對話結束前，確認三處同步狀態是否一致
- 示範時使用假資料，不要放真實學生個資
- 正式使用時統一用座號，不存學生真名（去識別化）

## 跨裝置工作流程
1. **開工前**：瀏覽「目前進度」與「最近更動紀錄」
2. **工作中**：優先在 Google Drive 編輯，完成後同步至 Obsidian
3. **收工前**：更新「最近更動紀錄」，標記同步狀態
4. **跨電腦切換**：Google Drive 自動同步、Obsidian 確認 vault 同步、GitHub `git pull`
