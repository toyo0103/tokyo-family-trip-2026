import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertCircle, MapPin } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!apiKey || apiKey === 'your_openweather_api_key_here') {
        setError('Weather API key not configured.');
        setLoading(false);
        return;
      }

      try {
        // Fetch weather for Tokyo
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&units=metric&appid=${apiKey}`);
        if (!res.ok) throw new Error('Failed to fetch weather data');
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        setError('Unable to load weather information.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (main) => {
    switch (main?.toLowerCase()) {
      case 'clear': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'rain': return <CloudRain className="w-8 h-8 text-blue-500" />;
      default: return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="p-4 bg-white rounded-lg shadow animate-pulse h-24"></div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg shadow-sm flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-orange-500" />
        <div className="text-sm text-orange-800">
          <p className="font-semibold">Weather unavailable</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm border border-blue-100 flex items-center gap-4">
      <div className="flex items-center gap-3">
        {getWeatherIcon(weather?.weather[0]?.main)}
        <div>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{weather?.name}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-800">
              {Math.round(weather?.main?.temp)}°C
            </span>
            <span className="text-xs text-gray-500 capitalize">
              {weather?.weather[0]?.description}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right text-xs text-gray-500 border-l border-blue-200 pl-4 hidden md:block">
        <p>H: {Math.round(weather?.main?.temp_max)}° L: {Math.round(weather?.main?.temp_min)}°</p>
        <p>Humidity: {weather?.main?.humidity}%</p>
      </div>
    </div>
  );
}
