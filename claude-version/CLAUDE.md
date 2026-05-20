# <專案名稱>

> 本檔為「一桌三櫃」專案模板。新專案複製到根目錄後，把 `<...>` 佔位符換成真實值。

## 專案設定

- 本地工作桌：`<完整本機路徑，例：C:\Users\linte\Projects\專案名稱\>`
- 工作日誌：`<Obsidian 工作日誌完整路徑，例：C:\Users\linte\Obsidian Vault\專案名稱\工作日誌.md>`
- GitHub repo：`<owner/repo-name>`（private）
- Firebase 專案：（選填）若需要 Firestore/Auth/Hosting，預設共用 `the-first-e154a`；不需要時此行留空或刪除
- Firestore 命名空間：`<專案 slug>`（共用 Firebase 時必填，所有資料 collection 第一段需以此為前綴，避免與其他專案撞名）
- 工具目錄：新增工具放在 `tools/<工具名>/`

## Claude 工作流

- 使用者說「開工」或要求接續工作時，使用全域 `startup` skill。
- `startup` 必須以本檔案的工作日誌路徑為準，讀工作日誌、檢查本地 Git、嘗試確認遠端狀態，然後回報上次做到哪與建議下一步。
- 使用者說「收工」或要求結束並同步時，使用全域 `shutdown` skill。
- `shutdown` 必須更新本檔案指定的工作日誌，並只在有實質變更時 commit + push 本 repo。
- 若同時存在 `AGENTS.md`，本檔案優先；`AGENTS.md` 可作為 Codex 相容補充。

## 專案工作模式

- 「我想做一個 XXX 工具」：建立 `tools/<工具名>/` 子資料夾。
- 新增工具時，同步更新本檔案的工具清單。
- 小修優先做低風險、可見度高的修改，不做無關重構。
- 大變更才同步更新 README、spec、task 類文件；不要把文件更新變成每次任務的硬性負擔。

## 工具清單

（之後加新工具時更新）

## 安全與同步規則

- 回覆使用繁體中文。
- 指令需相容 PowerShell 7+。
- 嚴禁將 API keys、密碼或敏感憑證寫入原始碼、模板、工作日誌或同步資料夾。
- 需要 secrets 時，使用環境變數或 `.env`，並確認 `.env` 不被提交。
- 共用 Firebase 時，Firestore 讀寫只能限定在「以本專案 Firestore 命名空間為前綴」的 collection；不可讀寫其他專案的 collection。
- 學生資料不得出現識別碼，只用座號 + 班級代號。
- 嚴禁批量刪除檔案或目錄。不可使用 `del /s`、`rd /s`、`rmdir /s`、`Remove-Item -Recurse`、`rm -rf`。
- 如需刪除檔案，只能一次刪除一個明確檔案路徑；若需要批量刪除，停止並請使用者手動處理。
- commit 訊息使用 Conventional Commits，並寫清楚做了什麼與為什麼。
- 新建 GitHub repo 預設 private，除非使用者明確要求公開。
