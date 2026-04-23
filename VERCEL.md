# Vercel 操作手冊

此專案使用 Vercel 部署。本文件記錄常見操作與設定方式。

---

## 目錄

1. [基本概念](#基本概念)
2. [部署](#部署)
3. [環境變數](#環境變數)
4. [網域](#網域)
5. [部署保護（Deployment Protection）](#部署保護)
6. [GitHub 自動部署](#github-自動部署)
7. [查看 Log 與狀態](#查看-log-與狀態)
8. [常見問題](#常見問題)
9. [常用 CLI 指令速查](#常用-cli-指令速查)

---

## 基本概念

| 名詞 | 說明 |
|------|------|
| **Project** | Vercel 上的專案單位，對應一個 repo |
| **Deployment** | 每次部署產生的獨立快照，有自己的 URL |
| **Production** | 正式環境，對應主要網址 |
| **Preview** | 每個 PR / branch 的預覽環境 |
| **Team** | `pursky7468s-projects`（目前使用的帳號空間） |

**本專案資訊：**
- Project：`personal-website`
- Production URL：https://personal-website-pursky7468s-projects.vercel.app
- GitHub Repo：https://github.com/pursky7468/personal-website

---

## 部署

### 手動部署（CLI）

```bash
# 部署到 Production
vercel deploy --prod

# 部署到 Preview（不影響正式環境）
vercel deploy
```

### 查看部署清單

```bash
vercel ls
```

輸出範例：
```
Age    Deployment URL                                          Status   Environment
5m     https://personal-website-xxx-pursky7468s-projects...   Ready    Production
1d     https://personal-website-yyy-pursky7468s-projects...   Ready    Production
```

### 自動部署（GitHub 連動）

設定後，每次 `git push origin master` 即自動觸發部署。
設定方式見 [GitHub 自動部署](#github-自動部署) 章節。

> **注意：** 自動部署未設定前，push 到 GitHub ≠ 網站更新。
> 必須手動執行 `vercel deploy --prod`。

---

## 環境變數

### 查看目前的環境變數（只顯示名稱，不顯示值）

```bash
vercel env ls
```

### 新增環境變數

```bash
# 新增到 Production
echo "your-value" | vercel env add VARIABLE_NAME production

# 新增到 Preview
echo "your-value" | vercel env add VARIABLE_NAME preview

# 新增到 Development（本地 .env.local 用）
echo "your-value" | vercel env add VARIABLE_NAME development
```

### 刪除環境變數

```bash
vercel env rm VARIABLE_NAME production
```

### 同步到本地

```bash
vercel env pull .env.local
```

### 本專案使用的環境變數

| 變數名稱 | 說明 | 環境 |
|---------|------|------|
| `NEXT_PUBLIC_SITE_URL` | 網站正式 URL，用於 sitemap 和 OG image | Production |

> **注意：** 修改環境變數後，需要重新部署才會生效。

---

## 網域

### 查看網域

```bash
vercel domains ls
```

### 查看 Alias（穩定網址）

```bash
vercel alias ls
```

### 綁定自訂網域（需先購買網域）

```bash
vercel domains add yourdomain.com
```

購買網域後，在網域註冊商的 DNS 設定中加入：
- Type: `CNAME`
- Name: `@` 或 `www`
- Value: `cname.vercel-dns.com`

---

## 部署保護

### 問題現象

用其他裝置（手機、別台電腦）開網站時，出現 Vercel 登入畫面，要求用 GitHub 或 Google 認證。

### 原因

Vercel 的 **Deployment Protection** 功能預設可能開啟，限制只有有 Vercel 帳號的人才能瀏覽。

### 解決方式（Dashboard）

1. 開啟：https://vercel.com/pursky7468s-projects/personal-website/settings/deployment-protection
2. 找到 **Vercel Authentication**
3. 設為 **Off**
4. 儲存

關閉後，任何人無需登入即可瀏覽網站。

---

## GitHub 自動部署

### 設定方式（一次性）

1. 開啟：https://vercel.com/pursky7468s-projects/personal-website/settings/git
2. 點 **Connect Git Repository**
3. 選 **GitHub**
4. 選 `pursky7468/personal-website`
5. 確認

### 設定完成後的行為

| 動作 | 結果 |
|------|------|
| Push 到 `master` | 自動部署到 Production |
| Push 到其他 branch | 自動建立 Preview 部署 |
| 開 Pull Request | 自動產生 Preview URL |

### 確認是否已連動

```bash
vercel project ls
# 若有顯示 GitHub repo 連結即為已設定
```

---

## 查看 Log 與狀態

### 查看即時 Log

```bash
vercel logs <deployment-url> --follow
```

### 查看錯誤 Log

```bash
vercel logs <deployment-url> --level error --since 1h
```

### 查看專案整體狀態

```bash
vercel ls          # 最近部署清單
vercel env ls      # 環境變數清單
vercel domains ls  # 網域清單
```

### 檢查部署詳情

```bash
vercel inspect <deployment-url>
```

輸出包含：Build 時間、框架、Node.js 版本、Region 等。

### Dashboard 查看 Log

https://vercel.com/pursky7468s-projects/personal-website/logs

---

## 常見問題

### Q：push 到 GitHub 後，網站沒有更新？

**原因：** GitHub 尚未連動 Vercel 自動部署。

**解法：**
1. 短期：手動執行 `vercel deploy --prod`
2. 長期：設定 [GitHub 自動部署](#github-自動部署)

---

### Q：修改環境變數後，網站還是舊的？

**原因：** 環境變數修改後需重新部署才生效。

**解法：**
```bash
vercel deploy --prod
```

---

### Q：網站要求 GitHub/Google 登入？

**原因：** Deployment Protection 被開啟。

**解法：** 見 [部署保護](#部署保護) 章節，從 Dashboard 關閉。

---

### Q：本地開發 port 被佔用（EADDRINUSE）？

**原因：** port 3001 有殘留的 node process。

**解法：**
```powershell
# 找到佔用的 PID
netstat -ano | findstr ":3001"

# 強制結束
Stop-Process -Id <PID> -Force
```

---

### Q：Vercel CLI 出現 WARNING Failed to install plugin？

這是安裝 Vercel Claude plugin 失敗的警告，**不影響部署功能**，可忽略。

---

## 常用 CLI 指令速查

```bash
# 部署
vercel deploy --prod          # 部署到 Production
vercel deploy                 # 部署到 Preview

# 狀態查詢
vercel ls                     # 最近部署清單
vercel env ls                 # 環境變數清單
vercel domains ls             # 網域清單
vercel alias ls               # Alias 清單

# 環境變數
vercel env ls                             # 查看
echo "value" | vercel env add KEY prod    # 新增
vercel env rm KEY production              # 刪除
vercel env pull .env.local               # 同步到本地

# Log
vercel logs <url> --follow               # 即時 log
vercel logs <url> --level error          # 錯誤 log

# 連結管理
vercel git connect <github-repo-url>     # 連結 GitHub repo
vercel project ls                        # 查看專案清單
```

---

*最後更新：2026-04-23*
