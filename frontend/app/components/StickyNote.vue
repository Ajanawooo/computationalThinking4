<script setup lang="ts">
import type { Note } from '~/types/board'

defineProps<{ item: Note }>()

const { startEditing } = useBoard()
</script>

<template>
  <BoardItemFrame :item="item" class="shadow-md"
    :class="[NOTE_COLORS[item.color], FONT_SIZES[item.fontSize], item.bold ? 'font-bold' : '']" @dblclick="startEditing(item.id)">
    <EditableText :item="item" />
  </BoardItemFrame>
</template>
