import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import WeatherWidget from './components/WeatherWidget';
import ItineraryTimeline from './components/ItineraryTimeline';
import PackingList from './components/PackingList';
import ItineraryEditor from './components/ItineraryEditor';
import AutumnLeaves from './components/AutumnLeaves';
import itineraryData from './data/itinerary.json';

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isPackingListOpen, setIsPackingListOpen] = useState(false);
  const activeDay = itineraryData[activeTabIndex];
  const currentLocation = activeDay.title.includes('日光') ? 'Nikko' : 'Tokyo';

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#3D3835] font-sans selection:bg-[#C96A4E]/20 selection:text-[#3D3835]">
      <AutumnLeaves />
      
      {/* Hero Section */}
      <div 
        className="h-64 sm:h-72 flex flex-col items-center justify-center text-white text-center px-4 rounded-b-3xl shadow-md relative"
        style={{
          background: "linear-gradient(135deg, rgba(201, 106, 78, 0.8), rgba(184, 107, 119, 0.8)), url('/niko_banner.jpg') no-repeat center center",
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute top-4 right-4 z-50">
          <WeatherWidget location={currentLocation} dateStr={activeDay.date} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-3" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
          東京・日光の秋
        </h1>
        <p className="text-lg md:text-xl font-light opacity-90 tracking-wide" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
          Wabi-Sabi Autumn Journey
        </p>
      </div>

      {/* Main Content */}
      <main className="-mt-14 relative z-10 px-4">
        <ItineraryTimeline 
          activeTabIndex={activeTabIndex} 
          setActiveTabIndex={setActiveTabIndex} 
        />
      </main>

      {/* FAB for Packing List */}
      <button 
        onClick={() => setIsPackingListOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#C96A4E] text-white p-4 rounded-full shadow-[0_4px_16px_rgba(201,106,78,0.4)] hover:scale-105 hover:bg-[#b55d44] transition-all flex items-center justify-center group"
        title="開啟行李清單"
      >
        <Briefcase className="w-6 h-6 group-hover:animate-bounce" />
      </button>

      <ItineraryEditor />
      <PackingList isOpen={isPackingListOpen} onClose={() => setIsPackingListOpen(false)} />
      
      {/* Footer */}
      <footer className="text-[#7A726D] py-8 text-center text-sm opacity-80">
        <p>Built with React + Vite & Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
