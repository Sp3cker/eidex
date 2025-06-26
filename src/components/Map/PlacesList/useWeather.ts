import { useEffect, useState } from "react";

const API_URL = "https://yellow-sunset-856b.specker.workers.dev/";

interface WeatherData {
  temperature: number;
  precipitation: number;
  cloudcover: number;
}

interface UseWeatherResult {
  data: WeatherData | null;
  loading: boolean;
  error: Error | null;
}

export function useWeather(): UseWeatherResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Network response was not ok: ${res.statusText}`);
        }
        return res.json();
      })
      .then((weatherData: WeatherData) => {
        setData(weatherData);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
