<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { WEATHER_LOCATION, WEATHER_LOCATION_ERROR } from '../config/location'
import { describeWeather, fetchWeather, type WeatherData } from '../services/weather'

const weather = ref<WeatherData | null>(null)
const loading = ref(true)
const error = ref('')
const fetchedAt = ref('')
let controller: AbortController | undefined
const currentCondition = computed(() => weather.value ? describeWeather(weather.value.current.code) : null)
const hourLabel = (time: string) => {
  const date = new Date(time)
  return new Intl.DateTimeFormat('ja-JP', { hour: 'numeric', hour12: false, timeZone: WEATHER_LOCATION.timezone }).format(date)
}
async function load() {
  controller?.abort()
  if (WEATHER_LOCATION_ERROR) {
    weather.value = null
    loading.value = false
    error.value = WEATHER_LOCATION_ERROR
    return
  }
  controller = new AbortController()
  loading.value = true
  error.value = ''
  try {
    weather.value = await fetchWeather(WEATHER_LOCATION.latitude, WEATHER_LOCATION.longitude, controller.signal)
    fetchedAt.value = new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit' }).format(new Date())
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') return
    error.value = cause instanceof Error ? cause.message : '天気情報を取得できませんでした。'
  } finally { loading.value = false }
}
onMounted(load)
onUnmounted(() => controller?.abort())
</script>

<template>
  <section class="card weather-card" aria-labelledby="weather-title">
    <div class="card-heading">
      <div><p class="eyebrow">WEATHER</p><h2 id="weather-title">今日の天気</h2></div>
      <span class="location-pill"><span class="pin">⌖</span>{{ WEATHER_LOCATION.name }}</span>
    </div>
    <div v-if="loading" class="weather-state"><span class="spinner" />天気情報を読み込んでいます</div>
    <div v-else-if="error" class="weather-state error-state" role="status">
      <span class="state-icon">!</span><div><strong>天気を表示できません</strong><p>{{ error }}</p><button class="text-button" @click="load">再読み込み</button></div>
    </div>
    <template v-else-if="weather && currentCondition">
      <div class="weather-main">
        <div><div class="temperature">{{ Math.round(weather.current.temperature) }}<span>°</span></div><div class="condition">{{ currentCondition.label }}</div></div>
        <div class="weather-emoji" aria-hidden="true">{{ currentCondition.icon }}</div>
      </div>
      <div class="weather-details">
        <div><span class="detail-icon">↗</span><span>最高 <b>{{ Math.round(weather.current.high) }}°</b></span></div>
        <div><span class="detail-icon">↘</span><span>最低 <b>{{ Math.round(weather.current.low) }}°</b></span></div>
        <div><span class="detail-icon">⌁</span><span>降水確率 <b>{{ Math.round(weather.current.precipitationProbability) }}%</b></span></div>
      </div>
      <div class="forecast-heading"><span>時間ごとの予報</span><span class="muted">{{ fetchedAt }} 更新</span></div>
      <div class="forecast-list">
        <div v-for="hour in weather.hours" :key="hour.time" class="forecast-item">
          <span class="forecast-time">{{ hourLabel(hour.time) }}</span>
          <span class="forecast-icon" :title="describeWeather(hour.code).label">{{ describeWeather(hour.code).icon }}</span>
          <b>{{ Math.round(hour.temperature) }}°</b>
          <span class="forecast-rain">{{ Math.round(hour.precipitationProbability) }}%</span>
        </div>
      </div>
    </template>
  </section>
</template>
