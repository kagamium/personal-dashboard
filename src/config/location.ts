const locationName = import.meta.env.VITE_WEATHER_LOCATION_NAME?.trim()
const latitudeValue = import.meta.env.VITE_WEATHER_LATITUDE?.trim()
const longitudeValue = import.meta.env.VITE_WEATHER_LONGITUDE?.trim()
const latitude = latitudeValue ? Number(latitudeValue) : Number.NaN
const longitude = longitudeValue ? Number(longitudeValue) : Number.NaN
const timezone = import.meta.env.VITE_WEATHER_TIMEZONE?.trim() || 'Asia/Tokyo'

const isValidLatitude = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90
const isValidLongitude = Number.isFinite(longitude) && longitude >= -180 && longitude <= 180

export const WEATHER_LOCATION = {
  name: locationName || '地点未設定',
  latitude: isValidLatitude ? latitude : 0,
  longitude: isValidLongitude ? longitude : 0,
  timezone,
} as const

export const WEATHER_LOCATION_ERROR = locationName && isValidLatitude && isValidLongitude
  ? ''
  : '.env に地点名と有効な緯度・経度を設定してください。.env.example を参考にしてください。'
