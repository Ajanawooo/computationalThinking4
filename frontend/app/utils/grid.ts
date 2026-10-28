export const GRID_SIZE = 24

export function snapToGrid(value: number) {
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

export const MIN_ITEM_SIZE = GRID_SIZE * 3
