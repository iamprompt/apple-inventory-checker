import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    TELEGRAM_BOT_TOKEN: z.string(),
    TELEGRAM_CHANNEL_CHAT_ID: z.string(),
    TELEGRAM_PRO_MAX_CHANNEL_CHAT_ID: z.string().optional(),
    DB_URL: z.string(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
