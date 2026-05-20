---
name: shutdown
description: 收工同步助手。當使用者說「收工」、「結束了」、「準備關電腦」、「該同步的同步」、「收到這裡」或要求結束工作並同步專案時使用。此技能適用於 Claude/Claude Code：先讀目前資料夾的 CLAUDE.md 或 AGENTS.md 作為專案設定，盤點本次實質變更，更新 Obsidian 工作日誌，並在確認安全範圍後 git commit + push；若只是討論或沒有實質進度，不做同步。
---

# 收工同步助手

工作告一段落時，把本次實質進度保存到專案指定的位置。這個技能負責寫入與同步，與 `startup` 的讀取流程對偶。

## 核心原則

1. 先讀目前資料夾的 `CLAUDE.md`；若沒有，再讀 `AGENTS.md`。
2. 用專案設定檔取得工作日誌路徑、repo、同步目的地與專案規則。
3. 只有有實質進度時才同步；純討論、純查詢、不涉及檔案或決策變更時，不 commit、不 push。
4. 先盤點再寫入：先看變更、排除 secrets 與本機設定，再更新工作日誌。
5. 只 stage 本次工作相關檔案；不要使用無差別的 `git add .`。
6. 遇到遠端、權限或衝突問題時停止並清楚回報，不用破壞性指令修復。

## 收工 SOP

### 步驟 1：讀取專案設定

若目前資料夾有 `CLAUDE.md` 或 `AGENTS.md`：
- 讀取工作日誌精確路徑。
- 讀取 GitHub repo、Firebase 或其他同步目的地。
- 讀取本專案 commit、secrets、安全與工具目錄規則。
- 若兩者都存在，`CLAUDE.md` 優先；`AGENTS.md` 可作為補充。

若沒有專案設定檔：
- 從目前資料夾與 Git remote 推斷專案資訊。
- 找不到工作日誌時先回報，不自行建立。

### 步驟 2：判斷是否需要收工

盤點本次工作：
- 是否修改、建立或刪除檔案。
- 是否完成可記錄的決策。
- 是否有新的坑、限制或後續 TODO。

若沒有實質進度，回報「本次沒有需要同步的實質變更」，並停止。

### 步驟 3：檢查 Git 變更與敏感資訊風險

PowerShell 7+：

```powershell
git status --short
git diff --stat
git diff --name-only
```

檢查：
- 不 stage `.env`、API keys、密碼、tokens、private keys。
- 不 stage `.claude/settings.local.json`、`.claude/worktrees/`、`node_modules/`、`.venv/`、build output，除非使用者明確要求且理由合理。
- 若發現疑似 secrets，停止並請使用者處理，不把內容寫進回報。

### 步驟 4：更新 Obsidian 工作日誌

更新專案指定的 `工作日誌.md`：
- 「上次做到哪」：改成今天最後狀態、目前脈絡、下一步。
- 「最近活動紀錄」：最前面新增今天日期、本次摘要、涉及檔案或成果。
- 「踩坑筆記」：只有遇到可重複避免的問題時才新增。

寫法要短，重點是下次 `startup` 能讀出可接續資訊。

### 步驟 5：stage、commit、push

先明確列出要 stage 的檔案，再逐一加入：

```powershell
git add -- <本次相關檔案1> <本次相關檔案2>
git status --short
git commit -m "<type>: <清楚描述本次工作>"
git push origin <目前分支>
```

commit message：
- 使用 Conventional Commits。
- 標題要說清楚「做了什麼」。
- 需要正文時，用 2-5 行說明「為什麼」與重要限制。

### 步驟 6：回報同步狀態

用簡表回報：

```text
Obsidian：<已更新 / 未更新，原因>
GitHub：<commit hash + push 狀態 / 未 push，原因>
本地工作區：<乾淨 / 尚有未處理變更>
下次開工建議：<一句話>
```

## 不該做的事

- 不對沒有實質進度的對話 commit。
- 不用 `git add .` 代替判斷。
- 不提交 secrets、本機設定、runtime 目錄或同步工具狀態。
- 不使用 `git reset --hard`、批量刪除或其他破壞性指令。
- 不把未驗證成功的遠端同步說成已完成。
