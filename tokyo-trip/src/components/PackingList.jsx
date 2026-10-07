import { useState, useEffect } from 'react';
import { Check, X, Plus, Trash2, Briefcase } from 'lucide-react';
import defaultChecklist from '../data/checklist.json';

const LOCAL_STORAGE_KEY = 'tokyo_trip_packing_list_v2';

export default function PackingList({ isOpen, onClose }) {
  const [listData, setListData] = useState([]);
  const [newItemText, setNewItemText] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setListData(JSON.parse(saved));
      } catch (e) {
        initializeDefault();
      }
    } else {
      initializeDefault();
    }
  }, []);

  const initializeDefault = () => {
    // Initialize with default checklist and all items unchecked
    const initial = defaultChecklist.map(cat => ({
      category: cat.category,
      items: cat.items.map(name => ({ name, checked: false }))
    }));
    setListData(initial);
  };

  useEffect(() => {
    if (listData.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listData));
    }
  }, [listData]);

  const toggleItem = (catIndex, itemIndex) => {
    const newList = [...listData];
    newList[catIndex].items[itemIndex].checked = !newList[catIndex].items[itemIndex].checked;
    setListData(newList);
  };

  const deleteItem = (catIndex, itemIndex) => {
    const newList = [...listData];
    newList[catIndex].items.splice(itemIndex, 1);
    setListData(newList);
  };

  const addItem = (catIndex) => {
    const text = newItemText[catIndex]?.trim();
    if (!text) return;
    const newList = [...listData];
    newList[catIndex].items.push({ name: text, checked: false });
    setListData(newList);
    setNewItemText({ ...newItemText, [catIndex]: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#3D3835]/40 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4 transition-all">
      <div className="bg-[#F9F6F0] w-full h-[85vh] sm:h-[80vh] sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#EBE5DB] shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#C96A4E]" />
            <h2 className="text-xl font-bold text-[#3D3835]">行前打包清單</h2>
          </div>
          <button onClick={onClose} className="p-2 text-[#7A726D] hover:bg-[#F9F6F0] rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-20">
          {listData.map((category, catIndex) => {
            const completedCount = category.items.filter(i => i.checked).length;
            const totalCount = category.items.length;
            const allDone = totalCount > 0 && completedCount === totalCount;
            
            return (
              <div key={catIndex} className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm transition-all">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-[#C96A4E] text-lg">{category.category}</h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${allDone ? 'bg-[#6C7D63]/10 text-[#6C7D63]' : 'bg-[#F9F6F0] text-[#7A726D]'}`}>
                    {completedCount} / {totalCount}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center group">
                      <label className="flex items-center flex-1 cursor-pointer gap-3 p-2 hover:bg-[#F9F6F0] rounded-lg transition-colors">
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={item.checked} 
                          onChange={() => toggleItem(catIndex, itemIndex)} 
                        />
                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${item.checked ? 'bg-[#6C7D63] border-[#6C7D63]' : 'border-[#C96A4E]/40 bg-white'}`}>
                          {item.checked && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <span className={`text-sm select-none transition-all ${item.checked ? 'text-[#7A726D] line-through opacity-60' : 'text-[#3D3835]'}`}>
                          {item.name}
                        </span>
                      </label>
                      <button 
                        onClick={() => deleteItem(catIndex, itemIndex)}
                        className="p-2 text-[#7A726D]/50 hover:text-[#B86B77] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity rounded-full focus:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add item input */}
                <div className="mt-3 flex items-center gap-2 px-2">
                  <input 
                    type="text" 
                    placeholder="新增自訂項目..."
                    value={newItemText[catIndex] || ''}
                    onChange={(e) => setNewItemText({...newItemText, [catIndex]: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && addItem(catIndex)}
                    className="flex-1 bg-[#F9F6F0] border border-transparent focus:border-[#C96A4E]/30 text-sm rounded-lg px-3 py-2 text-[#3D3835] placeholder:text-[#7A726D]/50 outline-none transition-colors"
                  />
                  <button 
                    onClick={() => addItem(catIndex)}
                    disabled={!newItemText[catIndex]?.trim()}
                    className="p-2 bg-[#C96A4E]/10 text-[#C96A4E] hover:bg-[#C96A4E]/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
