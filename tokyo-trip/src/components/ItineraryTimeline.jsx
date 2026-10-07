import { useState } from 'react';
import { Clock, Plane, Hotel, MapPin, Phone, Info, Train, Bus, Map as MapIcon, ArrowRight, Utensils } from 'lucide-react';
import itineraryData from '../data/itinerary.json';

const TransitCard = ({ data }) => {
  const isBus = data.method === 'bus' || data.notes?.includes('巴士');
  const Icon = isBus ? Bus : Train;

  let mapUrl = 'https://www.google.com/maps/dir/?api=1&travelmode=transit';
  if (data.route && data.route.length >= 2) {
    const origin = data.route[0];
    const destination = data.route[data.route.length - 1];
    mapUrl += `&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
  }

  return (
    <div className="bg-white border border-[#EBE5DB] rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-white bg-[#C96A4E] px-2 py-1 rounded tracking-wider uppercase">
              {isBus ? 'Bus Transit' : 'Train Transit'}
            </span>
            {data.duration && (
              <span className="text-xs text-[#7A726D] font-medium">⏱ {data.duration}</span>
            )}
          </div>
          
          <div className="text-[#3D3835] text-sm leading-relaxed font-medium">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {data.route.map((seg, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  <span>{seg}</span>
                  {idx < data.route.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[#C96A4E]/60 shrink-0" />}
                </span>
              ))}
            </div>
            {data.notes && (
              <div className="text-xs text-[#7A726D] mt-1 opacity-80">備註：{data.notes}</div>
            )}
          </div>
        </div>
        
        {/* Map button at top right */}
        <a 
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 text-[#C96A4E] bg-[#C96A4E]/5 hover:bg-[#C96A4E]/15 rounded-full transition-colors mt-[-4px] mr-[-4px]"
          title="Google Map 導航"
        >
          <MapIcon className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const FoodCard = ({ data }) => {
  if (!data || !data.options || data.options.length === 0) return null;

  // Separate by categories based on the category property (e.g., '葷食', '素食')
  const meatOptions = data.options.filter(opt => !opt.category || !opt.category.includes('素'));
  const vegOptions = data.options.filter(opt => opt.category && opt.category.includes('素'));
  
  return (
    <div className="bg-white border border-[#EBE5DB] rounded-2xl p-4 sm:p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold text-white bg-[#B86B77] px-2 py-1 rounded tracking-wider uppercase">
          Dining Options
        </span>
      </div>
      
      <div className="space-y-4 mt-2">
        {meatOptions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#C96A4E]">
              <Utensils className="w-3.5 h-3.5" />
              葷食選擇 (Meat)
            </div>
            <div className="flex flex-wrap gap-2.5">
              {meatOptions.map((opt, idx) => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opt.name)}`;
                return (
                  <a
                    key={idx}
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white border border-[#EBE5DB] hover:border-[#C96A4E] px-4 py-2 rounded-full text-sm font-medium text-[#3D3835] hover:shadow-sm hover:-translate-y-px transition-all decoration-transparent"
                  >
                    <span>{opt.name}</span>
                    {opt.note && <span className="text-xs text-[#7A726D] font-normal">({opt.note})</span>}
                    <MapIcon className="w-3.5 h-3.5 text-[#C96A4E]/60 ml-0.5" />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {vegOptions.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-[#6C7D63]">
              <Utensils className="w-3.5 h-3.5" />
              素食選擇 (Vegetarian)
            </div>
            <div className="flex flex-wrap gap-2.5">
              {vegOptions.map((opt, idx) => {
                const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(opt.name)}`;
                return (
                  <a
                    key={idx}
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white border border-[#EBE5DB] hover:border-[#6C7D63] px-4 py-2 rounded-full text-sm font-medium text-[#6C7D63] hover:shadow-sm hover:-translate-y-px transition-all decoration-transparent"
                  >
                    <span>{opt.name}</span>
                    {opt.note && <span className="text-xs opacity-70 font-normal">({opt.note})</span>}
                    <MapIcon className="w-3.5 h-3.5 opacity-70 ml-0.5" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
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
      className="bg-[#FFFFFF] border border-[#EBE5DB] rounded-2xl p-4 my-4 flex flex-col hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer block"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-[#3D3835]">{flightNumber}</span>
        <span className="text-xs font-semibold bg-[#B86B77]/10 text-[#B86B77] px-2 py-0.5 rounded-full flex items-center gap-1">
          即時動態
        </span>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="text-center w-16">
          <div className="text-xl font-black text-[#3D3835]">{depTime}</div>
          <div className="text-sm font-bold text-[#7A726D]">{depAirport}</div>
        </div>

        <div className="flex-1 px-4 flex flex-col items-center justify-center">
          <div className="w-full flex items-center opacity-40">
            <div className="h-0.5 bg-[#C96A4E] flex-1 rounded-l-full"></div>
            <Plane className="w-5 h-5 mx-2 text-[#C96A4E]" />
            <div className="h-0.5 bg-[#C96A4E] flex-1 rounded-r-full"></div>
          </div>
        </div>

        <div className="text-center w-16">
          <div className="text-xl font-black text-[#3D3835]">{arrTime}</div>
          <div className="text-sm font-bold text-[#7A726D]">{arrAirport}</div>
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
      className="bg-white border border-[#EBE5DB] rounded-2xl p-4 my-4 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer block group overflow-hidden"
    >
      <Hotel className="w-5 h-5 text-[#C96A4E] mt-1 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#C96A4E] font-semibold uppercase tracking-wider">Accommodation</span>
          <span className="text-[10px] font-semibold bg-[#C96A4E]/10 text-[#C96A4E] px-2 py-1 rounded-full">
            開啟地圖
          </span>
        </div>
        <h4 className="font-bold text-[#3D3835] mt-1 truncate">{name}</h4>
        
        {typeof accommodation === 'object' && accommodation.address && (
          <div className="mt-3 flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2 border-t border-[#EBE5DB] pt-3">
              <div className="flex items-start gap-2 text-sm text-[#7A726D]">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 opacity-70" />
                <span className="leading-tight">{accommodation.address}</span>
              </div>
              {accommodation.phone && (
                <div className="flex items-center gap-2 text-sm text-[#7A726D]">
                  <Phone className="w-4 h-4 shrink-0 opacity-70" />
                  <span>{accommodation.phone}</span>
                </div>
              )}
              {accommodation.checkIn && accommodation.checkOut && (
                <div className="flex items-center gap-2 text-sm text-[#7A726D]">
                  <Info className="w-4 h-4 shrink-0 opacity-70" />
                  <span>Check-in: {accommodation.checkIn} / Check-out: {accommodation.checkOut}</span>
                </div>
              )}
            </div>
            
            {accommodation.image && (
              <div className="w-full md:w-32 h-24 shrink-0 rounded-md overflow-hidden bg-gray-100 border border-[#EBE5DB]">
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
    <div className="max-w-3xl mx-auto py-8">
      {/* Tabs */}
      <div className="mb-8">
        <div className="flex overflow-x-auto gap-4 pb-4 pt-2 px-1" style={{ scrollbarWidth: 'none' }}>
          {itineraryData.map((day, index) => {
            const isActive = index === activeTabIndex;
            return (
              <button
                key={index}
                onClick={() => setActiveTabIndex(index)}
                className={`relative flex-none px-6 py-3 rounded-xl text-sm font-semibold transition-all border
                  ${
                    isActive
                      ? 'bg-white text-[#C96A4E] border-[#C96A4E] shadow-[0_4px_12px_rgba(201,106,78,0.1)]'
                      : 'bg-white text-[#7A726D] border-[#EBE5DB] hover:border-[#C96A4E]/30 hover:text-[#C96A4E]'
                  }`}
                style={isActive ? {} : {}}
              >
                {/* Simulated ticket cutouts using pseudo elements in CSS normally, but we can do it inline or rely on the simple roundness */}
                <div className="whitespace-nowrap">Day {index + 1}</div>
                <div className="text-xs font-normal opacity-80">{day.date}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-12">
        <div className="relative mt-6">
          {/* Timeline Line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-[3px] rounded-full" style={{ background: 'linear-gradient(to bottom, #C96A4E, #B86B77)' }}></div>

          {/* Day Header */}
          <div className="mb-8 pl-12">
            <div className="flex flex-wrap items-end gap-3">
              <h2 className="text-3xl font-black text-[#3D3835] tracking-tight">{activeDay.date}</h2>
              <span className="text-lg font-medium text-[#7A726D] mb-1">({activeDay.dayOfWeek})</span>
              {activeDay.title && (
                <span className="bg-[#FFFFFF] text-[#C96A4E] border border-[#EBE5DB] px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                  {activeDay.title}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="pl-0">
            <div className="pl-12">
              <FlightCard flight={activeDay.flight} />
            </div>
            
            <div className="space-y-8 pb-4">
              {activeDay.schedule.map((item, idx) => (
                <div key={idx} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-[12px] top-0 w-4 h-4 bg-[#F9F6F0] border-[3px] border-[#C96A4E] rounded-full z-10" style={{ borderColor: idx % 2 === 0 ? '#C96A4E' : '#B86B77' }}></div>
                  
                  <div className="flex flex-col mb-2">
                    <span className="text-sm font-bold text-[#7A726D]">
                      {item.period}
                    </span>
                  </div>
                    
                  <div className="space-y-4">
                    {item.activities.map((activity, actIdx) => {
                      const timeRange = activity.timeRange;
                      
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
                        <div key={actIdx} className="relative flex flex-col md:flex-row gap-2 md:gap-4 items-start">
                          {timeRange && (
                            <div className="md:w-28 shrink-0 flex items-center md:pt-4 text-[#7A726D]">
                              <Clock className="w-4 h-4 mr-1.5 opacity-60" />
                              <span className="text-sm font-medium tracking-wide">{timeRange}</span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0 w-full">
                            {cardContent}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pl-12 mt-6">
              <AccommodationCard accommodation={activeDay.accommodation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
