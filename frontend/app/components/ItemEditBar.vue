<script setup lang="ts">
const { state, setAttribute } = useBoard()
const scale = inject<Ref<number>>('canvasScale', ref(1))

const item = computed(() => state.value.items.find((item) => item.id === state.value.selectedId))
const editors = computed(() => (item.value ? ITEM_EDITORS[item.value.kind] : []))

function valueOf(attribute: string) {
  return (item.value as Record<string, unknown> | undefined)?.[attribute]
}
</script>

<template>
  <!-- Anchored at the top center of the item; counter-scaled so it keeps its size when zooming. -->
  <div
    v-if="item"
    class="absolute origin-top-left"
    :style="{ left: `${item.x + item.width / 2}px`, top: `${item.y}px`, transform: `scale(${1 / scale})` }"
    @pointerdown.stop
  >
    <div
      class="absolute bottom-3 left-0 -translate-x-1/2 flex items-center divide-x whitespace-nowrap rounded-lg border bg-background py-1 shadow-md"
    >
      <template v-for="config in editors" :key="config.attribute">
        <ColorEditor
          v-if="config.editor === 'color'"
          class="px-2"
          :title="config.label"
          :colors="config.colors"
          :value="String(valueOf(config.attribute))"
          @change="setAttribute(item.id, config.attribute, $event)"
        />
        <ChoiceEditor
          v-else-if="config.editor === 'choice'"
          class="px-2"
          :title="config.label"
          :options="config.options"
          :value="String(valueOf(config.attribute))"
          @change="setAttribute(item.id, config.attribute, $event)"
        />
        <ToggleEditor
          v-else
          class="px-2"
          :title="config.label"
          :icon="config.icon"
          :value="Boolean(valueOf(config.attribute))"
          @change="setAttribute(item.id, config.attribute, $event)"
        />
      </template>
    </div>
  </div>
</template>
