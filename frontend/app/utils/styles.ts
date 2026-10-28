import type { BorderWidth, FontSize } from '~/types/board'

export const FONT_SIZES: Record<FontSize, string> = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

export const BORDER_WIDTHS: Record<BorderWidth, string> = {
  thin: 'border-2',
  medium: 'border-4',
  thick: 'border-8',
}
