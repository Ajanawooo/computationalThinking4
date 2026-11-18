import { Hono } from 'hono'
import { insertBoard, insertObject, listBoards, listObjects } from './storage.js'

// REST routes for boards and for the objects on one board.
export const boards = new Hono()

boards.get('/', async c => c.json(await listBoards()))

boards.post('/', async (c) => {
  const { name } = await c.req.json()
  if (typeof name !== 'string' || !name.trim()) return c.json({ error: 'Board needs a name' }, 400)
  return c.json(await insertBoard(name.trim()), 201)
})

boards.get('/:boardId/objects', async c => c.json(await listObjects(c.req.param('boardId'))))

boards.post('/:boardId/objects', async (c) => {
  const object = await c.req.json()
  if (typeof object.id !== 'string') return c.json({ error: 'Object needs an id' }, 400)
  const result = await insertObject(c.req.param('boardId'), object)
  if (result === 'duplicate') return c.json({ error: 'An object with this id already exists' }, 409)
  if (result === 'no-board') return c.json({ error: 'Board not found' }, 404)
  return c.json(result, 201)
})
