<script setup lang="ts">
import type { Circle } from '~/types/board'

defineProps<{ item: Circle }>()
</script>

<template>
  <BoardItemFrame
    :item="item"
    keep-square
    class="rounded-full shadow-md"
    :class="[CIRCLE_COLORS[item.color], item.border ? [BORDER_WIDTHS[item.borderWidth], 'border-foreground'] : '']"
  />
</template>
