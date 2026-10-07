import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, CloudSun, CloudSnow, CloudLightning, AlertCircle, MapPin } from 'lucide-react';

// Open-Meteo WMO Weather codes mapping
const getWeatherDetails = (code) => {
  if (code === 0 || code === 1) return { icon: <Sun className="w-8 h-8 text-[#C96A4E]" />, text: '晴天' };
  if (code === 2) return { icon: <CloudSun className="w-8 h-8 text-[#C96A4E]" />, text: '多雲' };
  if (code === 3 || code === 45 || code === 48) return { icon: <Cloud className="w-8 h-8 text-[#7A726D]" />, text: '陰天' };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { icon: <CloudRain className="w-8 h-8 text-[#7A726D]" />, text: '雨天' };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { icon: <CloudSnow className="w-8 h-8 text-[#7A726D]" />, text: '下雪' };
  if (code >= 95 && code <= 99) return { icon: <CloudLightning className="w-8 h-8 text-[#7A726D]" />, text: '雷雨' };
  return { icon: <Cloud className="w-8 h-8 text-[#7A726D]" />, text: '未知' };
};

export default function WeatherWidget({ location = 'Tokyo', dateStr = '10/23' }) {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      // Coordinate mapping
      const coords = location.toLowerCase() === 'nikko' 
        ? { lat: 36.7199, lon: 139.6982, name: '日光 (Nikko)' }
        : { lat: 35.6895, lon: 139.6917, name: '東京 (Tokyo)' };

      try {
        // Fetch 16 days daily forecast from Open-Meteo
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo&forecast_days=16`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        
        // Parse the target date (e.g., '10/23' -> '2026-10-23')
        const [month, day] = dateStr.split('/');
        const targetDate = `2026-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        // Find if target date is within the 16-day forecast
        const dateIndex = data.daily.time.findIndex(t => t === targetDate);

        if (dateIndex !== -1) {
          setWeatherData({
            isTodayFallback: false,
            name: coords.name,
            targetDate,
            maxTemp: Math.round(data.daily.temperature_2m_max[dateIndex]),
            minTemp: Math.round(data.daily.temperature_2m_min[dateIndex]),
            code: data.daily.weather_code[dateIndex]
          });
        } else {
          // Beyond 16 days, fallback to today's weather (index 0)
          setWeatherData({
            isTodayFallback: true,
            name: coords.name,
            targetDate,
            maxTemp: Math.round(data.daily.temperature_2m_max[0]),
            minTemp: Math.round(data.daily.temperature_2m_min[0]),
            code: data.daily.weather_code[0]
          });
        }
      } catch (err) {
        setError('無法取得天氣資訊');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, dateStr]);

  if (loading) {
    return <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm animate-pulse h-16 w-48"></div>;
  }

  if (error) {
    return (
      <div className="p-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#C96A4E]" />
        <div className="text-xs text-[#3D3835]">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  const { icon, text } = getWeatherDetails(weatherData.code);
  const isFallback = weatherData.isTodayFallback;

  return (
    <div 
      className="py-2 px-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/50 flex items-center gap-4 transition-all"
      title={isFallback ? `${dateStr} 超出預報範圍，顯示今日氣溫` : ""}
    >
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="flex items-center gap-1 text-[#7A726D]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wide">{weatherData.name}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#3D3835]">
              {weatherData.maxTemp}°C 
              {isFallback && <span className="text-base font-bold text-[#C96A4E] ml-0.5">*</span>}
            </span>
            <span className="text-xs text-[#7A726D]">
              {text} {isFallback ? '(今日)' : `(${dateStr})`}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right text-xs text-[#7A726D] border-l border-[#3D3835]/10 pl-4 hidden sm:block">
        <p>最高: {weatherData.maxTemp}°</p>
        <p>最低: {weatherData.minTemp}°</p>
      </div>
    </div>
  );
}
