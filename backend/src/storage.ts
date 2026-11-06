import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

export type StoredObject = { id: string, [key: string]: unknown }

// The only place that knows where the board is stored.
const DATA_DIR = new URL('../data/', import.meta.url)
const BOARD_FILE = new URL('board.json', DATA_DIR)

export function loadObjects(): StoredObject[] {
  if (!existsSync(BOARD_FILE)) return []
  return JSON.parse(readFileSync(BOARD_FILE, 'utf8'))
}

export function saveObjects(objects: StoredObject[]) {
  mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(BOARD_FILE, JSON.stringify(objects, null, 2))
}
