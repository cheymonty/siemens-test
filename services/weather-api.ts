import {
  CurrentCondition,
  WeatherForecast,
  WeatherResponse,
} from '@/types/weather/WeatherTypes';

export async function fetchThreeDayForecast(zipcode: string): Promise<{
  weather: WeatherForecast[];
  currentCondition: CurrentCondition | null;
  areaName: string;
}> {
  const url = `https://wttr.in/${zipcode},US?format=j1`;
  const res = await fetch(url);

  if (res.ok) {
    const data: WeatherResponse = await res.json();
    console.log(data.weather);
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
