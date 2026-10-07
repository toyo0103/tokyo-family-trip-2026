import csv
import json
import re

with open('2026_japan.csv', 'r', encoding='utf-8') as f:
    reader = list(csv.reader(f))

# Find the dates
dates = reader[0]
days_of_week = reader[1]

# We want 7 days: 10/21 to 10/27
# Let's map column indices to dates
date_cols = {}
for i, val in enumerate(dates):
    val = val.strip()
    if val.startswith('10/'):
        date_cols[i] = val

# Let's extract row titles
row_titles = {}
for i, row in enumerate(reader):
    title = row[0].strip() if len(row) > 0 else ''
    if title:
        row_titles[i] = title

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
    
    # Process rows
    current_time_period = None
    
    for row_idx, row in enumerate(reader):
        if row_idx < 2: continue # Skip header
        if len(row) <= col: continue
        
        val = row[col].strip()
        if not val:
            continue
            
        row_label = row[0].strip()
        
        if "CX" in val and "TPE" in val:
            day_data["flight"] = val
            continue
            
        if row_label == "住宿":
            day_data["accommodation"] = val
            continue
            
        if row_label in ["早餐", "早上", "中餐", "下午", "晚餐", "晚上"]:
            current_time_period = row_label
            day_data["schedule"].append({
                "period": current_time_period,
                "activities": [val]
            })
        else:
            # If no row label, it belongs to the previous period
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

    # Clean up title if it was found in the second row
    title_val = reader[2][col].strip() if len(reader[2]) > col else ""
    if title_val and "CX" not in title_val:
        day_data["title"] = title_val

    itinerary.append(day_data)

# Print parsed json
print(json.dumps(itinerary, ensure_ascii=False, indent=2))
