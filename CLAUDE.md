# 2026Claude一桌三櫃 — 我的班級工具總專案

## 對話開始時請先讀
進度與最近活動都在 Obsidian：`Obsidian Vault/2026Claude一桌三櫃/工作日誌.md`

## 工作模式
- **加新工具**：對 Claude 說「我想做一個 XXX 工具」→ Claude 會建 `tools/<工具名>/` 子資料夾、引導跟著 EP10 影片做
- **結束工作**：對 Claude 說「**收工**」→ 自動 commit + push + 更新 Obsidian 工作日誌
- **接續工作**：對 Claude 說「讀工作日誌，告訴我上次做到哪」

## 工作桌 + 三個家
- 📂 本地工作桌：`C:\Users\linte\Projects\2026Claude一桌三櫃\`（單機作業，GDrive 不再使用）
- 🐙 GitHub repo：`lintehao/2026-classroom-tools`（公開，網頁的家、跨裝置備份來源）
- 🦉 Obsidian 駐駐腦：`C:\Users\linte\Obsidian Vault\2026Claude一桌三櫃\工作日誌.md`（想法的家、本地）
- 🔥 Firebase 專案：`teacherstudy-109ef`（由 `tools/2026database/` 帶入，資料的家）

## 工具清單
（之後加新工具時會自動更新）
- **2026database**（`tools/2026database/`）：EP09 / EP09.5 / EP11 / EP12 教學實作專案，含 7 個 HTML 工具（成績記錄本、文字雲 ×2、班級 IRS、形成性測驗、遊戲排行榜、數學作業批改）+ Firebase 設定。原獨立 repo `lintehao/2026database` 已於 2026-05-18 刪除

## 工作注意事項
- 學生資料不得出現識別碼，只用座號 + 班級代號
- commit 訊息要寫清楚做了什麼 + 為什麼
- 收工時說「收工」讓 Claude 同步三家
