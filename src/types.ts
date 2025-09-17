import type { RequestIdVariables } from 'hono/request-id'

export type App = {
  Bindings: Env
  Variables: RequestIdVariables
}
