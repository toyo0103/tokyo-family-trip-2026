import { useState } from 'react';
import { Settings, X, Download, Plus, Trash2, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import initialData from '../data/itinerary.json';

// Ensure all days have 早上, 下午, 晚上
const ensureStandardPeriods = (data) => {
  return data.map(day => {
    const standardPeriods = ['早上', '下午', '晚上'];
    const newSchedule = standardPeriods.map(periodName => {
      const existing = day.schedule?.find(s => s.period === periodName) || 
                       // Attempt to map old ones like 晚餐 to 晚上
                       (periodName === '晚上' && day.schedule?.find(s => s.period === '晚餐'));
                       
      return {
        period: periodName,
        activities: existing ? existing.activities || [] : []
      };
    });
    return { ...day, schedule: newSchedule };
  });
};

export default function ItineraryEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [itinerary, setItinerary] = useState(() => ensureStandardPeriods(initialData));
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  if (!import.meta.env.DEV) return null;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'itinerary.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateDay = (field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[activeDayIdx][field] = value;
    setItinerary(newItinerary);
  };

  const updateActivity = (periodIdx, actIdx, field, value) => {
    const newItinerary = [...itinerary];
    newItinerary[activeDayIdx].schedule[periodIdx].activities[actIdx][field] = value;
    setItinerary(newItinerary);
  };

  const addActivity = (periodIdx, type) => {
    const newItinerary = [...itinerary];
    const base = type === 'text' ? { type: 'text', content: '', timeRange: '' } :
                 type === 'transit' ? { type: 'transit', method: 'train', route: [''], duration: '', notes: '', timeRange: '' } :
                 type === 'spot' ? { type: 'spot', title: '', locations: [''], note: '', timeRange: '' } :
                 { type: 'food', options: [], timeRange: '' };
    newItinerary[activeDayIdx].schedule[periodIdx].activities.push(base);
    setItinerary(newItinerary);
  };

  const removeActivity = (periodIdx, actIdx) => {
    const newItinerary = [...itinerary];
    newItinerary[activeDayIdx].schedule[periodIdx].activities.splice(actIdx, 1);
    setItinerary(newItinerary);
  };

  const moveActivity = (periodIdx, actIdx, direction) => {
    const newItinerary = [...itinerary];
    const activities = newItinerary[activeDayIdx].schedule[periodIdx].activities;
    if (direction === 'up' && actIdx > 0) {
      [activities[actIdx - 1], activities[actIdx]] = [activities[actIdx], activities[actIdx - 1]];
    } else if (direction === 'down' && actIdx < activities.length - 1) {
      [activities[actIdx + 1], activities[actIdx]] = [activities[actIdx], activities[actIdx + 1]];
    }
    setItinerary(newItinerary);
  };

  const activeDay = itinerary[activeDayIdx] || {};

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#3D3835] text-white p-3.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:scale-105 transition-all"
        title="[DEV ONLY] 開啟行程編輯器"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#F9F6F0] w-full max-w-6xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBE5DB]">
              <h2 className="text-xl font-bold text-[#3D3835]">視覺化行程編輯器 (GUI Mode)</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar - Days */}
              <div className="w-48 bg-white border-r border-[#EBE5DB] overflow-y-auto">
                {itinerary.map((day, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveDayIdx(idx)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 font-semibold ${idx === activeDayIdx ? 'bg-[#C96A4E]/10 text-[#C96A4E]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    Day {idx + 1} <span className="text-xs font-normal opacity-70">({day.date})</span>
                  </button>
                ))}
              </div>

              {/* Editor Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Info */}
                <div className="bg-white p-4 rounded-xl border border-[#EBE5DB] space-y-4">
                  <h3 className="font-bold text-gray-800 border-b pb-2">基本資訊</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">日期 (MM/DD)</label>
                      <input className="w-full border rounded p-2 text-sm" value={activeDay.date} onChange={e => updateDay('date', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">星期</label>
                      <input className="w-full border rounded p-2 text-sm" value={activeDay.dayOfWeek} onChange={e => updateDay('dayOfWeek', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">標題</label>
                      <input className="w-full border rounded p-2 text-sm" value={activeDay.title || ''} onChange={e => updateDay('title', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                {activeDay.schedule?.map((periodData, pIdx) => (
                  <div key={pIdx} className="bg-white p-4 rounded-xl border border-[#EBE5DB] space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-[#C96A4E] text-lg">{periodData.period}</span>
                    </div>
                    
                    <div className="space-y-4">
                      {periodData.activities.map((act, aIdx) => (
                        <div key={aIdx} className="relative bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                          {/* Actions */}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button onClick={() => moveActivity(pIdx, aIdx, 'up')} disabled={aIdx === 0} className="p-1 text-gray-400 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowUp className="w-4 h-4"/></button>
                            <button onClick={() => moveActivity(pIdx, aIdx, 'down')} disabled={aIdx === periodData.activities.length - 1} className="p-1 text-gray-400 hover:bg-gray-200 rounded disabled:opacity-30"><ArrowDown className="w-4 h-4"/></button>
                            <button onClick={() => removeActivity(pIdx, aIdx)} className="p-1 text-red-400 hover:bg-red-50 rounded ml-2"><Trash2 className="w-4 h-4"/></button>
                          </div>
                          
                          {/* Common Time Range */}
                          <div className="mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <input 
                              className="border rounded px-2 py-1 text-sm w-36" 
                              placeholder="時間 e.g. 13:00~13:45" 
                              value={act.timeRange || ''} 
                              onChange={e => updateActivity(pIdx, aIdx, 'timeRange', e.target.value)} 
                            />
                            <span className="text-xs text-gray-400">(選填)</span>
                          </div>

                          {/* Text Type */}
                          {act.type === 'text' && (
                            <div>
                              <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-gray-600 mb-2 inline-block">一般內文</span>
                              <textarea 
                                className="w-full border rounded p-2 text-sm mt-1 min-h-[80px]" 
                                value={act.content || ''} 
                                onChange={e => updateActivity(pIdx, aIdx, 'content', e.target.value)} 
                                placeholder="輸入行程描述..."
                              />
                            </div>
                          )}

                          {/* Transit Type */}
                          {act.type === 'transit' && (
                            <div className="space-y-3">
                              <span className="text-xs font-bold bg-blue-100 px-2 py-1 rounded text-blue-600 inline-block">交通路線</span>
                              <div className="flex gap-4">
                                <div>
                                  <label className="block text-xs text-gray-500">方式</label>
                                  <select className="border rounded p-1.5 text-sm" value={act.method} onChange={e => updateActivity(pIdx, aIdx, 'method', e.target.value)}>
                                    <option value="train">火車 (Train)</option>
                                    <option value="bus">巴士 (Bus)</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500">耗時</label>
                                  <input className="border rounded p-1.5 text-sm w-24" placeholder="e.g. 40 min" value={act.duration || ''} onChange={e => updateActivity(pIdx, aIdx, 'duration', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs text-gray-500">備註</label>
                                  <input className="border rounded p-1.5 text-sm w-full" value={act.notes || ''} onChange={e => updateActivity(pIdx, aIdx, 'notes', e.target.value)} />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">路線站點 (以逗號分隔)</label>
                                <input 
                                  className="w-full border rounded p-2 text-sm" 
                                  value={(act.route || []).join(', ')} 
                                  onChange={e => updateActivity(pIdx, aIdx, 'route', e.target.value.split(',').map(s=>s.trim()))} 
                                />
                              </div>
                            </div>
                          )}

                                                    {/* Spot Type */}
                          {act.type === 'spot' && (
                            <div>
                              <span className="text-xs font-bold bg-emerald-100 px-2 py-1 rounded text-emerald-600 inline-block mb-2">地點景點</span>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">標題 (必填)</label>
                                  <input className="w-full border rounded p-2 text-sm" value={act.title || ''} onChange={e => updateActivity(pIdx, aIdx, 'title', e.target.value)} placeholder="e.g. 買隔天早餐" />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">地點 (以逗號分隔，自動帶入 Google Maps 連結)</label>
                                  <input 
                                    className="w-full border rounded p-2 text-sm" 
                                    value={(act.locations || []).join(', ')} 
                                    onChange={e => updateActivity(pIdx, aIdx, 'locations', e.target.value.split(',').map(s=>s.trim()))} 
                                    placeholder="e.g. 西友超市, LIFE Arcakit"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">備註 (Note, 選填)</label>
                                  <input className="w-full border rounded p-2 text-sm" value={act.note || ''} onChange={e => updateActivity(pIdx, aIdx, 'note', e.target.value)} placeholder="e.g. 提醒：正哲、阿元可能要買後面兩天晚餐" />
                                </div>
                              </div>
                            </div>
                          )}

{/* Food Type */}
                          {act.type === 'food' && (
                            <div>
                              <span className="text-xs font-bold bg-rose-100 px-2 py-1 rounded text-rose-600 inline-block mb-2">餐飲選擇</span>
                              <div className="space-y-2">
                                {act.options?.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex gap-2 items-center">
                                    <input className="border rounded p-1.5 text-sm flex-1" placeholder="餐廳名稱" value={opt.name} onChange={e => {
                                      const newIt = [...itinerary];
                                      newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options[oIdx].name = e.target.value;
                                      setItinerary(newIt);
                                    }}/>
                                    <select className="border rounded p-1.5 text-sm w-24" value={opt.category || ''} onChange={e => {
                                      const newIt = [...itinerary];
                                      newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options[oIdx].category = e.target.value;
                                      setItinerary(newIt);
                                    }}>
                                      <option value="">一般(葷)</option>
                                      <option value="素食">素食</option>
                                    </select>
                                    <input className="border rounded p-1.5 text-sm flex-1" placeholder="備註" value={opt.note || ''} onChange={e => {
                                      const newIt = [...itinerary];
                                      newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options[oIdx].note = e.target.value;
                                      setItinerary(newIt);
                                    }}/>
                                    <button onClick={() => {
                                      const newIt = [...itinerary];
                                      newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options.splice(oIdx, 1);
                                      setItinerary(newIt);
                                    }} className="p-1 text-red-400 hover:bg-red-50 rounded"><X className="w-4 h-4"/></button>
                                  </div>
                                ))}
                                <button onClick={() => {
                                  const newIt = [...itinerary];
                                  if(!newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options) newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options = [];
                                  newIt[activeDayIdx].schedule[pIdx].activities[aIdx].options.push({name:'', category:''});
                                  setItinerary(newIt);
                                }} className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded">+ 新增餐廳</button>
                              </div>
                            </div>
                          )}

                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t mt-4">
                      <span className="text-xs text-gray-400 self-center mr-2">新增小卡片:</span>
                      <button onClick={() => addActivity(pIdx, 'text')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded font-medium text-gray-700">+ 一般內文</button>
                      <button onClick={() => addActivity(pIdx, 'transit')} className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded font-medium">+ 交通路線</button>
                      <button onClick={() => addActivity(pIdx, 'food')} className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded font-medium">+ 餐飲選擇</button>
                      <button onClick={() => addActivity(pIdx, 'spot')} className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded font-medium">+ 地點景點</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#EBE5DB] bg-white flex justify-between shrink-0">
              <span className="text-sm text-gray-500 self-center">編輯完成後，請點擊匯出並覆蓋 <code>src/data/itinerary.json</code></span>
              <button onClick={handleExport} className="bg-[#C96A4E] hover:bg-[#b55d44] text-white font-bold py-2 px-6 rounded-lg shadow-sm flex items-center gap-2">
                <Download className="w-4 h-4" /> 匯出 JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
