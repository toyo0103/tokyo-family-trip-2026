import { useState } from 'react';
import { Clock, Plane, Hotel } from 'lucide-react';
import itineraryData from '../data/itinerary.json';

const FlightCard = ({ flight }) => {
  if (!flight) return null;
  const lines = flight.split('\n');
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 flex items-start gap-3">
      <Plane className="w-5 h-5 text-blue-600 mt-1" />
      <div>
        <h4 className="font-bold text-blue-800">{lines[0]}</h4>
        <div className="text-sm text-blue-600 mt-1">
          {lines.slice(1).map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
};

const AccommodationCard = ({ accommodation }) => {
  if (!accommodation) return null;
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4 flex items-center gap-3">
      <Hotel className="w-5 h-5 text-amber-600" />
      <div>
        <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Accommodation</span>
        <h4 className="font-bold text-amber-900">{accommodation}</h4>
      </div>
    </div>
  );
};

export default function ItineraryTimeline() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const activeDay = itineraryData[activeTabIndex];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
          {itineraryData.map((day, index) => {
            const isActive = index === activeTabIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveTabIndex(index)}
                className={`flex-none px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Day {index + 1} ({day.date})
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-12">
        <div className="relative">
          {/* Day Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-end gap-3">
              <h2 className="text-3xl font-black text-gray-800 tracking-tight">{activeDay.date}</h2>
              <span className="text-lg font-medium text-gray-500 mb-1">({activeDay.dayOfWeek})</span>
              {activeDay.title && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {activeDay.title}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pl-2 md:pl-4">
            <FlightCard flight={activeDay.flight} />
            
            <div className="relative border-l-2 border-indigo-100 space-y-8 pb-4 ml-2">
              {activeDay.schedule.map((item, idx) => (
                <div key={idx} className="relative pl-6 md:pl-8">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full shadow-sm"></div>
                  
                  <div className="flex flex-col md:flex-row md:gap-4">
                    <div className="md:w-24 shrink-0">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        <Clock className="w-3.5 h-3.5" />
                        {item.period}
                      </span>
                    </div>
                    
                    <div className="mt-3 md:mt-0 flex-1 space-y-3">
                      {item.activities.map((activity, actIdx) => (
                        <div key={actIdx} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="ml-2">
              <AccommodationCard accommodation={activeDay.accommodation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
