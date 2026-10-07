import { useState } from 'react';
import { Settings, X, Download, AlertTriangle, Info } from 'lucide-react';
import itineraryData from '../data/itinerary.json';

export default function ItineraryEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(itineraryData, null, 2));
  const [error, setError] = useState(null);

  // 僅在本地開發環境顯示，Production build 會直接剔除此元件
  if (!import.meta.env.DEV) return null;

  const handleExport = () => {
    try {
      // Validate JSON
      const parsed = JSON.parse(jsonText);
      setError(null);
      
      // Trigger download
      const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'itinerary.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setError("JSON 格式錯誤，請檢查括號或逗號是否遺漏！\n" + e.message);
    }
  };

  return (
    <>
      {/* 浮動編輯按鈕 */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-[#3D3835] text-white p-3.5 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)] hover:scale-105 hover:bg-[#2b2725] transition-all flex items-center justify-center group"
        title="[DEV ONLY] 開啟行程編輯器"
      >
        <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* 編輯器 Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#3D3835]/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-[#F9F6F0] w-full max-w-5xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE5DB] bg-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#3D3835] p-2 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#3D3835]">行程編輯器</h2>
                <span className="bg-[#C96A4E]/10 text-[#C96A4E] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-[#C96A4E]/20">
                  Dev Only
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 text-[#7A726D] hover:bg-[#F9F6F0] rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Instructions */}
            <div className="px-6 py-4 bg-white/50 border-b border-[#EBE5DB] flex gap-3 items-start shrink-0">
              <Info className="w-5 h-5 text-[#C96A4E] shrink-0 mt-0.5" />
              <div className="text-sm text-[#3D3835] space-y-1">
                <p className="font-bold">JSON 撰寫與格式提示：</p>
                <ul className="list-disc pl-4 space-y-1 text-[#7A726D]">
                  <li><strong>餐飲選項：</strong>請使用 <code>or</code> 分隔不同的餐廳（例如：<code>Shake tree or 麵魚</code>），系統會自動拆分成獨立小卡。若要標記素食請加上 <code>(素)</code>。</li>
                  <li><strong>一般內文：</strong>請善用 <code>\n</code> 來斷行，排版會更美觀。</li>
                  <li><strong>覆蓋生效：</strong>點擊下方匯出後，請將下載的檔案直接覆蓋專案中的 <code>src/data/itinerary.json</code>，畫面就會自動更新。</li>
                </ul>
              </div>
            </div>

            {/* Editor */}
            <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3 min-h-0">
              {error && (
                <div className="bg-[#B86B77]/10 text-[#B86B77] border border-[#B86B77]/30 p-3 rounded-lg text-sm font-medium flex items-start gap-2 shrink-0">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <pre className="whitespace-pre-wrap font-sans">{error}</pre>
                </div>
              )}
              <textarea 
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="flex-1 w-full p-5 font-mono text-[13px] leading-relaxed bg-[#2b2725] text-[#EBE5DB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C96A4E]/50 resize-none shadow-inner"
                spellCheck="false"
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#EBE5DB] bg-white flex justify-end shrink-0">
              <button 
                onClick={handleExport}
                className="bg-[#C96A4E] hover:bg-[#b55d44] text-white font-bold py-2.5 px-6 rounded-xl shadow-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                驗證並匯出 JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
