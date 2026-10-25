export interface WeatherNow {
  temperature: number
  code: number
  high: number
  low: number
  precipitationProbability: number
}

export interface HourForecast {
  time: string
  temperature: number
  code: number
  precipitationProbability: number
}

export interface WeatherData {
  current: WeatherNow
  hours: HourForecast[]
}

interface OpenMeteoResponse {
  current?: { time?: unknown; temperature_2m?: unknown; weather_code?: unknown }
  hourly?: { time?: unknown; temperature_2m?: unknown; weather_code?: unknown; precipitation_probability?: unknown }
  daily?: { time?: unknown; temperature_2m_max?: unknown; temperature_2m_min?: unknown }
}

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string')
const isNumberArray = (value: unknown): value is number[] => Array.isArray(value) && value.every(isNumber)

export async function fetchWeather(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude), longitude: String(longitude), timezone: 'Asia/Tokyo',
    current: 'temperature_2m,weather_code',
    hourly: 'temperature_2m,weather_code,precipitation_probability',
    daily: 'temperature_2m_max,temperature_2m_min', forecast_days: '1', forecast_hours: '12',
  })
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal })
  if (!response.ok) throw new Error(`天気情報を取得できませんでした（HTTP ${response.status}）。時間をおいて再度お試しください。`)
  const raw: unknown = await response.json()
  if (!raw || typeof raw !== 'object') throw new Error('天気情報の形式が不正です。')
  const data = raw as OpenMeteoResponse
  const current = data.current
  const hourly = data.hourly
  const daily = data.daily
  if (!current || !isNumber(current.temperature_2m) || !isNumber(current.weather_code) || !isStringArray(hourly?.time) ||
      !isNumberArray(hourly?.temperature_2m) || !isNumberArray(hourly?.weather_code) ||
      !isNumberArray(hourly?.precipitation_probability) || !isNumberArray(daily?.temperature_2m_max) || !isNumberArray(daily?.temperature_2m_min)) {
    throw new Error('天気サービスから不完全なデータが返されました。しばらくしてから再度お試しください。')
  }
  const times = hourly.time as string[]
  const temperatures = hourly.temperature_2m as number[]
  const codes = hourly.weather_code as number[]
  const probabilities = hourly.precipitation_probability as number[]
  const maximums = daily.temperature_2m_max as number[]
  const minimums = daily.temperature_2m_min as number[]
  if (!isNumber(maximums[0]) || !isNumber(minimums[0])) {
    throw new Error('今日の最高・最低気温を取得できませんでした。しばらくしてから再度お試しください。')
  }
  const hours = times.map((time, index) => ({
    time, temperature: temperatures[index], code: codes[index],
    precipitationProbability: probabilities[index],
  })).filter((hour) => isNumber(hour.temperature) && isNumber(hour.code) && isNumber(hour.precipitationProbability))
  if (hours.length === 0) throw new Error('時間ごとの予報が見つかりませんでした。')
  return {
    current: {
      temperature: current.temperature_2m, code: current.weather_code,
      high: maximums[0], low: minimums[0],
      precipitationProbability: hours[0].precipitationProbability,
    },
    hours: hours.slice(0, 8),
  }
}

export function describeWeather(code: number): { label: string; icon: string } {
  if (code === 0) return { label: '快晴', icon: '☀️' }
  if ([1, 2].includes(code)) return { label: code === 1 ? '晴れ' : '晴れ時々くもり', icon: '🌤️' }
  if (code === 3) return { label: 'くもり', icon: '☁️' }
  if ([45, 48].includes(code)) return { label: '霧', icon: '🌫️' }
  if ([51, 53, 55, 56, 57].includes(code)) return { label: '霧雨', icon: '🌦️' }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: '雨', icon: '🌧️' }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: '雪', icon: '❄️' }
  if ([95, 96, 99].includes(code)) return { label: '雷雨', icon: '⛈️' }
  return { label: '天気情報', icon: '🌡️' }
}
