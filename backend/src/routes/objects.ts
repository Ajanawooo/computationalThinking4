import { Hono } from 'hono'
import { loadObjects, saveObjects } from '../storage'

export const objects = new Hono()

objects.get('/', c => c.json(loadObjects()))

objects.post('/', async (c) => {
  const object = await c.req.json().catch(() => null)
  if (typeof object?.id !== 'string') return c.json({ error: 'id is required' }, 400)

  const all = loadObjects()
  if (all.some(existing => existing.id === object.id)) return c.json({ error: 'id already exists' }, 409)

  saveObjects([...all, object])
  return c.json(object, 201)
})

objects.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const all = loadObjects()
  const object = all.find(existing => existing.id === id)
  if (!object) return c.json({ error: 'not found' }, 404)

  const changes = await c.req.json().catch(() => ({}))
  const updated = { ...object, ...changes, id }
  saveObjects(all.map(existing => (existing.id === id ? updated : existing)))
  return c.json(updated)
})

objects.delete('/:id', (c) => {
  const id = c.req.param('id')
  const all = loadObjects()
  if (!all.some(existing => existing.id === id)) return c.json({ error: 'not found' }, 404)

  saveObjects(all.filter(existing => existing.id !== id))
  return c.body(null, 204)
})
