<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTodos } from '../stores/todos'
const { todos, add, toggle, remove } = useTodos()
const draft = ref('')
const active = computed(() => todos.value.filter((todo) => !todo.completed))
const completed = computed(() => todos.value.filter((todo) => todo.completed))
function submit() { if (add(draft.value)) draft.value = '' }
</script>

<template>
  <section class="card todo-card" aria-labelledby="todo-title">
    <div class="card-heading">
      <div><p class="eyebrow">YOUR TASKS</p><h2 id="todo-title">やること</h2></div>
      <span class="count-badge">{{ active.length }} 件</span>
    </div>
    <form class="todo-form" @submit.prevent="submit">
      <input v-model="draft" aria-label="新しいタスク" placeholder="新しいタスクを追加..." maxlength="120" />
      <button class="add-button" type="submit" :disabled="!draft.trim()" aria-label="タスクを追加">＋</button>
    </form>
    <div v-if="todos.length === 0" class="empty-state"><span class="empty-check">✓</span><p>今日はまだタスクがありません</p><small>ひとつ追加して始めましょう</small></div>
    <template v-else>
      <div v-if="active.length" class="todo-list">
        <div v-for="todo in active" :key="todo.id" class="todo-row">
          <button class="check-button" aria-label="完了にする" @click="toggle(todo.id)"></button>
          <span class="todo-title">{{ todo.title }}</span>
          <button class="delete-button" aria-label="削除" @click="remove(todo.id)">×</button>
        </div>
      </div>
      <div v-else-if="!completed.length" class="empty-state"><p>タスクはありません</p></div>
      <div v-if="completed.length" class="completed-section">
        <p class="section-label">完了済み <span>{{ completed.length }}</span></p>
        <div v-for="todo in completed" :key="todo.id" class="todo-row is-complete">
          <button class="check-button checked" aria-label="未完了に戻す" @click="toggle(todo.id)">✓</button>
          <span class="todo-title">{{ todo.title }}</span>
          <button class="delete-button" aria-label="削除" @click="remove(todo.id)">×</button>
        </div>
      </div>
    </template>
  </section>
</template>
