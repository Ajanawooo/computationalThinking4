<script setup lang="ts">
import type { TextItem } from '~/types/board'

defineProps<{ item: TextItem }>()

const { startEditing } = useBoard()
</script>

<template>
  <BoardItemFrame :item="item" :class="[FONT_SIZES[item.fontSize], item.bold ? 'font-bold' : '']" @dblclick="startEditing(item.id)">
    <EditableText :item="item" />
  </BoardItemFrame>
</template>
