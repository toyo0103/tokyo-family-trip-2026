import csv
import json
import re

with open('2026_japan.csv', 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

# Find the dates
dates = reader[0]
days_of_week = reader[1]

date_cols = {}
for i, val in enumerate(dates):
    val = val.strip()
    if val.startswith('10/'):
        date_cols[i] = val

hotel_db = {
    "東京黎凡特東武酒店 （3星）": {
        "name": "東武ホテルレバント東京",
        "address": "1 Chome-2-2 Kinshi, Sumida City, Tokyo 130-0013日本",
        "phone": "+81356115511",
        "checkIn": "下午3:00",
        "checkOut": "上午11:00"
    },
    "日光中禪寺湖花庵旅館": {
        "name": "日光中禅寺湖温泉 ホテル花庵",
        "address": "2480 Chugushi, Nikko, Tochigi 321-1661日本",
        "phone": "+81288510105",
        "checkIn": "下午3:00",
        "checkOut": "上午11:00"
    }
}

itinerary = []
for col in sorted(date_cols.keys()):
    date = date_cols[col]
    day_of_week = days_of_week[col].strip() if len(days_of_week) > col else ''
    
    day_data = {
        "date": date,
        "dayOfWeek": day_of_week,
        "title": "",
        "flight": None,
        "accommodation": None,
        "schedule": []
    }
    
    current_time_period = None
    
    for row_idx, row in enumerate(reader):
        if row_idx < 2: continue 
        if len(row) <= col: continue
        
        val = row[col].strip()
        if not val: continue
            
        row_label = row[0].strip()
        
        if "CX" in val and "TPE" in val:
            day_data["flight"] = val
            continue
            
        if row_label == "住宿":
            # Map to detailed object if exists, otherwise just string
            day_data["accommodation"] = hotel_db.get(val, {"name": val})
            continue
            
        if row_label in ["早餐", "早上", "中餐", "下午", "晚餐", "晚上"]:
            current_time_period = row_label
            day_data["schedule"].append({
                "period": current_time_period,
                "activities": [val]
            })
        else:
            if current_time_period and len(day_data["schedule"]) > 0:
                day_data["schedule"][-1]["activities"].append(val)
            elif "日光" in val or "迪士尼" in val:
                day_data["title"] = val
            else:
                if "schedule" not in day_data:
                    day_data["schedule"] = []
                if len(day_data["schedule"]) == 0:
                    day_data["schedule"].append({"period": "全天", "activities": [val]})
                else:
                    day_data["schedule"][-1]["activities"].append(val)

    title_val = reader[2][col].strip() if len(reader[2]) > col else ""
    if title_val and "CX" not in title_val:
        day_data["title"] = title_val

    itinerary.append(day_data)

print(json.dumps(itinerary, ensure_ascii=False, indent=2))
