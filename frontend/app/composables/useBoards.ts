import type { Board } from '~/types/board'

// The list of all boards, oldest first. New boards are added at the end.
export function useBoards() {
  const api = $fetch.create({ baseURL: useRuntimeConfig().public.apiBase })
  const boards = useState<Board[]>('boards', () => [])

  async function loadBoards() {
    boards.value = await api<Board[]>('/boards')
  }

  async function createBoard(name: string) {
    const board = await api<Board>('/boards', { method: 'POST', body: { name } })
    boards.value = [...boards.value, board]
    return board
  }

  return { boards: readonly(boards), loadBoards, createBoard }
}
