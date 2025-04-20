import { WeatherForecast, WeatherResponse } from '@/types/weather/WeatherTypes';

export async function fetchThreeDayForecast(
  zipcode: string
): Promise<WeatherForecast[]> {
  const url = `https://wttr.in/${zipcode}?format=j1`;
  const res = await fetch(url);

  if (res.ok) {
    const data: WeatherResponse = await res.json();
    return data.weather;
  }
  return [];
}

export async function fetchCurrentTemperature(
  zipcode: string
): Promise<string> {
  const url = `https://wttr.in/${zipcode}?format=j1`;
  const res = await fetch(url);

  if (res.ok) {
    const data: WeatherResponse = await res.json();
    return data.current_condition[0].temp_F;
  }
  return '';
}
