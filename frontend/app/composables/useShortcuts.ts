// Board shortcuts: ⌘/Ctrl + C, X, V, D, Backspace/Delete and Escape.
export function useShortcuts() {
  const { state, copyItem, cutItem, pasteItem, duplicateItem, deleteItem, select } = useBoard()

  function onKeyDown(event: KeyboardEvent) {
    // While typing, keys belong to the text field.
    if (state.value.editingId) return
    if (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable]')) return

    const id = state.value.selectedId
    if (event.metaKey || event.ctrlKey) {
      const key = event.key.toLowerCase()
      if (key === 'v') pasteItem()
      if (!id) return
      if (key === 'c') copyItem(id)
      if (key === 'x') cutItem(id)
      if (key === 'd') {
        event.preventDefault()
        duplicateItem(id)
      }
      return
    }

    if (!id) return
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      deleteItem(id)
    }
    if (event.key === 'Escape') select(null)
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}
