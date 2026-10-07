import { useState } from 'react';
import WeatherWidget from './components/WeatherWidget';
import ItineraryTimeline from './components/ItineraryTimeline';
import itineraryData from './data/itinerary.json';

function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeDay = itineraryData[activeTabIndex];
  const currentLocation = activeDay.title.includes('日光') ? 'Nikko' : 'Tokyo';

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#3D3835] font-sans selection:bg-[#C96A4E]/20 selection:text-[#3D3835]">
      
      {/* Hero Section */}
      <div 
        className="h-64 sm:h-72 flex flex-col items-center justify-center text-white text-center px-4 rounded-b-3xl shadow-md relative"
        style={{
          background: "linear-gradient(135deg, rgba(201, 106, 78, 0.8), rgba(184, 107, 119, 0.8)), url('https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop') no-repeat center center",
          backgroundSize: 'cover'
        }}
      >
        <div className="absolute top-4 right-4 z-50">
          <WeatherWidget location={currentLocation} />
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
      
      {/* Footer */}
      <footer className="text-[#7A726D] py-8 text-center text-sm opacity-80">
        <p>Built with React + Vite & Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
