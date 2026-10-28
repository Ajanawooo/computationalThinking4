<script setup lang="ts">
defineProps<{ options: { value: string; label: string }[]; value: string }>()
const emit = defineEmits<{ change: [value: string] }>()
</script>

<template>
  <div class="flex gap-0.5">
    <button
      v-for="option in options"
      :key="option.value"
      class="rounded px-2 py-0.5 text-sm"
      :class="option.value === value ? 'bg-accent font-medium' : 'hover:bg-muted'"
      @click="emit('change', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
