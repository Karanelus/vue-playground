<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Filter from "./components/Filter.vue";
import TodoItem from "./components/TodoItem.vue";
import { createTodos, deleteTodos, getTodos } from "./apiClient";

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  editing: boolean;
};

console.log(getTodos());

const todosData = localStorage.getItem("todos");
const filterData = localStorage.getItem("filter");
let todosList = ref<Todo[]>(todosData ? JSON.parse(todosData) : []);
let filter = ref<string>(filterData ? JSON.parse(filterData) : "All");
let title = ref("");

onMounted(() => {
  getTodos().then((data) => {
    todosList.value = data;
    todosList.value = todosList.value.map((el) => ({ ...el, editing: false }));
  });
});

watch(
  todosList,
  (newValue: Todo[]) => {
    localStorage.setItem("todos", JSON.stringify(newValue));
  },
  { deep: true }
);

watch(
  filter,
  (newValue: string) => {
    localStorage.setItem("filter", JSON.stringify(newValue));
  },
  { deep: true }
);

const todoRemain = computed(() => {
  return todosList.value.filter((todo) => !todo.completed).length;
});

const handleSubmit = async () => {
  const titleCur = title.value.trim();

  if (titleCur === "") return;

  try {
    const data = await createTodos(titleCur);
    todosList.value.push({ ...data, editing: false });
  } catch (err) {
    alertr("Failed to create todo", err);
  } finally {
    title.value = "";
  }
};

const handleClickDeleteTodo = async (todo: Todo) => {
  try {
    await deleteTodos(todo.id);
    todosList.value.filter((el) => el.id !== todo.id);
  } catch (err) {
    alertr("Failed to delete todo", err);
  } finally {
    title.value = "";
  }

  todosList.value = todosList.value.filter((el) => el !== todo);
};

const visibleTask = computed(() => {
  switch (filter.value) {
    case "Active":
      return todosList.value.filter((todo) => !todo.completed);
    case "Completed":
      return todosList.value.filter((todo) => todo.completed);
    default:
      return todosList.value;
  }
});

const clearCompleted = () => {
  todosList.value.forEach(async (el) => {
    if (el.completed) await deleteTodos(el.id);
  });

  todosList.value = todosList.value.filter((el) => !el.completed);
};
</script>

<template>
  <div class="todoApp">
    <h1 class="todoApp__title">todos</h1>
    <div class="todoApp__content">
      <header class="todoApp__header">
        <button type="button" class="todoApp__toggle-all" data-cy="ToggleAllButton"></button>
        <form @submit.prevent="handleSubmit">
          <input
            data-cy="NewTodoField"
            type="text"
            class="todoApp__new-todo"
            placeholder="What needs to be done?"
            v-model="title"
          />
        </form>
      </header>
      <main class="todoApp__main" data-cy="TodoList">
        <TransitionGroup name="list">
          <TodoItem
            v-for="todo of visibleTask"
            :todo="todo"
            :handleClickDeleteTodo="handleClickDeleteTodo"
            :key="todo.id"
          />
        </TransitionGroup>
      </main>
      <footer class="todoApp__footer" data-cy="Footer">
        <span class="todo-count" data-cy="TodosCounter">{{ todoRemain }} items left</span>
        <Filter :state="filter" @updateState="filter = $event" />
        <button type="button" class="todoApp__clear-completed" data-cy="ClearCompletedButton" @click="clearCompleted()">
          Clear completed
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
  max-height: 60px;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0);
}
</style>
