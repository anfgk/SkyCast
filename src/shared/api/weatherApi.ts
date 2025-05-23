import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherResponse {
  main: {
    temp: number;
    humidity: number;
    pressure: number;
    feels_like: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface AirQualityResponse {
  list: Array<{
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
    };
  }>;
}

interface UVIndexResponse {
  value: number;
}

export const getWeatherByCoordinates = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<WeatherResponse>(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "kr",
      },
    });
    return response.data;
  } catch (error) {
    console.error("날씨 정보를 가져오는데 실패했습니다:", error);
    throw error;
  }
};

export const getAirQuality = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<AirQualityResponse>(
      "https://api.openweathermap.org/data/2.5/air_pollution",
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
        },
      }
    );
    return response.data.list[0];
  } catch (error) {
    console.error("대기질 정보를 가져오는데 실패했습니다:", error);
    throw error;
  }
};

export const getUVIndex = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<UVIndexResponse>(
      "https://api.openweathermap.org/data/2.5/uvi",
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("자외선 지수를 가져오는데 실패했습니다:", error);
    throw error;
  }
};

export const getAQIDescription = (aqi: number) => {
  switch (aqi) {
    case 1:
      return "매우 좋음";
    case 2:
      return "좋음";
    case 3:
      return "보통";
    case 4:
      return "나쁨";
    case 5:
      return "매우 나쁨";
    default:
      return "정보 없음";
  }
};

export const getUVIDescription = (uvi: number) => {
  if (uvi <= 2) return "낮음";
  if (uvi <= 5) return "보통";
  if (uvi <= 7) return "높음";
  if (uvi <= 10) return "매우 높음";
  return "위험";
};
