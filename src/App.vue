<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import WeatherCard from './components/WeatherCard.vue'
import TodoCard from './components/TodoCard.vue'
import MemoCard from './components/MemoCard.vue'

const now = ref(new Date())
let timer: number | undefined
const dateText = () => new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(now.value)
const timeText = () => new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now.value)
onMounted(() => { timer = window.setInterval(() => { now.value = new Date() }, 1000) })
onUnmounted(() => { if (timer) window.clearInterval(timer) })
</script>

<template>
  <main class="page-shell">
    <header class="topbar"><a class="brand" href="#" aria-label="日々 ホーム"><span class="brand-mark">日</span><span>hibi<span class="brand-dot">.</span></span></a><div class="topbar-note"><span class="live-dot"></span>PERSONAL SPACE</div></header>
    <section class="welcome-row">
      <div><p class="welcome-kicker">YOUR DAY, AT A GLANCE</p><h1>おかえりなさい<span class="wave">。</span></h1><p class="date-line">{{ dateText() }}</p></div>
      <div class="clock-block"><span class="clock-label">LOCAL TIME</span><time class="clock" :datetime="now.toISOString()">{{ timeText() }}<span class="clock-colon">:</span><span class="seconds">{{ new Intl.DateTimeFormat('ja-JP', { second: '2-digit' }).format(now) }}</span></time></div>
    </section>
    <div class="dashboard-grid">
      <div class="primary-column"><WeatherCard /><TodoCard /></div>
      <div class="secondary-column"><MemoCard /><section class="quote-card"><span class="quote-mark">“</span><p>小さな一歩を、<br />今日のうちに。</p><span class="quote-caption">A LITTLE PROGRESS EACH DAY</span><span class="quote-sun" aria-hidden="true">☼</span></section></div>
    </div>
    <footer class="page-footer"><span>HIBI <span class="footer-separator">/</span> PERSONAL DASHBOARD</span><span>TAKE IT ONE DAY AT A TIME</span></footer>
  </main>
</template>
