<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Todo } from "../App.vue";
const props = defineProps<{
  todo: Todo;
  handleClickDeleteTodo: (todo: Todo) => void;
}>();

const todoInputRef = ref<HTMLInputElement | null>(null);

const changeTodoState = (): void => {
  props.todo.editing = false;

  if (props.todo.title.trim().length === 0) {
    props.handleClickDeleteTodo(props.todo);
  }
};

const startEditing = async () => {
  props.todo.editing = true;

  await nextTick();
  if (todoInputRef.value) {
    todoInputRef.value.focus();
  }
};
</script>

<template>
  <div data-cy="Todo" class="todo" :class="{ completed: todo.completed }">
    <label class="todo__status-label">
      <input data-cy="TodoStatus" type="checkbox" class="todo__status" @change="todo.completed = !todo.completed" />
    </label>

    <form v-if="todo.editing" @submit.prevent="changeTodoState" @focusout="changeTodoState">
      <input
        ref="todoInputRef"
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        v-model="todo.title"
        @keyup.esc="changeTodoState"
      />
    </form>

    <template v-else>
      <span @dblclick="startEditing" data-cy="TodoTitle" class="todo__title">{{ todo.title }}</span>
      <button type="button" class="todo__remove" data-cy="TodoDelete" @click="handleClickDeleteTodo(todo)">×</button>
    </template>
  </div>
</template>
