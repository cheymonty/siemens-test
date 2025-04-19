import { WeatherForecast, WeatherResponse } from '@/types/weather/WeatherTypes';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export function transformDate(dateStr: string): string {
  const date = dayjs(dateStr);

  if (date.isToday()) return 'Today';
  if (date.isTomorrow()) return 'Tomorrow';

  return date.format('MMM D');
}

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
