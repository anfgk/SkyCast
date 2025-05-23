import { useEffect, useState } from "react";
import {
  getWeatherByCoordinates,
  getAirQuality,
  getUVIndex,
  getAQIDescription,
  getUVIDescription,
} from "@/shared/api/weatherApi";
import type { LatLngExpression } from "leaflet";
import dayjs from "dayjs";

interface DetailedWeatherCardProps {
  location: string;
  coordinates: LatLngExpression;
}

interface DetailedWeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  aqi: number;
  uvi: number;
  pm25: number;
  pm10: number;
}

export const DetailedWeatherCard = ({
  location,
  coordinates,
}: DetailedWeatherCardProps) => {
  const [weatherData, setWeatherData] = useState<DetailedWeatherData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetailedWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        const [lat, lon] = coordinates as [number, number];

        const [weather, airQuality, uvIndex] = await Promise.all([
          getWeatherByCoordinates(lat, lon),
          getAirQuality(lat, lon),
          getUVIndex(lat, lon),
        ]);

        setWeatherData({
          temp: Math.round(weather.main.temp),
          feelsLike: Math.round(weather.main.feels_like),
          humidity: weather.main.humidity,
          windSpeed: weather.wind.speed,
          pressure: weather.main.pressure,
          description: weather.weather[0].description,
          icon: weather.weather[0].icon,
          sunrise: weather.sys.sunrise,
          sunset: weather.sys.sunset,
          aqi: airQuality.main.aqi,
          uvi: uvIndex.value,
          pm25: airQuality.components.pm2_5,
          pm10: airQuality.components.pm10,
        });
      } catch (err) {
        setError("날씨 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailedWeather();
  }, [coordinates]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>상세 날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{location}</h2>
        <div className="flex items-center justify-center">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
            alt={weatherData.description}
            className="w-24 h-24"
          />
        </div>
        <p className="text-5xl font-bold mt-2">{weatherData.temp}°</p>
        <p className="text-gray-400 mt-2">{weatherData.description}</p>
      </div>

      {/* Detailed Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#1C1C1E] rounded-xl p-4">
          <p className="text-gray-400 text-sm">체감온도</p>
          <p className="text-xl font-semibold mt-1">{weatherData.feelsLike}°</p>
        </div>
        <div className="bg-[#1C1C1E] rounded-xl p-4">
          <p className="text-gray-400 text-sm">습도</p>
          <p className="text-xl font-semibold mt-1">{weatherData.humidity}%</p>
        </div>
        <div className="bg-[#1C1C1E] rounded-xl p-4">
          <p className="text-gray-400 text-sm">기압</p>
          <p className="text-xl font-semibold mt-1">
            {weatherData.pressure} hPa
          </p>
        </div>
        <div className="bg-[#1C1C1E] rounded-xl p-4">
          <p className="text-gray-400 text-sm">풍속</p>
          <p className="text-xl font-semibold mt-1">
            {weatherData.windSpeed} m/s
          </p>
        </div>
      </div>

      {/* Air Quality and UV Index */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">대기질 & 자외선</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">대기질 지수 (AQI)</p>
            <p className="text-xl font-semibold mt-1">
              {getAQIDescription(weatherData.aqi)}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">PM2.5: {weatherData.pm25} µg/m³</p>
              <p className="text-sm">PM10: {weatherData.pm10} µg/m³</p>
            </div>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">자외선 지수 (UVI)</p>
            <p className="text-xl font-semibold mt-1">
              {getUVIDescription(weatherData.uvi)}
            </p>
            <p className="text-sm mt-2">수치: {weatherData.uvi}</p>
          </div>
        </div>
      </div>

      {/* Sunrise/Sunset */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">일출/일몰</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">일출</p>
            <p className="text-xl font-semibold mt-1">
              {dayjs(weatherData.sunrise * 1000).format("HH:mm")}
            </p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">일몰</p>
            <p className="text-xl font-semibold mt-1">
              {dayjs(weatherData.sunset * 1000).format("HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
