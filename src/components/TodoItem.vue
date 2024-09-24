<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Todo } from "../App.vue";
import { editTodo } from "../apiClient";
const props = defineProps<{
  todo: Todo;
  handleClickDeleteTodo: (todo: Todo) => void;
}>();

const todoInputRef = ref<HTMLInputElement | null>(null);

const changeTodoState = async (todo: Todo) => {
  const { id, completed } = todo;

  if (todo.title.trim().length === 0) {
    props.handleClickDeleteTodo(todo);
  }

  try {
    await editTodo({ id, title: todo.title, completed });
  } catch (err) {
    alert(`Failed to edit todo - ${err}`);
  } finally {
    todo.editing = false;
  }
};

const startEditing = async () => {
  props.todo.editing = true;

  await nextTick();
  if (todoInputRef.value) {
    todoInputRef.value.focus();
  }
};

const switchCompleted = async (todo: Todo) => {
  const { id, title } = todo;

  try {
    await editTodo({ id, title, completed: !todo.completed });
    todo.completed = !todo.completed;
  } catch (err) {
    alert(`Failed to edit todo - ${err}`);
  }
};
</script>

<template>
  <div data-cy="Todo" class="todo" :class="{ completed: todo.completed }">
    <label class="todo__status-label">
      <input data-cy="TodoStatus" type="checkbox" class="todo__status" @change="switchCompleted(todo)" />
    </label>

    <form v-if="todo.editing" @submit.prevent="changeTodoState(todo)" @focusout="changeTodoState(todo)">
      <input
        ref="todoInputRef"
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        v-model="todo.title"
        @keyup.esc="changeTodoState(todo)"
      />
    </form>

    <template v-else>
      <span @dblclick="startEditing" data-cy="TodoTitle" class="todo__title">{{ todo.title }}</span>
      <button type="button" class="todo__remove" data-cy="TodoDelete" @click="handleClickDeleteTodo(todo)">×</button>
    </template>
  </div>
</template>
