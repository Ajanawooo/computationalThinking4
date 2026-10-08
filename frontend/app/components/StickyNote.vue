<script setup lang="ts">
import type { Note } from '~/types/note'

type Corner = 'nw' | 'ne' | 'sw' | 'se'
type Mode = 'move' | Corner

const MIN_SIZE = GRID_SIZE * 3
const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

const note = defineModel<Note>({ required: true })
defineProps<{ selected: boolean }>()
const emit = defineEmits<{ select: [] }>()

const scale = inject<Ref<number>>('canvasScale', ref(1))
const editing = ref(false)
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

let interaction: { mode: Mode; startX: number; startY: number; start: Note } | null = null

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  emit('select')
  if (editing.value) return
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { ...note.value } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

// Resizing from a north or west corner moves the note so the opposite corner stays put.
function nextRect(mode: Mode, start: Note, dx: number, dy: number): Partial<Note> {
  if (mode === 'move') return { x: snapToGrid(start.x + dx), y: snapToGrid(start.y + dy) }
  const width = Math.max(MIN_SIZE, snapToGrid(start.width + (mode.endsWith('e') ? dx : -dx)))
  const height = Math.max(MIN_SIZE, snapToGrid(start.height + (mode.startsWith('s') ? dy : -dy)))
  return {
    width,
    height,
    x: mode.endsWith('w') ? start.x + start.width - width : start.x,
    y: mode.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  note.value = { ...note.value, ...nextRect(interaction.mode, interaction.start, dx, dy) }
}

function onPointerUp() {
  interaction = null
}

async function startEditing() {
  editing.value = true
  await nextTick()
  textarea.value?.focus()
  textarea.value?.select()
}

function stopEditing() {
  editing.value = false
}

function updateText(event: Event) {
  note.value = { ...note.value, text: (event.target as HTMLTextAreaElement).value }
}

// Grows the note to the next grid line when its text no longer fits.
async function fitToContent() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (!element) return
  const needed = Math.max(MIN_SIZE, Math.ceil(element.scrollHeight / GRID_SIZE) * GRID_SIZE)
  if (needed > note.value.height) note.value = { ...note.value, height: needed }
}

watch(() => [note.value.text, note.value.width, note.value.height, editing.value], fitToContent)
onMounted(fitToContent)
</script>

<template>
  <div
    class="absolute bg-yellow-200 shadow-md text-lg touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, width: `${note.width}px`, height: `${note.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @dblclick="startEditing"
  >
    <textarea
      v-if="editing"
      ref="textarea"
      class="size-full p-4 bg-transparent resize-none outline-none"
      :value="note.text"
      @input="updateText"
      @blur="stopEditing"
      @keydown.escape="stopEditing"
    />
    <div v-else ref="content" class="size-full p-4 overflow-hidden whitespace-pre-wrap break-words select-none">
      {{ note.text }}
    </div>

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="startInteraction($event, corner)"
      />
    </template>
  </div>
</template>
