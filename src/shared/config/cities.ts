import type { LatLngExpression } from "leaflet";

export interface City {
  name: string;
  coordinates: LatLngExpression;
}

export const MAJOR_CITIES: City[] = [
  { name: "서울", coordinates: [37.5665, 126.978] },
  { name: "부산", coordinates: [35.1796, 129.0756] },
  { name: "인천", coordinates: [37.4563, 126.7052] },
  { name: "대구", coordinates: [35.8714, 128.6014] },
  { name: "대전", coordinates: [36.3504, 127.3845] },
  { name: "광주", coordinates: [35.1595, 126.8526] },
  { name: "수원", coordinates: [37.2636, 127.0286] },
  { name: "울산", coordinates: [35.5384, 129.3114] },
  { name: "창원", coordinates: [35.2322, 128.6811] },
  { name: "고양", coordinates: [37.6583, 126.832] },
];
