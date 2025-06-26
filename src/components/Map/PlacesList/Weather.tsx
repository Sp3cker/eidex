import React from "react";
import { useWeather } from "./useWeather";

const Weather: React.FC = () => {
  const { data, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="font-pkmnem p-2 text-center text-sm">
        Loading weather...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="font-pkmnem p-2 text-center text-sm">
        Error fetching weather data.
      </div>
    );
  }

  // Use a sun emoji if cloudcover is less than 50%, and a cloud emoji otherwise.
  const weatherIcon = data.cloudcover < 50 ? "☼" : "☁️";

  return (
    <div className="font-pkmnem flex items-center space-x-3 rounded bg-gradient-to-br from-emerald-50 via-white to-gray-100 p-4 shadow">
      <span className="text-3xl">{weatherIcon}</span>
      <div className="text-sm">
        <p>Temperature: {data.temperature}°C</p>
        <p>Precipitation: {data.precipitation} mm</p>
        <p>Cloud Coverage: {data.cloudcover}%</p>
      </div>
    </div>
  );
};

export default Weather;
