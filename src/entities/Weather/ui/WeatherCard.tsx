import { useEffect, useState } from "react";
import { getWeatherByCoordinates } from "@/shared/api/weatherApi";
import type { LatLngExpression } from "leaflet";

interface WeatherCardProps {
  location: string;
  coordinates: LatLngExpression;
}

interface WeatherData {
  temp: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
}

export const WeatherCard = ({ location, coordinates }: WeatherCardProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [lat, lon] = coordinates as [number, number];
        const response = await getWeatherByCoordinates(lat, lon);

        setWeatherData({
          temp: Math.round(response.main.temp),
          humidity: response.main.humidity,
          windSpeed: response.wind.speed,
          pressure: response.main.pressure,
          description: response.weather[0].description,
          icon: response.weather[0].icon,
        });
      } catch (err) {
        setError("날씨 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [coordinates]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>날씨 정보를 불러오는 중...</p>
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
    <div className="grid grid-cols-2 gap-6">
      {/* Left Section - Detailed Weather */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">상세 날씨</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">습도</p>
            <p className="text-xl font-semibold mt-1">
              {weatherData.humidity}%
            </p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">풍속</p>
            <p className="text-xl font-semibold mt-1">
              {weatherData.windSpeed} m/s
            </p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">기압</p>
            <p className="text-xl font-semibold mt-1">
              {weatherData.pressure} hPa
            </p>
          </div>
          <div className="bg-[#1C1C1E] rounded-xl p-4">
            <p className="text-gray-400 text-sm">체감온도</p>
            <p className="text-xl font-semibold mt-1">{weatherData.temp}°</p>
          </div>
        </div>
      </div>

      {/* Right Section - Hourly Forecast */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">시간별 예보</h3>
        <div className="grid grid-cols-1 gap-3">
          {["09:00", "12:00", "15:00", "18:00", "21:00"].map((time) => (
            <div
              key={time}
              className="flex items-center justify-between bg-[#1C1C1E] rounded-xl p-4"
            >
              <span className="text-sm">{time}</span>
              <span className="text-2xl">⛅</span>
              <span className="font-medium">{weatherData.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
