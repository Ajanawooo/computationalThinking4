<script setup lang="ts">
import type { BoardItem } from '~/types/board'

type Corner = 'nw' | 'ne' | 'sw' | 'se'
type Mode = 'move' | Corner

const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

const props = defineProps<{ item: BoardItem; keepSquare?: boolean }>()

const { state, moveItem, resizeItem, select } = useBoard()
const scale = inject<Ref<number>>('canvasScale', ref(1))
const selected = computed(() => state.value.selectedId === props.item.id)
const editing = computed(() => state.value.editingId === props.item.id)

// Where the current drag started. Only a gesture helper, the item itself lives in the board state.
let interaction: { mode: Mode; startX: number; startY: number; start: BoardItem } | null = null

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  select(props.item.id)
  if (editing.value) return
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { ...props.item } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

// Resizing from a north or west corner moves the item so the opposite corner stays put.
function nextRect(corner: Corner, start: BoardItem, dx: number, dy: number) {
  let width = Math.max(MIN_ITEM_SIZE, snapToGrid(start.width + (corner.endsWith('e') ? dx : -dx)))
  let height = Math.max(MIN_ITEM_SIZE, snapToGrid(start.height + (corner.startsWith('s') ? dy : -dy)))
  if (props.keepSquare) width = height = Math.max(width, height)
  return {
    width,
    height,
    x: corner.endsWith('w') ? start.x + start.width - width : start.x,
    y: corner.startsWith('n') ? start.y + start.height - height : start.y,
  }
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const { mode, start } = interaction
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  if (mode === 'move') moveItem(props.item.id, snapToGrid(start.x + dx), snapToGrid(start.y + dy))
  else resizeItem(props.item.id, nextRect(mode, start, dx, dy))
}

function onPointerUp() {
  interaction = null
}
</script>

<template>
  <div
    class="absolute touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <slot />

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
