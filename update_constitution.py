with open('.specify/memory/constitution.md', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "3. **覆蓋提示說明**：編輯器需明確以註解或提示文字告訴開發者，匯出的 JSON 必須覆蓋專案中的 `src/data/itinerary.json` 檔案才能使變更正式生效。" in line:
        new_lines.append("  4. **標準化區塊**：編輯器須強制每日本預設包含「早上」、「下午」、「晚上」三大區塊，確保 UI 呈現一致。\n")
        new_lines.append("  5. **卡片層級操作**：交通路線、一般內文、餐飲選擇作為區塊內的子卡片，並支援調整順序 (Move Up / Down)。\n")
        new_lines.append("  6. **時間區間標示 (Time Range)**：所有子卡片可選填時間區間，若有填寫，Timeline 應將其特別標示出來（例如 13:00 ~ 13:45）。\n")

with open('.specify/memory/constitution.md', 'w') as f:
    f.writelines(new_lines)
