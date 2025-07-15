// Weather.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, Thermometer, Wind, Droplets, Eye, Gauge, MapPin, Calendar, Clock, TrendingUp, Umbrella } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import MapSelector from './MapSelector.tsx';

const WeatherWebsite = () => {
  const [latitude, setLatitude] = useState<number>(14.301793834793234);
  const [longitude, setLongitude] = useState<number>(120.95672712521728);
  // Remove: const [locationName, setLocationName] = useState<string>("SM Dasmarinas, Dasmarinas, Cavite");


// Updated handleLocationChange - just sets coordinates and loading
const handleLocationChange = (lat: number, lng: number) => {
  setLatitude(lat);
  setLongitude(lng);
  setIsLoading(true);
};

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSection, setActiveSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  interface WeatherData {
    current: CurrentWeather;
    hourly: HourlyWeather[];
    daily: DailyWeather[];
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Weather code mapping
interface CurrentWeather {
    temp: number;
    condition: string;
    icon: string;
    location: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    uvIndex: number;
    feelsLike: number;
    visibility?: number;
}

interface HourlyWeather {
    time: Date;
    temp: number;
    condition: string;
    icon: string;
    precipitation: number;
}

interface DailyWeather {
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
}

interface WeatherDescription {
    description: string;
    icon: string;
}

interface WeatherDescriptionsMap {
    [code: number]: WeatherDescription;
}

const weatherDescriptions: WeatherDescriptionsMap = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅️' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Fog', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '💧' },
    53: { description: 'Moderate drizzle', icon: '💧' },
    55: { description: 'Dense drizzle', icon: '💧' },
    56: { description: 'Light freezing drizzle', icon: '🥶' },
    57: { description: 'Dense freezing drizzle', icon: '🥶' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    66: { description: 'Light freezing rain', icon: '🥶' },
    67: { description: 'Heavy freezing rain', icon: '🥶' },
    71: { description: 'Slight snow fall', icon: '❄️' },
    73: { description: 'Moderate snow fall', icon: '❄️' },
    75: { description: 'Heavy snow fall', icon: '❄️' },
    77: { description: 'Snow grains', icon: '❄️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌦️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    85: { description: 'Slight snow showers', icon: '🌨️' },
    86: { description: 'Heavy snow showers', icon: '🌨️' },
    95: { description: 'Thunderstorm', icon: '⚡' },
    96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};

const getWeatherInfo = (code: number): WeatherDescription => {
    return weatherDescriptions[code] || { description: 'Unknown', icon: '❓' };
};

// Updated useEffect - fetches both weather and location name together
useEffect(() => {
  let cancelled = false;
  
  const fetchWeatherAndLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch both weather and location data simultaneously
      const [weatherResponse, locationResponse] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?${new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
          hourly: "temperature_2m,precipitation_probability,weather_code,wind_speed_10m,relative_humidity_2m,surface_pressure,visibility,uv_index,apparent_temperature",
          timezone: "auto",
          forecast_days: "7"
        })}`),
        fetch(`https://us1.locationiq.com/v1/reverse?key=${import.meta.env.VITE_LOCATIONIQ_KEY}&lat=${latitude}&lon=${longitude}&format=json`).catch(() => null)      ]);

      if (!weatherResponse.ok) {
        throw new Error(`HTTP error! status: ${weatherResponse.status}`);
      }

      const weatherData = await weatherResponse.json();
      
      // Process location data
      let newLocationName = "Unknown Location";
      if (locationResponse && locationResponse.ok) {
        try {
          const locationData = await locationResponse.json();
          if (locationData.address) {
            const address = locationData.address;
            newLocationName = address.city || address.town || address.village || address.county || address.state || address.country || locationData.display_name;
          } else if (locationData.display_name) {
            newLocationName = locationData.display_name;
          }
        } catch (err) {
          console.error("Error parsing location data:", err);
        }
      }

      // Update location name immediately
      // setLocationName(newLocationName); // This line is removed as per the edit hint

      // Process weather data
      const currentHour = new Date().getHours();
      const currentWeather = getWeatherInfo(weatherData.hourly.weather_code[currentHour]);
      
      const newWeatherData = {
        current: {
          temp: Math.round(weatherData.hourly.temperature_2m[currentHour]),
          condition: currentWeather.description,
          icon: currentWeather.icon,
          location: newLocationName, // Use the fresh location name
          humidity: Math.round(weatherData.hourly.relative_humidity_2m[currentHour]),
          windSpeed: Math.round(weatherData.hourly.wind_speed_10m[currentHour]),
          pressure: Math.round(weatherData.hourly.surface_pressure[currentHour]),
          visibility: Math.round(weatherData.hourly.visibility[currentHour] / 1000),
          uvIndex: Math.round(weatherData.hourly.uv_index[currentHour]),
          feelsLike: Math.round(weatherData.hourly.apparent_temperature[currentHour])
        } as CurrentWeather,
        hourly: weatherData.hourly.time.map((time: string, i: number): HourlyWeather => {
          const hourlyWeather = getWeatherInfo(weatherData.hourly.weather_code[i]);
          return {
            time: new Date(time),
            temp: Math.round(weatherData.hourly.temperature_2m[i]),
            condition: hourlyWeather.description,
            icon: hourlyWeather.icon,
            precipitation: Math.round(weatherData.hourly.precipitation_probability[i])
          };
        }),
        daily: weatherData.daily.time.map((time: string, i: number): DailyWeather => {
          const dailyWeather = getWeatherInfo(weatherData.daily.weather_code[i]);
          return {
            day: new Date(time).toLocaleDateString('en', { weekday: 'short' }),
            high: Math.round(weatherData.daily.temperature_2m_max[i]),
            low: Math.round(weatherData.daily.temperature_2m_min[i]),
            condition: dailyWeather.description,
            icon: dailyWeather.icon,
            precipitation: Math.round(weatherData.daily.precipitation_probability_max[i])
          };
        })
      };

      if (!cancelled) {
        setWeatherData(newWeatherData);
        setLastFetchTime(Date.now());
        setIsLoading(false);
      }
    } catch (err) {
      if (!cancelled) {
        console.error('Failed to fetch weather data:', err);
        setError('Failed to load weather data. Please try again.');
        setIsLoading(false);
      }
    }
  };

  fetchWeatherAndLocation();
  return () => { cancelled = true; };
}, [latitude, longitude]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sections = [
    { id: 'hero', title: 'Current Weather', icon: Sun }
  ];

  // Helper function to get rain intensity description
  const getRainIntensity = (precipitation: number) => {
    if (precipitation === 0) return { text: 'No Chance  ', color: 'text-green-400', bg: 'bg-green-500' };
    if (precipitation <= 20) return { text: 'Small Chance ', color: 'text-blue-300', bg: 'bg-blue-400' };
    if (precipitation <= 50) return { text: 'Even Chance ', color: 'text-blue-400', bg: 'bg-blue-500' };
    if (precipitation <= 80) return { text: 'Good Chance ', color: 'text-blue-600', bg: 'bg-blue-600' };
    return { text: 'Sure Chance ', color: 'text-red-400', bg: 'bg-red-500' };
  };

  if (isLoading || !weatherData) {
    const nextFetchTime = lastFetchTime ? new Date(lastFetchTime + 30 * 60 * 1000) : null;
    
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-8 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sun className="w-12 h-12 text-sky-400 animate-pulse" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">LOADING WEATHER</h2>
          <p className="text-sky-400 text-xl font-bold">FETCHING LATEST FORECAST...</p>
          {error && <p className="text-red-400 text-lg mt-2">{error}</p>}
          {nextFetchTime && (
            <p className="text-gray-400 text-sm mt-2">Next update: {nextFetchTime.toLocaleTimeString()}</p>
          )}
        </div>
      </div>
    );
  }

  // Get current hour index for hourly data
  const currentHour = new Date().getHours();
  const currentHourlyData = weatherData.hourly.slice(currentHour, currentHour + 24);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b-4 border-sky-400">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/weather.svg" alt="Weather Logo" className="h-12 w-12 object-contain" />
              <h1 className="text-2xl font-black">Ulap Tayo</h1>
            </div>
            <div className="flex space-x-2">
              {sections.map((section, index) => (
                <Button
                  key={section.id}
                  onClick={() => setActiveSection(index)}
                  className={`px-6 py-3 font-black text-sm rounded-none border-2 transition-all duration-300 ${
                    activeSection === index
                      ? 'bg-sky-400 text-black border-sky-400 shadow-[4px_4px_0px_0px_rgba(56,189,248,0.3)]'
                      : 'bg-transparent text-white border-white hover:bg-white hover:text-black'
                  }`}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Map Selector Section */}
      <section className="bg-black relative z-10 mt-24">
        <div className="max-w-full mx-auto">
          <MapSelector onLocationChange={handleLocationChange} initialLatitude={latitude} initialLongitude={longitude} />
        </div>
      </section>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-purple-900 to-black opacity-50"></div>
        
        {/* Animated Background Elements - Static positions */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bg-sky-400 opacity-10 w-64 h-64 left-10 top-20"></div>
          <div className="absolute bg-sky-400 opacity-10 w-48 h-48 right-20 top-40"></div>
          <div className="absolute bg-sky-400 opacity-10 w-32 h-32 left-1/4 bottom-40"></div>
          <div className="absolute bg-sky-400 opacity-10 w-56 h-56 right-1/3 bottom-20"></div>
          <div className="absolute bg-sky-400 opacity-10 w-40 h-40 left-1/2 top-1/3"></div>
          <div className="absolute bg-sky-400 opacity-10 w-72 h-72 right-10 top-10"></div>
          <div className="absolute bg-sky-400 opacity-10 w-24 h-24 left-3/4 bottom-1/3"></div>
          <div className="absolute bg-sky-400 opacity-10 w-60 h-60 left-1/3 top-1/2"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-8xl mb-4 animate-bounce">{weatherData.current.icon}</div>
            <h2 className="text-8xl font-black mb-4 tracking-tighter">
              {weatherData.current.temp}°C
            </h2>
            <p className="text-4xl font-bold text-sky-400 mb-2">
              {weatherData.current.condition}
            </p>
            <div className="flex items-center justify-center space-x-4 text-xl">
              <MapPin className="w-6 h-6 text-sky-400" />
              <span className="font-bold">{weatherData.current.location}</span>
            </div>
          </div>

          {/* Current Time Display */}
          <div className="bg-white/10 backdrop-blur-md border-4 border-sky-400 p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(56,189,248,0.3)] mb-8">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <Clock className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                <p className="text-2xl font-black">
                  {currentTime.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-center">
                <Calendar className="w-8 h-8 text-sky-400 mx-auto mb-2" />
                <p className="text-2xl font-black">
                  {currentTime.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Feels Like", value: `${weatherData.current.feelsLike}°C`, icon: Thermometer },
              { label: "Humidity", value: `${weatherData.current.humidity}%`, icon: Droplets },
              { label: "Wind", value: `${weatherData.current.windSpeed} km/h`, icon: Wind },
              { label: "UV Index", value: weatherData.current.uvIndex, icon: Sun }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-black/50 border-2 border-sky-400 p-4 rounded-none transform hover:scale-105 transition-transform duration-300"
              >
                <stat.icon className="w-6 h-6 text-sky-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-300">{stat.label}</p>
                <p className="text-xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rain Forecast Section */}
      <section className="min-h-screen bg-gradient-to-br from-sky-900 via-slate-800 to-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Umbrella className="w-16 h-16 text-sky-400" />
              <h2 className="text-6xl font-black text-white">RAIN FORECAST</h2>
              <CloudRain className="w-16 h-16 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-sky-400">24-hour precipitation probability starting now</p>
          </div>

          {/* Rain Summary Card */}
          <div className="bg-white/10 backdrop-blur-md border-4 border-sky-400 rounded-none shadow-[8px_8px_0px_0px_rgba(56,189,248,0.5)] p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Droplets className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">CURRENT CHANCE</h3>
                <p className="text-4xl font-black text-sky-400">{currentHourlyData[0]?.precipitation || 0}%</p>
              </div>
              <div>
                <TrendingUp className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">PEAK CHANCE</h3>
                <p className="text-4xl font-black text-sky-400">
                  {Math.max(...currentHourlyData.map(h => h.precipitation))}%
                </p>
              </div>
              <div>
                <Clock className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                <h3 className="text-2xl font-black text-white mb-2">NEXT 24 HOURS</h3>
                <p className="text-4xl font-black text-sky-400">
                  {currentHourlyData.length > 0 ? Math.round(currentHourlyData.reduce((acc, h) => acc + h.precipitation, 0) / 24) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Hourly Rain Chart */}
          <div className="bg-black/50 border-4 border-sky-400 rounded-none shadow-[8px_8px_0px_0px_rgba(56,189,248,0.5)] p-8 mb-12">
            <h3 className="text-4xl font-black text-sky-400 mb-8 text-center">HOURLY RAIN PROBABILITY</h3>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-custom">
              {currentHourlyData.map((hour, index) => {
                const intensity = getRainIntensity(hour.precipitation);
                return (
                  <div key={index} className="flex-shrink-0 w-16 text-center">
                    <div className="mb-2 h-48 flex items-end justify-center">
                      <div 
                        className={`${intensity.bg} rounded-none transition-all duration-300 hover:scale-105 mx-auto`}
                        style={{ height: `${Math.max(hour.precipitation, 5)}%`, width: '1rem' }}
                      ></div>
                    </div>
                    <p className="text-xs font-black text-white mb-1">
                      {hour.time.toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                    </p>
                    <p className={`text-xs font-bold ${intensity.color}`}>
                      {hour.precipitation}%
                    </p>
                  </div>
                );
              })}
            </div>
            
            {/* Rain Intensity Legend */}
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 text-sm font-bold mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-none"></div>
                <span className="text-green-400">No Chance (0%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-sky-400 rounded-none"></div>
                <span className="text-sky-300">Small Chance (1-20%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-sky-500 rounded-none"></div>
                <span className="text-sky-400">Even Chance (21-50%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-sky-600 rounded-none"></div>
                <span className="text-sky-600">Good Chance (51-80%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-none"></div>
                <span className="text-red-400">Sure Chance (81-100%)</span>
              </div>
            </div>
          </div>

          {/* Detailed Hourly Rain Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentHourlyData.map((hour, index) => {
              const intensity = getRainIntensity(hour.precipitation);
              return (
                <Card
                  key={index}
                  className={`bg-black/70 border-4 border-sky-400 rounded-none shadow-[8px_8px_0px_0px_rgba(56,189,248,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(56,189,248,0.5)] transition-all duration-300 transform hover:-translate-y-2`}
                >
                  <CardHeader className="text-center pb-2">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-sky-400" />
                      <CardTitle className="text-xl font-black text-white">
                        {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl mb-4">
                      {hour.precipitation > 50 ? '🌧️' : hour.precipitation > 20 ? '🌦️' : hour.precipitation > 0 ? '🌤️' : '☀️'}
                    </div>
                    <div className="mb-4">
                      <p className="text-3xl font-black text-sky-400 mb-2">{hour.precipitation}%</p>
                      <p className={`text-sm font-bold ${intensity.color}`}>{intensity.text}</p>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-center">
                        <Thermometer className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-400 font-bold">{hour.temp}°C</p>
                      </div>
                      <div className="text-center">
                        <Cloud className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-400 font-bold text-xs">{hour.condition}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Weather Details Section */}
      <section className="min-h-screen bg-sky-400 text-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black mb-4">WEATHER INTELLIGENCE</h2>
            <p className="text-2xl font-bold">Deep dive into atmospheric conditions</p>
          </div>

          {/* Detailed Weather Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "ATMOSPHERIC PRESSURE",
                value: `${weatherData.current.pressure} hPa`,
                icon: Gauge,
                description: `Standard pressure is ~1013 hPa. Lower values can mean rain; higher values suggest clear skies.`,
              },
              {
                title: "VISIBILITY RANGE",
                value: `${weatherData.current.visibility} km`,
                icon: Eye,
                description: `A range over 10 km indicates very clear air, ideal for outdoor activities.`,
              },
              {
                title: "WIND CONDITIONS",
                value: `${weatherData.current.windSpeed} km/h`,
                icon: Wind,
                description: `A light breeze is 6-11 km/h. Stronger winds can make temperatures feel colder.`,
              },
              {
                title: "HUMIDITY LEVEL",
                value: `${weatherData.current.humidity}%`,
                icon: Droplets,
                description: `A comfortable humidity range is 30-60%. High levels can make it feel warmer.`,
              },
              {
                title: "UV RADIATION",
                value: `${weatherData.current.uvIndex}/10`,
                icon: Sun,
                description: `The scale runs from 0 (Low) to 10 (Extreme). Protection like sunscreen is advised at 3+.`,
              },
              {
                title: "THERMAL COMFORT",
                value: `${weatherData.current.feelsLike}°C`,
                icon: Thermometer,
                description: `The 'Feels Like' temperature. This combines air temp, humidity, and wind to reflect how it feels.`,
              }
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-black text-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <item.icon className="w-8 h-8 text-sky-400" />
                  </div>
                  <CardTitle className="text-xl font-black">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-sky-400 mb-4">{item.value}</p>
                  <p className="text-sm font-bold text-gray-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hourly Temperature Forecast */}
          <div className="bg-black border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] p-8">
            <h3 className="text-4xl font-black text-sky-400 mb-8 text-center">TEMPERATURE FORECAST</h3>
            {/* MODIFICATION: Added scrollbar-custom class */}
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-custom">
              {currentHourlyData.map((hour, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 bg-sky-400 text-black border-2 border-black rounded-none p-4 w-32 text-center transform hover:scale-105 transition-transform duration-300"
                >
                  <p className="text-sm font-black mb-2">
                    {hour.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="text-3xl mb-2">{hour.icon}</div>
                  <p className="text-xl font-black mb-1">{hour.temp}°</p>
                  <p className="text-xs font-bold">{hour.precipitation}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extended Forecast Section */}
      <section className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black mb-4 text-white">EXTENDED FORECAST</h2>
            <p className="text-2xl font-bold text-sky-400">7-day weather projection</p>
          </div>

          {/* Daily Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {weatherData.daily.map((day, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border-4 border-sky-400 rounded-none shadow-[8px_8px_0px_0px_rgba(4,16,51,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(255,196,0,0.5)] transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl font-black text-white">{day.day}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl mb-4">{day.icon}</div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-black text-sky-400">{day.high}°</span>
                    <span className="text-xl font-bold text-gray-300">{day.low}°</span>
                  </div>
                  <p className="text-sm font-bold text-white mb-2">{day.condition}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-bold text-sky-400">{day.precipitation}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t-4 border-sky-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-white font-bold">© Ulap Tayo - 2025 - Powered by Open Meteo, OpenStreetMap, and LocationIQ</p>
          <div className="flex justify-center items-center gap-2 mt-2">
            <a
              href="https://github.com/hanzfabellon"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sky-400 hover:text-white transition-colors"
              title="Hanz Fabellon GitHub"
            >
              <FaGithub className="w-6 h-6 mr-1" />
              <span className="font-bold underline">by hanzfabellon</span>
            </a>
          </div>
          <p className="text-sky-400 text-sm mt-2">
            Last weather update: {lastFetchTime ? new Date(lastFetchTime).toLocaleTimeString() : 'Loading...'} | 
            Next weather update: {lastFetchTime ? new Date(lastFetchTime + 30 * 60 * 1000).toLocaleTimeString() : 'Calculating...'}
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* CUSTOM SCROLLBAR STYLES */
        .scrollbar-custom {
          /* For Firefox */
          scrollbar-width: thin;
          scrollbar-color: #38bdf8 transparent; /* thumb color track color */
        }

        /* For Webkit-based browsers (Chrome, Safari, Edge) */
        .scrollbar-custom::-webkit-scrollbar {
          height: 8px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #38bdf8; /* sky-400 */
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb:hover {
          background-color: #0284c7; /* sky-600 */
        }
      `}</style>
    </div>
  );
};

export default WeatherWebsite;