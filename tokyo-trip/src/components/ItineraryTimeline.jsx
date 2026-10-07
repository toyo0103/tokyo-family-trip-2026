import { useState } from 'react';
import { Clock, Plane, Hotel, MapPin, Phone, Info } from 'lucide-react';
import itineraryData from '../data/itinerary.json';

const FlightCard = ({ flight }) => {
  if (!flight) return null;
  const lines = flight.split('\n').map(l => l.trim());
  const flightNumber = lines[0];
  const flightRadarUrl = `https://www.flightradar24.com/data/flights/${flightNumber.toLowerCase()}`;

  // Helper to format "1300 TPE" -> { time: "13:00", airport: "TPE" }
  const parseFlightLine = (line) => {
    if (!line) return { time: '', airport: '' };
    const parts = line.split(' ');
    const rawTime = parts[0];
    const airport = parts[1] || '';
    const time = rawTime.length === 4 ? `${rawTime.slice(0,2)}:${rawTime.slice(2,4)}` : rawTime;
    return { time, airport };
  };

  const departure = parseFlightLine(lines[1]);
  const arrival = parseFlightLine(lines[2]);

  return (
    <a 
      href={flightRadarUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4 flex flex-col hover:bg-blue-100 transition-colors cursor-pointer block"
      title="點擊前往 FlightRadar24 追蹤航班動態"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-blue-900">{flightNumber}</span>
        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
          即時動態
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        {/* Departure */}
        <div className="text-center w-16">
          <div className="text-xl font-black text-blue-950">{departure.time}</div>
          <div className="text-sm font-bold text-blue-600">{departure.airport}</div>
        </div>

        {/* Route Visual */}
        <div className="flex-1 px-4 flex flex-col items-center justify-center">
          <div className="w-full flex items-center">
            <div className="h-0.5 bg-blue-200 flex-1 rounded-l-full"></div>
            <Plane className="w-5 h-5 mx-2 text-blue-500" />
            <div className="h-0.5 bg-blue-200 flex-1 rounded-r-full"></div>
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center w-16">
          <div className="text-xl font-black text-blue-950">{arrival.time}</div>
          <div className="text-sm font-bold text-blue-600">{arrival.airport}</div>
        </div>
      </div>
    </a>
  );
};

const AccommodationCard = ({ accommodation }) => {
  if (!accommodation) return null;
  
  // Backward compatibility in case it's still just a string
  const name = typeof accommodation === 'string' ? accommodation : accommodation.name;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
  
  return (
    <a 
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4 flex items-start gap-4 hover:bg-amber-100 transition-colors cursor-pointer block group overflow-hidden"
    >
      <Hotel className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Accommodation</span>
          <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            開啟地圖
          </span>
        </div>
        <h4 className="font-bold text-amber-900 mt-0.5 truncate">{name}</h4>
        
        {typeof accommodation === 'object' && accommodation.address && (
          <div className="mt-3 flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2 border-t border-amber-200/60 pt-2">
              <div className="flex items-start gap-2 text-sm text-amber-800">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                <span className="leading-tight">{accommodation.address}</span>
              </div>
              {accommodation.phone && (
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <Phone className="w-4 h-4 shrink-0 opacity-70" />
                  <span>{accommodation.phone}</span>
                </div>
              )}
              {accommodation.checkIn && accommodation.checkOut && (
                <div className="flex items-center gap-2 text-sm text-amber-800">
                  <Info className="w-4 h-4 shrink-0 opacity-70" />
                  <span>Check-in: {accommodation.checkIn} / Check-out: {accommodation.checkOut}</span>
                </div>
              )}
            </div>
            
            {/* 圖片區塊 (如果 JSON 有提供 image) */}
            {accommodation.image && (
              <div className="w-full md:w-32 h-24 shrink-0 rounded-md overflow-hidden bg-amber-100 border border-amber-200">
                <img 
                  src={accommodation.image} 
                  alt={name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
};

export default function ItineraryTimeline({ activeTabIndex, setActiveTabIndex }) {
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
