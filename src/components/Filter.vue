<script setup lang="ts">
defineProps(["state"]);
defineEmits(["updateState"]);
</script>

<template>
  <nav class="filter" data-cy="Filter">
    <a
      href="#/"
      data-cy="FilterLinkAll"
      class="filter__link"
      :class="{ selected: state === 'All' }"
      @click="$emit('updateState', 'All')"
      >All</a
    >
    <a
      href="#/active"
      data-cy="FilterLinkActive"
      class="filter__link"
      :class="{ selected: state === 'Active' }"
      @click="$emit('updateState', 'Active')"
      >Active</a
    >
    <a
      href="#/completed"
      data-cy="FilterLinkCompleted"
      class="filter__link"
      :class="{ selected: state === 'Completed' }"
      @click="$emit('updateState', 'Completed')"
      >Completed</a
    >
  </nav>
</template>
