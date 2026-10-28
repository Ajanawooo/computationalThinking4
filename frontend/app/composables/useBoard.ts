import type { BoardItem, Item, ItemTemplate } from '~/types/board'

interface BoardState {
  items: Item[]
  selectedId: string | null
  editingId: string | null
  clipboard: Item | null
}

type Rect = Omit<BoardItem, 'id'>

// The single source of truth for the board. Components only read `state`
// and change it through the functions below.
export function useBoard() {
  const state = useState<BoardState>('board', () => ({
    items: [
      {
        id: 'welcome',
        kind: 'note',
        color: 'yellow',
        x: 120,
        y: 120,
        width: 192,
        height: 192,
        text: 'Hello, board!',
        fontSize: 'md',
        bold: false,
      },
    ],
    selectedId: null,
    editingId: null,
    clipboard: null,
  }))

  // Replaces the item with a new copy instead of mutating it.
  function update(id: string, patch: object) {
    state.value.items = state.value.items.map((item) => (item.id === id ? ({ ...item, ...patch } as Item) : item))
  }

  function insert(item: Item) {
    state.value.items = [...state.value.items, item]
    select(item.id)
  }

  // Inserts a copy of the item, shifted by one grid step, and returns it.
  function insertCopy(source: Item) {
    const copy = { ...source, id: crypto.randomUUID(), x: source.x + GRID_SIZE, y: source.y + GRID_SIZE }
    insert(copy)
    return copy
  }

  function findItem(id: string) {
    return state.value.items.find((item) => item.id === id)
  }

  function addItem(template: ItemTemplate, x: number, y: number) {
    insert(createItem(template, x, y))
  }

  function deleteItem(id: string) {
    state.value.items = state.value.items.filter((item) => item.id !== id)
    if (state.value.selectedId === id) select(null)
  }

  function duplicateItem(id: string) {
    const item = findItem(id)
    if (item) insertCopy(item)
  }

  function copyItem(id: string) {
    const item = findItem(id)
    if (item) state.value.clipboard = { ...item }
  }

  function cutItem(id: string) {
    copyItem(id)
    deleteItem(id)
  }

  // Each paste moves the clipboard along, so repeated pastes cascade.
  function pasteItem() {
    if (state.value.clipboard) state.value.clipboard = insertCopy(state.value.clipboard)
  }

  function moveItem(id: string, x: number, y: number) {
    update(id, { x, y })
  }

  function resizeItem(id: string, rect: Partial<Rect>) {
    update(id, rect)
  }

  function setText(id: string, text: string) {
    update(id, { text })
  }

  function setAttribute(id: string, attribute: string, value: unknown) {
    update(id, { [attribute]: value })
  }

  function select(id: string | null) {
    if (state.value.editingId !== id) state.value.editingId = null
    state.value.selectedId = id
  }

  function startEditing(id: string) {
    state.value.selectedId = id
    state.value.editingId = id
  }

  function stopEditing() {
    state.value.editingId = null
  }

  return {
    state: readonly(state),
    addItem,
    deleteItem,
    duplicateItem,
    copyItem,
    cutItem,
    pasteItem,
    moveItem,
    resizeItem,
    setText,
    setAttribute,
    select,
    startEditing,
    stopEditing,
  }
}
