<script setup lang="ts">
import type { CircleColor, Color, ItemTemplate } from '~/types/board'

const COLORS = Object.keys(NOTE_COLORS) as Color[]
const CIRCLE_COLOR_NAMES = Object.keys(CIRCLE_COLORS) as CircleColor[]

const noteColor = ref<Color>('yellow')
const circleColor = ref<CircleColor>('medium')

function onDragStart(event: DragEvent, template: ItemTemplate) {
  event.dataTransfer?.setData(DRAG_TYPE, JSON.stringify(template))
}
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-stretch gap-4 rounded-xl border bg-background p-3 shadow-lg">
    <section class="flex flex-col items-center gap-2">
      <div
        draggable="true"
        title="Post-it aufs Board ziehen"
        class="size-12 shadow-md cursor-grab"
        :class="NOTE_COLORS[noteColor]"
        @dragstart="onDragStart($event, { kind: 'note', color: noteColor })"
      />
      <div class="flex gap-1">
        <button
          v-for="color in COLORS"
          :key="color"
          :title="color"
          class="size-4 rounded-full border"
          :class="[NOTE_COLORS[color], color === noteColor ? 'ring-2 ring-blue-300' : '']"
          @click="noteColor = color"
        />
      </div>
    </section>

    <div class="w-px bg-border" />

    <section class="flex flex-col items-center justify-center gap-2">
      <div
        draggable="true"
        title="Text aufs Board ziehen"
        class="flex h-12 items-center px-2 text-2xl font-medium cursor-grab"
        @dragstart="onDragStart($event, { kind: 'text' })"
      >
        Aa
      </div>
      <span class="text-xs text-muted-foreground">Text</span>
    </section>

    <div class="w-px bg-border" />

    <section class="flex flex-col items-center gap-2">
      <div
        draggable="true"
        title="Kreis aufs Board ziehen"
        class="size-12 rounded-full shadow-md cursor-grab"
        :class="CIRCLE_COLORS[circleColor]"
        @dragstart="onDragStart($event, { kind: 'circle', color: circleColor })"
      />
      <div class="flex gap-1">
        <button
          v-for="color in CIRCLE_COLOR_NAMES"
          :key="color"
          :title="color"
          class="size-4 rounded-full border"
          :class="[CIRCLE_COLORS[color], color === circleColor ? 'ring-2 ring-blue-300' : '']"
          @click="circleColor = color"
        />
      </div>
    </section>
  </div>
</template>
