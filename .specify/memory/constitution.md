# SpecKit Constitution

## Core Principles

### I. 技術棧與架構規範
- **前端框架**：React + Vite
- **CSS 框架**：Tailwind CSS
- **系統架構**：無後端純靜態架構 (Pure Static Architecture)
- **部署標準**：程式碼必須完全符合 Vercel 的靜態部署標準，確保構建過程無礙。

### II. 資安與環境變數規範 (NON-NEGOTIABLE / 絕對禁止違反)
- **零硬編碼金鑰**：絕對禁止將任何 API Key (包含但不限於 OpenWeather API Key) 寫死在程式碼中。
- **禁止提交機密**：絕對不能將真實金鑰 Commit 進 Git 版本控制系統。
- **環境變數管理**：所有機密資訊必須使用 `.env` 檔案管理。在 Vite 中，環境變數需以 `VITE_` 開頭（例如：`VITE_WEATHER_API_KEY`）。
- **Git Ignore 規範**：專案的 `.gitignore` 中必須包含 `.env`、`.env.local` 等機密檔案的過濾規則。
- **範本文件**：必須在專案根目錄建立一個不含真實金鑰的 `.env.example` 檔案，作為開發環境配置的範本。

## Governance

本憲法 (Constitution) 凌駕於專案內所有其他開發慣例。所有的實作、程式碼審查 (Code Review) 及 AI 代理自動生成的程式碼，都必須嚴格遵守上述資安與架構規範。

**Version**: 1.0.0 | **Ratified**: 2026-10-07

### III. 自動化與互動體驗設計規範
- **地理聯動天氣**：天氣模組 (WeatherWidget) 必須與目前的行程標籤 (Tab) 進行連動。若當日行程標題包含特定關鍵字（如「日光」），天氣應動態切換至對應地區（如 `Nikko`），其餘預設為東京（`Tokyo`）。
- **外部連結自動化**：如飯店、住宿等特定資訊卡片（AccommodationCard），必須自動對其名稱進行 URL Encode，並產生前往 Google Maps 的搜尋連結，設定為點擊後開新分頁 (`target="_blank"`) 以提升使用者體驗。
- **航班資訊視覺化**：航班卡片 (FlightCard) 必須具備機票風格的視覺設計，需包含起降時間與機場代碼，並以飛機圖示 (`---✈---`) 呈現飛行路線，同時保留外連至航班追蹤網站的互動性。
