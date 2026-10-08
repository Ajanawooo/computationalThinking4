<script setup lang="ts">
import type { Note } from '~/types/note'

const note = ref<Note>({ x: 120, y: 120, width: 192, height: 192, text: 'Hello, board!' })
const selected = ref(false)
</script>

<template>
  <InfiniteCanvas @pointerdown="selected = false">
    <StickyNote v-model="note" :selected="selected" @select="selected = true" />
  </InfiniteCanvas>
</template>
