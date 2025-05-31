// React의 useEffect와 useState 훅을 불러옴
import { useEffect, useState } from "react";

// 날씨 데이터를 좌표로 가져오는 API 함수
import { getWeatherByCoordinates } from "@/shared/api/weatherApi";

// Leaflet 라이브러리의 좌표 타입 (위도, 경도)
import type { LatLngExpression } from "leaflet";

// WeatherCard 컴포넌트의 props 타입 정의
interface WeatherCardProps {
  location: string; // 위치 이름 (예: 서울, 부산 등)
  coordinates: LatLngExpression; // 해당 위치의 위도, 경도
}

// API에서 받아올 날씨 데이터의 형태 정의
interface WeatherData {
  temp: number; // 온도
  humidity: number; // 습도
  windSpeed: number; // 풍속
  pressure: number; // 기압
  description: string; // 날씨 설명 (ex: 구름 조금)
  icon: string; // 날씨 아이콘 코드
}

// WeatherCard 컴포넌트 정의
export const WeatherCard = ({ location, coordinates }: WeatherCardProps) => {
  // 상태 관리: 날씨 데이터 저장
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  // 로딩 상태
  const [loading, setLoading] = useState(true);

  // 에러 메시지 상태
  const [error, setError] = useState<string | null>(null);

  // 컴포넌트가 마운트되거나 coordinates가 바뀔 때 날씨 데이터를 가져옴
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true); // 로딩 시작
        setError(null); // 에러 초기화

        // coordinates는 [위도, 경도] 형태의 배열로 간주
        const [lat, lon] = coordinates as [number, number];

        // 날씨 API 호출
        const response = await getWeatherByCoordinates(lat, lon);

        // 받아온 응답 데이터를 WeatherData 형태로 가공하여 상태에 저장
        setWeatherData({
          temp: Math.round(response.main.temp),
          humidity: response.main.humidity,
          windSpeed: response.wind.speed,
          pressure: response.main.pressure,
          description: response.weather[0].description,
          icon: response.weather[0].icon,
        });
      } catch (err) {
        // 에러 발생 시 에러 메시지 저장
        setError("날씨 정보를 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        // 로딩 종료
        setLoading(false);
      }
    };

    fetchWeatherData(); // 함수 실행
  }, [coordinates]);

  // 로딩 중일 때 UI
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>날씨 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러가 발생했을 때 UI
  if (error) {
    return (
      <div className="text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // 데이터가 아직 없는 경우 아무것도 렌더링하지 않음
  if (!weatherData) return null;

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Section - Detailed Weather */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">{location} 상세 날씨</h3>
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
