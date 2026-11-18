<script setup lang="ts">
// The start page has no content of its own: it opens the oldest board.
const { boards, loadBoards } = useBoards()
await callOnce('boards', loadBoards)
await navigateTo(`/boards/${boards.value[0]!.id}`, { replace: true })
</script>

<template>
  <div />
</template>
