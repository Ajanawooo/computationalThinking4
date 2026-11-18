<script setup lang="ts">
import { Menu, PanelLeftClose, Plus } from '@lucide/vue'
import { Button } from '@/components/ui/button'

defineProps<{ currentId: string }>()

const { boards } = useBoards()
const open = ref(true)
const creating = ref(false)
</script>

<template>
  <Button
    v-if="!open"
    variant="outline"
    size="icon-lg"
    class="fixed top-4 left-4 bg-white shadow-md"
    aria-label="Boards einblenden"
    @click="open = true"
  >
    <Menu />
  </Button>

  <aside v-else class="fixed inset-y-0 left-0 flex w-60 flex-col border-r bg-white shadow-xl">
    <div class="flex items-center justify-between py-3 pr-2 pl-4">
      <h2 class="font-semibold">Boards</h2>
      <Button variant="ghost" size="icon-sm" aria-label="Boards ausblenden" @click="open = false">
        <PanelLeftClose />
      </Button>
    </div>

    <nav class="flex-1 overflow-y-auto px-2">
      <NuxtLink
        v-for="board in boards"
        :key="board.id"
        :to="`/boards/${board.id}`"
        class="block truncate rounded-lg px-3 py-2 text-sm hover:bg-muted"
        :class="{ 'bg-muted font-medium': board.id === currentId }"
      >
        {{ board.name }}
      </NuxtLink>
    </nav>

    <div class="border-t p-2">
      <Button variant="ghost" class="w-full justify-start" @click="creating = true">
        <Plus /> Neues Board
      </Button>
    </div>
  </aside>

  <NewBoardDialog v-model:open="creating" />
</template>
