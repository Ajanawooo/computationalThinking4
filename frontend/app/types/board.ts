export type Color = 'yellow' | 'pink' | 'blue' | 'green' | 'orange'
export type CircleColor = 'pale' | 'light' | 'medium' | 'dark' | 'navy'
export type FontSize = 'sm' | 'md' | 'lg'
export type BorderWidth = 'thin' | 'medium' | 'thick'

export interface BoardItem {
  id: string
  x: number
  y: number
  width: number
  height: number
}

export interface Note extends BoardItem {
  kind: 'note'
  text: string
  color: Color
  fontSize: FontSize
  bold: boolean
}

export interface TextItem extends BoardItem {
  kind: 'text'
  text: string
  fontSize: FontSize
  bold: boolean
}

export interface Circle extends BoardItem {
  kind: 'circle'
  color: CircleColor
  border: boolean
  borderWidth: BorderWidth
}

export type Item = Note | TextItem | Circle

// What the toolbar hands over when an item is dragged onto the board.
export type ItemTemplate =
  | { kind: 'text' }
  | { kind: 'note'; color: Color }
  | { kind: 'circle'; color: CircleColor }
