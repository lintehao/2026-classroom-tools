---
name: folder-project-init
description: 資料夾專案初始化助手。當使用者打開一個新資料夾、要求「初始化這個資料夾」、「把這個資料夾變成專案」、「建立 CLAUDE.md」、「設定開工收工流程」、或希望把本機資料夾接上 Obsidian 工作日誌與 GitHub 備份時使用。此技能適用於 Claude/Claude Code：檢查目前資料夾、建立或建議 CLAUDE.md、必要時保留 AGENTS.md 相容、設定 Git 與工作日誌路徑，並遵守 PowerShell 7+ 與 secrets 安全規則。
---

# 資料夾專案初始化助手

把一個普通資料夾整理成可被 `startup` / `shutdown` 接續的專案工作桌。此技能負責初始化，不負責實作專案功能。

## 核心原則

1. 先盤點現場，再建立檔案；不要覆蓋既有 `CLAUDE.md`、`AGENTS.md` 或工作日誌。
2. Claude 專案設定優先使用 `CLAUDE.md`；若需要 Codex 相容，可另外保留或建立 `AGENTS.md`。
3. 新建 GitHub repo 預設 private，除非使用者明確要求公開。
4. 不把 secrets 寫進原始碼、模板、工作日誌或同步資料夾。
5. 指令使用 PowerShell 7+ 相容寫法。
6. 不使用批量刪除或破壞性 Git 指令。

## 初始化 SOP

### 步驟 1：確認目前資料夾

檢查：
- 目前路徑。
- 是否已有 `.git`。
- 是否已有 `CLAUDE.md` 或 `AGENTS.md`。
- 是否已有 README、package、pyproject、Firebase 或其他專案線索。
- 是否位於雲端同步資料夾；若是，提醒 runtime 目錄不要同步。

PowerShell 7+：

```powershell
Get-Location
Get-ChildItem -Force
git status --short
```

若不是 Git repo，詢問或依使用者要求初始化 Git；不要自動建立遠端 repo，除非使用者明確要求。

### 步驟 2：建立專案識別資訊

整理：
- 專案名稱：預設使用資料夾名稱。
- 本地工作桌路徑：目前資料夾完整路徑。
- Obsidian 工作日誌路徑：預設 `<vault>/<專案名稱>/工作日誌.md`，若使用者或現場已有路徑，以現場為準。
- GitHub repo：若已存在 remote，讀取 remote；若沒有，留 TODO 或詢問。
- Firebase（選填）：若新專案需要 Firestore/Auth/Hosting，預設共用 `the-first-e154a`，並於 `CLAUDE.md` 寫入「Firestore 命名空間 = 專案 slug」規則；若不需要 Firebase，留空或刪除該行。
- 其他服務（如 Vercel、Netlify）：只有現場已有或使用者指定時才寫入。

### 步驟 3：建立或更新 CLAUDE.md 草稿

若沒有 `CLAUDE.md`，建立最小可用版本：

```markdown
# <專案名稱>

## 專案設定

- 本地工作桌：`<目前資料夾完整路徑>`
- 工作日誌：`<Obsidian 工作日誌路徑或 TODO>`
- GitHub repo：`<remote 或 TODO>`
- Firebase 專案：（選填）若需要 Firestore/Auth/Hosting，預設共用 `the-first-e154a`
- Firestore 命名空間：`<專案 slug>`（共用 Firebase 時必填，所有 collection 第一段需以此為前綴）
- 工具目錄：新增工具放在 `tools/<工具名>/`

## Claude 工作流

- 「開工」：使用全域 `startup` skill，讀本檔案指定的工作日誌並檢查 Git。
- 「收工」：使用全域 `shutdown` skill，更新本檔案指定的工作日誌並同步 Git。
- 若同時存在 `AGENTS.md`，本檔案優先；`AGENTS.md` 可作為 Codex 相容補充。

## 安全與同步規則

- 回覆使用繁體中文。
- 指令需相容 PowerShell 7+。
- 不寫入 API keys、密碼或敏感憑證。
- secrets 使用環境變數或 `.env`，並確認 `.env` 不被提交。
- 共用 Firebase 時，Firestore 讀寫只能限定在「以本專案命名空間為前綴」的 collection；不可跨專案讀寫。
- 嚴禁批量刪除檔案或目錄。
- 新建 GitHub repo 預設 private。
```

若已存在 `CLAUDE.md`：
- 先讀取並摘要目前規則。
- 只補缺少的「專案設定」、「Claude 工作流」、「安全與同步規則」。
- 不重寫使用者既有的特殊規則。

若只有 `AGENTS.md`：
- 讀取後產生對應的 `CLAUDE.md` 草稿。
- 不刪除 `AGENTS.md`。

### 步驟 4：建立工作日誌草稿

若使用者同意建立工作日誌，使用最小結構：

```markdown
# <專案名稱> 工作日誌

## 上次做到哪

- 最後狀態：剛完成專案初始化。
- 所在脈絡：已建立 CLAUDE.md，後續可用「開工 / 收工」接續。
- 下一步：依使用者指定開始第一個工具或功能。

## 下一步

1. 決定第一個要做的工具或功能。

## 最近活動紀錄

| 日期 | 摘要 | 狀態 |
|---|---|---|
| <YYYY-MM-DD> | 初始化專案工作桌與接續流程 | 完成 |

## 踩坑筆記

（暫無）
```

不要在找不到 vault 時硬建資料夾；先回報建議路徑並詢問。

### 步驟 5：檢查 Git 與 ignore

確認：
- `.gitignore` 是否排除 `.env`、runtime 目錄與本機工具狀態。
- 若缺少 `.gitignore`，可建立最小版本。
- 不要 stage secrets 或大型 runtime 目錄。

最小 `.gitignore`：

```gitignore
.env
.env.*
!.env.example
node_modules/
.venv/
__pycache__/
.DS_Store
.claude/settings.local.json
.claude/worktrees/
```

### 步驟 6：回報初始化結果

用精簡格式回報：

```text
專案：<名稱>
CLAUDE.md：<已建立 / 已補強 / 已存在未改>
AGENTS.md：<已保留 / 已建立相容版 / 不需要>
工作日誌：<已建立 / 建議路徑 / 未建立，原因>
Git：<已是 repo / 尚未初始化 / remote 狀態>
安全檢查：<.env / .gitignore / secrets 風險>
下一步：<建議使用者說「開工」或指定第一個工具>
```

## 不該做的事

- 不覆蓋既有 `CLAUDE.md` 或 `AGENTS.md`。
- 不硬建 Obsidian vault 或未知路徑。
- 不自動建立公開 GitHub repo。
- 不自動 commit / push 初始化結果，除非使用者要求。
- 不把 secrets 寫入任何檔案。
