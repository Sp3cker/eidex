import { useWeather } from "./useWeather";

const Weather = ({ periodSymbol }: { periodSymbol: string }) => {
  const { data, loading, error } = useWeather();

  if (loading) {
    return null;
  }

  if (error || !data) {
    return null;
  }

  // Precipitation takes priority over time of day and cloud coverage
  const getWeatherIcon = () => {
    // Check precipitation first - it overrides everything else
    if (data.precipitation >= 4) {
      return "⛈"; // Thunderstorm for heavy rain
    }
    if (data.precipitation >= 0.5) {
      return "☔"; // Rain for any significant precipitation
    }

    // If no significant precipitation, use time-based icons with cloud coverage
    const isCloudy = data.cloudcover >= 50;

    switch (periodSymbol) {
      case "☾": // Night (waning)
      case "☽": // Late night (waxing)
        return isCloudy ? "☾" : "☾✨";
      case "☼": // Sunny afternoon
        return isCloudy ? "⛅" : "☼";
      case "⛅": // Morning/cloudy
      default:
        return isCloudy ? "☁️" : "☼";
    }
  };
  const weatherIcon = getWeatherIcon();
  return (
    <div className="font-pkmnem flex items-center pr-1 tracking-wider fade-in">
      <p>
        {" "}
        {data.temperature}°C
        {weatherIcon}
      </p>
    </div>
  );
};

export default Weather;
