// src/components/comparison/LocationComparison.tsx
import { useState } from 'react';

const LocationComparison = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const cities = [
    { name: "Berlin", temp: 18.4, humidity: 65, wind: 12.1, precip: 0.2 },
    { name: "London", temp: 16.2, humidity: 72, wind: 14.3, precip: 1.8 },
    { name: "Tokyo", temp: 25.7, humidity: 58, wind: 8.6, precip: 0.0 },
    { name: "New York", temp: 22.1, humidity: 62, wind: 9.4, precip: 0.5 },
    { name: "Singapore", temp: 30.3, humidity: 78, wind: 6.2, precip: 2.1 }
  ];

  return (
    <div
      className="bg-white border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-6 md:p-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Global Weather Comparison</h2>
        <div className="text-sm text-gray-600">Real-time data</div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {cities.map((city, index) => (
          <button
            key={index}
            className={`px-4 py-2 font-bold border-2 border-black ${
              activeTab === index 
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {city.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="border-2 border-black p-4 h-full">
            <h3 className="font-bold text-lg mb-4">Temperature Trends</h3>
            <div className="h-64 flex items-end space-x-2">
              {[20, 18, 22, 19, 25, 23, 21].map((_, index) => (
                <div
                  key={index}
                  className="bg-blue-500 w-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="border-2 border-black p-4">
            <h3 className="font-bold mb-2">Current Conditions</h3>
            <div className="text-4xl mb-2">{cities[activeTab].temp}°C</div>
            <div className="flex justify-between">
              <span>Humidity</span>
              <span className="font-bold">{cities[activeTab].humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span>Wind</span>
              <span className="font-bold">{cities[activeTab].wind} km/h</span>
            </div>
            <div className="flex justify-between">
              <span>Precip</span>
              <span className="font-bold">{cities[activeTab].precip}mm</span>
            </div>
          </div>
          
          <div className="border-2 border-black p-4">
            <h3 className="font-bold mb-2">Travel Advisory</h3>
            <p className="text-sm">
              {cities[activeTab].precip > 1.5 
                ? "⚠️ Carry rain gear, possible travel disruptions" 
                : "✅ Favorable conditions for travel"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationComparison;