/// <reference types="@cloudflare/workers-types" />

interface Env {
  API_URL: string;
}

interface WeatherAPIResponse {
  current_weather?: {
    temperature: number;
    time: string;
  };
  hourly?: {
    time: string[];
    precipitation: number[];
    cloudcover: number[];
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Headers":
            request.headers.get("Access-Control-Request-Headers") || "",
        },
      });
    }

    const apiUrl =
      `${env.API_URL}?` +
      "latitude=33.5902&longitude=130.4017&current_weather=true" +
      "&hourly=precipitation,cloudcover";

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        return new Response(`Error fetching weather: ${response.statusText}`, {
          status: response.status,
        });
      }

      const data: WeatherAPIResponse = await response.json();

      const currentTime = data.current_weather?.time;
      const hourlyTimes = data.hourly?.time || [];
      const index = hourlyTimes.findIndex((t) => t === currentTime);

      if (
        index === -1 ||
        !data.current_weather ||
        !data.hourly?.precipitation ||
        !data.hourly?.cloudcover
      ) {
        return new Response(
          "Current time not found in hourly data or data is incomplete",
          {
            status: 500,
          },
        );
      }

      const precipitation = data.hourly.precipitation[index];
      const cloudcover = data.hourly.cloudcover[index];

      if (precipitation === undefined || cloudcover === undefined) {
        return new Response("Weather data for current time is incomplete", {
          status: 500,
        });
      }

      const weatherData = {
        temperature: data.current_weather.temperature,
        precipitation,
        cloudcover,
      };

      return new Response(JSON.stringify(weatherData), {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return new Response(`Unexpected error: ${errorMessage}`, { status: 500 });
    }
  },
};
