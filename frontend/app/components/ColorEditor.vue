<script setup lang="ts">
defineProps<{ colors: Record<string, string>; value: string }>()
const emit = defineEmits<{ change: [value: string] }>()
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="(classes, color) in colors"
      :key="color"
      :title="color"
      class="size-5 rounded-full border"
      :class="[classes, color === value ? 'ring-2 ring-blue-300' : '']"
      @click="emit('change', color)"
    />
  </div>
</template>
