<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTodos } from '../stores/todos'
const { todos, add, toggle, remove } = useTodos()
const draft = ref('')
const dueDate = ref('')
const active = computed(() => todos.value.filter((todo) => !todo.completed))
const completed = computed(() => todos.value.filter((todo) => todo.completed))
function submit() {
  if (add(draft.value, dueDate.value)) {
    draft.value = ''
    dueDate.value = ''
  }
}
function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '日時不明'
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date)
}
function formatDueDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return '日付不明'
  return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(year, month - 1, day))
}
</script>

<template>
  <section class="card todo-card" aria-labelledby="todo-title">
    <div class="card-heading">
      <div><p class="eyebrow">YOUR TASKS</p><h2 id="todo-title">やること</h2></div>
      <span class="count-badge">{{ active.length }} 件</span>
    </div>
    <form class="todo-form" @submit.prevent="submit">
      <input v-model="draft" aria-label="新しいタスク" placeholder="新しいタスクを追加..." maxlength="120" />
      <label class="due-date-field"><span>期限</span><input v-model="dueDate" type="date" aria-label="タスクの期限" /></label>
      <button class="add-button" type="submit" :disabled="!draft.trim()" aria-label="タスクを追加">＋</button>
    </form>
    <div v-if="todos.length === 0" class="empty-state"><span class="empty-check">✓</span><p>今日はまだタスクがありません</p><small>ひとつ追加して始めましょう</small></div>
    <template v-else>
      <div v-if="active.length" class="todo-list">
        <div v-for="todo in active" :key="todo.id" class="todo-row">
          <button class="check-button" aria-label="完了にする" @click="toggle(todo.id)"></button>
          <div class="todo-content"><span class="todo-title">{{ todo.title }}</span><small class="todo-date">作成 {{ formatDate(todo.createdAt) }}<template v-if="todo.dueDate"> · 期限 {{ formatDueDate(todo.dueDate) }}</template></small></div>
          <button class="delete-button" aria-label="削除" @click="remove(todo.id)">×</button>
        </div>
      </div>
      <div v-else-if="!completed.length" class="empty-state"><p>タスクはありません</p></div>
      <div v-if="completed.length" class="completed-section">
        <p class="section-label">完了済み <span>{{ completed.length }}</span></p>
        <div v-for="todo in completed" :key="todo.id" class="todo-row is-complete">
          <button class="check-button checked" aria-label="未完了に戻す" @click="toggle(todo.id)">✓</button>
          <div class="todo-content"><span class="todo-title">{{ todo.title }}</span><small class="todo-date">作成 {{ formatDate(todo.createdAt) }}<template v-if="todo.dueDate"> · 期限 {{ formatDueDate(todo.dueDate) }}</template><template v-if="todo.completedAt"> · 完了 {{ formatDate(todo.completedAt) }}</template></small></div>
          <button class="delete-button" aria-label="削除" @click="remove(todo.id)">×</button>
        </div>
      </div>
    </template>
  </section>
</template>
