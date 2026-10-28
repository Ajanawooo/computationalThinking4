import type { Item } from '~/types/board'

interface Option {
  value: string
  label: string
}

export type EditorConfig = { attribute: string; label: string } & (
  | { editor: 'color'; colors: Record<string, string> }
  | { editor: 'choice'; options: Option[] }
  | { editor: 'toggle'; icon: string }
)

const FONT_SIZE_OPTIONS: Option[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
]

const BORDER_OPTIONS: Option[] = [
  { value: 'thin', label: 'dünn' },
  { value: 'medium', label: 'mittel' },
  { value: 'thick', label: 'dick' },
]

const FONT_SIZE: EditorConfig = { attribute: 'fontSize', label: 'Textgröße', editor: 'choice', options: FONT_SIZE_OPTIONS }
const BOLD: EditorConfig = { attribute: 'bold', label: 'Fett', editor: 'toggle', icon: 'B' }

// Which editor changes which attribute, per kind of item.
export const ITEM_EDITORS: Record<Item['kind'], EditorConfig[]> = {
  note: [{ attribute: 'color', label: 'Farbe', editor: 'color', colors: NOTE_COLORS }, FONT_SIZE, BOLD],
  text: [FONT_SIZE, BOLD],
  circle: [
    { attribute: 'color', label: 'Farbe', editor: 'color', colors: CIRCLE_COLORS },
    { attribute: 'border', label: 'Rand', editor: 'toggle', icon: '○' },
    { attribute: 'borderWidth', label: 'Randstärke', editor: 'choice', options: BORDER_OPTIONS },
  ],
}
