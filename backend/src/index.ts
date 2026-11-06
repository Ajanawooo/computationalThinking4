import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { objects } from './routes/objects'

const app = new Hono()
app.use('*', cors({ origin: 'http://localhost:3000' }))
app.route('/objects', objects)

serve({ fetch: app.fetch, port: 3001 }, info => console.log(`Backend läuft auf http://localhost:${info.port}`))
