// src/app/page.tsx
import React from "react";
import Weather from "./components/weather/Weather";
import Header from "./components/layout/Header.tsx";
import WeatherInsights from "./components/weather/WeatherInsights";
import LocationComparison from "./components/weather/LocationComparison";
import Footer from "./components/layout/Footer.tsx";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <Header />
      
      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            CLIMATIK PRO
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
            Enterprise-grade weather intelligence with predictive analytics and global coverage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <Weather latitude={52.52} longitude={13.41} locationName="Berlin, DE" />
          </div>
          <WeatherInsights />
        </div>

        <LocationComparison />
        
        <div className="mt-16 bg-white border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] p-6 md:p-8">
          <h2 className="text-3xl font-bold mb-6">Advanced Meteorological Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-2 border-black p-4 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-shadow">
              <h3 className="font-bold text-lg mb-2">Atmospheric Physics</h3>
              <p>Real-time analysis of atmospheric pressure systems and their impact on local weather patterns with predictive modeling.</p>
            </div>
            <div className="border-2 border-black p-4 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-shadow">
              <h3 className="font-bold text-lg mb-2">Climate Trends</h3>
              <p>Historical data comparison showing 10-year climate trends and anomaly detection algorithms for predictive insights.</p>
            </div>
            <div className="border-2 border-black p-4 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-shadow">
              <h3 className="font-bold text-lg mb-2">Agricultural Impact</h3>
              <p>GDD (Growing Degree Days) calculations and soil moisture analysis for precision agriculture planning.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}