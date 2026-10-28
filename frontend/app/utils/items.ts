import type { Item, ItemTemplate } from '~/types/board'

export const DRAG_TYPE = 'application/x-board-item'

// Creates a new item centered on the given board position.
export function createItem(template: ItemTemplate, x: number, y: number): Item {
  const id = crypto.randomUUID()
  const rect = (width: number, height: number) => ({
    id,
    width,
    height,
    x: snapToGrid(x - width / 2),
    y: snapToGrid(y - height / 2),
  })
  if (template.kind === 'text') return { ...rect(240, 72), kind: 'text', text: 'Text', fontSize: 'md', bold: false }
  if (template.kind === 'note') return { ...rect(192, 192), kind: 'note', color: template.color, text: '', fontSize: 'md', bold: false }
  return { ...rect(144, 144), kind: 'circle', color: template.color, border: false, borderWidth: 'medium' }
}
