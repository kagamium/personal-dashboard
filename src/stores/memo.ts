import { ref, watch } from 'vue'
const STORAGE_KEY = 'hibi.memo.v1'
function loadMemo(): string {
  try { return localStorage.getItem(STORAGE_KEY) ?? '' } catch { return '' }
}
export function useMemo() {
  const memo = ref(loadMemo())
  watch(memo, (value) => { try { localStorage.setItem(STORAGE_KEY, value) } catch { /* storage may be unavailable */ } })
  return { memo }
}
