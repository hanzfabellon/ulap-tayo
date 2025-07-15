// src/components/weather/WeatherIcon.tsx
import React from 'react';

interface WeatherIconProps {
  code: number;
  isDay: boolean;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ code, isDay }) => {
  const getIcon = () => {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code === 1 || code === 2 || code === 3) return isDay ? '🌤️' : '🌥️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌧️';
    if (code === 56 || code === 57) return '🌧️❄️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code === 66 || code === 67) return '🌧️❄️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 85 && code <= 86) return '🌨️';
    if (code === 95 || code === 96 || code === 99) return '⛈️';
    return '❓';
  };

  return (
    <span className="inline-block animate-pulse" style={{ animationDuration: '3s' }}>
      {getIcon()}
    </span>
  );
};

export default WeatherIcon;