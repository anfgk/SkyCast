import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5"; //무료 플랜이라면 api.openweathermap.org

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

interface DailyForecastResponse {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number; // 날짜 (UNIX timestamp)
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string; // 날짜 텍스트 (예: "2024-01-01 12:00:00")
  }>;
}

interface WeeklyForecastResponse {
  daily: Array<{
    dt: number;
    temp: {
      day: number;
      min: number;
      max: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    humidity: number;
    wind_speed: number;
  }>;
}


// 위도(lat)와 경도(lon)를 이용해 현재 날씨 정보를 가져오는 비동기 함수 정의
export const getWeatherByCoordinates = async (lat: number, lon: number) => {
  try {
    // axios를 사용해 OpenWeatherMap의 /weather 엔드포인트에 GET 요청 보냄
    const response = await axios.get<WeatherResponse>(`${BASE_URL}/weather`, {
      params: {
        lat,                // 요청에 포함할 위도
        lon,                // 요청에 포함할 경도
        appid: API_KEY,     // OpenWeatherMap API 키
        units: "metric",    // 온도 단위: 섭씨(Celsius)로 설정
        lang: "en",         // 응답 언어: 영어로 설정
      },
    });

    // 응답 데이터 반환 (날씨 정보)
    return response.data;
  } catch (error) {
    // 에러 발생 시 콘솔에 에러 메시지 출력
    console.error("날씨 정보를 가져오는데 실패했습니다:", error);
    // 에러를 호출한 쪽으로 다시 throw 해서 처리하도록 함
    throw error;
  }
};


// 대기질 정보 가져오기
// - 대기질 지수 (AQI: 1-5)
// - 오염 물질 농도 (CO, NO2, O3, PM2.5, PM10)
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


// 5일/3시간 예보 가져오기 (무료 플랜에서 사용 가능)
// - 5일간 3시간마다의 날씨 정보
// - 온도, 습도, 날씨 상태 등
export const getDailyForecast = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<DailyForecastResponse>(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat,              // 위도
          lon,              // 경도
          appid: API_KEY,   // API 키
          units: "metric",  // 섭씨 단위
          lang: "ko",       // 한국어 응답
        },
      }
    );

    return response.data; // 전체 예보 데이터 반환
  } catch (error) {
    console.error("5일 예보 정보를 가져오는데 실패했습니다:", error);
    throw error;
  }
};

// 시간대별 예보 가져오기 (3시간마다)
// - 5일간 3시간마다의 상세 날씨 정보
// - 온도, 습도, 날씨 상태, 시간 등
export const getHourlyForecast = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<DailyForecastResponse>(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat,              // 위도
          lon,              // 경도
          appid: API_KEY,   // API 키
          units: "metric",  // 섭씨 단위
          lang: "ko",       // 한국어 응답
        },
      }
    );

    return response.data.list; // 시간대별 데이터만 반환
  } catch (error) {
    console.error("시간대별 예보 정보를 가져오는데 실패했습니다:", error);
    throw error;
  }
};

// 7일 날씨 예보 가져오기
// - 일별 최고/최저/평균 온도
// - 일별 날씨 상태
// - 일별 습도, 풍속
export const getWeeklyForecast = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<WeeklyForecastResponse>(`${BASE_URL}/onecall`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "ko",
        exclude: "current,minutely,hourly,alerts",
      },
    });
    return response.data;
  } catch (error) {
    console.error("주간 날씨 예보를 가져오는데 실패했습니다:", error);
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

// 날씨 설명의 첫 글자만 대문자로 변환하는 함수
export const capitalizeFirstLetter = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// 사용자 현재 위치 기반 날씨 정보 가져오기
export const getWeatherByUserLocation = async () => {
  try {
    // 사용자 위치 권한 요청
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });

    const { latitude, longitude } = position.coords;
    
    // 현재 위치로 날씨 정보 가져오기
    const response = await getWeatherByCoordinates(latitude, longitude);
    
    return {
      weather: response,
      location: { lat: latitude, lon: longitude }
    };
  } catch (error) {
    console.error("사용자 위치 기반 날씨 정보를 가져오는데 실패했습니다:", error);
    throw error;
  }
};
