---
name: startup
description: 開工接續助手。當使用者說「開工」、「開始工作」、「上次做到哪」、「我繼續」、「接下來呢」、「接續工作」、或要求讀工作日誌並接續專案時使用。此技能適用於 Claude/Claude Code：先讀目前資料夾的 CLAUDE.md 或 AGENTS.md 作為專案設定，再讀 Obsidian 工作日誌、檢查本地 Git 與遠端狀態，最後回報上次進度與建議下一步；不主動 git pull、不修改檔案。
---

# 開工接續助手

新對話或新工作階段開始時，協助使用者快速回到上次工作脈絡。這個技能只讀取與回報，不寫入工作日誌、不 commit、不 push。

## 核心原則

1. 先讀目前資料夾的 `CLAUDE.md`；若沒有，再讀 `AGENTS.md`。
2. 用專案設定檔取得專案名稱、工作日誌路徑、GitHub repo、特殊規則與安全邊界。
3. 不假設專案一定在 GDrive；本機工作桌、雲端同步資料夾、一般 Git repo 都可處理。
4. 不主動 `git pull`；若遠端較新，只回報並詢問使用者是否要拉取。
5. 不修改 Obsidian 工作日誌；寫入是 `shutdown` 的責任。
6. 若找不到工作日誌或遠端驗證被環境擋下，清楚分開「已確認」與「無法即時確認」。

## 開工 SOP

### 步驟 1：辨識工作目錄

- 取得目前工作目錄。
- 檢查是否存在 `.git`。
- 檢查是否存在 `CLAUDE.md` 或 `AGENTS.md`。
- 若沒有 `.git` 且沒有專案設定檔，回報「目前資料夾不像已初始化專案」，建議使用資料夾專案初始化流程。

PowerShell 7+：

```powershell
Get-Location
Test-Path -LiteralPath ".git"
Test-Path -LiteralPath "CLAUDE.md"
Test-Path -LiteralPath "AGENTS.md"
```

### 步驟 2：讀取專案設定

若有 `CLAUDE.md` 或 `AGENTS.md`：
- 讀取工作日誌精確路徑。
- 取出 GitHub repo、Firebase 或其他專案資源。
- 取出本專案安全規則與工作模式。
- 若兩者都存在，`CLAUDE.md` 優先；`AGENTS.md` 可作為補充。

若沒有專案設定檔：
- 從目前資料夾名稱推斷專案名稱。
- 若有已知 vault，嘗試找 `<vault>/<專案名稱>/工作日誌.md`。
- 找不到時只做 Git 狀態檢查，不建立新檔。

### 步驟 3：讀取工作日誌

- 讀工作日誌的「上次做到哪」、「下一步」、「最近活動紀錄」。
- 只摘要，不原樣大量貼出。
- 只有在「踩坑筆記」與下一步直接相關時才引用。

### 步驟 4：檢查本地 Git

PowerShell 7+：

```powershell
git status --short
git branch --show-current
git log -1 --oneline
```

回報：
- 是否乾淨。
- 目前分支。
- 最新本地 commit。
- 若有未 commit 變更，列出檔案層級摘要，不自行清理。

### 步驟 5：檢查遠端

先判斷 `.git/FETCH_HEAD` 是否在 30 分鐘內更新；若不是，再嘗試 fetch。

PowerShell 7+：

```powershell
$fetchHead = Join-Path (Get-Location) ".git\FETCH_HEAD"
$recentFetch = (Test-Path -LiteralPath $fetchHead) -and ((Get-Item -LiteralPath $fetchHead).LastWriteTime -gt (Get-Date).AddMinutes(-30))
if (-not $recentFetch) {
  git fetch origin
}
git rev-list HEAD..@{u} --count
```

注意：
- 若 fetch 或 upstream 查詢被權限、網路或政策擋下，改用本機 refs、`git status -sb`、`.git/config` 回報最高可得證據。
- 不要把「本機追蹤分支看起來對齊」說成「已即時驗證遠端」。

### 步驟 6：回報格式

用精簡結構回報：

```text
專案：<專案名稱>
上次做到哪：<1-2 句摘要>
本地 Git：<乾淨 / 有 N 個未提交變更；分支；最新 commit>
遠端：<已驗證最新 / 落後 N commits / 無法即時驗證，原因>
建議下一步：
1. <最合理的下一步>
2. <可選下一步>

要從哪個方向開始？
```

## 不該做的事

- 不主動 `git pull`。
- 不主動修改工作日誌。
- 不在找不到工作日誌時自行建立。
- 不對只是查詢的對話做 commit 或 push。
- 不把 secrets、`.env`、本機設定或 runtime 目錄加入版本控制。
