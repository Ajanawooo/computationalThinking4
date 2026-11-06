import type { BoardObject, ObjectTemplate, Rect, StyleChanges, TextObject } from '~/types/canvas-object'

type Changes = Partial<Rect> & StyleChanges & { text?: string }

const API = 'http://localhost:3001/objects'
const MOVE_DELAY_MS = 300

// Moves are sent only after the pointer has paused, so dragging does not send one request per step.
const moveTimers = new Map<string, ReturnType<typeof setTimeout>>()

const TEXT_DEFAULTS = { text: '', fontSize: FONT_SIZES.M, bold: false }

// Starting attributes of a new object, per variant. Only variants with text get text attributes.
const DEFAULTS: Record<BoardObject['type'], Rect & Partial<TextObject>> = {
  'sticky-note': { x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8, ...TEXT_DEFAULTS },
  'text': { x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3, ...TEXT_DEFAULTS },
  'circle': { x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 },
}

// The board state is the single source of truth for which objects exist and what they look like.
// Components only read it; every change goes through one of the functions below.
// Each change updates the local state first and then tells the backend.
export function useBoard() {
  const objects = useState<BoardObject[]>('objects', () => [])

  // Loads the board once when the page starts, no matter how many components use the board.
  if (import.meta.client) {
    callOnce('board', async () => {
      objects.value = await $fetch<BoardObject[]>(API)
    })
  }

  function add(object: BoardObject) {
    objects.value = [...objects.value, object]
    $fetch(API, { method: 'POST', body: object })
    return object.id
  }

  function addObject(template: ObjectTemplate, centerX: number, centerY: number) {
    const defaults = DEFAULTS[template.type]
    const id = crypto.randomUUID()
    const x = snapToGrid(centerX - defaults.width / 2)
    const y = snapToGrid(centerY - defaults.height / 2)
    return add({ ...defaults, ...template, id, x, y } as BoardObject)
  }

  // Works for every variant: the copy keeps all attributes except the id.
  function addCopy(source: BoardObject) {
    return add({ ...source, id: crypto.randomUUID() })
  }

  function removeObject(id: string) {
    objects.value = objects.value.filter(object => object.id !== id)
    clearTimeout(moveTimers.get(id))
    moveTimers.delete(id)
    $fetch(`${API}/${id}`, { method: 'DELETE' })
  }

  function applyChanges(id: string, changes: Changes) {
    objects.value = objects.value.map(object => (object.id === id ? ({ ...object, ...changes } as BoardObject) : object))
  }

  function updateObject(id: string, changes: Changes) {
    applyChanges(id, changes)
    $fetch(`${API}/${id}`, { method: 'PATCH', body: changes })
  }

  function moveObject(id: string, x: number, y: number) {
    applyChanges(id, { x, y })
    clearTimeout(moveTimers.get(id))
    moveTimers.set(id, setTimeout(() => {
      moveTimers.delete(id)
      $fetch(`${API}/${id}`, { method: 'PATCH', body: { x, y } })
    }, MOVE_DELAY_MS))
  }

  function resizeObject(id: string, rect: Rect) {
    updateObject(id, rect)
  }

  function updateText(id: string, text: string) {
    updateObject(id, { text })
  }

  function updateStyle(id: string, changes: StyleChanges) {
    updateObject(id, changes)
  }

  return { objects: readonly(objects), addObject, addCopy, removeObject, moveObject, resizeObject, updateText, updateStyle }
}
