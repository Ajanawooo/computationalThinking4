import type { CircleColor, Color } from '~/types/board'

export const NOTE_COLORS: Record<Color, string> = {
  yellow: 'bg-yellow-200',
  pink: 'bg-pink-200',
  blue: 'bg-sky-200',
  green: 'bg-green-200',
  orange: 'bg-orange-200',
}

export const CIRCLE_COLORS: Record<CircleColor, string> = {
  pale: 'bg-sky-200',
  light: 'bg-sky-400',
  medium: 'bg-blue-500',
  dark: 'bg-blue-700',
  navy: 'bg-blue-900',
}
