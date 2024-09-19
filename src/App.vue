<script setup lang="ts">
import { computed, ref, watch } from "vue";
import todos from "./todos";
import Filter from "./components/Filter.vue";
import TodoItem from "./components/TodoItem.vue";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  editing: boolean;
};

const data = localStorage.getItem('todos');
const todosX = ref(data ? JSON.parse(data) : []);
const todosList = ref(todos);
let title = ref("");
let state = ref("Active");

watch(todosX, (newValue: Todo) => {
  localStorage.setItem('todos', JSON.stringify(newValue))
})

const todoRemain = computed(() => {
  return todosList.value.filter((todo) => !todo.completed).length;
});

const handleSubmit = () => {
  const titleCur = title.value.trim();
  const todo = todosList.value.length - 1;

  if (titleCur === "") return;

  todosList.value.push({
    id: todosList.value[todo].id + 1,
    completed: false,
    editing: false,
    title: titleCur,
  });

  title.value = "";
  console.log(todosList.value);
};

const handleClickDeleteTodo = (todo: Todo) => {
  todosList.value = todosList.value.filter((el) => el !== todo);
};

const visibleTask = computed(() => {
  switch (state.value) {
    case "Active":
      return todosList.value.filter((todo) => !todo.completed);
    case "Completed":
      return todosList.value.filter((todo) => todo.completed);
    default:
      return todosList.value;
  }
});

const clearCompleted = () => {
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
        <Filter :state="state" @updateState="state = $event" />
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
