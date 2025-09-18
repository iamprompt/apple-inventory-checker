import type { HttpBindings } from '@hono/node-server'
import type { RequestIdVariables } from 'hono/request-id'

export type App = {
  Bindings: HttpBindings
  Variables: RequestIdVariables
}
