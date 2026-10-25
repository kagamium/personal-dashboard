import { ref, watch } from 'vue'

export interface Todo { id: string; title: string; completed: boolean; createdAt: string }
export interface TodoRepository { load(): Todo[]; save(todos: Todo[]): void }

const STORAGE_KEY = 'hibi.todos.v1'
export const localTodoRepository: TodoRepository = {
  load() {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      if (!Array.isArray(value)) return []
      return value.filter((item): item is Todo => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.completed === 'boolean' && typeof item.createdAt === 'string')
    } catch { return [] }
  },
  save(todos) { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) },
}

export function useTodos(repository: TodoRepository = localTodoRepository) {
  const todos = ref<Todo[]>(repository.load())
  watch(todos, (value) => repository.save(value), { deep: true })
  function add(title: string) {
    const clean = title.trim()
    if (!clean) return false
    todos.value.unshift({ id: crypto.randomUUID(), title: clean, completed: false, createdAt: new Date().toISOString() })
    return true
  }
  function toggle(id: string) { const todo = todos.value.find((item) => item.id === id); if (todo) todo.completed = !todo.completed }
  function remove(id: string) { todos.value = todos.value.filter((item) => item.id !== id) }
  return { todos, add, toggle, remove }
}
