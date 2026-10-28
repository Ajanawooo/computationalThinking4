<script setup lang="ts">
defineProps<{ icon: string; value: boolean }>()
const emit = defineEmits<{ change: [value: boolean] }>()
</script>

<template>
  <div>
    <button
      class="size-7 rounded text-sm font-bold"
      :class="value ? 'bg-accent' : 'hover:bg-muted'"
      @click="emit('change', !value)"
    >
      {{ icon }}
    </button>
  </div>
</template>
