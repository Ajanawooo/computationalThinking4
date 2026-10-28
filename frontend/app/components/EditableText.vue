<script setup lang="ts">
import type { Note, TextItem } from '~/types/board'

const props = defineProps<{ item: Note | TextItem }>()

const { state, setText, resizeItem, stopEditing } = useBoard()
const editing = computed(() => state.value.editingId === props.item.id)

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

watch(editing, async (value) => {
  if (!value) return
  await nextTick()
  textarea.value?.focus()
  textarea.value?.select()
})

function updateText(event: Event) {
  setText(props.item.id, (event.target as HTMLTextAreaElement).value)
}

// Grows the item to the next grid line when its text no longer fits.
async function fitToContent() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (!element) return
  const needed = Math.max(MIN_ITEM_SIZE, Math.ceil(element.scrollHeight / GRID_SIZE) * GRID_SIZE)
  if (needed > props.item.height) resizeItem(props.item.id, { height: needed })
}

watch(() => [props.item.text, props.item.width, props.item.height, editing.value], fitToContent)
onMounted(fitToContent)
</script>

<template>
  <textarea
    v-if="editing"
    ref="textarea"
    class="size-full p-4 bg-transparent resize-none outline-none"
    :value="item.text"
    @input="updateText"
    @blur="stopEditing"
    @keydown.escape="stopEditing"
  />
  <div v-else ref="content" class="size-full p-4 overflow-hidden whitespace-pre-wrap break-words select-none">
    {{ item.text }}
  </div>
</template>
