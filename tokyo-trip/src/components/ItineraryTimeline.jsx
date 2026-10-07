import { useState } from 'react';
import { Clock, Plane, Hotel, MapPin, Phone, Info, Train, Bus, Map as MapIcon, ArrowRight } from 'lucide-react';
import itineraryData from '../data/itinerary.json';

const TransitCard = ({ data }) => {
  const isBus = data.method === 'bus' || data.notes?.includes('巴士');
  const Icon = isBus ? Bus : Train;

  // Try to construct a Google Maps URL
  let mapUrl = 'https://www.google.com/maps/dir/?api=1&travelmode=transit';
  if (data.route && data.route.length >= 2) {
    const origin = data.route[0];
    const destination = data.route[data.route.length - 1];
    mapUrl += `&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }

  return (
    <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-4 shadow-sm relative overflow-hidden group">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-100 p-2 rounded-full shrink-0">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {isBus ? 'Bus Transit' : 'Train Transit'}
            </span>
            {data.duration && (
              <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow-sm">
                ⏱ {data.duration}
              </span>
            )}
          </div>
          
          <div className="text-sm text-indigo-800/90 leading-relaxed font-medium">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {data.route.map((seg, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span className="bg-white/60 px-2 py-0.5 rounded shadow-sm border border-indigo-100">{seg}</span>
                  {idx < data.route.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </span>
              ))}
            </div>
            {data.notes && (
              <div className="text-xs text-indigo-500 mt-2">備註：{data.notes}</div>
            )}
          </div>

          <a 
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-indigo-600 bg-indigo-100/50 hover:bg-indigo-200/70 border border-indigo-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <MapIcon className="w-3.5 h-3.5" />
            Google Maps 導航
          </a>
        </div>
      </div>
    </div>
  );
};

const FlightCard = ({ flight }) => {
  if (!flight) return null;
  const flightNumber = flight.number || flight.split('\n')[0];
  const flightRadarUrl = `https://www.flightradar24.com/data/flights/${flightNumber.toLowerCase()}`;

  let depTime = '', depAirport = '', arrTime = '', arrAirport = '';
  
  if (typeof flight === 'object' && flight.raw) {
    const rawParts = flight.raw.split('->');
    if (rawParts.length >= 2) {
      const dep = rawParts[0].trim().split(' ');
      const arr = rawParts[1].trim().split(' ');
      depTime = dep[0] || '';
      depAirport = dep[1] || '';
      arrTime = arr[0] || '';
      arrAirport = arr[1] || '';
    }
  }

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
          <div className="text-xl font-black text-blue-950">{depTime}</div>
          <div className="text-sm font-bold text-blue-600">{depAirport}</div>
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
          <div className="text-xl font-black text-blue-950">{arrTime}</div>
          <div className="text-sm font-bold text-blue-600">{arrAirport}</div>
        </div>
      </div>
    </a>
  );
};

const AccommodationCard = ({ accommodation }) => {
  if (!accommodation) return null;
  
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
                      {item.activities.map((activity, actIdx) => {
                        if (activity.type === 'transit') {
                          return <TransitCard key={actIdx} data={activity} />;
                        }
                        
                        // Handle backward compatibility or text type
                        const content = activity.content || activity;
                        return (
                          <div key={actIdx} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{content}</p>
                          </div>
                        );
                      })}
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
