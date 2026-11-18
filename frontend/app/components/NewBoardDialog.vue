<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const open = defineModel<boolean>('open', { required: true })

const { createBoard } = useBoards()
const name = ref('')
const saving = ref(false)

// A board needs a name right away, because it cannot be renamed later. The new board opens at once.
async function submit() {
  if (!name.value.trim() || saving.value) return
  saving.value = true
  const board = await createBoard(name.value.trim())
  saving.value = false
  open.value = false
  name.value = ''
  await navigateTo(`/boards/${board.id}`)
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <form class="grid gap-4" @submit.prevent="submit">
        <DialogHeader>
          <DialogTitle>Neues Board</DialogTitle>
          <DialogDescription>Wie soll das Board heißen?</DialogDescription>
        </DialogHeader>
        <Input v-model="name" placeholder="Name des Boards" />
        <DialogFooter>
          <Button type="submit" :disabled="!name.trim() || saving">Anlegen</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
