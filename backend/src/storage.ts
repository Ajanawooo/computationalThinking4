import { existsSync } from 'node:fs'

// The backend treats objects as plain JSON; it only relies on every object having an id.
export type BoardObject = { id: string } & Record<string, unknown>
export type Board = { id: string; name: string }

// Boards and their objects live in the Supabase tables "boards" and "objects", reached through the REST API.
// This module is the only place that knows about the database.
const ENV_FILE = new URL('../.env', import.meta.url).pathname
if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE)

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set in backend/.env')
}

type Row = Record<string, unknown>

// Postgres error codes the routes care about.
const UNIQUE_VIOLATION = '23505'
const FOREIGN_KEY_VIOLATION = '23503'

class DatabaseError extends Error {
  constructor(readonly code: string, message: string) {
    super(message)
  }
}

// The frontend says fontSize, the table says font_size.
function toRow({ fontSize, ...rest }: Row): Row {
  return fontSize === undefined ? rest : { ...rest, font_size: fontSize }
}

// Leave out database-only columns and empty ones, so objects look as they did in the JSON file.
function fromRow({ font_size, created_at, board_id, ...rest }: Row): BoardObject {
  const object = { ...rest, fontSize: font_size }
  return Object.fromEntries(Object.entries(object).filter(([, value]) => value !== null)) as BoardObject
}

async function request(path: string, init: RequestInit = {}): Promise<Row[]> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: SUPABASE_SECRET_KEY!, 'Content-Type': 'application/json', Prefer: 'return=representation' },
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new DatabaseError(body.code ?? '', `Supabase ${response.status}: ${body.message ?? response.statusText}`)
  }
  return response.json()
}

const byId = (id: string) => `id=eq.${encodeURIComponent(id)}`

export async function listBoards() {
  return (await request('boards?select=id,name&order=created_at.asc')) as Board[]
}

export async function insertBoard(name: string) {
  const [board] = await request('boards?select=id,name', { method: 'POST', body: JSON.stringify({ name }) })
  return board as Board
}

export async function listObjects(boardId: string) {
  const rows = await request(`objects?select=*&board_id=eq.${encodeURIComponent(boardId)}&order=created_at.asc`)
  return rows.map(fromRow)
}

// Returns "duplicate" if the id is taken and "no-board" if the board does not exist.
export async function insertObject(boardId: string, object: BoardObject) {
  try {
    const [inserted] = await request('objects', { method: 'POST', body: JSON.stringify({ ...toRow(object), board_id: boardId }) })
    return fromRow(inserted)
  }
  catch (error) {
    if (error instanceof DatabaseError && error.code === UNIQUE_VIOLATION) return 'duplicate'
    if (error instanceof DatabaseError && error.code === FOREIGN_KEY_VIOLATION) return 'no-board'
    throw error
  }
}

export async function updateObject(id: string, changes: Record<string, unknown>) {
  const { id: _id, board_id: _boardId, ...rest } = changes
  const [updated] = await request(`objects?${byId(id)}`, { method: 'PATCH', body: JSON.stringify(toRow(rest)) })
  return updated && fromRow(updated)
}

export async function deleteObject(id: string) {
  const deleted = await request(`objects?${byId(id)}`, { method: 'DELETE' })
  return deleted.length > 0
}
