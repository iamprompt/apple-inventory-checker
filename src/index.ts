import { app } from './fetch'
import { scheduled } from './scheduled'

export default {
  fetch: app.fetch,
  scheduled: scheduled,
} satisfies ExportedHandler<Env>
