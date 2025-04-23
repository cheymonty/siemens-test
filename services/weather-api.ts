import * as Location from 'expo-location';
import {
  CurrentCondition,
  WeatherForecast,
  WeatherResponse,
} from '@/types/weather/WeatherTypes';

export async function fetchCurrentLocationForecast(): Promise<{
  weather: WeatherForecast[];
  currentCondition: CurrentCondition | null;
  areaName: string;
}> {
  try {
    const location = await Location.getLastKnownPositionAsync();
    if (!location) {
      return { weather: [], currentCondition: null, areaName: '' };
    }

    const lat = location.coords.latitude;
    const lng = location.coords.longitude;
    const url = `https://wttr.in/${lat},${lng}?format=j1`;
    const res = await fetch(url);

    if (res.ok) {
      const data: WeatherResponse = await res.json();
      return {
        weather: data.weather,
        currentCondition: data.current_condition[0],
        areaName: data.nearest_area[0].areaName[0].value,
      };
    }
    return { weather: [], currentCondition: null, areaName: '' };
  } catch {
    return { weather: [], currentCondition: null, areaName: '' };
  }
}

export async function fetchThreeDayForecastByZipcode(zipcode: string): Promise<{
  weather: WeatherForecast[];
  currentCondition: CurrentCondition | null;
  areaName: string;
}> {
  const url = `https://wttr.in/${zipcode},US?format=j1`;
  const res = await fetch(url);
  if (res.ok) {
    const data: WeatherResponse = await res.json();
    return {
      weather: data.weather,
      currentCondition: data.current_condition[0],
      areaName: data.nearest_area[0].areaName[0].value,
    };
  }
  return { weather: [], currentCondition: null, areaName: '' };
}

export async function fetchCurrentTemperature(
  zipcode: string
): Promise<string> {
  const url = `https://wttr.in/${zipcode},US?format=j1`;
  const res = await fetch(url);

  if (res.ok) {
    const data: WeatherResponse = await res.json();
    return data.current_condition[0].temp_F;
  }
  return '';
}
