<script setup lang="ts">
const { state, addItem, select } = useBoard()
useShortcuts()
</script>

<template>
  <InfiniteCanvas @pointerdown="select(null)" @drop-item="addItem">
    <template v-for="item in state.items" :key="item.id">
      <StickyNote v-if="item.kind === 'note'" :item="item" />
      <TextBox v-else-if="item.kind === 'text'" :item="item" />
      <CircleShape v-else :item="item" />
    </template>
    <ItemEditBar />
  </InfiniteCanvas>
  <BoardToolbar />
</template>
