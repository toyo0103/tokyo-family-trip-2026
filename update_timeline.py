import re

with open('tokyo-trip/src/components/ItineraryTimeline.jsx', 'r') as f:
    content = f.read()

old_code = """                  <div className="space-y-4">
                    {item.activities.map((activity, actIdx) => {
                      if (activity.type === 'transit') {
                        return <TransitCard key={actIdx} data={activity} />;
                      }
                      if (activity.type === 'food') {
                        return <FoodCard key={actIdx} data={activity} />;
                      }
                      
                      const content = activity.content || activity;
                      return (
                        <div key={actIdx} className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
                          <p className="text-[#3D3835] leading-relaxed whitespace-pre-wrap">{content}</p>
                        </div>
                      );
                    })}
                  </div>"""

new_code = """                  <div className="space-y-4">
                    {item.activities.map((activity, actIdx) => {
                      const timeRange = activity.timeRange;
                      const TimeBadge = timeRange ? (
                        <div className="inline-flex items-center text-[#C96A4E] text-xs font-bold mb-1.5 ml-1 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-full border border-[#C96A4E]/20 shadow-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {timeRange}
                        </div>
                      ) : null;
                      
                      let cardContent = null;
                      if (activity.type === 'transit') {
                        cardContent = <TransitCard data={activity} />;
                      } else if (activity.type === 'food') {
                        cardContent = <FoodCard data={activity} />;
                      } else {
                        const textContent = activity.content || activity;
                        cardContent = (
                          <div className="bg-white border border-[#EBE5DB] rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
                            <p className="text-[#3D3835] leading-relaxed whitespace-pre-wrap">{textContent}</p>
                          </div>
                        );
                      }

                      return (
                        <div key={actIdx} className="relative flex flex-col">
                          {TimeBadge}
                          {cardContent}
                        </div>
                      );
                    })}
                  </div>"""

content = content.replace(old_code, new_code)

if "Clock" not in content[:500]:
    content = content.replace("import { ", "import { Clock, ")

with open('tokyo-trip/src/components/ItineraryTimeline.jsx', 'w') as f:
    f.write(content)

print("Updated Timeline successfully.")
