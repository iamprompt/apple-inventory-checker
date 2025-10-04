import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    TELEGRAM_BOT_TOKEN: z.string(),
    TELEGRAM_CHANNEL_CHAT_ID: z.string(),
    TELEGRAM_PRO_MAX_CHANNEL_CHAT_ID: z.string().optional(),
    DB_URL: z.string(),
    APPLE_COOKIES: z.string().optional(),
    HEADLESS_BROWSER: z
      .string()
      .transform((val) => val === 'true')
      .default(true),
    CRON_SCHEDULE: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
