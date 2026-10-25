<script setup lang="ts">
import { useMemo } from '../stores/memo'
const { memo } = useMemo()
</script>
<template>
  <section class="card memo-card" aria-labelledby="memo-title">
    <div class="card-heading"><div><p class="eyebrow">QUICK NOTE</p><h2 id="memo-title">メモ</h2></div><span class="memo-icon" aria-hidden="true">✎</span></div>
    <textarea v-model="memo" aria-label="メモ" placeholder="思いついたことを書き留めておきましょう..." maxlength="3000" />
    <div class="memo-footer"><span>この端末に自動保存されます</span><span>{{ memo.length }} / 3000</span></div>
  </section>
</template>
