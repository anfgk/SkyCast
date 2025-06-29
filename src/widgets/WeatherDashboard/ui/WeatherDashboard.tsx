import { useState, useEffect } from "react";
import { WeatherCard } from "@/entities/Weather";
import { DetailedWeatherCard } from "@/entities/Weather/ui/DetailedWeatherCard";
import { MAJOR_CITIES } from "@/shared/config/cities";
import type { City } from "@/shared/config/cities";
import { getWeatherByCoordinates, getDailyForecast, capitalizeFirstLetter } from "@/shared/api/weatherApi";
import {
  ChevronDownIcon,
  SunIcon,
  MapPinIcon,
  ClockIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useFavoriteStore } from "@/shared/store/favoriteStore";

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
}

interface DailyWeatherData {
  dt: number;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  dt_txt: string;
}

export const WeatherDashboard = () => {
  const [selectedCity, setSelectedCity] = useState<City>(MAJOR_CITIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [dailyData, setDailyData] = useState<DailyWeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [hasSelectedCity, setHasSelectedCity] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'favorites' | 'map' | 'time' | 'chart'>('home');
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useFavoriteStore();

  // 선택된 도시의 날씨 데이터 가져오기
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const [lat, lon] = selectedCity.coordinates as [number, number];
        const response = await getWeatherByCoordinates(lat, lon);
        
        setWeatherData({
          temp: Math.round(response.main.temp),
          description: capitalizeFirstLetter(response.weather[0].description),
          icon: response.weather[0].icon,
        });
      } catch (error) {
        console.error("날씨 정보를 가져오는데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDailyData = async () => {
      try {
        setDailyLoading(true);
        const [lat, lon] = selectedCity.coordinates as [number, number];
        const response = await getDailyForecast(lat, lon);
        
        // 3시간마다의 데이터를 일별로 그룹화
        const dailyGrouped = groupByDay(response.list);
        setDailyData(dailyGrouped);
      } catch (error) {
        console.error("5일 예보를 가져오는데 실패했습니다:", error);
      } finally {
        setDailyLoading(false);
      }
    };

    fetchWeatherData();
    fetchDailyData();

    // 10분마다 날씨 데이터 자동 업데이트
    const weatherInterval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    const dailyInterval = setInterval(fetchDailyData, 30 * 60 * 1000); // 30분마다 예보 업데이트

    return () => {
      clearInterval(weatherInterval);
      clearInterval(dailyInterval);
    };
  }, [selectedCity]);

  // 3시간마다의 데이터를 일별로 그룹화하는 함수
  const groupByDay = (forecastList: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    
    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = [];
      }
      grouped[dayKey].push(item);
    });

    // 각 일의 대표 데이터 (12시 데이터 또는 첫 번째 데이터) 반환
    return Object.values(grouped).map(dayData => {
      // 12시 데이터가 있으면 그것을, 없으면 첫 번째 데이터 사용
      const noonData = dayData.find((item: any) => {
        const hour = new Date(item.dt * 1000).getHours();
        return hour >= 11 && hour <= 13;
      });
      
      const representativeData = noonData || dayData[0];
      
      return {
        dt: representativeData.dt,
        temp: representativeData.main.temp,
        temp_min: Math.min(...dayData.map((item: any) => item.main.temp_min)),
        temp_max: Math.max(...dayData.map((item: any) => item.main.temp_max)),
        humidity: representativeData.main.humidity,
        weather: representativeData.weather,
        dt_txt: representativeData.dt_txt,
      };
    });
  };

  const handleFavoriteClick = (city: City) => {
    if (isFavorite(city.name)) {
      removeFavorite(city.name);
    } else {
      addFavorite(city);
    }
  };

  const handleHomeClick = () => {
    setShowFavorites(false);
    setSelectedCity(MAJOR_CITIES[0]);
    setIsDropdownOpen(false);
    setActiveTab('home');
  };

  const handleFavoritesClick = () => {
    setShowFavorites(!showFavorites);
    if (!showFavorites && favorites.length > 0) {
      setSelectedCity(favorites[0]);
    }
    setActiveTab('favorites');
  };

  const handleMapClick = () => {
    setActiveTab('map');
  };

  const handleTimeClick = () => {
    setActiveTab('time');
  };

  const handleChartClick = () => {
    setActiveTab('chart');
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
    setHasSelectedCity(true);
  };

  const displayCities = showFavorites ? favorites : MAJOR_CITIES;

  // 날씨 아이콘을 이모지로 변환하는 함수
  const getWeatherEmoji = (iconCode: string) => {
    const iconMap: { [key: string]: string } = {
      "01d": "☀️", // 맑음 (낮)
      "01n": "🌙", // 맑음 (밤)
      "02d": "⛅", // 구름 조금 (낮)
      "02n": "☁️", // 구름 조금 (밤)
      "03d": "☁️", // 구름 많음
      "03n": "☁️",
      "04d": "☁️", // 흐림
      "04n": "☁️",
      "09d": "🌧️", // 소나기
      "09n": "🌧️",
      "10d": "🌦️", // 비 (낮)
      "10n": "🌧️", // 비 (밤)
      "11d": "⛈️", // 천둥번개
      "11n": "⛈️",
      "13d": "🌨️", // 눈
      "13n": "🌨️",
      "50d": "🌫️", // 안개
      "50n": "🌫️",
    };
    return iconMap[iconCode] || "⛅";
  };

  // 날짜를 요일로 변환하는 함수
  const getDayOfWeek = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
  };

  return (
    <div className="h-full grid grid-cols-[80px_1fr] gap-4 p-4">
      {/* Sidebar */}
      <div className="bg-[#242426] rounded-2xl p-3 flex flex-col items-center pt-8">
        <button
          onClick={handleHomeClick}
          className={`transition-colors ${
            activeTab === 'home' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <SunIcon className="w-6 h-6" />
        </button>
        <nav className="flex flex-col gap-4 items-center flex-1 gap-8 pt-8">
          <button
            className={`transition-colors ${
              activeTab === 'favorites' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={handleFavoritesClick}
          >
            <StarSolid className="w-6 h-6" />
          </button>
          <button 
            className={`transition-colors ${
              activeTab === 'map' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={handleMapClick}
          >
            <MapPinIcon className="w-6 h-6" />
          </button>
          <button 
            className={`transition-colors ${
              activeTab === 'time' ? 'text-green-400' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={handleTimeClick}
          >
            <ClockIcon className="w-6 h-6" />
          </button>
          <button 
            className={`transition-colors ${
              activeTab === 'chart' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={handleChartClick}
          >
            <ChartBarIcon className="w-6 h-6" />
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Header with City Selector */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#242426] rounded-xl px-4 py-2 hover:bg-[#2a2a2c] transition-colors"
            >
              <span>{hasSelectedCity ? selectedCity.name : "모든 도시"}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* City Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#242426] rounded-xl shadow-lg py-2 z-10">
                {displayCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-4 py-2 hover:bg-[#2a2a2c] flex items-center justify-between"
                  >
                    <span
                      className={
                        selectedCity.name === city.name ? "text-blue-400" : ""
                      }
                    >
                      {city.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFavoriteClick(city);
                      }}
                      className="text-yellow-400"
                    >
                      {isFavorite(city.name) ? (
                        <StarSolid className="w-4 h-4" />
                      ) : (
                        <StarOutline className="w-4 h-4" />
                      )}
                    </button>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleFavoriteClick(selectedCity)}
              className={`p-2 bg-[#242426] rounded-full ${
                isFavorite(selectedCity.name)
                  ? "text-yellow-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {isFavorite(selectedCity.name) ? (
                <StarSolid className="w-5 h-5" />
              ) : (
                <StarOutline className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {showFavorites ? (
          // Favorites View - Show all favorite cities with detailed weather
          <div className="grid grid-cols-1 gap-6">
            {favorites.length === 0 ? (
              <div className="bg-[#242426] rounded-xl p-6 text-center">
                <p className="text-gray-400">즐겨찾기한 도시가 없습니다.</p>
                <p className="text-sm text-gray-500 mt-2">
                  도시 옆의 별표 아이콘을 클릭하여 즐겨찾기에 추가하세요.
                </p>
              </div>
            ) : (
              favorites.map((city) => (
                <div key={city.name} className="bg-[#242426] rounded-xl p-6">
                  <DetailedWeatherCard
                    location={city.name}
                    coordinates={city.coordinates}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          // Normal View - Show selected city with basic weather
          <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
            <div className="bg-[#242426] rounded-xl p-6">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold">{selectedCity.name}</h2>
                {loading ? (
                  <div className="text-7xl my-4">⏳</div>
                ) : weatherData ? (
                  <>
                    <div className="text-7xl my-4">
                      {getWeatherEmoji(weatherData.icon)}
                    </div>
                    <p className="text-5xl font-bold">{weatherData.temp}°</p>
                    <p className="text-gray-400 mt-2">{weatherData.description}</p>
                  </>
                ) : (
                  <div className="text-7xl my-4">❌</div>
                )}
              </div>
            </div>
            <div className="bg-[#242426] rounded-xl p-6">
              <WeatherCard
                location={selectedCity.name}
                coordinates={selectedCity.coordinates}
              />
            </div>
          </div>
        )}

        {/* Weekly Weather Forecast */}
        <div className="bg-[#242426] rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-3">5일 날씨 예보</h3>
          {dailyLoading ? (
            <div className="h-[120px] flex items-center justify-center text-gray-400">
              5일 예보를 불러오는 중...
            </div>
          ) : dailyData.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {dailyData.slice(0, 5).map((day, index) => (
                <div
                  key={day.dt}
                  className="bg-[#1C1C1E] rounded-xl p-3 text-center"
                >
                  <p className="text-sm text-gray-400 mb-1">
                    {index === 0 ? "오늘" : getDayOfWeek(day.dt)}
                  </p>
                  <div className="text-2xl mb-1">
                    {getWeatherEmoji(day.weather[0].icon)}
                  </div>
                  <p className="font-semibold text-base">
                    {Math.round(day.temp)}°
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.round(day.temp_min)}° / {Math.round(day.temp_max)}°
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {capitalizeFirstLetter(day.weather[0].description)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
          <div className="h-[120px] flex items-center justify-center text-gray-400">
              5일 예보 정보를 불러올 수 없습니다.
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
