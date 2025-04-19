export type WeatherResponse = {
  current_condition: CurrentCondition[];
  nearest_area: NearestArea[];
  request: RequestInfo[];
  weather: WeatherForecast[];
};

export type CurrentCondition = {
  FeelsLikeC: string;
  FeelsLikeF: string;
  cloudcover: string;
  humidity: string;
  localObsDateTime: string;
  observation_time: string;
  precipInches: string;
  precipMM: string;
  pressure: string;
  pressureInches: string;
  temp_C: string;
  temp_F: string;
  uvIndex: string;
  visibility: string;
  visibilityMiles: string;
  weatherCode: string;
  weatherDesc: WeatherText[];
  weatherIconUrl: WeatherText[];
  winddir16Point: string;
  winddirDegree: string;
  windspeedKmph: string;
  windspeedMiles: string;
};

export type NearestArea = {
  areaName: WeatherText[];
  country: WeatherText[];
  latitude: string;
  longitude: string;
  population: string;
  region: WeatherText[];
  weatherUrl: WeatherText[];
};

export type RequestInfo = {
  query: string;
  type: string;
};

export type WeatherForecast = {
  astronomy: Astronomy[];
  avgtempC: string;
  avgtempF: string;
  date: string;
  hourly: HourlyForecast[];
  maxtempC: string;
  maxtempF: string;
  mintempC: string;
  mintempF: string;
  sunHour: string;
  totalSnow_cm: string;
  uvIndex: string;
};

export type Astronomy = {
  moon_illumination: string;
  moon_phase: string;
  moonrise: string;
  moonset: string;
  sunrise: string;
  sunset: string;
};

export type HourlyForecast = {
  time: string;
  tempC: string;
  tempF: string;
  windspeedKmph: string;
  windspeedMiles: string;
  winddirDegree: string;
  winddir16Point: string;
  weatherCode: string;
  weatherDesc: WeatherText[];
  weatherIconUrl: WeatherText[];
  precipMM: string;
  precipInches: string;
  humidity: string;
  visibility: string;
  visibilityMiles: string;
  pressure: string;
  pressureInches: string;
  cloudcover: string;
  HeatIndexC: string;
  HeatIndexF: string;
  DewPointC: string;
  DewPointF: string;
  WindChillC: string;
  WindChillF: string;
  WindGustKmph: string;
  WindGustMiles: string;
  FeelsLikeC: string;
  FeelsLikeF: string;
  uvIndex: string;
};

export type WeatherText = {
  value: string;
};

export type HistoryTemperature = {
  zipcode: string;
  currentTemperature: string;
};
