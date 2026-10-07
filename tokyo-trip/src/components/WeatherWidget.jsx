import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertCircle, MapPin } from 'lucide-react';

export default function WeatherWidget({ location = 'Tokyo' }) {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!apiKey || apiKey === 'your_openweather_api_key_here') {
        setError('Weather API key not configured.');
        setLoading(false);
        return;
      }

      try {
        // Fetch weather for the requested location
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError('Unable to load weather information.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const getWeatherIcon = (main) => {
    switch (main?.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-[#C96A4E]" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-[#7A726D]" />;
      default: return <Cloud className="w-8 h-8 text-[#7A726D]" />;
    }
  };

  if (loading) {
    return <div className="p-4 bg-white/40 backdrop-blur-sm rounded-2xl shadow-sm animate-pulse h-16 w-48"></div>;
  }

  if (error) {
    return (
      <div className="p-3 bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-sm flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-[#C96A4E]" />
        <div className="text-xs text-[#3D3835]">
          <p className="font-semibold">Weather unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 px-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-white/50 flex items-center gap-4 transition-all">
      <div className="flex items-center gap-3">
        {getWeatherIcon(weather?.weather[0]?.main)}
        <div>
          <div className="flex items-center gap-1 text-[#7A726D]">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wide">{weather?.name}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-[#3D3835]">
              {Math.round(weather?.main?.temp)}°C
            </span>
            <span className="text-xs text-[#7A726D] capitalize">
              {weather?.weather[0]?.description}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right text-xs text-[#7A726D] border-l border-[#3D3835]/10 pl-4 hidden sm:block">
        <p>H: {Math.round(weather?.main?.temp_max)}° L: {Math.round(weather?.main?.temp_min)}°</p>
        <p>Humidity: {weather?.main?.humidity}%</p>
      </div>
    </div>
  );
}
