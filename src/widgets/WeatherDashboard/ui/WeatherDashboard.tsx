import { useState } from "react";
import { WeatherCard } from "@/entities/Weather";
import { DetailedWeatherCard } from "@/entities/Weather/ui/DetailedWeatherCard";
import { MAJOR_CITIES } from "@/shared/config/cities";
import type { City } from "@/shared/config/cities";
import {
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  StarIcon as StarOutline,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { useFavoriteStore } from "@/shared/store/favoriteStore";

export const WeatherDashboard = () => {
  const [selectedCity, setSelectedCity] = useState<City>(MAJOR_CITIES[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, addFavorite, removeFavorite, isFavorite } =
    useFavoriteStore();

  const handleFavoriteClick = (city: City) => {
    if (isFavorite(city.name)) {
      removeFavorite(city.name);
    } else {
      addFavorite(city);
    }
  };

  const displayCities = showFavorites ? favorites : MAJOR_CITIES;

  return (
    <div className="grid grid-cols-[80px_1fr] gap-6">
      {/* Sidebar */}
      <div className="bg-[#242426] rounded-2xl p-4 flex flex-col items-center gap-6">
        <div className="text-yellow-400">
          <SunIcon className="w-6 h-6" />
        </div>
        <nav className="flex flex-col gap-6 items-center flex-1">
          <button
            className={`transition-colors ${
              showFavorites
                ? "text-yellow-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <StarSolid className="w-6 h-6" />
          </button>
          <button className="text-blue-400 hover:text-blue-300">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
        </nav>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-gray-400 hover:text-gray-300"
        >
          <MoonIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header with City Selector */}
        <div className="flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-[#242426] rounded-xl px-4 py-2 hover:bg-[#2a2a2c] transition-colors"
            >
              <span>{showFavorites ? "즐겨찾기 도시" : "모든 도시"}</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>

            {/* City Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#242426] rounded-xl shadow-lg py-2 z-10">
                {displayCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      setSelectedCity(city);
                      setIsDropdownOpen(false);
                    }}
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
            <button className="p-2 bg-[#242426] rounded-full">
              <MoonIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6">
          {/* Left Section - Current Weather */}
          <div className="bg-[#242426] rounded-xl p-6">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-2xl font-bold">{selectedCity.name}</h2>
              <div className="text-7xl my-4">⛅</div>
              <p className="text-5xl font-bold">24°</p>
              <p className="text-gray-400 mt-2">맑음</p>
            </div>
          </div>

          {/* Right Section - Weather Details */}
          <div className="bg-[#242426] rounded-xl p-6">
            {showFavorites && isFavorite(selectedCity.name) ? (
              <DetailedWeatherCard
                location={selectedCity.name}
                coordinates={selectedCity.coordinates}
              />
            ) : (
              <WeatherCard
                location={selectedCity.name}
                coordinates={selectedCity.coordinates}
              />
            )}
          </div>
        </div>

        {/* Weather Chart */}
        <div className="bg-[#242426] rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">주간 날씨</h3>
          <div className="h-[200px] flex items-center justify-center text-gray-400">
            차트가 들어갈 자리입니다
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
