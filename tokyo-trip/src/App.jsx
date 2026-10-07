import WeatherWidget from './components/WeatherWidget';
import ItineraryTimeline from './components/ItineraryTimeline';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Tokyo & Nikko Trip 2026
          </h1>
          <div className="hidden sm:block">
            <WeatherWidget />
          </div>
        </div>
      </header>

      {/* Mobile Weather Widget */}
      <div className="sm:hidden bg-white px-4 py-3 border-b border-gray-200">
        <WeatherWidget />
      </div>

      {/* Main Content */}
      <main>
        <ItineraryTimeline />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>Built with React + Vite & Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;
